/*!
 * Beamr contact-based marketing tracker.
 * First-party, cookie-based, no third-party requests.
 *
 *   <script async src="https://abm.beamr.com/t/beamr.js"
 *           data-beamr-host="https://abm.beamr.com"></script>
 *
 * API (queued before load, so ordering never matters):
 *   beamr('identify', 'dor@beamr.com', { first_name: 'Dor' })
 *   beamr('track', 'demo_request', { plan: 'cloud' })
 *   beamr('page')            // manual page view, for custom routers
 *   beamr('consent', true)   // gate tracking behind your CMP
 *   beamr('reset')           // forget this browser (logout)
 */
(function (window, document) {
  'use strict';
  if (window.__beamrLoaded) return;
  window.__beamrLoaded = true;

  var script = document.currentScript || (function () {
    var s = document.getElementsByTagName('script');
    for (var i = s.length - 1; i >= 0; i--) if (/beamr\.js/.test(s[i].src)) return s[i];
    return null;
  })();

  var HOST = (script && script.getAttribute('data-beamr-host'))
    || (script && script.src ? script.src.replace(/\/t\/beamr\.js.*$/, '') : '');
  var COOKIE = 'bmr_vid';
  var CONSENT_COOKIE = 'bmr_consent';
  var COOKIE_DAYS = 365;
  var REQUIRE_CONSENT = (script && script.getAttribute('data-require-consent')) === 'true';
  var AUTO_FORMS = (script && script.getAttribute('data-track-forms')) !== 'false';
  var RESPECT_DNT = (script && script.getAttribute('data-respect-dnt')) === 'true';

  // ---------------------------------------------------------------- cookies --
  function readCookie(name) {
    var m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? decodeURIComponent(m[2]) : null;
  }
  function writeCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 864e5);
    // Set on the registrable domain so subdomains share one visitor id.
    var host = location.hostname;
    var parts = host.split('.');
    var domain = parts.length > 2 ? '.' + parts.slice(-2).join('.') : (parts.length === 2 ? '.' + host : '');
    var base = name + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString()
      + ';path=/;samesite=Lax' + (location.protocol === 'https:' ? ';secure' : '');
    document.cookie = base + (domain ? ';domain=' + domain : '');
    if (!readCookie(name)) document.cookie = base; // fall back to host-only
  }

  function uuid() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    var b = new Uint8Array(16);
    (window.crypto || window.msCrypto).getRandomValues(b);
    b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
    var h = [];
    for (var i = 0; i < 16; i++) h.push((b[i] + 0x100).toString(16).slice(1));
    return h.slice(0, 4).join('') + '-' + h.slice(4, 6).join('') + '-' + h.slice(6, 8).join('')
      + '-' + h.slice(8, 10).join('') + '-' + h.slice(10).join('');
  }

  function visitorId() {
    var v = readCookie(COOKIE);
    if (!v) { v = uuid(); writeCookie(COOKIE, v, COOKIE_DAYS); }
    return v;
  }

  // ---------------------------------------------------------------- consent --
  function hasConsent() {
    if (RESPECT_DNT && (navigator.doNotTrack === '1' || window.doNotTrack === '1')) return false;
    if (!REQUIRE_CONSENT) return true;
    return readCookie(CONSENT_COOKIE) === '1';
  }

  // -------------------------------------------------------------- transport --
  var queue = [];
  var flushTimer = null;

  function enqueue(event) {
    if (!hasConsent() || !HOST) return;
    event.vid = visitorId();
    event.ts = new Date().toISOString();
    var ids = metaIds();
    if (ids.fbp) event.fbp = ids.fbp;
    if (ids.fbc) event.fbc = ids.fbc;
    queue.push(event);
    if (queue.length >= 10) flush();
    else if (!flushTimer) flushTimer = setTimeout(flush, 1200);
  }

  function flush(sync) {
    if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
    if (!queue.length) return;
    var payload = JSON.stringify({ events: queue.splice(0, queue.length) });
    var url = HOST + '/t/e';
    // sendBeacon survives page unload; fetch keepalive is the modern fallback.
    if (sync && navigator.sendBeacon) {
      try {
        navigator.sendBeacon(url, new Blob([payload], { type: 'text/plain;charset=UTF-8' }));
        return;
      } catch (e) { /* fall through */ }
    }
    if (window.fetch) {
      fetch(url, {
        method: 'POST', body: payload, keepalive: true, credentials: 'include',
        headers: { 'content-type': 'text/plain;charset=UTF-8' },
      }).catch(function () {});
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.withCredentials = true;
      xhr.setRequestHeader('content-type', 'text/plain;charset=UTF-8');
      xhr.send(payload);
    }
  }

  // ------------------------------------------------------------------ pages --
  var lastPath = null;
  var pageEnteredAt = Date.now();
  var maxScroll = 0;
  var scrollMarks = {};

  function pageContext() {
    return {
      url: location.href,
      path: location.pathname,
      title: document.title,
      referrer: document.referrer || null,
    };
  }

  function trackPage(force) {
    var path = location.pathname + location.search;
    if (!force && path === lastPath) return;
    flushTimeOnPage();
    lastPath = path;
    pageEnteredAt = Date.now();
    maxScroll = 0;
    scrollMarks = {};
    var ctx = pageContext();
    ctx.type = 'page_view';
    ctx.screen = window.screen ? window.screen.width + 'x' + window.screen.height : null;
    enqueue(ctx);
  }

  function flushTimeOnPage() {
    if (!lastPath) return;
    var seconds = Math.round((Date.now() - pageEnteredAt) / 1000);
    if (seconds < 5 || seconds > 3600) return;
    enqueue({ type: 'time_on_page', url: location.href, path: location.pathname, value: seconds });
  }

  // -------------------------------------------------------------- identify --
  /**
   * Resolves who this browser belongs to. Three ways in, in priority order:
   *  1. bmr_c token on the URL  — stamped on every link in our emails.
   *  2. explicit beamr('identify', email) call.
   *  3. an email typed into a form we auto-capture.
   * The token form never puts a raw address in the URL bar.
   */
  function identify(emailOrToken, traits) {
    if (!emailOrToken) return;
    var payload = { type: 'identify', traits: traits || {} };
    if (String(emailOrToken).indexOf('@') > -1) payload.email = String(emailOrToken).trim();
    else payload.token = String(emailOrToken);
    enqueue(payload);
    flush();
  }

  /**
   * Meta identifiers.
   *
   * `_fbc` encodes the ad click that brought this person here; `_fbp` is the
   * browser id Meta's own pixel sets. Capturing both means a server-side
   * conversion can be matched to the ad that caused it even when the pixel is
   * blocked — which, for B2B audiences on desktop, is a large share of traffic.
   */
  function captureMetaIds() {
    var params = new URLSearchParams(location.search);
    var fbclid = params.get('fbclid');
    if (fbclid && !readCookie('_fbc')) {
      writeCookie('_fbc', 'fb.1.' + Date.now() + '.' + fbclid, COOKIE_DAYS);
    }
  }

  function metaIds() {
    return { fbp: readCookie('_fbp'), fbc: readCookie('_fbc') };
  }

  function identifyFromUrl() {
    var params = new URLSearchParams(location.search);
    var token = params.get('bmr_c');
    if (token) {
      identify(token);
      // Clean the token out of the address bar so it is not shared or bookmarked.
      params.delete('bmr_c');
      var qs = params.toString();
      try {
        history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
      } catch (e) { /* older browsers: leave it */ }
    }
  }

  // ---------------------------------------------------------------- listeners --
  function onScroll() {
    var doc = document.documentElement;
    var height = Math.max(doc.scrollHeight, document.body.scrollHeight) - window.innerHeight;
    if (height <= 0) return;
    var pct = Math.min(100, Math.round(((window.scrollY || doc.scrollTop) / height) * 100));
    if (pct <= maxScroll) return;
    maxScroll = pct;
    [25, 50, 75, 90].forEach(function (mark) {
      if (pct >= mark && !scrollMarks[mark]) {
        scrollMarks[mark] = 1;
        enqueue({ type: 'scroll_depth', url: location.href, path: location.pathname, value: mark });
      }
    });
  }

  function onClick(e) {
    var el = e.target;
    while (el && el !== document.body && el.tagName !== 'A' && el.tagName !== 'BUTTON') el = el.parentElement;
    if (!el || el === document.body) return;

    var attr = el.getAttribute && el.getAttribute('data-beamr-event');
    if (attr) {
      enqueue({ type: attr, url: location.href, path: location.pathname, meta: { text: (el.textContent || '').trim().slice(0, 100) } });
      return;
    }
    if (el.tagName !== 'A') return;
    var href = el.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#') return;

    var isDownload = el.hasAttribute('download') || /\.(pdf|zip|csv|xlsx?|docx?|pptx?|mp4|dmg|pkg)(\?|$)/i.test(href);
    var external = el.hostname && el.hostname !== location.hostname;
    if (!isDownload && !external) return;

    enqueue({
      type: isDownload ? 'download' : 'click',
      url: location.href,
      path: location.pathname,
      meta: { href: href.slice(0, 500), text: (el.textContent || '').trim().slice(0, 100), external: !!external },
    });
    flush(true);
  }

  function onSubmit(e) {
    if (!AUTO_FORMS) return;
    var form = e.target;
    if (!form || form.tagName !== 'FORM' || form.getAttribute('data-beamr-ignore') === 'true') return;

    var email = null;
    var fields = {};
    var inputs = form.querySelectorAll('input, select, textarea');
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      var name = (input.name || input.id || '').toLowerCase();
      var type = (input.type || '').toLowerCase();
      // Never collect secrets or payment data, whatever the form contains.
      if (type === 'password' || type === 'hidden' || /pass|card|cvv|ssn|token|secret/.test(name)) continue;
      if (!email && (type === 'email' || /email|e-mail/.test(name)) && input.value && input.value.indexOf('@') > -1) {
        email = input.value.trim();
        continue;
      }
      if (input.value && name && String(input.value).length < 200) fields[name] = String(input.value).slice(0, 200);
    }

    enqueue({
      type: 'form_submit',
      url: location.href,
      path: location.pathname,
      email: email,
      meta: { form_id: form.id || form.getAttribute('name') || null, fields: fields },
    });
    flush(true);
  }

  // ------------------------------------------------------------ SPA routing --
  function hookHistory() {
    ['pushState', 'replaceState'].forEach(function (method) {
      var original = history[method];
      if (typeof original !== 'function') return;
      history[method] = function () {
        var result = original.apply(this, arguments);
        setTimeout(function () { trackPage(false); }, 0);
        return result;
      };
    });
    window.addEventListener('popstate', function () { trackPage(false); });
  }

  // ---------------------------------------------------------------- command --
  function exec(command) {
    var args = Array.prototype.slice.call(arguments, 1);
    switch (command) {
      case 'identify': return identify(args[0], args[1]);
      case 'track': return enqueue({
        type: String(args[0] || 'custom'),
        url: location.href, path: location.pathname,
        value: args[1] && typeof args[1].value === 'number' ? args[1].value : null,
        meta: args[1] || {},
      });
      case 'page': return trackPage(true);
      case 'consent':
        writeCookie(CONSENT_COOKIE, args[0] ? '1' : '0', COOKIE_DAYS);
        if (args[0]) { trackPage(true); flush(); }
        return;
      case 'reset':
        // Clears our own first-party id. Meta's _fbp/_fbc belong to their
        // pixel, so we read them but never delete them.
        writeCookie(COOKIE, '', -1);
        queue.length = 0;
        return;
      case 'flush': return flush(true);
      default: return;
    }
  }

  // Drain whatever the snippet queued before this file arrived.
  var pending = (window.beamr && window.beamr.q) || [];
  window.beamr = function () { return exec.apply(null, arguments); };
  window.beamr.q = { push: function (a) { exec.apply(null, a); } };

  captureMetaIds();
  identifyFromUrl();
  hookHistory();
  trackPage(true);

  document.addEventListener('click', onClick, true);
  document.addEventListener('submit', onSubmit, true);
  window.addEventListener('scroll', function () {
    if (onScroll.pending) return;
    onScroll.pending = setTimeout(function () { onScroll.pending = null; onScroll(); }, 300);
  }, { passive: true });

  window.addEventListener('pagehide', function () { flushTimeOnPage(); flush(true); });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') { flushTimeOnPage(); flush(true); }
  });

  for (var i = 0; i < pending.length; i++) exec.apply(null, pending[i]);
})(window, document);
