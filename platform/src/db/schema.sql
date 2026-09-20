-- ============================================================================
-- Beamr contact-based marketing engine — schema
-- Every table is keyed on the contact. The contact is the unit of targeting,
-- the unit of measurement and the unit of attribution.
-- ============================================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------- contacts --
CREATE TABLE IF NOT EXISTS contacts (
  id                TEXT PRIMARY KEY,
  email             TEXT NOT NULL UNIQUE,      -- normalised: trimmed + lowercased
  email_sha256      TEXT NOT NULL,             -- for LinkedIn matched audiences
  first_name        TEXT,
  last_name         TEXT,
  company           TEXT,
  domain            TEXT,                      -- company domain, derived from email
  job_title         TEXT,
  seniority         TEXT,                      -- ic | manager | director | vp | cxo
  function          TEXT,                      -- engineering | product | marketing | ...
  linkedin_url      TEXT,
  country           TEXT,
  industry          TEXT,
  company_size      TEXT,
  phone             TEXT,
  lifecycle_stage   TEXT NOT NULL DEFAULT 'target',  -- target|engaged|mql|sql|opportunity|customer
  owner             TEXT,                      -- sales owner email
  source            TEXT,                      -- import:<file> | form | api | linkedin_lead_form
  status            TEXT NOT NULL DEFAULT 'active',  -- active|unsubscribed|bounced|complained|suppressed
  consent_email     INTEGER NOT NULL DEFAULT 1,
  consent_ads       INTEGER NOT NULL DEFAULT 1,
  score             INTEGER NOT NULL DEFAULT 0,
  grade             TEXT NOT NULL DEFAULT 'D', -- A|B|C|D computed from score
  attrs             TEXT NOT NULL DEFAULT '{}',-- arbitrary JSON custom fields
  first_seen_at     TEXT,
  last_seen_at      TEXT,
  last_scored_at    TEXT,
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_contacts_sha       ON contacts(email_sha256);
CREATE INDEX IF NOT EXISTS idx_contacts_domain    ON contacts(domain);
CREATE INDEX IF NOT EXISTS idx_contacts_status    ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_score     ON contacts(score DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_lifecycle ON contacts(lifecycle_stage);

-- Accounts roll contacts up by company domain (ABM needs the account view).
CREATE TABLE IF NOT EXISTS accounts (
  domain         TEXT PRIMARY KEY,
  name           TEXT,
  industry       TEXT,
  size           TEXT,
  country        TEXT,
  tier           TEXT,                          -- tier1 | tier2 | tier3
  score          INTEGER NOT NULL DEFAULT 0,
  contact_count  INTEGER NOT NULL DEFAULT 0,
  attrs          TEXT NOT NULL DEFAULT '{}',
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL
);

-- ------------------------------------------------------------------- lists --
-- A "list" is either static (explicit membership) or dynamic (rule-evaluated).
CREATE TABLE IF NOT EXISTS lists (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  kind        TEXT NOT NULL DEFAULT 'static',   -- static | dynamic
  rules       TEXT NOT NULL DEFAULT '{}',       -- JSON rule tree for dynamic lists
  is_dedicated INTEGER NOT NULL DEFAULT 0,      -- flags "the dedicated list"
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS list_members (
  list_id    TEXT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  contact_id TEXT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  added_at   TEXT NOT NULL,
  PRIMARY KEY (list_id, contact_id)
);
CREATE INDEX IF NOT EXISTS idx_list_members_contact ON list_members(contact_id);

-- ------------------------------------------------------- identity + events --
-- An anonymous browser becomes a known contact the moment we can resolve it.
CREATE TABLE IF NOT EXISTS visitors (
  id             TEXT PRIMARY KEY,             -- first-party cookie value
  contact_id     TEXT REFERENCES contacts(id) ON DELETE SET NULL,
  first_seen_at  TEXT NOT NULL,
  last_seen_at   TEXT NOT NULL,
  user_agent     TEXT,
  ip_hash        TEXT,                         -- hashed, never raw IP
  first_referrer TEXT,
  first_landing  TEXT,
  first_utm      TEXT,                         -- JSON of the first-touch UTMs
  identified_at  TEXT,
  event_count    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_visitors_contact ON visitors(contact_id);

-- One unified event stream across web, email and LinkedIn.
CREATE TABLE IF NOT EXISTS events (
  id             TEXT PRIMARY KEY,
  contact_id     TEXT REFERENCES contacts(id) ON DELETE CASCADE,
  visitor_id     TEXT,
  channel        TEXT NOT NULL,                -- web | email | linkedin | system
  type           TEXT NOT NULL,                -- page_view | email_open | ad_click | ...
  occurred_at    TEXT NOT NULL,
  url            TEXT,
  path           TEXT,
  title          TEXT,
  referrer       TEXT,
  campaign_id    TEXT,                         -- our email campaign
  platform       TEXT,                         -- linkedin | meta (when channel = 'ads')
  ad_campaign_id TEXT,                         -- namespaced "<platform>:<native id>"
  creative_id    TEXT,
  cohort_id      TEXT,                         -- which cohort's ad drove this
  utm_source     TEXT,
  utm_medium     TEXT,
  utm_campaign   TEXT,
  utm_content    TEXT,
  utm_term       TEXT,
  value          REAL,
  points         INTEGER NOT NULL DEFAULT 0,   -- score contribution at time of event
  meta           TEXT NOT NULL DEFAULT '{}',
  dedupe_key     TEXT UNIQUE                   -- optional idempotency key
);
CREATE INDEX IF NOT EXISTS idx_events_contact  ON events(contact_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_visitor  ON events(visitor_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_type     ON events(type, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_time     ON events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_channel  ON events(channel, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_adcamp   ON events(ad_campaign_id);
CREATE INDEX IF NOT EXISTS idx_events_platform ON events(platform, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_cohort   ON events(cohort_id);

-- -------------------------------------------------------------------- email --
CREATE TABLE IF NOT EXISTS email_templates (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  subject    TEXT NOT NULL,
  preheader  TEXT,
  html       TEXT NOT NULL,
  text       TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS campaigns (
  id                 TEXT PRIMARY KEY,
  name               TEXT NOT NULL,
  template_id        TEXT REFERENCES email_templates(id),
  list_id            TEXT REFERENCES lists(id),
  segment_rules      TEXT NOT NULL DEFAULT '{}', -- extra filter on top of the list
  from_name          TEXT NOT NULL,
  from_email         TEXT NOT NULL,
  reply_to           TEXT,
  status             TEXT NOT NULL DEFAULT 'draft', -- draft|scheduled|sending|paused|sent|cancelled
  scheduled_at       TEXT,
  started_at         TEXT,
  completed_at       TEXT,
  throttle_per_min   INTEGER NOT NULL DEFAULT 60,
  suppress_days      INTEGER NOT NULL DEFAULT 3,  -- don't re-mail a contact within N days
  created_at         TEXT NOT NULL,
  updated_at         TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

-- One row per contact per campaign: the send, and everything that happened to it.
CREATE TABLE IF NOT EXISTS sends (
  id             TEXT PRIMARY KEY,
  campaign_id    TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id     TEXT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  token          TEXT NOT NULL UNIQUE,          -- signs open/click/unsub URLs
  status         TEXT NOT NULL DEFAULT 'queued',-- queued|sent|failed|skipped|bounced
  skip_reason    TEXT,
  subject        TEXT,
  error          TEXT,
  provider_id    TEXT,
  attempts       INTEGER NOT NULL DEFAULT 0,
  queued_at      TEXT NOT NULL,
  sent_at        TEXT,
  opened_at      TEXT,
  first_click_at TEXT,
  open_count     INTEGER NOT NULL DEFAULT 0,
  click_count    INTEGER NOT NULL DEFAULT 0,
  UNIQUE (campaign_id, contact_id)
);
CREATE INDEX IF NOT EXISTS idx_sends_campaign ON sends(campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_sends_contact  ON sends(contact_id);
CREATE INDEX IF NOT EXISTS idx_sends_queue    ON sends(status, queued_at);

-- Every trackable link in a campaign gets a stable id so clicks are attributable.
CREATE TABLE IF NOT EXISTS email_links (
  id          TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  label       TEXT,
  click_count INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_email_links_campaign ON email_links(campaign_id);

-- Global suppression: unsubscribes and hard bounces outlive any single list.
CREATE TABLE IF NOT EXISTS suppressions (
  email      TEXT PRIMARY KEY,
  reason     TEXT NOT NULL,                     -- unsubscribe|bounce|complaint|manual
  source     TEXT,
  created_at TEXT NOT NULL
);

-- ------------------------------------------------------------ advertising --
-- Platform-agnostic. LinkedIn and Meta differ in their minimum audience size,
-- their hashing/normalisation rules and their reporting shape, but the model
-- is the same: a Beamr list is mirrored into the platform as hashed identities.
CREATE TABLE IF NOT EXISTS ad_audiences (
  id             TEXT PRIMARY KEY,
  platform       TEXT NOT NULL DEFAULT 'linkedin',  -- linkedin | meta
  name           TEXT NOT NULL,
  list_id        TEXT REFERENCES lists(id) ON DELETE SET NULL,
  rules          TEXT NOT NULL DEFAULT '{}',
  external_id    TEXT,                          -- dmpSegment urn / custom_audience id
  account_ref    TEXT,
  status         TEXT NOT NULL DEFAULT 'pending', -- pending|syncing|ready|error
  member_count   INTEGER NOT NULL DEFAULT 0,    -- contacts we pushed
  matched_count  INTEGER NOT NULL DEFAULT 0,    -- identities the platform matched
  -- Cohort mode splits the audience into the smallest slices the platform will
  -- serve, so reporting resolves to a handful of named people instead of one
  -- undifferentiated campaign total.
  cohort_mode    INTEGER NOT NULL DEFAULT 0,
  cohort_size    INTEGER,
  last_synced_at TEXT,
  last_error     TEXT,
  auto_sync      INTEGER NOT NULL DEFAULT 1,
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ad_audiences_platform ON ad_audiences(platform, status);

CREATE TABLE IF NOT EXISTS ad_audience_members (
  audience_id TEXT NOT NULL REFERENCES ad_audiences(id) ON DELETE CASCADE,
  contact_id  TEXT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  cohort_id   TEXT,
  state       TEXT NOT NULL DEFAULT 'pending',  -- pending|pushed|removed
  pushed_at   TEXT,
  PRIMARY KEY (audience_id, contact_id)
);
CREATE INDEX IF NOT EXISTS idx_ad_members_state  ON ad_audience_members(audience_id, state);
CREATE INDEX IF NOT EXISTS idx_ad_members_cohort ON ad_audience_members(cohort_id);

-- A cohort is one servable slice of an audience: its own platform audience,
-- its own creative and its own tracking URL. Because the platform reports per
-- ad object, a cohort of N people yields attribution N people wide.
CREATE TABLE IF NOT EXISTS ad_cohorts (
  id             TEXT PRIMARY KEY,
  audience_id    TEXT NOT NULL REFERENCES ad_audiences(id) ON DELETE CASCADE,
  platform       TEXT NOT NULL,
  seq            INTEGER NOT NULL,              -- 1-based index within the audience
  label          TEXT NOT NULL,
  external_id    TEXT,                          -- platform audience id for this slice
  ad_campaign_id TEXT,
  creative_id    TEXT,
  token          TEXT NOT NULL UNIQUE,          -- signs the cohort tracking URL
  landing_url    TEXT,
  member_count   INTEGER NOT NULL DEFAULT 0,
  matched_count  INTEGER NOT NULL DEFAULT 0,
  status         TEXT NOT NULL DEFAULT 'pending',
  last_synced_at TEXT,
  last_error     TEXT,
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL,
  UNIQUE (audience_id, seq)
);
CREATE INDEX IF NOT EXISTS idx_ad_cohorts_audience ON ad_cohorts(audience_id);

CREATE TABLE IF NOT EXISTS ad_campaigns (
  id              TEXT PRIMARY KEY,             -- "<platform>:<native id>"
  platform        TEXT NOT NULL DEFAULT 'linkedin',
  native_id       TEXT,
  account_id      TEXT,
  name            TEXT NOT NULL,
  status          TEXT,
  objective       TEXT,
  type            TEXT,
  audience_id     TEXT REFERENCES ad_audiences(id) ON DELETE SET NULL,
  cohort_id       TEXT REFERENCES ad_cohorts(id) ON DELETE SET NULL,
  daily_budget    REAL,
  total_budget    REAL,
  currency        TEXT DEFAULT 'USD',
  start_at        TEXT,
  end_at          TEXT,
  landing_url     TEXT,
  synced_at       TEXT,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_platform ON ad_campaigns(platform, status);

-- Daily rollups. Both platforms report per ad object per day; `cohort_id` is
-- what turns that into contact-level attribution.
CREATE TABLE IF NOT EXISTS ad_metrics (
  id               TEXT PRIMARY KEY,
  platform         TEXT NOT NULL DEFAULT 'linkedin',
  ad_campaign_id   TEXT NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  creative_id      TEXT NOT NULL DEFAULT '',
  cohort_id        TEXT REFERENCES ad_cohorts(id) ON DELETE SET NULL,
  date             TEXT NOT NULL,
  impressions      INTEGER NOT NULL DEFAULT 0,
  unique_reach     INTEGER NOT NULL DEFAULT 0,
  clicks           INTEGER NOT NULL DEFAULT 0,
  spend            REAL NOT NULL DEFAULT 0,
  video_views      INTEGER NOT NULL DEFAULT 0,
  reactions        INTEGER NOT NULL DEFAULT 0,
  comments         INTEGER NOT NULL DEFAULT 0,
  shares           INTEGER NOT NULL DEFAULT 0,
  follows          INTEGER NOT NULL DEFAULT 0,
  leads            INTEGER NOT NULL DEFAULT 0,
  conversions      INTEGER NOT NULL DEFAULT 0,
  frequency        REAL NOT NULL DEFAULT 0,
  raw              TEXT NOT NULL DEFAULT '{}',
  UNIQUE (ad_campaign_id, creative_id, date)
);
CREATE INDEX IF NOT EXISTS idx_ad_metrics_date   ON ad_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_ad_metrics_cohort ON ad_metrics(cohort_id, date DESC);

-- Lead-gen form submissions (LinkedIn Lead Gen Forms, Meta Instant Forms) are
-- the one person-level ad signal either platform hands back directly.
CREATE TABLE IF NOT EXISTS ad_lead_responses (
  id             TEXT PRIMARY KEY,
  platform       TEXT NOT NULL DEFAULT 'linkedin',
  response_urn   TEXT UNIQUE,
  ad_campaign_id TEXT,
  creative_id    TEXT,
  cohort_id      TEXT,
  form_id        TEXT,
  contact_id     TEXT REFERENCES contacts(id) ON DELETE SET NULL,
  email          TEXT,
  first_name     TEXT,
  last_name      TEXT,
  company        TEXT,
  job_title      TEXT,
  answers        TEXT NOT NULL DEFAULT '{}',
  submitted_at   TEXT,
  created_at     TEXT NOT NULL
);

-- Every server-side conversion we forward to a platform (Meta CAPI, LinkedIn
-- CAPI). Logged so a failed forward is visible and retryable rather than lost.
CREATE TABLE IF NOT EXISTS ad_conversion_forwards (
  id          TEXT PRIMARY KEY,
  platform    TEXT NOT NULL,
  event_id    TEXT NOT NULL,
  event_name  TEXT NOT NULL,
  contact_id  TEXT REFERENCES contacts(id) ON DELETE SET NULL,
  status      TEXT NOT NULL,                    -- sent | failed | skipped
  error       TEXT,
  response    TEXT,
  created_at  TEXT NOT NULL,
  UNIQUE (platform, event_id)
);
CREATE INDEX IF NOT EXISTS idx_conv_forwards ON ad_conversion_forwards(platform, created_at DESC);

-- ---------------------------------------------------------------- journeys --
CREATE TABLE IF NOT EXISTS journeys (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  description    TEXT,
  enabled        INTEGER NOT NULL DEFAULT 0,
  trigger_type   TEXT NOT NULL,                 -- event | segment_entry | score_threshold
  trigger_config TEXT NOT NULL DEFAULT '{}',
  conditions     TEXT NOT NULL DEFAULT '{}',    -- extra rule tree the contact must match
  actions        TEXT NOT NULL DEFAULT '[]',    -- ordered action list
  cooldown_hours INTEGER NOT NULL DEFAULT 168,  -- don't re-fire for the same contact
  run_count      INTEGER NOT NULL DEFAULT 0,
  last_run_at    TEXT,
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS journey_runs (
  id         TEXT PRIMARY KEY,
  journey_id TEXT NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  contact_id TEXT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  status     TEXT NOT NULL,                     -- completed | failed | skipped
  detail     TEXT NOT NULL DEFAULT '{}',
  ran_at     TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_journey_runs ON journey_runs(journey_id, contact_id, ran_at DESC);

-- ------------------------------------------------------------ housekeeping --
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS job_runs (
  id         TEXT PRIMARY KEY,
  job        TEXT NOT NULL,
  status     TEXT NOT NULL,                     -- ok | error
  detail     TEXT NOT NULL DEFAULT '{}',
  duration_ms INTEGER,
  ran_at     TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_job_runs ON job_runs(job, ran_at DESC);

CREATE TABLE IF NOT EXISTS alerts (
  id         TEXT PRIMARY KEY,
  kind       TEXT NOT NULL,                     -- hot_contact | journey | sync_error
  contact_id TEXT REFERENCES contacts(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  body       TEXT,
  read       INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(read, created_at DESC);
