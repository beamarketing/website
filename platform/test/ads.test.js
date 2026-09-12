import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.DB_PATH = join(mkdtempSync(join(tmpdir(), 'beamr-ads-')), 'ads.db');
process.env.SECRET_KEY = 'test-secret-key';
process.env.PUBLIC_URL = 'https://abm.beamr.com';
process.env.TRACKING_ORIGINS = 'beamr.com';
process.env.LOG_LEVEL = 'error';
// Keep cohorts small enough that a test list can produce several of them.
process.env.LINKEDIN_MIN_AUDIENCE = '10';
process.env.META_MIN_AUDIENCE = '4';
process.env.AD_COHORT_OVERSIZE = '1';

const norm = await import('../src/channels/meta/normalize.js');
const { adapter, PLATFORMS, platformSummary } = await import('../src/channels/ads/adapters.js');
const audiences = await import('../src/channels/ads/audiences.js');
const cohorts = await import('../src/channels/ads/cohorts.js');
const insights = await import('../src/channels/ads/insights.js');
const capi = await import('../src/channels/meta/capi.js');
const contacts = await import('../src/core/contacts.js');
const events = await import('../src/core/events.js');
const tracking = await import('../src/core/tracking.js');
const { detectAdPlatform, buildFbc, dissectUrl } = await import('../src/lib/util.js');
const { get, all, run } = await import('../src/db/index.js');

describe('meta normalisation', () => {
  test('email is lowercased and trimmed before hashing', () => {
    assert.equal(norm.NORMALISERS.EMAIL('  Dor@Beamr.COM  '), 'dor@beamr.com');
    assert.equal(norm.prepareKey('EMAIL', 'Dor@Beamr.com'), norm.prepareKey('EMAIL', 'dor@beamr.com'));
    assert.equal(norm.NORMALISERS.EMAIL('not-an-email'), null);
  });

  test('names fold accents and drop punctuation', () => {
    assert.equal(norm.NORMALISERS.FN('José-María'), 'josemaria');
    assert.equal(norm.NORMALISERS.LN("O'Brien"), 'obrien');
    assert.equal(norm.NORMALISERS.FI('Dor'), 'd');
  });

  test('US states become two-letter codes and ZIPs are truncated to five', () => {
    assert.equal(norm.NORMALISERS.ST('California'), 'ca');
    assert.equal(norm.NORMALISERS.ST('CA'), 'ca');
    assert.equal(norm.NORMALISERS.ZIP('94103-1234'), '94103');
    // Non-US postcodes keep their full form.
    assert.equal(norm.NORMALISERS.ZIP('SW1A 1AA'), 'sw1a1aa');
  });

  test('countries resolve to ISO alpha-2', () => {
    assert.equal(norm.NORMALISERS.COUNTRY('United States'), 'us');
    assert.equal(norm.NORMALISERS.COUNTRY('Israel'), 'il');
    assert.equal(norm.NORMALISERS.COUNTRY('gb'), 'gb');
    assert.equal(norm.NORMALISERS.COUNTRY('Nowhereland'), null);
  });

  test('phones keep digits only, with the country code', () => {
    assert.equal(norm.NORMALISERS.PHONE('+1 (415) 555-0123'), '14155550123');
    assert.equal(norm.NORMALISERS.PHONE('123'), null);
  });

  test('EXTERN_ID is sent unhashed, everything else is hashed', () => {
    assert.equal(norm.prepareKey('EXTERN_ID', 'ct_123'), 'ct_123');
    assert.match(norm.prepareKey('EMAIL', 'a@b.com'), /^[0-9a-f]{64}$/);
    assert.equal(norm.prepareKey('EMAIL', ''), null);
  });

  test('a contact row aligns to the schema, blanks included', () => {
    const row = norm.contactToRow({ id: 'ct_1', email: 'a@b.com', first_name: 'Ada', country: 'Israel' });
    assert.equal(row.length, norm.SCHEMA.length);
    assert.equal(row[norm.SCHEMA.indexOf('EXTERN_ID')], 'ct_1');
    assert.equal(row[norm.SCHEMA.indexOf('ST')], '', 'unknown keys must be empty, not omitted');
    assert.equal(norm.rowCompleteness(row).filled, 4);
  });

  test('CAPI user_data hashes PII but passes fbp/fbc through in the clear', () => {
    const ud = norm.capiUserData(
      { id: 'ct_1', email: 'a@b.com', first_name: 'Ada', country: 'Israel' },
      { fbp: 'fb.1.123.456', fbc: 'fb.1.123.clickid', ip: '1.2.3.4', userAgent: 'UA' },
    );
    assert.match(ud.em[0], /^[0-9a-f]{64}$/);
    assert.equal(ud.fbp, 'fb.1.123.456');
    assert.equal(ud.fbc, 'fb.1.123.clickid');
    assert.equal(ud.client_ip_address, '1.2.3.4');
    assert.deepEqual(ud.external_id, ['ct_1']);
  });
});

