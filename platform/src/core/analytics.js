import { all, get } from '../db/index.js';
import { adPerformance, adSeries, audienceInfluence, platformComparison } from '../channels/ads/insights.js';
import { eventSeries, topPages } from './events.js';

/** Everything the console overview needs, in one query pass. */
export function overview({ days = 30 } = {}) {
  const window = `-${Number(days)} days`;

  const contacts = get(`
    SELECT COUNT(*) AS total,
           SUM(status = 'active') AS active,
           SUM(status = 'unsubscribed') AS unsubscribed,
           SUM(grade = 'A') AS grade_a,
           SUM(grade = 'B') AS grade_b,
           SUM(lifecycle_stage = 'mql') AS mqls,
           SUM(lifecycle_stage = 'customer') AS customers,
           SUM(last_seen_at >= datetime('now', ?)) AS seen_recently,
           SUM(created_at >= datetime('now', ?)) AS new_contacts
    FROM contacts`, window, window) || {};

  const engagement = get(`
    SELECT COUNT(*) AS events,
           COUNT(DISTINCT contact_id) AS engaged_contacts,
           COUNT(DISTINCT CASE WHEN contact_id IS NULL THEN visitor_id END) AS anonymous_visitors,
           SUM(channel = 'web') AS web_events,
           SUM(channel = 'email') AS email_events,
           SUM(channel = 'ads') AS ad_events,
           SUM(platform = 'linkedin') AS linkedin_events,
           SUM(platform = 'meta') AS meta_events
    FROM events WHERE occurred_at >= datetime('now', ?)`, window) || {};

  const email = get(`
    SELECT COUNT(*) AS sends,
           SUM(status = 'sent') AS sent,
           SUM(opened_at IS NOT NULL) AS opened,
           SUM(first_click_at IS NOT NULL) AS clicked,
           SUM(status = 'bounced') AS bounced
    FROM sends WHERE queued_at >= datetime('now', ?)`, window) || {};

  const ads = get(`
    SELECT COALESCE(SUM(impressions),0) AS impressions,
           COALESCE(SUM(clicks),0) AS clicks,
           COALESCE(SUM(spend),0) AS spend,
           COALESCE(SUM(leads),0) AS leads
    FROM ad_metrics WHERE date >= date('now', ?)`, window) || {};

  const audiences = get(`
    SELECT COUNT(*) AS total,
           COALESCE(SUM(member_count),0) AS members,
           COALESCE(SUM(matched_count),0) AS matched
    FROM ad_audiences`) || {};

  const sent = Number(email.sent || 0);
  const impressions = Number(ads.impressions || 0);
  const spend = Number(ads.spend || 0);

  return {
    window_days: Number(days),
    contacts: {
      total: n(contacts.total), active: n(contacts.active), unsubscribed: n(contacts.unsubscribed),
      grade_a: n(contacts.grade_a), grade_b: n(contacts.grade_b),
      mqls: n(contacts.mqls), customers: n(contacts.customers),
      seen_recently: n(contacts.seen_recently), new_contacts: n(contacts.new_contacts),
    },
    engagement: {
      events: n(engagement.events),
      engaged_contacts: n(engagement.engaged_contacts),
      anonymous_visitors: n(engagement.anonymous_visitors),
      web_events: n(engagement.web_events),
      email_events: n(engagement.email_events),
      ad_events: n(engagement.ad_events),
      // The number that says whether the tracking is doing its job.
      identification_rate: (n(engagement.engaged_contacts) + n(engagement.anonymous_visitors))
        ? Math.round((n(engagement.engaged_contacts) / (n(engagement.engaged_contacts) + n(engagement.anonymous_visitors))) * 1000) / 10
        : 0,
    },
    email: {
      sends: n(email.sends), sent, opened: n(email.opened), clicked: n(email.clicked), bounced: n(email.bounced),
      open_rate: sent ? Math.round((n(email.opened) / sent) * 1000) / 10 : 0,
      click_rate: sent ? Math.round((n(email.clicked) / sent) * 1000) / 10 : 0,
    },
    ads: {
      impressions, clicks: n(ads.clicks), spend: Math.round(spend * 100) / 100, leads: n(ads.leads),
      ctr: impressions ? Math.round((n(ads.clicks) / impressions) * 10000) / 100 : 0,
      cpc: n(ads.clicks) ? Math.round((spend / n(ads.clicks)) * 100) / 100 : 0,
    },
    audiences: { total: n(audiences.total), members: n(audiences.members), matched: n(audiences.matched) },
    funnel: funnel({ days }),
  };
}

const n = (v) => Number(v || 0);

/**
 * The contact-based funnel.
 *
 * Every stage is computed as a subset of the one above it, so the counts are
 * monotonic and the step percentages mean what they look like they mean. A
 * funnel whose stages merely sit side by side can report "133% of the previous
 * stage", which is not a funnel — it is two unrelated numbers stacked.
 */
