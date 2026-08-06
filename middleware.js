// ============================================================================
// Edge Middleware — password gate for the entire deployment.
//
// Runs on Vercel BEFORE anything is served: the dashboard HTML, the API
// routes (/api/metrics, /api/ads), and every static asset. Nothing — not even
// the page markup with its baked-in numbers — is returned without a valid
// password, so campaign data cannot leak to anyone who just knows the URL.
//
// Configure in Vercel → Project → Settings → Environment Variables:
//   DASHBOARD_PASSWORD   (required)  the shared access password
//   DASHBOARD_USER       (optional)  username, defaults to "beamr"
//
// Auth uses HTTP Basic over HTTPS: the browser shows a native login prompt and
// remembers the credentials for the session. If DASHBOARD_PASSWORD is not set,
// the middleware denies every request (fail closed) rather than exposing data.
// ============================================================================

export const config = {
  // Run on everything except Vercel's internal endpoints.
  matcher: ["/((?!_vercel/).*)"],
};

// Length-independent constant-time-ish string compare, to avoid leaking the
// password length / prefix through response timing.
function safeEqual(a, b) {
  const enc = new TextEncoder();
  const ab = enc.encode(String(a));
  const bb = enc.encode(String(b));
  let diff = ab.length ^ bb.length;
  const n = Math.max(ab.length, bb.length);
  for (let i = 0; i < n; i++) diff |= (ab[i] || 0) ^ (bb[i] || 0);
  return diff === 0;
}

function unauthorized() {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Beamr Dashboard", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export default function middleware(req) {
  const PASS = process.env.DASHBOARD_PASSWORD;
  const USER = process.env.DASHBOARD_USER || "beamr";

  // Fail closed: with no password configured, deny everything so the dashboard
  // is never accidentally left open.
  if (!PASS) {
    return new Response(
      "Dashboard access is not configured. Set DASHBOARD_PASSWORD in the " +
        "Vercel project environment variables.",
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(header.slice(6).trim());
    } catch {
      return unauthorized();
    }
    const sep = decoded.indexOf(":");
    const user = sep === -1 ? decoded : decoded.slice(0, sep);
    const pass = sep === -1 ? "" : decoded.slice(sep + 1);
    // Evaluate both comparisons regardless, then AND — no early exit.
    const ok = safeEqual(user, USER) & safeEqual(pass, PASS);
    if (ok) return; // authorized → let the request through
  }

  return unauthorized();
}
