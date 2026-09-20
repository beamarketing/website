import { all, get, run, tx } from '../../db/index.js';
import { config } from '../../config.js';
import { id, now, dayKey, normalizeEmail, parseJson } from '../../lib/util.js';
import { recordEvent } from '../../core/events.js';
import { upsertContact } from '../../core/contacts.js';
import { adapter, PLATFORMS, configuredPlatforms } from './adapters.js';
import { logger } from '../../lib/logger.js';

const log = logger('ads:insights');

/** Campaign ids are namespaced so LinkedIn 7011 and Meta 7011 never collide. */
export const campaignKey = (platform, nativeId) => `${platform}:${nativeId}`;

// ------------------------------------------------------------- campaigns --
export async function syncCampaigns(platform) {
  const plat = adapter(platform);
  if (plat.dryRun) return { platform, synced: 0, dry_run: true, note: `${plat.label} is not configured` };

  const campaigns = await plat.pullCampaigns();
  const ts = now();
  let synced = 0;

  tx(() => {
    for (const c of campaigns) {
      if (!c.native_id) continue;
      run(
        `INSERT INTO ad_campaigns (id, platform, native_id, account_id, name, status, objective, type,
           daily_budget, total_budget, currency, start_at, end_at, synced_at, created_at, updated_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name, status = excluded.status, objective = excluded.objective,
           daily_budget = excluded.daily_budget, total_budget = excluded.total_budget,
           end_at = excluded.end_at, synced_at = excluded.synced_at, updated_at = excluded.updated_at`,
        campaignKey(platform, c.native_id), platform, c.native_id, c.account_id, c.name,
        c.status, c.objective, c.type, c.daily_budget, c.total_budget, c.currency || 'USD',
        c.start_at, c.end_at, ts, ts, ts,
      );
      synced += 1;
    }
  });

  log.info(`synced ${synced} ${plat.label} campaigns`);
  return { platform, synced };
}

// --------------------------------------------------------------- metrics --
export async function syncMetrics(platform, { days = 30 } = {}) {
  const plat = adapter(platform);
  if (plat.dryRun) return { platform, rows: 0, dry_run: true, note: `${plat.label} is not configured` };

  const end = new Date();
  const start = new Date(Date.now() - days * 86400000);
  const rows = await plat.pullMetrics({ start, end });
  let written = 0;

  tx(() => {
    for (const m of rows) {
      const key = campaignKey(platform, m.native_campaign_id);
      // Analytics can mention a campaign the campaign sync has not seen yet.
      if (!get('SELECT id FROM ad_campaigns WHERE id = ?', key)) {
        run(
          `INSERT INTO ad_campaigns (id, platform, native_id, name, status, synced_at, created_at, updated_at)
           VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING`,
          key, platform, m.native_campaign_id, m.ad_name || `Campaign ${m.native_campaign_id}`,
          'UNKNOWN', now(), now(), now(),
        );
      }
      upsertMetric({ ...m, platform, ad_campaign_id: key });
      written += 1;
    }
  });

  // Attach any newly arrived rows to their cohort.
  const linked = linkMetricsToCohorts(platform);
  log.info(`ingested ${written} ${plat.label} metric rows (${linked} joined to a cohort)`);
  return { platform, rows: written, cohort_linked: linked };
}

export function upsertMetric(m) {
  const cohortId = m.cohort_id ?? cohortForAdObject(m.platform, m.ad_campaign_id, m.creative_id);
  run(
    `INSERT INTO ad_metrics (id, platform, ad_campaign_id, creative_id, cohort_id, date, impressions,
       unique_reach, clicks, spend, video_views, reactions, comments, shares, follows, leads,
       conversions, frequency, raw)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(ad_campaign_id, creative_id, date) DO UPDATE SET
       impressions = excluded.impressions, unique_reach = excluded.unique_reach,
       clicks = excluded.clicks, spend = excluded.spend, video_views = excluded.video_views,
       reactions = excluded.reactions, comments = excluded.comments, shares = excluded.shares,
       follows = excluded.follows, leads = excluded.leads, conversions = excluded.conversions,
       frequency = excluded.frequency, cohort_id = COALESCE(excluded.cohort_id, ad_metrics.cohort_id),
       raw = excluded.raw`,
    id('am'), m.platform || 'linkedin', String(m.ad_campaign_id), m.creative_id || '', cohortId,
    m.date, m.impressions || 0, m.unique_reach || 0, m.clicks || 0, m.spend || 0,
    m.video_views || 0, m.reactions || 0, m.comments || 0, m.shares || 0, m.follows || 0,
    m.leads || 0, m.conversions || 0, m.frequency || 0, JSON.stringify(m.raw || {}),
  );
}

