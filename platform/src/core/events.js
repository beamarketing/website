import { all, get, run, tx } from '../db/index.js';
import {
  id, now, sha256, parseJson, dissectUrl, normalizeEmail,
} from '../lib/util.js';
import { logger } from '../lib/logger.js';
import { scoreEvent, recomputeScore } from './scoring.js';

const log = logger('events');

/**
 * Event types the engine understands. `web` events arrive from the tracker,
 * `email` from our own open/click endpoints, `linkedin` from ad ingestion.
 */
export const EVENT_TYPES = {
  page_view: 'web', session_start: 'web', click: 'web', form_submit: 'web',
  scroll_depth: 'web', time_on_page: 'web', video_play: 'web', download: 'web',
  identify: 'web', custom: 'web', pricing_view: 'web', demo_request: 'web', signup: 'web',
  email_sent: 'email', email_open: 'email', email_click: 'email',
  email_bounce: 'email', email_unsubscribe: 'email', email_complaint: 'email',
  ad_click: 'ads', ad_lead_form: 'ads', ad_view: 'ads',
  audience_added: 'ads', audience_removed: 'ads',
  list_added: 'system', score_change: 'system', lifecycle_change: 'system', journey_run: 'system',
};

export function channelFor(type) {
  return EVENT_TYPES[type] || 'web';
}

/**
 * Records one event.
 * Everything funnels through here so scoring, account rollups and last-seen
 * stamps can never drift out of sync with the event stream.
 */
export function recordEvent(input) {
  const type = String(input.type || 'custom');
  const channel = input.channel || channelFor(type);
  const occurredAt = input.occurred_at ? new Date(input.occurred_at).toISOString() : now();
  const parts = input.url ? dissectUrl(input.url) : {};

  // Idempotency: an open beacon re-fetched by a mail client must not double-count.
  if (input.dedupe_key) {
    const dupe = get('SELECT id FROM events WHERE dedupe_key = ?', input.dedupe_key);
    if (dupe) return { event: get('SELECT * FROM events WHERE id = ?', dupe.id), duplicate: true };
  }

  const contactId = input.contact_id || null;
  const points = input.points !== undefined ? input.points : scoreEvent(type, input);

  const eventId = id('ev');
  run(
    `INSERT INTO events (id, contact_id, visitor_id, channel, type, occurred_at, url, path, title,
       referrer, campaign_id, platform, ad_campaign_id, creative_id, cohort_id, utm_source, utm_medium,
       utm_campaign, utm_content, utm_term, value, points, meta, dedupe_key)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    eventId, contactId, input.visitor_id || null, channel, type, occurredAt,
    parts.url || input.url || null,
    input.path || parts.path || null,
    input.title || null,
    input.referrer || null,
    input.campaign_id || null,
    input.platform || parts.platform || null,
    input.ad_campaign_id || parts.ad_campaign_id || null,
    input.creative_id || parts.creative_id || null,
    input.cohort_id || null,
    input.utm_source || parts.utm_source || null,
    input.utm_medium || parts.utm_medium || null,
    input.utm_campaign || parts.utm_campaign || null,
    input.utm_content || parts.utm_content || null,
    input.utm_term || parts.utm_term || null,
    input.value ?? null,
    points,
    JSON.stringify(input.meta || {}),
    input.dedupe_key || null,
  );

  if (input.visitor_id) {
    run(
      'UPDATE visitors SET last_seen_at = ?, event_count = event_count + 1 WHERE id = ?',
      occurredAt, input.visitor_id,
    );
  }
  if (contactId) {
    run(
      `UPDATE contacts SET last_seen_at = ?,
         first_seen_at = COALESCE(first_seen_at, ?),
         updated_at = ?
       WHERE id = ?`,
      occurredAt, occurredAt, now(), contactId,
    );
    if (points !== 0) recomputeScore(contactId);
  }

  return { event: get('SELECT * FROM events WHERE id = ?', eventId), duplicate: false };
}

// ------------------------------------------------------- identity resolution --
export function ensureVisitor(visitorId, meta = {}) {
  const existing = get('SELECT * FROM visitors WHERE id = ?', visitorId);
  if (existing) {
    run('UPDATE visitors SET last_seen_at = ? WHERE id = ?', now(), visitorId);
    return existing;
  }
  const ts = now();
  run(
    `INSERT INTO visitors (id, first_seen_at, last_seen_at, user_agent, ip_hash, first_referrer, first_landing, first_utm)
     VALUES (?,?,?,?,?,?,?,?)`,
    visitorId, ts, ts,
    (meta.user_agent || '').slice(0, 400),
    meta.ip ? sha256(`${meta.ip}|${visitorId}`).slice(0, 32) : null,
    (meta.referrer || '').slice(0, 500),
    (meta.url || '').slice(0, 800),
    JSON.stringify(meta.utm || {}),
  );
  return get('SELECT * FROM visitors WHERE id = ?', visitorId);
}

/**
 * Binds an anonymous browser to a known contact and back-fills the whole
 * pre-identification session onto that contact. This is the step that turns
 * anonymous traffic into contact-based attribution: the pages they read
 * *before* they clicked the email now count toward their score.
 */
export function identifyVisitor(visitorId, contactId) {
  if (!visitorId || !contactId) return { linked: 0 };
  const visitor = get('SELECT * FROM visitors WHERE id = ?', visitorId);
  if (!visitor) return { linked: 0 };
  if (visitor.contact_id === contactId) return { linked: 0, already: true };

  return tx(() => {
    run(
      'UPDATE visitors SET contact_id = ?, identified_at = COALESCE(identified_at, ?) WHERE id = ?',
      contactId, now(), visitorId,
    );
    // Back-fill only events that are not already attributed to someone else.
    const res = run(
      'UPDATE events SET contact_id = ? WHERE visitor_id = ? AND contact_id IS NULL',
      contactId, visitorId,
    );
    const linked = Number(res.changes || 0);
    run(
      `UPDATE contacts SET
         first_seen_at = COALESCE(
           MIN(COALESCE(first_seen_at, '9999'), COALESCE((SELECT MIN(occurred_at) FROM events WHERE contact_id = ?), '9999')),
           first_seen_at),
         updated_at = ?
       WHERE id = ?`,
      contactId, now(), contactId,
    );
    recomputeScore(contactId);
    log.info(`identified visitor ${visitorId.slice(0, 8)}… → ${contactId} (${linked} events back-filled)`);
    return { linked };
  });
}

/** Every other browser this contact used stays stitched to them too. */
export function visitorsForContact(contactId) {
  return all('SELECT * FROM visitors WHERE contact_id = ? ORDER BY last_seen_at DESC', contactId);
}

// --------------------------------------------------------------- timelines --
export function timeline(contactId, { limit = 100, offset = 0, channel = null } = {}) {
  const args = [contactId];
  let where = 'contact_id = ?';
  if (channel) { where += ' AND channel = ?'; args.push(channel); }
  return all(
    `SELECT * FROM events WHERE ${where} ORDER BY occurred_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
    ...args,
  ).map(hydrate);
}

