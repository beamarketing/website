import { createHmac } from 'node:crypto';
import { config, isDryRun } from '../../config.js';
import { logger } from '../../lib/logger.js';
import { sleep } from '../../lib/util.js';
import { SCHEMA, contactToRow } from './normalize.js';

const log = logger('meta');
const BASE = 'https://graph.facebook.com';

/**
 * Meta Marketing API (Graph) client.
 *
 * Two things differ sharply from LinkedIn and shape this file:
 *  - Meta reports at `level=ad`, so per-ad reporting is directly available.
 *    That is what makes cohort attribution meaningfully tighter here.
 *  - Custom-audience uploads are session-based: a session id plus an ordered
 *    batch sequence, with a last-batch flag. Getting that wrong means Meta
 *    accepts the call and silently never finalises the audience.
 */
export class MetaClient {
  constructor({
    accessToken = config.meta.accessToken,
    adAccountId = config.meta.adAccountId,
    version = config.meta.apiVersion,
    appSecret = config.meta.appSecret,
  } = {}) {
    this.accessToken = accessToken;
    this.adAccountId = String(adAccountId || '').replace(/^act_/, '');
    this.version = version;
    this.appSecret = appSecret;
  }

  get enabled() { return Boolean(this.accessToken && this.adAccountId); }
  get account() { return `act_${this.adAccountId}`; }

  /**
   * appsecret_proof signs the token with the app secret. Meta requires it when
   * an app has "Require app secret" on, and it is harmless otherwise, so we
   * always send it when a secret is configured.
   */
  proof() {
    if (!this.appSecret) return null;
    return createHmac('sha256', this.appSecret).update(this.accessToken).digest('hex');
  }

  async request(path, { method = 'GET', body = null, query = null, retries = 3 } = {}) {
    if (!this.enabled) throw new Error('META_ACCESS_TOKEN / META_AD_ACCOUNT_ID are not configured');

    const url = new URL(path.startsWith('http') ? path : `${BASE}/${this.version}/${path.replace(/^\//, '')}`);
    for (const [k, v] of Object.entries(query || {})) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
    }
    const proof = this.proof();
    if (proof) url.searchParams.set('appsecret_proof', proof);

    const init = { method, headers: { accept: 'application/json' } };
    if (body) {
      // Graph accepts JSON bodies with the token in the Authorization header.
      init.headers['content-type'] = 'application/json';
      init.headers.authorization = `Bearer ${this.accessToken}`;
      init.body = JSON.stringify(body);
    } else {
      init.headers.authorization = `Bearer ${this.accessToken}`;
    }

