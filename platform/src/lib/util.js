import { randomBytes, createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { config } from '../config.js';

// ---------------------------------------------------------------------- ids --
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';

/** Short, sortable-ish, URL-safe id with a type prefix (e.g. "ct_l8x2..."). */
export function id(prefix = '') {
  const time = Date.now().toString(36).padStart(9, '0');
  const rand = [...randomBytes(8)].map((b) => ALPHABET[b % 36]).join('');
  return prefix ? `${prefix}_${time}${rand}` : `${time}${rand}`;
}

export const now = () => new Date().toISOString();
export const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();
export const dayKey = (d = new Date()) => new Date(d).toISOString().slice(0, 10);

// ------------------------------------------------------------------- crypto --
export const sha256 = (s) => createHash('sha256').update(String(s), 'utf8').digest('hex');

export function hmac(value) {
  return createHmac('sha256', config.secret || 'insecure-dev-key').update(String(value)).digest('base64url').slice(0, 22);
}

/** Signed opaque token: <payload>.<sig>. Tamper-evident, not encrypted. */
export function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${hmac(body)}`;
}

export function verifyToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const idx = token.lastIndexOf('.');
  const body = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  if (!safeEqual(sig, hmac(body))) return null;
  try { return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')); } catch { return null; }
}

export function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

// -------------------------------------------------------------------- email --
/**
 * Normalises an address for identity matching AND for LinkedIn hashing.
 * LinkedIn matches on the lowercased, trimmed address — gmail dot/plus
 * tricks are deliberately NOT stripped, because LinkedIn does not strip them.
 */
export function normalizeEmail(raw) {
  if (!raw) return null;
  const email = String(raw).trim().toLowerCase();
  if (!/^[^\s@,;]+@[^\s@,;]+\.[a-z]{2,}$/i.test(email)) return null;
  return email;
}

export const emailHash = (email) => {
  const n = normalizeEmail(email);
  return n ? sha256(n) : null;
};

const FREE_MAIL = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com',
  'protonmail.com', 'proton.me', 'gmx.com', 'mail.com', 'yandex.com', 'live.com', 'msn.com',
]);

export function emailDomain(email) {
  const n = normalizeEmail(email);
  if (!n) return null;
  const domain = n.split('@')[1];
  return FREE_MAIL.has(domain) ? null : domain; // free mail is not an account
}

export const isFreeMail = (email) => {
  const n = normalizeEmail(email);
  return n ? FREE_MAIL.has(n.split('@')[1]) : false;
};

// --------------------------------------------------------------------- misc --
export const slugify = (s) => String(s).toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'item';

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export function parseJson(value, fallback = {}) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return fallback; }
}

/** Splits a full URL into the pieces the event stream cares about. */
export function dissectUrl(raw) {
  try {
    const u = new URL(raw);
    const q = u.searchParams;
    return {
      url: u.toString().slice(0, 2000),
      path: u.pathname || '/',
      host: u.host,
      utm_source: q.get('utm_source'),
      utm_medium: q.get('utm_medium'),
      utm_campaign: q.get('utm_campaign'),
      utm_content: q.get('utm_content'),
      utm_term: q.get('utm_term'),
      // Each network stamps its own click id on the landing URL. These are the
      // only handles an ad platform gives us at the moment of arrival.
      li_fat_id: q.get('li_fat_id'),          // LinkedIn
      fbclid: q.get('fbclid'),                // Meta
      gclid: q.get('gclid'),                  // Google, for completeness
      cohort_token: q.get('bmr_co'),          // our own cohort token
      ad_campaign_id: q.get('li_campaign_id') || q.get('bmr_adc'),
      creative_id: q.get('li_creative_id') || q.get('bmr_crv'),
      platform: detectAdPlatform(q),
    };
  } catch {
    return { url: String(raw || '').slice(0, 2000), path: null, host: null };
  }
}

/**
 * Which ad network sent this visitor, from the landing URL alone.
 * The network's own click id is authoritative; UTMs are a fallback because
 * anyone can set them.
 */
export function detectAdPlatform(params) {
  const q = typeof params?.get === 'function' ? params : new URLSearchParams(params || '');
  if (q.get('li_fat_id')) return 'linkedin';
  if (q.get('fbclid')) return 'meta';
  const source = String(q.get('utm_source') || '').toLowerCase();
  const medium = String(q.get('utm_medium') || '').toLowerCase();
  const paid = /cpc|ppc|paid|ads?|sponsored|display|social-paid/.test(medium);
  if (!paid) return null;
  if (/linkedin|li\b/.test(source)) return 'linkedin';
  if (/facebook|meta|instagram|\bfb\b|\big\b/.test(source)) return 'meta';
  return null;
}

/** Builds the Meta `fbc` cookie value from an fbclid, per Meta's format. */
export function buildFbc(fbclid, createdAt = Date.now()) {
  if (!fbclid) return null;
  // version.subdomainIndex.creationTime.fbclid
  return `fb.1.${Math.floor(createdAt)}.${fbclid}`;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
