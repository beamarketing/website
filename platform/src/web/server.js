import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../config.js';
import { Router, json, html, HttpError, requireAuth, notFound } from '../lib/http.js';
import { logger } from '../lib/logger.js';
import { api } from './routes/api.js';
import { track } from './routes/track.js';

const log = logger('http');
const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// Routes reachable without the admin token: the tracker, the beacons and the
// preference centre. Everything under /api requires the bearer token.
const PUBLIC_PREFIXES = ['/t/', '/u/'];

export function createServer() {
  const routers = [track, api];

  return http.createServer(async (req, res) => {
    const started = Date.now();
    let url;
    try {
      url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    } catch {
      res.writeHead(400); res.end(); return;
    }
    const pathname = decodeSafe(url.pathname);

    res.setHeader('x-content-type-options', 'nosniff');
    res.setHeader('referrer-policy', 'strict-origin-when-cross-origin');

    try {
      for (const router of routers) {
        const match = router.match(req.method, pathname);
        if (!match) continue;
        const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
        // The webhook endpoint is authenticated by a shared secret in the URL
        // rather than a bearer header, so providers can reach it.
        if (!isPublic) requireAuth(req);
        await match.handler(req, res, { params: match.params, url });
        logRequest(req, res, pathname, started);
        return;
      }

      // The console and its assets.
      if (req.method === 'GET' && serveStatic(pathname, res)) {
        logRequest(req, res, pathname, started);
        return;
      }

      throw notFound(`No route for ${req.method} ${pathname}`);
    } catch (err) {
      handleError(err, req, res, pathname, started);
    }
  });
}

function decodeSafe(p) {
  try { return decodeURIComponent(p); } catch { return p; }
}

function serveStatic(pathname, res) {
  const requested = pathname === '/' ? '/index.html' : pathname;
  // Normalise before joining so "../" cannot escape the public directory.
  const safe = normalize(requested).replace(/^(\.\.[/\\])+/, '');
  const file = join(publicDir, safe);
  if (!file.startsWith(publicDir)) return false;
  if (!existsSync(file) || !statSync(file).isFile()) return false;

  const type = MIME[extname(file).toLowerCase()] || 'application/octet-stream';
  const body = readFileSync(file);
  res.writeHead(200, {
    'content-type': type,
    'cache-control': file.endsWith('index.html') ? 'no-cache' : 'public, max-age=300',
  });
  res.end(body);
  return true;
}

function handleError(err, req, res, pathname, started) {
  const status = err instanceof HttpError ? err.status : 500;
  if (status >= 500) log.error(`${req.method} ${pathname} failed`, err);
  else log.debug(`${req.method} ${pathname} → ${status}: ${err.message}`);

  if (res.headersSent) { res.end(); return; }

  if (status === 401 && !pathname.startsWith('/api/')) {
    html(res, '<h1>401</h1><p>Admin token required.</p>', 401);
    return;
  }
  json(res, {
    error: err.message || 'Internal error',
    ...(err.detail ? { detail: err.detail } : {}),
    ...(status >= 500 && config.env !== 'production' ? { stack: err.stack } : {}),
  }, status);
  logRequest(req, res, pathname, started);
}

function logRequest(req, res, pathname, started) {
  // Beacons are high-volume and boring; only log them at debug level.
  const quiet = pathname.startsWith('/t/');
  const line = `${req.method} ${pathname} → ${res.statusCode} (${Date.now() - started}ms)`;
  if (quiet) log.debug(line);
  else if (res.statusCode >= 500) log.error(line);
  else log.info(line);
}
