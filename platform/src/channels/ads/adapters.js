import { config, isDryRun } from '../../config.js';
import { chunk, dayKey } from '../../lib/util.js';
import { LinkedInClient } from '../linkedin/client.js';
import { MetaClient } from '../meta/client.js';
import { contactToRow, SCHEMA as META_SCHEMA, rowCompleteness } from '../meta/normalize.js';
import { logger } from '../../lib/logger.js';

const log = logger('ads');

/**
 * One interface, two very different platforms.
 *
 * The orchestration above this layer (audiences, cohorts, reporting) is
 * identical for both. Everything that genuinely differs — identity
 * normalisation, batch sizes, the minimum audience a platform will serve, the
 * shape of its reporting — lives behind these adapters.
 */

// --------------------------------------------------------------- LinkedIn --
const linkedin = {
  key: 'linkedin',
  label: 'LinkedIn',
  get minAudienceSize() { return config.linkedin.minAudienceSize; },
  batchSize: 1000,
  get configured() { return !isDryRun.linkedin; },
  get dryRun() { return isDryRun.linkedin; },
  // LinkedIn matches on one key only, so there is no multi-key uplift here.
  matchKeys: ['SHA256_EMAIL'],
  supportsLeadForms: true,
  supportsConversionsApi: false,
  identityNote: 'Matches on the SHA-256 of the lowercased email only.',

  client() { return new LinkedInClient(); },

  async createAudience({ name, description }) {
    const created = await this.client().createDmpSegment({ name, description });
    const raw = created?.id ?? created?.value?.id ?? null;
    if (!raw) throw new Error('LinkedIn did not return a DMP segment id');
    return { externalId: `urn:li:dmpSegment:${String(raw).replace(/\D/g, '')}` };
  },

  async addMembers(externalId, contacts) {
    const segmentId = segmentIdOf(externalId);
    let pushed = 0;
    for (const batch of chunk(contacts, this.batchSize)) {
      await this.client().updateDmpSegmentUsers(segmentId, batch.map((c) => c.email_sha256), 'ADD');
      pushed += batch.length;
    }
    return { pushed };
  },

  async removeMembers(externalId, contacts) {
    const segmentId = segmentIdOf(externalId);
    let removed = 0;
    for (const batch of chunk(contacts, this.batchSize)) {
      await this.client().updateDmpSegmentUsers(segmentId, batch.map((c) => c.email_sha256), 'REMOVE');
      removed += batch.length;
    }
    return { removed };
  },

  async audienceSize(externalId) {
    const segment = await this.client().getDmpSegment(segmentIdOf(externalId));
    return segment?.audienceCount ?? segment?.matchedAudienceCount ?? null;
  },

  async deleteAudience() {
    // LinkedIn has no DMP segment delete; segments are archived in Campaign Manager.
    return { deleted: false, note: 'LinkedIn DMP segments must be archived in Campaign Manager' };
  },

  async pullCampaigns() {
    const res = await this.client().listCampaigns();
    return (res?.elements || []).map((el) => {
      const nativeId = String(el.id ?? String(el.urn || '').split(':').pop() ?? '');
      return {
        native_id: nativeId,
        name: el.name || `Campaign ${nativeId}`,
        status: el.status || null,
        objective: el.objectiveType || null,
        type: el.type || null,
        daily_budget: Number(el.dailyBudget?.amount ?? 0) || null,
        total_budget: Number(el.totalBudget?.amount ?? 0) || null,
        currency: el.dailyBudget?.currencyCode || el.totalBudget?.currencyCode || 'USD',
        start_at: el.runSchedule?.start ? new Date(el.runSchedule.start).toISOString() : null,
        end_at: el.runSchedule?.end ? new Date(el.runSchedule.end).toISOString() : null,
        account_id: String(config.linkedin.adAccountId).replace(/\D/g, ''),
      };
    });
  },

  async pullMetrics({ start, end }) {
    const res = await this.client().adAnalytics({ start, end, pivot: 'CAMPAIGN' });
    return (res?.elements || []).map((el) => {
      const nativeId = String((el.pivotValues || [])[0] || '').split(':').pop();
      const d = el.dateRange?.start;
      return {
        native_campaign_id: nativeId,
        creative_id: '',
        date: d ? `${d.year}-${pad(d.month)}-${pad(d.day)}` : dayKey(),
        impressions: int(el.impressions),
        unique_reach: int(el.approximateMemberReach),
        clicks: int(el.clicks) || int(el.landingPageClicks),
        spend: Number(el.costInUsd ?? el.costInLocalCurrency ?? 0),
        video_views: int(el.videoViews),
        reactions: int(el.likes),
        comments: int(el.comments),
        shares: int(el.shares),
        follows: int(el.follows),
        leads: int(el.oneClickLeads),
        conversions: int(el.externalWebsiteConversions),
        frequency: 0,
        raw: el,
      };
    });
  },

  async pullLeads({ since }) {
    const res = await this.client().leadFormResponses({ start: since });
    return (res?.elements || []).map((el) => {
      const answers = {};
      for (const a of el.formResponse?.answers || el.answers || []) {
        const key = String(a.questionId || a.question || a.name || '').split(':').pop();
        const value = a.answerDetails?.textQuestionAnswer?.answer ?? a.answer ?? a.value;
        if (key && value !== undefined) answers[key] = value;
      }
      return {
        response_urn: String(el.id || el.leadTrackingParams?.leadEventId || ''),
        email: answers.email || answers.emailAddress || answers.work_email,
        first_name: answers.firstName || answers.first_name,
        last_name: answers.lastName || answers.last_name,
        company: answers.companyName || answers.company,
        job_title: answers.jobTitle || answers.title,
        native_campaign_id: String(el.campaign || '').split(':').pop() || null,
        creative_id: String(el.creative || '').split(':').pop() || null,
        form_id: String(el.form || '').split(':').pop() || null,
        submitted_at: el.submittedAt ? new Date(el.submittedAt).toISOString() : null,
        answers,
      };
    });
  },

  verify() { return this.client().introspect(); },
};

