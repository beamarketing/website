import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';

// A deployment-shaped layout: the database lives on a mounted disk that is
// nowhere near the application directory.
const DISK = mkdtempSync(join(tmpdir(), 'beamr-disk-'));
process.env.DB_PATH = join(DISK, 'beamr-abm.db');
process.env.SECRET_KEY = 'deploy-test-secret';
process.env.ADMIN_TOKEN = 'deploy-test-token';
process.env.PUBLIC_URL = 'https://abm.beamr.com';
process.env.LOG_LEVEL = 'error';

const { config } = await import('../src/config.js');
const { db } = await import('../src/db/index.js');
const { createBackup, listBackups, verifyBackup, backupDir } = await import('../src/db/backup.js');
const { JOBS } = await import('../src/jobs/scheduler.js');

describe('durable storage layout', () => {
  test('backups are written beside the database, not beside the code', () => {
    // The bug this guards: defaulting to the app directory puts backups on the
    // container's ephemeral filesystem, where a restart destroys them.
    assert.equal(backupDir(), join(DISK, 'backups'));
    assert.notEqual(dirname(backupDir()), config.root);
  });

  test('an online backup is consistent and restorable', async () => {
    db();
    const result = await createBackup({ compress: false, keep: 5 });
    assert.ok(existsSync(result.path));
    assert.ok(result.path.startsWith(DISK), 'the backup must be on the mounted disk');

    const check = verifyBackup(result.path);
    assert.equal(check.ok, true);
    assert.equal(check.integrity, 'ok');
  });

  test('retention prunes the oldest and keeps the newest', async () => {
    for (let i = 0; i < 4; i++) {
      await createBackup({ compress: false, keep: 2 });
      // Filenames carry a second-resolution stamp, so space them out.
      await new Promise((r) => setTimeout(r, 1100));
    }
    assert.ok(listBackups().length <= 2, 'retention must cap the number kept');
  });

  test('a compressed backup refuses to verify rather than claiming success', async () => {
    const result = await createBackup({ compress: true, keep: 5 });
    const check = verifyBackup(result.path);
    assert.equal(check.ok, false);
    assert.match(check.error, /[Dd]ecompress/);
  });
});

describe('scheduler covers what a deploy needs', () => {
  test('a backup job exists and runs daily by default', () => {
    assert.ok(JOBS.backup, 'there must be an in-process backup job');
    // It has to be in-process: a persistent disk attaches to one service, so a
    // separate cron service could not reach the database at all.
    assert.equal(typeof JOBS.backup.run, 'function');
  });

  test('every job declares an interval and a human-readable label', () => {
    for (const [name, job] of Object.entries(JOBS)) {
      assert.equal(typeof job.intervalSec(), 'number', `${name} interval`);
      assert.ok(job.intervalSec() > 0, `${name} interval must be positive`);
      assert.ok(job.label && job.label.length > 10, `${name} needs a label`);
    }
  });
});

describe('render blueprint', () => {
  const blueprint = readFileSync(join(config.root, 'render.yaml'), 'utf8');

  test('pins a single instance, because SQLite has a single writer', () => {
    assert.match(blueprint, /numInstances:\s*1/);
  });

  test('mounts a disk at the path the database is configured to use', () => {
    assert.match(blueprint, /mountPath:\s*\/app\/data/);
    assert.match(blueprint, /DB_PATH[\s\S]{0,60}\/app\/data\/beamr-abm\.db/);
  });

  test('health checks the public endpoint, not an authenticated one', () => {
    assert.match(blueprint, /healthCheckPath:\s*\/healthz/);
    assert.doesNotMatch(blueprint, /healthCheckPath:\s*\/api/);
  });

  test('no secret is committed — they are prompted or generated', () => {
    // Every credential must be sync:false (prompted) or generateValue (made by
    // Render). A literal token in this file would be a token in git history.
    for (const key of ['LINKEDIN_ACCESS_TOKEN', 'META_ACCESS_TOKEN', 'SMTP_PASS', 'META_APP_SECRET']) {
      const block = blueprint.slice(blueprint.indexOf(key), blueprint.indexOf(key) + 120);
      assert.match(block, /sync:\s*false/, `${key} must not carry a value`);
    }
    assert.match(blueprint, /SECRET_KEY[\s\S]{0,60}generateValue:\s*true/);
    assert.match(blueprint, /ADMIN_TOKEN[\s\S]{0,60}generateValue:\s*true/);
  });

  test('deploys from a branch that exists and carries the platform', () => {
    // Render rejects the whole blueprint with "branch <x> could not be found"
    // if this names a branch that is not in the repo — and this repo has no
    // `main`, so a plausible-looking default fails the deploy outright.
    const branch = blueprint.match(/^\s*branch:\s*(\S+)/m)?.[1];
    assert.ok(branch, 'the blueprint must name a branch');

    let refs;
    try {
      refs = execFileSync('git', ['for-each-ref', '--format=%(refname:short)',
        'refs/heads', 'refs/remotes'], { encoding: 'utf8', cwd: config.root });
    } catch {
      return; // not a git checkout (tarball deploy, vendored copy) — nothing to check
    }
    const known = refs.split('\n').map((r) => r.replace(/^origin\//, '').trim());
    assert.ok(known.includes(branch),
      `render.yaml deploys from "${branch}", which is not a branch in this repo. ` +
      `Known: ${[...new Set(known)].filter(Boolean).join(', ')}`);
  });

  test('the collector is not left open to every origin', () => {
    assert.doesNotMatch(blueprint, /TRACKING_ORIGINS[\s\S]{0,40}["']?\*["']?\s*$/m);
    assert.match(blueprint, /TRACKING_ORIGINS[\s\S]{0,60}beamr\.com/);
  });
});
