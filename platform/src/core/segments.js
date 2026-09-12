import { all, get } from '../db/index.js';
import { badRequest } from '../lib/http.js';
import { parseJson } from '../lib/util.js';

/**
 * Compiles a JSON rule tree into parameterised SQL against `contacts`.
 *
 *   { "op": "and", "rules": [
 *       { "field": "seniority", "operator": "in", "value": ["vp","cxo"] },
 *       { "field": "page_views_30d", "operator": "gte", "value": 3 },
 *       { "op": "or", "rules": [ ... ] }
 *   ]}
 *
 * Behavioural fields become correlated subqueries over `events`, which is what
 * makes "VPs who saw the ad and then read the CDN-cost page twice" expressible
 * as a single targetable segment.
 */

// Plain columns on contacts.
const COLUMNS = new Set([
  'email', 'first_name', 'last_name', 'company', 'domain', 'job_title', 'seniority',
  'function', 'linkedin_url', 'country', 'industry', 'company_size', 'lifecycle_stage',
  'owner', 'source', 'status', 'score', 'grade', 'consent_email', 'consent_ads',
  'created_at', 'updated_at', 'first_seen_at', 'last_seen_at',
]);

// Behavioural fields → SQL expression. `?` placeholders are filled by `args`.
const DERIVED = {
  event_count: { sql: '(SELECT COUNT(*) FROM events e WHERE e.contact_id = contacts.id)', type: 'number' },
  last_event_at: { sql: '(SELECT MAX(e.occurred_at) FROM events e WHERE e.contact_id = contacts.id)', type: 'date' },
  page_views_30d: { sql: windowCount("e.type = 'page_view'", 30), type: 'number' },
  page_views_7d: { sql: windowCount("e.type = 'page_view'", 7), type: 'number' },
  sessions_30d: { sql: `(SELECT COUNT(DISTINCT e.visitor_id) FROM events e WHERE e.contact_id = contacts.id AND e.channel = 'web' AND e.occurred_at >= datetime('now','-30 days'))`, type: 'number' },
  email_opens_30d: { sql: windowCount("e.type = 'email_open'", 30), type: 'number' },
  email_clicks_30d: { sql: windowCount("e.type = 'email_click'", 30), type: 'number' },
  email_clicks_all: { sql: `(SELECT COUNT(*) FROM events e WHERE e.contact_id = contacts.id AND e.type = 'email_click')`, type: 'number' },
  ad_clicks_30d: { sql: windowCount("e.type = 'ad_click'", 30), type: 'number' },
  ad_engagements_30d: { sql: windowCount("e.channel = 'ads'", 30), type: 'number' },
  meta_engagements_30d: { sql: windowCount("e.platform = 'meta'", 30), type: 'number' },
  linkedin_engagements_30d: { sql: windowCount("e.platform = 'linkedin'", 30), type: 'number' },
  form_submits_all: { sql: `(SELECT COUNT(*) FROM events e WHERE e.contact_id = contacts.id AND e.type = 'form_submit')`, type: 'number' },
  web_events_30d: { sql: windowCount("e.channel = 'web'", 30), type: 'number' },
  days_since_last_event: {
    sql: `(SELECT CAST(julianday('now') - julianday(MAX(e.occurred_at)) AS INTEGER) FROM events e WHERE e.contact_id = contacts.id)`,
    type: 'number',
  },
  days_since_created: { sql: `CAST(julianday('now') - julianday(contacts.created_at) AS INTEGER)`, type: 'number' },
  emails_received_30d: {
    sql: `(SELECT COUNT(*) FROM sends s WHERE s.contact_id = contacts.id AND s.status = 'sent' AND s.sent_at >= datetime('now','-30 days'))`,
    type: 'number',
  },
  account_contact_count: {
    sql: `(SELECT COUNT(*) FROM contacts c2 WHERE c2.domain IS NOT NULL AND c2.domain = contacts.domain)`,
    type: 'number',
  },
};

function windowCount(cond, days) {
  return `(SELECT COUNT(*) FROM events e WHERE e.contact_id = contacts.id AND ${cond} AND e.occurred_at >= datetime('now','-${days} days'))`;
}

