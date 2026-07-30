// ============================================================================
// Shared metrics logic — used by both the local Express server (server.js)
// and the Vercel serverless function (api/metrics.mjs).
// Reads configuration from process.env lazily (at request time) so it works
// whether env came from a .env file, a shell, or a host's env var settings.
// ============================================================================

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const monthKey = (iso) => iso.slice(0, 7);
const monthLabel = (key) => `${MONTHS[+key.slice(5, 7) - 1]} ${key.slice(0, 4)}`;
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

// Current quarter / year-to-date window, computed from today (UTC). Live API
// queries must target the real current period; the QUARTER_*/YEAR_START env
// vars override this only if you need to pin a specific window.
function currentRanges() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const pad = (n) => String(n).padStart(2, "0");
  const qStartMonth = Math.floor(now.getUTCMonth() / 3) * 3;      // 0,3,6,9
  const qEndMonth = qStartMonth + 2;
  const lastDay = new Date(Date.UTC(y, qEndMonth + 1, 0)).getUTCDate();
  return {
    quarterStart: `${y}-${pad(qStartMonth + 1)}-01`,
    quarterEnd: `${y}-${pad(qEndMonth + 1)}-${pad(lastDay)}`,
    yearStart: `${y}-01-01`,
  };
}

export function readCfg() {
  const r = currentRanges();
  // Trim every credential/id — a stray space or newline pasted into a host's
  // env-var field is a common cause of "invalid token" style rejections.
  const env = (k, d = "") => (process.env[k] || d).trim();
  return {
    cacheTtl: parseInt(env("CACHE_TTL_SECONDS", "21600"), 10) * 1000,
    meta: {
      accountId: env("META_AD_ACCOUNT_ID"),
      token: env("META_ACCESS_TOKEN"),
      version: env("META_API_VERSION", "v20.0"),
    },
    linkedin: {
      accountId: env("LINKEDIN_AD_ACCOUNT_ID"),
      token: env("LINKEDIN_ACCESS_TOKEN"),
      version: env("LINKEDIN_VERSION", "202503"),
    },
    quarterStart: process.env.QUARTER_START || r.quarterStart,
    quarterEnd: process.env.QUARTER_END || r.quarterEnd,
    yearStart: process.env.YEAR_START || r.yearStart,
    currency: process.env.CURRENCY || "USD",
  };
}

function derive(leads, spend, impressions, clicks, reach) {
  return {
    leads, spend: round2(spend), impressions, clicks, reach,
    cpm: impressions ? round2(spend / impressions * 1000) : null,
    cpc: clicks ? round2(spend / clicks) : null,
    ctr: impressions ? round2(clicks / impressions * 100) : null,  // stored as a percent number
    cpl: leads ? round2(spend / leads) : null,
  };
}

/* --------------------- built-in snapshot fallback ------------------- */
// Real Beamr Facebook figures (Meta account "Beamr Marketing", USD), captured
// 2026-07-27. Used whenever live credentials are absent or a call fails.
const SNAPSHOT_FB_MONTHS = [
  { key: "2026-02", leads: 12,  spend: 90.55 },
  { key: "2026-03", leads: 0,   spend: 0 },
  { key: "2026-04", leads: 90,  spend: 3245.41 },
  { key: "2026-05", leads: 109, spend: 7954.56 },
  { key: "2026-06", leads: 38,  spend: 8999.47 },
  { key: "2026-07", leads: 54,  spend: 7888.39 },
];
const snapshotFacebook = () => ({ source: "mock", current: derive(54, 7888.39, 294571, 4409, 121462), months: SNAPSHOT_FB_MONTHS });
const snapshotLinkedIn = () => ({ source: "mock", current: derive(0, 0, 0, 0, 0), months: [] });