function cohortForAdObject(platform, campaignId, creativeId) {
  if (creativeId) {
    const byCreative = get('SELECT id FROM ad_cohorts WHERE platform = ? AND creative_id = ?', platform, String(creativeId));
    if (byCreative) return byCreative.id;
  }
  const byCampaign = get(
    'SELECT id FROM ad_cohorts WHERE platform = ? AND ad_campaign_id = ? AND (creative_id IS NULL OR creative_id = ?)',
    platform, String(campaignId), '',
  );
  return byCampaign?.id ?? null;
}

function linkMetricsToCohorts(platform) {
  const result = run(
    `UPDATE ad_metrics SET cohort_id = (
       SELECT co.id FROM ad_cohorts co
       WHERE co.platform = ad_metrics.platform
         AND (co.creative_id = ad_metrics.creative_id
              OR (co.ad_campaign_id = ad_metrics.ad_campaign_id AND COALESCE(co.creative_id,'') = ''))
       LIMIT 1
     )
     WHERE platform = ? AND cohort_id IS NULL`,
    platform,
  );
  return Number(result.changes || 0);
}

// ----------------------------------------------------------------- leads --
export async function syncLeads(platform, { since = null } = {}) {
  const plat = adapter(platform);
  if (plat.dryRun) return { platform, imported: 0, dry_run: true };

  const start = since || new Date(Date.now() - 30 * 86400000).toISOString();
  const leads = await plat.pullLeads({ since: start });
  let imported = 0;

  for (const lead of leads) {
    if (lead.response_urn && get('SELECT id FROM ad_lead_responses WHERE response_urn = ?', lead.response_urn)) continue;
    if (!normalizeEmail(lead.email)) continue;
    ingestLead({ ...lead, platform });
    imported += 1;
  }

  log.info(`imported ${imported} ${plat.label} lead-form responses`);
  return { platform, imported };
}

/**
 * A lead-form submission is the one person-level ad signal either platform
 * hands back directly — the person typed their own address into the ad unit.
 */
export function ingestLead(lead) {
  const email = normalizeEmail(lead.email);
  if (!email) return { ok: false, error: 'invalid email' };
  const platform = lead.platform || 'linkedin';

  const { contact } = upsertContact({
    email,
    first_name: lead.first_name,
    last_name: lead.last_name,
    company: lead.company,
    job_title: lead.job_title,
    source: `${platform}_lead_form`,
    lifecycle_stage: 'engaged',
  }, { source: `${platform}_lead_form` });

  const campaignId = lead.native_campaign_id ? campaignKey(platform, lead.native_campaign_id) : null;
  const cohortId = lead.creative_id
    ? get('SELECT id FROM ad_cohorts WHERE platform = ? AND creative_id = ?', platform, String(lead.creative_id))?.id ?? null
    : null;

  run(
    `INSERT INTO ad_lead_responses (id, platform, response_urn, ad_campaign_id, creative_id, cohort_id,
       form_id, contact_id, email, first_name, last_name, company, job_title, answers, submitted_at, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(response_urn) DO NOTHING`,
    id('lr'), platform, lead.response_urn || id('urn'), campaignId, lead.creative_id || null,
    cohortId, lead.form_id || null, contact.id, email, lead.first_name || null, lead.last_name || null,
    lead.company || null, lead.job_title || null, JSON.stringify(lead.answers || {}),
    lead.submitted_at || now(), now(),
  );

  recordEvent({
    contact_id: contact.id,
    channel: 'ads',
    type: 'ad_lead_form',
    platform,
    ad_campaign_id: campaignId,
    creative_id: lead.creative_id || null,
    cohort_id: cohortId,
    occurred_at: lead.submitted_at || now(),
    meta: { form_id: lead.form_id, platform, answers: lead.answers || {} },
    dedupe_key: lead.response_urn ? `lead:${lead.response_urn}` : null,
  });

  return { ok: true, contact_id: contact.id, platform };
}