// Parameterised fields take an argument: visited_path("/pricing").
const PARAMETERISED = {
  // Has the contact ever hit a path containing X?
  visited_path: (arg) => ({
    sql: `(SELECT COUNT(*) FROM events e WHERE e.contact_id = contacts.id AND e.type = 'page_view' AND e.path LIKE ?)`,
    args: [`%${arg}%`], type: 'number',
  }),
  visited_path_30d: (arg) => ({
    sql: `(SELECT COUNT(*) FROM events e WHERE e.contact_id = contacts.id AND e.type = 'page_view' AND e.path LIKE ? AND e.occurred_at >= datetime('now','-30 days'))`,
    args: [`%${arg}%`], type: 'number',
  }),
  event_count_of: (arg) => ({
    sql: `(SELECT COUNT(*) FROM events e WHERE e.contact_id = contacts.id AND e.type = ?)`,
    args: [String(arg)], type: 'number',
  }),
  clicked_campaign: (arg) => ({
    sql: `(SELECT COUNT(*) FROM events e WHERE e.contact_id = contacts.id AND e.type = 'email_click' AND e.campaign_id = ?)`,
    args: [String(arg)], type: 'number',
  }),
  engaged_ad_campaign: (arg) => ({
    sql: `(SELECT COUNT(*) FROM events e WHERE e.contact_id = contacts.id AND e.channel = 'ads' AND e.ad_campaign_id = ?)`,
    args: [String(arg)], type: 'number',
  }),
  in_list: (arg) => ({
    sql: `(SELECT COUNT(*) FROM list_members lm WHERE lm.contact_id = contacts.id AND lm.list_id = ?)`,
    args: [String(arg)], type: 'number',
  }),
  in_audience: (arg) => ({
    sql: `(SELECT COUNT(*) FROM ad_audience_members am WHERE am.contact_id = contacts.id AND am.audience_id = ? AND am.state = 'pushed')`,
    args: [String(arg)], type: 'number',
  }),
};

function resolveField(field) {
  if (COLUMNS.has(field)) return { sql: `contacts.${field}`, args: [], type: 'text' };
  if (DERIVED[field]) return { ...DERIVED[field], args: [] };

  // attrs.foo → JSON extraction from the custom-field blob
  if (field.startsWith('attrs.')) {
    const key = field.slice(6).replace(/[^\w.-]/g, '');
    if (!key) throw badRequest(`Invalid attribute field: ${field}`);
    return { sql: `json_extract(contacts.attrs, '$.${key}')`, args: [], type: 'text' };
  }

  // visited_path("/pricing") or visited_path:/pricing
  const call = field.match(/^(\w+)\s*(?:\(\s*["']?([^"')]*)["']?\s*\)|:(.*))$/);
  if (call) {
    const fn = PARAMETERISED[call[1]];
    const arg = call[2] !== undefined ? call[2] : call[3];
    if (fn) return fn(arg);
  }
  throw badRequest(`Unknown segment field: ${field}`);
}

const OPERATORS = {
  eq: (f) => ({ sql: `${f} = ?`, take: 1 }),
  neq: (f) => ({ sql: `(${f} IS NULL OR ${f} != ?)`, take: 1 }),
  gt: (f) => ({ sql: `${f} > ?`, take: 1 }),
  gte: (f) => ({ sql: `${f} >= ?`, take: 1 }),
  lt: (f) => ({ sql: `${f} < ?`, take: 1 }),
  lte: (f) => ({ sql: `${f} <= ?`, take: 1 }),
  contains: (f) => ({ sql: `${f} LIKE ?`, take: 1, map: (v) => `%${v}%` }),
  not_contains: (f) => ({ sql: `(${f} IS NULL OR ${f} NOT LIKE ?)`, take: 1, map: (v) => `%${v}%` }),
  starts_with: (f) => ({ sql: `${f} LIKE ?`, take: 1, map: (v) => `${v}%` }),
  ends_with: (f) => ({ sql: `${f} LIKE ?`, take: 1, map: (v) => `%${v}` }),
  exists: (f) => ({ sql: `(${f} IS NOT NULL AND ${f} != '')`, take: 0 }),
  not_exists: (f) => ({ sql: `(${f} IS NULL OR ${f} = '')`, take: 0 }),
  is_true: (f) => ({ sql: `${f} = 1`, take: 0 }),
  is_false: (f) => ({ sql: `(${f} = 0 OR ${f} IS NULL)`, take: 0 }),
  // Recency helpers on ISO-8601 date columns.
  within_days: (f) => ({ sql: `(${f} IS NOT NULL AND ${f} >= datetime('now', ?))`, take: 1, map: (v) => `-${Math.abs(Number(v) || 0)} days` }),
  not_within_days: (f) => ({ sql: `(${f} IS NULL OR ${f} < datetime('now', ?))`, take: 1, map: (v) => `-${Math.abs(Number(v) || 0)} days` }),
  before: (f) => ({ sql: `(${f} IS NOT NULL AND ${f} < ?)`, take: 1 }),
  after: (f) => ({ sql: `(${f} IS NOT NULL AND ${f} > ?)`, take: 1 }),
};

