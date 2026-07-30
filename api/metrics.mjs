// Vercel serverless function -> GET /api/metrics
// Shares all logic with the local Express server via server/lib/metrics.mjs.
// Query params: start=YYYY-MM-DD, end=YYYY-MM-DD, compare=1, force=1
import { getMetrics } from "../server/lib/metrics.mjs";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const query = req.query || {};
    const data = await getMetrics({
      start: query.start, end: query.end,
      compare: query.compare === "1" || query.compare === 1,
      force: query.force === "1" || query.force === 1,
    });
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(data));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
