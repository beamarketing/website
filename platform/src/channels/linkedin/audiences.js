import { all, get, run, tx } from '../../db/index.js';
import { config } from '../../config.js';
import { badRequest, notFound } from '../../lib/http.js';
import { id, now, chunk, parseJson } from '../../lib/util.js';
import { buildQuery } from '../../core/segments.js';
import { getList } from '../../core/contacts.js';
import { recordEvent } from '../../core/events.js';
import { LinkedInClient, dryRun } from './client.js';
import { logger } from '../../lib/logger.js';

const log = logger('linkedin:audiences');

// LinkedIn accepts large batches but is happier with modest ones.
const PUSH_CHUNK = 1000;

/**
 * A matched audience mirrors a Beamr list into LinkedIn as SHA-256 email
 * hashes. This is the "personal advertising" primitive: the ad is served to
 * the specific people on our dedicated list, not to a lookalike of them.
 *
 * Two hard constraints, enforced here rather than discovered later:
 *  1. LinkedIn will not *serve* an audience that matches fewer than ~300
 *     members, so a small list silently spends nothing.
 *  2. Only contacts with consent_ads = 1 are ever pushed.
 */
export function createAudience({ name, list_id: listId = null, rules = {}, auto_sync: autoSync = true }) {
  if (!name) throw badRequest('Audience needs a name');
  if (listId) getList(listId); // 404s early if the list is bogus
  const ts = now();
  const audienceId = id('au');
  run(
    `INSERT INTO li_audiences (id, name, list_id, account_urn, status, auto_sync, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?)`,
    audienceId, name, listId,
    config.linkedin.adAccountId ? `urn:li:sponsoredAccount:${String(config.linkedin.adAccountId).replace(/\D/g, '')}` : null,
    'pending', autoSync ? 1 : 0, ts, ts,
  );
  // Rules live alongside the audience so a behavioural segment — not just a
  // static list — can drive who gets advertised to.
  setAudienceRules(audienceId, rules);
  return getAudience(audienceId);
}

const RULES_KEY = (audienceId) => `audience_rules:${audienceId}`;

