import { get, run } from '../../db/index.js';
import { config } from '../../config.js';
import { id, now, signToken, verifyToken, parseJson } from '../../lib/util.js';
import { originAllowed } from '../../lib/http.js';
import { recordEvent, identifyVisitor } from '../../core/events.js';
import { logger } from '../../lib/logger.js';

const log = logger('email:tracking');

/**
 * Email tracking is what makes email a *contact-level* channel rather than a
 * broadcast. Every URL carries a signed token identifying the send, so an open
 * or a click resolves to one person, and the click hands that identity to the
 * website tracker via ?bmr_c=.
 */

export const openUrl = (token) => `${config.publicUrl}/t/o/${token}.gif`;
export const clickUrl = (token, linkId) => `${config.publicUrl}/t/c/${token}/${linkId}`;
export const unsubUrl = (token) => `${config.publicUrl}/u/${token}`;
export const prefsUrl = (token) => `${config.publicUrl}/u/${token}?prefs=1`;

/** Token bound to one send; `c` lets the site tracker identify the browser. */
export const sendToken = (sendId, contactId) => signToken({ s: sendId, c: contactId });

/**
 * Rewrites every <a href> in the HTML to route through our click tracker,
 * registering each distinct destination as a campaign link.
 * Unsubscribe/mailto/anchor links are deliberately left alone.
 */