describe('platform adapters', () => {
  test('both platforms are registered with their real serving floors', () => {
    assert.deepEqual(PLATFORMS.sort(), ['linkedin', 'meta']);
    assert.equal(adapter('linkedin').minAudienceSize, 10);
    assert.equal(adapter('meta').minAudienceSize, 4);
  });

  test('LinkedIn matches on one key, Meta on many', () => {
    assert.equal(adapter('linkedin').matchKeys.length, 1);
    assert.ok(adapter('meta').matchKeys.length > 5);
  });

  test('only Meta supports a conversions API', () => {
    assert.equal(adapter('meta').supportsConversionsApi, true);
    assert.equal(adapter('linkedin').supportsConversionsApi, false);
  });

  test('an unknown platform is rejected rather than silently defaulted', () => {
    assert.throws(() => adapter('tiktok'), /Unknown ad platform/);
  });

  test('both report dry-run without credentials', () => {
    for (const p of platformSummary()) {
      assert.equal(p.configured, false);
      assert.equal(p.dry_run, true);
    }
  });
});

describe('ad click attribution', () => {
  test('the network click id identifies the platform', () => {
    assert.equal(detectAdPlatform(new URLSearchParams('li_fat_id=abc')), 'linkedin');
    assert.equal(detectAdPlatform(new URLSearchParams('fbclid=xyz')), 'meta');
  });

  test('UTMs are a fallback, and only for paid mediums', () => {
    assert.equal(detectAdPlatform(new URLSearchParams('utm_source=facebook&utm_medium=cpc')), 'meta');
    assert.equal(detectAdPlatform(new URLSearchParams('utm_source=linkedin&utm_medium=cpc')), 'linkedin');
    // Organic traffic from the same source is not an ad click.
    assert.equal(detectAdPlatform(new URLSearchParams('utm_source=linkedin&utm_medium=social')), null);
    assert.equal(detectAdPlatform(new URLSearchParams('utm_source=newsletter&utm_medium=email')), null);
  });

  test('fbc is built in Meta\'s documented format', () => {
    assert.equal(buildFbc('XYZ', 1700000000000), 'fb.1.1700000000000.XYZ');
    assert.equal(buildFbc(null), null);
  });

  test('a Meta ad landing becomes a contact-level ad_click', () => {
    const c = contacts.upsertContact({ email: 'metaclick@disney.com', job_title: 'VP Video' }).contact;
    events.ensureVisitor('vis-meta-0001', {});
    events.identifyVisitor('vis-meta-0001', c.id);
    tracking.ingestBatch({ events: [{
      vid: 'vis-meta-0001', type: 'page_view',
      url: 'https://beamr.com/cloud?utm_source=facebook&utm_medium=cpc&fbclid=CLICK123',
      fbp: 'fb.1.999.111',
    }] }, {});
    const click = events.timeline(c.id).find((e) => e.type === 'ad_click');
    assert.ok(click, 'a Meta ad click should be recorded');
    assert.equal(click.platform, 'meta');
    assert.equal(click.channel, 'ads');
    assert.equal(click.meta.fbclid, 'CLICK123');
    assert.equal(click.meta.fbc, 'fb.1.1700000000000.CLICK123'.replace(/1700000000000/, click.meta.fbc.split('.')[2]));
    assert.equal(click.meta.fbp, 'fb.1.999.111');
  });

  test('an organic visit is not recorded as an ad click', () => {
    const c = contacts.upsertContact({ email: 'organic@disney.com' }).contact;
    events.ensureVisitor('vis-organic-01', {});
    events.identifyVisitor('vis-organic-01', c.id);
    tracking.ingestBatch({ events: [{
      vid: 'vis-organic-01', type: 'page_view', url: 'https://beamr.com/blog/post',
    }] }, {});
    assert.equal(events.timeline(c.id).filter((e) => e.type === 'ad_click').length, 0);
  });
});

