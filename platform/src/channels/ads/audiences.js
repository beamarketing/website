import { all, get, run, tx, settings } from '../../db/index.js';
import { config } from '../../config.js';
import { badRequest, notFound } from '../../lib/http.js';
import { id, now, parseJson, signToken, clamp } from '../../lib/util.js';
import { buildQuery } from '../../core/segments.js';
import { getList } from '../../core/contacts.js';
import { recordEvent } from '../../core/events.js';
import { adapter, PLATFORMS } from './adapters.js';
import { logger } from '../../lib/logger.js';

const log = logger('ads:audiences');

/**
 * An audience mirrors a Beamr list or segment into an ad platform as hashed
 * identities. The same list can be pushed to LinkedIn and Meta at once, each
 * with its own hashing rules and its own minimum servable size.
 *
 * Two invariants, enforced here rather than left to the caller:
 *  1. Only contacts with `consent_ads` are ever pushed.
 *  2. Someone who leaves the segment is actively removed on the next sync,
 *     not merely stopped from being re-added.
 */

export function createAudience({
  name, platform = 'linkedin', list_id: listId = null, rules = {},
  auto_sync: autoSync = true, cohort_mode: cohortMode = false, cohort_size: cohortSize = null,
}) {
  if (!name) throw badRequest('Audience needs a name');
  if (!PLATFORMS.includes(platform)) throw badRequest(`platform must be one of: ${PLATFORMS.join(', ')}`);
  if (listId) getList(listId);

  const ts = now();
  const audienceId = id('au');
  run(
    `INSERT INTO ad_audiences (id, platform, name, list_id, rules, account_ref, status,
       cohort_mode, cohort_size, auto_sync, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    audienceId, platform, name, listId, JSON.stringify(rules || {}),
    accountRef(platform), 'pending',
    cohortMode ? 1 : 0, cohortSize || null, autoSync ? 1 : 0, ts, ts,
  );
  return getAudience(audienceId);
}

function accountRef(platform) {
  if (platform === 'linkedin') {
    return config.linkedin.adAccountId
      ? `urn:li:sponsoredAccount:${String(config.linkedin.adAccountId).replace(/\D/g, '')}` : null;
  }
  return config.meta.adAccountId ? `act_${config.meta.adAccountId}` : null;
}

export function getAudience(audienceId) {
  const a = get('SELECT * FROM ad_audiences WHERE id = ?', audienceId);
  if (!a) throw notFound(`No audience ${audienceId}`);
  return hydrate(a);
}

const hydrate = (a) => ({
  ...a,
  rules: parseJson(a.rules, {}),
  cohort_mode: !!a.cohort_mode,
  auto_sync: !!a.auto_sync,
});

export function listAudiences({ platform = null } = {}) {
  const rows = platform
    ? all('SELECT * FROM ad_audiences WHERE platform = ? ORDER BY created_at DESC', platform)
    : all('SELECT * FROM ad_audiences ORDER BY created_at DESC');
  return rows.map((a) => ({
    ...hydrate(a),
    pending: get("SELECT COUNT(*) AS n FROM ad_audience_members WHERE audience_id = ? AND state = 'pending'", a.id)?.n ?? 0,
    cohorts: get('SELECT COUNT(*) AS n FROM ad_cohorts WHERE audience_id = ?', a.id)?.n ?? 0,
    min_audience_size: adapter(a.platform).minAudienceSize,
  }));
}

export function updateAudience(audienceId, patch) {
  const audience = getAudience(audienceId);
  const sets = [];
  const args = [];
  for (const field of ['name', 'list_id', 'cohort_size']) {
    if (patch[field] === undefined) continue;
    sets.push(`${field} = ?`); args.push(patch[field]);
  }
  if (patch.rules !== undefined) { sets.push('rules = ?'); args.push(JSON.stringify(patch.rules)); }
  if (patch.auto_sync !== undefined) { sets.push('auto_sync = ?'); args.push(patch.auto_sync ? 1 : 0); }
  if (patch.cohort_mode !== undefined) { sets.push('cohort_mode = ?'); args.push(patch.cohort_mode ? 1 : 0); }
  if (!sets.length) return audience;
  sets.push('updated_at = ?'); args.push(now());
  run(`UPDATE ad_audiences SET ${sets.join(', ')} WHERE id = ?`, ...args, audience.id);
  return getAudience(audience.id);
}

/** Who should be in this audience right now, consent applied. */
export function resolveMembers(audience) {
  const { sql, args } = buildQuery({
    rules: audience.rules || {},
    listId: audience.list_id,
    adTargetable: true,
    select: 'contacts.*',
    orderBy: 'contacts.score DESC, contacts.id',
  });
  return all(sql, ...args);
}

/**
 * Diffs desired membership against what we last pushed, then applies the
 * difference on the platform.
 */
export async function syncAudience(audienceId, { force = false } = {}) {
  const audience = getAudience(audienceId);
  const plat = adapter(audience.platform);
  const desired = resolveMembers(audience);
  const desiredIds = new Set(desired.map((d) => d.id));

  const current = all(
    "SELECT contact_id FROM ad_audience_members WHERE audience_id = ? AND state != 'removed'",
    audience.id,
  );
  const currentIds = new Set(current.map((c) => c.contact_id));

  const toAdd = force ? desired : desired.filter((d) => !currentIds.has(d.id));
  const toRemove = current
    .filter((c) => !desiredIds.has(c.contact_id))
    .map((c) => get('SELECT * FROM contacts WHERE id = ?', c.contact_id))
    .filter(Boolean);

  run("UPDATE ad_audiences SET status = 'syncing', updated_at = ? WHERE id = ?", now(), audience.id);

  const result = {
    audience_id: audience.id,
    platform: audience.platform,
    name: audience.name,
    desired: desired.length,
    added: 0,
    removed: 0,
    dry_run: plat.dryRun,
    cohorts: null,
    warnings: [],
  };

  if (desired.length < plat.minAudienceSize) {
    result.warnings.push(
      `Only ${desired.length} contacts match. ${plat.label} will not serve ads to an audience `
      + `below roughly ${plat.minAudienceSize} matched members, so this audience can be pushed `
      + `but will not deliver impressions until it grows.`,
    );
  }
  if (audience.platform === 'meta' && plat.matchQuality) {
    const quality = plat.matchQuality(desired);
    result.match_quality = quality;
    if (quality.rows && quality.avg_keys < 3) {
      result.warnings.push(
        `Contacts carry an average of only ${quality.avg_keys} of ${quality.total_keys} match keys. `
        + `Meta matches on far more than email — adding first name, last name and country to these `
        + `contacts would raise the match rate materially.`,
      );
    }
  }

  try {
    // Ensure the platform-side audience exists.
    let externalId = audience.external_id;
    if (!externalId && !plat.dryRun) {
      const created = await plat.createAudience({
        name: audience.name,
        description: `Beamr contact-based marketing · ${audience.name}`,
      });
      externalId = created.externalId;
      run('UPDATE ad_audiences SET external_id = ? WHERE id = ?', externalId, audience.id);
      log.info(`created ${plat.label} audience ${externalId} for "${audience.name}"`);
    }

    if (toAdd.length) {
      if (!plat.dryRun && externalId) await plat.addMembers(externalId, toAdd);
      const ts = now();
      tx(() => {
        for (const member of toAdd) {
          run(
            `INSERT INTO ad_audience_members (audience_id, contact_id, state, pushed_at) VALUES (?,?,?,?)
             ON CONFLICT(audience_id, contact_id) DO UPDATE SET state = 'pushed', pushed_at = excluded.pushed_at`,
            audience.id, member.id, 'pushed', ts,
          );
          recordEvent({
            contact_id: member.id, channel: 'ads', type: 'audience_added',
            platform: audience.platform,
            meta: { audience: audience.name, audience_id: audience.id, platform: audience.platform, dry_run: plat.dryRun },
            dedupe_key: `aud_add:${audience.id}:${member.id}`,
          });
        }
      });
      result.added = toAdd.length;
    }

    if (toRemove.length) {
      if (!plat.dryRun && externalId) await plat.removeMembers(externalId, toRemove);
      tx(() => {
        for (const member of toRemove) {
          run("UPDATE ad_audience_members SET state = 'removed' WHERE audience_id = ? AND contact_id = ?",
            audience.id, member.id);
          recordEvent({
            contact_id: member.id, channel: 'ads', type: 'audience_removed',
            platform: audience.platform,
            meta: { audience: audience.name, audience_id: audience.id, platform: audience.platform },
            dedupe_key: `aud_rm:${audience.id}:${member.id}:${new Date().toISOString().slice(0, 10)}`,
          });
        }
      });
      result.removed = toRemove.length;
    }

    // Only the platform knows how many hashes it could actually match.
    let matched = null;
    if (!plat.dryRun && externalId) {
      try { matched = await plat.audienceSize(externalId); }
      catch (err) { log.warn(`could not read ${plat.label} audience size: ${err.message}`); }
    }

    run(
      `UPDATE ad_audiences SET status = 'ready', member_count = ?, matched_count = ?,
         last_synced_at = ?, last_error = NULL, updated_at = ? WHERE id = ?`,
      desired.length, matched ?? (plat.dryRun ? desired.length : 0), now(), now(), audience.id,
    );

    if (audience.cohort_mode) {
      const { syncCohorts } = await import('./cohorts.js');
      result.cohorts = await syncCohorts(audience.id);
    }

    log.info(
      `synced ${plat.label} audience "${audience.name}": ${result.added} added, `
      + `${result.removed} removed${plat.dryRun ? ' (dry run)' : ''}`,
    );
  } catch (err) {
    run("UPDATE ad_audiences SET status = 'error', last_error = ?, updated_at = ? WHERE id = ?",
      String(err.message).slice(0, 500), now(), audience.id);
    result.error = err.message;
    log.error(`sync failed for "${audience.name}": ${err.message}`);
  }

  return result;
}

export async function syncAll({ platform = null } = {}) {
  const rows = platform
    ? all('SELECT id FROM ad_audiences WHERE auto_sync = 1 AND platform = ?', platform)
    : all('SELECT id FROM ad_audiences WHERE auto_sync = 1');
  const results = [];
  for (const a of rows) results.push(await syncAudience(a.id));
  return {
    synced: results.length,
    added: results.reduce((n, r) => n + r.added, 0),
    removed: results.reduce((n, r) => n + r.removed, 0),
    results,
  };
}

export async function deleteAudience(audienceId) {
  const audience = getAudience(audienceId);
  const plat = adapter(audience.platform);
  if (audience.external_id && !plat.dryRun) {
    try { await plat.deleteAudience(audience.external_id); }
    catch (err) { log.warn(`platform delete failed: ${err.message}`); }
  }
  run('DELETE FROM ad_audiences WHERE id = ?', audience.id);
  return { deleted: audience.id };
}

export function audienceMembers(audienceId, { limit = 100, offset = 0 } = {}) {
  return all(
    `SELECT c.id, c.email, c.first_name, c.last_name, c.company, c.job_title, c.score, c.grade,
            m.state, m.pushed_at, m.cohort_id, co.label AS cohort_label
     FROM ad_audience_members m
     JOIN contacts c ON c.id = m.contact_id
     LEFT JOIN ad_cohorts co ON co.id = m.cohort_id
     WHERE m.audience_id = ? ORDER BY c.score DESC LIMIT ? OFFSET ?`,
    audienceId, Number(limit), Number(offset),
  );
}

/**
 * Same list, both platforms. This is the normal way to run contact-based
 * advertising: LinkedIn reaches people in a work context, Meta reaches the same
 * people far more cheaply in a personal one, and the contact record is what
 * ties the two together.
 */
export async function mirrorToAllPlatforms({ name, list_id: listId = null, rules = {}, cohort_mode: cohortMode = false }) {
  const created = [];
  for (const platform of PLATFORMS) {
    const audience = createAudience({
      name: `${name} · ${adapter(platform).label.split(' ')[0]}`,
      platform, list_id: listId, rules, cohort_mode: cohortMode,
    });
    created.push(await syncAudience(audience.id));
  }
  return { mirrored: created.length, results: created };
}
