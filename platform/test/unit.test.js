import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Every test run gets a throwaway database.
process.env.DB_PATH = join(mkdtempSync(join(tmpdir(), 'beamr-test-')), 'test.db');
process.env.SECRET_KEY = 'test-secret-key';
process.env.ADMIN_TOKEN = 'test-admin-token';
process.env.PUBLIC_URL = 'https://abm.beamr.com';
process.env.TRACKING_ORIGINS = 'beamr.com';
process.env.LOG_LEVEL = 'error';

const { parseCsv, toCsv, guessMapping, applyMapping } = await import('../src/lib/csv.js');
const { render, renderText, extractTags, htmlToText } = await import('../src/lib/template.js');
const { normalizeEmail, emailDomain, emailHash, signToken, verifyToken, dissectUrl } = await import('../src/lib/util.js');
const { originAllowed, Router } = await import('../src/lib/http.js');
const { quotedPrintable, encodeHeader, buildMessage } = await import('../src/channels/email/mime.js');
const contacts = await import('../src/core/contacts.js');
const segments = await import('../src/core/segments.js');
const events = await import('../src/core/events.js');
const scoring = await import('../src/core/scoring.js');
const tracking = await import('../src/core/tracking.js');
const campaigns = await import('../src/channels/email/campaigns.js');
const emailTracking = await import('../src/channels/email/tracking.js');
const audiences = await import('../src/channels/linkedin/audiences.js');
const { get, run, tx } = await import('../src/db/index.js');

describe('csv', () => {
  test('parses quoted fields, embedded commas and newlines', () => {
    const { headers, rows } = parseCsv('a,b\n"x,y","line1\nline2"\n');
    assert.deepEqual(headers, ['a', 'b']);
    assert.equal(rows[0].a, 'x,y');
    assert.equal(rows[0].b, 'line1\nline2');
  });

  test('handles escaped quotes and BOM', () => {
    const { rows } = parseCsv('﻿name\n"He said ""hi"""\n');
    assert.equal(rows[0].name, 'He said "hi"');
  });

  test('sniffs semicolon and tab delimiters', () => {
    assert.equal(parseCsv('a;b\n1;2\n').rows[0].b, '2');
    assert.equal(parseCsv('a\tb\n1\t2\n').rows[0].b, '2');
  });

  test('maps common CRM header spellings onto contact fields', () => {
    const map = guessMapping(['Work Email', 'First Name', 'Company Name', 'Job Title', 'Notes']);
    assert.equal(map.email, 'Work Email');
    assert.equal(map.first_name, 'First Name');
    assert.equal(map.company, 'Company Name');
    assert.equal(map.job_title, 'Job Title');
    assert.equal(map.notes, undefined);
  });

  test('unmapped columns become custom attrs', () => {
    const mapped = applyMapping({ 'Work Email': 'a@b.com', 'Deal Size': '50k' }, { email: 'Work Email' });
    assert.equal(mapped.email, 'a@b.com');
    assert.equal(mapped.attrs.deal_size, '50k');
  });

  test('round-trips through toCsv', () => {
    const rows = [{ a: 'x,y', b: 'q"q' }];
    assert.deepEqual(parseCsv(toCsv(rows)).rows[0], rows[0]);
  });
});

