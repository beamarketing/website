# Beamr — Contact-Based Marketing Engine

A self-hosted engine for running **contact-based marketing against a dedicated list**:
personal advertising on **LinkedIn and Meta (Facebook & Instagram)**, personalised email,
first-party website tracking, and ad-engagement attribution — all keyed on the individual
contact rather than on anonymous traffic.

Node 22+, **zero npm dependencies**, SQLite on disk. `npm start` and it runs.

```bash
cd platform
cp .env.example .env      # optional — sensible defaults work out of the box
npm run seed              # demo data: 1,200 contacts, 4 audiences, 7 cohorts, both platforms
npm start                 # console at http://localhost:4000
```

The first boot prints an admin token. Paste it into the console login.

---

## What it actually does

| Capability | How it works |
|---|---|
| **Dedicated list** | CSV import with automatic column mapping and dedupe on email; static lists and dynamic rule-driven segments. |
| **Personal advertising, two platforms** | Mirrors one list into a LinkedIn **matched audience** (DMP segment) and a Meta **custom audience** at once, diffing additions and removals on every sync. LinkedIn matches on hashed email; Meta matches on up to nine keys. |
| **Contact-level ad attribution** | **Cohorts** split an audience into the smallest slices each platform will serve, each with its own audience, creative and tracking URL — so reporting resolves to a handful of named people instead of one campaign total. |
| **Meta Conversions API** | Forwards first-party website events server-side with hashed identity, so Meta learns that a *named targeted contact* converted even when the browser pixel is blocked. |
| **Email marketing** | Merge-tag templates, per-contact personalisation, throttled sending, open/click tracking, one-click unsubscribe, a preference centre and global suppression. |
| **Website tracking** | A first-party script that records page views (including SPA routes), scroll depth, time on page, downloads, outbound clicks and form submissions — then resolves the browser to a known contact. |
| **Ad engagement** | Daily campaign metrics from both platforms, plus the three *person-level* ad signals: audience membership, lead-form responses, and ad clicks landing on your tracked site. |
| **Scoring** | Fit (title, seniority, industry) + intent (behaviour, exponentially decayed) → 0–100 and an A–D grade. |
| **Automation** | Journeys: a trigger, a condition, and cross-channel actions — send an email, add to an audience, move the lifecycle stage, alert sales, call a webhook. |

---

## The idea it is built around

Ordinary marketing analytics counts impressions and sessions. Contact-based
marketing has to answer a different question: **did the specific people we chose
to target actually engage?**

Everything here follows from that:

- One **event stream** across web, email and LinkedIn, every row keyed to a contact.
- **Identity resolution** runs backwards. When someone clicks an email link or fills
  a form, every anonymous page view already recorded for that browser is
  retroactively attributed to them — including the pricing page they read *before*
  you knew who they were.
- Reporting is stated in **distinct contacts**, not impressions. The funnel is
  targeted → mailed → engaged → visited → high intent → MQL.

### How contact-level ad attribution actually works

**Neither platform reports impressions per member.** There is no API on LinkedIn or
Meta that says "Maya saw this creative three times." Both report per *ad object* —
campaign, ad set, ad — and that is all any tool can get, including the vendors whose
marketing implies otherwise.

So the way to get person-level numbers is not to ask the platform for them. It is to
**make the ad object small enough that its ordinary aggregate report is already
person-resolved.** That is what cohorts do here:

1. An audience is split into slices at the smallest size the platform will still serve.
2. Each cohort gets its own platform audience, its own creative, and its own tracking URL.
3. The platform's per-ad reporting then reads out as *"these N named people saw it this
   many times."*

What this buys you, stated precisely:

| | Resolves to | Why |
|---|---|---|
| **Clicks** | **The individual** | Each cohort's landing URL carries a signed token; the site tracker identifies the visitor. |
| **Impressions** | **The cohort, never one person** | The platform's serving floor is a hard limit — 300 matched members on LinkedIn, ~100 on Meta. |

Meta's lower floor is why it gives roughly **3× tighter attribution** than LinkedIn for
the same list, at a fraction of the cost per click. Run both: LinkedIn reaches these
people in a work context, Meta reaches the same people far more cheaply in a personal
one, and the contact record is what ties the two together.

