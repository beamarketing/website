import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../../config.js';
import {
  Router, json, text, html, redirect, pixel, readBody, parseCookies, setCookie,
  clientIp, corsHeaders, RateLimiter,
} from '../../lib/http.js';
import { escapeHtml, verifyToken } from '../../lib/util.js';
import { ingestBatch } from '../../core/tracking.js';
import * as emailTracking from '../../channels/email/tracking.js';
import { get } from '../../db/index.js';
import { logger } from '../../lib/logger.js';

const log = logger('track');
const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, '..', 'public');

// These endpoints are public by necessity, so they are rate-limited per IP.
const collectorLimit = new RateLimiter(600, 60_000);
const openLimit = new RateLimiter(1200, 60_000);

export const track = new Router();

let trackerJs = null;
function tracker() {
  if (trackerJs === null || config.env === 'development') {
    trackerJs = readFileSync(join(publicDir, 'beamr.js'), 'utf8');
  }
  return trackerJs;
}

// ------------------------------------------------------------- tracker JS --
track.get('/t/beamr.js', async (req, res) => {
  res.writeHead(200, {
    'content-type': 'application/javascript; charset=utf-8',
    'cache-control': 'public, max-age=3600',
    'access-control-allow-origin': '*',
  });
  res.end(tracker());
});

// ----------------------------------------------------------- the collector --
track.add('OPTIONS', '/t/e', async (req, res) => {
  const cors = corsHeaders(req);
  res.writeHead(cors ? 204 : 403, cors || {});
  res.end();
});

track.post('/t/e', async (req, res) => {
  const cors = corsHeaders(req);
  if (!cors) {
    // Origin not on the allow-list: refuse rather than collect quietly.
    res.writeHead(403, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'origin not allowed' }));
    return;
  }

  const ip = clientIp(req);
  if (!collectorLimit.check(ip)) {
    res.writeHead(429, { ...cors, 'retry-after': '60' });
    res.end();
    return;
  }

  // The tracker sends text/plain so the browser skips the CORS preflight.
  const raw = (await readBody(req, 256 * 1024)).toString('utf8');
  let body;
  try { body = JSON.parse(raw); } catch { body = null; }
  if (!body) {
    res.writeHead(400, cors);
    res.end();
    return;
  }

  const result = ingestBatch(body, {
    ip,
    userAgent: req.headers['user-agent'],
    referer: req.headers.referer,
  });

  // Mirror the visitor id into a server-set cookie: it survives the Safari
  // 7-day cap on script-written cookies, which is where most first-party
  // analytics quietly loses returning visitors.
  const vid = body.events?.[0]?.vid;
  if (vid && /^[\w-]{8,64}$/.test(vid) && !parseCookies(req).bmr_vid) {
    setCookie(res, 'bmr_vid', vid, { days: config.cookieDays });
  }

  res.writeHead(204, cors);
  res.end();
});

// ------------------------------------------------------------ email opens --
track.get('/t/o/:token.gif', async (req, res, { params }) => {
  if (openLimit.check(clientIp(req))) {
    try { emailTracking.handleOpen(params.token, { userAgent: req.headers['user-agent'] }); }
    catch (err) { log.warn(`open beacon failed: ${err.message}`); }
  }
  pixel(res); // always return the pixel, even on a bad token
});

// ----------------------------------------------------------- email clicks --
track.get('/t/c/:token/:linkId', async (req, res, { params }) => {
  let destination = config.publicUrl;
  try {
    const result = emailTracking.handleClick(params.token, params.linkId, { userAgent: req.headers['user-agent'] });
    if (result.ok) {
      destination = result.url;
      // Bind the browser to the contact even before the site tracker loads.
      const vid = parseCookies(req).bmr_vid;
      if (vid) emailTracking.linkVisitorFromClick(vid, result.contactId);
    }
  } catch (err) {
    log.warn(`click redirect failed: ${err.message}`);
  }
  redirect(res, destination, 302);
});

// ------------------------------------------------------------ unsubscribe --
// RFC 8058 one-click: the mailbox provider POSTs, with no human in the loop.
track.post('/u/:token', async (req, res, { params }) => {
  const body = (await readBody(req, 4096)).toString('utf8');
  const oneClick = /List-Unsubscribe=One-Click/i.test(body);
  const result = emailTracking.handleUnsubscribe(params.token, {
    source: oneClick ? 'one_click' : 'post',
  });
  if (!result.ok) { text(res, 'Invalid link', 400); return; }
  text(res, 'You have been unsubscribed.', 200);
});