describe('templating', () => {
  const ctx = { first_name: 'Dor', company: 'Beamr <Inc>', job_title: '', attrs: { use_case: 'cdn cost' } };

  test('renders merge tags and HTML-escapes by default', () => {
    assert.equal(render('Hi {{ first_name }} at {{ company }}', ctx), 'Hi Dor at Beamr &lt;Inc&gt;');
  });

  test('applies filter chains', () => {
    assert.equal(render('{{ attrs.use_case | title }}', ctx), 'Cdn Cost');
    assert.equal(render('{{ missing | fallback: "there" }}', ctx), 'there');
    assert.equal(render('{{ job_title | fallback: "buyer" }}', ctx), 'buyer');
  });

  test('resolves conditionals including comparisons', () => {
    assert.equal(render('{% if company %}yes{% else %}no{% endif %}', ctx), 'yes');
    assert.equal(render('{% if job_title %}yes{% else %}no{% endif %}', ctx), 'no');
    assert.equal(render('{% if first_name == "Dor" %}A{% else %}B{% endif %}', ctx), 'A');
    assert.equal(render('{% if first_name != "Dor" %}A{% else %}B{% endif %}', ctx), 'B');
  });

  test('never lets contact data inject markup', () => {
    const out = render('{{ company }}', { company: '<script>alert(1)</script>' });
    assert.ok(!out.includes('<script>'));
  });

  test('extracts the tags a template depends on', () => {
    const tags = extractTags('{{first_name}} {{attrs.x | title}} {% if company %}y{% endif %}');
    assert.deepEqual(tags.sort(), ['attrs.x', 'company', 'first_name']);
  });

  test('converts HTML to readable plain text with link URLs', () => {
    const text = htmlToText('<p>Hi</p><a href="https://beamr.com">See it</a>');
    assert.equal(text, 'Hi\nSee it (https://beamr.com)');
  });
});

describe('identity + tokens', () => {
  test('normalises email for matching and hashing', () => {
    assert.equal(normalizeEmail('  Dor@Beamr.COM '), 'dor@beamr.com');
    assert.equal(normalizeEmail('not-an-email'), null);
    // LinkedIn hashes the lowercased address; this must match byte for byte.
    assert.equal(emailHash('Dor@Beamr.com'), emailHash('dor@beamr.com'));
    assert.match(emailHash('a@b.com'), /^[0-9a-f]{64}$/);
  });

  test('treats free mail as having no company domain', () => {
    assert.equal(emailDomain('dor@beamr.com'), 'beamr.com');
    assert.equal(emailDomain('someone@gmail.com'), null);
  });

  test('signed tokens survive round-trip and reject tampering', () => {
    const token = signToken({ c: 'ct_1', s: 'sd_1' });
    assert.deepEqual(verifyToken(token), { c: 'ct_1', s: 'sd_1' });
    assert.equal(verifyToken(token + 'x'), null);
    assert.equal(verifyToken('garbage'), null);
    assert.equal(verifyToken(''), null);
  });

  test('dissects LinkedIn ad-click parameters off a landing URL', () => {
    const p = dissectUrl('https://beamr.com/cloud?utm_source=linkedin&utm_medium=cpc&li_fat_id=xyz&li_campaign_id=99');
    assert.equal(p.path, '/cloud');
    assert.equal(p.utm_source, 'linkedin');
    assert.equal(p.li_fat_id, 'xyz');
    assert.equal(p.ad_campaign_id, '99');
  });
});

describe('origin allow-list', () => {
  test('accepts the apex domain and its subdomains', () => {
    assert.ok(originAllowed('https://beamr.com', ['beamr.com']));
    assert.ok(originAllowed('http://beamr.com', ['beamr.com']));
    assert.ok(originAllowed('https://www.beamr.com', ['beamr.com']));
    assert.ok(originAllowed('https://cloud.beamr.com', ['https://beamr.com']));
  });

  test('rejects look-alike and suffix-attack domains', () => {
    assert.ok(!originAllowed('https://evil.example', ['beamr.com']));
    assert.ok(!originAllowed('https://notbeamr.com', ['beamr.com']));
    assert.ok(!originAllowed('https://beamr.com.evil.io', ['beamr.com']));
    assert.ok(!originAllowed('', ['beamr.com']));
  });

  test('wildcard allows everything', () => {
    assert.ok(originAllowed('https://anything.example', ['*']));
  });
});

describe('router', () => {
  test('extracts named params and refuses the wrong method', () => {
    const r = new Router();
    r.get('/api/contacts/:id', () => {});
    r.get('/t/o/:token.gif', () => {});
    assert.equal(r.match('GET', '/api/contacts/ct_9')?.params.id, 'ct_9');
    assert.equal(r.match('GET', '/t/o/abc.gif')?.params.token, 'abc');
    assert.equal(r.match('POST', '/api/contacts/ct_9'), null);
    assert.equal(r.match('GET', '/nope'), null);
  });
});

