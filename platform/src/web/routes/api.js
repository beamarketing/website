import { all, get, run, settings } from '../../db/index.js';
import { config, isDryRun } from '../../config.js';
import { Router, json, readJson, readBody, badRequest, notFound } from '../../lib/http.js';
import { id, now, parseJson, clamp } from '../../lib/util.js';
import * as contacts from '../../core/contacts.js';
import * as segments from '../../core/segments.js';
import * as events from '../../core/events.js';
import * as scoring from '../../core/scoring.js';
import * as journeys from '../../core/journeys.js';
import * as analytics from '../../core/analytics.js';
import * as tracking from '../../core/tracking.js';
import * as campaigns from '../../channels/email/campaigns.js';
import * as emailTracking from '../../channels/email/tracking.js';
import { verifyProvider, providerNames } from '../../channels/email/provider.js';
import * as audiences from '../../channels/linkedin/audiences.js';
import * as insights from '../../channels/linkedin/insights.js';
import { LinkedInClient } from '../../channels/linkedin/client.js';
import { runJob, jobStatus } from '../../jobs/scheduler.js';

export const api = new Router();

const intParam = (v, d, max = 1000) => clamp(Number.parseInt(v ?? d, 10) || d, 0, max);

// ------------------------------------------------------------------ status --
api.get('/api/status', async (req, res) => {
  json(res, {
    ok: true,
    version: '1.0.0',
    env: config.env,
    public_url: config.publicUrl,
    email: { provider: config.email.provider, dry_run: isDryRun.email, from: config.email.fromEmail },
    linkedin: {
      configured: !isDryRun.linkedin,
      dry_run: isDryRun.linkedin,
      ad_account: config.linkedin.adAccountId || null,
      api_version: config.linkedin.apiVersion,
    },
    jobs: jobStatus(),
    counts: {
      contacts: get('SELECT COUNT(*) AS n FROM contacts')?.n ?? 0,
      events: get('SELECT COUNT(*) AS n FROM events')?.n ?? 0,
      campaigns: get('SELECT COUNT(*) AS n FROM campaigns')?.n ?? 0,
      audiences: get('SELECT COUNT(*) AS n FROM li_audiences')?.n ?? 0,
      journeys: get('SELECT COUNT(*) AS n FROM journeys WHERE enabled = 1')?.n ?? 0,
    },
  });
});

api.get('/api/dashboard', async (req, res) => {
  const days = intParam(new URL(req.url, 'http://x').searchParams.get('days'), 30, 365);
  json(res, analytics.dashboard({ days }));
});

api.get('/api/overview', async (req, res) => {
  const days = intParam(new URL(req.url, 'http://x').searchParams.get('days'), 30, 365);
  json(res, analytics.overview({ days }));
});

// ---------------------------------------------------------------- contacts --
api.get('/api/contacts', async (req, res) => {
  const q = new URL(req.url, 'http://x').searchParams;
  const limit = intParam(q.get('limit'), 50, 500);
  const offset = intParam(q.get('offset'), 0, 1e6);
  const search = q.get('q');
  const rules = q.get('rules') ? parseJson(q.get('rules'), {}) : {};

  const extra = [];
  const extraArgs = [];
  if (search) {
    extra.push('(contacts.email LIKE ? OR contacts.first_name LIKE ? OR contacts.last_name LIKE ? OR contacts.company LIKE ? OR contacts.job_title LIKE ?)');
    for (let i = 0; i < 5; i++) extraArgs.push(`%${search}%`);
  }
  if (q.get('grade')) { extra.push('contacts.grade = ?'); extraArgs.push(q.get('grade')); }
  if (q.get('status')) { extra.push('contacts.status = ?'); extraArgs.push(q.get('status')); }
  if (q.get('lifecycle')) { extra.push('contacts.lifecycle_stage = ?'); extraArgs.push(q.get('lifecycle')); }

  const opts = {
    rules,
    listId: q.get('list_id') || null,
    extraWhere: extra.length ? extra.join(' AND ') : null,
    extraArgs,
  };
  const rows = segments.runSegment({ ...opts, limit, offset });
  const total = segments.countSegment(opts);
  json(res, {
    total,
    limit,
    offset,
    contacts: rows.map((c) => ({ ...c, attrs: parseJson(c.attrs, {}) })),
  });
});

