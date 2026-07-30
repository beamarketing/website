// ============================================================================
// Shared metrics logic — used by both the local Express server (server.js)
// and the Vercel serverless function (api/metrics.mjs).
// Reads configuration from process.env lazily (at request time).
//
// Public API:
//   getMetrics({ start, end, compare, force })  -> window totals + monthly series
//   getAds({ start, end, channel, force })      -> per-ad rows for the window
// ============================================================================

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const monthKey = (iso) => iso.slice(0, 7);
const monthLabel = (key) => `${MONTHS[+key.slice(5, 7) - 1]} ${key.slice(0, 4)}`;
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const iso = (d) => d.toISOString().slice(0, 10);

// Current quarter, computed from today (UTC) — the default window.
function currentQuarter() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const pad = (n) => String(n).padStart(2, "0");
  const qs = Math.floor(now.getUTCMonth() / 3) * 3;
  const qe = qs + 2;
  const lastDay = new Date(Date.UTC(y, qe + 1, 0)).getUTCDate();
  return { start: `${y}-${pad(qs + 1)}-01`, end: `${y}-${pad(qe + 1)}-${pad(lastDay)}` };
}

// Equal-length window immediately preceding [start,end] (for "vs previous period").
function previousWindow(start, end) {
  const s = new Date(start + "T00:00:00Z"), e = new Date(end + "T00:00:00Z");
  const days = Math.round((e - s) / 86400000) + 1;
  const prevEnd = new Date(s); prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);
  const prevStart = new Date(prevEnd); prevStart.setUTCDate(prevStart.getUTCDate() - (days - 1));
  return { start: iso(prevStart), end: iso(prevEnd) };
}

export function readCfg() {
  const q = currentQuarter();
  const env = (k, d = "") => (process.env[k] || d).trim();   // trim stray whitespace in host env vars
  return {
    cacheTtl: parseInt(env("CACHE_TTL_SECONDS", "21600"), 10) * 1000,
    meta: { accountId: env("META_AD_ACCOUNT_ID"), token: env("META_ACCESS_TOKEN"), version: env("META_API_VERSION", "v20.0") },
    linkedin: { accountId: env("LINKEDIN_AD_ACCOUNT_ID"), token: env("LINKEDIN_ACCESS_TOKEN"), version: env("LINKEDIN_VERSION", "202503") },
    defaultStart: env("QUARTER_START") || q.start,
    defaultEnd: env("QUARTER_END") || q.end,
    currency: env("CURRENCY", "USD"),
  };
}

function derive(leads, spend, impressions, clicks, reach = 0) {
  return {
    leads, spend: round2(spend), impressions, clicks, reach,
    cpm: impressions ? round2(spend / impressions * 1000) : null,
    cpc: clicks ? round2(spend / clicks) : null,
    ctr: impressions ? round2(clicks / impressions * 100) : null,  // percent number
    cpl: leads ? round2(spend / leads) : null,
  };
}

/* --------------------- built-in snapshot fallback ------------------- */
// Real Beamr Facebook figures (Meta account "Beamr Marketing", USD, 2026-07-27).
const SNAPSHOT_FB_MONTHS = [
  { key: "2026-02", leads: 12,  spend: 90.55 },
  { key: "2026-03", leads: 0,   spend: 0 },
  { key: "2026-04", leads: 90,  spend: 3245.41 },
  { key: "2026-05", leads: 109, spend: 7954.56 },
  { key: "2026-06", leads: 38,  spend: 8999.47 },
  { key: "2026-07", leads: 54,  spend: 7888.39 },
];
// Window-aware so the fallback never injects out-of-range months into a
// selected date range. Full-snapshot impressions/clicks apply only when the
// whole snapshot period is covered.
function snapshotFacebook(start = "0000-00", end = "9999-99") {
  const s = start.slice(0, 7), e = end.slice(0, 7);
  const months = SNAPSHOT_FB_MONTHS.filter((m) => m.key >= s && m.key <= e);
  const full = months.length === SNAPSHOT_FB_MONTHS.length;
  const leads = months.reduce((a, m) => a + m.leads, 0);
  const spend = months.reduce((a, m) => a + m.spend, 0);
  return { source: "mock", current: full ? derive(54, 7888.39, 294571, 4409, 121462) : derive(leads, spend, 0, 0, 0), months };
}
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
function metaInsightsUrl(cfg, path, params) {
  const base = `https://graph.facebook.com/${cfg.meta.version}/${path}`;
  const qs = new URLSearchParams({ ...params, access_token: cfg.meta.token }).toString();
  return `${base}?${qs}`;
}
async function fetchFacebook(cfg, start, end) {
  const { accountId, token } = cfg.meta;
  if (!accountId || !token) return snapshotFacebook(start, end);
  const fields = "spend,impressions,clicks,reach,actions";
  const time_range = JSON.stringify({ since: start, until: end });
  const [cur, mo] = await Promise.all([
    getJSON(metaInsightsUrl(cfg, `act_${accountId}/insights`, { fields, time_range })),
    getJSON(metaInsightsUrl(cfg, `act_${accountId}/insights`, { fields, time_range, time_increment: "monthly" })),
  ]);
  const c = (cur.data && cur.data[0]) || {};
  return {
    source: "live",
    current: derive(parseLeads(c.actions), +c.spend || 0, +c.impressions || 0, +c.clicks || 0, +c.reach || 0),
    months: (mo.data || []).map((r) => ({ key: monthKey(r.date_start), leads: parseLeads(r.actions), spend: round2(+r.spend || 0) })),
  };
}
async function fetchFacebookAds(cfg, start, end) {
  const { accountId, token } = cfg.meta;
  if (!accountId || !token) return { source: "mock", ads: [] };
  const fields = "ad_name,spend,impressions,clicks,reach,actions";
  const time_range = JSON.stringify({ since: start, until: end });
  const data = await getJSON(metaInsightsUrl(cfg, `act_${accountId}/insights`, { fields, level: "ad", limit: "200", time_range }));
  const ads = (data.data || []).map((r) => ({
    channel: "facebook", name: r.ad_name || "(unnamed ad)",
    ...derive(parseLeads(r.actions), +r.spend || 0, +r.impressions || 0, +r.clicks || 0, +r.reach || 0),
  }));
  return { source: "live", ads };
}

