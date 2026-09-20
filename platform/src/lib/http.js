import { config } from '../config.js';
import { safeEqual } from './util.js';

/** Tiny pattern router: '/api/contacts/:id' → params.id */
export class Router {
  constructor() { this.routes = []; }

  add(method, pattern, handler, opts = {}) {
    const keys = [];
    const rx = new RegExp('^' + pattern
      .replace(/\/+$/, '')
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/:(\w+)/g, (_m, k) => { keys.push(k); return '([^/]+)'; })
      .replace(/\*/g, '(.*)') + '/?$');
    this.routes.push({ method, rx, keys, handler, opts });
    return this;
  }

  get(p, h, o) { return this.add('GET', p, h, o); }
  post(p, h, o) { return this.add('POST', p, h, o); }
  put(p, h, o) { return this.add('PUT', p, h, o); }
  patch(p, h, o) { return this.add('PATCH', p, h, o); }
  delete(p, h, o) { return this.add('DELETE', p, h, o); }

  match(method, pathname) {
    for (const route of this.routes) {
      if (route.method !== method && route.method !== 'ALL') continue;
      const m = route.rx.exec(pathname.replace(/\/+$/, '') || '/');
      if (!m) continue;
      const params = {};
      route.keys.forEach((k, i) => { params[k] = safeDecode(m[i + 1]); });
      return { ...route, params };
    }
    return null;
  }
}

const safeDecode = (s) => { try { return decodeURIComponent(s); } catch { return s; } };

export class HttpError extends Error {
  constructor(status, message, detail = null) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}
export const badRequest = (m, d) => new HttpError(400, m, d);
export const notFound = (m = 'Not found') => new HttpError(404, m);
export const unauthorized = (m = 'Unauthorized') => new HttpError(401, m);

// ------------------------------------------------------------------ replies --
export function json(res, body, status = 200, headers = {}) {
  const payload = JSON.stringify(body ?? null);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...headers,
  });
  res.end(payload);
}

export function text(res, body, status = 200, headers = {}) {
  res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8', ...headers });
  res.end(body);
}

export function html(res, body, status = 200, headers = {}) {
  res.writeHead(status, { 'content-type': 'text/html; charset=utf-8', ...headers });
  res.end(body);
}

export function redirect(res, location, status = 302) {
  res.writeHead(status, { location, 'cache-control': 'no-store' });
  res.end();
}

// 1×1 transparent GIF — the email open beacon.
export const PIXEL_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64',
);
export function pixel(res) {
  res.writeHead(200, {
    'content-type': 'image/gif',
    'content-length': PIXEL_GIF.length,
    // Proxies must never serve a cached open beacon.
    'cache-control': 'no-store, no-cache, must-revalidate, private',
    pragma: 'no-cache',
    expires: '0',
  });
  res.end(PIXEL_GIF);
}

// ------------------------------------------------------------------ request --
export async function readBody(req, limit = 2 * 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > limit) throw badRequest('Request body too large');
    chunks.push(c);
  }
  return Buffer.concat(chunks);
}

export async function readJson(req, limit) {
  const buf = await readBody(req, limit);
  if (!buf.length) return {};
  try { return JSON.parse(buf.toString('utf8')); }
  catch { throw badRequest('Invalid JSON body'); }
}

export function parseCookies(req) {
  const out = {};
  const header = req.headers.cookie;
  if (!header) return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i === -1) continue;
    out[part.slice(0, i).trim()] = safeDecode(part.slice(i + 1).trim());
  }
  return out;
}

export function setCookie(res, name, value, { days = 365, sameSite = 'Lax', httpOnly = false } = {}) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${Math.round(days * 86400)}`,
    `SameSite=${sameSite}`,
  ];
  if (httpOnly) parts.push('HttpOnly');
  if (config.publicUrl.startsWith('https://')) parts.push('Secure');
  const existing = res.getHeader('set-cookie');
  const list = existing ? [].concat(existing) : [];
  list.push(parts.join('; '));
  res.setHeader('set-cookie', list);
}

/** Client IP, honouring a reverse proxy's X-Forwarded-For. */
export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return req.socket?.remoteAddress || '';
}

// --------------------------------------------------------------------- auth --
export function requireAuth(req) {
  const header = req.headers.authorization || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const token = bearer || new URL(req.url, 'http://x').searchParams.get('token') || '';
  if (!token || !config.adminToken || !safeEqual(token, config.adminToken)) {
    throw unauthorized('Missing or invalid admin token');
  }
  return true;
}

/**
 * Normalises an allow-list entry or an Origin header down to a bare hostname,
 * so "beamr.com", "https://beamr.com" and "https://beamr.com/" all compare equal.
 */
function hostOf(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    return new URL(raw.includes('://') ? raw : `https://${raw}`).hostname.toLowerCase();
  } catch {
    return raw.replace(/^https?:\/\//, '').replace(/[/:].*$/, '').toLowerCase();
  }
}

/** True when `origin` is the allowed host itself or a subdomain of it. */
export function originAllowed(origin, allowed = config.trackingOrigins) {
  if (allowed.includes('*')) return true;
  const host = hostOf(origin);
  if (!host) return false;
  return allowed.some((entry) => {
    const allowHost = hostOf(entry);
    if (!allowHost) return false;
    return host === allowHost || host.endsWith(`.${allowHost}`);
  });
}

/** CORS for the tracking collector — the only cross-origin surface. */
export function corsHeaders(req) {
  const origin = req.headers.origin;
  const allowed = config.trackingOrigins;
  let allow = null;
  if (allowed.includes('*')) allow = origin || '*';
  else if (origin && originAllowed(origin, allowed)) allow = origin;
  if (!allow) return null;
  return {
    'access-control-allow-origin': allow,
    'access-control-allow-methods': 'POST, GET, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    ...(allow !== '*' ? { 'access-control-allow-credentials': 'true', vary: 'Origin' } : {}),
  };
}

/** Fixed-window rate limiter for public endpoints. */
export class RateLimiter {
  constructor(limit = 240, windowMs = 60_000) {
    this.limit = limit; this.windowMs = windowMs; this.hits = new Map();
    this.timer = setInterval(() => this.sweep(), windowMs).unref?.();
  }
  check(key) {
    const nowMs = Date.now();
    const entry = this.hits.get(key);
    if (!entry || nowMs - entry.start > this.windowMs) {
      this.hits.set(key, { start: nowMs, count: 1 });
      return true;
    }
    entry.count += 1;
    return entry.count <= this.limit;
  }
  sweep() {
    const cutoff = Date.now() - this.windowMs;
    for (const [k, v] of this.hits) if (v.start < cutoff) this.hits.delete(k);
  }
}
