import { all, get, run, tx } from '../../db/index.js';
import { config } from '../../config.js';
import { badRequest, notFound } from '../../lib/http.js';
import { id, now, signToken, verifyToken, clamp, chunk } from '../../lib/util.js';
import { adapter } from './adapters.js';
import { logger } from '../../lib/logger.js';

const log = logger('ads:cohorts');

/**
 * Cohorts: how contact-level ad attribution is actually obtained.
 *
 * No ad platform reports per member. Both LinkedIn and Meta report per ad
 * object — campaign, ad set, ad. So the way to get person-level numbers is not
 * to ask the platform for them, but to make the ad object small enough that its
 * ordinary aggregate report is already person-resolved.
 *
 * We split an audience into cohorts at the smallest size the platform will
 * still serve, give each cohort its own platform audience, its own ad and its
 * own tracking URL, and the platform's per-ad reporting then reads out as
 * "these N named people saw it this many times".
 *
 * What this does and does not buy you:
 *   - Impressions resolve to a cohort, not to an individual. A cohort of 100 on
 *     Meta means "one of these 100 people", not "this person". Honest reporting
 *     says so; this module never claims otherwise.
 *   - Clicks DO resolve to the individual, because each cohort's landing URL
 *     carries a signed token and the site tracker identifies the visitor.
 *
 * LinkedIn's ~300 floor and Meta's ~100 floor are the hard limits on precision.
 * Nobody can go below them, including the vendors who imply they do.
 */

/** Cohort size for a platform: the floor, plus headroom for match loss. */
export function cohortSizeFor(platform, override = null) {
  const plat = adapter(platform);
  if (override) return Math.max(plat.minAudienceSize, Number(override));
  return Math.ceil(plat.minAudienceSize * config.ads.cohortOversizeFactor);
}

/**
 * Splits the audience's members into cohorts and reconciles them with what
 * already exists. Membership is ordered by score, so cohort 1 is always the
 * highest-intent slice — which is the one worth spending most on.
 */