/* --------------------------- LinkedIn -------------------------------- */
function liDateRange(s, e) {
  const [sy, sm, sd] = s.split("-").map(Number);
  const [ey, em, ed] = e.split("-").map(Number);
  return `(start:(year:${sy},month:${sm},day:${sd}),end:(year:${ey},month:${em},day:${ed}))`;
}
function liHeaders(cfg) {
  return { Authorization: `Bearer ${cfg.linkedin.token}`, "LinkedIn-Version": cfg.linkedin.version, "X-Restli-Protocol-Version": "2.0.0" };
}
// LinkedIn Rest.li 2.0 needs dateRange/accounts/fields params kept LITERAL
// (percent-encoding the dateRange yields 400); only urn colons are encoded.
function liAnalyticsUrl(cfg, { pivot, granularity, start, end, fields }) {
  const account = `List(urn%3Ali%3AsponsoredAccount%3A${cfg.linkedin.accountId})`;
  return `https://api.linkedin.com/rest/adAnalytics?q=analytics&pivot=${pivot}` +
    `&timeGranularity=${granularity}&dateRange=${liDateRange(start, end)}` +
    `&accounts=${account}&fields=${fields}`;
}
const liRow = (el) => ({ leads: +el.oneClickLeads || 0, spend: +el.costInLocalCurrency || 0, impressions: +el.impressions || 0, clicks: +el.clicks || 0 });
async function fetchLinkedIn(cfg, start, end) {
  const { accountId, token } = cfg.linkedin;
  if (!accountId || !token) return snapshotLinkedIn();
  const monthly = await getJSON(liAnalyticsUrl(cfg, { pivot: "ACCOUNT", granularity: "MONTHLY", start, end, fields: "impressions,clicks,costInLocalCurrency,oneClickLeads,dateRange" }), liHeaders(cfg));
  const months = (monthly.elements || []).map((el) => {
    const d = el.dateRange && el.dateRange.start;
    return d ? { key: `${d.year}-${String(d.month).padStart(2, "0")}`, ...liRow(el) } : null;
  }).filter(Boolean);
  const tot = months.reduce((a, r) => ({ leads: a.leads + r.leads, spend: a.spend + r.spend, impressions: a.impressions + r.impressions, clicks: a.clicks + r.clicks }),
                            { leads: 0, spend: 0, impressions: 0, clicks: 0 });
  return { source: "live", current: derive(tot.leads, tot.spend, tot.impressions, tot.clicks, 0), months };
}
// Resolve sponsoredCreative URNs -> a readable label (the creative's associated
// post/name), batched. Falls back to the numeric id when no name is available.
async function resolveCreativeNames(cfg, ids) {
  const names = {};
  for (let i = 0; i < ids.length; i += 20) {
    const batch = ids.slice(i, i + 20);
    const list = "List(" + batch.map((id) => encodeURIComponent(`urn:li:sponsoredCreative:${id}`)).join(",") + ")";
    try {
      // Creative reads are account-scoped in current LinkedIn API versions.
      const res = await getJSON(`https://api.linkedin.com/rest/adAccounts/${cfg.linkedin.accountId}/creatives?ids=${list}`, liHeaders(cfg));
      const results = res.results || {};
      for (const key of Object.keys(results)) {
        const c = results[key];
        const idNum = (key.match(/(\d+)/g) || []).pop();   // last number in the urn key
        if (idNum) names[idNum] = c.name || `Creative ${idNum}`;
      }
    } catch { /* leave unresolved; fall back to id below */ }
  }
  return names;
}
async function fetchLinkedInAds(cfg, start, end) {
  const { accountId, token } = cfg.linkedin;
  if (!accountId || !token) return { source: "mock", ads: [] };
  const res = await getJSON(liAnalyticsUrl(cfg, { pivot: "CREATIVE", granularity: "ALL", start, end, fields: "impressions,clicks,costInLocalCurrency,oneClickLeads,pivotValues" }), liHeaders(cfg));
  const rows = (res.elements || []).map((el) => {
    const urn = (el.pivotValues && el.pivotValues[0]) || "";
    const id = (urn.match(/(\d+)$/) || [])[1] || urn;
    return { id, ...liRow(el) };
  }).filter((r) => r.id);
  const names = await resolveCreativeNames(cfg, rows.map((r) => r.id));
  const ads = rows.map((r) => ({
    channel: "linkedin", name: names[r.id] || `Creative ${r.id}`,
    ...derive(r.leads, r.spend, r.impressions, r.clicks, 0),
  }));
  return { source: "live", ads };
}