describe('mime', () => {
  test('quoted-printable encodes 8-bit and protects trailing space', () => {
    assert.equal(quotedPrintable('für'), 'f=C3=BCr');
    assert.ok(quotedPrintable('a \r\nb').includes('=20'));
  });

  test('encodes non-ASCII headers as RFC 2047 words', () => {
    assert.equal(encodeHeader('plain ascii'), 'plain ascii');
    assert.match(encodeHeader('Größe'), /^=\?UTF-8\?B\?.+\?=$/);
  });

  test('builds a multipart message with one-click unsubscribe headers', () => {
    const { raw } = buildMessage({
      from: 'marketing@beamr.com', fromName: 'Beamr', to: 'a@b.com',
      subject: 'Hi', html: '<p>Hi</p>', text: 'Hi',
      unsubscribeUrl: 'https://abm.beamr.com/u/tok',
    });
    assert.ok(raw.includes('List-Unsubscribe: <https://abm.beamr.com/u/tok>'));
    assert.ok(raw.includes('List-Unsubscribe-Post: List-Unsubscribe=One-Click'));
    assert.ok(raw.includes('multipart/alternative'));
    assert.ok(raw.includes('text/plain') && raw.includes('text/html'));
  });
});

describe('contacts', () => {
  test('creates, dedupes on email and derives title facets', () => {
    const a = contacts.upsertContact({ email: 'Maya@Disney.com', first_name: 'Maya', job_title: 'VP of Video Engineering' });
    assert.equal(a.created, true);
    assert.equal(a.contact.email, 'maya@disney.com');
    assert.equal(a.contact.seniority, 'vp');
    assert.equal(a.contact.function, 'engineering');
    assert.equal(a.contact.domain, 'disney.com');

    const b = contacts.upsertContact({ email: 'maya@disney.com', country: 'United States' });
    assert.equal(b.created, false);
    assert.equal(b.contact.id, a.contact.id);
    assert.equal(b.contact.country, 'United States');
    assert.equal(b.contact.first_name, 'Maya', 'existing values must survive a partial update');
  });

  test('does not overwrite a filled field unless asked', () => {
    contacts.upsertContact({ email: 'ov@test.com', company: 'Old Co' });
    contacts.upsertContact({ email: 'ov@test.com', company: 'New Co' });
    assert.equal(contacts.findByEmail('ov@test.com').company, 'Old Co');
    contacts.upsertContact({ email: 'ov@test.com', company: 'New Co' }, { overwrite: true });
    assert.equal(contacts.findByEmail('ov@test.com').company, 'New Co');
  });

  test('rejects an invalid email', () => {
    assert.throws(() => contacts.upsertContact({ email: 'nope' }), /Invalid email/);
  });

  test('imports CSV, reporting bad rows instead of failing the batch', () => {
    const list = contacts.createList({ name: 'Import target' });
    const report = contacts.importCsv(
      'email,first name,company,title\nnoa@wix.com,Noa,Wix,CTO\nbroken,X,Y,Z\nnoa@wix.com,Noa,Wix,CTO\n',
      { listId: list.id },
    );
    assert.equal(report.created, 1);
    assert.equal(report.skipped, 2, 'one invalid + one duplicate within the file');
    assert.equal(report.invalid[0].reason, 'invalid email');
    assert.equal(contacts.listMemberCount(list.id), 1);
  });

  test('dry-run import previews without writing', () => {
    const before = get('SELECT COUNT(*) AS n FROM contacts').n;
    const report = contacts.importCsv('email\ndryrun@test.com\n', { dryRun: true });
    assert.equal(report.dryRun, true);
    assert.equal(get('SELECT COUNT(*) AS n FROM contacts').n, before);
  });
});

