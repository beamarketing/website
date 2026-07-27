// Vercel serverless function → GET /api/metrics
// Shares all logic with the local Express server via server/lib/metrics.mjs.
// Set the environment variables from server/.env.example in the Vercel project
// settings (Project → Settings → Environment Variables). No npm deps — uses the
// Node runtime's built-in fetch (Node 18+).
import { getMetrics } from "../server/lib/metrics.mjs";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const force = req.query && (req.query.force === "1" || req.query.force === 1);
    const data = await getMetrics(!!force);
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(data));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
