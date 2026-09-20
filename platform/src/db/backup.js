import { backup as sqliteBackup, DatabaseSync } from 'node:sqlite';
import { mkdirSync, readdirSync, statSync, unlinkSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { createGzip } from 'node:zlib';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { config } from '../config.js';
import { db } from './index.js';
import { logger } from '../lib/logger.js';

const log = logger('backup');

/**
 * Online backup.
 *
 * SQLite on an attached disk is the right storage choice here, but it moves the
 * durability burden onto us: there is no managed provider taking snapshots. So
 * this uses SQLite's own online backup API, which produces a consistent copy of
 * a database that is actively being written to — copying the file with `cp`
 * while the server is running can capture a torn page and yield a backup that
 * only fails when you try to restore it.
 */
/**
 * Backups live beside the database, never beside the code.
 *
 * These are two different filesystems in every real deployment: the database
 * sits on a mounted persistent disk, the application directory is part of the
 * container image and is wiped on each deploy. Defaulting to the app directory
 * would put backups somewhere that does not survive a restart — a failure that
 * stays invisible until the day you need to restore.
 */
export const backupDir = () => join(dirname(config.dbPath), 'backups');

export async function createBackup({ dir = null, compress = true, keep = 14 } = {}) {
  const target = dir || backupDir();
  mkdirSync(target, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const rawPath = join(target, `beamr-abm-${stamp}.db`);

  const started = Date.now();
  // Passing the live connection lets SQLite coordinate with in-flight writes.
  await sqliteBackup(db(), rawPath);

  let finalPath = rawPath;
  if (compress) {
    finalPath = `${rawPath}.gz`;
    await pipeline(createReadStream(rawPath), createGzip({ level: 6 }), createWriteStream(finalPath));
    unlinkSync(rawPath);
  }

  const size = statSync(finalPath).size;
  const pruned = prune(target, keep);

  log.info(`backup written: ${basename(finalPath)} (${(size / 1048576).toFixed(1)} MB, ${Date.now() - started}ms)`);
  return {
    path: finalPath,
    bytes: size,
    compressed: compress,
    duration_ms: Date.now() - started,
    pruned,
  };
}

/** Keeps the newest `keep` backups and deletes the rest. */
function prune(dir, keep) {
  if (!keep || keep < 1) return [];
  const files = readdirSync(dir)
    .filter((f) => f.startsWith('beamr-abm-') && (f.endsWith('.db') || f.endsWith('.db.gz')))
    .map((f) => ({ name: f, mtime: statSync(join(dir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);

  const stale = files.slice(keep);
  for (const file of stale) unlinkSync(join(dir, file.name));
  return stale.map((f) => f.name);
}

/**
 * Verifies a backup is actually restorable, rather than merely present.
 * An unverified backup is a guess; this opens it and runs SQLite's own
 * integrity check plus a sanity read of the contact table.
 */
export function verifyBackup(path) {
  if (!existsSync(path)) return { ok: false, error: `No file at ${path}` };
  if (path.endsWith('.gz')) {
    return { ok: false, error: 'Decompress the backup before verifying (gunzip it first)' };
  }
  try {
    const candidate = new DatabaseSync(path, { readOnly: true });
    const integrity = candidate.prepare('PRAGMA integrity_check').get();
    const contacts = candidate.prepare('SELECT COUNT(*) AS n FROM contacts').get();
    const events = candidate.prepare('SELECT COUNT(*) AS n FROM events').get();
    candidate.close();
    const ok = String(Object.values(integrity)[0]).toLowerCase() === 'ok';
    return {
      ok,
      integrity: Object.values(integrity)[0],
      contacts: contacts.n,
      events: events.n,
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export function listBackups({ dir = null } = {}) {
  const target = dir || backupDir();
  if (!existsSync(target)) return [];
  return readdirSync(target)
    .filter((f) => f.startsWith('beamr-abm-'))
    .map((f) => {
      const s = statSync(join(target, f));
      return { name: f, path: join(target, f), bytes: s.size, created_at: s.mtime.toISOString() };
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}