api.post('/api/contacts', async (req, res) => {
  const body = await readJson(req);
  const list = Array.isArray(body.contacts) ? body.contacts : [body];
  const results = list.map((c) => {
    try {
      const { contact, created } = contacts.upsertContact(c, { overwrite: body.overwrite === true });
      if (body.list_id) contacts.addToList(body.list_id, contact.id);
      return { ok: true, id: contact.id, email: contact.email, created };
    } catch (err) {
      return { ok: false, email: c.email, error: err.message };
    }
  });
  json(res, { results, created: results.filter((r) => r.created).length, failed: results.filter((r) => !r.ok).length }, 201);
});

api.get('/api/contacts/:id', async (req, res, { params }) => {
  const contact = contacts.getContact(params.id);
  json(res, {
    ...contact,
    attrs: parseJson(contact.attrs, {}),
    score_detail: scoring.explainScore(contact.id),
    timeline: events.timeline(contact.id, { limit: 100 }),
    lists: all(
      'SELECT l.id, l.name, lm.added_at FROM list_members lm JOIN lists l ON l.id = lm.list_id WHERE lm.contact_id = ?',
      contact.id,
    ),
    audiences: all(
      `SELECT a.id, a.name, m.state, m.pushed_at FROM li_audience_members m
       JOIN li_audiences a ON a.id = m.audience_id WHERE m.contact_id = ?`,
      contact.id,
    ),
    sends: all(
      `SELECT s.id, s.status, s.subject, s.sent_at, s.opened_at, s.first_click_at, s.open_count,
              s.click_count, c.name AS campaign
       FROM sends s JOIN campaigns c ON c.id = s.campaign_id
       WHERE s.contact_id = ? ORDER BY s.queued_at DESC LIMIT 50`,
      contact.id,
    ),
    visitors: events.visitorsForContact(contact.id),
  });
});

api.patch('/api/contacts/:id', async (req, res, { params }) => {
  json(res, contacts.updateContact(params.id, await readJson(req)));
});

api.delete('/api/contacts/:id', async (req, res, { params }) => {
  const erase = new URL(req.url, 'http://x').searchParams.get('erase') === 'true';
  json(res, erase ? contacts.eraseContact(params.id) : contacts.deleteContact(params.id));
});

api.post('/api/contacts/:id/rescore', async (req, res, { params }) => {
  json(res, scoring.recomputeScore(contacts.getContact(params.id).id));
});

api.post('/api/contacts/import', async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const contentType = String(req.headers['content-type'] || '');
  let csvText;
  let opts = {};

  if (contentType.includes('application/json')) {
    const body = await readJson(req, 32 * 1024 * 1024);
    csvText = body.csv;
    opts = body;
  } else {
    csvText = (await readBody(req, 32 * 1024 * 1024)).toString('utf8');
    opts = {
      listId: url.searchParams.get('list_id'),
      dryRun: url.searchParams.get('dry_run') === 'true',
      overwrite: url.searchParams.get('overwrite') === 'true',
    };
  }
  if (!csvText) throw badRequest('No CSV content supplied');

  json(res, contacts.importCsv(csvText, {
    listId: opts.listId || opts.list_id || null,
    mapping: opts.mapping || null,
    overwrite: opts.overwrite === true,
    dryRun: opts.dryRun === true || opts.dry_run === true,
    source: opts.source || 'import',
  }));
});

api.get('/api/accounts', async (req, res) => {
  const q = new URL(req.url, 'http://x').searchParams;
  json(res, analytics.accountRollup({ limit: intParam(q.get('limit'), 50, 500), days: intParam(q.get('days'), 30, 365) }));
});

api.get('/api/hot', async (req, res) => {
  const q = new URL(req.url, 'http://x').searchParams;
  json(res, analytics.hotList({ limit: intParam(q.get('limit'), 25, 200), minScore: intParam(q.get('min_score'), 55, 100) }));
});