export function setAudienceRules(audienceId, rules) {
  run(
    `INSERT INTO settings (key, value, updated_at) VALUES (?,?,?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    RULES_KEY(audienceId), JSON.stringify(rules || {}), now(),
  );
}

export function audienceRules(audienceId) {
  const row = get('SELECT value FROM settings WHERE key = ?', RULES_KEY(audienceId));
  return parseJson(row?.value, {});
}

export function getAudience(audienceId) {
  const a = get('SELECT * FROM li_audiences WHERE id = ?', audienceId);
  if (!a) throw notFound(`No audience ${audienceId}`);
  return { ...a, rules: audienceRules(a.id) };
}

export function listAudiences() {
  return all('SELECT * FROM li_audiences ORDER BY created_at DESC').map((a) => ({
    ...a,
    rules: audienceRules(a.id),
    pending: get("SELECT COUNT(*) AS n FROM li_audience_members WHERE audience_id = ? AND state = 'pending'", a.id)?.n ?? 0,
  }));
}

/** Who *should* be in this audience right now. */
export function resolveMembers(audience) {
  const { sql, args } = buildQuery({
    rules: audience.rules || audienceRules(audience.id),
    listId: audience.list_id,
    adTargetable: true,
    select: 'contacts.id, contacts.email_sha256, contacts.email',
    orderBy: 'contacts.score DESC',
  });
  return all(sql, ...args);
}

/**
 * Diffs desired membership against what we last pushed, then sends the
 * additions and removals. Removals matter: an unsubscribed or closed-won
 * contact should stop seeing the acquisition ad.
 */
export async function syncAudience(audienceId, { force = false } = {}) {
  const audience = getAudience(audienceId);
  const client = new LinkedInClient();
  const desired = resolveMembers(audience);
  const desiredIds = new Set(desired.map((d) => d.id));

  const current = all(
    "SELECT contact_id, state FROM li_audience_members WHERE audience_id = ? AND state != 'removed'",
    audience.id,
  );
  const currentIds = new Set(current.map((c) => c.contact_id));

  const toAdd = desired.filter((d) => !currentIds.has(d.id) || force);
  const toRemove = current.filter((c) => !desiredIds.has(c.contact_id));

  run("UPDATE li_audiences SET status = 'syncing', updated_at = ? WHERE id = ?", now(), audience.id);

  const result = {
    audience_id: audience.id,
    name: audience.name,
    desired: desired.length,
    added: 0,
    removed: 0,
    dry_run: dryRun(),
    warnings: [],
  };

  if (desired.length < config.linkedin.minAudienceSize) {
    result.warnings.push(
      `Only ${desired.length} contacts match. LinkedIn will not serve ads to an audience `
      + `below roughly ${config.linkedin.minAudienceSize} matched members, so this audience `
      + `can be created and pushed but will not deliver impressions until it grows.`,
    );
  }

  try {
    // Make sure the segment exists on LinkedIn's side.
    let urn = audience.urn;
    if (!urn && !dryRun()) {
      const created = await client.createDmpSegment({ name: audience.name, description: `Beamr ABM · ${audience.name}` });
      urn = created?.id ? `urn:li:dmpSegment:${String(created.id).replace(/\D/g, '')}` : (created?.elements?.[0] || null);
      if (!urn && created?.value?.id) urn = `urn:li:dmpSegment:${created.value.id}`;
      run('UPDATE li_audiences SET urn = ? WHERE id = ?', urn, audience.id);
      log.info(`created LinkedIn DMP segment ${urn} for "${audience.name}"`);
    }

    const segmentId = urn ? urn.split(':').pop() : null;

    for (const batch of chunk(toAdd, PUSH_CHUNK)) {
      if (!dryRun() && segmentId) {
        await client.updateDmpSegmentUsers(segmentId, batch.map((b) => b.email_sha256), 'ADD');
      }
      const ts = now();
      tx(() => {
        for (const member of batch) {
          run(
            `INSERT INTO li_audience_members (audience_id, contact_id, state, pushed_at) VALUES (?,?,?,?)
             ON CONFLICT(audience_id, contact_id) DO UPDATE SET state = 'pushed', pushed_at = excluded.pushed_at`,
            audience.id, member.id, 'pushed', ts,
          );
          recordEvent({
            contact_id: member.id, channel: 'linkedin', type: 'audience_added',
            meta: { audience: audience.name, audience_id: audience.id, dry_run: dryRun() },
            dedupe_key: `aud_add:${audience.id}:${member.id}`,
          });
        }
      });
      result.added += batch.length;
    }

    for (const batch of chunk(toRemove, PUSH_CHUNK)) {
      const hashes = batch
        .map((b) => get('SELECT email_sha256 FROM contacts WHERE id = ?', b.contact_id)?.email_sha256)
        .filter(Boolean);
      if (!dryRun() && segmentId && hashes.length) {
        await client.updateDmpSegmentUsers(segmentId, hashes, 'REMOVE');
      }
      tx(() => {
        for (const member of batch) {
          run("UPDATE li_audience_members SET state = 'removed' WHERE audience_id = ? AND contact_id = ?", audience.id, member.contact_id);
          recordEvent({
            contact_id: member.contact_id, channel: 'linkedin', type: 'audience_removed',
            meta: { audience: audience.name, audience_id: audience.id },
            dedupe_key: `aud_rm:${audience.id}:${member.contact_id}:${new Date().toISOString().slice(0, 10)}`,
          });
        }
      });
      result.removed += batch.length;
    }

    // LinkedIn only reports how many hashes it could actually match to members.
    let matched = null;
    if (!dryRun() && segmentId) {
      try {
        const segment = await client.getDmpSegment(segmentId);
        matched = segment?.audienceCount ?? segment?.matchedAudienceCount ?? null;
      } catch (err) { log.warn(`could not read segment size: ${err.message}`); }
    }

    run(
      `UPDATE li_audiences SET status = 'ready', member_count = ?, matched_count = ?,
         last_synced_at = ?, last_error = NULL, updated_at = ? WHERE id = ?`,
      desired.length, matched ?? (dryRun() ? desired.length : 0), now(), now(), audience.id,
    );
    log.info(`synced "${audience.name}": ${result.added} added, ${result.removed} removed${dryRun() ? ' (dry run)' : ''}`);
  } catch (err) {
    run("UPDATE li_audiences SET status = 'error', last_error = ?, updated_at = ? WHERE id = ?",
      String(err.message).slice(0, 500), now(), audience.id);
    result.error = err.message;
    log.error(`sync failed for "${audience.name}": ${err.message}`);
  }

  return result;
}

/** Syncs every auto-sync audience; the scheduler's entry point. */
export async function syncAll() {
  const audiences = all("SELECT id FROM li_audiences WHERE auto_sync = 1");
  const results = [];
  for (const a of audiences) results.push(await syncAudience(a.id));
  return { synced: results.length, results };
}

export function deleteAudience(audienceId) {
  const audience = getAudience(audienceId);
  run('DELETE FROM li_audiences WHERE id = ?', audience.id);
  run('DELETE FROM settings WHERE key = ?', RULES_KEY(audience.id));
  return { deleted: audience.id };
}

/** Members with the contact detail the console needs to render them. */
export function audienceMembers(audienceId, { limit = 100, offset = 0 } = {}) {
  return all(
    `SELECT c.id, c.email, c.first_name, c.last_name, c.company, c.job_title, c.score, c.grade,
            m.state, m.pushed_at
     FROM li_audience_members m JOIN contacts c ON c.id = m.contact_id
     WHERE m.audience_id = ? ORDER BY c.score DESC LIMIT ? OFFSET ?`,
    audienceId, Number(limit), Number(offset),
  );
}