describe('segments', () => {
  test('filters on attributes with in / not_in', () => {
    const n = segments.countSegment({ rules: { field: 'seniority', operator: 'in', value: ['vp'] } });
    assert.ok(n >= 1);
    const none = segments.countSegment({ rules: { field: 'seniority', operator: 'in', value: [] } });
    assert.equal(none, 0);
  });

  test('combines rules with and / or', () => {
    const and = segments.countSegment({ rules: { op: 'and', rules: [
      { field: 'seniority', operator: 'eq', value: 'vp' },
      { field: 'domain', operator: 'contains', value: 'disney' },
    ] } });
    const or = segments.countSegment({ rules: { op: 'or', rules: [
      { field: 'seniority', operator: 'eq', value: 'vp' },
      { field: 'seniority', operator: 'eq', value: 'cxo' },
    ] } });
    assert.equal(and, 1);
    assert.ok(or >= and);
  });

  test('supports behavioural and parameterised fields', () => {
    const c = contacts.upsertContact({ email: 'behave@test.com', job_title: 'Director' }).contact;
    events.recordEvent({ contact_id: c.id, channel: 'web', type: 'page_view', url: 'https://beamr.com/pricing', path: '/pricing' });
    assert.equal(segments.countSegment({ rules: { field: 'page_views_30d', operator: 'gte', value: 1 },
      extraWhere: 'contacts.id = ?', extraArgs: [c.id] }), 1);
    assert.equal(segments.countSegment({ rules: { field: 'visited_path(/pricing)', operator: 'gte', value: 1 },
      extraWhere: 'contacts.id = ?', extraArgs: [c.id] }), 1);
    assert.equal(segments.countSegment({ rules: { field: 'visited_path(/nowhere)', operator: 'gte', value: 1 },
      extraWhere: 'contacts.id = ?', extraArgs: [c.id] }), 0);
  });

  test('rejects unknown fields and operators rather than silently matching all', () => {
    assert.throws(() => segments.countSegment({ rules: { field: 'drop_table', operator: 'eq', value: 1 } }), /Unknown segment field/);
    assert.throws(() => segments.countSegment({ rules: { field: 'email', operator: 'pwn', value: 1 } }), /Unknown segment operator/);
  });

  test('mailable excludes unsubscribed and suppressed contacts', () => {
    const c = contacts.upsertContact({ email: 'optout@test.com' }).contact;
    const before = segments.countSegment({ mailable: true, extraWhere: 'contacts.id = ?', extraArgs: [c.id] });
    assert.equal(before, 1);
    run("UPDATE contacts SET status = 'unsubscribed', consent_email = 0 WHERE id = ?", c.id);
    assert.equal(segments.countSegment({ mailable: true, extraWhere: 'contacts.id = ?', extraArgs: [c.id] }), 0);
  });

  test('ad_targetable respects ad consent independently of email consent', () => {
    const c = contacts.upsertContact({ email: 'adopt@test.com' }).contact;
    run('UPDATE contacts SET consent_ads = 0 WHERE id = ?', c.id);
    assert.equal(segments.countSegment({ adTargetable: true, extraWhere: 'contacts.id = ?', extraArgs: [c.id] }), 0);
  });
});

