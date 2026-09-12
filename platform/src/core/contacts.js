import { all, get, run, tx } from '../db/index.js';
import { badRequest, notFound } from '../lib/http.js';
import {
  id, now, sha256, normalizeEmail, emailDomain, isFreeMail, parseJson, slugify,
} from '../lib/util.js';
import { parseCsv, guessMapping, applyMapping } from '../lib/csv.js';
import { buildQuery } from './segments.js';
import { logger } from '../lib/logger.js';

const log = logger('contacts');

const WRITABLE = [
  'first_name', 'last_name', 'company', 'domain', 'job_title', 'seniority', 'function',
  'linkedin_url', 'country', 'industry', 'company_size', 'phone', 'lifecycle_stage',
  'owner', 'source', 'status', 'consent_email', 'consent_ads',
];

const SENIORITY_PATTERNS = [
  [/(^|\b)(chief|c[teiofm]o\b|cxo|founder|co-?founder|owner|president|partner)/i, 'cxo'],
  [/(^|\b)(svp|evp|vp\b|vice president|head of|gm\b|general manager)/i, 'vp'],
  [/(^|\b)(director|dir\.|principal)/i, 'director'],
  [/(^|\b)(manager|mgr\b|lead\b|team lead|supervisor)/i, 'manager'],
];

const FUNCTION_PATTERNS = [
  [/(engineer|developer|architect|devops|sre|cto|technology|technical|platform)/i, 'engineering'],
  [/(product|pm\b|program manager)/i, 'product'],
  [/(market|growth|demand gen|brand|content)/i, 'marketing'],
  [/(sales|account executive|business development|bd\b|revenue|cro\b)/i, 'sales'],
  [/(media|video|streaming|broadcast|content ops|encoding)/i, 'media'],
  [/(data|analytics|scien|machine learning|ml\b|ai\b)/i, 'data'],
  [/(operations|ops\b|infrastructure|cloud|it\b)/i, 'operations'],
  [/(finance|cfo|procurement|controller)/i, 'finance'],
];

/** Infers seniority/function from a job title so segments work on raw imports. */
export function deriveTitleFacets(title) {
  const t = String(title || '');
  if (!t.trim()) return {};
  const seniority = SENIORITY_PATTERNS.find(([rx]) => rx.test(t))?.[1] || 'ic';
  const fn = FUNCTION_PATTERNS.find(([rx]) => rx.test(t))?.[1] || null;
  return { seniority, ...(fn ? { function: fn } : {}) };
}

function clean(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  return s === '' ? null : s;
}

/**
 * Creates or updates a contact keyed on the normalised email.
 * Existing non-empty values win unless `overwrite` is set — an import should
 * never blank out a field that a human or a richer source already filled in.
 */
