import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.LOG_LEVEL = 'error';
const here = dirname(fileURLToPath(import.meta.url));
const { prepareSchema, runMigrations } = await import('../src/db/migrations.js');

/**
 * The v1 shape, as actually shipped: LinkedIn-only ad tables, no platform
 * column anywhere. An installed instance looks exactly like this, so the
 * migration has to lift it without losing a row.
 */
const V1 = `
CREATE TABLE contacts (
  id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, email_sha256 TEXT NOT NULL,
  first_name TEXT, last_name TEXT, company TEXT, domain TEXT, job_title TEXT,
  seniority TEXT, function TEXT, linkedin_url TEXT, country TEXT, industry TEXT,
  company_size TEXT, phone TEXT, lifecycle_stage TEXT DEFAULT 'target', owner TEXT,
  source TEXT, status TEXT DEFAULT 'active', consent_email INTEGER DEFAULT 1,
  consent_ads INTEGER DEFAULT 1, score INTEGER DEFAULT 0, grade TEXT DEFAULT 'D',
  attrs TEXT DEFAULT '{}', first_seen_at TEXT, last_seen_at TEXT, last_scored_at TEXT,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE lists (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, description TEXT,
  kind TEXT DEFAULT 'static', rules TEXT DEFAULT '{}', is_dedicated INTEGER DEFAULT 0,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE events (
  id TEXT PRIMARY KEY, contact_id TEXT, visitor_id TEXT, channel TEXT NOT NULL,
  type TEXT NOT NULL, occurred_at TEXT NOT NULL, url TEXT, path TEXT, title TEXT,
  referrer TEXT, campaign_id TEXT, ad_campaign_id TEXT, creative_id TEXT,
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_content TEXT, utm_term TEXT,
  value REAL, points INTEGER DEFAULT 0, meta TEXT DEFAULT '{}', dedupe_key TEXT UNIQUE);
CREATE TABLE li_audiences (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, list_id TEXT, urn TEXT, account_urn TEXT,
  status TEXT DEFAULT 'pending', member_count INTEGER DEFAULT 0, matched_count INTEGER DEFAULT 0,
  last_synced_at TEXT, last_error TEXT, auto_sync INTEGER DEFAULT 1,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE li_audience_members (
  audience_id TEXT NOT NULL, contact_id TEXT NOT NULL, state TEXT DEFAULT 'pending',
  pushed_at TEXT, PRIMARY KEY (audience_id, contact_id));
CREATE TABLE ad_campaigns (
  id TEXT PRIMARY KEY, account_id TEXT, name TEXT NOT NULL, status TEXT, objective TEXT,
  type TEXT, audience_id TEXT, daily_budget REAL, total_budget REAL, currency TEXT DEFAULT 'USD',
  start_at TEXT, end_at TEXT, landing_url TEXT, synced_at TEXT,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE ad_metrics (
  id TEXT PRIMARY KEY, ad_campaign_id TEXT NOT NULL, creative_id TEXT DEFAULT '',
  date TEXT NOT NULL, impressions INTEGER DEFAULT 0, unique_reach INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0, spend REAL DEFAULT 0, video_views INTEGER DEFAULT 0,
  reactions INTEGER DEFAULT 0, comments INTEGER DEFAULT 0, shares INTEGER DEFAULT 0,
  follows INTEGER DEFAULT 0, leads INTEGER DEFAULT 0, conversions INTEGER DEFAULT 0,
  raw TEXT DEFAULT '{}', UNIQUE (ad_campaign_id, creative_id, date));
CREATE TABLE ad_lead_responses (
  id TEXT PRIMARY KEY, response_urn TEXT UNIQUE, ad_campaign_id TEXT, creative_id TEXT,
  form_id TEXT, contact_id TEXT, email TEXT, first_name TEXT, last_name TEXT,
  company TEXT, job_title TEXT, answers TEXT DEFAULT '{}', submitted_at TEXT, created_at TEXT NOT NULL);
`;

