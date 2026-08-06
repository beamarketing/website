// ============================================================================
// Beamr Dashboard backend — local / long-running host (Railway, Render, VPS…).
// For Vercel, the same logic is exposed as a serverless function at
// ../api/metrics.mjs; both import server/lib/metrics.mjs.
//
// Serves the dashboard and exposes GET /api/metrics with live Facebook (Meta)
// and LinkedIn campaign data. Missing credentials for a channel => that channel
// falls back to the built-in snapshot, so the dashboard always renders.
// ============================================================================
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Tiny .env reader so the only runtime dependency is Express. Must run BEFORE
// getMetrics is called (it reads process.env lazily, at request time).
(function loadEnv() {
  const p = path.join(__dirname, ".env");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
})();

const { getMetrics, getAds, readCfg } = await import("./lib/metrics.mjs");
const q = (req) => ({ start: req.query.start, end: req.query.end, compare: req.query.compare === "1", channel: req.query.channel, force: req.query.force === "1" });

const app = express();

// ---- Password gate (parity with the Vercel edge middleware) --------------
// If DASHBOARD_PASSWORD is set, every request must carry HTTP Basic auth with
// the right password, so the dashboard and its data are never open. If it is
// NOT set, the server stays open (convenient for local dev on localhost).
app.use((req, res, next) => {
  const PASS = process.env.DASHBOARD_PASSWORD;
  if (!PASS) return next();                            // no password configured → open (local dev)
  const USER = process.env.DASHBOARD_USER || "beamr";
  const header = req.headers.authorization || "";
  if (header.startsWith("Basic ")) {
    const decoded = Buffer.from(header.slice(6).trim(), "base64").toString("utf8");
    const sep = decoded.indexOf(":");
    const user = sep === -1 ? decoded : decoded.slice(0, sep);
    const pass = sep === -1 ? "" : decoded.slice(sep + 1);
    if (user === USER && pass === PASS) return next();
  }
  res.set("WWW-Authenticate", 'Basic realm="Beamr Dashboard", charset="UTF-8"');
  return res.status(401).send("Authentication required.");
});

app.use("/api", (req, res, next) => {                 // allow a separately-hosted dashboard to call the API
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/api/metrics", async (req, res) => {
  try { res.json(await getMetrics(q(req))); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get("/api/ads", async (req, res) => {
  try { res.json(await getAds(q(req))); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get("/api/health", (req, res) => res.json({ ok: true }));

// serve the dashboard (one directory up)
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "..", "dashboard.html")));
app.use(express.static(path.join(__dirname, "..")));

const port = parseInt(process.env.PORT || "3000", 10);
app.listen(port, () => {
  const cfg = readCfg();
  const have = (c) => (c.token && c.accountId ? "live" : "snapshot (no creds)");
  console.log(`Beamr dashboard server on http://localhost:${port}`);
  console.log(`  Facebook: ${have(cfg.meta)}   LinkedIn: ${have(cfg.linkedin)}`);
});