describe('identity resolution', () => {
  test('back-fills an anonymous session onto the contact on identify', () => {
    const c = contacts.upsertContact({ email: 'stitch@test.com', job_title: 'CTO' }).contact;
    events.ensureVisitor('vis-stitch-0001', { user_agent: 'test' });
    events.recordEvent({ visitor_id: 'vis-stitch-0001', channel: 'web', type: 'page_view', url: 'https://beamr.com/pricing', path: '/pricing' });
    events.recordEvent({ visitor_id: 'vis-stitch-0001', channel: 'web', type: 'page_view', url: 'https://beamr.com/cloud', path: '/cloud' });
    assert.equal(events.timeline(c.id).length, 0);

    const result = events.identifyVisitor('vis-stitch-0001', c.id);
    assert.equal(result.linked, 2);
    assert.equal(events.timeline(c.id).length, 2);
  });

  test('a second identify for the same pair is a no-op', () => {
    const c = contacts.findByEmail('stitch@test.com');
    assert.equal(events.identifyVisitor('vis-stitch-0001', c.id).already, true);
  });

  test('collector rejects event types that are not on the allow-list', () => {
    const r = tracking.ingestBatch({ events: [
      { vid: 'vis-allow-0001', type: 'page_view', url: 'https://beamr.com/' },
      { vid: 'vis-allow-0001', type: 'DROP TABLE contacts', url: 'https://beamr.com/' },
      { vid: 'bad', type: 'page_view' },
    ] }, {});
    assert.equal(r.accepted, 1);
    assert.equal(r.rejected, 2);
  });

  test('a LinkedIn ad landing creates a contact-level ad_click', () => {
    const c = contacts.upsertContact({ email: 'adland@test.com' }).contact;
    events.ensureVisitor('vis-ad-0001', {});
    events.identifyVisitor('vis-ad-0001', c.id);
    tracking.ingestBatch({ events: [{
      vid: 'vis-ad-0001', type: 'page_view',
      url: 'https://beamr.com/cloud?utm_source=linkedin&utm_medium=cpc&li_fat_id=zz&li_campaign_id=7011',
    }] }, {});
    const adClick = events.timeline(c.id).find((e) => e.type === 'ad_click');
    assert.ok(adClick, 'ad click should be recorded');
    assert.equal(adClick.ad_campaign_id, '7011');
    assert.equal(adClick.channel, 'linkedin');
  });

  test('a form submit with an email creates and identifies an inbound contact', () => {
    tracking.ingestBatch({ events: [{
      vid: 'vis-form-0001', type: 'form_submit', url: 'https://beamr.com/demo',
      email: 'inbound@newco.com', meta: { fields: { company: 'NewCo' } },
    }] }, {});
    const c = contacts.findByEmail('inbound@newco.com');
    assert.ok(c);
    assert.equal(c.source, 'website_form');
    assert.equal(c.lifecycle_stage, 'engaged');
  });
});

describe('scoring', () => {
  test('high-intent pages are worth more than a blog read', () => {
    assert.ok(scoring.scoreEvent('page_view', { path: '/pricing' }) > scoring.scoreEvent('page_view', { path: '/blog/post' }));
    assert.ok(scoring.scoreEvent('demo_request') > scoring.scoreEvent('email_open'));
    assert.ok(scoring.scoreEvent('email_unsubscribe') < 0);
  });

  test('fit rewards seniority and penalises a personal address', () => {
    const senior = scoring.fitScore({ seniority: 'cxo', function: 'engineering', domain: 'disney.com', industry: 'Media & Entertainment' });
    const junior = scoring.fitScore({ seniority: 'ic', function: 'sales', domain: null });
    assert.ok(senior > junior);
  });

  test('intent decays with age', () => {
    const c = contacts.upsertContact({ email: 'decay@test.com' }).contact;
    events.recordEvent({ contact_id: c.id, channel: 'web', type: 'demo_request', occurred_at: new Date().toISOString() });
    const fresh = scoring.intentScore(c.id);

    const old = contacts.upsertContact({ email: 'decay2@test.com' }).contact;
    events.recordEvent({
      contact_id: old.id, channel: 'web', type: 'demo_request',
      occurred_at: new Date(Date.now() - 120 * 86400000).toISOString(),
    });
    assert.ok(scoring.intentScore(old.id) < fresh, 'a 120-day-old signal must be worth less than a fresh one');
  });

  test('grades band the score and scores stay within 0-100', () => {
    assert.equal(scoring.gradeFor(95), 'A');
    assert.equal(scoring.gradeFor(50), 'B');
    assert.equal(scoring.gradeFor(25), 'C');
    assert.equal(scoring.gradeFor(2), 'D');
    for (const row of ['decay@test.com', 'stitch@test.com'].map(contacts.findByEmail)) {
      const s = scoring.recomputeScore(row.id);
      assert.ok(s.score >= 0 && s.score <= 100);
    }
  });

  test('crossing the hot threshold raises exactly one alert', () => {
    const c = contacts.upsertContact({ email: 'hot@disney.com', job_title: 'Chief Technology Officer', industry: 'Media & Entertainment' }).contact;
    for (let i = 0; i < 6; i++) {
      events.recordEvent({ contact_id: c.id, channel: 'web', type: 'demo_request' });
    }
    scoring.recomputeScore(c.id);
    const alerts = get("SELECT COUNT(*) AS n FROM alerts WHERE contact_id = ? AND kind = 'hot_contact'", c.id).n;
    assert.equal(alerts, 1);
  });
});

