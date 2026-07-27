// ============================================================================
// Beamr Dashboard backend
// Serves the dashboard and exposes GET /api/metrics with live Facebook (Meta)
// and LinkedIn campaign data. Missing credentials for a channel => that channel
// falls back to the built-in snapshot, so the dashboard always renders.
// ============================================================================
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* --------------------------- env loading ---------------------------- */
// Tiny .env reader so the only runtime dependency is Express.
function loadEnv() {
  const p = path.join(__dirname, ".env");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv();

const CFG = {
  port: parseInt(process.env.PORT || "3000", 10),
  cacheTtl: parseInt(process.env.CACHE_TTL_SECONDS || "21600", 10) * 1000,
  meta: {
    accountId: process.env.META_AD_ACCOUNT_ID || "",
    token: process.env.META_ACCESS_TOKEN || "",
    version: process.env.META_API_VERSION || "v20.0",
  },
  linkedin: {
    accountId: process.env.LINKEDIN_AD_ACCOUNT_ID || "",
    token: process.env.LINKEDIN_ACCESS_TOKEN || "",
    version: process.env.LINKEDIN_VERSION || "202405",
  },
  quarterStart: process.env.QUARTER_START || "2026-07-01",
  quarterEnd: process.env.QUARTER_END || "2026-09-30",
  yearStart: process.env.YEAR_START || "2026-01-01",
  currency: process.env.CURRENCY || "USD",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const monthKey = (iso) => iso.slice(0, 7);                    // "2026-07"
const monthLabel = (key) => `${MONTHS[+key.slice(5, 7) - 1]} ${key.slice(0, 4)}`;
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
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
function snapshotFacebook() {
  const current = derive(54, 7888.39, 294571, 4409, 121462);
  return { source: "mock", current, months: SNAPSHOT_FB_MONTHS };
}
function snapshotLinkedIn() {
  return { source: "mock", current: derive(0, 0, 0, 0, 0), months: [] };
}

/* ----------------------------- Meta ---------------------------------- */
function parseLeads(actions) {
  if (!Array.isArray(actions)) return 0;
  const byType = Object.fromEntries(actions.map((a) => [a.action_type, +a.value || 0]));
  return byType["onsite_conversion.lead_grouped"] ??
         byType["leadgen_grouped"] ??
         byType["lead"] ?? 0;
}
async function fetchFacebook() {
  const { accountId, token, version } = CFG.meta;
  if (!accountId || !token) return snapshotFacebook();
  const base = `https://graph.facebook.com/${version}/act_${accountId}/insights`;
  const fields = "spend,impressions,clicks,reach,actions";
  const timeRange = (s, u) => encodeURIComponent(JSON.stringify({ since: s, until: u }));

  // current (quarter to date)
  const curUrl = `${base}?fields=${fields}&time_range=${timeRange(CFG.quarterStart, CFG.quarterEnd)}&access_token=${token}`;
  // monthly (year to quarter end)
  const moUrl = `${base}?fields=${fields}&time_increment=monthly&time_range=${timeRange(CFG.yearStart, CFG.quarterEnd)}&access_token=${token}`;

  const [cur, mo] = await Promise.all([getJSON(curUrl), getJSON(moUrl)]);
  const c = (cur.data && cur.data[0]) || {};
  const current = derive(parseLeads(c.actions), +c.spend || 0, +c.impressions || 0, +c.clicks || 0, +c.reach || 0);
  const months = (mo.data || []).map((r) => ({
    key: monthKey(r.date_start),
    leads: parseLeads(r.actions),
    spend: round2(+r.spend || 0),
  }));
  return { source: "live", current, months };
}

/* --------------------------- LinkedIn -------------------------------- */
function liDateRange(s, e) {
  const [sy, sm, sd] = s.split("-").map(Number);
  const [ey, em, ed] = e.split("-").map(Number);
  return `(start:(year:${sy},month:${sm},day:${sd}),end:(year:${ey},month:${em},day:${ed}))`;
}
async function liAnalytics(granularity) {
  const { accountId, token, version } = CFG.linkedin;
  const fields = "impressions,clicks,costInLocalCurrency,oneClickLeads,externalWebsiteConversions,dateRange,pivotValues";
  const account = encodeURIComponent(`List(urn:li:sponsoredAccount:${accountId})`);
  const url = `https://api.linkedin.com/rest/adAnalytics?q=analytics&pivot=ACCOUNT` +
    `&timeGranularity=${granularity}` +
    `&dateRange=${encodeURIComponent(liDateRange(CFG.yearStart, CFG.quarterEnd))}` +
    `&accounts=${account}&fields=${encodeURIComponent(fields)}`;
  return getJSON(url, {
    Authorization: `Bearer ${token}`,
    "LinkedIn-Version": version,
    "X-Restli-Protocol-Version": "2.0.0",
  });
}
function liRow(el) {
  return {
    leads: +el.oneClickLeads || 0,
    spend: +el.costInLocalCurrency || 0,
    impressions: +el.impressions || 0,
    clicks: +el.clicks || 0,
  };
}
async function fetchLinkedIn() {
  const { accountId, token } = CFG.linkedin;
  if (!accountId || !token) return snapshotLinkedIn();

  // current: sum the quarter window at ALL granularity (single element)
  const [all, monthly] = await Promise.all([liAnalytics("ALL"), liAnalytics("MONTHLY")]);

  // ALL returns the full year; re-sum only the quarter window from monthly rows
  const qStart = CFG.quarterStart.slice(0, 7), qEnd = CFG.quarterEnd.slice(0, 7);
  const monthElems = (monthly.elements || []).map((el) => {
    const d = el.dateRange && el.dateRange.start;
    const key = d ? `${d.year}-${String(d.month).padStart(2, "0")}` : null;
    return { key, ...liRow(el) };
  }).filter((r) => r.key);

  const q = monthElems.filter((r) => r.key >= qStart && r.key <= qEnd)
    .reduce((a, r) => ({ leads: a.leads + r.leads, spend: a.spend + r.spend, impressions: a.impressions + r.impressions, clicks: a.clicks + r.clicks }),
            { leads: 0, spend: 0, impressions: 0, clicks: 0 });

  const current = derive(q.leads, q.spend, q.impressions, q.clicks, 0);
  const months = monthElems.map((r) => ({ key: r.key, leads: r.leads, spend: round2(r.spend) }));
  return { source: "live", current, months };
}

/* ------------------------- merge + cache ----------------------------- */
function mergeMonths(fbMonths, liMonths) {
  const map = new Map();
  const put = (key) => { if (!map.has(key)) map.set(key, { key, label: monthLabel(key), fbLeads: 0, fbSpend: 0, liLeads: 0, liSpend: 0 }); return map.get(key); };
  for (const m of fbMonths) { const r = put(m.key); r.fbLeads = m.leads; r.fbSpend = m.spend; }
  for (const m of liMonths) { const r = put(m.key); r.liLeads = m.leads; r.liSpend = m.spend; }
  return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
}

let cache = { at: 0, payload: null };
async function buildMetrics() {
  const [fb, li] = await Promise.all([
    fetchFacebook().catch((e) => ({ ...snapshotFacebook(), source: `error: ${e.message}` })),
    fetchLinkedIn().catch((e) => ({ ...snapshotLinkedIn(), source: `error: ${e.message}` })),
  ]);
  return {
    syncedAt: new Date().toISOString(),
    currency: CFG.currency,
    sources: { facebook: fb.source, linkedin: li.source },
    facebook: { current: fb.current },
    linkedin: { current: li.current },
    months: mergeMonths(fb.months, li.months),
  };
}
async function getMetrics(force) {
  if (!force && cache.payload && Date.now() - cache.at < CFG.cacheTtl) return cache.payload;
  cache = { at: Date.now(), payload: await buildMetrics() };
  return cache.payload;
}

/* ------------------------- http helpers ------------------------------ */
async function getJSON(url, headers = {}) {
  const res = await fetch(url, { headers });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

/* ------------------------------ app ---------------------------------- */
const app = express();
app.use("/api", (req, res, next) => {                 // allow a separately-hosted dashboard to call the API
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/api/metrics", async (req, res) => {
  try {
    res.json(await getMetrics(req.query.force === "1"));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.get("/api/health", (req, res) => res.json({ ok: true }));

// serve the dashboard (one directory up)
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "..", "dashboard.html")));
app.use(express.static(path.join(__dirname, "..")));

app.listen(CFG.port, () => {
  const have = (c) => (c.token && c.accountId ? "live" : "snapshot (no creds)");
  console.log(`Beamr dashboard server on http://localhost:${CFG.port}`);
  console.log(`  Facebook: ${have(CFG.meta)}   LinkedIn: ${have(CFG.linkedin)}`);
});
