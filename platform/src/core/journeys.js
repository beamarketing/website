import { all, get, run } from '../db/index.js';
import { badRequest, notFound } from '../lib/http.js';
import { id, now, parseJson } from '../lib/util.js';
import { buildQuery, compileRules } from './segments.js';
import { recordEvent } from './events.js';
import { addToList } from './contacts.js';
import { sendOne } from '../channels/email/campaigns.js';
import { syncAudience } from '../channels/ads/audiences.js';
import { logger } from '../lib/logger.js';

const log = logger('journeys');

/**
 * Trigger-based automation — the part that makes this an engine rather than a
 * reporting tool. A journey watches for a condition and fires actions across
 * channels, so "a targeted VP read the pricing page" can immediately mean
 * "send the case study, add them to the retargeting audience, tell sales".
 *
 * Triggers:
 *   event           — a matching event was recorded
 *   segment_entry   — the contact newly satisfies a rule set
 *   score_threshold — the score crossed a value
 *
 * Actions:
 *   send_email        { campaign_id }
 *   add_to_list       { list_id }
 *   add_to_audience   { audience_id }
 *   set_lifecycle     { stage }
 *   set_field         { field, value }
 *   alert             { title }
 *   webhook           { url }
 *   record_event      { type, meta }
 */

export const TRIGGER_TYPES = ['event', 'segment_entry', 'score_threshold'];
export const ACTION_TYPES = [
  'send_email', 'add_to_list', 'add_to_audience', 'set_lifecycle',
  'set_field', 'alert', 'webhook', 'record_event',
];

