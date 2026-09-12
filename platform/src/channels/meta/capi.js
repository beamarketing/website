import { all, get, run } from '../../db/index.js';
import { config, isDryRun } from '../../config.js';
import { id, now, sha256 } from '../../lib/util.js';
import { MetaClient } from './client.js';
import { capiUserData } from './normalize.js';
import { logger } from '../../lib/logger.js';

const log = logger('meta:capi');

/**
 * Meta Conversions API — first-party website events forwarded server-side.
 *
 * Why this matters for contact-based marketing specifically: browser pixels are
 * blocked or truncated for a large share of traffic, and we already know who
 * the visitor is. Sending the event server-side with a hashed email attaches
 * behaviour to the person far more reliably than the pixel can, and it is the
 * only way Meta learns that a *named targeted contact* converted.
 *
 * Deduplication is the thing people get wrong: if the browser pixel and the
 * server both report the same action, Meta counts it twice unless both carry
 * the same `event_id`. We derive a deterministic id from our own event row, so
 * a retry never double-counts either.
 */

// Our event types → Meta's standard event names. Anything unmapped is sent as
// a custom event, which Meta accepts but cannot optimise against as well.
const EVENT_MAP = {
  page_view: 'PageView',
  pricing_view: 'ViewContent',
  form_submit: 'Lead',
  demo_request: 'Lead',
  signup: 'CompleteRegistration',
  download: 'ViewContent',
  video_play: 'ViewContent',
  email_click: 'ViewContent',
  ad_lead_form: 'Lead',
  custom: 'ViewContent',
};

/** Stable per-event id shared with the browser pixel for dedup. */
export const eventIdFor = (event) => `bmr_${event.id}`;

function toMetaEvent(event, contact) {
  const eventName = EVENT_MAP[event.type] || 'ViewContent';
  const meta = typeof event.meta === 'string' ? safeParse(event.meta) : (event.meta || {});

  const userData = capiUserData(contact, {
    fbp: meta.fbp || null,
    fbc: meta.fbc || null,
    ip: config.meta.capiSendClientContext ? (meta.ip || null) : null,
    userAgent: config.meta.capiSendClientContext ? (meta.user_agent || null) : null,
  });

  const payload = {
    event_name: eventName,
    event_time: Math.floor(new Date(event.occurred_at).getTime() / 1000),
    event_id: eventIdFor(event),
    action_source: event.channel === 'web' ? 'website' : 'system_generated',
    user_data: userData,
  };
  if (event.url) payload.event_source_url = event.url;

  const custom = {};
  if (event.path) custom.content_path = event.path;
  if (event.title) custom.content_name = event.title;
  if (event.value !== null && event.value !== undefined) custom.value = Number(event.value);
  // Our own engagement score, so Meta can optimise toward higher-intent people.
  if (contact?.score) custom.lead_score = contact.score;
  if (contact?.company) custom.company = contact.company;
  if (Object.keys(custom).length) payload.custom_data = custom;

  return payload;
}

const safeParse = (s) => { try { return JSON.parse(s); } catch { return {}; } };

/**
 * Meta will reject an event carrying no usable identifier, so we require at
 * least one: a hashed email, or one of Meta's own browser cookies.
 */
function isForwardable(payload) {
  const u = payload.user_data || {};
  return Boolean(u.em?.length || u.ph?.length || u.fbp || u.fbc || u.external_id?.length);
}