/* ------------------------- http helper ------------------------------ */
async function getJSON(url, headers = {}) {
  const res = await fetch(url, { headers });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

/* ----------------------------- Meta ---------------------------------- */
function parseLeads(actions) {
  if (!Array.isArray(actions)) return 0;
  const byType = Object.fromEntries(actions.map((a) => [a.action_type, +a.value || 0]));
  return byType["onsite_conversion.lead_grouped"] ?? byType["leadgen_grouped"] ?? byType["lead"] ?? 0;
}
async function fetchFacebook(cfg) {
  const { accountId, token, version } = cfg.meta;
  if (!accountId || !token) return snapshotFacebook();
  const base = `https://graph.facebook.com/${version}/act_${accountId}/insights`;
  const fields = "spend,impressions,clicks,reach,actions";
  const tr = (s, u) => encodeURIComponent(JSON.stringify({ since: s, until: u }));
  const curUrl = `${base}?fields=${fields}&time_range=${tr(cfg.quarterStart, cfg.quarterEnd)}&access_token=${token}`;
  const moUrl = `${base}?fields=${fields}&time_increment=monthly&time_range=${tr(cfg.yearStart, cfg.quarterEnd)}&access_token=${token}`;
  const [cur, mo] = await Promise.all([getJSON(curUrl), getJSON(moUrl)]);
  const c = (cur.data && cur.data[0]) || {};
  return {
    source: "live",
    current: derive(parseLeads(c.actions), +c.spend || 0, +c.impressions || 0, +c.clicks || 0, +c.reach || 0),
    months: (mo.data || []).map((r) => ({ key: monthKey(r.date_start), leads: parseLeads(r.actions), spend: round2(+r.spend || 0) })),
  };
}

/* --------------------------- LinkedIn -------------------------------- */
function liDateRange(s, e) {
  const [sy, sm, sd] = s.split("-").map(Number);
  const [ey, em, ed] = e.split("-").map(Number);
  return `(start:(year:${sy},month:${sm},day:${sd}),end:(year:${ey},month:${em},day:${ed}))`;
}
async function liAnalytics(cfg, granularity) {
  const { accountId, token, version } = cfg.linkedin;
  // LinkedIn's Rest.li 2.0 query parser requires the structured params
  // (dateRange, accounts, fields) to keep their parentheses/colons/commas
  // LITERAL — percent-encoding the dateRange yields 400 ILLEGAL_ARGUMENT. Only
  // the urn colons inside accounts are encoded (%3A).
  const fields = "impressions,clicks,costInLocalCurrency,oneClickLeads,externalWebsiteConversions,dateRange";
  const account = `List(urn%3Ali%3AsponsoredAccount%3A${accountId})`;
  const url = `https://api.linkedin.com/rest/adAnalytics?q=analytics&pivot=ACCOUNT` +
    `&timeGranularity=${granularity}` +
    `&dateRange=${liDateRange(cfg.yearStart, cfg.quarterEnd)}` +
    `&accounts=${account}&fields=${fields}`;
  return getJSON(url, {
    Authorization: `Bearer ${token}`,
    "LinkedIn-Version": version,
    "X-Restli-Protocol-Version": "2.0.0",
  });
}
const liRow = (el) => ({ leads: +el.oneClickLeads || 0, spend: +el.costInLocalCurrency || 0, impressions: +el.impressions || 0, clicks: +el.clicks || 0 });
async function fetchLinkedIn(cfg) {
  const { accountId, token } = cfg.linkedin;
  if (!accountId || !token) return snapshotLinkedIn();
  const monthly = await liAnalytics(cfg, "MONTHLY");
  const qStart = cfg.quarterStart.slice(0, 7), qEnd = cfg.quarterEnd.slice(0, 7);
  const monthElems = (monthly.elements || []).map((el) => {
    const d = el.dateRange && el.dateRange.start;
    const key = d ? `${d.year}-${String(d.month).padStart(2, "0")}` : null;
    return { key, ...liRow(el) };
  }).filter((r) => r.key);
  const q = monthElems.filter((r) => r.key >= qStart && r.key <= qEnd)
    .reduce((a, r) => ({ leads: a.leads + r.leads, spend: a.spend + r.spend, impressions: a.impressions + r.impressions, clicks: a.clicks + r.clicks }),
            { leads: 0, spend: 0, impressions: 0, clicks: 0 });
  return {
    source: "live",
    current: derive(q.leads, q.spend, q.impressions, q.clicks, 0),
    months: monthElems.map((r) => ({ key: r.key, leads: r.leads, spend: round2(r.spend) })),
  };
}

/* ------------------------- merge + cache ----------------------------- */
function mergeMonths(fbMonths, liMonths) {
  const map = new Map();
  const put = (key) => { if (!map.has(key)) map.set(key, { key, label: monthLabel(key), fbLeads: 0, fbSpend: 0, liLeads: 0, liSpend: 0 }); return map.get(key); };
  for (const m of fbMonths) { const r = put(m.key); r.fbLeads = m.leads; r.fbSpend = m.spend; }
  for (const m of liMonths) { const r = put(m.key); r.liLeads = m.leads; r.liSpend = m.spend; }
  return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
}

async function buildMetrics(cfg) {
  const [fb, li] = await Promise.all([
    fetchFacebook(cfg).catch((e) => ({ ...snapshotFacebook(), source: `error: ${e.message}` })),
    fetchLinkedIn(cfg).catch((e) => ({ ...snapshotLinkedIn(), source: `error: ${e.message}` })),
  ]);
  return {
    syncedAt: new Date().toISOString(),
    currency: cfg.currency,
    sources: { facebook: fb.source, linkedin: li.source },
    facebook: { current: fb.current },
    linkedin: { current: li.current },
    months: mergeMonths(fb.months, li.months),
  };
}

let cache = { at: 0, payload: null };
export async function getMetrics(force) {
  const cfg = readCfg();
  if (!force && cache.payload && Date.now() - cache.at < cfg.cacheTtl) return cache.payload;
  cache = { at: Date.now(), payload: await buildMetrics(cfg) };
  return cache.payload;
}
