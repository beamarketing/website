# Beamr Dashboard — backend service

Feeds the dashboard live **Facebook (Meta)** and **LinkedIn** campaign data via
`GET /api/metrics`, and serves `dashboard.html` itself. If credentials for a
channel are missing or a call fails, that channel falls back to the built-in
snapshot, so the page always renders.

## Run locally

```bash
cd server
cp .env.example .env      # fill in credentials (or leave blank to use the snapshot)
npm install
npm start                 # http://localhost:3000
```

Open http://localhost:3000 — the dashboard loads and fetches `/api/metrics`.
With no credentials it serves the snapshot and the dashboard shows a
“snapshot” status; add credentials and it switches to live.

Check the raw feed anytime: http://localhost:3000/api/metrics
(add `?force=1` to bypass the cache).

## Credentials

All values live in `.env` (local) or as host environment variables (prod). See
`.env.example` for the full list.

### Facebook / Meta  (works today — you already have access)

1. Go to **business.facebook.com → Business settings → Users → System users**.
2. Create/select a system user, **Generate token** with the `ads_read` scope,
   and assign it to the *Beamr Marketing* ad account.
3. Put the token in `META_ACCESS_TOKEN`. The account id is already set
   (`1736901387696242`).

System-user tokens are long-lived; rotate per your security policy.

### LinkedIn  (requires an approval step before it can work)

LinkedIn does **not** grant advertising data by default — you must apply once:

1. Create an app at **linkedin.com/developers** and associate it with the
   Beamr LinkedIn **Company Page**.
2. Under **Products**, request **Advertising API** access. LinkedIn reviews
   this manually (typically a few business days). You need the reporting
   scopes `r_ads` and `r_ads_reporting`.
3. After approval, run the OAuth 2.0 flow to get an access token with those
   scopes. Put it in `LINKEDIN_ACCESS_TOKEN`.
4. Find your **sponsored ad account id** in LinkedIn Campaign Manager
   (Account assets → the numeric id) and set `LINKEDIN_AD_ACCOUNT_ID`.

Until step 2 is approved, LinkedIn stays on the snapshot (zeros) and the rest of
the dashboard works normally. LinkedIn access tokens expire — for unattended
running, store the refresh token and exchange it on a schedule, or use a
long-lived token per LinkedIn’s current policy.

## Deploy on Vercel (configured)

This repo is wired for Vercel out of the box:

- `api/metrics.mjs` — the serverless function served at `/api/metrics`.
- `server/lib/metrics.mjs` — shared fetch logic (imported by both the function
  and the local Express server).
- `vercel.json` — rewrites `/` to `/dashboard.html`.
- `.vercelignore` — keeps the deploy focused on the dashboard + API.

Steps:

1. Push this branch to GitHub (already done).
2. In Vercel, **Add New → Project** and import the `beamarketing/website` repo.
   Leave the framework preset as **Other** and the root directory as the repo
   root — no build command is needed (it's static + a function).
3. Under **Settings → Environment Variables**, add the values from
   `.env.example` (`META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID`,
   `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_AD_ACCOUNT_ID`, etc.). Do **not** add
   `PORT` — Vercel manages that.
4. **Deploy.** Your dashboard is at `https://<project>.vercel.app/` and the API
   at `https://<project>.vercel.app/api/metrics`.

Node ≥18 (Vercel default) provides the built-in `fetch` this uses; there are no
npm dependencies in the function path.

> **Vercel caveat (as flagged):** serverless functions are ephemeral, so the
> in-memory cache only helps within a warm instance — a cold start re-fetches.
> That's fine here (the dashboard fetches on load, not in a tight loop), but if
> you want a guaranteed shared cache, use a long-running host (below) or add a
> tiny KV store.

## Deploy on a long-running host (alternative)

Any Node ≥18 host runs the Express server directly. The dashboard fetches live
on every load and the server caches each upstream response for
`CACHE_TTL_SECONDS` (default 6h), so data refreshes several times a day on its
own — no cron job required.

- **Railway / Render / Fly.io:** point at the `server/` dir, set the env vars
  from `.env.example`, start command `npm start`.
- **A VPS:** `npm install && npm start` behind nginx / a process manager (pm2).

Set the env vars in the host’s dashboard — never commit `.env`.

## API shape

```jsonc
GET /api/metrics
{
  "syncedAt": "2026-07-27T10:00:00.000Z",
  "currency": "USD",
  "sources": { "facebook": "live", "linkedin": "mock" },
  "facebook": { "current": { "leads":54, "spend":7888.39, "impressions":294571,
                             "clicks":4409, "reach":121462, "cpm":26.78,
                             "cpc":1.79, "ctr":1.5, "cpl":146.08 } },
  "linkedin": { "current": { "leads":0, "spend":0, ... } },
  "months": [ { "key":"2026-07", "label":"Jul 2026",
                "fbLeads":54, "fbSpend":7888.39, "liLeads":0, "liSpend":0 }, ... ]
}
```

`sources` tells you, per channel, whether the numbers are `live`, the `mock`
snapshot, or an `error: …` (the message explains what failed).
