import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Minimal .env loader — no dependency, no surprises. Real env always wins.
function loadEnvFile() {
  const file = join(root, '.env');
  if (!existsSync(file)) return;
  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}
loadEnvFile();

const env = process.env;
const bool = (v, d = false) => (v === undefined ? d : /^(1|true|yes|on)$/i.test(v));
const int = (v, d) => (v === undefined || v === '' ? d : Number.parseInt(v, 10));

export const config = {
  root,
  env: env.NODE_ENV || 'development',
  port: int(env.PORT, 4000),
  host: env.HOST || '0.0.0.0',

  // Public origin of THIS server. Tracking pixels, click redirects and
  // unsubscribe links are all built from it, so it must be reachable
  // from a recipient's inbox and browser.
  publicUrl: (env.PUBLIC_URL || 'http://localhost:4000').replace(/\/$/, ''),

  dbPath: env.DB_PATH || join(root, 'data', 'beamr-abm.db'),

  // Console + API auth. Generated on first boot if unset.
  adminToken: env.ADMIN_TOKEN || '',

  // Signs tracking tokens and hashes IPs. Generated on first boot if unset.
  secret: env.SECRET_KEY || '',

  // Domains allowed to POST to the tracking collector ('*' = any).
  trackingOrigins: (env.TRACKING_ORIGINS || '*').split(',').map((s) => s.trim()).filter(Boolean),
  cookieDays: int(env.COOKIE_DAYS, 365),

  email: {
    provider: (env.EMAIL_PROVIDER || 'console').toLowerCase(), // console|smtp|resend|sendgrid
    fromName: env.EMAIL_FROM_NAME || 'Beamr',
    fromEmail: env.EMAIL_FROM || 'marketing@beamr.com',
    replyTo: env.EMAIL_REPLY_TO || '',
    // Physical address is a legal requirement for marketing email (CAN-SPAM).
    postalAddress: env.EMAIL_POSTAL_ADDRESS || 'Beamr Imaging Ltd., Herzliya, Israel',
    maxPerMinute: int(env.EMAIL_MAX_PER_MINUTE, 60),
    smtp: {
      host: env.SMTP_HOST || '',
      port: int(env.SMTP_PORT, 587),
      secure: bool(env.SMTP_SECURE, false), // true = implicit TLS on connect (465)
      user: env.SMTP_USER || '',
      pass: env.SMTP_PASS || '',
      requireTls: bool(env.SMTP_REQUIRE_TLS, true),
    },
    resendKey: env.RESEND_API_KEY || '',
    sendgridKey: env.SENDGRID_API_KEY || '',
  },

  linkedin: {
    accessToken: env.LINKEDIN_ACCESS_TOKEN || '',
    adAccountId: env.LINKEDIN_AD_ACCOUNT_ID || '',
    organizationId: env.LINKEDIN_ORGANIZATION_ID || '',
    apiVersion: env.LINKEDIN_API_VERSION || '202506',
    clientId: env.LINKEDIN_CLIENT_ID || '',
    clientSecret: env.LINKEDIN_CLIENT_SECRET || '',
    // Minimum matched members LinkedIn will actually serve ads to. This is the
    // floor on how narrow a cohort — and therefore how precise the
    // attribution — can be on this platform.
    minAudienceSize: int(env.LINKEDIN_MIN_AUDIENCE, 300),
  },

  meta: {
    accessToken: env.META_ACCESS_TOKEN || '',
    adAccountId: String(env.META_AD_ACCOUNT_ID || '').replace(/^act_/, ''),
    pixelId: env.META_PIXEL_ID || '',
    pageId: env.META_PAGE_ID || '',
    businessId: env.META_BUSINESS_ID || '',
    apiVersion: env.META_API_VERSION || 'v21.0',
    appId: env.META_APP_ID || '',
    appSecret: env.META_APP_SECRET || '',
    // Meta delivers to a much smaller custom audience than LinkedIn, which is
    // why cohorts can be roughly 3x tighter here.
    minAudienceSize: int(env.META_MIN_AUDIENCE, 100),
    // Conversions API: forward first-party website events server-side.
    capiEnabled: bool(env.META_CAPI_ENABLED, true),
    // Hash IP and user agent out of CAPI payloads if you'd rather not send them.
    capiSendClientContext: bool(env.META_CAPI_CLIENT_CONTEXT, true),
    testEventCode: env.META_TEST_EVENT_CODE || '',
  },

  ads: {
    // Cohort mode is what converts campaign-level reporting into
    // contact-level attribution. Off by default: it multiplies the number of
    // audiences and ad objects you have to manage on the platform.
    cohortsEnabled: bool(env.AD_COHORTS_ENABLED, false),
    // Extra headroom over the platform minimum, because match rates mean a
    // cohort of exactly N contacts matches fewer than N members.
    cohortOversizeFactor: Number(env.AD_COHORT_OVERSIZE || 1.6),
    maxCohorts: int(env.AD_MAX_COHORTS, 50),
  },

  jobs: {
    enabled: bool(env.JOBS_ENABLED, true),
    queueIntervalSec: int(env.JOB_QUEUE_INTERVAL, 15),
    journeyIntervalSec: int(env.JOB_JOURNEY_INTERVAL, 60),
    scoreIntervalSec: int(env.JOB_SCORE_INTERVAL, 3600),
    audienceIntervalSec: int(env.JOB_AUDIENCE_INTERVAL, 21600),
    adsIntervalSec: int(env.JOB_ADS_INTERVAL, 21600),
    capiIntervalSec: int(env.JOB_CAPI_INTERVAL, 300),
  },
};

export const isDryRun = {
  get linkedin() { return !config.linkedin.accessToken || !config.linkedin.adAccountId; },
  get meta() { return !config.meta.accessToken || !config.meta.adAccountId; },
  get email() { return config.email.provider === 'console'; },
  /** True when no ad platform at all is wired up. */
  get ads() { return this.linkedin && this.meta; },
};

/** Fills in generated secrets, persisting them so restarts stay valid. */
export function ensureSecrets(settings) {
  if (!config.secret) {
    config.secret = settings.get('secret_key') || settings.set('secret_key', randomBytes(32).toString('hex'));
  }
  if (!config.adminToken) {
    config.adminToken = settings.get('admin_token') || settings.set('admin_token', randomBytes(24).toString('base64url'));
    config.adminTokenGenerated = true;
  }
  return config;
}