function buildV1() {
  const file = join(mkdtempSync(join(tmpdir(), 'beamr-mig-')), 'v1.db');
  const db = new DatabaseSync(file);
  db.exec(V1);
  db.prepare("INSERT INTO contacts (id,email,email_sha256,created_at,updated_at) VALUES ('ct_1','a@b.com','h1','x','x')").run();
  db.prepare("INSERT INTO contacts (id,email,email_sha256,created_at,updated_at) VALUES ('ct_2','c@d.com','h2','x','x')").run();
  db.prepare("INSERT INTO lists (id,name,slug,created_at,updated_at) VALUES ('ls_1','Legacy','legacy','x','x')").run();
  db.prepare(`INSERT INTO li_audiences (id,name,list_id,urn,account_urn,status,member_count,matched_count,last_synced_at,auto_sync,created_at,updated_at)
              VALUES ('au_1','Legacy VP audience','ls_1','urn:li:dmpSegment:99','urn:li:sponsoredAccount:5','ready',12,9,'t1',1,'x','x')`).run();
  db.prepare("INSERT INTO li_audience_members VALUES ('au_1','ct_1','pushed','t1')").run();
  db.prepare("INSERT INTO li_audience_members VALUES ('au_1','ct_2','removed',NULL)").run();
  db.prepare("INSERT INTO ad_campaigns (id,name,created_at,updated_at) VALUES ('7011','Legacy campaign','x','x')").run();
  db.prepare(`INSERT INTO events (id,contact_id,channel,type,occurred_at) VALUES ('ev_1','ct_1','linkedin','ad_click','2026-01-01T00:00:00Z')`).run();
  db.prepare(`INSERT INTO events (id,contact_id,channel,type,occurred_at) VALUES ('ev_2','ct_1','web','page_view','2026-01-01T00:00:00Z')`).run();
  return { db, file };
}

/** Reproduces exactly what db() does on open, in order. */
function migrate(db) {
  prepareSchema(db);
  db.exec(readFileSync(join(here, '..', 'src', 'db', 'schema.sql'), 'utf8'));
  return runMigrations(db);
}

describe('v1 → multi-platform migration', () => {
  test('lifts LinkedIn audiences into the platform-agnostic tables', () => {
    const { db } = buildV1();
    migrate(db);
    const audience = db.prepare('SELECT * FROM ad_audiences WHERE id = ?').get('au_1');
    assert.equal(audience.platform, 'linkedin');
    assert.equal(audience.name, 'Legacy VP audience');
    assert.equal(audience.external_id, 'urn:li:dmpSegment:99');
    assert.equal(audience.member_count, 12);
    assert.equal(audience.cohort_mode, 0, 'cohorts default to off for an existing audience');
  });

  test('carries member state across, removals included', () => {
    const { db } = buildV1();
    migrate(db);
    const members = db.prepare('SELECT * FROM ad_audience_members ORDER BY contact_id').all();
    assert.equal(members.length, 2);
    assert.equal(members[0].state, 'pushed');
    assert.equal(members[1].state, 'removed');
  });

  test('adds the platform column to tables that predate it', () => {
    const { db } = buildV1();
    migrate(db);
    assert.equal(db.prepare('SELECT platform FROM ad_campaigns WHERE id = ?').get('7011').platform, 'linkedin');
    const cols = (t) => db.prepare(`PRAGMA table_info(${t})`).all().map((c) => c.name);
    assert.ok(cols('ad_metrics').includes('platform'));
    assert.ok(cols('ad_metrics').includes('cohort_id'));
    assert.ok(cols('events').includes('platform'));
    assert.ok(cols('events').includes('cohort_id'));
  });

  test("moves channel 'linkedin' events to channel 'ads' with a platform", () => {
    const { db } = buildV1();
    migrate(db);
    const ad = db.prepare("SELECT * FROM events WHERE id = 'ev_1'").get();
    assert.equal(ad.channel, 'ads');
    assert.equal(ad.platform, 'linkedin');
    // Other channels are untouched.
    const web = db.prepare("SELECT * FROM events WHERE id = 'ev_2'").get();
    assert.equal(web.channel, 'web');
    assert.equal(web.platform, null);
  });

  test('drops the legacy tables in the same pass, not the next one', () => {
    const { db } = buildV1();
    migrate(db);
    const left = db.prepare("SELECT name FROM sqlite_master WHERE name IN ('li_audiences','li_audience_members')").all();
    assert.equal(left.length, 0);
  });

  test('is idempotent — migrating twice changes nothing', () => {
    const { db } = buildV1();
    migrate(db);
    const before = db.prepare('SELECT COUNT(*) AS n FROM ad_audiences').get().n;
    const ran = migrate(db);
    assert.equal(ran.length, 0, 'no migration should re-run');
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM ad_audiences').get().n, before);
  });

  test('a fresh database needs no migration and still gets every table', () => {
    const file = join(mkdtempSync(join(tmpdir(), 'beamr-fresh-')), 'fresh.db');
    const db = new DatabaseSync(file);
    migrate(db);
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map((t) => t.name);
    for (const required of ['ad_audiences', 'ad_audience_members', 'ad_cohorts', 'ad_campaigns',
      'ad_metrics', 'ad_conversion_forwards', 'contacts', 'events', 'sends']) {
      assert.ok(tables.includes(required), `missing ${required}`);
    }
  });
});
