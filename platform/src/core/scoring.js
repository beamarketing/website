import { all, get, run, settings } from '../db/index.js';
import { now, clamp, id } from '../lib/util.js';
import { logger } from '../lib/logger.js';

const log = logger('scoring');

/**
 * Engagement scoring.
 *
 * Two halves, deliberately kept apart:
 *  - FIT      : who they are (title, seniority, company) — slow-moving.
 *  - INTENT   : what they did, decayed by age — fast-moving.
 *
 * score = fit + intent, capped at 100. Grade is a band over that.
 * Decay matters: a contact who read the pricing page four months ago is not
 * as hot as one who read it yesterday, and an undecayed score would say
 * otherwise forever.
 */

export const DEFAULT_WEIGHTS = {
  // intent — behavioural points at full strength
  page_view: 1,
  session_start: 1,
  scroll_depth: 1,
  time_on_page: 1,
  click: 1,
  video_play: 3,
  download: 8,
  form_submit: 15,
  demo_request: 30,
  signup: 30,
  pricing_view: 8,
  email_open: 2,
  email_click: 6,
  email_sent: 0,
  email_bounce: -5,
  email_unsubscribe: -25,
  email_complaint: -40,
  ad_click: 8,
  ad_lead_form: 25,
  audience_added: 0,
  audience_removed: 0,
  identify: 0,
  custom: 1,
};

/** High-intent URL fragments get a multiplier — not all page views are equal. */
export const DEFAULT_PAGE_BOOSTS = {
  '/pricing': 8,
  '/demo': 10,
  '/contact': 8,
  '/request': 8,
  '/trial': 10,
  '/cloud': 4,
  '/solutions': 3,
  '/technology': 3,
  '/cabr': 4,
  '/case-stud': 4,
  '/docs': 2,
  '/blog': 1,
};

export const DEFAULT_FIT = {
  seniority: { cxo: 20, vp: 16, director: 12, manager: 7, ic: 3 },
  function: { media: 10, engineering: 8, product: 6, operations: 6, data: 5, marketing: 3, sales: 2, finance: 2 },
  // Beamr sells video compression, so these verticals are the ICP.
  industry: { 'media & entertainment': 10, streaming: 10, broadcast: 8, telecom: 6, gaming: 6, technology: 5 },
  company_size_bonus: 5,     // added when company_size looks enterprise
  known_account_bonus: 4,    // more than one contact from the same domain
  free_mail_penalty: -8,
};

export const DEFAULT_CONFIG = {
  halfLifeDays: 30,      // intent points lose half their value every N days
  intentCap: 65,         // most a contact can earn from behaviour alone
  fitCap: 35,
  grades: { A: 70, B: 45, C: 20 }, // anything below C is D
  hotThreshold: 70,
};

export function scoringConfig() {
  return {
    weights: { ...DEFAULT_WEIGHTS, ...(settings.get('scoring_weights') || {}) },
    pageBoosts: { ...DEFAULT_PAGE_BOOSTS, ...(settings.get('scoring_page_boosts') || {}) },
    fit: { ...DEFAULT_FIT, ...(settings.get('scoring_fit') || {}) },
    config: { ...DEFAULT_CONFIG, ...(settings.get('scoring_config') || {}) },
  };
}

/** Raw point value of a single event, before decay. */
export function scoreEvent(type, input = {}) {
  const { weights, pageBoosts } = scoringConfig();
  let points = weights[type] ?? 0;

  if (type === 'page_view') {
    const path = String(input.path || input.url || '').toLowerCase();
    for (const [fragment, boost] of Object.entries(pageBoosts)) {
      if (path.includes(fragment)) { points = Math.max(points, boost); break; }
    }
  }
  if (type === 'scroll_depth') {
    const depth = Number(input.value || input.meta?.depth || 0);
    points = depth >= 90 ? 3 : depth >= 50 ? 2 : 1;
  }
  if (type === 'time_on_page') {
    const seconds = Number(input.value || 0);
    points = seconds >= 180 ? 4 : seconds >= 60 ? 2 : seconds >= 20 ? 1 : 0;
  }
  return Math.round(points);
}

/** Attribute-based fit score — independent of behaviour. */
export function fitScore(contact) {
  const { fit, config } = scoringConfig();
  let score = 0;
  if (contact.seniority) score += fit.seniority[contact.seniority] ?? 0;
  if (contact.function) score += fit.function[contact.function] ?? 0;
  if (contact.industry) {
    const key = String(contact.industry).toLowerCase();
    const hit = Object.entries(fit.industry).find(([k]) => key.includes(k));
    if (hit) score += hit[1];
  }
  if (/\b(1001|5001|10000|10,000|enterprise|large)\b/i.test(String(contact.company_size || ''))) {
    score += fit.company_size_bonus;
  }
  if (contact.domain) {
    const peers = get('SELECT COUNT(*) AS n FROM contacts WHERE domain = ?', contact.domain)?.n ?? 1;
    if (peers > 1) score += fit.known_account_bonus;
  } else {
    score += fit.free_mail_penalty; // no company domain = personal address
  }
  return clamp(Math.round(score), 0, config.fitCap);
}