export function funnel({ days = 30 } = {}) {
  const w = `-${Number(days)} days`;
  const ENGAGE_TYPES = "('email_open','email_click','ad_click','page_view','ad_lead_form','form_submit','demo_request')";

  const row = get(
    `WITH reached AS (
        -- Everyone we deliberately put in front of: advertised to, or mailed.
        SELECT DISTINCT contact_id AS id FROM ad_audience_members WHERE state = 'pushed'
        UNION
        SELECT DISTINCT contact_id FROM sends WHERE status = 'sent' AND sent_at >= datetime('now', ?)
     ),
     engaged AS (
        SELECT DISTINCT e.contact_id AS id FROM events e
        JOIN reached r ON r.id = e.contact_id
        WHERE e.occurred_at >= datetime('now', ?) AND e.type IN ${ENGAGE_TYPES}
     ),
     visited AS (
        SELECT DISTINCT e.contact_id AS id FROM events e
        JOIN engaged g ON g.id = e.contact_id
        WHERE e.channel = 'web' AND e.occurred_at >= datetime('now', ?)
     ),
     intent AS (
        SELECT DISTINCT e.contact_id AS id FROM events e
        JOIN visited v ON v.id = e.contact_id
        WHERE e.occurred_at >= datetime('now', ?)
          AND (e.type IN ('demo_request','form_submit','ad_lead_form','signup')
               OR (e.type = 'page_view' AND (e.path LIKE '%pricing%' OR e.path LIKE '%demo%' OR e.path LIKE '%contact%')))
     ),
     qualified AS (
        SELECT c.id FROM contacts c JOIN intent i ON i.id = c.id
        WHERE c.lifecycle_stage IN ('mql','sql','opportunity','customer')
     )
     SELECT (SELECT COUNT(*) FROM reached)   AS reached,
            (SELECT COUNT(*) FROM engaged)   AS engaged,
            (SELECT COUNT(*) FROM visited)   AS visited,
            (SELECT COUNT(*) FROM intent)    AS intent,
            (SELECT COUNT(*) FROM qualified) AS qualified`,
    w, w, w, w,
  ) || {};

  return [
    { stage: 'Reached (advertised to or mailed)', contacts: n(row.reached) },
    { stage: 'Engaged (opened, clicked or visited)', contacts: n(row.engaged) },
    { stage: 'Visited the site', contacts: n(row.visited) },
    { stage: 'High intent (pricing, demo, form, lead)', contacts: n(row.intent) },
    { stage: 'MQL or beyond', contacts: n(row.qualified) },
  ];
}

/** Contacts to call today: hottest, most recently active. */
export function hotList({ limit = 20, minScore = 55 } = {}) {
  return all(
    `SELECT c.*,
            (SELECT MAX(occurred_at) FROM events e WHERE e.contact_id = c.id) AS last_event_at,
            (SELECT COUNT(*) FROM events e WHERE e.contact_id = c.id AND e.occurred_at >= datetime('now','-7 days')) AS events_7d,
            (SELECT e.path FROM events e WHERE e.contact_id = c.id AND e.type = 'page_view' ORDER BY e.occurred_at DESC LIMIT 1) AS last_page
     FROM contacts c
     WHERE c.score >= ? AND c.status = 'active'
     ORDER BY c.score DESC, last_event_at DESC
     LIMIT ?`,
    Number(minScore), Number(limit),
  );
}

/** Account-level rollup — ABM is bought by account, not by person. */
export function accountRollup({ limit = 25, days = 30 } = {}) {
  return all(
    `SELECT a.domain, a.name, a.industry, a.contact_count, a.score,
            (SELECT COUNT(DISTINCT e.contact_id) FROM events e JOIN contacts c ON c.id = e.contact_id
              WHERE c.domain = a.domain AND e.occurred_at >= datetime('now', ?)) AS engaged_contacts,
            (SELECT COUNT(*) FROM events e JOIN contacts c ON c.id = e.contact_id
              WHERE c.domain = a.domain AND e.occurred_at >= datetime('now', ?)) AS events,
            (SELECT MAX(e.occurred_at) FROM events e JOIN contacts c ON c.id = e.contact_id
              WHERE c.domain = a.domain) AS last_activity,
            (SELECT COUNT(*) FROM contacts c WHERE c.domain = a.domain AND c.grade IN ('A','B')) AS strong_contacts
     FROM accounts a
     WHERE a.contact_count > 0
     ORDER BY a.score DESC, engaged_contacts DESC
     LIMIT ?`,
    `-${Number(days)} days`, `-${Number(days)} days`, Number(limit),
  );
}

/**
 * Channel influence: for each channel, how many distinct contacts it touched
 * and how many of those later showed high intent. Deliberately "influenced",
 * not "attributed" — with this data you can honestly claim participation in
 * the journey, not sole credit for it.
 */
export function channelInfluence({ days = 30 } = {}) {
  const window = `-${Number(days)} days`;
  return all(
    `SELECT channel,
            COUNT(DISTINCT contact_id) AS contacts_touched,
            COUNT(*) AS events,
            COUNT(DISTINCT CASE WHEN contact_id IN (
              SELECT contact_id FROM events
              WHERE occurred_at >= datetime('now', ?)
                AND (type IN ('demo_request','form_submit','ad_lead_form','signup')
                     OR (type = 'page_view' AND (path LIKE '%pricing%' OR path LIKE '%demo%')))
            ) THEN contact_id END) AS influenced_high_intent
     FROM events
     WHERE contact_id IS NOT NULL AND occurred_at >= datetime('now', ?)
     GROUP BY channel ORDER BY contacts_touched DESC`,
    window, window,
  );
}

export function dashboard({ days = 30 } = {}) {
  return {
    overview: overview({ days }),
    event_series: eventSeries({ days }),
    top_pages: topPages({ days }),
    ad_performance: adPerformance({ days }),
    ad_series: adSeries({ days }),
    platform_comparison: platformComparison({ days }),
    audience_influence: audienceInfluence({ days }),
    channel_influence: channelInfluence({ days }),
    accounts: accountRollup({ days }),
    hot: hotList({ limit: 10 }),
    alerts: all('SELECT * FROM alerts WHERE read = 0 ORDER BY created_at DESC LIMIT 20'),
  };
}
