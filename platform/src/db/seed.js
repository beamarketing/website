import { run, get, all, tx } from './index.js';
import { id, now, daysAgo, dayKey } from '../lib/util.js';
import { upsertContact, createList, addToList } from '../core/contacts.js';
import { recordEvent, ensureVisitor, identifyVisitor } from '../core/events.js';
import { recomputeAll } from '../core/scoring.js';
import { createTemplate, createCampaign, queueCampaign, processQueue } from '../channels/email/campaigns.js';
import { createAudience, syncAudience } from '../channels/linkedin/audiences.js';
import { upsertMetric, ingestLeadResponse } from '../channels/linkedin/insights.js';
import { createJourney } from '../core/journeys.js';
import { logger } from '../lib/logger.js';

const log = logger('seed');

/**
 * A realistic Beamr dataset: media & streaming companies, the titles that
 * actually buy video compression, and a behaviour history dense enough that
 * scoring, segmentation and attribution all have something to chew on.
 */

const COMPANIES = [
  { domain: 'disneystreaming.com', name: 'Disney Streaming', industry: 'Media & Entertainment', size: '10000+', country: 'United States' },
  { domain: 'vimeo.com', name: 'Vimeo', industry: 'Technology', size: '1001-5000', country: 'United States' },
  { domain: 'dazn.com', name: 'DAZN', industry: 'Streaming', size: '1001-5000', country: 'United Kingdom' },
  { domain: 'wix.com', name: 'Wix', industry: 'Technology', size: '5001-10000', country: 'Israel' },
  { domain: 'sky.uk', name: 'Sky', industry: 'Broadcast', size: '10000+', country: 'United Kingdom' },
  { domain: 'globo.com', name: 'Globo', industry: 'Broadcast', size: '10000+', country: 'Brazil' },
  { domain: 'rakuten.tv', name: 'Rakuten TV', industry: 'Streaming', size: '1001-5000', country: 'Spain' },
  { domain: 'plex.tv', name: 'Plex', industry: 'Streaming', size: '201-500', country: 'United States' },
  { domain: 'jwplayer.com', name: 'JW Player', industry: 'Technology', size: '201-500', country: 'United States' },
  { domain: 'brightcove.com', name: 'Brightcove', industry: 'Technology', size: '501-1000', country: 'United States' },
  { domain: 'kaltura.com', name: 'Kaltura', industry: 'Technology', size: '501-1000', country: 'Israel' },
  { domain: 'viaplay.com', name: 'Viaplay', industry: 'Streaming', size: '1001-5000', country: 'Sweden' },
];

const PEOPLE = [
  ['Maya', 'Ferrante', 'VP of Video Engineering'],
  ['Tomer', 'Bar-Lev', 'Chief Technology Officer'],
  ['Priya', 'Raghavan', 'Director of Streaming Operations'],
  ['Daniel', 'Okonkwo', 'Head of Media Infrastructure'],
  ['Sofia', 'Lindqvist', 'Principal Video Architect'],
  ['Marcus', 'Whitfield', 'SVP Technology'],
  ['Anika', 'Deshmukh', 'Senior Encoding Engineer'],
  ['Lucas', 'Moreau', 'Director of Product, Playback'],
  ['Elena', 'Rossi', 'VP Content Delivery'],
  ['Kenji', 'Watanabe', 'Manager, Video Platform'],
  ['Ruth', 'Alvarez', 'Head of CDN Strategy'],
  ['Oren', 'Shamir', 'Staff Engineer, Transcoding'],
  ['Chloe', 'Baptiste', 'Director of Engineering'],
  ['Ibrahim', 'Nasser', 'Cloud Infrastructure Lead'],
  ['Hannah', 'Meyer', 'VP Operations'],
  ['Rafael', 'Cardoso', 'Media Systems Architect'],
  ['Yuki', 'Tanaka', 'Product Manager, Video'],
  ['Nadia', 'Farouk', 'Chief Product Officer'],
  ['Simon', 'Bergström', 'Engineering Manager, Encoding'],
  ['Leila', 'Haddad', 'Director of Platform Engineering'],
  ['Victor', 'Novak', 'Head of Video Quality'],
  ['Amara', 'Obi', 'Senior Director, Streaming'],
  ['Jonas', 'Kimura', 'Video Infrastructure Engineer'],
  ['Fatima', 'Al-Rashid', 'VP Digital Products'],
];