export function createJourney(input) {
  if (!input.name) throw badRequest('Journey needs a name');
  const triggerType = String(input.trigger_type || '');
  if (!TRIGGER_TYPES.includes(triggerType)) {
    throw badRequest(`trigger_type must be one of: ${TRIGGER_TYPES.join(', ')}`);
  }
  const actions = Array.isArray(input.actions) ? input.actions : [];
  for (const action of actions) {
    if (!ACTION_TYPES.includes(action.type)) throw badRequest(`Unknown action type: ${action.type}`);
  }
  // Fail loudly at creation if the rules are malformed, not at 3am when it fires.
  compileRules(input.conditions || {});

  const ts = now();
  const journeyId = id('jy');
  run(
    `INSERT INTO journeys (id, name, description, enabled, trigger_type, trigger_config,
       conditions, actions, cooldown_hours, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    journeyId, input.name, input.description || '', input.enabled ? 1 : 0,
    triggerType, JSON.stringify(input.trigger_config || {}),
    JSON.stringify(input.conditions || {}), JSON.stringify(actions),
    input.cooldown_hours === undefined ? 168 : Number(input.cooldown_hours),
    ts, ts,
  );
  return getJourney(journeyId);
}

export function getJourney(journeyId) {
  const j = get('SELECT * FROM journeys WHERE id = ?', journeyId);
  if (!j) throw notFound(`No journey ${journeyId}`);
  return hydrate(j);
}

export function listJourneys() {
  return all('SELECT * FROM journeys ORDER BY created_at DESC').map(hydrate);
}

const hydrate = (j) => ({
  ...j,
  enabled: !!j.enabled,
  trigger_config: parseJson(j.trigger_config, {}),
  conditions: parseJson(j.conditions, {}),
  actions: parseJson(j.actions, []),
});

export function updateJourney(journeyId, patch) {
  const journey = getJourney(journeyId);
  const sets = [];
  const args = [];
  for (const field of ['name', 'description', 'cooldown_hours']) {
    if (patch[field] === undefined) continue;
    sets.push(`${field} = ?`); args.push(patch[field]);
  }
  if (patch.enabled !== undefined) { sets.push('enabled = ?'); args.push(patch.enabled ? 1 : 0); }
  if (patch.trigger_type !== undefined) {
    if (!TRIGGER_TYPES.includes(patch.trigger_type)) throw badRequest('Invalid trigger_type');
    sets.push('trigger_type = ?'); args.push(patch.trigger_type);
  }
  for (const [field, key] of [['trigger_config', 'trigger_config'], ['conditions', 'conditions'], ['actions', 'actions']]) {
    if (patch[key] === undefined) continue;
    if (key === 'conditions') compileRules(patch[key]);
    sets.push(`${field} = ?`); args.push(JSON.stringify(patch[key]));
  }
  if (!sets.length) return journey;
  sets.push('updated_at = ?'); args.push(now());
  run(`UPDATE journeys SET ${sets.join(', ')} WHERE id = ?`, ...args, journey.id);
  return getJourney(journey.id);
}

export function deleteJourney(journeyId) {
  const journey = getJourney(journeyId);
  run('DELETE FROM journeys WHERE id = ?', journey.id);
  return { deleted: journey.id };
}

/** Contacts eligible for a journey right now, minus anyone in cooldown. */
export function candidatesFor(journey, { limit = 500 } = {}) {
  const cooldown = Number(journey.cooldown_hours) || 0;
  const cfg = journey.trigger_config || {};

  const extra = [];
  const extraArgs = [];

  if (journey.trigger_type === 'event') {
    const type = String(cfg.event_type || '');
    if (!type) return [];
    const withinHours = Number(cfg.within_hours) || 24;
    extra.push(
      `EXISTS (SELECT 1 FROM events e WHERE e.contact_id = contacts.id AND e.type = ?
         AND e.occurred_at >= datetime('now', ?)
         ${cfg.path_contains ? 'AND e.path LIKE ?' : ''}
         ${cfg.min_count ? 'GROUP BY e.contact_id HAVING COUNT(*) >= ?' : ''})`,
    );
    extraArgs.push(type, `-${withinHours} hours`);
    if (cfg.path_contains) extraArgs.push(`%${cfg.path_contains}%`);
    if (cfg.min_count) extraArgs.push(Number(cfg.min_count));
  }

  if (journey.trigger_type === 'score_threshold') {
    extra.push('contacts.score >= ?');
    extraArgs.push(Number(cfg.min_score) || 70);
  }

  // Cooldown: never re-run for the same contact inside the window.
  if (cooldown > 0) {
    extra.push(
      `NOT EXISTS (SELECT 1 FROM journey_runs jr WHERE jr.journey_id = ? AND jr.contact_id = contacts.id
         AND jr.status = 'completed' AND jr.ran_at >= datetime('now', ?))`,
    );
    extraArgs.push(journey.id, `-${cooldown} hours`);
  } else {
    extra.push("NOT EXISTS (SELECT 1 FROM journey_runs jr WHERE jr.journey_id = ? AND jr.contact_id = contacts.id AND jr.status = 'completed')");
    extraArgs.push(journey.id);
  }

  const { sql, args } = buildQuery({
    rules: journey.conditions || {},
    extraWhere: extra.length ? extra.join(' AND ') : null,
    extraArgs,
    orderBy: 'contacts.score DESC',
    limit,
  });
  return all(sql, ...args);
}

/** Executes one journey's actions for one contact. */
export async function runFor(journey, contact) {
  const performed = [];
  try {
    for (const action of journey.actions || []) {
      performed.push(await performAction(action, contact, journey));
    }
    run(
      'INSERT INTO journey_runs (id, journey_id, contact_id, status, detail, ran_at) VALUES (?,?,?,?,?,?)',
      id('jr'), journey.id, contact.id, 'completed', JSON.stringify({ actions: performed }), now(),
    );
    run('UPDATE journeys SET run_count = run_count + 1, last_run_at = ? WHERE id = ?', now(), journey.id);
    recordEvent({
      contact_id: contact.id, channel: 'system', type: 'journey_run',
      meta: { journey: journey.name, journey_id: journey.id, actions: performed.map((p) => p.type) },
    });
    return { ok: true, contact_id: contact.id, actions: performed };
  } catch (err) {
    run(
      'INSERT INTO journey_runs (id, journey_id, contact_id, status, detail, ran_at) VALUES (?,?,?,?,?,?)',
      id('jr'), journey.id, contact.id, 'failed', JSON.stringify({ error: err.message, actions: performed }), now(),
    );
    log.warn(`journey "${journey.name}" failed for ${contact.email}: ${err.message}`);
    return { ok: false, contact_id: contact.id, error: err.message };
  }
}

async function performAction(action, contact, journey) {
  switch (action.type) {
    case 'send_email': {
      if (!action.campaign_id) throw new Error('send_email action needs campaign_id');
      const result = await sendOne(action.campaign_id, contact.id);
      return { type: 'send_email', ...result };
    }
    case 'add_to_list': {
      if (!action.list_id) throw new Error('add_to_list action needs list_id');
      addToList(action.list_id, contact.id);
      recordEvent({ contact_id: contact.id, channel: 'system', type: 'list_added', meta: { list_id: action.list_id } });
      return { type: 'add_to_list', list_id: action.list_id };
    }
    case 'add_to_audience': {
      if (!action.audience_id) throw new Error('add_to_audience action needs audience_id');
      run(
        `INSERT INTO ad_audience_members (audience_id, contact_id, state) VALUES (?,?,'pending')
         ON CONFLICT(audience_id, contact_id) DO UPDATE SET state = 'pending'`,
        action.audience_id, contact.id,
      );
      // Push straight away when asked; otherwise the scheduler picks it up.
      if (action.sync_now) await syncAudience(action.audience_id);
      return { type: 'add_to_audience', audience_id: action.audience_id, synced: !!action.sync_now };
    }
    case 'set_lifecycle': {
      const stage = String(action.stage || '');
      if (!stage) throw new Error('set_lifecycle action needs stage');
      run('UPDATE contacts SET lifecycle_stage = ?, updated_at = ? WHERE id = ?', stage, now(), contact.id);
      recordEvent({
        contact_id: contact.id, channel: 'system', type: 'lifecycle_change',
        meta: { from: contact.lifecycle_stage, to: stage, journey: journey.name },
      });
      return { type: 'set_lifecycle', stage };
    }
    case 'set_field': {
      const field = String(action.field || '');
      // Whitelisted so a journey can never rewrite ids, emails or consent.
      const allowed = ['owner', 'lifecycle_stage', 'industry', 'company_size', 'country', 'seniority', 'function'];
      if (!allowed.includes(field)) throw new Error(`set_field cannot write "${field}"`);
      run(`UPDATE contacts SET ${field} = ?, updated_at = ? WHERE id = ?`, action.value ?? null, now(), contact.id);
      return { type: 'set_field', field, value: action.value };
    }
    case 'alert': {
      run(
        'INSERT INTO alerts (id, kind, contact_id, title, body, created_at) VALUES (?,?,?,?,?,?)',
        id('al'), 'journey', contact.id,
        String(action.title || `${journey.name}: ${contact.email}`),
        JSON.stringify({
          journey: journey.name, email: contact.email, company: contact.company,
          title: contact.job_title, score: contact.score, note: action.note || null,
        }),
        now(),
      );
      return { type: 'alert' };
    }
    case 'webhook': {
      if (!action.url) throw new Error('webhook action needs url');
      const res = await fetch(action.url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          journey: journey.name,
          contact: {
            id: contact.id, email: contact.email, first_name: contact.first_name,
            last_name: contact.last_name, company: contact.company, job_title: contact.job_title,
            score: contact.score, grade: contact.grade, lifecycle_stage: contact.lifecycle_stage,
          },
          fired_at: now(),
        }),
        signal: AbortSignal.timeout(10000),
      });
      return { type: 'webhook', status: res.status, ok: res.ok };
    }
    case 'record_event': {
      recordEvent({
        contact_id: contact.id,
        channel: action.channel || 'system',
        type: String(action.event_type || 'custom'),
        meta: action.meta || {},
      });
      return { type: 'record_event', event_type: action.event_type };
    }
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

/** Scheduler entry point: evaluates every enabled journey. */
export async function runAll({ maxPerJourney = 200 } = {}) {
  const journeys = all('SELECT * FROM journeys WHERE enabled = 1').map(hydrate);
  const summary = { journeys: journeys.length, fired: 0, failed: 0, detail: [] };

  for (const journey of journeys) {
    let candidates = [];
    try {
      candidates = candidatesFor(journey, { limit: maxPerJourney });
    } catch (err) {
      log.warn(`journey "${journey.name}" has invalid rules: ${err.message}`);
      continue;
    }
    if (!candidates.length) continue;

    let fired = 0;
    for (const contact of candidates) {
      const result = await runFor(journey, contact);
      if (result.ok) { fired += 1; summary.fired += 1; } else summary.failed += 1;
    }
    if (fired) {
      summary.detail.push({ journey: journey.name, fired });
      log.info(`journey "${journey.name}" fired for ${fired} contacts`);
    }
  }
  return summary;
}

/** Dry run: who would this journey fire for, without doing anything. */
export function previewJourney(journeyId, { limit = 25 } = {}) {
  const journey = getJourney(journeyId);
  const candidates = candidatesFor(journey, { limit });
  return {
    journey: journey.name,
    enabled: journey.enabled,
    would_fire_for: candidates.length,
    actions: journey.actions,
    contacts: candidates.map((c) => ({
      id: c.id, email: c.email, company: c.company, job_title: c.job_title, score: c.score, grade: c.grade,
    })),
  };
}