    let lastError = null;
    for (let attempt = 0; attempt < retries; attempt++) {
      let res;
      try {
        res = await fetch(url, init);
      } catch (err) {
        lastError = err;
        await sleep(2 ** attempt * 1000);
        continue;
      }

      const text = await res.text();
      const parsed = text ? safeJson(text) : null;

      if (!res.ok) {
        const error = parsed?.error || {};
        // Codes 4/17/32/613 are rate limits; 1/2 are transient platform faults.
        const transient = [1, 2, 4, 17, 32, 613].includes(Number(error.code)) || res.status >= 500;
        if (transient && attempt < retries - 1) {
          const wait = 2 ** attempt * 2000;
          log.warn(`Meta ${error.code || res.status} (${error.message || 'error'}) — retrying in ${wait / 1000}s`);
          await sleep(wait);
          lastError = new Error(`Meta ${error.code || res.status}: ${error.message || text.slice(0, 200)}`);
          continue;
        }
        const err = new Error(`Meta ${error.code || res.status}: ${error.message || text.slice(0, 300)}`);
        err.status = res.status;
        err.code = error.code;
        err.subcode = error.error_subcode;
        err.body = parsed;
        throw err;
      }
      return parsed;
    }
    throw lastError || new Error('Meta request failed');
  }

  /** Walks Graph cursor pagination, capped so a bad filter cannot run forever. */
  async paginate(path, { query = {}, limit = 10, key = 'data' } = {}) {
    const out = [];
    let next = null;
    for (let page = 0; page < limit; page++) {
      const res = next
        ? await this.request(next, {})
        : await this.request(path, { query: { ...query, limit: query.limit ?? 200 } });
      out.push(...(res?.[key] || []));
      next = res?.paging?.next || null;
      if (!next) break;
    }
    return out;
  }

  // ------------------------------------------------------ custom audiences --
  /**
   * `customer_file_source` is a required legal declaration about where the data
   * came from. USER_PROVIDED_ONLY is the correct value for a list people gave
   * us directly.
   */
  createCustomAudience({ name, description = '' }) {
    return this.request(`${this.account}/customaudiences`, {
      method: 'POST',
      body: {
        name,
        description,
        subtype: 'CUSTOM',
        customer_file_source: 'USER_PROVIDED_ONLY',
      },
    });
  }

  getCustomAudience(audienceId) {
    return this.request(String(audienceId), {
      query: {
        fields: [
          'id', 'name', 'approximate_count_lower_bound', 'approximate_count_upper_bound',
          'operation_status', 'delivery_status', 'time_updated',
        ].join(','),
      },
    });
  }

  deleteCustomAudience(audienceId) {
    return this.request(String(audienceId), { method: 'DELETE' });
  }

  /**
   * Adds or removes people. `session` tells Meta this is one logical upload
   * split across batches — without `last_batch_flag` on the final call the
   * audience stays in a pending state indefinitely.
   */
  updateAudienceUsers(audienceId, contacts, {
    action = 'add', sessionId = null, batchSeq = 1, lastBatch = true, schema = SCHEMA,
  } = {}) {
    const data = contacts.map((c) => contactToRow(c, schema));
    return this.request(`${audienceId}/users`, {
      method: action === 'remove' ? 'DELETE' : 'POST',
      body: {
        payload: { schema, data },
        session: {
          session_id: Number(sessionId ?? Date.now() % 2147483647),
          batch_seq: batchSeq,
          last_batch_flag: lastBatch,
        },
      },
    });
  }

  // -------------------------------------------------------------- campaigns --
  listCampaigns() {
    return this.paginate(`${this.account}/campaigns`, {
      query: {
        fields: [
          'id', 'name', 'status', 'effective_status', 'objective', 'buying_type',
          'daily_budget', 'lifetime_budget', 'start_time', 'stop_time', 'created_time',
        ].join(','),
      },
    });
  }

  /** Ads carry the audience targeting, so this is what cohorts map onto. */
  listAds() {
    return this.paginate(`${this.account}/ads`, {
      query: {
        fields: [
          'id', 'name', 'status', 'effective_status', 'campaign_id', 'adset_id',
          'creative{id,name,object_story_spec}', 'created_time',
        ].join(','),
      },
    });
  }

  listAdSets() {
    return this.paginate(`${this.account}/adsets`, {
      query: {
        fields: ['id', 'name', 'status', 'campaign_id', 'targeting', 'daily_budget'].join(','),
      },
    });
  }

  // -------------------------------------------------------------- insights --
  /**
   * Daily insights. `level: 'ad'` is deliberate — ad-level granularity is what
   * lets a cohort's numbers be read off directly instead of inferred from a
   * campaign total.
   */
  insights({ start, end, level = 'ad' }) {
    return this.paginate(`${this.account}/insights`, {
      query: {
        level,
        time_increment: 1,
        time_range: { since: isoDay(start), until: isoDay(end) },
        fields: [
          'ad_id', 'ad_name', 'adset_id', 'adset_name', 'campaign_id', 'campaign_name',
          'impressions', 'reach', 'frequency', 'clicks', 'inline_link_clicks',
          'spend', 'cpm', 'cpc', 'ctr', 'actions', 'action_values',
          'video_30_sec_watched_actions', 'date_start', 'date_stop',
        ].join(','),
      },
    });
  }

  // -------------------------------------------------------------- lead ads --
  listLeadForms(pageId = config.meta.pageId) {
    if (!pageId) return Promise.resolve([]);
    return this.paginate(`${pageId}/leadgen_forms`, {
      query: { fields: 'id,name,status,leads_count' },
    });
  }

  listLeads(formId, { since = null } = {}) {
    return this.paginate(`${formId}/leads`, {
      query: {
        fields: 'id,created_time,ad_id,adset_id,campaign_id,form_id,field_data,platform',
        ...(since ? { filtering: [{ field: 'time_created', operator: 'GREATER_THAN', value: Math.floor(new Date(since).getTime() / 1000) }] } : {}),
      },
    });
  }

  // ------------------------------------------------------- conversions API --
  /**
   * Server-side events. `event_id` must match the browser pixel's event id for
   * the same action, or Meta counts it twice.
   */
  sendConversions(events, { pixelId = config.meta.pixelId, testEventCode = config.meta.testEventCode } = {}) {
    if (!pixelId) throw new Error('META_PIXEL_ID is not configured');
    return this.request(`${pixelId}/events`, {
      method: 'POST',
      body: {
        data: events,
        ...(testEventCode ? { test_event_code: testEventCode } : {}),
      },
    });
  }

  /** Confirms the token works and reports what it can actually reach. */
  async introspect() {
    if (!this.enabled) {
      return { ok: false, error: 'META_ACCESS_TOKEN / META_AD_ACCOUNT_ID are not configured' };
    }
    try {
      const account = await this.request(this.account, {
        query: { fields: 'id,name,account_status,currency,timezone_name,business' },
      });
      return {
        ok: true,
        account_id: account.id,
        account_name: account.name,
        // account_status 1 = active; anything else will not deliver ads.
        account_status: account.account_status,
        active: account.account_status === 1,
        currency: account.currency,
        timezone: account.timezone_name,
        pixel_configured: Boolean(config.meta.pixelId),
        page_configured: Boolean(config.meta.pageId),
      };
    } catch (err) {
      return { ok: false, error: err.message, code: err.code };
    }
  }
}

function isoDay(d) {
  return new Date(d).toISOString().slice(0, 10);
}

function safeJson(text) {
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

export const client = () => new MetaClient();
export const dryRun = () => isDryRun.meta;
