import { all, get, run, tx } from '../../db/index.js';
import { config } from '../../config.js';
import { id, now, dayKey, parseJson, normalizeEmail } from '../../lib/util.js';
import { recordEvent } from '../../core/events.js';
import { upsertContact } from '../../core/contacts.js';
import { LinkedInClient, dryRun } from './client.js';
import { logger } from '../../lib/logger.js';

const log = logger('linkedin:insights');

/**
 * Ad-engagement ingestion.
 *
 * IMPORTANT, and the reason this file is split in two halves:
 * LinkedIn does NOT expose member-level ad engagement. There is no endpoint
 * that says "Noa saw creative X three times". Impressions, clicks and spend
 * come back aggregated per campaign per day, and that is all.
 *
 * So contact-level ad engagement is assembled from the three signals that
 * ARE person-level:
 *   1. audience membership   — who we targeted        (audiences.js)
 *   2. lead-gen form responses — who filled the form  (syncLeadResponses)
 *   3. ad clicks that land on our tracked site        (core/tracking.js)
 * Campaign-level numbers below give the spend and reach context around those.
 */

// ------------------------------------------------------------- campaigns --
export async function syncCampaigns() {
  const client = new LinkedInClient();
  if (dryRun()) return { synced: 0, dry_run: true, note: 'LinkedIn credentials not configured' };

  const res = await client.listCampaigns();
  const elements = res?.elements || [];
  const ts = now();
  let synced = 0;

  tx(() => {
    for (const el of elements) {
      const campaignId = String(el.id ?? String(el.urn || '').split(':').pop() ?? '');
      if (!campaignId) continue;
      const budget = Number(el.dailyBudget?.amount ?? 0) || null;
      const total = Number(el.totalBudget?.amount ?? 0) || null;
      run(
        `INSERT INTO ad_campaigns (id, account_id, name, status, objective, type, daily_budget,
           total_budget, currency, start_at, end_at, synced_at, created_at, updated_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name, status = excluded.status, objective = excluded.objective,
           daily_budget = excluded.daily_budget, total_budget = excluded.total_budget,
           end_at = excluded.end_at, synced_at = excluded.synced_at, updated_at = excluded.updated_at`,
        campaignId,
        String(config.linkedin.adAccountId).replace(/\D/g, ''),
        el.name || `Campaign ${campaignId}`,
        el.status || null,
        el.objectiveType || null,
        el.type || null,
        budget, total,
        el.dailyBudget?.currencyCode || el.totalBudget?.currencyCode || 'USD',
        el.runSchedule?.start ? new Date(el.runSchedule.start).toISOString() : null,
        el.runSchedule?.end ? new Date(el.runSchedule.end).toISOString() : null,
        ts, ts, ts,
      );
      synced += 1;
    }
  });

  log.info(`synced ${synced} LinkedIn ad campaigns`);
  return { synced };
}

// --------------------------------------------------------------- metrics --
export async function syncMetrics({ days = 30 } = {}) {
  const client = new LinkedInClient();
  if (dryRun()) return { rows: 0, dry_run: true, note: 'LinkedIn credentials not configured' };

  const end = new Date();
  const start = new Date(Date.now() - days * 86400000);
  const res = await client.adAnalytics({ start, end, pivot: 'CAMPAIGN' });
  const elements = res?.elements || [];
  let rows = 0;

  tx(() => {
    for (const el of elements) {
      const pivotUrn = (el.pivotValues || [])[0] || '';
      const campaignId = String(pivotUrn).split(':').pop();
      if (!campaignId) continue;

      // The daily bucket comes back as a structured date, not a string.
      const d = el.dateRange?.start;
      const date = d ? `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}` : dayKey();

      // A campaign can appear in analytics before the campaign sync sees it.
      const known = get('SELECT id FROM ad_campaigns WHERE id = ?', campaignId);
      if (!known) {
        run(
          `INSERT INTO ad_campaigns (id, account_id, name, status, synced_at, created_at, updated_at)
           VALUES (?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING`,
          campaignId, String(config.linkedin.adAccountId).replace(/\D/g, ''),
          `Campaign ${campaignId}`, 'UNKNOWN', now(), now(), now(),
        );
      }

      upsertMetric({
        ad_campaign_id: campaignId,
        date,
        impressions: num(el.impressions),
        unique_reach: num(el.approximateMemberReach),
        clicks: num(el.clicks) || num(el.landingPageClicks),
        spend: Number(el.costInUsd ?? el.costInLocalCurrency ?? 0),
        video_views: num(el.videoViews),
        reactions: num(el.likes),
        comments: num(el.comments),
        shares: num(el.shares),
        follows: num(el.follows),
        leads: num(el.oneClickLeads),
        conversions: num(el.externalWebsiteConversions),
        raw: el,
      });
      rows += 1;
    }
  });

  log.info(`ingested ${rows} daily ad metric rows`);
  return { rows };
}