The console states the precision for every audience — "1 of 157" rather than a vague
claim — and never reports a cohort impression as an individual one.

## Setup

### 1. Install the website tracker

Copy the snippet from **Setup & tracking** in the console into the `<head>` of every
page on beamr.com:

```html
<script>
  window.beamr = window.beamr || function () { (window.beamr.q = window.beamr.q || []).push(arguments); };
</script>
<script async src="https://abm.beamr.com/t/beamr.js" data-beamr-host="https://abm.beamr.com"></script>
```

Set `TRACKING_ORIGINS=beamr.com` so the collector accepts your domain and its
subdomains and rejects everything else.

Optional attributes: `data-require-consent="true"` (gate behind your CMP —
then call `beamr('consent', true)` on accept), `data-respect-dnt="true"`,
`data-track-forms="false"`.

Manual API:

```js
beamr('identify', 'maya@disney.com', { first_name: 'Maya' });
beamr('track', 'demo_request', { plan: 'cloud' });
beamr('page');            // for custom routers
beamr('reset');           // forget this browser, e.g. on logout
```

Passwords, hidden inputs and anything matching `card|cvv|ssn|token|secret` are
never collected from forms.

### 2. Connect email

```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=marketing@beamr.com
SMTP_PASS=<app password>
EMAIL_FROM=marketing@beamr.com
EMAIL_POSTAL_ADDRESS=Beamr Imaging Ltd., Herzliya, Israel
```

`resend` and `sendgrid` are drop-in alternatives — set the provider and its API key.
Leaving `EMAIL_PROVIDER=console` keeps the whole system live but writes each rendered
message to `data/outbox/*.eml` instead of delivering it, so you can build and review
a campaign end-to-end without mailing anyone.

Deliverability is the relay's job (SPF, DKIM, DMARC). Every message carries
`List-Unsubscribe` and `List-Unsubscribe-Post` so Gmail and Outlook show their native
one-click unsubscribe — without those, bulk mail to consumer mailboxes gets penalised.

**Bounces and complaints:** point your provider's webhook at
`POST /api/email/webhook` (with the admin bearer token). Hard bounces and spam
complaints suppress the address globally.

### 3. Connect LinkedIn

You need a LinkedIn app with **Marketing Developer Platform** access and an OAuth
token carrying these scopes:

| Scope | Needed for |
|---|---|
| `rw_dmp_segments` | creating matched audiences and pushing hashed emails |
| `r_ads` / `rw_ads` | reading ad accounts and campaigns |
| `r_ads_reporting` | daily impressions, clicks, spend |
| `r_marketing_leadgen_automation` | lead-gen form responses |

```bash
LINKEDIN_ACCESS_TOKEN=<token>
LINKEDIN_AD_ACCOUNT_ID=512345678
LINKEDIN_API_VERSION=202506
```

Then **LinkedIn ads → Sync now**, or `npm run sync:linkedin`.

Two things to expect:
- LinkedIn matches roughly 40–70% of a B2B list to real members. The console shows
  pushed vs. matched separately.
- It will not *serve* an audience below about **300 matched members**. Smaller
  audiences sync fine and spend nothing. The sync warns you when you're under.

Point your ad creatives at a URL carrying UTMs — `https://beamr.com/cloud?utm_source=linkedin&utm_medium=cpc`
— so ad clicks become contact-level events when the visitor is identified.

### 4. Connect Meta (Facebook & Instagram)

A Meta app with **Marketing API** access, and a token carrying:

| Permission | Needed for |
|---|---|
| `ads_management` | creating custom audiences and uploading members |
| `ads_read` | campaigns, ad sets, ads and insights |
| `business_management` | resolving the ad account and business |
| `leads_retrieval` | Instant Form (lead ad) responses |

```bash
META_ACCESS_TOKEN=<token>
META_AD_ACCOUNT_ID=9988776655
META_PIXEL_ID=<pixel id>        # for the Conversions API
META_PAGE_ID=<page id>          # to read lead-ad submissions
META_APP_SECRET=<app secret>    # enables appsecret_proof
```

The ad account must have accepted the **Custom Audience terms of service** in Business
Manager, or every audience upload is rejected with a permissions error that does not
mention the ToS.

Two things that differ from LinkedIn and matter:

