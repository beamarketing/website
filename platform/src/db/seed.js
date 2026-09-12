import { run, get, all, tx } from './index.js';
import { id, now, daysAgo, dayKey } from '../lib/util.js';
import { upsertContact, createList, addToList } from '../core/contacts.js';
import { recordEvent, ensureVisitor, identifyVisitor } from '../core/events.js';
import { recomputeAll } from '../core/scoring.js';
import { createTemplate, createCampaign, queueCampaign, processQueue } from '../channels/email/campaigns.js';
import { createAudience, syncAudience } from '../channels/ads/audiences.js';
import { syncCohorts, listCohorts, linkCohortToAd } from '../channels/ads/cohorts.js';
import { upsertMetric, ingestLead, campaignKey } from '../channels/ads/insights.js';
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
        'ad_audience_members', 'ad_audiences', 'ad_cohorts', 'ad_metrics', 'ad_campaigns',
        'ad_lead_responses', 'ad_conversion_forwards',
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

  // A realistic dedicated list is a few hundred to a few thousand people, not a
  // dozen. Size matters here beyond realism: cohorting only does anything once
  // the list is larger than the platform's serving floor, so a small seed would
  // hide the mechanism entirely.
  const BULK_TARGET = Number(process.env.SEED_CONTACTS || 1200);
  const FIRST_NAMES = ['Maya','Tomer','Priya','Daniel','Sofia','Marcus','Anika','Lucas','Elena','Kenji',
    'Ruth','Oren','Chloe','Ibrahim','Hannah','Rafael','Yuki','Nadia','Simon','Leila','Victor','Amara',
    'Jonas','Fatima','Nina','Diego','Astrid','Omar','Clara','Mateo','Ingrid','Hassan','Julia','Andrei',
    'Sanne','Pierre','Keiko','Lars','Rania','Tobias','Mireille','Arjun','Freya','Emeka','Paula','Stefan'];
  const LAST_NAMES = ['Ferrante','Bar-Lev','Raghavan','Okonkwo','Lindqvist','Whitfield','Deshmukh','Moreau',
    'Rossi','Watanabe','Alvarez','Shamir','Baptiste','Nasser','Meyer','Cardoso','Tanaka','Farouk','Bergstrom',
    'Haddad','Novak','Obi','Kimura','Al-Rashid','Kowalski','Andersen','Dubois','Weber','Silva','Nakamura',
    'Petrov','Hansen','Marchetti','Yilmaz','Bakker','Lefebvre','Costa','Jensen','Moreno','Schneider'];
  const TITLES = [
    ['VP of Video Engineering','vp'],['Chief Technology Officer','cxo'],['Director of Streaming Operations','director'],
    ['Head of Media Infrastructure','vp'],['Principal Video Architect','ic'],['SVP Technology','vp'],
    ['Senior Encoding Engineer','ic'],['Director of Product, Playback','director'],['VP Content Delivery','vp'],
    ['Manager, Video Platform','manager'],['Head of CDN Strategy','vp'],['Staff Engineer, Transcoding','ic'],
    ['Director of Engineering','director'],['Cloud Infrastructure Lead','manager'],['VP Operations','vp'],
    ['Media Systems Architect','ic'],['Product Manager, Video','manager'],['Chief Product Officer','cxo'],
    ['Engineering Manager, Encoding','manager'],['Director of Platform Engineering','director'],
    ['Head of Video Quality','vp'],['Senior Director, Streaming','director'],['Video Infrastructure Engineer','ic'],
    ['VP Digital Products','vp'],['Head of Content Operations','vp'],['Lead Video Engineer','ic']];

  for (let i = PEOPLE.length; i < BULK_TARGET; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 7 + 3) % LAST_NAMES.length];
    const [title] = TITLES[(i * 3) % TITLES.length];
    const company = COMPANIES[i % COMPANIES.length];
    PEOPLE.push([first, last, title, company, i]);
  }

  for (const [i, [first, last, title]] of PEOPLE.entries()) {
    const company = COMPANIES[i % COMPANIES.length];
    const email = `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, '')}${i >= 24 ? i : ''}@${company.domain}`;
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
    // Behaviour is expensive to generate and realistically sparse anyway:
    // most of a dedicated list has never visited the site.
    const BEHAVING = Math.min(contacts.length, 90);
    for (const [i, contact] of contacts.slice(0, BEHAVING).entries()) {
      const tier = i < 8 ? 'hot' : i < 30 ? 'warm' : 'cold';
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
          // Roughly 40% of paid arrivals come from Meta, the rest from LinkedIn.
          const fromMeta = fromAd && chance(0.4);
          recordEvent({
            contact_id: contact.id, visitor_id: visitorId, channel: 'web', type: 'page_view',
            url: `https://beamr.com${path}${fromAd
              ? (fromMeta ? '?utm_source=facebook&utm_medium=cpc&fbclid=seed' : '?utm_source=linkedin&utm_medium=cpc&li_fat_id=seed')
              : ''}`,
            path, title: `Beamr · ${path}`, occurred_at: at,
            ...(fromAd ? {
              utm_source: fromMeta ? 'facebook' : 'linkedin',
              utm_medium: 'cpc',
              platform: fromMeta ? 'meta' : 'linkedin',
              ad_campaign_id: fromMeta ? campaignKey('meta', '9021') : campaignKey('linkedin', '7011'),
            } : {}),
          });
          report.events += 1;

          if (fromAd && v === 0) {
            recordEvent({
              contact_id: contact.id, visitor_id: visitorId, channel: 'ads', type: 'ad_click',
              platform: fromMeta ? 'meta' : 'linkedin',
              ad_campaign_id: fromMeta ? campaignKey('meta', '9021') : campaignKey('linkedin', '7011'),
              path, occurred_at: at,
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

  // ---------------------------------------------------------- advertising --
  // The same dedicated list, mirrored to both platforms. This is the normal
  // shape of a contact-based programme: LinkedIn reaches these people in a work
  // context, Meta reaches the same people far more cheaply in a personal one,
  // and the contact record is what ties the two together.
  const audiencesCreated = [];
  for (const platform of ['linkedin', 'meta']) {
    const main = createAudience({
      name: `Dedicated list — VP+ media & streaming (${platform})`,
      platform,
      list_id: dedicated.id,
      rules: { field: 'seniority', operator: 'in', value: ['vp', 'cxo', 'director'] },
      // Cohort mode on, so the seed demonstrates contact-level attribution.
      cohort_mode: true,
    });
    await syncAudience(main.id);
    audiencesCreated.push(main);

    const retarget = createAudience({
      name: `Pricing-page visitors, last 30 days (${platform})`,
      platform,
      rules: { op: 'and', rules: [{ field: 'visited_path(/pricing)', operator: 'gte', value: 1 }] },
    });
    await syncAudience(retarget.id);
    audiencesCreated.push(retarget);
    report.audiences += 2;
  }

  const liAudience = audiencesCreated[0];
  const metaAudience = audiencesCreated[2];

  const adCampaigns = [
    { platform: 'linkedin', native: '7011', name: 'CABR — VP+ media retargeting', audience: liAudience.id, budget: 180, objective: 'WEBSITE_VISIT', cpc: [7, 5] },
    { platform: 'linkedin', native: '7012', name: 'Cloud trial — lead gen form', audience: audiencesCreated[1].id, budget: 120, objective: 'LEAD_GENERATION', cpc: [8, 4] },
    // Meta reaches the same people at a fraction of LinkedIn's cost per click,
    // which is the entire commercial argument for running both.
    { platform: 'meta', native: '9021', name: 'CABR — VP+ media retargeting (Meta)', audience: metaAudience.id, budget: 90, objective: 'OUTCOME_TRAFFIC', cpc: [1.1, 0.9] },
    { platform: 'meta', native: '9022', name: 'Case study — video engineering leaders', audience: audiencesCreated[3].id, budget: 60, objective: 'OUTCOME_LEADS', cpc: [1.4, 1.1] },
  ];

  const ts = now();
  for (const c of adCampaigns) {
    const key = campaignKey(c.platform, c.native);
    run(
      `INSERT INTO ad_campaigns (id, platform, native_id, account_id, name, status, objective, type,
         audience_id, daily_budget, currency, start_at, landing_url, synced_at, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, audience_id = excluded.audience_id`,
      key, c.platform, c.native, c.platform === 'meta' ? '9988776655' : '512345678',
      c.name, 'ACTIVE', c.objective,
      c.platform === 'meta' ? 'OUTCOME_SALES' : 'SPONSORED_UPDATES',
      c.audience, c.budget, 'USD', daysAgo(45),
      `https://beamr.com/cloud?utm_source=${c.platform}&utm_medium=cpc`, ts, ts, ts,
    );

    for (let d = 29; d >= 0; d--) {
      const impressions = Math.round((c.platform === 'meta' ? 9000 : 2200) + Math.random() * 1800);
      const clicks = Math.round(impressions * (c.platform === 'meta' ? 0.011 : 0.008) * (0.8 + Math.random() * 0.5));
      upsertMetric({
        platform: c.platform,
        ad_campaign_id: key,
        creative_id: '',
        date: dayKey(new Date(Date.now() - d * 86400000)),
        impressions,
        unique_reach: Math.round(impressions * (c.platform === 'meta' ? 0.28 : 0.42)),
        clicks,
        spend: Math.round(clicks * (c.cpc[0] + Math.random() * c.cpc[1]) * 100) / 100,
        video_views: Math.round(impressions * 0.11),
        reactions: Math.round(clicks * 0.15),
        frequency: c.platform === 'meta' ? 3.2 + Math.random() : 1.6 + Math.random() * 0.6,
        leads: c.objective.includes('LEAD') && chance(0.35) ? 1 : 0,
      });
    }
  }

  // Bind each cohort to an ad object so its metrics resolve to named people.
  for (const audience of [liAudience, metaAudience]) {
    await syncCohorts(audience.id);
    const cohortRows = listCohorts(audience.id);
    const campaign = adCampaigns.find((c) => c.audience === audience.id);
    for (const cohort of cohortRows) {
      const creativeId = `${campaign.platform}-ad-${campaign.native}-c${cohort.seq}`;
      linkCohortToAd(cohort.id, {
        ad_campaign_id: campaignKey(campaign.platform, campaign.native),
        creative_id: creativeId,
      });
      // Per-ad daily metrics: this is the data that makes a cohort readable.
      for (let d = 13; d >= 0; d--) {
        const impressions = Math.round((cohort.members || 1) * (campaign.platform === 'meta' ? 22 : 9) * (0.7 + Math.random() * 0.7));
        const clicks = Math.round(impressions * (campaign.platform === 'meta' ? 0.012 : 0.009));
        upsertMetric({
          platform: campaign.platform,
          ad_campaign_id: campaignKey(campaign.platform, campaign.native),
          creative_id: creativeId,
          cohort_id: cohort.id,
          date: dayKey(new Date(Date.now() - d * 86400000)),
          impressions,
          unique_reach: Math.round(impressions * 0.35),
          clicks,
          spend: Math.round(clicks * (campaign.cpc[0] + Math.random() * campaign.cpc[1]) * 100) / 100,
          frequency: campaign.platform === 'meta' ? 3.4 : 1.8,
        });
      }
    }
  }

  // Lead-form responses: the one person-level signal either platform returns.
  ingestLead({
    platform: 'linkedin',
    response_urn: 'seed-lead-li-1', email: 'gil.ashkenazi@viaplay.com', first_name: 'Gil',
    last_name: 'Ashkenazi', company: 'Viaplay', job_title: 'Director of Video Platform',
    native_campaign_id: '7012', form_id: '990', submitted_at: daysAgo(6),
    answers: { interest: 'Cloud trial', volume: '50-200 TB/month' },
  });
  ingestLead({
    platform: 'meta',
    response_urn: 'seed-lead-meta-1', email: 'noor.haddad@rakuten.tv', first_name: 'Noor',
    last_name: 'Haddad', company: 'Rakuten TV', job_title: 'VP Engineering',
    native_campaign_id: '9022', form_id: '551', submitted_at: daysAgo(2),
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
      { type: 'add_to_audience', audience_id: audiencesCreated[1].id },
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
    (SELECT COUNT(*) FROM ad_audience_members) AS audience_members,
    (SELECT COUNT(*) FROM ad_cohorts) AS cohorts,
    (SELECT COUNT(*) FROM ad_audiences WHERE platform='meta') AS meta_audiences,
    (SELECT COUNT(*) FROM ad_audiences WHERE platform='linkedin') AS linkedin_audiences`);

  log.info(`seeded ${final.contacts} contacts, ${final.events} events`);
  return { ...report, totals: final, dedicated_list_id: dedicated.id };
}