describe('cohorts', () => {
  const listId = () => get("SELECT id FROM lists WHERE name = 'Cohort list'")?.id;

  test('an audience splits into cohorts at the platform floor', async () => {
    const list = contacts.createList({ name: 'Cohort list' });
    for (let i = 0; i < 24; i++) {
      const c = contacts.upsertContact({
        email: `cohort${i}@sky.uk`, first_name: `P${i}`, job_title: 'VP Engineering', country: 'United Kingdom',
      }).contact;
      contacts.addToList(list.id, c.id);
    }

    const audience = audiences.createAudience({
      name: 'Cohort test', platform: 'meta', list_id: list.id, cohort_mode: true,
    });
    const sync = await audiences.syncAudience(audience.id);
    assert.equal(sync.added, 24);
    assert.ok(sync.cohorts, 'cohorts should be built during the sync');

    const built = cohorts.listCohorts(audience.id);
    // Meta floor is 4 in this test, oversize 1 → cohorts of 4.
    assert.equal(built.length, 6);
    assert.equal(built[0].members, 4);
    assert.equal(built.reduce((n, c) => n + c.members, 0), 24);
  });

  test('every member is assigned to exactly one cohort', () => {
    const audience = get("SELECT id FROM ad_audiences WHERE name = 'Cohort test'");
    const unassigned = get(
      "SELECT COUNT(*) AS n FROM ad_audience_members WHERE audience_id = ? AND state = 'pushed' AND cohort_id IS NULL",
      audience.id,
    ).n;
    assert.equal(unassigned, 0);
  });

  test('cohorts are ordered by score, so cohort 1 is the hottest slice', () => {
    const audience = get("SELECT id FROM ad_audiences WHERE name = 'Cohort test'");
    const built = cohorts.listCohorts(audience.id);
    const first = cohorts.cohortMembers(built[0].id);
    const last = cohorts.cohortMembers(built[built.length - 1].id);
    const avg = (rows) => rows.reduce((n, r) => n + r.score, 0) / Math.max(1, rows.length);
    assert.ok(avg(first) >= avg(last));
  });

  test('the precision report states the real gain, not a marketing number', () => {
    const audience = get("SELECT id FROM ad_audiences WHERE name = 'Cohort test'");
    const p = cohorts.precisionReport(audience.id);
    assert.equal(p.total_members, 24);
    assert.equal(p.avg_cohort_size, 4);
    assert.equal(p.without_cohorts, '1 of 24');
    assert.equal(p.with_cohorts, '1 of 4');
    assert.equal(p.precision_gain, 6);
    // The honest caveat must always be present.
    assert.match(p.impressions_note, /never to one person/);
    assert.match(p.clicks_note, /resolve to the individual/);
  });

  test('a cohort landing URL carries a verifiable token', () => {
    const audience = get("SELECT id FROM ad_audiences WHERE name = 'Cohort test'");
    const built = cohorts.listCohorts(audience.id);
    const url = cohorts.cohortLandingUrl(built[0].id, 'https://beamr.com/cloud');
    const token = new URL(url).searchParams.get('bmr_co');
    assert.ok(token);
    const resolved = cohorts.cohortFromToken(token);
    assert.equal(resolved.id, built[0].id);
    assert.equal(cohorts.cohortFromToken('forged.token'), null);
  });

  test('a click on a cohort URL attributes to that cohort', () => {
    const audience = get("SELECT id FROM ad_audiences WHERE name = 'Cohort test'");
    const built = cohorts.listCohorts(audience.id);
    const member = cohorts.cohortMembers(built[0].id)[0];
    const url = cohorts.cohortLandingUrl(built[0].id, 'https://beamr.com/cloud');

    events.ensureVisitor('vis-cohort-001', {});
    events.identifyVisitor('vis-cohort-001', member.id);
    tracking.ingestBatch({ events: [{ vid: 'vis-cohort-001', type: 'page_view', url }] }, {});

    const click = events.timeline(member.id).find((e) => e.type === 'ad_click');
    assert.ok(click);
    assert.equal(click.cohort_id, built[0].id);
    assert.equal(click.platform, 'meta');
  });

  test('linking a cohort to an ad back-fills metrics already ingested', () => {
    const audience = get("SELECT id FROM ad_audiences WHERE name = 'Cohort test'");
    const built = cohorts.listCohorts(audience.id);
    run(
      `INSERT INTO ad_campaigns (id, platform, native_id, name, created_at, updated_at)
       VALUES ('meta:555','meta','555','Test campaign',datetime('now'),datetime('now'))`,
    );
    insights.upsertMetric({
      platform: 'meta', ad_campaign_id: 'meta:555', creative_id: 'ad-999',
      date: '2026-01-01', impressions: 500, clicks: 12, spend: 18.5,
    });
    assert.equal(get("SELECT cohort_id FROM ad_metrics WHERE creative_id = 'ad-999'").cohort_id, null);

    cohorts.linkCohortToAd(built[0].id, { ad_campaign_id: 'meta:555', creative_id: 'ad-999' });
    assert.equal(get("SELECT cohort_id FROM ad_metrics WHERE creative_id = 'ad-999'").cohort_id, built[0].id);
  });

  test('shrinking the audience retires the emptied cohorts', async () => {
    const audience = get("SELECT id FROM ad_audiences WHERE name = 'Cohort test'");
    const list = listId();
    const drop = all('SELECT contact_id FROM ad_audience_members WHERE audience_id = ? LIMIT 12', audience.id);
    for (const d of drop) run('UPDATE contacts SET consent_ads = 0 WHERE id = ?', d.contact_id);

    await audiences.syncAudience(audience.id);
    const after = cohorts.listCohorts(audience.id);
    assert.ok(after.some((c) => c.status === 'retired'), 'emptied cohorts must be retired');
    assert.equal(after.filter((c) => c.status !== 'retired').reduce((n, c) => n + c.members, 0), 12);
  });
});