const segmentIdOf = (externalId) => String(externalId || '').split(':').pop();

// ------------------------------------------------------------------- Meta --
const meta = {
  key: 'meta',
  label: 'Meta (Facebook & Instagram)',
  get minAudienceSize() { return config.meta.minAudienceSize; },
  batchSize: 5000,
  get configured() { return !isDryRun.meta; },
  get dryRun() { return isDryRun.meta; },
  matchKeys: META_SCHEMA,
  supportsLeadForms: true,
  supportsConversionsApi: true,
  identityNote:
    'Matches on up to nine keys (email, name, city, state, zip, country, phone, our own id). '
    + 'More keys means a materially higher match rate than email alone.',

  client() { return new MetaClient(); },

  async createAudience({ name, description }) {
    const created = await this.client().createCustomAudience({ name, description });
    if (!created?.id) throw new Error('Meta did not return a custom audience id');
    return { externalId: String(created.id) };
  },

  /**
   * Meta uploads are session-based: one session id, an ordered batch sequence,
   * and a last-batch flag that finalises the audience.
   */
  async addMembers(externalId, contacts) {
    const batches = chunk(contacts, this.batchSize);
    const sessionId = Date.now() % 2147483647;
    let pushed = 0;
    for (const [i, batch] of batches.entries()) {
      await this.client().updateAudienceUsers(externalId, batch, {
        action: 'add',
        sessionId,
        batchSeq: i + 1,
        lastBatch: i === batches.length - 1,
      });
      pushed += batch.length;
    }
    return { pushed };
  },

  async removeMembers(externalId, contacts) {
    const batches = chunk(contacts, this.batchSize);
    const sessionId = Date.now() % 2147483647;
    let removed = 0;
    for (const [i, batch] of batches.entries()) {
      await this.client().updateAudienceUsers(externalId, batch, {
        action: 'remove',
        sessionId,
        batchSeq: i + 1,
        lastBatch: i === batches.length - 1,
      });
      removed += batch.length;
    }
    return { removed };
  },

  /**
   * Meta deliberately reports a range rather than an exact count, to stop
   * advertisers isolating individuals. We take the lower bound: under-claiming
   * reach is the safe direction.
   */
  async audienceSize(externalId) {
    const audience = await this.client().getCustomAudience(externalId);
    const lower = Number(audience?.approximate_count_lower_bound ?? -1);
    return lower >= 0 ? lower : null;
  },

  async deleteAudience(externalId) {
    await this.client().deleteCustomAudience(externalId);
    return { deleted: true };
  },

  async pullCampaigns() {
    const [campaigns, ads] = await Promise.all([
      this.client().listCampaigns(),
      this.client().listAds().catch(() => []),
    ]);
    const adsByCampaign = new Map();
    for (const ad of ads) {
      const list = adsByCampaign.get(ad.campaign_id) || [];
      list.push(ad);
      adsByCampaign.set(ad.campaign_id, list);
    }
    return campaigns.map((c) => ({
      native_id: String(c.id),
      name: c.name || `Campaign ${c.id}`,
      status: c.effective_status || c.status || null,
      objective: c.objective || null,
      type: c.buying_type || null,
      // Meta returns budgets in minor units (cents).
      daily_budget: c.daily_budget ? Number(c.daily_budget) / 100 : null,
      total_budget: c.lifetime_budget ? Number(c.lifetime_budget) / 100 : null,
      currency: null,
      start_at: c.start_time ? new Date(c.start_time).toISOString() : null,
      end_at: c.stop_time ? new Date(c.stop_time).toISOString() : null,
      account_id: config.meta.adAccountId,
      ads: (adsByCampaign.get(c.id) || []).map((a) => ({ id: a.id, name: a.name })),
    }));
  },

  async pullMetrics({ start, end }) {
    const rows = await this.client().insights({ start, end, level: 'ad' });
    return rows.map((r) => {
      const actions = indexActions(r.actions);
      return {
        native_campaign_id: String(r.campaign_id),
        // Ad id is the creative-level handle, and the cohort join key.
        creative_id: String(r.ad_id || ''),
        ad_name: r.ad_name || null,
        date: r.date_start || dayKey(),
        impressions: int(r.impressions),
        unique_reach: int(r.reach),
        clicks: int(r.inline_link_clicks) || int(r.clicks),
        spend: Number(r.spend || 0),
        video_views: int(firstAction(r.video_30_sec_watched_actions)),
        reactions: int(actions['post_reaction']),
        comments: int(actions['comment']),
        shares: int(actions['post']),
        follows: int(actions['like']),
        leads: int(actions['lead']) || int(actions['onsite_conversion.lead_grouped']),
        conversions: int(actions['offsite_conversion.fb_pixel_lead'])
          + int(actions['offsite_conversion.fb_pixel_complete_registration']),
        frequency: Number(r.frequency || 0),
        raw: r,
      };
    });
  },

  async pullLeads({ since }) {
    const forms = await this.client().listLeadForms();
    const out = [];
    for (const form of forms) {
      const leads = await this.client().listLeads(form.id, { since }).catch((err) => {
        log.warn(`could not read Meta leads for form ${form.id}: ${err.message}`);
        return [];
      });
      for (const lead of leads) {
        const answers = {};
        for (const field of lead.field_data || []) {
          answers[String(field.name)] = (field.values || [])[0];
        }
        out.push({
          response_urn: `meta:${lead.id}`,
          email: answers.email || answers.work_email,
          first_name: answers.first_name || answers.full_name?.split(' ')[0],
          last_name: answers.last_name || answers.full_name?.split(' ').slice(1).join(' '),
          company: answers.company_name || answers.company,
          job_title: answers.job_title || answers.title,
          native_campaign_id: lead.campaign_id ? String(lead.campaign_id) : null,
          creative_id: lead.ad_id ? String(lead.ad_id) : null,
          form_id: String(form.id),
          submitted_at: lead.created_time ? new Date(lead.created_time).toISOString() : null,
          answers,
        });
      }
    }
    return out;
  },

  /** Match-rate estimate before upload, so a thin list is visible up front. */
  matchQuality(contacts) {
    if (!contacts.length) return { rows: 0, avg_keys: 0 };
    const ratios = contacts.map((c) => rowCompleteness(contactToRow(c)).filled);
    return {
      rows: contacts.length,
      avg_keys: Math.round((ratios.reduce((a, b) => a + b, 0) / ratios.length) * 10) / 10,
      total_keys: META_SCHEMA.length,
    };
  },

  verify() { return this.client().introspect(); },
};