function buildCondition(rule) {
  const field = resolveField(String(rule.field || ''));
  const opName = String(rule.operator || 'eq').toLowerCase();

  if (opName === 'in' || opName === 'not_in') {
    const values = Array.isArray(rule.value) ? rule.value : String(rule.value ?? '').split(',').map((s) => s.trim());
    const clean = values.filter((v) => v !== '' && v !== null && v !== undefined);
    if (!clean.length) return { sql: opName === 'in' ? '0' : '1', args: [] };
    const holes = clean.map(() => '?').join(', ');
    const sql = opName === 'in'
      ? `${field.sql} IN (${holes})`
      : `(${field.sql} IS NULL OR ${field.sql} NOT IN (${holes}))`;
    // not_in repeats the field expression, so its own args must repeat too.
    const fieldArgs = opName === 'in' ? field.args : [...field.args, ...field.args];
    return { sql, args: [...fieldArgs, ...clean] };
  }

  const factory = OPERATORS[opName];
  if (!factory) throw badRequest(`Unknown segment operator: ${opName}`);
  const op = factory(field.sql);

  // Some operator templates embed the field expression twice (null guards).
  // A parameterised field carries its own args, so repeat them to match.
  const fieldRepeats = Math.max(1, countOccurrences(op.sql, field.sql));
  const args = [];
  for (let i = 0; i < fieldRepeats; i++) args.push(...field.args);
  if (op.take === 1) args.push(op.map ? op.map(rule.value) : coerce(rule.value));
  return { sql: op.sql, args };
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

function coerce(v) {
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (v instanceof Date) return v.toISOString();
  if (v === undefined) return null;
  return v;
}

/** Recursively compiles a rule tree → { sql, args }. */
export function compileRules(node, depth = 0) {
  if (depth > 8) throw badRequest('Segment rules nested too deeply');
  const tree = parseJson(node, {});
  if (!tree || typeof tree !== 'object') return { sql: '1', args: [] };

  if (Array.isArray(tree)) return compileRules({ op: 'and', rules: tree }, depth);

  if (tree.rules) {
    const op = String(tree.op || 'and').toUpperCase() === 'OR' ? 'OR' : 'AND';
    const parts = tree.rules.map((r) => compileRules(r, depth + 1)).filter((p) => p.sql && p.sql !== '1');
    if (!parts.length) return { sql: '1', args: [] };
    const sql = '(' + parts.map((p) => p.sql).join(` ${op} `) + ')';
    const negate = tree.not === true;
    return { sql: negate ? `NOT ${sql}` : sql, args: parts.flatMap((p) => p.args) };
  }

  if (!tree.field) return { sql: '1', args: [] };
  const built = buildCondition(tree);
  return tree.not === true ? { sql: `NOT (${built.sql})`, args: built.args } : built;
}

/**
 * Builds the full SELECT for a segment.
 * `listId` scopes to a list's members; `mailable`/`adTargetable` add the
 * consent + suppression guards so a segment can never leak an opt-out.
 */
export function buildQuery({
  rules = {}, listId = null, mailable = false, adTargetable = false,
  select = 'contacts.*', orderBy = 'contacts.score DESC, contacts.updated_at DESC',
  limit = null, offset = 0, extraWhere = null, extraArgs = [],
} = {}) {
  const where = [];
  const args = [];

  const compiled = compileRules(rules);
  if (compiled.sql && compiled.sql !== '1') { where.push(compiled.sql); args.push(...compiled.args); }

  if (listId) {
    where.push('EXISTS (SELECT 1 FROM list_members lm WHERE lm.contact_id = contacts.id AND lm.list_id = ?)');
    args.push(listId);
  }
  if (mailable) {
    where.push("contacts.status = 'active'");
    where.push('contacts.consent_email = 1');
    where.push('NOT EXISTS (SELECT 1 FROM suppressions sup WHERE sup.email = contacts.email)');
  }
  if (adTargetable) {
    where.push("contacts.status NOT IN ('suppressed','complained')");
    where.push('contacts.consent_ads = 1');
  }
  if (extraWhere) { where.push(extraWhere); args.push(...extraArgs); }

  const sql = `SELECT ${select} FROM contacts`
    + (where.length ? ` WHERE ${where.join(' AND ')}` : '')
    + (orderBy ? ` ORDER BY ${orderBy}` : '')
    + (limit ? ` LIMIT ${Number(limit)} OFFSET ${Number(offset)}` : '');
  return { sql, args };
}

export function runSegment(opts) {
  const { sql, args } = buildQuery(opts);
  return all(sql, ...args);
}

export function countSegment(opts) {
  const { sql, args } = buildQuery({ ...opts, select: 'COUNT(*) AS n', orderBy: null, limit: null });
  return get(sql, ...args)?.n ?? 0;
}

/** Fields the console offers in the rule builder. */
export function fieldCatalog() {
  return {
    attributes: [...COLUMNS].sort(),
    behaviour: Object.keys(DERIVED).sort(),
    parameterised: Object.keys(PARAMETERISED).sort(),
    custom: 'attrs.<key>',
    operators: [...Object.keys(OPERATORS), 'in', 'not_in'],
  };
}