// ------------------------------------------------------------- reporting --
/**
 * Campaign performance with the contact-level half beside it.
 * Aggregate spend is what the platform reports; `identified_contacts` is what
 * we can actually name. Showing both, always, is the point.
 */
export function adPerformance({ days = 30, platform = null } = {}) {
  const where = platform ? 'WHERE ac.platform = ?' : '';
  const args = platform ? [`-${Number(days)} days`, platform, `-${Number(days)} days`] : [`-${Number(days)} days`, `-${Number(days)} days`];

  const campaigns = all(
    `SELECT ac.id, ac.platform, ac.native_id, ac.name, ac.status, ac.objective, ac.currency, ac.daily_budget,
            au.name AS audience_name, au.matched_count, au.member_count, au.cohort_mode,
            COALESCE(SUM(m.impressions), 0) AS impressions,
            COALESCE(SUM(m.clicks), 0)      AS clicks,
            COALESCE(SUM(m.spend), 0)       AS spend,
            COALESCE(SUM(m.leads), 0)       AS leads,
            COALESCE(SUM(m.conversions), 0) AS conversions,
            COALESCE(MAX(m.unique_reach), 0) AS reach,
            COALESCE(MAX(m.frequency), 0)   AS frequency,
            COUNT(DISTINCT m.cohort_id)     AS cohorts
     FROM ad_campaigns ac
     LEFT JOIN ad_audiences au ON au.id = ac.audience_id
     LEFT JOIN ad_metrics m ON m.ad_campaign_id = ac.id AND m.date >= date('now', ?)
     ${where}
     GROUP BY ac.id ORDER BY spend DESC`,
    ...(platform ? [args[0], platform] : [args[0]]),
  );

  return campaigns.map((c) => {
    const engaged = get(
      `SELECT COUNT(DISTINCT contact_id) AS contacts,
              SUM(type = 'ad_click') AS ad_clicks,
              SUM(type = 'ad_lead_form') AS lead_forms
       FROM events
       WHERE ad_campaign_id = ? AND contact_id IS NOT NULL AND occurred_at >= datetime('now', ?)`,
      c.id, `-${Number(days)} days`,
    ) || {};

    const impressions = Number(c.impressions);
    const clicks = Number(c.clicks);
    const spend = Number(c.spend);
    return {
      ...c,
      ctr: impressions ? round(clicks / impressions * 100, 2) : 0,
      cpc: clicks ? round(spend / clicks, 2) : 0,
      cpm: impressions ? round(spend / impressions * 1000, 2) : 0,
      identified_contacts: Number(engaged.contacts || 0),
      identified_ad_clicks: Number(engaged.ad_clicks || 0),
      lead_form_submissions: Number(engaged.lead_forms || 0),
      cost_per_identified_contact: engaged.contacts ? round(spend / Number(engaged.contacts), 2) : null,
    };
  });
}

const round = (n, places) => Math.round(n * 10 ** places) / 10 ** places;

/** Daily series per platform, for the console chart. */
export function adSeries({ days = 30 } = {}) {
  return all(
    `SELECT date, platform, SUM(impressions) AS impressions, SUM(clicks) AS clicks,
            SUM(spend) AS spend, SUM(leads) AS leads
     FROM ad_metrics WHERE date >= date('now', ?)
     GROUP BY date, platform ORDER BY date`,
    `-${Number(days)} days`,
  );
}

