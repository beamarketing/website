import { run } from '../db/index.js';
import { config, isDryRun } from '../config.js';
import { id, now } from '../lib/util.js';
import { logger } from '../lib/logger.js';
import { processQueue } from '../channels/email/campaigns.js';
import { runAll as runJourneys } from '../core/journeys.js';
import { recomputeAll } from '../core/scoring.js';
import { syncAll as syncAudiences } from '../channels/linkedin/audiences.js';
import { syncCampaigns, syncMetrics, syncLeadResponses } from '../channels/linkedin/insights.js';
import { all } from '../db/index.js';

const log = logger('jobs');

/**
 * The background engine. Each job is independent and idempotent, so a missed
 * tick or an overlapping run costs nothing. Jobs never run concurrently with
 * themselves — a slow LinkedIn sync must not stack up behind itself.
 */
export const JOBS = {
  email_queue: {
    label: 'Drain the email send queue',
    intervalSec: () => config.jobs.queueIntervalSec,
    run: () => processQueue(),
  },
  journeys: {
    label: 'Evaluate journey triggers',
    intervalSec: () => config.jobs.journeyIntervalSec,
    run: () => runJourneys(),
  },
  scoring: {
    label: 'Recompute engagement scores (applies time decay)',
    intervalSec: () => config.jobs.scoreIntervalSec,
    run: () => recomputeAll(),
  },
  linkedin_audiences: {
    label: 'Sync matched audiences to LinkedIn',
    intervalSec: () => config.jobs.audienceIntervalSec,
    run: () => syncAudiences(),
  },
  linkedin_ads: {
    label: 'Pull LinkedIn campaigns, metrics and lead-form responses',
    intervalSec: () => config.jobs.adsIntervalSec,
    run: async () => ({
      campaigns: await syncCampaigns(),
      metrics: await syncMetrics({ days: 30 }),
      leads: await syncLeadResponses(),
    }),
  },
  dynamic_lists: {
    label: 'Re-materialise dynamic lists',
    intervalSec: () => 3600,
    run: async () => {
      const { refreshDynamicList } = await import('../core/contacts.js');
      const lists = all("SELECT id FROM lists WHERE kind = 'dynamic'");
      return { refreshed: lists.map((l) => refreshDynamicList(l.id)) };
    },
  },
};

const state = new Map();
const timers = new Map();

export async function runJob(name, { silent = false } = {}) {
  const job = JOBS[name];
  if (!job) throw new Error(`Unknown job "${name}"`);

  const current = state.get(name);
  if (current?.running) return { job: name, skipped: 'already running' };

  state.set(name, { ...current, running: true, startedAt: now() });
  const started = Date.now();
  try {
    const detail = await job.run();
    const duration = Date.now() - started;
    state.set(name, { running: false, lastRun: now(), lastStatus: 'ok', lastDuration: duration, lastDetail: detail });
    run(
      'INSERT INTO job_runs (id, job, status, detail, duration_ms, ran_at) VALUES (?,?,?,?,?,?)',
      id('jr'), name, 'ok', JSON.stringify(detail ?? {}), duration, now(),
    );
    if (!silent && hasWork(detail)) log.info(`${name}: ${summarise(detail)} (${duration}ms)`);
    return { job: name, status: 'ok', duration_ms: duration, detail };
  } catch (err) {
    const duration = Date.now() - started;
    state.set(name, { running: false, lastRun: now(), lastStatus: 'error', lastError: err.message, lastDuration: duration });
    run(
      'INSERT INTO job_runs (id, job, status, detail, duration_ms, ran_at) VALUES (?,?,?,?,?,?)',
      id('jr'), name, 'error', JSON.stringify({ error: err.message }), duration, now(),
    );
    log.error(`${name} failed: ${err.message}`);
    return { job: name, status: 'error', error: err.message };
  }
}

/** Suppresses log noise from ticks where nothing happened. */
function hasWork(detail) {
  if (!detail || typeof detail !== 'object') return false;
  const counters = ['sent', 'failed', 'fired', 'changed', 'rows', 'imported', 'synced', 'added', 'removed'];
  return counters.some((k) => Number(detail[k]) > 0)
    || Object.values(detail).some((v) => v && typeof v === 'object' && hasWork(v));
}

function summarise(detail) {
  if (!detail || typeof detail !== 'object') return 'done';
  return Object.entries(detail)
    .filter(([, v]) => typeof v === 'number' && v > 0)
    .map(([k, v]) => `${k}=${v}`)
    .join(' ') || 'done';
}

export function startScheduler() {
  if (!config.jobs.enabled) {
    log.warn('background jobs are disabled (JOBS_ENABLED=false)');
    return { started: false };
  }

  const started = [];
  for (const [name, job] of Object.entries(JOBS)) {
    // Skip LinkedIn polling entirely when there are no credentials to poll with.
    if (name.startsWith('linkedin') && isDryRun.linkedin) {
      log.debug(`skipping ${name}: LinkedIn is not configured`);
      continue;
    }
    const intervalMs = Math.max(5, job.intervalSec()) * 1000;
    const timer = setInterval(() => { runJob(name, { silent: true }); }, intervalMs);
    timer.unref?.();
    timers.set(name, timer);
    started.push({ name, every_seconds: intervalMs / 1000 });
  }

  log.info(`scheduler started: ${started.map((s) => `${s.name} every ${s.every_seconds}s`).join(', ')}`);
  return { started: true, jobs: started };
}

export function stopScheduler() {
  for (const timer of timers.values()) clearInterval(timer);
  timers.clear();
}

export function jobStatus() {
  return Object.fromEntries(
    Object.entries(JOBS).map(([name, job]) => [name, {
      label: job.label,
      every_seconds: job.intervalSec(),
      scheduled: timers.has(name),
      ...(state.get(name) || {}),
    }]),
  );
}