// ------------------------------------------------------------------- lists --
api.get('/api/lists', async (req, res) => {
  json(res, all('SELECT * FROM lists ORDER BY is_dedicated DESC, created_at DESC').map((l) => ({
    ...l,
    rules: parseJson(l.rules, {}),
    is_dedicated: !!l.is_dedicated,
    member_count: contacts.listMemberCount(l.id),
  })));
});

api.post('/api/lists', async (req, res) => {
  const body = await readJson(req);
  json(res, contacts.createList({
    name: body.name, description: body.description, kind: body.kind,
    rules: body.rules, isDedicated: body.is_dedicated === true,
  }), 201);
});

api.get('/api/lists/:id', async (req, res, { params }) => {
  const list = contacts.getList(params.id);
  json(res, {
    ...list,
    rules: parseJson(list.rules, {}),
    member_count: contacts.listMemberCount(list.id),
    members: segments.runSegment({ listId: list.id, limit: 100 }),
  });
});

api.post('/api/lists/:id/members', async (req, res, { params }) => {
  const body = await readJson(req);
  const list = contacts.getList(params.id);
  const ids = Array.isArray(body.contact_ids) ? body.contact_ids : [];
  // A segment can populate a list in one call — how a dedicated list is built.
  const fromRules = body.rules ? segments.runSegment({ rules: body.rules, select: 'contacts.id' }).map((r) => r.id) : [];
  const target = [...new Set([...ids, ...fromRules])];
  for (const contactId of target) contacts.addToList(list.id, contactId);
  json(res, { list_id: list.id, added: target.length, member_count: contacts.listMemberCount(list.id) });
});

api.delete('/api/lists/:id/members/:contactId', async (req, res, { params }) => {
  contacts.removeFromList(params.id, params.contactId);
  json(res, { ok: true, member_count: contacts.listMemberCount(params.id) });
});

api.post('/api/lists/:id/refresh', async (req, res, { params }) => {
  json(res, contacts.refreshDynamicList(params.id));
});

api.delete('/api/lists/:id', async (req, res, { params }) => {
  const list = contacts.getList(params.id);
  run('DELETE FROM lists WHERE id = ?', list.id);
  json(res, { deleted: list.id });
});

// ---------------------------------------------------------------- segments --
api.get('/api/segments/fields', async (req, res) => json(res, segments.fieldCatalog()));

api.post('/api/segments/preview', async (req, res) => {
  const body = await readJson(req);
  const opts = {
    rules: body.rules || {},
    listId: body.list_id || null,
    mailable: body.mailable === true,
    adTargetable: body.ad_targetable === true,
  };
  const total = segments.countSegment(opts);
  json(res, {
    count: total,
    sample: segments.runSegment({ ...opts, limit: intParam(body.limit, 20, 200) })
      .map((c) => ({
        id: c.id, email: c.email, first_name: c.first_name, last_name: c.last_name,
        company: c.company, job_title: c.job_title, score: c.score, grade: c.grade,
        lifecycle_stage: c.lifecycle_stage, last_seen_at: c.last_seen_at,
      })),
    sql: segments.buildQuery({ ...opts, select: 'contacts.id' }).sql,
  });
});

// --------------------------------------------------------------- templates --
api.get('/api/templates', async (req, res) => json(res, all('SELECT * FROM email_templates ORDER BY updated_at DESC')));
api.post('/api/templates', async (req, res) => json(res, campaigns.createTemplate(await readJson(req)), 201));
api.get('/api/templates/:id', async (req, res, { params }) => json(res, campaigns.getTemplate(params.id)));
api.patch('/api/templates/:id', async (req, res, { params }) => json(res, campaigns.updateTemplate(params.id, await readJson(req))));
api.delete('/api/templates/:id', async (req, res, { params }) => {
  const tpl = campaigns.getTemplate(params.id);
  if (get('SELECT id FROM campaigns WHERE template_id = ?', tpl.id)) {
    throw badRequest('Template is used by a campaign');
  }
  run('DELETE FROM email_templates WHERE id = ?', tpl.id);
  json(res, { deleted: tpl.id });
});