export function upsertContact(input, { overwrite = false, source = 'api' } = {}) {
  const email = normalizeEmail(input.email);
  if (!email) throw badRequest(`Invalid email address: ${input.email ?? '(blank)'}`);

  const existing = get('SELECT * FROM contacts WHERE email = ?', email);
  const ts = now();
  const attrs = { ...parseJson(existing?.attrs, {}), ...parseJson(input.attrs, {}) };

  const incoming = {};
  for (const field of WRITABLE) {
    if (input[field] === undefined) continue;
    if (field === 'consent_email' || field === 'consent_ads') {
      incoming[field] = input[field] ? 1 : 0;
    } else {
      const v = clean(input[field]);
      if (v !== null) incoming[field] = v;
    }
  }

  // Derive what the source did not provide.
  if (incoming.job_title && !incoming.seniority) Object.assign(incoming, deriveTitleFacets(incoming.job_title));
  if (!incoming.domain) {
    const derived = emailDomain(email);
    if (derived) incoming.domain = derived;
  }
  if (isFreeMail(email)) attrs.free_mail = true;

  if (!existing) {
    const contactId = id('ct');
    run(
      `INSERT INTO contacts (id, email, email_sha256, first_name, last_name, company, domain,
        job_title, seniority, function, linkedin_url, country, industry, company_size, phone,
        lifecycle_stage, owner, source, status, consent_email, consent_ads, attrs, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      contactId, email, sha256(email),
      incoming.first_name ?? null, incoming.last_name ?? null, incoming.company ?? null,
      incoming.domain ?? null, incoming.job_title ?? null, incoming.seniority ?? null,
      incoming.function ?? null, incoming.linkedin_url ?? null, incoming.country ?? null,
      incoming.industry ?? null, incoming.company_size ?? null, incoming.phone ?? null,
      incoming.lifecycle_stage ?? 'target', incoming.owner ?? null, incoming.source ?? source,
      incoming.status ?? 'active',
      incoming.consent_email ?? 1, incoming.consent_ads ?? 1,
      JSON.stringify(attrs), ts, ts,
    );
    syncAccount(incoming.domain ?? null, incoming);
    return { contact: get('SELECT * FROM contacts WHERE id = ?', contactId), created: true };
  }

  const sets = [];
  const args = [];
  for (const [field, value] of Object.entries(incoming)) {
    const currentlyEmpty = existing[field] === null || existing[field] === '';
    if (!overwrite && !currentlyEmpty) continue;
    sets.push(`${field} = ?`);
    args.push(value);
  }
  sets.push('attrs = ?'); args.push(JSON.stringify(attrs));
  sets.push('updated_at = ?'); args.push(ts);
  run(`UPDATE contacts SET ${sets.join(', ')} WHERE id = ?`, ...args, existing.id);
  syncAccount(existing.domain || incoming.domain || null, incoming);
  return { contact: get('SELECT * FROM contacts WHERE id = ?', existing.id), created: false };
}

/** Keeps the account rollup in step with its contacts. */
export function syncAccount(domain, hints = {}) {
  if (!domain) return null;
  const ts = now();
  const existing = get('SELECT * FROM accounts WHERE domain = ?', domain);
  if (!existing) {
    run(
      `INSERT INTO accounts (domain, name, industry, size, country, tier, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?)`,
      domain, hints.company || domain, hints.industry || null, hints.company_size || null,
      hints.country || null, 'tier3', ts, ts,
    );
  }
  run(
    `UPDATE accounts SET
       contact_count = (SELECT COUNT(*) FROM contacts c WHERE c.domain = accounts.domain),
       score = COALESCE((SELECT SUM(c.score) FROM contacts c WHERE c.domain = accounts.domain), 0),
       name = COALESCE(NULLIF(name,''), ?),
       industry = COALESCE(industry, ?),
       updated_at = ?
     WHERE domain = ?`,
    hints.company || domain, hints.industry || null, ts, domain,
  );
  return get('SELECT * FROM accounts WHERE domain = ?', domain);
}

export function getContact(contactId) {
  const c = get('SELECT * FROM contacts WHERE id = ? OR email = ?', contactId, String(contactId).toLowerCase());
  if (!c) throw notFound(`No contact ${contactId}`);
  return c;
}

export const findByEmail = (email) => {
  const n = normalizeEmail(email);
  return n ? get('SELECT * FROM contacts WHERE email = ?', n) : null;
};

export const findByHash = (hash) => get('SELECT * FROM contacts WHERE email_sha256 = ?', String(hash || '').toLowerCase());

export function updateContact(contactId, patch) {
  const contact = getContact(contactId);
  const { contact: updated } = upsertContact({ ...patch, email: contact.email }, { overwrite: true });
  return updated;
}

export function deleteContact(contactId) {
  const contact = getContact(contactId);
  run('DELETE FROM contacts WHERE id = ?', contact.id);
  if (contact.domain) syncAccount(contact.domain);
  return { deleted: contact.id };
}

/** Right-to-erasure: removes the contact and every trace of their behaviour. */
export function eraseContact(contactId) {
  const contact = getContact(contactId);
  return tx(() => {
    run('DELETE FROM events WHERE contact_id = ?', contact.id);
    run('UPDATE visitors SET contact_id = NULL, identified_at = NULL WHERE contact_id = ?', contact.id);
    run('DELETE FROM sends WHERE contact_id = ?', contact.id);
    run('DELETE FROM ad_audience_members WHERE contact_id = ?', contact.id);
    run('DELETE FROM ad_lead_responses WHERE contact_id = ?', contact.id);
    run('DELETE FROM contacts WHERE id = ?', contact.id);
    run(
      `INSERT INTO suppressions (email, reason, source, created_at) VALUES (?,?,?,?)
       ON CONFLICT(email) DO UPDATE SET reason = excluded.reason`,
      contact.email, 'manual', 'erasure', now(),
    );
    return { erased: contact.id, email: contact.email };
  });
}

// ------------------------------------------------------------------ imports --
/**
 * Bulk import from CSV text. Returns a per-row report so a bad export is
 * diagnosable instead of silently half-loaded.
 */
export function importCsv(csvText, { listId = null, mapping = null, source = 'import', overwrite = false, dryRun = false } = {}) {
  const { headers, rows } = parseCsv(csvText);
  if (!headers.length) throw badRequest('CSV has no header row');
  const map = mapping && Object.keys(mapping).length ? mapping : guessMapping(headers);
  if (!map.email) {
    throw badRequest('Could not find an email column', { headers, hint: 'Provide a mapping like {"email":"Work Email"}' });
  }

  const report = { total: rows.length, created: 0, updated: 0, skipped: 0, invalid: [], mapping: map, listId };
  const seen = new Set();

  const work = () => {
    for (const [index, raw] of rows.entries()) {
      const mapped = applyMapping(raw, map);
      const email = normalizeEmail(mapped.email);
      if (!email) {
        report.skipped += 1;
        if (report.invalid.length < 50) report.invalid.push({ row: index + 2, email: mapped.email || '', reason: 'invalid email' });
        continue;
      }
      if (seen.has(email)) { report.skipped += 1; continue; } // duplicate inside the file
      seen.add(email);
      try {
        const { contact, created } = upsertContact({ ...mapped, source }, { overwrite, source });
        if (created) report.created += 1; else report.updated += 1;
        if (listId) addToList(listId, contact.id);
      } catch (err) {
        report.skipped += 1;
        if (report.invalid.length < 50) report.invalid.push({ row: index + 2, email, reason: err.message });
      }
    }
  };

  if (dryRun) {
    // Preview only: show what the mapping would produce, touch nothing.
    return {
      ...report,
      preview: rows.slice(0, 5).map((r) => applyMapping(r, map)),
      dryRun: true,
    };
  }

  tx(work);
  log.info(`import: ${report.created} created, ${report.updated} updated, ${report.skipped} skipped`);
  return report;
}

// -------------------------------------------------------------------- lists --
export function createList({ name, description = '', kind = 'static', rules = {}, isDedicated = false }) {
  if (!name) throw badRequest('List name is required');
  const ts = now();
  const listId = id('ls');
  let slug = slugify(name);
  if (get('SELECT id FROM lists WHERE slug = ?', slug)) slug = `${slug}-${listId.slice(-4)}`;
  run(
    `INSERT INTO lists (id, name, slug, description, kind, rules, is_dedicated, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    listId, name, slug, description, kind === 'dynamic' ? 'dynamic' : 'static',
    JSON.stringify(rules || {}), isDedicated ? 1 : 0, ts, ts,
  );
  return get('SELECT * FROM lists WHERE id = ?', listId);
}

export function getList(listId) {
  const list = get('SELECT * FROM lists WHERE id = ? OR slug = ?', listId, listId);
  if (!list) throw notFound(`No list ${listId}`);
  return list;
}

export function addToList(listId, contactId) {
  run(
    'INSERT INTO list_members (list_id, contact_id, added_at) VALUES (?,?,?) ON CONFLICT DO NOTHING',
    listId, contactId, now(),
  );
}

export function removeFromList(listId, contactId) {
  run('DELETE FROM list_members WHERE list_id = ? AND contact_id = ?', listId, contactId);
}

export const listMemberCount = (listId) =>
  get('SELECT COUNT(*) AS n FROM list_members WHERE list_id = ?', listId)?.n ?? 0;

/** Materialises a dynamic list's rules into explicit membership. */
export function refreshDynamicList(listId) {
  const list = getList(listId);
  if (list.kind !== 'dynamic') return { listId: list.id, skipped: 'not a dynamic list' };
  const { sql, args } = buildQuery({ rules: parseJson(list.rules, {}), select: 'contacts.id', orderBy: null });
  const ids = all(sql, ...args).map((r) => r.id);
  return tx(() => {
    run('DELETE FROM list_members WHERE list_id = ?', list.id);
    const ts = now();
    for (const contactId of ids) {
      run('INSERT INTO list_members (list_id, contact_id, added_at) VALUES (?,?,?) ON CONFLICT DO NOTHING', list.id, contactId, ts);
    }
    run('UPDATE lists SET updated_at = ? WHERE id = ?', ts, list.id);
    return { listId: list.id, members: ids.length };
  });
}