const PAGES = [
  '/', '/pricing', '/solutions/streaming', '/technology/cabr', '/cloud',
  '/case-studies/disney', '/blog/av1-vs-hevc', '/docs/getting-started',
  '/demo', '/company/about', '/blog/cdn-cost-reduction', '/solutions/broadcast',
];

// Weighted so the shape of the data looks like real traffic, not a uniform grid.
const PAGE_WEIGHTS = [18, 9, 8, 7, 6, 5, 12, 6, 3, 4, 10, 5];

function weightedPick(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) { r -= weights[i]; if (r <= 0) return items[i]; }
  return items[items.length - 1];
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;

export async function seed({ reset = false } = {}) {
  if (reset) {
    log.warn('resetting all data');
    tx(() => {
      for (const t of ['events', 'visitors', 'sends', 'email_links', 'campaigns', 'email_templates',
        'li_audience_members', 'li_audiences', 'ad_metrics', 'ad_campaigns', 'ad_lead_responses',
        'journey_runs', 'journeys', 'list_members', 'lists', 'suppressions', 'alerts',
        'contacts', 'accounts', 'job_runs']) {
        run(`DELETE FROM ${t}`);
      }
    });
  }

  const report = { contacts: 0, events: 0, lists: 0, campaigns: 0, audiences: 0, journeys: 0 };

  // ------------------------------------------------------------- contacts --
  const dedicated = createList({
    name: 'Dedicated ABM List',
    description: 'The named accounts and buying-committee contacts we run contact-based marketing against.',
    isDedicated: true,
  });
  report.lists += 1;

  const contacts = [];
  for (const [i, [first, last, title]] of PEOPLE.entries()) {
    const company = COMPANIES[i % COMPANIES.length];
    const email = `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, '')}@${company.domain}`;
    const { contact } = upsertContact({
      email, first_name: first, last_name: last, job_title: title,
      company: company.name, domain: company.domain, industry: company.industry,
      company_size: company.size, country: company.country,
      linkedin_url: `https://www.linkedin.com/in/${first.toLowerCase()}-${last.toLowerCase().replace(/[^a-z]/g, '')}`,
      source: 'import:dedicated-list.csv',
      lifecycle_stage: 'target',
      attrs: { use_case: pick(['cdn cost', 'storage cost', 'quality uplift', 'av1 migration']) },
    }, { source: 'seed' });
    addToList(dedicated.id, contact.id);
    contacts.push(contact);
    report.contacts += 1;
  }

  // ---------------------------------------------------------- behaviour ----
  // Three tiers: a few very engaged, a middle band, and a long cold tail.
  tx(() => {
    for (const [i, contact] of contacts.entries()) {
      const tier = i < 5 ? 'hot' : i < 13 ? 'warm' : 'cold';
      const sessions = tier === 'hot' ? 4 + Math.floor(Math.random() * 4)
        : tier === 'warm' ? 1 + Math.floor(Math.random() * 3) : (chance(0.4) ? 1 : 0);

      for (let s = 0; s < sessions; s++) {
        const visitorId = `seed-${contact.id.slice(-8)}-${s}`;
        const dayOffset = Math.floor(Math.random() * 45);
        ensureVisitor(visitorId, { user_agent: 'Mozilla/5.0 (seed)', url: 'https://beamr.com/' });

        const views = 1 + Math.floor(Math.random() * (tier === 'hot' ? 5 : 3));
        for (let v = 0; v < views; v++) {
          const path = tier === 'hot' && v === 0 ? pick(['/pricing', '/demo', '/cloud'])
            : weightedPick(PAGES, PAGE_WEIGHTS);
          const at = new Date(Date.now() - dayOffset * 86400000 - v * 90000).toISOString();
          const fromAd = chance(tier === 'hot' ? 0.35 : 0.15);
          recordEvent({
            contact_id: contact.id, visitor_id: visitorId, channel: 'web', type: 'page_view',
            url: `https://beamr.com${path}${fromAd ? '?utm_source=linkedin&utm_medium=cpc&li_fat_id=seed' : ''}`,
            path, title: `Beamr · ${path}`, occurred_at: at,
            ...(fromAd ? { utm_source: 'linkedin', utm_medium: 'cpc', ad_campaign_id: '7011' } : {}),
          });
          report.events += 1;

          if (fromAd && v === 0) {
            recordEvent({
              contact_id: contact.id, visitor_id: visitorId, channel: 'linkedin', type: 'ad_click',
              ad_campaign_id: '7011', path, occurred_at: at,
              meta: { source: 'seed' }, dedupe_key: `seed-adclick-${visitorId}-${dayOffset}`,
            });
            report.events += 1;
          }
          if (chance(0.5)) {
            recordEvent({
              contact_id: contact.id, visitor_id: visitorId, channel: 'web', type: 'scroll_depth',
              path, value: pick([50, 75, 90]), occurred_at: at,
            });
            report.events += 1;
          }
        }
        identifyVisitor(visitorId, contact.id);
      }

      if (tier === 'hot' && chance(0.6)) {
        recordEvent({
          contact_id: contact.id, channel: 'web', type: 'form_submit',
          path: '/demo', occurred_at: daysAgo(Math.floor(Math.random() * 14)),
          meta: { form_id: 'demo-request' },
        });
        report.events += 1;
        run("UPDATE contacts SET lifecycle_stage = 'mql' WHERE id = ?", contact.id);
      }
    }
  });

  // ---------------------------------------------------------------- email --
  const template = createTemplate({
    name: 'CDN cost — CABR intro',
    subject: '{{ first_name | fallback: "Hi" }}, cut {{ company_or_default }}’s CDN bill by up to 50%',
    preheader: 'Same perceptual quality, half the bitrate — no player changes.',
    html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#222;max-width:560px">
  <p>Hi {{ first_name | fallback: "there" }},</p>
  <p>{% if company %}{{ company }}{% else %}Your team{% endif %} delivers a lot of video, and most of
     that bill is bitrate you don’t need. Beamr’s CABR encoder cuts bitrate by up to 50% at the
     same <em>perceptual</em> quality &mdash; same codec, same player, no client-side change.</p>
  <p>{% if job_title %}As {{ job_title }}, you{% else %}You{% endif %} would likely care about two numbers:
     CDN egress and storage. Both drop with the file size.</p>
  <p><a href="https://beamr.com/case-studies/disney" style="color:#00a352;font-weight:600">See how a major streamer measured it</a>
     &nbsp;or&nbsp;
     <a href="https://beamr.com/demo" style="color:#00a352;font-weight:600">book 20 minutes</a>.</p>
  <p>&mdash; {{ sender_name }}<br /><span style="color:#888;font-size:13px">Beamr</span></p>
</div>`,
  });

  const campaign = createCampaign({
    name: 'Q3 · CDN cost play — dedicated list',
    template_id: template.id,
    list_id: dedicated.id,
    from_name: 'Dor at Beamr',
    from_email: 'marketing@beamr.com',
    throttle_per_min: 120,
  });
  report.campaigns += 1;

  queueCampaign(campaign.id);
  await processQueue({ max: 500 });

  // Simulate a realistic open/click pattern on the delivered sends.
  const sends = all("SELECT * FROM sends WHERE campaign_id = ? AND status = 'sent'", campaign.id);
  const links = all('SELECT * FROM email_links WHERE campaign_id = ?', campaign.id);
  tx(() => {
    for (const send of sends) {
      const contact = get('SELECT * FROM contacts WHERE id = ?', send.contact_id);
      const engaged = (contact?.score ?? 0) > 30;
      if (!chance(engaged ? 0.72 : 0.28)) continue;
      const openedAt = daysAgo(Math.random() * 12);
      run('UPDATE sends SET opened_at = ?, open_count = ? WHERE id = ?', openedAt, 1 + Math.floor(Math.random() * 3), send.id);
      recordEvent({
        contact_id: send.contact_id, channel: 'email', type: 'email_open',
        campaign_id: campaign.id, occurred_at: openedAt, meta: { send_id: send.id },
      });
      report.events += 1;

      if (chance(engaged ? 0.45 : 0.1) && links.length) {
        const link = pick(links);
        const clickedAt = daysAgo(Math.random() * 10);
        run('UPDATE sends SET first_click_at = ?, click_count = 1 WHERE id = ?', clickedAt, send.id);
        run('UPDATE email_links SET click_count = click_count + 1 WHERE id = ?', link.id);
        recordEvent({
          contact_id: send.contact_id, channel: 'email', type: 'email_click',
          campaign_id: campaign.id, url: link.url, occurred_at: clickedAt,
          meta: { send_id: send.id, link_id: link.id },
        });
        report.events += 1;
      }
    }
  });

  // ------------------------------------------------------------- linkedin --
  const audience = createAudience({
    name: 'Dedicated list — VP+ media & streaming',
    list_id: dedicated.id,
    rules: { field: 'seniority', operator: 'in', value: ['vp', 'cxo', 'director'] },
  });
  await syncAudience(audience.id);
  report.audiences += 1;

  const retarget = createAudience({
    name: 'Pricing-page visitors (last 30 days)',
    rules: { op: 'and', rules: [{ field: 'visited_path(/pricing)', operator: 'gte', value: 1 }] },
  });
  await syncAudience(retarget.id);
  report.audiences += 1;

  const adCampaigns = [
    { id: '7011', name: 'CABR — VP+ media retargeting', audience: audience.id, budget: 180, objective: 'WEBSITE_VISIT' },
    { id: '7012', name: 'Cloud trial — lead gen form', audience: retarget.id, budget: 120, objective: 'LEAD_GENERATION' },
  ];
  const ts = now();
  for (const c of adCampaigns) {
    run(
      `INSERT INTO ad_campaigns (id, account_id, name, status, objective, type, audience_id,
         daily_budget, currency, start_at, landing_url, synced_at, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, audience_id = excluded.audience_id`,
      c.id, '512345678', c.name, 'ACTIVE', c.objective, 'SPONSORED_UPDATES', c.audience,
      c.budget, 'USD', daysAgo(45), 'https://beamr.com/cloud?utm_source=linkedin&utm_medium=cpc',
      ts, ts, ts,
    );
    for (let d = 29; d >= 0; d--) {
      const impressions = Math.round(2200 + Math.random() * 1800);
      const clicks = Math.round(impressions * (0.008 + Math.random() * 0.012));
      upsertMetric({
        ad_campaign_id: c.id,
        date: dayKey(new Date(Date.now() - d * 86400000)),
        impressions,
        unique_reach: Math.round(impressions * 0.42),
        clicks,
        spend: Math.round(clicks * (7 + Math.random() * 5) * 100) / 100,
        video_views: Math.round(impressions * 0.11),
        reactions: Math.round(clicks * 0.15),
        leads: c.objective === 'LEAD_GENERATION' && chance(0.35) ? 1 : 0,
      });
    }
  }

  // A couple of lead-gen form responses — the person-level ad signal.
  ingestLeadResponse({
    response_urn: 'seed-lead-1', email: 'gil.ashkenazi@viaplay.com', first_name: 'Gil',
    last_name: 'Ashkenazi', company: 'Viaplay', job_title: 'Director of Video Platform',
    ad_campaign_id: '7012', form_id: '990', submitted_at: daysAgo(6),
    answers: { interest: 'Cloud trial', volume: '50-200 TB/month' },
  });
  ingestLeadResponse({
    response_urn: 'seed-lead-2', email: 'noor.haddad@rakuten.tv', first_name: 'Noor',
    last_name: 'Haddad', company: 'Rakuten TV', job_title: 'VP Engineering',
    ad_campaign_id: '7012', form_id: '990', submitted_at: daysAgo(2),
    answers: { interest: 'CDN cost reduction' },
  });
  report.contacts += 2;

  // ------------------------------------------------------------- journeys --
  createJourney({
    name: 'Pricing visit → case study + retarget',
    description: 'A senior contact reads pricing: send the proof, add them to retargeting, tell sales.',
    trigger_type: 'event',
    trigger_config: { event_type: 'page_view', path_contains: '/pricing', within_hours: 72 },
    conditions: { field: 'seniority', operator: 'in', value: ['vp', 'cxo', 'director'] },
    actions: [
      { type: 'add_to_audience', audience_id: retarget.id },
      { type: 'set_lifecycle', stage: 'mql' },
      { type: 'alert', title: 'Senior contact read the pricing page' },
    ],
    cooldown_hours: 336,
    enabled: true,
  });
  createJourney({
    name: 'Score crossed 70 → alert sales',
    description: 'Anyone who becomes genuinely hot gets surfaced to the owner immediately.',
    trigger_type: 'score_threshold',
    trigger_config: { min_score: 70 },
    conditions: {},
    actions: [{ type: 'alert', title: 'Contact is now hot' }],
    cooldown_hours: 720,
    enabled: true,
  });
  report.journeys += 2;

  recomputeAll();

  const final = get(`SELECT
    (SELECT COUNT(*) FROM contacts) AS contacts,
    (SELECT COUNT(*) FROM events) AS events,
    (SELECT COUNT(*) FROM sends WHERE status='sent') AS sends,
    (SELECT COUNT(*) FROM ad_metrics) AS ad_metric_rows,
    (SELECT COUNT(*) FROM li_audience_members) AS audience_members`);

  log.info(`seeded ${final.contacts} contacts, ${final.events} events`);
  return { ...report, totals: final, dedicated_list_id: dedicated.id };
}