describe('email campaigns', () => {
  test('personalises per recipient and rewrites links for tracking', async () => {
    const list = contacts.createList({ name: 'Campaign list' });
    const a = contacts.upsertContact({ email: 'send1@disney.com', first_name: 'Ada', company: 'Disney' }).contact;
    const b = contacts.upsertContact({ email: 'send2@disney.com', company: 'Disney' }).contact;
    contacts.addToList(list.id, a.id);
    contacts.addToList(list.id, b.id);

    const tpl = campaigns.createTemplate({
      name: 'Test template',
      subject: '{{ first_name | fallback: "Hi" }}, about {{ company }}',
      html: '<p>Hi {{ first_name | fallback: "there" }}</p><a href="https://beamr.com/pricing">Pricing</a>',
    });
    const cp = campaigns.createCampaign({ name: 'Test campaign', template_id: tpl.id, list_id: list.id });

    const renderedA = campaigns.renderFor(cp, a);
    const renderedB = campaigns.renderFor(cp, b);
    assert.equal(renderedA.subject, 'Ada, about Disney');
    assert.equal(renderedB.subject, 'Hi, about Disney', 'fallback must fire for the missing name');
    assert.ok(renderedA.html.includes('/t/c/'), 'links must route through the click tracker');
    assert.ok(renderedA.html.includes('/t/o/'), 'the open beacon must be present');
    assert.ok(renderedA.html.includes('/u/'), 'the unsubscribe link must be present');
    assert.ok(renderedA.text.length > 0, 'a plain-text alternative is required');
  });

  test('preflight surfaces blank merge tags before sending', () => {
    const cp = get("SELECT id FROM campaigns WHERE name = 'Test campaign'");
    const pf = campaigns.preflight(cp.id);
    assert.equal(pf.recipients, 2);
    assert.equal(pf.missing_values.first_name, 1);
    assert.ok(pf.warnings.some((w) => w.includes('first_name')));
  });

  test('queue, send and stats round-trip', async () => {
    const cp = get("SELECT id FROM campaigns WHERE name = 'Test campaign'");
    const queued = campaigns.queueCampaign(cp.id);
    assert.equal(queued.queued, 2);
    const result = await campaigns.processQueue({ max: 10 });
    assert.equal(result.sent, 2);
    assert.equal(campaigns.campaignStats(cp.id).stats.sent, 2);
    assert.equal(campaigns.getCampaign(cp.id).status, 'sent');
  });

  test('queueing is idempotent — a second call adds nobody', () => {
    const cp = get("SELECT id FROM campaigns WHERE name = 'Test campaign'");
    run("UPDATE campaigns SET status = 'draft' WHERE id = ?", cp.id);
    assert.equal(campaigns.queueCampaign(cp.id).queued, 0);
  });

  test('open and click are attributed to one contact, and dedupe within the minute', () => {
    const send = get("SELECT * FROM sends WHERE status = 'sent' LIMIT 1");
    emailTracking.handleOpen(send.token, {});
    emailTracking.handleOpen(send.token, {});
    const opens = get("SELECT COUNT(*) AS n FROM events WHERE type = 'email_open' AND contact_id = ?", send.contact_id).n;
    assert.equal(opens, 1, 'a re-fetched beacon must not double-count within the same minute');

    const link = get('SELECT * FROM email_links LIMIT 1');
    const click = emailTracking.handleClick(send.token, link.id, {});
    assert.equal(click.ok, true);
    assert.ok(click.url.includes('bmr_c='), 'a click to a tracked domain must carry the identity token');
  });

  test('an external link is not stamped with the identity token', () => {
    const cp = get("SELECT id FROM campaigns WHERE name = 'Test campaign'");
    run('INSERT INTO email_links (id, campaign_id, url) VALUES (?,?,?)', 'lk_ext', cp.id, 'https://linkedin.com/company/beamr');
    const send = get("SELECT * FROM sends WHERE status = 'sent' LIMIT 1");
    const click = emailTracking.handleClick(send.token, 'lk_ext', {});
    assert.equal(click.url, 'https://linkedin.com/company/beamr');
  });

  test('unsubscribe suppresses the contact everywhere', () => {
    const send = get("SELECT * FROM sends WHERE status = 'sent' LIMIT 1");
    const r = emailTracking.handleUnsubscribe(send.token, { source: 'test' });
    assert.equal(r.ok, true);
    const c = get('SELECT * FROM contacts WHERE id = ?', send.contact_id);
    assert.equal(c.status, 'unsubscribed');
    assert.equal(c.consent_email, 0);
    assert.ok(get('SELECT email FROM suppressions WHERE email = ?', c.email));
    assert.equal(segments.countSegment({ mailable: true, extraWhere: 'contacts.id = ?', extraArgs: [c.id] }), 0);
  });

  test('an invalid tracking token is rejected, not silently accepted', () => {
    assert.equal(emailTracking.handleOpen('garbage', {}).ok, false);
    assert.equal(emailTracking.handleUnsubscribe('garbage', {}).ok, false);
  });
});

