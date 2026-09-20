import { get, run } from '../db/index.js';
import { recordEvent, ensureVisitor, identifyVisitor, contactIdForEmail } from './events.js';
import { upsertContact } from './contacts.js';
import { verifyToken, normalizeEmail, dissectUrl, now, id, buildFbc } from '../lib/util.js';
import { cohortFromToken } from '../channels/ads/cohorts.js';
import { logger } from '../lib/logger.js';

const log = logger('tracking');

// Types the public collector will accept. Anything else is dropped — the
// endpoint is unauthenticated, so it must not be a free-form event writer.
const ALLOWED = new Set([
  'page_view', 'session_start', 'click', 'form_submit', 'scroll_depth', 'time_on_page',
  'video_play', 'download', 'identify', 'custom', 'pricing_view', 'demo_request', 'signup',
]);

const MAX_EVENTS_PER_BATCH = 30;

/**
 * Ingests one batch from the browser tracker.
 * `meta` carries request-level context (UA, IP, referer) the client can lie
 * about but which is still useful for first-touch attribution.
 */
export function ingestBatch(body, meta = {}) {
  const events = Array.isArray(body?.events) ? body.events.slice(0, MAX_EVENTS_PER_BATCH) : [];
  if (!events.length) return { accepted: 0 };

  const result = { accepted: 0, rejected: 0, identified: null };
  let visitorId = null;

  for (const raw of events) {
    const vid = String(raw.vid || '').slice(0, 64);
    if (!vid || !/^[\w-]{8,64}$/.test(vid)) { result.rejected += 1; continue; }
    const type = String(raw.type || '').slice(0, 40);
    if (!ALLOWED.has(type)) { result.rejected += 1; continue; }

    if (vid !== visitorId) {
      visitorId = vid;
      ensureVisitor(vid, {
        user_agent: meta.userAgent,
        ip: meta.ip,
        referrer: raw.referrer || meta.referer,
        url: raw.url,
        utm: raw.url ? pickUtm(dissectUrl(raw.url)) : {},
      });
    }

    // An identify event is a resolution instruction, not a stored page hit.
    if (type === 'identify') {
      const resolved = resolveIdentity(raw, vid);
      if (resolved) result.identified = resolved;
      result.accepted += 1;
      continue;
    }

    // A form submit that carries an email identifies the browser too.
    if (type === 'form_submit' && raw.email) {
      const resolved = resolveIdentity({ email: raw.email, traits: raw.meta?.fields || {} }, vid);
      if (resolved) result.identified = resolved;
    }

    const visitor = get('SELECT contact_id FROM visitors WHERE id = ?', vid);
    const parts = raw.url ? dissectUrl(raw.url) : {};

    recordEvent({
      contact_id: visitor?.contact_id || null,
      visitor_id: vid,
      channel: 'web',
      type,
      occurred_at: safeTimestamp(raw.ts),
      url: raw.url,
      path: raw.path || parts.path,
      title: String(raw.title || '').slice(0, 300),
      referrer: String(raw.referrer || meta.referer || '').slice(0, 500),
      value: Number.isFinite(Number(raw.value)) ? Number(raw.value) : null,
      meta: {
        ...sanitizeMeta(raw.meta),
        // Meta's own browser ids, captured so server-side conversions can be
        // matched back to the ad click that produced them.
        ...(raw.fbp ? { fbp: String(raw.fbp).slice(0, 128) } : {}),
        ...(raw.fbc ? { fbc: String(raw.fbc).slice(0, 256) } : {}),
        ...(meta.ip ? { ip: meta.ip } : {}),
        ...(meta.userAgent ? { user_agent: String(meta.userAgent).slice(0, 300) } : {}),
      },
      // LinkedIn stamps li_fat_id on ad clicks landing on our site — that is
      // how an ad click becomes a contact-level event rather than a stat.
      ad_campaign_id: parts.ad_campaign_id || null,
      creative_id: parts.creative_id || null,
    });

    // A page arrival carrying a network's click id is itself an ad engagement.
    // This is how an ad click becomes a contact-level event on either platform:
    // the network never tells us who saw the ad, but the landing URL tells us
    // this browser arrived from it, and identity resolution does the rest.
    if (type === 'page_view' && parts.platform) {
      const cohort = parts.cohort_token ? cohortFromToken(parts.cohort_token) : null;
      const platform = cohort?.platform || parts.platform;
      recordEvent({
        contact_id: visitor?.contact_id || null,
        visitor_id: vid,
        channel: 'ads',
        type: 'ad_click',
        platform,
        occurred_at: safeTimestamp(raw.ts),
        url: raw.url,
        path: raw.path || parts.path,
        ad_campaign_id: cohort?.ad_campaign_id || parts.ad_campaign_id || null,
        creative_id: cohort?.creative_id || parts.creative_id || null,
        cohort_id: cohort?.id || null,
        utm_source: parts.utm_source,
        utm_campaign: parts.utm_campaign,
        utm_content: parts.utm_content,
        meta: {
          source: 'landing_params',
          li_fat_id: parts.li_fat_id || null,
          fbclid: parts.fbclid || null,
          // Meta needs fbc back on the Conversions API call to tie the
          // server-side event to the ad click it came from.
          fbc: raw.fbc || (parts.fbclid ? buildFbc(parts.fbclid) : null),
          fbp: raw.fbp || null,
          cohort: cohort ? { id: cohort.id, label: cohort.label, seq: cohort.seq } : null,
        },
        // One ad click per visitor per campaign per hour, however many times
        // they reload the landing page.
        dedupe_key: `adclick:${vid}:${platform}:${cohort?.id || parts.ad_campaign_id || parts.utm_campaign || 'na'}:${new Date().toISOString().slice(0, 13)}`,
      });
    }

    result.accepted += 1;
  }

  return result;
}