/* ------------------------- merge + windows --------------------------- */
function mergeMonths(fbMonths, liMonths) {
  const map = new Map();
  const put = (key) => { if (!map.has(key)) map.set(key, { key, label: monthLabel(key), fbLeads: 0, fbSpend: 0, liLeads: 0, liSpend: 0 }); return map.get(key); };
  for (const m of fbMonths) { const r = put(m.key); r.fbLeads = m.leads; r.fbSpend = m.spend; }
  for (const m of liMonths) { const r = put(m.key); r.liLeads = m.leads; r.liSpend = m.spend; }
  return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
}
async function buildWindow(cfg, start, end) {
  const [fb, li] = await Promise.all([
    fetchFacebook(cfg, start, end).catch((e) => ({ ...snapshotFacebook(start, end), source: `error: ${e.message}` })),
    fetchLinkedIn(cfg, start, end).catch((e) => ({ ...snapshotLinkedIn(), source: `error: ${e.message}` })),
  ]);
  return {
    sources: { facebook: fb.source, linkedin: li.source },
    facebook: { current: fb.current },
    linkedin: { current: li.current },
    months: mergeMonths(fb.months, li.months),
  };
}

/* ------------------------------ cache -------------------------------- */
const cache = new Map();
function cached(key, ttl, make) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttl) return hit.payload;
  return make().then((payload) => { cache.set(key, { at: Date.now(), payload }); return payload; });
}

/* ------------------------------ API ---------------------------------- */
export async function getMetrics(opts = {}) {
  const cfg = readCfg();
  const start = opts.start || cfg.defaultStart, end = opts.end || cfg.defaultEnd;
  const key = `metrics|${start}|${end}|${opts.compare ? 1 : 0}`;
  const make = async () => {
    const cur = await buildWindow(cfg, start, end);
    let previous = null;
    if (opts.compare) {
      const pw = previousWindow(start, end);
      const p = await buildWindow(cfg, pw.start, pw.end);
      previous = { window: pw, sources: p.sources, facebook: p.facebook, linkedin: p.linkedin };
    }
    return { syncedAt: new Date().toISOString(), currency: cfg.currency, window: { start, end }, ...cur, previous };
  };
  return opts.force ? make().then((p) => { cache.set(key, { at: Date.now(), payload: p }); return p; })
                    : cached(key, cfg.cacheTtl, make);
}

export async function getAds(opts = {}) {
  const cfg = readCfg();
  const start = opts.start || cfg.defaultStart, end = opts.end || cfg.defaultEnd;
  const channel = opts.channel || "all";
  const key = `ads|${channel}|${start}|${end}`;
  const make = async () => {
    const want = { fb: channel === "all" || channel === "facebook", li: channel === "all" || channel === "linkedin" };
    const [fb, li] = await Promise.all([
      want.fb ? fetchFacebookAds(cfg, start, end).catch((e) => ({ source: `error: ${e.message}`, ads: [] })) : { source: "off", ads: [] },
      want.li ? fetchLinkedInAds(cfg, start, end).catch((e) => ({ source: `error: ${e.message}`, ads: [] })) : { source: "off", ads: [] },
    ]);
    const ads = [...fb.ads, ...li.ads].sort((a, b) => b.spend - a.spend);
    return { syncedAt: new Date().toISOString(), currency: cfg.currency, window: { start, end }, sources: { facebook: fb.source, linkedin: li.source }, ads };
  };
  return opts.force ? make().then((p) => { cache.set(key, { at: Date.now(), payload: p }); return p; })
                    : cached(key, cfg.cacheTtl, make);
}