// --------------------------------------------------------------- campaigns --
api.get('/api/campaigns', async (req, res) => {
  json(res, all('SELECT id FROM campaigns ORDER BY created_at DESC').map((c) => campaigns.campaignStats(c.id)));
});
api.post('/api/campaigns', async (req, res) => json(res, campaigns.createCampaign(await readJson(req)), 201));
api.get('/api/campaigns/:id', async (req, res, { params }) => json(res, campaigns.campaignStats(params.id)));
api.patch('/api/campaigns/:id', async (req, res, { params }) => json(res, campaigns.updateCampaign(params.id, await readJson(req))));

api.get('/api/campaigns/:id/preflight', async (req, res, { params }) => json(res, campaigns.preflight(params.id)));

api.get('/api/campaigns/:id/preview', async (req, res, { params }) => {
  const q = new URL(req.url, 'http://x').searchParams;
  const campaign = campaigns.getCampaign(params.id);
  const contact = q.get('contact_id')
    ? contacts.getContact(q.get('contact_id'))
    : campaigns.audienceFor(campaign, { limit: 1 })[0];
  if (!contact) throw notFound('No contact to preview with');
  const rendered = campaigns.renderFor(campaign, contact);
  json(res, { contact: { id: contact.id, email: contact.email }, ...rendered });
});

api.post('/api/campaigns/:id/send', async (req, res, { params }) => {
  const body = await readJson(req).catch(() => ({}));
  if (body.contact_id) json(res, await campaigns.sendOne(params.id, body.contact_id));
  else json(res, campaigns.queueCampaign(params.id, { limit: body.limit || null }));
});

api.post('/api/campaigns/:id/pause', async (req, res, { params }) => json(res, campaigns.pauseCampaign(params.id)));
api.post('/api/campaigns/:id/resume', async (req, res, { params }) => json(res, campaigns.resumeCampaign(params.id)));
api.post('/api/campaigns/:id/cancel', async (req, res, { params }) => json(res, campaigns.cancelCampaign(params.id)));

api.get('/api/campaigns/:id/sends', async (req, res, { params }) => {
  const q = new URL(req.url, 'http://x').searchParams;
  json(res, all(
    `SELECT s.*, c.email, c.first_name, c.last_name, c.company, c.score
     FROM sends s JOIN contacts c ON c.id = s.contact_id
     WHERE s.campaign_id = ? ORDER BY s.sent_at DESC NULLS LAST LIMIT ?`,
    params.id, intParam(q.get('limit'), 100, 1000),
  ));
});

api.post('/api/email/verify', async (req, res) => {
  const body = await readJson(req).catch(() => ({}));
  json(res, { provider: body.provider || config.email.provider, ...(await verifyProvider(body.provider)) });
});

api.get('/api/email/providers', async (req, res) => {
  json(res, { active: config.email.provider, available: providerNames(), dry_run: isDryRun.email });
});

// A provider webhook feeds bounces and complaints back into suppression.
api.post('/api/email/webhook', async (req, res) => {
  const body = await readJson(req);
  const list = Array.isArray(body) ? body : [body];
  const results = list.map((e) => {
    const type = String(e.type || e.event || '').toLowerCase();
    const email = e.email || e.recipient || e.data?.to?.[0] || e.data?.email;
    if (!email) return { ok: false, error: 'no recipient' };
    if (/complain|spam/.test(type)) return emailTracking.handleBounce({ email, type: 'complaint', detail: e });
    if (/bounce|dropped|fail/.test(type)) {
      return emailTracking.handleBounce({ email, type: 'bounce', hard: !/soft/.test(type), detail: e });
    }
    return { ok: false, skipped: type };
  });
  json(res, { processed: results.length, results });
});