function pickUtm(parts) {
  const out = {};
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    if (parts[k]) out[k] = parts[k];
  }
  return out;
}

function safeTimestamp(ts) {
  const d = new Date(ts || Date.now());
  if (Number.isNaN(d.getTime())) return now();
  // Reject client clocks that are wildly wrong rather than corrupting the timeline.
  const drift = Math.abs(d.getTime() - Date.now());
  return drift > 7 * 86400000 ? now() : d.toISOString();
}

/** Trims arbitrary client metadata down to something safe to store. */
function sanitizeMeta(meta) {
  if (!meta || typeof meta !== 'object') return {};
  const out = {};
  let count = 0;
  for (const [key, value] of Object.entries(meta)) {
    if (count++ >= 20) break;
    const k = String(key).slice(0, 40);
    if (value === null || value === undefined) continue;
    if (typeof value === 'object') {
      const nested = {};
      let n = 0;
      for (const [k2, v2] of Object.entries(value)) {
        if (n++ >= 20) break;
        nested[String(k2).slice(0, 40)] = String(v2).slice(0, 200);
      }
      out[k] = nested;
    } else out[k] = String(value).slice(0, 500);
  }
  return out;
}

/**
 * Turns an identify signal into a contact link.
 * A signed `bmr_c` token (from an email link) is trusted outright. A raw email
 * typed into a form is only trusted enough to match an existing contact, or to
 * create one when the visitor typed it into our own form.
 */
export function resolveIdentity(raw, visitorId) {
  let contactId = null;

  if (raw.token) {
    const payload = verifyToken(raw.token);
    if (payload?.c) contactId = payload.c;
    else log.warn('rejected unsigned identify token');
  }

  if (!contactId && raw.email) {
    const email = normalizeEmail(raw.email);
    if (!email) return null;
    contactId = contactIdForEmail(email);
    if (!contactId) {
      // Self-identified on our own site: a legitimate new inbound contact.
      const traits = raw.traits || {};
      const { contact } = upsertContact({
        email,
        first_name: traits.first_name || traits.firstname || traits.fname || null,
        last_name: traits.last_name || traits.lastname || traits.lname || null,
        company: traits.company || traits.organization || null,
        job_title: traits.title || traits.job_title || null,
        source: 'website_form',
        lifecycle_stage: 'engaged',
      }, { source: 'website_form' });
      contactId = contact.id;
      log.info(`new inbound contact from website: ${email}`);
    }
  }

  if (!contactId) return null;
  identifyVisitor(visitorId, contactId);
  return contactId;
}

/**
 * Server-side event ingestion for things the browser cannot see —
 * a backend trial signup, a CRM stage change, an offline meeting.
 */
export function ingestServerEvent({ email, contact_id: contactIdIn, type, ...rest }) {
  const contactId = contactIdIn || (email ? contactIdForEmail(email) : null);
  if (!contactId && email) {
    const { contact } = upsertContact({ email, source: 'server_api' });
    return recordEvent({ ...rest, type, contact_id: contact.id, channel: rest.channel || 'web' });
  }
  if (!contactId) return { event: null, error: 'unknown contact' };
  return recordEvent({ ...rest, type, contact_id: contactId });
}

/** The snippet a site owner pastes into their <head>. */
export function snippet(publicUrl) {
  return `<!-- Beamr contact-based marketing tracker -->
<script>
  window.beamr = window.beamr || function () { (window.beamr.q = window.beamr.q || []).push(arguments); };
</script>
<script async src="${publicUrl}/t/beamr.js" data-beamr-host="${publicUrl}"></script>`;
}

/** Records a rejected/blocked ingest for the ops view. */
export function noteIngestError(reason) {
  run(
    'INSERT INTO job_runs (id, job, status, detail, ran_at) VALUES (?,?,?,?,?)',
    id('jr'), 'tracking_ingest', 'error', JSON.stringify({ reason }), now(),
  );
}