const num = (v) => Math.round(Number(v ?? 0)) || 0;

/** Upsert one daily metric row. Exposed so seeds and tests can use it too. */
export function upsertMetric(m) {
  run(
    `INSERT INTO ad_metrics (id, ad_campaign_id, creative_id, date, impressions, unique_reach, clicks,
       spend, video_views, reactions, comments, shares, follows, leads, conversions, raw)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(ad_campaign_id, creative_id, date) DO UPDATE SET
       impressions = excluded.impressions, unique_reach = excluded.unique_reach,
       clicks = excluded.clicks, spend = excluded.spend, video_views = excluded.video_views,
       reactions = excluded.reactions, comments = excluded.comments, shares = excluded.shares,
       follows = excluded.follows, leads = excluded.leads, conversions = excluded.conversions,
       raw = excluded.raw`,
    id('am'), String(m.ad_campaign_id), m.creative_id || '', m.date,
    m.impressions || 0, m.unique_reach || 0, m.clicks || 0, m.spend || 0,
    m.video_views || 0, m.reactions || 0, m.comments || 0, m.shares || 0,
    m.follows || 0, m.leads || 0, m.conversions || 0,
    JSON.stringify(m.raw || {}),
  );
}

// -------------------------------------------------------------- lead gen --
/**
 * Pulls lead-gen form responses and turns each into a real contact plus a
 * person-level `ad_lead_form` event — the highest-intent ad signal there is.
 */
export async function syncLeadResponses({ since = null } = {}) {
  const client = new LinkedInClient();
  if (dryRun()) return { imported: 0, dry_run: true, note: 'LinkedIn credentials not configured' };

  const start = since || new Date(Date.now() - 30 * 86400000).toISOString();
  const res = await client.leadFormResponses({ start });
  const elements = res?.elements || [];
  let imported = 0;

  for (const el of elements) {
    const responseUrn = el.id || el.leadTrackingParams?.leadEventId || null;
    if (responseUrn && get('SELECT id FROM ad_lead_responses WHERE response_urn = ?', String(responseUrn))) continue;
    const answers = flattenAnswers(el);
    const email = normalizeEmail(answers.email || answers.emailAddress || answers.work_email);
    if (!email) continue;
    ingestLeadResponse({
      response_urn: String(responseUrn || ''),
      email,
      first_name: answers.firstName || answers.first_name || null,
      last_name: answers.lastName || answers.last_name || null,
      company: answers.companyName || answers.company || null,
      job_title: answers.jobTitle || answers.title || null,
      ad_campaign_id: String(el.campaign || '').split(':').pop() || null,
      creative_id: String(el.creative || '').split(':').pop() || null,
      form_id: String(el.form || '').split(':').pop() || null,
      submitted_at: el.submittedAt ? new Date(el.submittedAt).toISOString() : now(),
      answers,
    });
    imported += 1;
  }

  log.info(`imported ${imported} LinkedIn lead-form responses`);
  return { imported };
}

/** Shared by the API sync and by manual/seeded lead ingestion. */
export function ingestLeadResponse(lead) {
  const email = normalizeEmail(lead.email);
  if (!email) return { ok: false, error: 'invalid email' };

  const { contact } = upsertContact({
    email,
    first_name: lead.first_name,
    last_name: lead.last_name,
    company: lead.company,
    job_title: lead.job_title,
    source: 'linkedin_lead_form',
    lifecycle_stage: 'engaged',
  }, { source: 'linkedin_lead_form' });

  run(
    `INSERT INTO ad_lead_responses (id, response_urn, ad_campaign_id, creative_id, form_id,
       contact_id, email, first_name, last_name, company, job_title, answers, submitted_at, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(response_urn) DO NOTHING`,
    id('lr'), lead.response_urn || id('urn'), lead.ad_campaign_id || null, lead.creative_id || null,
    lead.form_id || null, contact.id, email, lead.first_name || null, lead.last_name || null,
    lead.company || null, lead.job_title || null, JSON.stringify(lead.answers || {}),
    lead.submitted_at || now(), now(),
  );

  recordEvent({
    contact_id: contact.id,
    channel: 'linkedin',
    type: 'ad_lead_form',
    ad_campaign_id: lead.ad_campaign_id || null,
    creative_id: lead.creative_id || null,
    occurred_at: lead.submitted_at || now(),
    meta: { form_id: lead.form_id, answers: lead.answers || {} },
    dedupe_key: lead.response_urn ? `lead:${lead.response_urn}` : null,
  });

  return { ok: true, contact_id: contact.id };
}