/**
 * Behaviour score with exponential time decay.
 * weight = points × 0.5^(ageDays / halfLifeDays)
 */
export function intentScore(contactId) {
  const { config } = scoringConfig();
  const rows = all(
    `SELECT points, occurred_at,
            (julianday('now') - julianday(occurred_at)) AS age_days
     FROM events
     WHERE contact_id = ? AND points != 0 AND occurred_at >= datetime('now','-365 days')`,
    contactId,
  );
  let total = 0;
  for (const row of rows) {
    const age = Math.max(0, Number(row.age_days) || 0);
    total += Number(row.points) * Math.pow(0.5, age / config.halfLifeDays);
  }
  // Negative signals (unsubscribe, complaint) must be able to push below zero
  // before the clamp, so a complainer never reads as merely "cold".
  return clamp(Math.round(total), -50, config.intentCap);
}

export function gradeFor(score) {
  const { config } = scoringConfig();
  if (score >= config.grades.A) return 'A';
  if (score >= config.grades.B) return 'B';
  if (score >= config.grades.C) return 'C';
  return 'D';
}

/** Recomputes and persists one contact's score; raises an alert if newly hot. */
export function recomputeScore(contactId) {
  const contact = get('SELECT * FROM contacts WHERE id = ?', contactId);
  if (!contact) return null;
  const { config } = scoringConfig();

  const fit = fitScore(contact);
  const intent = intentScore(contactId);
  const score = clamp(fit + intent, 0, 100);
  const grade = gradeFor(score);

  if (score === contact.score && grade === contact.grade) {
    run('UPDATE contacts SET last_scored_at = ? WHERE id = ?', now(), contactId);
    return { contactId, score, grade, fit, intent, changed: false };
  }

  run(
    'UPDATE contacts SET score = ?, grade = ?, last_scored_at = ?, updated_at = ? WHERE id = ?',
    score, grade, now(), now(), contactId,
  );

  // Crossing into "hot" is the moment sales wants to hear about.
  if (score >= config.hotThreshold && contact.score < config.hotThreshold) {
    run(
      'INSERT INTO alerts (id, kind, contact_id, title, body, created_at) VALUES (?,?,?,?,?,?)',
      id('al'), 'hot_contact', contactId,
      `${contact.first_name || contact.email} is now hot (${score})`,
      JSON.stringify({ score, previous: contact.score, fit, intent, company: contact.company, title: contact.job_title }),
      now(),
    );
    log.info(`hot contact: ${contact.email} → ${score}`);
  }

  if (contact.domain) {
    run(
      `UPDATE accounts SET score = COALESCE((SELECT SUM(score) FROM contacts WHERE domain = accounts.domain), 0),
         updated_at = ? WHERE domain = ?`,
      now(), contact.domain,
    );
  }

  return { contactId, score, grade, fit, intent, changed: true, previous: contact.score };
}

/** Nightly full pass — decay only shows up when you recompute. */
export function recomputeAll({ limit = null } = {}) {
  const rows = all(`SELECT id FROM contacts ${limit ? `LIMIT ${Number(limit)}` : ''}`);
  let changed = 0;
  for (const row of rows) {
    const result = recomputeScore(row.id);
    if (result?.changed) changed += 1;
  }
  log.info(`rescored ${rows.length} contacts (${changed} changed)`);
  return { scored: rows.length, changed };
}

/** Score breakdown for the contact detail panel. */
export function explainScore(contactId) {
  const contact = get('SELECT * FROM contacts WHERE id = ?', contactId);
  if (!contact) return null;
  const { config } = scoringConfig();
  const fit = fitScore(contact);
  const contributions = all(
    `SELECT type, channel, points, occurred_at,
            (julianday('now') - julianday(occurred_at)) AS age_days
     FROM events WHERE contact_id = ? AND points != 0
     ORDER BY occurred_at DESC LIMIT 200`,
    contactId,
  ).map((r) => ({
    type: r.type,
    channel: r.channel,
    raw: r.points,
    decayed: Math.round(r.points * Math.pow(0.5, Math.max(0, r.age_days) / config.halfLifeDays) * 10) / 10,
    occurred_at: r.occurred_at,
    age_days: Math.round(r.age_days * 10) / 10,
  }));
  const byType = {};
  for (const c of contributions) {
    byType[c.type] = byType[c.type] || { type: c.type, count: 0, decayed: 0 };
    byType[c.type].count += 1;
    byType[c.type].decayed = Math.round((byType[c.type].decayed + c.decayed) * 10) / 10;
  }
  return {
    contact_id: contactId,
    score: contact.score,
    grade: contact.grade,
    fit,
    intent: intentScore(contactId),
    half_life_days: config.halfLifeDays,
    by_type: Object.values(byType).sort((a, b) => b.decayed - a.decayed),
    recent: contributions.slice(0, 25),
  };
}