track.get('/u/:token', async (req, res, { params }) => {
  const url = new URL(req.url, config.publicUrl);
  const payload = verifyToken(params.token);
  if (!payload?.c) { html(res, page('Invalid link', '<p>This unsubscribe link is not valid or has expired.</p>'), 400); return; }
  const contact = get('SELECT * FROM contacts WHERE id = ?', payload.c);
  if (!contact) { html(res, page('Invalid link', '<p>We could not find that subscription.</p>'), 404); return; }

  const action = url.searchParams.get('action');
  if (action === 'unsubscribe') {
    emailTracking.handleUnsubscribe(params.token, { source: 'preference_centre' });
    html(res, page('Unsubscribed', `
      <p>You will no longer receive marketing email from Beamr at <strong>${escapeHtml(contact.email)}</strong>.</p>
      <form method="get"><input type="hidden" name="action" value="resubscribe" />
        <button type="submit" class="link">Changed your mind? Resubscribe</button></form>`));
    return;
  }
  if (action === 'resubscribe') {
    emailTracking.handleResubscribe(params.token);
    html(res, page('Resubscribed', `<p>You are subscribed again at <strong>${escapeHtml(contact.email)}</strong>.</p>`));
    return;
  }
  if (action === 'ads-off' || action === 'ads-on') {
    emailTracking.setAdConsent(params.token, action === 'ads-on');
    html(res, page('Preferences saved', `<p>Your advertising preference has been updated.</p><p><a href="?prefs=1">Back to preferences</a></p>`));
    return;
  }

  // Preference centre: unsubscribing from everything should not be the only
  // option, or people who just want less will mark it as spam instead.
  const unsubscribed = contact.status === 'unsubscribed' || !contact.consent_email;
  html(res, page('Email preferences', `
    <p>Preferences for <strong>${escapeHtml(contact.email)}</strong></p>
    <div class="row">
      <div>
        <strong>Marketing email</strong>
        <div class="muted">Product news, case studies and event invitations.</div>
      </div>
      <form method="get">
        <input type="hidden" name="action" value="${unsubscribed ? 'resubscribe' : 'unsubscribe'}" />
        <button type="submit" class="${unsubscribed ? 'on' : 'off'}">${unsubscribed ? 'Subscribe' : 'Unsubscribe'}</button>
      </form>
    </div>
    <div class="row">
      <div>
        <strong>Personalised advertising</strong>
        <div class="muted">Let Beamr show you relevant ads on LinkedIn.</div>
      </div>
      <form method="get">
        <input type="hidden" name="action" value="${contact.consent_ads ? 'ads-off' : 'ads-on'}" />
        <button type="submit" class="${contact.consent_ads ? 'off' : 'on'}">${contact.consent_ads ? 'Turn off' : 'Turn on'}</button>
      </form>
    </div>
    <p class="muted small">${escapeHtml(config.email.postalAddress)}</p>`));
});

function page(title, bodyHtml) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)} · Beamr</title>
<style>
  :root { color-scheme: light dark; }
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
    font:15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;
    background:#07071c; color:#f5f5fb; padding:24px; }
  .card { max-width:520px; width:100%; background:#0f1029; border:1px solid rgba(255,255,255,.08);
    border-radius:18px; padding:32px; box-shadow:0 24px 60px -24px rgba(0,0,0,.7); }
  h1 { margin:0 0 16px; font-size:20px; font-weight:700; }
  p { margin:0 0 12px; color:#a2a2c0; }
  strong { color:#f5f5fb; font-weight:600; }
  .row { display:flex; align-items:center; justify-content:space-between; gap:16px;
    padding:16px 0; border-top:1px solid rgba(255,255,255,.08); }
  .muted { color:#6f6f8f; font-size:13px; }
  .small { font-size:12px; margin-top:20px; }
  button { font:inherit; font-size:13px; font-weight:600; border-radius:9px; padding:8px 14px;
    border:1px solid rgba(255,255,255,.14); cursor:pointer; white-space:nowrap; }
  button.off { background:transparent; color:#f5f5fb; }
  button.on { background:#00d46a; color:#04120a; border-color:#00d46a; }
  button.link { background:none; border:none; color:#00d46a; padding:0; text-decoration:underline; }
  a { color:#00d46a; }
  .logo { font-weight:800; letter-spacing:-.02em; color:#00d46a; margin-bottom:20px; font-size:15px; }
</style></head>
<body><div class="card"><div class="logo">beamr</div><h1>${escapeHtml(title)}</h1>${bodyHtml}</div></body></html>`;
}
