import { config, isDryRun } from '../../config.js';
import { logger } from '../../lib/logger.js';
import { sleep } from '../../lib/util.js';

const log = logger('linkedin');
const BASE = 'https://api.linkedin.com';

/**
 * LinkedIn Marketing Solutions REST client.
 *
 * Uses the versioned /rest surface (LinkedIn-Version header) rather than the
 * frozen /v2 one, because DMP segments and adAnalytics only get fixes there.
 * Every call carries X-Restli-Protocol-Version: 2.0.0 — without it LinkedIn
 * silently interprets URNs differently.
 */
export class LinkedInClient {
  constructor({ accessToken = config.linkedin.accessToken, version = config.linkedin.apiVersion } = {}) {
    this.accessToken = accessToken;
    this.version = version;
  }

  get enabled() { return Boolean(this.accessToken); }

  async request(path, { method = 'GET', body = null, query = null, headers = {}, retries = 3 } = {}) {
    if (!this.enabled) throw new Error('LINKEDIN_ACCESS_TOKEN is not configured');

    const url = new URL(path.startsWith('http') ? path : `${BASE}${path}`);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      }
    }

    const init = {
      method,
      headers: {
        authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': this.version,
        'X-Restli-Protocol-Version': '2.0.0',
        accept: 'application/json',
        ...(body ? { 'content-type': 'application/json' } : {}),
        ...headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    };

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

      // 429 and 5xx are worth retrying; 4xx is a bug in our request.
      if (res.status === 429 || res.status >= 500) {
        const retryAfter = Number(res.headers.get('retry-after')) || 2 ** attempt;
        lastError = new Error(`LinkedIn ${res.status} on ${method} ${url.pathname}`);
        log.warn(`${lastError.message} — retrying in ${retryAfter}s`);
        await sleep(retryAfter * 1000);
        continue;
      }

      const text = await res.text();
      const parsed = text ? safeJson(text) : null;
      if (!res.ok) {
        const detail = parsed?.message || text.slice(0, 400);
        const err = new Error(`LinkedIn ${res.status}: ${detail}`);
        err.status = res.status;
        err.body = parsed;
        throw err;
      }
      return parsed;
    }
    throw lastError || new Error('LinkedIn request failed');
  }

  // ---------------------------------------------------------- ad accounts --
  adAccountUrn(accountId = config.linkedin.adAccountId) {
    const raw = String(accountId).replace(/\D/g, '');
    return `urn:li:sponsoredAccount:${raw}`;
  }

  listAdAccounts() {
    return this.request('/rest/adAccounts', { query: { q: 'search' } });
  }

  listCampaigns(accountId = config.linkedin.adAccountId) {
    const numeric = String(accountId).replace(/\D/g, '');
    return this.request(`/rest/adAccounts/${numeric}/adCampaigns`, { query: { q: 'search', sortOrder: 'DESCENDING' } });
  }

  // ------------------------------------------------------- matched audiences --
  /**
   * Creates a DMP segment — LinkedIn's name for a matched audience built from
   * a customer list. `USER` source type + SHA256 email is the contact-based
   * targeting primitive.
   */
  createDmpSegment({ name, description = '', accountId = config.linkedin.adAccountId }) {
    return this.request('/rest/dmpSegments', {
      method: 'POST',
      body: {
        name,
        description,
        account: this.adAccountUrn(accountId),
        sourcePlatform: 'CUSTOM',
        type: 'USER',
        accessPolicy: 'PRIVATE',
      },
    });
  }

  getDmpSegment(segmentId) {
    const numeric = String(segmentId).replace(/\D/g, '');
    return this.request(`/rest/dmpSegments/${numeric}`);
  }

  /**
   * Pushes hashed emails into a segment.
   * LinkedIn caps a batch at 100,000 users but rejects large payloads in
   * practice, so callers chunk far smaller. `action` is ADD or REMOVE.
   */
  updateDmpSegmentUsers(segmentId, hashedEmails, action = 'ADD') {
    const numeric = String(segmentId).replace(/\D/g, '');
    return this.request(`/rest/dmpSegments/${numeric}/users`, {
      method: 'POST',
      body: {
        elements: hashedEmails.map((hash) => ({
          action,
          userIds: [{ idType: 'SHA256_EMAIL', idValue: hash }],
        })),
      },
    });
  }

  // ------------------------------------------------------------- analytics --
  /**
   * Daily campaign analytics.
   * NOTE: LinkedIn reports at campaign/creative granularity only. There is no
   * API that says "this member saw this ad" — member-level ad engagement is
   * only observable through lead-gen form responses and through ad clicks
   * that land on our own tracked site.
   */
  adAnalytics({ start, end, pivot = 'CAMPAIGN', accountId = config.linkedin.adAccountId, campaignIds = null }) {
    const s = new Date(start);
    const e = new Date(end);
    const query = {
      q: 'analytics',
      pivot,
      timeGranularity: 'DAILY',
      dateRange: `(start:(year:${s.getUTCFullYear()},month:${s.getUTCMonth() + 1},day:${s.getUTCDate()}),`
        + `end:(year:${e.getUTCFullYear()},month:${e.getUTCMonth() + 1},day:${e.getUTCDate()}))`,
      fields: [
        'dateRange', 'impressions', 'clicks', 'costInLocalCurrency', 'costInUsd',
        'externalWebsiteConversions', 'oneClickLeads', 'videoViews', 'likes', 'comments',
        'shares', 'follows', 'landingPageClicks', 'approximateMemberReach', 'pivotValues',
      ].join(','),
    };
    if (campaignIds?.length) {
      query.campaigns = `List(${campaignIds.map((cid) => `urn%3Ali%3AsponsoredCampaign%3A${String(cid).replace(/\D/g, '')}`).join(',')})`;
    } else {
      query.accounts = `List(urn%3Ali%3AsponsoredAccount%3A${String(accountId).replace(/\D/g, '')})`;
    }
    return this.request('/rest/adAnalytics', { query });
  }

  // -------------------------------------------------------------- lead gen --
  /** Lead-gen form responses: the one person-level ad signal LinkedIn exposes. */
  leadFormResponses({ accountId = config.linkedin.adAccountId, start = null, limit = 100 }) {
    const numeric = String(accountId).replace(/\D/g, '');
    const query = {
      q: 'owner',
      owner: `(sponsoredAccount:urn%3Ali%3AsponsoredAccount%3A${numeric})`,
      count: limit,
    };
    if (start) query.submittedAtTimeRange = `(start:${new Date(start).getTime()})`;
    return this.request('/rest/leadFormResponses', { query });
  }

  /** Confirms the token works and reports which scopes it actually carries. */
  async introspect() {
    if (!this.enabled) return { ok: false, error: 'No access token configured' };
    try {
      const res = await fetch(`${BASE}/v2/me`, {
        headers: { authorization: `Bearer ${this.accessToken}`, 'X-Restli-Protocol-Version': '2.0.0' },
      });
      if (!res.ok) return { ok: false, status: res.status, error: (await res.text()).slice(0, 300) };
      const me = await res.json();
      return { ok: true, member: me.id ? `urn:li:person:${me.id}` : null };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }
}

function safeJson(text) {
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

export const client = () => new LinkedInClient();
export const dryRun = () => isDryRun.linkedin;