export async function syncCohorts(audienceId) {
  const audience = get('SELECT * FROM ad_audiences WHERE id = ?', audienceId);
  if (!audience) throw notFound(`No audience ${audienceId}`);
  const plat = adapter(audience.platform);

  const members = all(
    `SELECT m.contact_id, c.score, c.email, c.first_name, c.last_name, c.company,
            c.email_sha256, c.country, c.phone, c.attrs, c.id
     FROM ad_audience_members m JOIN contacts c ON c.id = m.contact_id
     WHERE m.audience_id = ? AND m.state = 'pushed'
     ORDER BY c.score DESC, c.id`,
    audienceId,
  );

  const size = cohortSizeFor(audience.platform, audience.cohort_size);
  const slices = chunk(members, size);
  const capped = slices.slice(0, config.ads.maxCohorts);

  const result = {
    audience_id: audienceId,
    platform: audience.platform,
    cohort_size: size,
    cohorts: capped.length,
    members: members.length,
    created: 0,
    updated: 0,
    retired: 0,
    dry_run: plat.dryRun,
    warnings: [],
  };

  if (slices.length > config.ads.maxCohorts) {
    result.warnings.push(
      `${slices.length} cohorts needed but AD_MAX_COHORTS is ${config.ads.maxCohorts}; `
      + `${members.length - capped.length * size} contacts are not in any cohort.`,
    );
  }
  if (members.length < plat.minAudienceSize) {
    result.warnings.push(
      `Audience has ${members.length} members, below ${plat.label}'s ~${plat.minAudienceSize} `
      + `serving floor — cohorts are created but none will deliver.`,
    );
  }

  for (const [index, slice] of capped.entries()) {
    const seq = index + 1;
    const label = `${audience.name} · cohort ${seq}`;
    const existing = get('SELECT * FROM ad_cohorts WHERE audience_id = ? AND seq = ?', audienceId, seq);

    let cohortId = existing?.id;
    if (!existing) {
      cohortId = id('ch');
      const token = signToken({ ch: cohortId, a: audienceId });
      run(
        `INSERT INTO ad_cohorts (id, audience_id, platform, seq, label, token, member_count,
           status, created_at, updated_at)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
        cohortId, audienceId, audience.platform, seq, label, token, slice.length, 'pending', now(), now(),
      );
      result.created += 1;
    } else {
      run('UPDATE ad_cohorts SET member_count = ?, label = ?, updated_at = ? WHERE id = ?',
        slice.length, label, now(), existing.id);
      result.updated += 1;
    }

    // Point every member at their cohort so a click can be traced back.
    tx(() => {
      for (const member of slice) {
        run('UPDATE ad_audience_members SET cohort_id = ? WHERE audience_id = ? AND contact_id = ?',
          cohortId, audienceId, member.contact_id);
      }
    });

    await pushCohort(cohortId, slice, { audience, plat });
  }

  // Cohorts beyond the current member count no longer have anyone in them.
  const stale = all('SELECT * FROM ad_cohorts WHERE audience_id = ? AND seq > ?', audienceId, capped.length);
  for (const cohort of stale) {
    run("UPDATE ad_cohorts SET status = 'retired', member_count = 0, updated_at = ? WHERE id = ?", now(), cohort.id);
    result.retired += 1;
  }

  run('UPDATE ad_audiences SET cohort_mode = 1, cohort_size = ?, updated_at = ? WHERE id = ?',
    size, now(), audienceId);

  log.info(
    `${plat.label} "${audience.name}": ${result.cohorts} cohorts of ~${size} `
    + `(${result.created} new, ${result.retired} retired)${plat.dryRun ? ' (dry run)' : ''}`,
  );
  return result;
}

/** Creates or refreshes the platform-side audience backing one cohort. */
async function pushCohort(cohortId, members, { audience, plat }) {
  const cohort = get('SELECT * FROM ad_cohorts WHERE id = ?', cohortId);
  try {
    let externalId = cohort.external_id;
    if (!externalId && !plat.dryRun) {
      const created = await plat.createAudience({
        name: cohort.label,
        description: `Beamr cohort ${cohort.seq} of audience "${audience.name}"`,
      });
      externalId = created.externalId;
      run('UPDATE ad_cohorts SET external_id = ? WHERE id = ?', externalId, cohortId);
    }
    if (!plat.dryRun && externalId && members.length) {
      await plat.addMembers(externalId, members);
    }
    run(
      `UPDATE ad_cohorts SET status = 'ready', last_synced_at = ?, last_error = NULL,
         matched_count = ?, updated_at = ? WHERE id = ?`,
      now(), plat.dryRun ? members.length : (cohort.matched_count || 0), now(), cohortId,
    );
  } catch (err) {
    run("UPDATE ad_cohorts SET status = 'error', last_error = ?, updated_at = ? WHERE id = ?",
      String(err.message).slice(0, 400), now(), cohortId);
    log.warn(`cohort ${cohort.label} failed: ${err.message}`);
  }
}

/**
 * The landing URL to put behind a cohort's ad creative.
 * It carries the cohort token, so a click identifies which slice — and once the
 * visitor is known, which person — engaged.
 */
export function cohortLandingUrl(cohortId, destination = null) {
  const cohort = get('SELECT * FROM ad_cohorts WHERE id = ?', cohortId);
  if (!cohort) throw notFound(`No cohort ${cohortId}`);
  const base = destination || cohort.landing_url || `${config.publicUrl}/`;
  try {
    const url = new URL(base);
    url.searchParams.set('bmr_co', cohort.token);
    url.searchParams.set('utm_source', cohort.platform);
    url.searchParams.set('utm_medium', 'cpc');
    url.searchParams.set('utm_content', `cohort-${cohort.seq}`);
    return url.toString();
  } catch {
    throw badRequest(`Invalid destination URL: ${base}`);
  }
}

export function setCohortLanding(cohortId, destination) {
  const cohort = get('SELECT * FROM ad_cohorts WHERE id = ?', cohortId);
  if (!cohort) throw notFound(`No cohort ${cohortId}`);
  run('UPDATE ad_cohorts SET landing_url = ?, updated_at = ? WHERE id = ?', destination, now(), cohortId);
  return cohortLandingUrl(cohortId, destination);
}

/** Binds a cohort to the ad object that serves it, so metrics can be joined. */
export function linkCohortToAd(cohortId, { ad_campaign_id: campaignId = null, creative_id: creativeId = null }) {
  const cohort = get('SELECT * FROM ad_cohorts WHERE id = ?', cohortId);
  if (!cohort) throw notFound(`No cohort ${cohortId}`);
  run(
    'UPDATE ad_cohorts SET ad_campaign_id = COALESCE(?, ad_campaign_id), creative_id = COALESCE(?, creative_id), updated_at = ? WHERE id = ?',
    campaignId, creativeId, now(), cohortId,
  );
  // Back-fill any metrics already ingested for that ad object.
  if (creativeId) {
    run('UPDATE ad_metrics SET cohort_id = ? WHERE creative_id = ? AND cohort_id IS NULL', cohortId, creativeId);
  } else if (campaignId) {
    run('UPDATE ad_metrics SET cohort_id = ? WHERE ad_campaign_id = ? AND cohort_id IS NULL', cohortId, campaignId);
  }
  return get('SELECT * FROM ad_cohorts WHERE id = ?', cohortId);
}

/** Resolves a `bmr_co` token from a landing URL back to its cohort. */
export function cohortFromToken(token) {
  const payload = verifyToken(token);
  if (!payload?.ch) return null;
  return get('SELECT * FROM ad_cohorts WHERE id = ?', payload.ch);
}

export function listCohorts(audienceId) {
  return all(
    `SELECT co.*,
            (SELECT COUNT(*) FROM ad_audience_members m WHERE m.cohort_id = co.id AND m.state = 'pushed') AS members,
            (SELECT COALESCE(SUM(impressions),0) FROM ad_metrics m WHERE m.cohort_id = co.id) AS impressions,
            (SELECT COALESCE(SUM(clicks),0) FROM ad_metrics m WHERE m.cohort_id = co.id) AS clicks,
            (SELECT COALESCE(SUM(spend),0) FROM ad_metrics m WHERE m.cohort_id = co.id) AS spend
     FROM ad_cohorts co WHERE co.audience_id = ? ORDER BY co.seq`,
    audienceId,
  ).map((c) => ({
    ...c,
    landing_url_with_token: safeUrl(c.id, c.landing_url),
    // The honest precision statement for this cohort.
    attribution_precision: c.members
      ? `1 of ${c.members} named contacts`
      : 'no members',
    impressions_per_member: c.members ? Math.round(Number(c.impressions) / c.members) : 0,
  }));
}

function safeUrl(cohortId, landing) {
  try { return cohortLandingUrl(cohortId, landing); } catch { return null; }
}

/** Named contacts in one cohort — who an impression could have reached. */
export function cohortMembers(cohortId) {
  return all(
    `SELECT c.id, c.email, c.first_name, c.last_name, c.company, c.job_title, c.score, c.grade
     FROM ad_audience_members m JOIN contacts c ON c.id = m.contact_id
     WHERE m.cohort_id = ? AND m.state = 'pushed' ORDER BY c.score DESC`,
    cohortId,
  );
}

/**
 * How much precision cohorting actually bought, stated plainly.
 * Without cohorts an impression is attributable to the whole audience; with
 * them it narrows to one cohort.
 */
export function precisionReport(audienceId) {
  const audience = get('SELECT * FROM ad_audiences WHERE id = ?', audienceId);
  if (!audience) throw notFound(`No audience ${audienceId}`);
  const plat = adapter(audience.platform);
  const cohorts = all('SELECT member_count FROM ad_cohorts WHERE audience_id = ? AND status != ?', audienceId, 'retired');
  const total = get("SELECT COUNT(*) AS n FROM ad_audience_members WHERE audience_id = ? AND state = 'pushed'", audienceId)?.n ?? 0;
  const avg = cohorts.length
    ? Math.round(cohorts.reduce((n, c) => n + c.member_count, 0) / cohorts.length)
    : total;

  return {
    audience_id: audienceId,
    platform: audience.platform,
    platform_floor: plat.minAudienceSize,
    total_members: total,
    cohorts: cohorts.length,
    avg_cohort_size: avg,
    without_cohorts: total ? `1 of ${total}` : 'n/a',
    with_cohorts: avg ? `1 of ${avg}` : 'n/a',
    precision_gain: avg && total ? Math.round((total / avg) * 10) / 10 : 1,
    clicks_note:
      'Clicks resolve to the individual regardless of cohort size, because each cohort '
      + 'landing URL carries a signed token and the site tracker identifies the visitor.',
    impressions_note:
      `Impressions resolve to a cohort, never to one person. ${plat.label} will not serve below `
      + `~${plat.minAudienceSize} matched members, which is the hard floor on impression precision.`,
  };
}