/** Side-by-side platform comparison — the "where is the money working" view. */
export function platformComparison({ days = 30 } = {}) {
  const window = `-${Number(days)} days`;
  return PLATFORMS.map((platform) => {
    const plat = adapter(platform);
    const spend = get(
      `SELECT COALESCE(SUM(impressions),0) AS impressions, COALESCE(SUM(clicks),0) AS clicks,
              COALESCE(SUM(spend),0) AS spend, COALESCE(SUM(leads),0) AS leads
       FROM ad_metrics WHERE platform = ? AND date >= date('now', ?)`,
      platform, window,
    ) || {};
    const reach = get(
      `SELECT COUNT(DISTINCT m.contact_id) AS targeted
       FROM ad_audience_members m JOIN ad_audiences a ON a.id = m.audience_id
       WHERE a.platform = ? AND m.state = 'pushed'`,
      platform,
    ) || {};
    // Genuine engagement only. `audience_added` means we targeted them, which
    // is the opposite of them engaging — counting it would make every targeted
    // contact look like a response and quietly invent a cost-per-contact.
    const engaged = get(
      `SELECT COUNT(DISTINCT contact_id) AS contacts
       FROM events
       WHERE platform = ? AND contact_id IS NOT NULL AND occurred_at >= datetime('now', ?)
         AND type IN ('ad_click','ad_lead_form','ad_view')`,
      platform, window,
    ) || {};

    const impressions = Number(spend.impressions || 0);
    const clicks = Number(spend.clicks || 0);
    const cost = Number(spend.spend || 0);
    return {
      platform,
      label: plat.label,
      configured: plat.configured,
      min_audience_size: plat.minAudienceSize,
      targeted_contacts: Number(reach.targeted || 0),
      identified_engagements: Number(engaged.contacts || 0),
      impressions,
      clicks,
      spend: round(cost, 2),
      leads: Number(spend.leads || 0),
      ctr: impressions ? round(clicks / impressions * 100, 2) : 0,
      cpc: clicks ? round(cost / clicks, 2) : 0,
      cpm: impressions ? round(cost / impressions * 1000, 2) : 0,
      cost_per_identified: engaged.contacts ? round(cost / Number(engaged.contacts), 2) : null,
    };
  });
}

/**
 * Of the people we advertised to, how many then did something.
 * Only genuine engagement counts — our own bookkeeping (audience_added,
 * journey_run) must never inflate an influence number.
 */
export function audienceInfluence({ days = 30, platform = null } = {}) {
  const args = [`-${Number(days)} days`];
  let filter = '';
  if (platform) { filter = 'AND a.platform = ?'; args.push(platform); }

  return all(
    `SELECT a.id, a.platform, a.name, a.member_count, a.matched_count, a.cohort_mode,
            COUNT(DISTINCT m.contact_id) AS targeted,
            COUNT(DISTINCT CASE WHEN e.id IS NOT NULL THEN m.contact_id END) AS engaged_after_targeting,
            COUNT(DISTINCT CASE WHEN e.channel = 'web' THEN m.contact_id END) AS visited_site,
            COUNT(DISTINCT CASE WHEN e.type = 'ad_click' THEN m.contact_id END) AS clicked_ad,
            COUNT(DISTINCT CASE WHEN e.type = 'ad_lead_form' THEN m.contact_id END) AS submitted_lead_form
     FROM ad_audiences a
     JOIN ad_audience_members m ON m.audience_id = a.id AND m.state = 'pushed'
     LEFT JOIN events e
       ON e.contact_id = m.contact_id
      AND e.occurred_at >= m.pushed_at
      AND e.occurred_at >= datetime('now', ?)
      AND e.type IN ('page_view','form_submit','demo_request','signup','download',
                     'video_play','email_open','email_click','ad_click','ad_lead_form')
     WHERE 1=1 ${filter}
     GROUP BY a.id ORDER BY targeted DESC`,
    ...args,
  ).map((r) => ({
    ...r,
    cohort_mode: !!r.cohort_mode,
    engagement_rate: r.targeted ? round(r.engaged_after_targeting / r.targeted * 100, 1) : 0,
  }));
}

/** Runs every configured platform's pulls in one call. */
export async function syncAllPlatforms({ days = 30, what = 'all' } = {}) {
  const out = { platforms: [] };
  for (const platform of PLATFORMS) {
    const plat = adapter(platform);
    if (!plat.configured) {
      out.platforms.push({ platform, skipped: 'not configured' });
      continue;
    }
    const entry = { platform };
    try {
      if (what === 'all' || what === 'campaigns') entry.campaigns = await syncCampaigns(platform);
      if (what === 'all' || what === 'metrics') entry.metrics = await syncMetrics(platform, { days });
      if (what === 'all' || what === 'leads') entry.leads = await syncLeads(platform);
    } catch (err) {
      entry.error = err.message;
      log.error(`${platform} sync failed: ${err.message}`);
    }
    out.platforms.push(entry);
  }
  return out;
}