export function recentEvents({ limit = 100, channel = null, type = null, identifiedOnly = false } = {}) {
  const where = [];
  const args = [];
  if (channel) { where.push('e.channel = ?'); args.push(channel); }
  if (type) { where.push('e.type = ?'); args.push(type); }
  if (identifiedOnly) where.push('e.contact_id IS NOT NULL');
  return all(
    `SELECT e.*, c.email, c.first_name, c.last_name, c.company, c.score, c.grade
     FROM events e LEFT JOIN contacts c ON c.id = e.contact_id
     ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
     ORDER BY e.occurred_at DESC LIMIT ${Number(limit)}`,
    ...args,
  ).map(hydrate);
}

const hydrate = (e) => ({ ...e, meta: parseJson(e.meta, {}) });

/** Daily counts per channel, for the console's activity chart. */
export function eventSeries({ days = 30 } = {}) {
  return all(
    `SELECT substr(occurred_at, 1, 10) AS day, channel, COUNT(*) AS n
     FROM events
     WHERE occurred_at >= datetime('now', ?)
     GROUP BY day, channel ORDER BY day`,
    `-${Number(days)} days`,
  );
}

/** Pages ranked by engaged (identified) traffic — the ABM view of content. */
export function topPages({ days = 30, limit = 15 } = {}) {
  return all(
    `SELECT path,
            COUNT(*) AS views,
            COUNT(DISTINCT contact_id) AS contacts,
            COUNT(DISTINCT CASE WHEN contact_id IS NULL THEN visitor_id END) AS anon_visitors
     FROM events
     WHERE type = 'page_view' AND occurred_at >= datetime('now', ?) AND path IS NOT NULL
     GROUP BY path ORDER BY views DESC LIMIT ${Number(limit)}`,
    `-${Number(days)} days`,
  );
}

/** Resolves an email seen in the wild (form fill, lead form) to a contact id. */
export function contactIdForEmail(email) {
  const n = normalizeEmail(email);
  if (!n) return null;
  return get('SELECT id FROM contacts WHERE email = ?', n)?.id ?? null;
}
