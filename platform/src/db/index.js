import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../config.js';
import { prepareSchema, runMigrations } from './migrations.js';

const here = dirname(fileURLToPath(import.meta.url));

let _db = null;

/** Opens (and on first call migrates) the SQLite database. */
export function db() {
  if (_db) return _db;
  mkdirSync(dirname(config.dbPath), { recursive: true });
  _db = new DatabaseSync(config.dbPath);
  // Order matters: widen existing tables, then apply the current schema, then
  // move data. schema.sql indexes columns that older databases do not have yet.
  prepareSchema(_db);
  _db.exec(readFileSync(join(here, 'schema.sql'), 'utf8'));
  runMigrations(_db);
  return _db;
}

export function migrate() {
  const d = db();
  d.exec('PRAGMA optimize');
  return d;
}

// --- thin query helpers -----------------------------------------------------
// node:sqlite only binds null/number/bigint/string/Uint8Array, so everything
// funnels through here to coerce booleans, undefined and dates.
function bind(params) {
  return params.map((p) => {
    if (p === undefined || p === null) return null;
    if (typeof p === 'boolean') return p ? 1 : 0;
    if (p instanceof Date) return p.toISOString();
    if (typeof p === 'object') return JSON.stringify(p);
    return p;
  });
}

export const all = (sql, ...params) => db().prepare(sql).all(...bind(params));
export const get = (sql, ...params) => db().prepare(sql).get(...bind(params)) ?? null;
export const run = (sql, ...params) => db().prepare(sql).run(...bind(params));
export const pluck = (sql, ...params) => {
  const row = get(sql, ...params);
  return row ? Object.values(row)[0] : null;
};

/**
 * Runs fn inside a transaction, rolling back on throw.
 * Re-entrant: a nested call joins the outer transaction via a SAVEPOINT, so a
 * helper that manages its own transaction (identifyVisitor, say) can be called
 * from inside a larger batch without blowing up.
 */
let txDepth = 0;

export function tx(fn) {
  const d = db();
  const nested = txDepth > 0;
  const savepoint = `sp_${txDepth}`;
  d.exec(nested ? `SAVEPOINT ${savepoint}` : 'BEGIN');
  txDepth += 1;
  try {
    const out = fn();
    d.exec(nested ? `RELEASE ${savepoint}` : 'COMMIT');
    txDepth -= 1;
    return out;
  } catch (err) {
    txDepth -= 1;
    try {
      d.exec(nested ? `ROLLBACK TO ${savepoint}; RELEASE ${savepoint}` : 'ROLLBACK');
    } catch { /* connection already unwound */ }
    throw err;
  }
}

/** JSON-typed settings store. */
export const settings = {
  get(key, fallback = null) {
    const row = get('SELECT value FROM settings WHERE key = ?', key);
    if (!row) return fallback;
    try { return JSON.parse(row.value); } catch { return fallback; }
  },
  set(key, value) {
    run(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      key, JSON.stringify(value), new Date().toISOString(),
    );
    return value;
  },
  all() {
    return Object.fromEntries(
      all('SELECT key, value FROM settings').map((r) => {
        try { return [r.key, JSON.parse(r.value)]; } catch { return [r.key, r.value]; }
      }),
    );
  },
};
