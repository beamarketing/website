# Beamr — Contact-Based Marketing Engine

A self-hosted engine for running **contact-based marketing against a dedicated list**:
personal advertising on LinkedIn, personalised email, first-party website tracking,
and ad-engagement attribution — all keyed on the individual contact rather than on
anonymous traffic.

Node 22+, **zero npm dependencies**, SQLite on disk. `npm start` and it runs.

```bash
cd platform
cp .env.example .env      # optional — sensible defaults work out of the box
npm run seed              # realistic demo data (26 contacts, 288 events, 2 audiences)
npm start                 # console at http://localhost:4000
```

The first boot prints an admin token. Paste it into the console login.

---

## What it actually does

| Capability | How it works |
|---|---|
| **Dedicated list** | CSV import with automatic column mapping and dedupe on email; static lists and dynamic rule-driven segments. |
| **Personal LinkedIn advertising** | Mirrors a list or segment into a LinkedIn **matched audience** (DMP segment) as SHA-256 hashed emails, diffing additions and removals on every sync. |
| **Email marketing** | Merge-tag templates, per-contact personalisation, throttled sending, open/click tracking, one-click unsubscribe, a preference centre and global suppression. |
| **Website tracking** | A first-party script that records page views (including SPA routes), scroll depth, time on page, downloads, outbound clicks and form submissions — then resolves the browser to a known contact. |
| **Ad engagement** | Daily LinkedIn campaign metrics, plus the three *person-level* ad signals: audience membership, lead-gen form responses, and ad clicks landing on your tracked site. |
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

### One honest limitation, stated up front

**LinkedIn does not expose member-level ad engagement.** There is no API that says
"Maya saw this creative three times." Impressions, clicks and spend come back
aggregated per campaign per day, and that is all any tool can get.

So contact-level ad engagement here is assembled from the three signals that *are*
person-level:

1. **Audience membership** — who you targeted (you control this list, so you know it).
2. **Lead-gen form responses** — pulled from the API with the member's real email.
3. **Ad clicks that land on your site** — LinkedIn stamps `li_fat_id` and your UTMs
   on the landing URL; the tracker turns that arrival into an `ad_click` event on
   the contact once they're identified.

The console shows aggregate spend *beside* the contacts you can actually name, and
labels the difference. Any tool claiming per-person LinkedIn impressions is inferring,
not measuring.

---

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
`ad_engagements_30d`, `form_submits_all`, `web_events_30d`, `days_since_last_event`,
`days_since_created`, `emails_received_30d`, `account_contact_count`.

**Parameterised** — `visited_path(/pricing)`, `visited_path_30d(/demo)`,
`event_count_of(demo_request)`, `clicked_campaign(cp_…)`, `engaged_ad_campaign(7011)`,
`in_list(ls_…)`, `in_audience(au_…)`.

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
GET    /api/linkedin/audiences           matched audiences
POST   /api/linkedin/audiences/:id/sync  diff and push
GET    /api/linkedin/campaigns?days=30   spend beside named contacts
GET    /api/linkedin/influence           targeted → engaged, per audience
POST   /api/linkedin/sync                pull campaigns, metrics, lead forms
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
npm run sync:linkedin                        # push matched audiences
npm run pull:ads -- --days 30                # pull metrics and lead forms
node src/cli.js send --campaign cp_…         # queue and flush one campaign
node src/cli.js journeys                     # evaluate journeys once
node src/cli.js stats                        # overview metrics as JSON
npm test                                     # 56 unit tests
```

---

## Background jobs

| Job | Default | Does |
|---|---|---|
| `email_queue` | 15s | drains the send queue, per-campaign throttle |
| `journeys` | 60s | evaluates every enabled journey |
| `scoring` | 1h | recomputes scores so decay actually applies |
| `linkedin_audiences` | 6h | diffs and pushes matched audiences |
| `linkedin_ads` | 6h | pulls campaigns, daily metrics, lead-form responses |
| `dynamic_lists` | 1h | re-materialises rule-driven lists |

LinkedIn jobs are skipped entirely when no credentials are set. Every job is
idempotent and never overlaps itself.

---

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
- **Hashing matches LinkedIn's spec**: trimmed, lowercased, SHA-256. Plain-text
  addresses are never sent to LinkedIn.

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
    db/  schema.sql, index.js (re-entrant transactions), seed.js
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
      linkedin/ client.js (REST), audiences.js (matched audiences), insights.js (metrics, leads)
    jobs/scheduler.js
    web/  server.js, routes/{api,track}.js, public/{index.html,app.js,beamr.js}
  test/unit.test.js
```