// ---------------------------------------------------------------- linkedin --
api.get('/api/linkedin/audiences', async (req, res) => json(res, audiences.listAudiences()));
api.post('/api/linkedin/audiences', async (req, res) => json(res, audiences.createAudience(await readJson(req)), 201));
api.get('/api/linkedin/audiences/:id', async (req, res, { params }) => {
  const audience = audiences.getAudience(params.id);
  json(res, { ...audience, members: audiences.audienceMembers(audience.id, { limit: 200 }), resolved: audiences.resolveMembers(audience).length });
});
api.post('/api/linkedin/audiences/:id/sync', async (req, res, { params }) => {
  const body = await readJson(req).catch(() => ({}));
  json(res, await audiences.syncAudience(params.id, { force: body.force === true }));
});
api.delete('/api/linkedin/audiences/:id', async (req, res, { params }) => json(res, audiences.deleteAudience(params.id)));

api.get('/api/linkedin/campaigns', async (req, res) => {
  const q = new URL(req.url, 'http://x').searchParams;
  json(res, insights.adPerformance({ days: intParam(q.get('days'), 30, 365) }));
});

api.patch('/api/linkedin/campaigns/:id', async (req, res, { params }) => {
  const body = await readJson(req);
  // Linking a LinkedIn campaign to one of our audiences is what lets spend be
  // reported against named contacts rather than against an anonymous segment.
  if (body.audience_id !== undefined) {
    run('UPDATE ad_campaigns SET audience_id = ?, updated_at = ? WHERE id = ?', body.audience_id || null, now(), params.id);
  }
  if (body.landing_url !== undefined) {
    run('UPDATE ad_campaigns SET landing_url = ?, updated_at = ? WHERE id = ?', body.landing_url || null, now(), params.id);
  }
  json(res, get('SELECT * FROM ad_campaigns WHERE id = ?', params.id) || notFoundThrow(params.id));
});

const notFoundThrow = (x) => { throw notFound(`No ad campaign ${x}`); };

api.get('/api/linkedin/influence', async (req, res) => {
  const q = new URL(req.url, 'http://x').searchParams;
  json(res, audiences.listAudiences().length ? insights.audienceInfluence({ days: intParam(q.get('days'), 30, 365) }) : []);
});

api.post('/api/linkedin/sync', async (req, res) => {
  const body = await readJson(req).catch(() => ({}));
  const what = body.what || 'all';
  const out = {};
  if (what === 'all' || what === 'campaigns') out.campaigns = await insights.syncCampaigns();
  if (what === 'all' || what === 'metrics') out.metrics = await insights.syncMetrics({ days: body.days || 30 });
  if (what === 'all' || what === 'leads') out.leads = await insights.syncLeadResponses();
  if (what === 'all' || what === 'audiences') out.audiences = await audiences.syncAll();
  json(res, out);
});

api.get('/api/linkedin/verify', async (req, res) => {
  const client = new LinkedInClient();
  const result = await client.introspect();
  json(res, {
    ...result,
    configured: !isDryRun.linkedin,
    ad_account_id: config.linkedin.adAccountId || null,
    api_version: config.linkedin.apiVersion,
    note: isDryRun.linkedin
      ? 'Running in dry-run mode: audiences sync locally and nothing is sent to LinkedIn. Set LINKEDIN_ACCESS_TOKEN and LINKEDIN_AD_ACCOUNT_ID to go live.'
      : undefined,
  });
});

// A manually captured lead-gen response (CSV export, Zapier, etc.).
api.post('/api/linkedin/leads', async (req, res) => {
  const body = await readJson(req);
  const list = Array.isArray(body.leads) ? body.leads : [body];
  json(res, { results: list.map((l) => insights.ingestLeadResponse(l)) });
});

