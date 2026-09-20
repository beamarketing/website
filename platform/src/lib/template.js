import { escapeHtml } from './util.js';

/**
 * Merge-tag renderer for personalised copy.
 *
 *   {{ first_name }}                       field
 *   {{ first_name | fallback: "there" }}   filter chain
 *   {{ attrs.use_case | title }}
 *   {% if company %}...{% else %}...{% endif %}
 *
 * HTML-escapes by default (use the `raw` filter to opt out) so a contact
 * record can never inject markup into an email.
 */

const FILTERS = {
  upper: (v) => String(v).toUpperCase(),
  lower: (v) => String(v).toLowerCase(),
  title: (v) => String(v).replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
  capitalize: (v) => { const s = String(v); return s.charAt(0).toUpperCase() + s.slice(1); },
  trim: (v) => String(v).trim(),
  first_word: (v) => String(v).trim().split(/\s+/)[0] || '',
  truncate: (v, n = 60) => (String(v).length > n ? String(v).slice(0, n - 1) + '…' : String(v)),
  fallback: (v, alt = '') => (isBlank(v) ? alt : v),
  default: (v, alt = '') => (isBlank(v) ? alt : v),
  raw: (v) => ({ __raw: String(v ?? '') }),
  date: (v) => (v ? new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''),
  number: (v) => (Number.isFinite(Number(v)) ? Number(v).toLocaleString('en-US') : String(v ?? '')),
};

const isBlank = (v) => v === null || v === undefined || String(v).trim() === '';

function resolvePath(ctx, path) {
  return path.split('.').reduce((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    return acc[key];
  }, ctx);
}

/** Splits "name | filter: 'arg' | other" respecting quoted arguments. */
function splitPipes(expr) {
  const parts = [];
  let cur = '';
  let quote = null;
  for (const ch of expr) {
    if (quote) { cur += ch; if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; cur += ch; continue; }
    if (ch === '|') { parts.push(cur); cur = ''; continue; }
    cur += ch;
  }
  parts.push(cur);
  return parts.map((p) => p.trim()).filter(Boolean);
}

function parseArgs(raw) {
  if (!raw) return [];
  const out = [];
  let cur = '';
  let quote = null;
  for (const ch of raw) {
    if (quote) { if (ch === quote) { quote = null; } else cur += ch; continue; }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === ',') { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim() !== '') out.push(cur.trim());
  return out.map((a) => (/^-?\d+(\.\d+)?$/.test(a) ? Number(a) : a));
}

function evalExpr(expr, ctx, { escape }) {
  const [head, ...pipes] = splitPipes(expr);
  let value = resolvePath(ctx, head.trim());
  let raw = false;
  for (const pipe of pipes) {
    const colon = pipe.indexOf(':');
    const name = (colon === -1 ? pipe : pipe.slice(0, colon)).trim();
    const args = parseArgs(colon === -1 ? '' : pipe.slice(colon + 1));
    const fn = FILTERS[name];
    if (!fn) continue;
    value = fn(value, ...args);
    if (value && typeof value === 'object' && '__raw' in value) { raw = true; value = value.__raw; }
  }
  if (isBlank(value)) return '';
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return escape && !raw ? escapeHtml(str) : str;
}

function truthy(expr, ctx) {
  const negate = expr.trim().startsWith('!');
  const path = negate ? expr.trim().slice(1).trim() : expr.trim();
  // Support "field == 'value'" and "field != 'value'".
  const cmp = path.match(/^(.+?)\s*(==|!=)\s*(.+)$/);
  if (cmp) {
    const left = resolvePath(ctx, cmp[1].trim());
    const right = cmp[3].trim().replace(/^['"]|['"]$/g, '');
    const eq = String(left ?? '') === right;
    const result = cmp[2] === '==' ? eq : !eq;
    return negate ? !result : result;
  }
  const v = resolvePath(ctx, path);
  const t = !isBlank(v) && v !== false && v !== 0;
  return negate ? !t : t;
}

/** Resolves {% if %}/{% else %}/{% endif %}, innermost first. */
function renderConditionals(tpl, ctx) {
  const re = /\{%\s*if\s+([^%]+?)\s*%\}((?:(?!\{%\s*if\s)[\s\S])*?)\{%\s*endif\s*%\}/;
  let out = tpl;
  let guard = 0;
  while (re.test(out) && guard++ < 100) {
    out = out.replace(re, (_m, cond, body) => {
      const split = body.match(/^([\s\S]*?)\{%\s*else\s*%\}([\s\S]*)$/);
      const yes = split ? split[1] : body;
      const no = split ? split[2] : '';
      return truthy(cond, ctx) ? yes : no;
    });
  }
  return out;
}

export function render(template, ctx = {}, { escape = true } = {}) {
  if (!template) return '';
  const withConds = renderConditionals(String(template), ctx);
  return withConds.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_m, expr) => evalExpr(expr, ctx, { escape }));
}

/** Plain-text render: never HTML-escapes. */
export const renderText = (template, ctx) => render(template, ctx, { escape: false });

/** Lists the merge tags a template references, for the campaign preflight. */
export function extractTags(template) {
  const tags = new Set();
  for (const m of String(template || '').matchAll(/\{\{\s*([^}|]+?)\s*(?:\||\}\})/g)) tags.add(m[1].trim());
  for (const m of String(template || '').matchAll(/\{%\s*if\s+!?\s*([^\s%=!]+)/g)) tags.add(m[1].trim());
  return [...tags];
}

/** Crude but serviceable HTML→text for the multipart alternative. */
export function htmlToText(html) {
  return String(html || '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href, txt) => {
      const label = txt.replace(/<[^>]+>/g, '').trim();
      return label && !href.startsWith('mailto:') ? `${label} (${href})` : label || href;
    })
    .replace(/<\/(p|div|h[1-6]|tr|li|table)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