/** Forwards a batch of our event rows. Returns per-event outcomes. */
export async function forwardEvents(events, { pixelId = config.meta.pixelId } = {}) {
  const result = { sent: 0, skipped: 0, failed: 0, dry_run: isDryRun.meta || !pixelId };

  const prepared = [];
  for (const event of events) {
    // An event we already forwarded must never be sent again.
    if (get('SELECT id FROM ad_conversion_forwards WHERE platform = ? AND event_id = ?', 'meta', eventIdFor(event))) {
      result.skipped += 1;
      continue;
    }
    const contact = event.contact_id ? get('SELECT * FROM contacts WHERE id = ?', event.contact_id) : null;
    // Only forward people who agreed to ad targeting.
    if (contact && !contact.consent_ads) {
      recordForward(event, 'skipped', 'no ad consent');
      result.skipped += 1;
      continue;
    }
    const payload = toMetaEvent(event, contact);
    if (!isForwardable(payload)) {
      recordForward(event, 'skipped', 'no usable identifier');
      result.skipped += 1;
      continue;
    }
    prepared.push({ event, payload });
  }

  if (!prepared.length) return result;

  if (result.dry_run) {
    for (const { event } of prepared) recordForward(event, 'skipped', 'dry run — Meta not configured');
    result.skipped += prepared.length;
    log.info(`[dry run] would forward ${prepared.length} events to Meta CAPI`);
    return result;
  }

  // Meta caps a batch at 1000 events.
  for (let i = 0; i < prepared.length; i += 1000) {
    const slice = prepared.slice(i, i + 1000);
    try {
      const response = await new MetaClient().sendConversions(slice.map((p) => p.payload), { pixelId });
      for (const { event } of slice) recordForward(event, 'sent', null, response);
      result.sent += slice.length;
    } catch (err) {
      for (const { event } of slice) recordForward(event, 'failed', err.message);
      result.failed += slice.length;
      log.warn(`CAPI batch failed: ${err.message}`);
    }
  }

  if (result.sent) log.info(`forwarded ${result.sent} events to Meta CAPI`);
  return result;
}

function recordForward(event, status, error = null, response = null) {
  run(
    `INSERT INTO ad_conversion_forwards (id, platform, event_id, event_name, contact_id, status, error, response, created_at)
     VALUES (?,?,?,?,?,?,?,?,?)
     ON CONFLICT(platform, event_id) DO UPDATE SET status = excluded.status, error = excluded.error`,
    id('cf'), 'meta', eventIdFor(event), EVENT_MAP[event.type] || 'ViewContent',
    event.contact_id || null, status, error, response ? JSON.stringify(response).slice(0, 800) : null, now(),
  );
}

/**
 * Scheduler entry point: forwards recent conversion-worthy events that have not
 * been sent yet. Page views are deliberately excluded by default — forwarding
 * every page view is noisy and Meta optimises better on meaningful actions.
 */
export async function forwardPending({ sinceHours = 24, limit = 500, includePageViews = false } = {}) {
  if (!config.meta.capiEnabled) return { skipped: 'META_CAPI_ENABLED is false' };

  const types = includePageViews
    ? Object.keys(EVENT_MAP)
    : Object.keys(EVENT_MAP).filter((t) => t !== 'page_view');

  const events = all(
    `SELECT e.* FROM events e
     WHERE e.contact_id IS NOT NULL
       AND e.type IN (${types.map(() => '?').join(',')})
       AND e.occurred_at >= datetime('now', ?)
       AND NOT EXISTS (
         SELECT 1 FROM ad_conversion_forwards f
         WHERE f.platform = 'meta' AND f.event_id = 'bmr_' || e.id
       )
     ORDER BY e.occurred_at DESC LIMIT ?`,
    ...types, `-${Number(sinceHours)} hours`, Number(limit),
  );

  if (!events.length) return { sent: 0, skipped: 0, failed: 0, considered: 0 };
  const result = await forwardEvents(events);
  return { ...result, considered: events.length };
}

/** Recent forwarding activity, for the console's ops view. */
export function forwardStatus({ limit = 50 } = {}) {
  return {
    enabled: config.meta.capiEnabled,
    configured: Boolean(config.meta.pixelId) && !isDryRun.meta,
    pixel_id: config.meta.pixelId ? `${String(config.meta.pixelId).slice(0, 6)}…` : null,
    totals: get(
      `SELECT COUNT(*) AS total,
              SUM(status = 'sent') AS sent,
              SUM(status = 'failed') AS failed,
              SUM(status = 'skipped') AS skipped
       FROM ad_conversion_forwards WHERE platform = 'meta'`,
    ) || {},
    recent: all(
      `SELECT f.*, c.email FROM ad_conversion_forwards f
       LEFT JOIN contacts c ON c.id = f.contact_id
       WHERE f.platform = 'meta' ORDER BY f.created_at DESC LIMIT ?`,
      Number(limit),
    ),
  };
}