describe('linkedin audiences', () => {
  test('only ad-consented contacts are resolved into an audience', async () => {
    const list = contacts.createList({ name: 'Audience list' });
    const ids = [];
    for (let i = 0; i < 4; i++) {
      const c = contacts.upsertContact({ email: `aud${i}@sky.uk`, job_title: 'VP Engineering' }).contact;
      contacts.addToList(list.id, c.id);
      ids.push(c.id);
    }
    run('UPDATE contacts SET consent_ads = 0 WHERE id = ?', ids[3]);

    const audience = audiences.createAudience({ name: 'Test audience', list_id: list.id });
    const resolved = audiences.resolveMembers(audiences.getAudience(audience.id));
    assert.equal(resolved.length, 3, 'the opted-out contact must not be targetable');

    const result = await audiences.syncAudience(audience.id);
    assert.equal(result.added, 3);
    assert.equal(result.dry_run, true, 'no credentials configured, so nothing is pushed');
    assert.ok(result.warnings.some((w) => w.includes('300')), 'a below-minimum audience must warn');
  });

  test('a contact leaving the segment is removed on the next sync', async () => {
    const audience = get("SELECT id FROM li_audiences WHERE name = 'Test audience'");
    const member = get("SELECT contact_id FROM li_audience_members WHERE audience_id = ? AND state = 'pushed' LIMIT 1", audience.id);
    run('UPDATE contacts SET consent_ads = 0 WHERE id = ?', member.contact_id);
    const result = await audiences.syncAudience(audience.id);
    assert.equal(result.removed, 1);
    assert.equal(get('SELECT state FROM li_audience_members WHERE audience_id = ? AND contact_id = ?',
      audience.id, member.contact_id).state, 'removed');
  });

  test('audience membership pushes a person-level event', () => {
    const audience = get("SELECT id FROM li_audiences WHERE name = 'Test audience'");
    const member = get("SELECT contact_id FROM li_audience_members WHERE audience_id = ? LIMIT 1", audience.id);
    const ev = get("SELECT * FROM events WHERE contact_id = ? AND type = 'audience_added'", member.contact_id);
    assert.ok(ev, 'being targeted is itself a tracked event');
  });
});

describe('transactions', () => {
  test('nested transactions work and the inner failure rolls back cleanly', () => {
    const before = get('SELECT COUNT(*) AS n FROM contacts').n;
    assert.throws(() => {
      tx(() => {
        contacts.upsertContact({ email: 'tx-outer@test.com' });
        tx(() => { throw new Error('inner boom'); });
      });
    }, /inner boom/);
    assert.equal(get('SELECT COUNT(*) AS n FROM contacts').n, before, 'the outer write must roll back too');

    // The connection must still be usable after the rollback.
    tx(() => contacts.upsertContact({ email: 'tx-after@test.com' }));
    assert.ok(contacts.findByEmail('tx-after@test.com'));
  });
});