function indexActions(actions) {
  const out = {};
  for (const a of actions || []) out[a.action_type] = a.value;
  return out;
}
const firstAction = (list) => (list || [])[0]?.value ?? 0;
const int = (v) => Math.round(Number(v ?? 0)) || 0;
const pad = (n) => String(n).padStart(2, '0');

// --------------------------------------------------------------- registry --
export const ADAPTERS = { linkedin, meta };
export const PLATFORMS = Object.keys(ADAPTERS);

export function adapter(platform) {
  const found = ADAPTERS[String(platform || '').toLowerCase()];
  if (!found) throw new Error(`Unknown ad platform "${platform}" (expected: ${PLATFORMS.join(', ')})`);
  return found;
}

/** Adapters that actually have credentials; used by the scheduler. */
export const configuredPlatforms = () => PLATFORMS.filter((p) => ADAPTERS[p].configured);

export function platformSummary() {
  return PLATFORMS.map((key) => {
    const a = ADAPTERS[key];
    return {
      key,
      label: a.label,
      configured: a.configured,
      dry_run: a.dryRun,
      min_audience_size: a.minAudienceSize,
      match_keys: a.matchKeys,
      supports_lead_forms: a.supportsLeadForms,
      supports_conversions_api: a.supportsConversionsApi,
      identity_note: a.identityNote,
    };
  });
}