- **Match keys.** LinkedIn matches on the hashed email alone. Meta matches on up to nine
  keys — email, first name, last name, city, state, zip, country, phone, plus our own
  contact id. Each has its own normalisation rule, and a wrongly normalised key does not
  error, it just silently fails to match. This is handled in
  `src/channels/meta/normalize.js`; the sync warns when your contacts average fewer than
  three usable keys, because email-only matching on B2B contacts is poor (people register
  personal Facebook accounts with personal addresses).
- **Audience size is reported as a range,** deliberately, so advertisers cannot isolate
  individuals. We take the lower bound — under-claiming reach is the safe direction.

### 5. Turn on cohorts

```bash
AD_COHORTS_ENABLED=true
AD_COHORT_OVERSIZE=1.6   # headroom over the floor, for match loss
```

Then either tick "split into cohorts" when creating an audience, or hit **Enable cohorts**
on an existing one. Each cohort's landing URL appears in the audience drawer — put each
one behind its own ad creative, then bind the cohort to that ad so its metrics join up:

```bash
curl -X POST https://abm.beamr.com/api/ads/cohorts/ch_.../link \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H 'content-type: application/json' \
  -d '{"ad_campaign_id":"meta:120210...","creative_id":"120211..."}'
```

Cohorts only do anything once the list is larger than the platform floor. A 200-person
list on LinkedIn is one cohort and no gain; the same list on Meta is two.

---

## Segments

Rules are JSON, compiled to parameterised SQL. Unknown fields and operators are
rejected rather than silently matching everyone.

```json
{ "op": "and", "rules": [
  { "field": "seniority",              "operator": "in",  "value": ["vp", "cxo", "director"] },
  { "field": "industry",               "operator": "contains", "value": "Media" },
  { "field": "visited_path(/pricing)", "operator": "gte", "value": 1 },
  { "field": "days_since_last_event",  "operator": "lte", "value": 30 },
  { "op": "or", "rules": [
    { "field": "email_clicks_30d", "operator": "gte", "value": 1 },
    { "field": "ad_clicks_30d",    "operator": "gte", "value": 1 }
  ]}
]}
```

**Fields** — any contact column, `attrs.<custom>`, and behavioural counters:
`event_count`, `last_event_at`, `page_views_30d`, `page_views_7d`, `sessions_30d`,
`email_opens_30d`, `email_clicks_30d`, `email_clicks_all`, `ad_clicks_30d`,
`ad_engagements_30d`, `linkedin_engagements_30d`, `meta_engagements_30d`,
`form_submits_all`, `web_events_30d`, `days_since_last_event`, `days_since_created`,
`emails_received_30d`, `account_contact_count`.

**Parameterised** — `visited_path(/pricing)`, `visited_path_30d(/demo)`,
`event_count_of(demo_request)`, `clicked_campaign(cp_…)`, `engaged_ad_campaign(7011)`,
`in_list(ls_…)`, `in_audience(au_…)`, `targeted_on(meta)`, `engaged_platform(linkedin)`.

So "VPs we are advertising to on Meta who have not yet visited the site" is one rule:

```json
{ "op": "and", "rules": [
  { "field": "targeted_on(meta)",   "operator": "gte", "value": 1 },
  { "field": "web_events_30d",      "operator": "eq",  "value": 0 }
]}
```

