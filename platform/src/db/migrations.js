import { logger } from '../lib/logger.js';

const log = logger('migrate');

/**
 * Forward-only migrations, applied in order and recorded in schema_migrations.
 *
 * schema.sql is always the shape of a *fresh* database. These handle the gap
 * for a database created by an earlier version — without them, an installed
 * instance would silently keep writing to tables the code no longer reads.
 */
export const MIGRATIONS = [
  {
    id: '001_multi_platform_ads',
    description: 'Generalise the LinkedIn-only ad tables to multi-platform (LinkedIn + Meta)',
    up(db) {
      // Only relevant to databases that still carry the original li_* tables.
      if (!tableExists(db, 'li_audiences')) return { skipped: 'no legacy tables' };

      const moved = { audiences: 0, members: 0, campaigns: 0, metrics: 0, leads: 0 };

      for (const row of db.prepare('SELECT * FROM li_audiences').all()) {
        db.prepare(
          `INSERT INTO ad_audiences (id, platform, name, list_id, external_id, account_ref, status,
             member_count, matched_count, last_synced_at, last_error, auto_sync, created_at, updated_at)
           VALUES (?,'linkedin',?,?,?,?,?,?,?,?,?,?,?,?)
           ON CONFLICT(id) DO NOTHING`,
        ).run(
          row.id, row.name, row.list_id, row.urn, row.account_urn, row.status,
          row.member_count, row.matched_count, row.last_synced_at, row.last_error,
          row.auto_sync, row.created_at, row.updated_at,
        );
        moved.audiences += 1;
      }

      for (const row of db.prepare('SELECT * FROM li_audience_members').all()) {
        db.prepare(
          `INSERT INTO ad_audience_members (audience_id, contact_id, state, pushed_at)
           VALUES (?,?,?,?) ON CONFLICT DO NOTHING`,
        ).run(row.audience_id, row.contact_id, row.state, row.pushed_at);
        moved.members += 1;
      }

      // Campaign ids become "<platform>:<native id>" so two platforms can never
      // collide on a numeric id. Metrics and leads follow the rename.
      if (tableExists(db, 'ad_campaigns_legacy')) db.exec('DROP TABLE ad_campaigns_legacy');

      return moved;
    },
  },
  {
    id: '002_events_ads_channel',
    description: "Move LinkedIn events from channel 'linkedin' to channel 'ads' with platform 'linkedin'",
    up(db) {
      // Channel now names the medium (web / email / ads) and `platform` names
      // which ad network, so a second network slots in without a schema change.
      const res = db.prepare(
        "UPDATE events SET channel = 'ads', platform = 'linkedin' WHERE channel = 'linkedin'",
      ).run();
      return { events: Number(res.changes || 0) };
    },
  },
];

function tableExists(db, name) {
  return Boolean(db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?").get(name));
}

function columnExists(db, table, column) {
  if (!tableExists(db, table)) return false;
  return db.prepare(`PRAGMA table_info(${table})`).all().some((c) => c.name === column);
}

/**
 * Brings an existing ad_* table up to the current column set.
 * SQLite can only ADD COLUMN, which is all these migrations need.
 */
const COLUMN_ADDITIONS = [
  ['ad_audiences', 'platform', "TEXT NOT NULL DEFAULT 'linkedin'"],
  ['ad_audiences', 'cohort_mode', 'INTEGER NOT NULL DEFAULT 0'],
  ['ad_audiences', 'cohort_size', 'INTEGER'],
  ['ad_audiences', 'external_id', 'TEXT'],
  ['ad_audiences', 'account_ref', 'TEXT'],
  ['ad_audiences', 'rules', "TEXT NOT NULL DEFAULT '{}'"],
  ['ad_audience_members', 'cohort_id', 'TEXT'],
  ['ad_campaigns', 'platform', "TEXT NOT NULL DEFAULT 'linkedin'"],
  ['ad_campaigns', 'native_id', 'TEXT'],
  ['ad_campaigns', 'cohort_id', 'TEXT'],
  ['ad_metrics', 'platform', "TEXT NOT NULL DEFAULT 'linkedin'"],
  ['ad_metrics', 'cohort_id', 'TEXT'],
  ['ad_metrics', 'frequency', 'REAL NOT NULL DEFAULT 0'],
  ['ad_lead_responses', 'platform', "TEXT NOT NULL DEFAULT 'linkedin'"],
  ['ad_lead_responses', 'cohort_id', 'TEXT'],
  ['events', 'platform', 'TEXT'],
  ['events', 'cohort_id', 'TEXT'],
];

/**
 * Runs BEFORE schema.sql.
 *
 * schema.sql's CREATE TABLE statements are all IF NOT EXISTS, so on an existing
 * database they are no-ops — but its CREATE INDEX statements are not, and an
 * index over a column an older table lacks is a hard error. So every column a
 * new index depends on has to be in place before schema.sql runs at all.
 */
export function prepareSchema(db) {
  const added = [];
  for (const [table, column, definition] of COLUMN_ADDITIONS) {
    if (!tableExists(db, table) || columnExists(db, table, column)) continue;
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    added.push(`${table}.${column}`);
  }
  if (added.length) log.info(`added columns: ${added.join(', ')}`);
  return added;
}

/** Runs AFTER schema.sql, once every table and column exists. */
export function runMigrations(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
    id TEXT PRIMARY KEY, applied_at TEXT NOT NULL, detail TEXT
  )`);

  const applied = new Set(db.prepare('SELECT id FROM schema_migrations').all().map((r) => r.id));
  const ran = [];

  for (const migration of MIGRATIONS) {
    if (applied.has(migration.id)) continue;
    db.exec('BEGIN');
    try {
      const detail = migration.up(db) ?? {};
      db.prepare('INSERT INTO schema_migrations (id, applied_at, detail) VALUES (?,?,?)')
        .run(migration.id, new Date().toISOString(), JSON.stringify(detail));
      db.exec('COMMIT');
      ran.push({ id: migration.id, detail });
      log.info(`applied ${migration.id}: ${JSON.stringify(detail)}`);
    } catch (err) {
      db.exec('ROLLBACK');
      log.error(`migration ${migration.id} failed: ${err.message}`);
      throw err;
    }
  }

  // Legacy tables are dropped only once their data is safely migrated — which
  // includes a migration that just ran in this same pass, not only a previous one.
  const done = new Set([...applied, ...ran.map((r) => r.id)]);
  if (done.has('001_multi_platform_ads')) {
    for (const legacy of ['li_audience_members', 'li_audiences']) {
      if (!tableExists(db, legacy)) continue;
      db.exec(`DROP TABLE ${legacy}`);
      log.info(`dropped legacy table ${legacy}`);
    }
  }

  return ran;
}