export function rewriteLinks(html, campaignId) {
  const links = new Map();
  const rewritten = String(html || '').replace(
    /(<a\b[^>]*?\bhref=)(["'])(.*?)\2/gi,
    (match, prefix, quote, href) => {
      const url = href.trim();
      if (!/^https?:\/\//i.test(url)) return match;              // anchors, mailto:, tel:
      if (url.includes('{{')) return match;                      // unresolved merge tag
      if (url.startsWith(`${config.publicUrl}/u/`)) return match; // unsubscribe
      if (/\bbmr-no-track\b/.test(match)) return match;          // explicit opt-out

      let linkId = links.get(url);
      if (!linkId) {
        const existing = get('SELECT id FROM email_links WHERE campaign_id = ? AND url = ?', campaignId, url);
        linkId = existing?.id || id('lk');
        if (!existing) {
          run('INSERT INTO email_links (id, campaign_id, url, label) VALUES (?,?,?,?)', linkId, campaignId, url, null);
        }
        links.set(url, linkId);
      }
      return `${prefix}${quote}__BMR_CLICK__${linkId}__${quote}`;
    },
  );
  return { html: rewritten, links: [...links.entries()].map(([url, linkId]) => ({ url, linkId })) };
}

/** Second pass, per recipient: swaps placeholders for this send's token. */
export function personalizeLinks(html, token) {
  return String(html || '').replace(/__BMR_CLICK__([\w]+)__/g, (_m, linkId) => clickUrl(token, linkId));
}

/** Appends the open beacon and the legally required footer. */
export function decorateHtml(html, { token, campaignName }) {
  const beacon = `<img src="${openUrl(token)}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;outline:none" />`;
  const footer = `
<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8b8ba3">
  <p style="margin:0 0 6px">You are receiving this because you are on Beamr's contact list${campaignName ? ` (${escapeAttr(campaignName)})` : ''}.</p>
  <p style="margin:0 0 6px">${escapeAttr(config.email.postalAddress)}</p>
  <p style="margin:0"><a href="${unsubUrl(token)}" style="color:#8b8ba3;text-decoration:underline">Unsubscribe</a> &nbsp;·&nbsp; <a href="${prefsUrl(token)}" style="color:#8b8ba3;text-decoration:underline">Email preferences</a></p>
</div>`;

  const body = String(html || '');
  if (/<\/body>/i.test(body)) return body.replace(/<\/body>/i, `${footer}${beacon}</body>`);
  return `${body}${footer}${beacon}`;
}

const escapeAttr = (s) => String(s ?? '').replace(/[<>"&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', '&': '&amp;' }[c]));

/** Stamps ?bmr_c= on our own links so the click identifies the browser. */
export function stampIdentity(url, token) {
  try {
    const u = new URL(url);
    u.searchParams.set('bmr_c', token);
    return u.toString();
  } catch { return url; }
}

// ------------------------------------------------------------- ingest hooks --
export function handleOpen(token, meta = {}) {
  const payload = verifyToken(token);
  if (!payload?.s) return { ok: false };
  const send = get('SELECT * FROM sends WHERE id = ?', payload.s);
  if (!send) return { ok: false };

  // Image proxies (Gmail) prefetch the beacon once; count it, but never twice
  // in the same minute for the same send.
  const minute = new Date().toISOString().slice(0, 16);
  run(
    `UPDATE sends SET open_count = open_count + 1, opened_at = COALESCE(opened_at, ?) WHERE id = ?`,
    now(), send.id,
  );
  recordEvent({
    contact_id: send.contact_id,
    channel: 'email',
    type: 'email_open',
    campaign_id: send.campaign_id,
    meta: { send_id: send.id, proxied: /GoogleImageProxy|YahooMailProxy/i.test(meta.userAgent || '') },
    dedupe_key: `open:${send.id}:${minute}`,
  });
  return { ok: true, contactId: send.contact_id };
}

export function handleClick(token, linkId, meta = {}) {
  const payload = verifyToken(token);
  if (!payload?.s) return { ok: false };
  const send = get('SELECT * FROM sends WHERE id = ?', payload.s);
  const link = get('SELECT * FROM email_links WHERE id = ?', linkId);
  if (!send || !link) return { ok: false };

  run(
    `UPDATE sends SET click_count = click_count + 1, first_click_at = COALESCE(first_click_at, ?),
       opened_at = COALESCE(opened_at, ?) WHERE id = ?`,
    now(), now(), send.id,
  );
  run('UPDATE email_links SET click_count = click_count + 1 WHERE id = ?', linkId);

  recordEvent({
    contact_id: send.contact_id,
    channel: 'email',
    type: 'email_click',
    campaign_id: send.campaign_id,
    url: link.url,
    meta: { send_id: send.id, link_id: linkId, user_agent: String(meta.userAgent || '').slice(0, 200) },
    dedupe_key: `click:${send.id}:${linkId}:${new Date().toISOString().slice(0, 16)}`,
  });

  // If the click lands on a site we track, carry the identity across.
  const destination = shouldStamp(link.url) ? stampIdentity(link.url, token) : link.url;
  return { ok: true, url: destination, contactId: send.contact_id };
}

function shouldStamp(url) {
  try { return originAllowed(new URL(url).origin); } catch { return false; }
}

export function handleUnsubscribe(token, { reason = 'unsubscribe', source = 'link' } = {}) {
  const payload = verifyToken(token);
  if (!payload?.c) return { ok: false };
  const contact = get('SELECT * FROM contacts WHERE id = ?', payload.c);
  if (!contact) return { ok: false };

  run(
    "UPDATE contacts SET status = 'unsubscribed', consent_email = 0, updated_at = ? WHERE id = ?",
    now(), contact.id,
  );
  run(
    `INSERT INTO suppressions (email, reason, source, created_at) VALUES (?,?,?,?)
     ON CONFLICT(email) DO UPDATE SET reason = excluded.reason, source = excluded.source`,
    contact.email, reason, source, now(),
  );
  recordEvent({
    contact_id: contact.id,
    channel: 'email',
    type: 'email_unsubscribe',
    campaign_id: payload.s ? get('SELECT campaign_id FROM sends WHERE id = ?', payload.s)?.campaign_id : null,
    meta: { source, reason },
  });
  log.info(`unsubscribed ${contact.email} (${source})`);
  return { ok: true, contact };
}

/** Re-subscribe from the preference centre. */
export function handleResubscribe(token) {
  const payload = verifyToken(token);
  if (!payload?.c) return { ok: false };
  const contact = get('SELECT * FROM contacts WHERE id = ?', payload.c);
  if (!contact) return { ok: false };
  run("UPDATE contacts SET status = 'active', consent_email = 1, updated_at = ? WHERE id = ?", now(), contact.id);
  run('DELETE FROM suppressions WHERE email = ?', contact.email);
  return { ok: true, contact };
}

/** Updates ad-targeting consent from the preference centre. */
export function setAdConsent(token, allow) {
  const payload = verifyToken(token);
  if (!payload?.c) return { ok: false };
  run('UPDATE contacts SET consent_ads = ?, updated_at = ? WHERE id = ?', allow ? 1 : 0, now(), payload.c);
  if (!allow) {
    // Honouring this means pulling them out of every live matched audience.
    run("UPDATE li_audience_members SET state = 'removed' WHERE contact_id = ?", payload.c);
  }
  return { ok: true };
}

/** Records a bounce or spam complaint fed in by a provider webhook. */
export function handleBounce({ email, sendId = null, type = 'bounce', hard = true, detail = {} }) {
  const contact = get('SELECT * FROM contacts WHERE email = ?', String(email || '').toLowerCase());
  if (!contact) return { ok: false };
  const status = type === 'complaint' ? 'complained' : (hard ? 'bounced' : contact.status);
  run('UPDATE contacts SET status = ?, updated_at = ? WHERE id = ?', status, now(), contact.id);
  if (hard || type === 'complaint') {
    run(
      `INSERT INTO suppressions (email, reason, source, created_at) VALUES (?,?,?,?)
       ON CONFLICT(email) DO UPDATE SET reason = excluded.reason`,
      contact.email, type, 'provider_webhook', now(),
    );
  }
  if (sendId) run("UPDATE sends SET status = 'bounced' WHERE id = ?", sendId);
  recordEvent({
    contact_id: contact.id,
    channel: 'email',
    type: type === 'complaint' ? 'email_complaint' : 'email_bounce',
    meta: { hard, ...parseJson(detail, {}) },
  });
  return { ok: true };
}

/** Called after a click so the visitor cookie gets bound to the contact. */
export function linkVisitorFromClick(visitorId, contactId) {
  if (visitorId && contactId) identifyVisitor(visitorId, contactId);
}