**Operators** — `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `in`, `not_in`, `contains`,
`not_contains`, `starts_with`, `ends_with`, `exists`, `not_exists`, `is_true`,
`is_false`, `within_days`, `not_within_days`, `before`, `after`.

---

## Scoring

```
score = fit + intent          (0–100)
fit    = seniority + function + industry + account signals   (cap 35)
intent = Σ points × 0.5^(age_days / 30)                      (cap 65)
```

The half-life is the point. A contact who read the pricing page four months ago is
not as hot as one who read it yesterday, and a score without decay would claim
otherwise forever. Weights, page boosts, grade thresholds and the half-life are all
editable via `POST /api/settings`.

Grades: **A** ≥ 70, **B** ≥ 45, **C** ≥ 20, **D** below. Crossing 70 raises a
one-time alert.

---

## Journeys

```json
{
  "name": "Pricing visit → case study + retarget",
  "trigger_type": "event",
  "trigger_config": { "event_type": "page_view", "path_contains": "/pricing", "within_hours": 72 },
  "conditions": { "field": "seniority", "operator": "in", "value": ["vp", "cxo", "director"] },
  "actions": [
    { "type": "send_email",      "campaign_id": "cp_…" },
    { "type": "add_to_audience", "audience_id": "au_…", "sync_now": true },
    { "type": "set_lifecycle",   "stage": "mql" },
    { "type": "alert",           "title": "Senior contact read pricing" }
  ],
  "cooldown_hours": 336
}
```

Triggers: `event`, `segment_entry`, `score_threshold`.
Actions: `send_email`, `add_to_list`, `add_to_audience`, `set_lifecycle`, `set_field`,
`alert`, `webhook`, `record_event`.

The cooldown stops a journey re-firing for the same contact. `set_field` is
whitelisted so a journey can never rewrite an id, an email or a consent flag.

---

## API

All `/api/*` routes need `Authorization: Bearer <ADMIN_TOKEN>`.
Tracking (`/t/*`) and the preference centre (`/u/*`) are public by necessity.

```
GET    /api/status                       health, mode, counts
GET    /api/dashboard?days=30            everything the overview renders
GET    /api/contacts?q=&grade=&list_id=  search and filter
POST   /api/contacts                     create or update (single or batch)
GET    /api/contacts/:id                 profile, timeline, score breakdown
DELETE /api/contacts/:id?erase=true      right-to-erasure
POST   /api/contacts/import              CSV import (?dry_run=true to preview)
POST   /api/segments/preview             count + sample + generated SQL
GET    /api/segments/fields              field and operator catalogue
GET    /api/lists · POST /api/lists      static and dynamic lists
POST   /api/lists/:id/members            add by id or by rule
POST   /api/templates · /api/campaigns   email authoring
GET    /api/campaigns/:id/preflight      blank merge tags, links, samples
POST   /api/campaigns/:id/send           queue the whole audience, or one contact
GET    /api/ads/platforms                both platforms, floors, match keys
GET    /api/ads/audiences?platform=meta  matched audiences
POST   /api/ads/audiences                create one; {"mirror":true} creates both
POST   /api/ads/audiences/:id/sync       diff and push
GET    /api/ads/audiences/:id            members, cohorts and precision report
POST   /api/ads/audiences/:id/cohorts    split into servable cohorts
GET    /api/ads/cohorts/:id/members      who an impression could have reached
POST   /api/ads/cohorts/:id/link         bind a cohort to its ad object
POST   /api/ads/cohorts/:id/landing      set the cohort's destination URL
GET    /api/ads/campaigns?days=30        spend beside named contacts
GET    /api/ads/comparison               LinkedIn vs Meta, side by side
GET    /api/ads/influence                targeted → engaged, per audience
POST   /api/ads/sync                     pull campaigns, metrics, lead forms
GET    /api/ads/verify                   test both platforms' credentials
GET    /api/meta/capi                    Conversions API forwarding status
POST   /api/meta/capi/forward            forward pending conversions now
GET    /api/journeys · POST /api/journeys
GET    /api/journeys/:id/preview         who would fire, without firing
GET    /api/events?channel=&identified=  the unified activity stream
POST   /api/events                       server-side ingestion
GET    /api/accounts                     contacts rolled up by domain
POST   /api/jobs/:name/run               run a background job now
```

Server-side events, for things the browser cannot see:

```bash
curl -X POST https://abm.beamr.com/api/events \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H 'content-type: application/json' \
  -d '{"email":"maya@disney.com","type":"signup","value":1,"meta":{"plan":"cloud"}}'
```

---

## CLI

```bash
npm run migrate                              # create/upgrade the database
npm run seed -- --reset                      # demo data
node src/cli.js token                        # print the admin token
npm run import -- --file list.csv --list ls_… [--dry-run]
npm run score                                # recompute all scores
npm run sync:linkedin -- --platform meta     # push audiences (omit --platform for both)
npm run pull:ads -- --days 30                # pull metrics and lead forms, both platforms
node src/cli.js send --campaign cp_…         # queue and flush one campaign
node src/cli.js journeys                     # evaluate journeys once
node src/cli.js stats                        # overview metrics as JSON
npm test                                     # 97 unit tests
```

---

## Background jobs

| Job | Default | Does |
|---|---|---|
| `email_queue` | 15s | drains the send queue, per-campaign throttle |
| `journeys` | 60s | evaluates every enabled journey |
| `scoring` | 1h | recomputes scores so decay actually applies |
| `ad_audiences` | 6h | diffs and pushes matched audiences to every configured platform |
| `ad_insights` | 6h | pulls campaigns, daily metrics and lead forms from both |
| `meta_capi` | 5m | forwards first-party conversions to the Meta Conversions API |
| `dynamic_lists` | 1h | re-materialises rule-driven lists |

Ad jobs are skipped entirely when no platform has credentials, and the Meta CAPI job when no pixel is set. Every job is
idempotent and never overlaps itself.

---

## Upgrading from the LinkedIn-only version

Just start it. Migrations run on open, in order: existing `li_audiences` /
`li_audience_members` are lifted into the platform-agnostic `ad_audiences` /
`ad_audience_members`, a `platform` column is added everywhere it is now needed, events on
`channel = 'linkedin'` become `channel = 'ads'` with `platform = 'linkedin'`, and the
legacy tables are dropped once their data is safely across. Migrating twice is a no-op.

Nothing about your existing LinkedIn setup changes — same audiences, same ids, same
history. Meta is additive.

## Deploying

```bash
docker compose up -d --build
```

`./data` is a bind mount holding the SQLite file — the only thing worth backing up.

Behind a reverse proxy, forward `X-Forwarded-For` (IPs are hashed, never stored raw)
and terminate TLS. `PUBLIC_URL` must be the externally reachable https origin, since
every unsubscribe and click link in every inbox is built from it.

Without Docker: `NODE_ENV=production node --no-warnings src/index.js` behind systemd.

---

## Privacy and compliance

- **Consent is split.** `consent_email` and `consent_ads` are separate, so someone
  can keep the newsletter and opt out of being advertised to. Turning off ad consent
  removes them from every matched audience on the next sync.
- **Suppression is global** and outlives any single list. Unsubscribes, hard bounces
  and complaints are checked again at send time, not just at queue time.
- **No raw IPs.** Only a salted hash, used for de-duplication.
- **No third-party requests.** The tracker talks only to your own server.
- **Erasure**: `DELETE /api/contacts/:id?erase=true` removes the contact and every
  event, send and audience membership, then suppresses the address so an import
  cannot resurrect them.
- **Hashing matches each platform's spec.** LinkedIn: trimmed, lowercased, SHA-256 email.
  Meta: nine keys, each with its own normalisation rule. Plain-text addresses are never
  sent to either platform. `META_CAPI_CLIENT_CONTEXT=false` withholds IP and user agent
  from the Conversions API.
- **Withdrawing ad consent removes the contact from every audience on every platform**
  on the next sync, and stops any server-side conversion forwarding for them.

Consent capture itself is your responsibility — this stores and honours a decision,
it does not prove one was made. For GDPR, legitimate interest for B2B contact
marketing needs a documented balancing test.

---

## Layout

```
platform/
  src/
    index.js              server + scheduler entrypoint
    cli.js                operational commands
    config.js             env config, dry-run detection
    db/  schema.sql, migrations.js (forward-only, versioned), index.js, seed.js
    lib/ util, csv, template, http, logger
    core/
      contacts.js         CRUD, CSV import, lists, accounts
      segments.js         JSON rules → parameterised SQL
      events.js           unified event stream + identity resolution
      tracking.js         collector ingestion
      scoring.js          fit + decayed intent
      journeys.js         trigger → condition → actions
      analytics.js        overview, funnel, influence
    channels/
      email/    mime.js, provider.js, providers/{smtp,resend,sendgrid,console}.js,
                tracking.js (opens, clicks, unsubscribe), campaigns.js
      linkedin/ client.js (versioned REST API)
      meta/     client.js (Graph API), normalize.js (nine match keys), capi.js (Conversions API)
      ads/      adapters.js (one interface, two platforms), audiences.js (sync + diff),
                cohorts.js (contact-level attribution), insights.js (cross-platform reporting)
    jobs/scheduler.js
    web/  server.js, routes/{api,track}.js, public/{index.html,app.js,beamr.js}
  test/  unit.test.js, ads.test.js, migration.test.js
```
