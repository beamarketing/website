// Vercel serverless function -> GET /api/ads
// Per-ad performance rows (LinkedIn creatives + Meta ads) for a window.
// Query params: start=YYYY-MM-DD, end=YYYY-MM-DD, channel=all|facebook|linkedin, force=1
import { getAds } from "../server/lib/metrics.mjs";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const query = req.query || {};
    const data = await getAds({
      start: query.start, end: query.end, channel: query.channel,
      force: query.force === "1" || query.force === 1,
    });
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(data));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