function flattenAnswers(el) {
  const out = {};
  for (const answer of el.formResponse?.answers || el.answers || []) {
    const key = String(answer.questionId || answer.question || answer.name || '').split(':').pop();
    const value = answer.answerDetails?.textQuestionAnswer?.answer ?? answer.answer ?? answer.value;
    if (key && value !== undefined) out[key] = value;
  }
  return out;
}

// ------------------------------------------------------------ reporting --
/** Campaign-level performance joined to what we can attribute per contact. */
export function adPerformance({ days = 30 } = {}) {
  const campaigns = all(
    `SELECT ac.id, ac.name, ac.status, ac.objective, ac.currency, ac.daily_budget,
            au.name AS audience_name, au.matched_count, au.member_count,
            COALESCE(SUM(m.impressions), 0) AS impressions,
            COALESCE(SUM(m.clicks), 0)      AS clicks,
            COALESCE(SUM(m.spend), 0)       AS spend,
            COALESCE(SUM(m.leads), 0)       AS leads,
            COALESCE(SUM(m.conversions), 0) AS conversions,
            COALESCE(MAX(m.unique_reach), 0) AS reach
     FROM ad_campaigns ac
     LEFT JOIN li_audiences au ON au.id = ac.audience_id
     LEFT JOIN ad_metrics m ON m.ad_campaign_id = ac.id AND m.date >= date('now', ?)
     GROUP BY ac.id ORDER BY spend DESC`,
    `-${Number(days)} days`,
  );

  return campaigns.map((c) => {
    // The contact-level half: who we can actually name.
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
      ctr: impressions ? Math.round((clicks / impressions) * 10000) / 100 : 0,
      cpc: clicks ? Math.round((spend / clicks) * 100) / 100 : 0,
      cpm: impressions ? Math.round((spend / impressions) * 1000 * 100) / 100 : 0,
      identified_contacts: Number(engaged.contacts || 0),
      identified_ad_clicks: Number(engaged.ad_clicks || 0),
      lead_form_submissions: Number(engaged.lead_forms || 0),
      cost_per_identified_contact: engaged.contacts ? Math.round((spend / Number(engaged.contacts)) * 100) / 100 : null,
    };
  });
}

/** Daily spend/impression series for the console chart. */
export function adSeries({ days = 30 } = {}) {
  return all(
    `SELECT date, SUM(impressions) AS impressions, SUM(clicks) AS clicks,
            SUM(spend) AS spend, SUM(leads) AS leads
     FROM ad_metrics WHERE date >= date('now', ?)
     GROUP BY date ORDER BY date`,
    `-${Number(days)} days`,
  );
}

/**
 * The ABM money question: of the people we advertised to, how many then did
 * something on our site or in email? Aggregate ad spend never answers this;
 * audience membership joined to the event stream does.
 */
export function audienceInfluence({ days = 30 } = {}) {
  return all(
    `SELECT a.id, a.name, a.member_count, a.matched_count,
            COUNT(DISTINCT m.contact_id) AS targeted,
            COUNT(DISTINCT CASE WHEN e.id IS NOT NULL THEN m.contact_id END) AS engaged_after_targeting,
            COUNT(DISTINCT CASE WHEN e.channel = 'web' THEN m.contact_id END) AS visited_site,
            COUNT(DISTINCT CASE WHEN e.type = 'ad_click' THEN m.contact_id END) AS clicked_ad,
            COUNT(DISTINCT CASE WHEN e.type = 'ad_lead_form' THEN m.contact_id END) AS submitted_lead_form
     FROM li_audiences a
     JOIN li_audience_members m ON m.audience_id = a.id AND m.state = 'pushed'
     LEFT JOIN events e
       ON e.contact_id = m.contact_id
      AND e.occurred_at >= m.pushed_at
      AND e.occurred_at >= datetime('now', ?)
      -- An explicit allow-list, not an exclusion list: our own bookkeeping
      -- (journey_run, audience_added, lifecycle_change) is not the contact
      -- engaging with anything, and must never inflate an influence number.
      AND e.type IN ('page_view','form_submit','demo_request','signup','download',
                     'video_play','email_open','email_click','ad_click','ad_lead_form')
     GROUP BY a.id ORDER BY targeted DESC`,
    `-${Number(days)} days`,
  ).map((r) => ({
    ...r,
    engagement_rate: r.targeted ? Math.round((r.engaged_after_targeting / r.targeted) * 1000) / 10 : 0,
  }));
}