// ---------------------------------------------------------------- journeys --
api.get('/api/journeys', async (req, res) => json(res, journeys.listJourneys()));
api.post('/api/journeys', async (req, res) => json(res, journeys.createJourney(await readJson(req)), 201));
api.get('/api/journeys/:id', async (req, res, { params }) => {
  const journey = journeys.getJourney(params.id);
  json(res, {
    ...journey,
    recent_runs: all(
      `SELECT jr.*, c.email, c.company FROM journey_runs jr JOIN contacts c ON c.id = jr.contact_id
       WHERE jr.journey_id = ? ORDER BY jr.ran_at DESC LIMIT 50`, journey.id,
    ).map((r) => ({ ...r, detail: parseJson(r.detail, {}) })),
  });
});
api.patch('/api/journeys/:id', async (req, res, { params }) => json(res, journeys.updateJourney(params.id, await readJson(req))));
api.delete('/api/journeys/:id', async (req, res, { params }) => json(res, journeys.deleteJourney(params.id)));
api.get('/api/journeys/:id/preview', async (req, res, { params }) => json(res, journeys.previewJourney(params.id)));
api.post('/api/journeys/:id/run', async (req, res, { params }) => {
  const journey = journeys.getJourney(params.id);
  const candidates = journeys.candidatesFor(journey, { limit: 200 });
  const results = [];
  for (const contact of candidates) results.push(await journeys.runFor(journey, contact));
  json(res, { journey: journey.name, fired: results.filter((r) => r.ok).length, results });
});

// ------------------------------------------------------------------ events --
api.get('/api/events', async (req, res) => {
  const q = new URL(req.url, 'http://x').searchParams;
  json(res, events.recentEvents({
    limit: intParam(q.get('limit'), 100, 500),
    channel: q.get('channel'),
    type: q.get('type'),
    identifiedOnly: q.get('identified') === 'true',
  }));
});

// Server-side event ingestion, for things the browser cannot see.
api.post('/api/events', async (req, res) => {
  const body = await readJson(req);
  const list = Array.isArray(body.events) ? body.events : [body];
  json(res, { results: list.map((e) => tracking.ingestServerEvent(e)) });
});

api.get('/api/pages', async (req, res) => {
  const q = new URL(req.url, 'http://x').searchParams;
  json(res, events.topPages({ days: intParam(q.get('days'), 30, 365), limit: intParam(q.get('limit'), 20, 100) }));
});

// ------------------------------------------------------------------ alerts --
api.get('/api/alerts', async (req, res) => {
  json(res, all(
    `SELECT a.*, c.email, c.company, c.score FROM alerts a
     LEFT JOIN contacts c ON c.id = a.contact_id ORDER BY a.read, a.created_at DESC LIMIT 100`,
  ).map((a) => ({ ...a, body: parseJson(a.body, {}) })));
});
api.post('/api/alerts/read', async (req, res) => {
  const body = await readJson(req).catch(() => ({}));
  if (body.id) run('UPDATE alerts SET read = 1 WHERE id = ?', body.id);
  else run('UPDATE alerts SET read = 1');
  json(res, { ok: true });
});

// ------------------------------------------------------------------- setup --
api.get('/api/setup/snippet', async (req, res) => {
  json(res, {
    snippet: tracking.snippet(config.publicUrl),
    tracker_url: `${config.publicUrl}/t/beamr.js`,
    tracking_origins: config.trackingOrigins,
  });
});

api.get('/api/settings', async (req, res) => {
  json(res, {
    scoring: scoring.scoringConfig(),
    stored: settings.all(),
    email: { provider: config.email.provider, from: config.email.fromEmail, from_name: config.email.fromName, postal_address: config.email.postalAddress },
    tracking_origins: config.trackingOrigins,
    public_url: config.publicUrl,
  });
});

api.post('/api/settings', async (req, res) => {
  const body = await readJson(req);
  const allowed = ['scoring_weights', 'scoring_page_boosts', 'scoring_fit', 'scoring_config'];
  const written = {};
  for (const [key, value] of Object.entries(body)) {
    if (!allowed.includes(key)) continue;
    written[key] = settings.set(key, value);
  }
  json(res, { written, scoring: scoring.scoringConfig() });
});

// -------------------------------------------------------------------- jobs --
api.get('/api/jobs', async (req, res) => {
  json(res, {
    status: jobStatus(),
    recent: all('SELECT * FROM job_runs ORDER BY ran_at DESC LIMIT 50').map((j) => ({ ...j, detail: parseJson(j.detail, {}) })),
  });
});

api.post('/api/jobs/:name/run', async (req, res, { params }) => json(res, await runJob(params.name)));

api.post('/api/score/recompute', async (req, res) => json(res, scoring.recomputeAll()));