describe('cross-platform mirroring', () => {
  test('one list becomes an audience on each platform', async () => {
    const list = contacts.createList({ name: 'Mirror list' });
    for (let i = 0; i < 8; i++) {
      const c = contacts.upsertContact({ email: `mirror${i}@dazn.com`, job_title: 'Director' }).contact;
      contacts.addToList(list.id, c.id);
    }
    const result = await audiences.mirrorToAllPlatforms({ name: 'Mirrored', list_id: list.id });
    assert.equal(result.mirrored, 2);
    const made = all("SELECT platform FROM ad_audiences WHERE name LIKE 'Mirrored%'").map((r) => r.platform).sort();
    assert.deepEqual(made, ['linkedin', 'meta']);
    // Both platforms target the same people from the same source list.
    for (const r of result.results) assert.equal(r.added, 8);
  });

  test('ad consent is honoured identically on both platforms', async () => {
    const audience = get("SELECT id FROM ad_audiences WHERE name LIKE 'Mirrored%' AND platform = 'meta'");
    const member = get("SELECT contact_id FROM ad_audience_members WHERE audience_id = ? LIMIT 1", audience.id);
    run('UPDATE contacts SET consent_ads = 0 WHERE id = ?', member.contact_id);

    for (const row of all("SELECT id FROM ad_audiences WHERE name LIKE 'Mirrored%'")) {
      const r = await audiences.syncAudience(row.id);
      assert.equal(r.removed, 1, 'an ad opt-out must be removed from every platform');
    }
  });
});

describe('meta conversions api', () => {
  test('events without an identifier are skipped, not sent', async () => {
    const c = contacts.upsertContact({ email: 'capi@vimeo.com' }).contact;
    const { event } = events.recordEvent({ contact_id: c.id, channel: 'web', type: 'demo_request' });
    const result = await capi.forwardEvents([event]);
    // No credentials in tests, so everything is a dry run.
    assert.equal(result.dry_run, true);
    assert.equal(result.sent, 0);
  });

  test('a forwarded event is recorded once and never re-sent', async () => {
    const c = contacts.upsertContact({ email: 'capi2@vimeo.com' }).contact;
    const { event } = events.recordEvent({ contact_id: c.id, channel: 'web', type: 'signup' });
    await capi.forwardEvents([event]);
    const first = get("SELECT COUNT(*) AS n FROM ad_conversion_forwards WHERE event_id = ?", capi.eventIdFor(event)).n;
    await capi.forwardEvents([event]);
    const second = get("SELECT COUNT(*) AS n FROM ad_conversion_forwards WHERE event_id = ?", capi.eventIdFor(event)).n;
    assert.equal(first, 1);
    assert.equal(second, 1, 'the dedup key must prevent a duplicate forward');
  });

  test('a contact who opted out of ads is never forwarded', async () => {
    const c = contacts.upsertContact({ email: 'noads@vimeo.com' }).contact;
    run('UPDATE contacts SET consent_ads = 0 WHERE id = ?', c.id);
    const { event } = events.recordEvent({ contact_id: c.id, channel: 'web', type: 'demo_request' });
    await capi.forwardEvents([event]);
    const row = get('SELECT status, error FROM ad_conversion_forwards WHERE event_id = ?', capi.eventIdFor(event));
    assert.equal(row.status, 'skipped');
    assert.equal(row.error, 'no ad consent');
  });

  test('event ids are deterministic so the browser pixel can match them', () => {
    assert.equal(capi.eventIdFor({ id: 'ev_abc' }), 'bmr_ev_abc');
  });
});

describe('cross-platform reporting', () => {
  test('campaign ids are namespaced per platform', () => {
    assert.equal(insights.campaignKey('meta', '123'), 'meta:123');
    assert.notEqual(insights.campaignKey('meta', '123'), insights.campaignKey('linkedin', '123'));
  });

  test('comparison counts only genuine engagement, never being targeted', () => {
    const rows = insights.platformComparison({ days: 30 });
    assert.equal(rows.length, 2);
    for (const row of rows) {
      // Many contacts were pushed to audiences in these tests; none of that is
      // engagement, so the identified count must stay far below the targeted one.
      assert.ok(row.identified_engagements <= row.targeted_contacts);
      assert.ok(row.targeted_contacts > 0);
    }
    const meta = rows.find((r) => r.platform === 'meta');
    assert.ok(meta.identified_engagements < meta.targeted_contacts,
      'audience_added must not be counted as an engagement');
  });
});
