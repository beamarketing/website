/* Beamr contact-based marketing console — vanilla ES modules, no build step. */

// ------------------------------------------------------------------ helpers --
const $ = (sel, root = document) => root.querySelector(sel);
const app = $('#app');

const TOKEN_KEY = 'beamr_abm_token';
let token = localStorage.getItem(TOKEN_KEY) || '';
let state = { view: 'overview', data: {}, days: 30, loading: false };

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const num = (n) => Number(n || 0).toLocaleString('en-US');
const money = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (n) => `${Number(n || 0).toFixed(1)}%`;

function ago(iso) {
  if (!iso) return '—';
  const diff = (Date.now() - new Date(iso + (iso.includes('Z') || iso.includes('+') ? '' : 'Z')).getTime()) / 1000;
  if (Number.isNaN(diff)) return '—';
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const name = (c) => [c.first_name, c.last_name].filter(Boolean).join(' ') || c.email || '—';

function toast(message, kind = '') {
  const host = $('#toasts');
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.textContent = message;
  host.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; }, 3600);
  setTimeout(() => el.remove(), 4000);
}

// ---------------------------------------------------------------------- api --
async function api(path, { method = 'GET', body = null, raw = false } = {}) {
  const res = await fetch(path, {
    method,
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(body && !raw ? { 'content-type': 'application/json' } : {}),
      ...(raw ? { 'content-type': 'text/csv' } : {}),
    },
    ...(body ? { body: raw ? body : JSON.stringify(body) } : {}),
  });
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    token = '';
    renderLogin('That token was rejected.');
    throw new Error('Unauthorized');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// -------------------------------------------------------------------- login --
function renderLogin(error = '') {
  app.innerHTML = `
    <div class="login-wrap"><div class="card login"><div class="card-body">
      <div class="brand" style="padding-left:0">
        <div class="brand-mark">b</div>
        <div class="brand-text">Beamr<small>Contact-based marketing</small></div>
      </div>
      <h1>Admin token</h1>
      <p>Paste the token printed when the server started, or the value of <code>ADMIN_TOKEN</code>.</p>
      ${error ? `<div class="banner"><span>⚠</span><div>${esc(error)}</div></div>` : ''}
      <form id="login-form">
        <label class="field"><span>Token</span>
          <input type="text" id="token-input" autocomplete="off" spellcheck="false" placeholder="paste token" /></label>
        <button class="btn primary" style="width:100%;justify-content:center" type="submit">Open console</button>
      </form>
    </div></div></div>`;
  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    token = $('#token-input').value.trim();
    try {
      await api('/api/status');
      localStorage.setItem(TOKEN_KEY, token);
      boot();
    } catch { /* renderLogin already re-rendered on 401 */ }
  });
  $('#token-input')?.focus();
}

// --------------------------------------------------------------------- nav --
const NAV = [
  { group: 'Measure', items: [
    { id: 'overview', label: 'Overview', icon: '◈' },
    { id: 'activity', label: 'Activity', icon: '⟳' },
    { id: 'accounts', label: 'Accounts', icon: '⌂' },
  ] },
  { group: 'Audience', items: [
    { id: 'contacts', label: 'Contacts', icon: '☰' },
    { id: 'lists', label: 'Lists & segments', icon: '⋮⋮' },
  ] },
  { group: 'Channels', items: [
    { id: 'email', label: 'Email', icon: '✉' },
    { id: 'ads', label: 'Advertising', icon: '◎' },
    { id: 'journeys', label: 'Journeys', icon: '⤳' },
  ] },
  { group: 'Configure', items: [
    { id: 'setup', label: 'Setup & tracking', icon: '⚙' },
  ] },
];

function shell() {
  const status = state.status || {};
  const alerts = (state.data.dashboard?.alerts || []).length;
  return `
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">b</div>
        <div class="brand-text">Beamr<small>Contact-based marketing</small></div>
      </div>
      ${NAV.map((g) => `
        <div class="nav-label">${g.group}</div>
        ${g.items.map((i) => `
          <button class="nav-item ${state.view === i.id ? 'active' : ''}" data-view="${i.id}">
            <span class="ico">${i.icon}</span><span>${i.label}</span>
            ${i.id === 'overview' && alerts ? `<span class="badge">${alerts}</span>` : ''}
          </button>`).join('')}`).join('')}
      <div class="sidebar-foot">
        <div class="mode-pill"><span class="dot ${status.email?.dry_run ? '' : 'live'}"></span>
          Email · ${esc(status.email?.provider || '—')}</div>
        <div class="mode-pill"><span class="dot ${status.linkedin?.configured ? 'live' : ''}"></span>
          LinkedIn · ${status.linkedin?.configured ? 'live' : 'dry run'}</div>
        <div class="mode-pill"><span class="dot ${status.meta?.configured ? 'live' : ''}"></span>
          Meta · ${status.meta?.configured ? 'live' : 'dry run'}</div>
      </div>
    </aside>
    <main class="main">
      <div class="topbar">
        <div>
          <h1 id="page-title">Overview</h1>
          <div class="sub" id="page-sub"></div>
        </div>
        <div class="topbar-actions">
          <select id="range" class="fixed" style="width:auto;padding:6px 10px;font-size:12.5px">
            <option value="7" ${state.days === 7 ? 'selected' : ''}>Last 7 days</option>
            <option value="30" ${state.days === 30 ? 'selected' : ''}>Last 30 days</option>
            <option value="90" ${state.days === 90 ? 'selected' : ''}>Last 90 days</option>
            <option value="365" ${state.days === 365 ? 'selected' : ''}>Last 12 months</option>
          </select>
          <button class="btn ghost icon" id="theme-toggle" title="Toggle light / dark" aria-label="Toggle theme">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none" />
            </svg>
          </button>
          <button class="btn ghost" id="refresh">↻ Refresh</button>
        </div>
      </div>
      <div class="content" id="content"></div>
    </main>
  </div>
  <div class="drawer-back" id="drawer-back"></div>
  <aside class="drawer" id="drawer"></aside>`;
}

function bindShell() {
  app.querySelectorAll('.nav-item').forEach((b) =>
    b.addEventListener('click', () => go(b.dataset.view)));
  $('#refresh').addEventListener('click', () => load(true));
  $('#range').addEventListener('change', (e) => { state.days = Number(e.target.value); load(true); });
  $('#theme-toggle').addEventListener('click', () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    localStorage.setItem('beamr_theme', next);
    render();
  });
  $('#drawer-back').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeDrawer(); closeModal(); } });
}

function go(view) {
  state.view = view;
  location.hash = view;
  render();
  loadView();
}

// ------------------------------------------------------------------ drawer --
function openDrawer(html) {
  $('#drawer').innerHTML = html;
  $('#drawer').classList.add('open');
  $('#drawer-back').classList.add('open');
  $('#drawer').querySelector('[data-close]')?.addEventListener('click', closeDrawer);
}
function closeDrawer() {
  $('#drawer')?.classList.remove('open');
  $('#drawer-back')?.classList.remove('open');
}

// ------------------------------------------------------------------- modal --
function openModal({ title, subtitle = '', body, confirm = 'Save', wide = false, onConfirm }) {
  closeModal();
  const back = document.createElement('div');
  back.className = 'modal-back';
  back.id = 'modal-back';
  back.innerHTML = `
    <div class="modal ${wide ? 'wide' : ''}">
      <div class="modal-head"><h2>${esc(title)}</h2>${subtitle ? `<p>${esc(subtitle)}</p>` : ''}</div>
      <div class="modal-body" id="modal-body">${body}</div>
      <div class="modal-foot">
        <button class="btn ghost" id="modal-cancel">Cancel</button>
        <button class="btn primary" id="modal-ok">${esc(confirm)}</button>
      </div>
    </div>`;
  document.body.appendChild(back);
  back.addEventListener('click', (e) => { if (e.target === back) closeModal(); });
  $('#modal-cancel').addEventListener('click', closeModal);
  $('#modal-ok').addEventListener('click', async () => {
    const btn = $('#modal-ok');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>';
    try { await onConfirm($('#modal-body')); closeModal(); }
    catch (err) { toast(err.message, 'err'); btn.disabled = false; btn.textContent = confirm; }
  });
  return back;
}
function closeModal() { $('#modal-back')?.remove(); }

// ------------------------------------------------------------------ charts --
/** Multi-series line chart, drawn as inline SVG. */
function lineChart(series, { height = 190, format = num } = {}) {
  const labels = series.labels || [];
  if (!labels.length) return '<div class="empty">No data in this range yet.</div>';
  const w = 820;
  const h = height;
  const pad = { t: 12, r: 14, b: 26, l: 46 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const max = Math.max(1, ...series.lines.flatMap((l) => l.values.map((v) => Number(v) || 0)));
  const x = (i) => pad.l + (labels.length === 1 ? iw / 2 : (i / (labels.length - 1)) * iw);
  const y = (v) => pad.t + ih - ((Number(v) || 0) / max) * ih;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => `
    <line x1="${pad.l}" x2="${w - pad.r}" y1="${pad.t + ih * (1 - f)}" y2="${pad.t + ih * (1 - f)}"
      stroke="var(--grid)" stroke-width="1" />
    <text x="${pad.l - 8}" y="${pad.t + ih * (1 - f) + 4}" text-anchor="end"
      font-size="10" fill="var(--text-muted)">${format(Math.round(max * f))}</text>`).join('');

  const paths = series.lines.map((line) => {
    const d = line.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    const area = `${d} L${x(line.values.length - 1).toFixed(1)},${pad.t + ih} L${x(0).toFixed(1)},${pad.t + ih} Z`;
    return `
      ${line.fill ? `<path d="${area}" fill="${line.color}" opacity=".10" />` : ''}
      <path d="${d}" fill="none" stroke="${line.color}" stroke-width="2"
        stroke-linejoin="round" stroke-linecap="round" />
      ${line.values.map((v, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="2.5"
        fill="${line.color}"><title>${esc(labels[i])}: ${format(v)}</title></circle>`).join('')}`;
  }).join('');

  const step = Math.max(1, Math.ceil(labels.length / 8));
  const xLabels = labels.map((l, i) => (i % step === 0 || i === labels.length - 1)
    ? `<text x="${x(i).toFixed(1)}" y="${h - 6}" text-anchor="middle" font-size="10"
        fill="var(--text-muted)">${esc(String(l).slice(5))}</text>` : '').join('');

  return `
    <svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img">
      ${gridLines}${paths}${xLabels}
    </svg>
    <div class="legend" style="margin-top:10px">
      ${series.lines.map((l) => `<span><i style="background:${l.color}"></i>${esc(l.label)}</span>`).join('')}
    </div>`;
}

function funnelChart(steps) {
  if (!steps?.length) return '<div class="empty">No funnel data yet.</div>';
  const max = Math.max(1, ...steps.map((s) => s.contacts));
  return steps.map((s, i) => {
    const prev = i ? steps[i - 1].contacts : null;
    // Stages are nested, so this is a genuine step conversion rate.
    const drop = prev ? Math.round((s.contacts / Math.max(1, prev)) * 100) : null;
    return `<div class="funnel-step">
      <div class="name">${esc(s.stage)}</div>
      <div class="track"><div class="fill" style="width:${Math.max(3, (s.contacts / max) * 100)}%">${num(s.contacts)}</div></div>
      <div class="drop">${drop !== null ? `${drop}%` : ''}</div>
    </div>`;
  }).join('');
}

// ------------------------------------------------------------------- views --
const kpi = (label, value, meta = '', suffix = '') => `
  <div class="card kpi">
    <div class="label">${esc(label)}</div>
    <div class="value">${value}${suffix ? `<small>${esc(suffix)}</small>` : ''}</div>
    <div class="meta">${meta}</div>
  </div>`;

function viewOverview() {
  const d = state.data.dashboard;
  if (!d) return loadingBlock();
  const o = d.overview;

  const days = [...new Set(d.event_series.map((r) => r.day))].sort();
  const byChannel = (ch) => days.map((day) =>
    d.event_series.filter((r) => r.day === day && r.channel === ch).reduce((a, r) => a + r.n, 0));

  const unconfigured = ['linkedin', 'meta'].filter((p) => !state.status?.[p]?.configured);
  const dryRunBanner = (unconfigured.length || state.status?.email?.dry_run) ? `
    <div class="banner"><span>◔</span><div>
      <strong>Running in dry-run mode.</strong>
      ${state.status?.email?.dry_run ? 'Email writes <code>.eml</code> files to <code>data/outbox</code> instead of sending. ' : ''}
      ${unconfigured.length ? `${unconfigured.map((p) => p === 'meta' ? 'Meta' : 'LinkedIn').join(' and ')} audiences sync locally and are not pushed. ` : ''}
      Everything else — tracking, scoring, segmentation, journeys — is fully live.
      <a href="#setup" data-nav="setup">Add credentials in Setup →</a>
    </div></div>` : '';

  return `
    ${dryRunBanner}
    <div class="grid g4" style="margin-bottom:16px">
      ${kpi('Contacts', num(o.contacts.total),
        `<span class="tag good">${num(o.contacts.grade_a)} A</span>
         <span class="tag info">${num(o.contacts.grade_b)} B</span>
         <span style="color:var(--text-muted)">+${num(o.contacts.new_contacts)} new</span>`)}
      ${kpi('Engaged contacts', num(o.engagement.engaged_contacts),
        `${num(o.engagement.events)} events · ${pct(o.engagement.identification_rate)} identified`)}
      ${kpi('Ad spend', money(o.ads.spend),
        (d.platform_comparison || []).filter((p) => p.spend > 0)
          .map((p) => `<span class="tag ${p.platform === 'meta' ? 'info' : 'accent'}">${p.platform === 'meta' ? 'Meta' : 'LI'} ${money(p.spend)}</span>`).join(' ')
        || `${num(o.ads.impressions)} impr · ${pct(o.ads.ctr)} CTR`)}
      ${kpi('Email', num(o.email.sent),
        `${pct(o.email.open_rate)} open · ${pct(o.email.click_rate)} click`, 'sent')}
    </div>

    <div class="grid g-2-1" style="margin-bottom:16px">
      <div class="card">
        <div class="card-head"><h3>Engagement by channel</h3>
          <span class="hint">events per day, last ${state.days} days</span></div>
        <div class="card-body">${lineChart({
          labels: days,
          lines: [
            { label: 'Website', values: byChannel('web'), color: 'var(--st-info)', fill: true },
            { label: 'Email', values: byChannel('email'), color: 'var(--accent)' },
            { label: 'LinkedIn', values: byChannel('linkedin'), color: 'var(--accent-2)' },
          ],
        })}</div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Contact funnel</h3><span class="hint">distinct people</span></div>
        <div class="card-body">${funnelChart(o.funnel)}</div>
      </div>
    </div>

    <div class="grid g-2-1" style="margin-bottom:16px">
      <div class="card">
        <div class="card-head"><h3>Hot contacts</h3>
          <span class="hint">highest score, most recently active</span>
          <span class="spacer"></span>
          <button class="btn sm ghost" data-nav="contacts">All contacts →</button></div>
        <div class="card-body flush"><div class="table-wrap">${
          d.hot.length ? `<table>
            <thead><tr><th></th><th>Contact</th><th>Company</th><th class="num">Score</th>
              <th>Last page</th><th class="num">7d</th><th>Last seen</th></tr></thead>
            <tbody>${d.hot.map((c) => `
              <tr class="clickable" data-contact="${esc(c.id)}">
                <td><span class="grade ${esc(c.grade)}">${esc(c.grade)}</span></td>
                <td><div style="font-weight:600">${esc(name(c))}</div>
                  <div style="color:var(--text-muted);font-size:11.5px">${esc(c.job_title || c.email)}</div></td>
                <td>${esc(c.company || '—')}</td>
                <td class="num" style="font-weight:650">${c.score}</td>
                <td class="trunc" style="color:var(--text-secondary)">${esc(c.last_page || '—')}</td>
                <td class="num">${num(c.events_7d)}</td>
                <td class="nowrap" style="color:var(--text-muted)">${ago(c.last_event_at)}</td>
              </tr>`).join('')}</tbody></table>`
            : '<div class="empty"><div class="big">◔</div>No contacts have crossed the hot threshold yet.</div>'
        }</div></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Alerts</h3><span class="spacer"></span>
          ${d.alerts.length ? '<button class="btn sm ghost" id="clear-alerts">Mark all read</button>' : ''}</div>
        <div class="card-body" style="max-height:420px;overflow-y:auto">${
          d.alerts.length ? `<div class="tl">${d.alerts.map((a) => `
            <div class="tl-item ${a.kind === 'hot_contact' ? 'web' : 'system'}">
              <div class="t">${esc(a.title)}</div>
              <div class="m">${ago(a.created_at)}</div>
            </div>`).join('')}</div>`
            : '<div class="empty">Nothing needs your attention.</div>'
        }</div>
      </div>
    </div>

    <div class="grid g2">
      <div class="card">
        <div class="card-head"><h3>Channel influence</h3>
          <span class="hint">contacts touched → later showed high intent</span></div>
        <div class="card-body flush">${
          d.channel_influence.length ? `<table>
            <thead><tr><th>Channel</th><th class="num">Contacts</th><th class="num">Events</th>
              <th class="num">Influenced high intent</th></tr></thead>
            <tbody>${d.channel_influence.map((c) => `
              <tr><td style="text-transform:capitalize;font-weight:600">${esc(c.channel)}</td>
                <td class="num">${num(c.contacts_touched)}</td>
                <td class="num">${num(c.events)}</td>
                <td class="num"><span class="tag ${c.influenced_high_intent ? 'good' : ''}">${num(c.influenced_high_intent)}</span></td>
              </tr>`).join('')}</tbody></table>` : '<div class="empty">No channel activity yet.</div>'}
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Top pages</h3><span class="hint">by known vs anonymous traffic</span></div>
        <div class="card-body flush"><div class="table-wrap" style="max-height:320px">${
          d.top_pages.length ? `<table>
            <thead><tr><th>Path</th><th class="num">Views</th><th class="num">Known</th><th class="num">Anon</th></tr></thead>
            <tbody>${d.top_pages.map((p) => `
              <tr><td class="trunc">${esc(p.path)}</td>
                <td class="num">${num(p.views)}</td>
                <td class="num" style="color:var(--accent);font-weight:600">${num(p.contacts)}</td>
                <td class="num" style="color:var(--text-muted)">${num(p.anon_visitors)}</td>
              </tr>`).join('')}</tbody></table>` : '<div class="empty">No page views recorded yet.</div>'}
        </div></div>
      </div>
    </div>`;
}

function viewContacts() {
  const d = state.data.contacts;
  if (!d) return loadingBlock();
  return `
    <div class="card" style="margin-bottom:16px"><div class="card-body">
      <div class="row-inline">
        <label class="field" style="margin:0"><span>Search</span>
          <input type="text" id="c-search" placeholder="name, email, company, title"
            value="${esc(state.filters?.q || '')}" /></label>
        <label class="field fixed" style="margin:0;width:130px"><span>Grade</span>
          <select id="c-grade">${['', 'A', 'B', 'C', 'D'].map((g) =>
            `<option value="${g}" ${state.filters?.grade === g ? 'selected' : ''}>${g || 'Any'}</option>`).join('')}</select></label>
        <label class="field fixed" style="margin:0;width:160px"><span>Status</span>
          <select id="c-status">${['', 'active', 'unsubscribed', 'bounced', 'complained'].map((s) =>
            `<option value="${s}" ${state.filters?.status === s ? 'selected' : ''}>${s || 'Any'}</option>`).join('')}</select></label>
        <label class="field fixed" style="margin:0;width:160px"><span>Lifecycle</span>
          <select id="c-lifecycle">${['', 'target', 'engaged', 'mql', 'sql', 'opportunity', 'customer'].map((s) =>
            `<option value="${s}" ${state.filters?.lifecycle === s ? 'selected' : ''}>${s || 'Any'}</option>`).join('')}</select></label>
        <div class="fixed" style="display:flex;gap:8px">
          <button class="btn primary" id="c-import">↑ Import CSV</button>
          <button class="btn" id="c-add">+ Contact</button>
        </div>
      </div>
    </div></div>

    <div class="card"><div class="card-head">
      <h3>${num(d.total)} contacts</h3>
      <span class="hint">showing ${d.contacts.length}</span>
      <span class="spacer"></span>
      <button class="btn sm ghost" id="c-export">↓ Export CSV</button>
    </div><div class="card-body flush"><div class="table-wrap">${
      d.contacts.length ? `<table>
        <thead><tr><th></th><th>Contact</th><th>Company</th><th>Title</th>
          <th>Stage</th><th class="num">Score</th><th>Status</th><th>Last seen</th></tr></thead>
        <tbody>${d.contacts.map((c) => `
          <tr class="clickable" data-contact="${esc(c.id)}">
            <td><span class="grade ${esc(c.grade)}">${esc(c.grade)}</span></td>
            <td><div style="font-weight:600">${esc(name(c))}</div>
              <div style="color:var(--text-muted);font-size:11.5px">${esc(c.email)}</div></td>
            <td>${esc(c.company || '—')}</td>
            <td class="trunc" style="color:var(--text-secondary)">${esc(c.job_title || '—')}</td>
            <td><span class="tag">${esc(c.lifecycle_stage)}</span></td>
            <td class="num" style="font-weight:650">${c.score}</td>
            <td>${statusTag(c.status)}</td>
            <td class="nowrap" style="color:var(--text-muted)">${ago(c.last_seen_at)}</td>
          </tr>`).join('')}</tbody></table>`
        : `<div class="empty"><div class="big">☰</div>
             No contacts yet. Import your dedicated list to get started.</div>`
    }</div></div></div>`;
}

const statusTag = (s) => {
  const map = { active: 'good', unsubscribed: 'warn', bounced: 'crit', complained: 'crit', suppressed: 'crit' };
  return `<span class="tag ${map[s] || ''}">${esc(s)}</span>`;
};

function viewLists() {
  const lists = state.data.lists;
  if (!lists) return loadingBlock();
  return `
    <div class="banner info"><span>◈</span><div>
      A <strong>list</strong> is who you target. A <strong>static</strong> list holds an explicit set of
      people — your dedicated list. A <strong>dynamic</strong> list is a saved rule that re-evaluates
      itself, so "VPs at media companies who viewed pricing in the last 30 days" stays current on its own.
    </div></div>

    <div style="display:flex;gap:9px;margin-bottom:16px">
      <button class="btn primary" id="l-new">+ New list</button>
      <button class="btn" id="l-builder">⋮⋮ Segment builder</button>
    </div>

    <div class="grid g3">${
      lists.length ? lists.map((l) => `
        <div class="card"><div class="card-body">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <strong style="font-size:14px">${esc(l.name)}</strong>
            ${l.is_dedicated ? '<span class="tag accent">dedicated</span>' : ''}
            <span class="tag ${l.kind === 'dynamic' ? 'info' : ''}">${esc(l.kind)}</span>
          </div>
          <div style="font-size:12.5px;color:var(--text-muted);margin-bottom:14px;min-height:34px">
            ${esc(l.description || 'No description')}</div>
          <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:14px">
            <span style="font-size:24px;font-weight:750">${num(l.member_count)}</span>
            <span style="font-size:12px;color:var(--text-muted)">contacts</span>
          </div>
          <div style="display:flex;gap:7px;flex-wrap:wrap">
            <button class="btn sm" data-list-view="${esc(l.id)}">View</button>
            ${l.kind === 'dynamic' ? `<button class="btn sm ghost" data-list-refresh="${esc(l.id)}">↻ Refresh</button>` : ''}
            <button class="btn sm ghost" data-list-audience="${esc(l.id)}">→ LinkedIn audience</button>
          </div>
        </div></div>`).join('')
        : '<div class="card"><div class="empty"><div class="big">⋮⋮</div>No lists yet.</div></div>'
    }</div>`;
}

function viewEmail() {
  const d = state.data.email;
  if (!d) return loadingBlock();
  const { campaigns, templates } = d;
  return `
    <div class="tabs">
      <button class="tab ${state.tab !== 'templates' ? 'active' : ''}" data-tab="campaigns">Campaigns</button>
      <button class="tab ${state.tab === 'templates' ? 'active' : ''}" data-tab="templates">Templates</button>
    </div>
    ${state.tab === 'templates' ? `
      <button class="btn primary" id="t-new" style="margin-bottom:16px">+ New template</button>
      <div class="grid g3">${templates.length ? templates.map((t) => `
        <div class="card"><div class="card-body">
          <strong style="font-size:14px">${esc(t.name)}</strong>
          <div style="font-size:12.5px;color:var(--text-secondary);margin:8px 0 14px">${esc(t.subject)}</div>
          <button class="btn sm" data-template="${esc(t.id)}">Edit</button>
        </div></div>`).join('')
        : '<div class="card"><div class="empty"><div class="big">✉</div>No templates yet.</div></div>'}</div>`
    : `
      <button class="btn primary" id="cp-new" style="margin-bottom:16px">+ New campaign</button>
      <div class="grid" style="gap:14px">${campaigns.length ? campaigns.map((c) => `
        <div class="card"><div class="card-body">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap">
            <strong style="font-size:15px">${esc(c.name)}</strong>
            ${campaignTag(c.status)}
            <span class="spacer" style="margin-left:auto"></span>
            ${c.status === 'draft' || c.status === 'paused' ? `
              <button class="btn sm ghost" data-cp-preflight="${esc(c.id)}">Preflight</button>
              <button class="btn sm primary" data-cp-send="${esc(c.id)}">Send</button>` : ''}
            ${c.status === 'sending' ? `<button class="btn sm ghost" data-cp-pause="${esc(c.id)}">Pause</button>` : ''}
            <button class="btn sm ghost" data-cp-view="${esc(c.id)}">Details</button>
          </div>
          <div class="grid g4" style="gap:12px">
            ${miniStat('Sent', num(c.stats.sent), `${num(c.stats.queued)} queued`)}
            ${miniStat('Opened', pct(c.stats.open_rate), `${num(c.stats.opened)} contacts`)}
            ${miniStat('Clicked', pct(c.stats.click_rate), `${pct(c.stats.click_to_open_rate)} CTOR`)}
            ${miniStat('Bounced', pct(c.stats.bounce_rate), `${num(c.stats.skipped)} skipped`)}
          </div>
        </div></div>`).join('')
        : '<div class="card"><div class="empty"><div class="big">✉</div>No campaigns yet.</div></div>'}</div>`}`;
}

const miniStat = (label, value, meta) => `
  <div style="background:var(--surface-2);border-radius:11px;padding:11px 13px">
    <div style="font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);font-weight:600">${esc(label)}</div>
    <div style="font-size:19px;font-weight:700;margin:3px 0 1px;font-variant-numeric:tabular-nums">${value}</div>
    <div style="font-size:11px;color:var(--text-muted)">${esc(meta)}</div>
  </div>`;

const campaignTag = (s) => {
  const map = { draft: '', scheduled: 'info', sending: 'warn', sent: 'good', paused: 'warn', cancelled: 'crit' };
  return `<span class="tag ${map[s] || ''}">${esc(s)}</span>`;
};

function viewAds() {
  const d = state.data.ads;
  if (!d) return loadingBlock();
  const { audiences, campaigns, influence, comparison, platforms } = d;
  const filter = state.adPlatform || 'all';
  const shown = filter === 'all' ? audiences : audiences.filter((a) => a.platform === filter);
  const shownCampaigns = filter === 'all' ? campaigns : campaigns.filter((c) => c.platform === filter);

  const unconfigured = platforms.platforms.filter((p) => !p.configured);

  return `
    ${unconfigured.length ? `<div class="banner"><span>⚠</span><div>
      <strong>${unconfigured.map((p) => p.label).join(' and ')} not connected.</strong>
      Audiences build, diff and cohort locally but are not pushed, and no metrics are pulled.
      <a href="#setup" data-nav="setup">Setup →</a></div></div>` : ''}

    <div class="banner info"><span>ℹ</span><div>
      Neither platform reports impressions per member — both report per ad object. Contact-level
      attribution comes from making the ad object small: each <strong>cohort</strong> is its own
      audience with its own creative and tracking URL, so a report resolves to a handful of named
      people instead of one campaign total. Clicks resolve to the individual either way.
      Meta's ~100 serving floor allows roughly 3× tighter cohorts than LinkedIn's ~300.
    </div></div>

    <div class="tabs">
      ${['all', 'linkedin', 'meta'].map((k) => `
        <button class="tab ${filter === k ? 'active' : ''}" data-platform="${k}">
          ${k === 'all' ? 'Both platforms' : k === 'meta' ? 'Meta' : 'LinkedIn'}</button>`).join('')}
    </div>

    <div class="grid g2" style="margin-bottom:16px">
      ${comparison.map((p) => `
        <div class="card"><div class="card-body">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
            <strong style="font-size:14px">${esc(p.label)}</strong>
            <span class="tag ${p.configured ? 'good' : 'warn'}">${p.configured ? 'live' : 'dry run'}</span>
            <span class="tag" title="Minimum matched members the platform will serve">floor ${num(p.min_audience_size)}</span>
          </div>
          <div class="grid g4" style="gap:10px">
            ${miniStat('Spend', money(p.spend), `${num(p.impressions)} impr`)}
            ${miniStat('CPC', money(p.cpc), `${pct(p.ctr)} CTR`)}
            ${miniStat('CPM', money(p.cpm), `${num(p.clicks)} clicks`)}
            ${miniStat('Named', num(p.identified_engagements), p.cost_per_identified ? `${money(p.cost_per_identified)} each` : 'contacts')}
          </div>
        </div></div>`).join('')}
    </div>

    <div style="display:flex;gap:9px;margin-bottom:16px;flex-wrap:wrap">
      <button class="btn primary" id="au-new">+ New audience</button>
      <button class="btn" id="au-mirror">⇄ Mirror list to both platforms</button>
      <button class="btn ghost" id="ads-sync">↻ Sync now</button>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-head"><h3>Matched audiences</h3>
        <span class="hint">your lists, mirrored into each platform as hashed identities</span></div>
      <div class="card-body flush">${shown.length ? `<table>
        <thead><tr><th>Audience</th><th>Platform</th><th>Status</th><th class="num">Contacts</th>
          <th class="num">Matched</th><th class="num">Cohorts</th><th>Last sync</th><th></th></tr></thead>
        <tbody>${shown.map((a) => `
          <tr class="clickable" data-audience="${esc(a.id)}">
            <td><strong>${esc(a.name)}</strong>
              ${a.last_error ? `<div style="color:var(--st-crit);font-size:11px">${esc(a.last_error)}</div>` : ''}
              ${a.member_count && a.member_count < a.min_audience_size
                ? `<div style="color:var(--st-warn);font-size:11px">below the ${num(a.min_audience_size)} serving floor — will not deliver</div>` : ''}</td>
            <td>${platformTag(a.platform)}</td>
            <td>${audienceTag(a.status)}</td>
            <td class="num">${num(a.member_count)}</td>
            <td class="num">${num(a.matched_count)}</td>
            <td class="num">${a.cohort_mode ? `<span class="tag accent">${num(a.cohorts)}</span>` : '<span style="color:var(--text-muted)">off</span>'}</td>
            <td class="nowrap" style="color:var(--text-muted)">${ago(a.last_synced_at)}</td>
            <td class="num nowrap">
              <button class="btn sm ghost" data-au-cohort="${esc(a.id)}">${a.cohort_mode ? 'Cohorts' : 'Enable cohorts'}</button>
              <button class="btn sm ghost" data-au-sync="${esc(a.id)}">↻</button></td>
          </tr>`).join('')}</tbody></table>`
        : '<div class="empty"><div class="big">◎</div>No audiences yet.</div>'}
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-head"><h3>Ad campaign performance</h3>
        <span class="hint">aggregate spend beside the contacts we can actually name</span></div>
      <div class="card-body flush"><div class="table-wrap">${shownCampaigns.length ? `<table>
        <thead><tr><th>Campaign</th><th>Platform</th><th>Audience</th><th class="num">Impr.</th>
          <th class="num">Clicks</th><th class="num">CTR</th><th class="num">Spend</th><th class="num">CPC</th>
          <th class="num">Named contacts</th><th class="num">Lead forms</th><th class="num">Cost / contact</th></tr></thead>
        <tbody>${shownCampaigns.map((c) => `
          <tr><td><strong>${esc(c.name)}</strong>
              <div style="font-size:11px;color:var(--text-muted)">${esc(c.status || '')}${c.cohorts ? ` · ${c.cohorts} cohorts` : ''}</div></td>
            <td>${platformTag(c.platform)}</td>
            <td style="color:var(--text-secondary)" class="trunc">${esc(c.audience_name || '—')}</td>
            <td class="num">${num(c.impressions)}</td>
            <td class="num">${num(c.clicks)}</td>
            <td class="num">${pct(c.ctr)}</td>
            <td class="num">${money(c.spend)}</td>
            <td class="num">${money(c.cpc)}</td>
            <td class="num" style="color:var(--accent);font-weight:650">${num(c.identified_contacts)}</td>
            <td class="num">${num(c.lead_form_submissions)}</td>
            <td class="num">${c.cost_per_identified_contact ? money(c.cost_per_identified_contact) : '—'}</td>
          </tr>`).join('')}</tbody></table>`
        : '<div class="empty">No ad metrics yet. Connect a platform and run a sync.</div>'}
      </div></div>
    </div>

    <div class="card">
      <div class="card-head"><h3>Audience influence</h3>
        <span class="hint">of the people we targeted, who then did something</span></div>
      <div class="card-body flush">${influence.length ? `<table>
        <thead><tr><th>Audience</th><th>Platform</th><th class="num">Targeted</th><th class="num">Engaged after</th>
          <th class="num">Visited site</th><th class="num">Clicked ad</th><th class="num">Lead form</th>
          <th class="num">Rate</th></tr></thead>
        <tbody>${influence.map((i) => `
          <tr><td><strong>${esc(i.name)}</strong></td>
            <td>${platformTag(i.platform)}</td>
            <td class="num">${num(i.targeted)}</td>
            <td class="num">${num(i.engaged_after_targeting)}</td>
            <td class="num">${num(i.visited_site)}</td>
            <td class="num">${num(i.clicked_ad)}</td>
            <td class="num">${num(i.submitted_lead_form)}</td>
            <td class="num"><span class="tag ${i.engagement_rate > 15 ? 'good' : i.engagement_rate > 5 ? 'warn' : ''}">${pct(i.engagement_rate)}</span></td>
          </tr>`).join('')}</tbody></table>`
        : '<div class="empty">Push an audience to start measuring influence.</div>'}
      </div>
    </div>`;
}

const platformTag = (p) => p === 'meta'
  ? '<span class="tag info">Meta</span>'
  : '<span class="tag accent">LinkedIn</span>';

const audienceTag = (s) => {
  const map = { ready: 'good', syncing: 'info', pending: 'warn', error: 'crit' };
  return `<span class="tag ${map[s] || ''}">${esc(s)}</span>`;
};

function viewJourneys() {
  const journeys = state.data.journeys;
  if (!journeys) return loadingBlock();
  return `
    <div class="banner info"><span>⤳</span><div>
      A journey watches for one thing and reacts across every channel. This is what makes the
      platform an engine: "a targeted VP read the pricing page" can mean
      "send the case study, add them to the retargeting audience, tell sales" — automatically.
    </div></div>
    <button class="btn primary" id="j-new" style="margin-bottom:16px">+ New journey</button>
    <div class="grid" style="gap:14px">${journeys.length ? journeys.map((j) => `
      <div class="card"><div class="card-body">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap">
          <strong style="font-size:15px">${esc(j.name)}</strong>
          <span class="tag ${j.enabled ? 'good' : ''}">${j.enabled ? 'live' : 'paused'}</span>
          <span class="tag info">${esc(j.trigger_type)}</span>
          <span style="margin-left:auto;display:flex;gap:7px">
            <button class="btn sm ghost" data-j-preview="${esc(j.id)}">Preview</button>
            <button class="btn sm ghost" data-j-run="${esc(j.id)}">Run now</button>
            <button class="btn sm ${j.enabled ? '' : 'primary'}" data-j-toggle="${esc(j.id)}"
              data-enabled="${j.enabled}">${j.enabled ? 'Pause' : 'Enable'}</button>
          </span>
        </div>
        <div style="font-size:12.5px;color:var(--text-muted);margin-bottom:12px">
          ${esc(j.description || '')}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;font-size:12px">
          <span style="color:var(--text-muted)">Actions:</span>
          ${j.actions.map((a) => `<span class="tag">${esc(a.type.replace(/_/g, ' '))}</span>`).join('')}
          <span style="margin-left:auto;color:var(--text-muted)">
            fired ${num(j.run_count)}× · last ${ago(j.last_run_at)}</span>
        </div>
      </div></div>`).join('')
      : '<div class="card"><div class="empty"><div class="big">⤳</div>No journeys yet.</div></div>'}</div>`;
}

function viewActivity() {
  const events = state.data.activity;
  if (!events) return loadingBlock();
  return `
    <div class="card" style="margin-bottom:16px"><div class="card-body">
      <div class="row-inline">
        <label class="field fixed" style="margin:0;width:180px"><span>Channel</span>
          <select id="a-channel">${['', 'web', 'email', 'linkedin', 'system'].map((c) =>
            `<option value="${c}" ${state.filters?.channel === c ? 'selected' : ''}>${c || 'All'}</option>`).join('')}</select></label>
        <label class="field fixed" style="margin:0;width:200px"><span>Identified only</span>
          <select id="a-identified">
            <option value="">All traffic</option>
            <option value="true" ${state.filters?.identified === 'true' ? 'selected' : ''}>Known contacts only</option>
          </select></label>
      </div>
    </div></div>
    <div class="card"><div class="card-head"><h3>Live activity</h3>
      <span class="hint">every touch across every channel, newest first</span></div>
      <div class="card-body flush"><div class="table-wrap">${events.length ? `<table>
        <thead><tr><th>When</th><th>Channel</th><th>Event</th><th>Contact</th><th>Detail</th></tr></thead>
        <tbody>${events.map((e) => `
          <tr class="${e.contact_id ? 'clickable' : ''}" ${e.contact_id ? `data-contact="${esc(e.contact_id)}"` : ''}>
            <td class="nowrap" style="color:var(--text-muted)">${ago(e.occurred_at)}</td>
            <td><span class="tag ${channelTag(e.channel)}">${esc(e.channel)}</span></td>
            <td style="font-weight:600">${esc(e.type.replace(/_/g, ' '))}</td>
            <td>${e.email ? `<div>${esc(name(e))}</div>
                <div style="font-size:11px;color:var(--text-muted)">${esc(e.company || e.email)}</div>`
              : '<span style="color:var(--text-muted)">anonymous</span>'}</td>
            <td class="trunc" style="color:var(--text-secondary)">${esc(e.path || e.url || e.meta?.subject || '—')}</td>
          </tr>`).join('')}</tbody></table>`
        : '<div class="empty"><div class="big">⟳</div>No activity yet. Install the tracker to start collecting.</div>'}
      </div></div></div>`;
}

const channelTag = (c) => ({ web: 'info', email: 'accent', linkedin: 'info', system: '' }[c] || '');

function viewAccounts() {
  const accounts = state.data.accounts;
  if (!accounts) return loadingBlock();
  return `
    <div class="banner info"><span>⌂</span><div>
      ABM is bought by account, not by person. This rolls every contact up by company domain,
      so you can see when three people at the same company all start reading at once.</div></div>
    <div class="card"><div class="card-head"><h3>Accounts</h3>
      <span class="hint">ranked by summed contact score</span></div>
      <div class="card-body flush"><div class="table-wrap">${accounts.length ? `<table>
        <thead><tr><th>Account</th><th>Industry</th><th class="num">Contacts</th>
          <th class="num">A/B grade</th><th class="num">Engaged</th><th class="num">Events</th>
          <th class="num">Score</th><th>Last activity</th></tr></thead>
        <tbody>${accounts.map((a) => `
          <tr><td><strong>${esc(a.name || a.domain)}</strong>
              <div style="font-size:11px;color:var(--text-muted)">${esc(a.domain)}</div></td>
            <td style="color:var(--text-secondary)">${esc(a.industry || '—')}</td>
            <td class="num">${num(a.contact_count)}</td>
            <td class="num">${num(a.strong_contacts)}</td>
            <td class="num" style="color:var(--accent);font-weight:600">${num(a.engaged_contacts)}</td>
            <td class="num">${num(a.events)}</td>
            <td class="num" style="font-weight:650">${num(a.score)}</td>
            <td class="nowrap" style="color:var(--text-muted)">${ago(a.last_activity)}</td>
          </tr>`).join('')}</tbody></table>`
        : '<div class="empty"><div class="big">⌂</div>No accounts yet.</div>'}
      </div></div></div>`;
}

function viewSetup() {
  const s = state.data.setup;
  if (!s) return loadingBlock();
  const st = state.status || {};
  return `
    <div class="grid g2" style="margin-bottom:16px">
      <div class="card">
        <div class="card-head"><h3>1 · Website tracking</h3>
          <span class="hint">paste into the &lt;head&gt; of every page</span></div>
        <div class="card-body">
          <div class="code" id="snippet-code">${esc(s.snippet.snippet)}</div>
          <div style="display:flex;gap:8px;margin-top:12px">
            <button class="btn sm" id="copy-snippet">Copy snippet</button>
            <a class="btn sm ghost" href="/t/beamr.js" target="_blank" rel="noopener">View tracker</a>
          </div>
          <div class="help" style="margin-top:12px">
            Allowed origins: <code>${esc(s.snippet.tracking_origins.join(', '))}</code>.
            The collector rejects any other origin, so set <code>TRACKING_ORIGINS</code>
            to your real domains before going live.
          </div>
          <div class="section-title">What it captures automatically</div>
          <div style="font-size:12.5px;color:var(--text-secondary);line-height:1.9">
            Page views (including SPA route changes) · scroll depth · time on page ·
            outbound and download clicks · form submissions (email captured, passwords never) ·
            LinkedIn ad-click parameters · identity from email links.
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h3>2 · Channels</h3><span class="hint">connection status</span></div>
        <div class="card-body">
          <dl class="kv">
            <dt>Email provider</dt><dd>${esc(st.email?.provider || '—')}
              ${st.email?.dry_run ? '<span class="tag warn">dry run</span>' : '<span class="tag good">live</span>'}</dd>
            <dt>From address</dt><dd>${esc(st.email?.from || '—')}</dd>
            <dt>LinkedIn</dt><dd>${st.linkedin?.configured
              ? `<span class="tag good">connected</span> account ${esc(st.linkedin.ad_account)}`
              : '<span class="tag warn">not connected</span>'}</dd>
            <dt>Meta</dt><dd>${st.meta?.configured
              ? `<span class="tag good">connected</span> account ${esc(st.meta.ad_account)}`
              : '<span class="tag warn">not connected</span>'}</dd>
            <dt>Meta pixel</dt><dd>${st.meta?.pixel_configured
              ? `<span class="tag good">set</span> ${st.meta.capi_enabled ? 'Conversions API on' : 'Conversions API off'}`
              : '<span class="tag warn">not set</span>'}</dd>
            <dt>Public URL</dt><dd>${esc(st.public_url || '')}</dd>
          </dl>
          <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">
            <button class="btn sm" id="verify-email">Test email</button>
            <button class="btn sm" id="verify-ads">Test ad platforms</button>
            <button class="btn sm" id="verify-capi">Meta CAPI status</button>
          </div>
          <div id="verify-out" style="margin-top:12px"></div>
        </div>
      </div>
    </div>

    <div class="grid g2">
      <div class="card">
        <div class="card-head"><h3>Background jobs</h3><span class="hint">the engine's heartbeat</span></div>
        <div class="card-body flush"><table>
          <thead><tr><th>Job</th><th class="num">Every</th><th>Last run</th><th>Status</th><th></th></tr></thead>
          <tbody>${Object.entries(s.jobs.status).map(([key, j]) => `
            <tr><td><strong>${esc(key.replace(/_/g, ' '))}</strong>
                <div style="font-size:11px;color:var(--text-muted)">${esc(j.label)}</div></td>
              <td class="num nowrap">${j.every_seconds < 120 ? `${j.every_seconds}s` : `${Math.round(j.every_seconds / 60)}m`}</td>
              <td class="nowrap" style="color:var(--text-muted)">${ago(j.lastRun)}</td>
              <td>${j.scheduled
                ? `<span class="tag ${j.lastStatus === 'error' ? 'crit' : 'good'}">${esc(j.lastStatus || 'scheduled')}</span>`
                : '<span class="tag">off</span>'}</td>
              <td class="num"><button class="btn sm ghost" data-job="${esc(key)}">Run</button></td>
            </tr>`).join('')}</tbody>
        </table></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Scoring model</h3>
          <span class="hint">fit + decayed intent, capped at 100</span></div>
        <div class="card-body">
          <dl class="kv">
            <dt>Half-life</dt><dd>${s.settings.scoring.config.halfLifeDays} days
              <span style="color:var(--text-muted)">— intent points halve every ${s.settings.scoring.config.halfLifeDays} days</span></dd>
            <dt>Grade A at</dt><dd>${s.settings.scoring.config.grades.A}+</dd>
            <dt>Grade B at</dt><dd>${s.settings.scoring.config.grades.B}+</dd>
            <dt>Hot alert at</dt><dd>${s.settings.scoring.config.hotThreshold}</dd>
          </dl>
          <div class="section-title">Event weights</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${Object.entries(s.settings.scoring.weights)
              .filter(([, v]) => v !== 0)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => `<span class="tag ${v < 0 ? 'crit' : v >= 15 ? 'good' : ''}">${esc(k.replace(/_/g, ' '))} ${v > 0 ? '+' : ''}${v}</span>`).join('')}
          </div>
          <button class="btn sm" id="rescore" style="margin-top:16px">Recompute all scores</button>
        </div>
      </div>
    </div>`;
}

const loadingBlock = () => '<div class="empty"><span class="spinner"></span><div style="margin-top:12px">Loading…</div></div>';

// ------------------------------------------------------------------ render --
const TITLES = {
  overview: ['Overview', 'How the dedicated list is responding'],
  contacts: ['Contacts', 'Everyone in the engine, scored and segmented'],
  lists: ['Lists & segments', 'Who you target'],
  email: ['Email', 'Personalised campaigns against a segment'],
  ads: ['Advertising', 'LinkedIn and Meta, driven from one contact list'],
  journeys: ['Journeys', 'Cross-channel automation'],
  activity: ['Activity', 'Every touch, newest first'],
  accounts: ['Accounts', 'Contacts rolled up by company'],
  setup: ['Setup & tracking', 'Install, connect and tune'],
};

const VIEWS = {
  overview: viewOverview, contacts: viewContacts, lists: viewLists, email: viewEmail,
  ads: viewAds, journeys: viewJourneys, activity: viewActivity,
  accounts: viewAccounts, setup: viewSetup,
};

function render() {
  const scroll = $('#content')?.scrollTop;
  app.innerHTML = shell();
  bindShell();
  const [title, sub] = TITLES[state.view] || ['', ''];
  $('#page-title').textContent = title;
  $('#page-sub').textContent = sub;
  $('#content').innerHTML = (VIEWS[state.view] || viewOverview)();
  if (scroll) $('#content').scrollTop = scroll;
  bindContent();
}

function bindContent() {
  const root = $('#content');
  if (!root) return;

  root.querySelectorAll('[data-nav]').forEach((el) =>
    el.addEventListener('click', (e) => { e.preventDefault(); go(el.dataset.nav); }));
  root.querySelectorAll('[data-contact]').forEach((el) =>
    el.addEventListener('click', () => showContact(el.dataset.contact)));

  handlers[state.view]?.(root);
}

// ---------------------------------------------------------- view handlers --
const handlers = {
  overview(root) {
    $('#clear-alerts')?.addEventListener('click', async () => {
      await api('/api/alerts/read', { method: 'POST', body: {} });
      load(true);
    });
  },

  contacts(root) {
    let timer;
    $('#c-search')?.addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => { setFilter('q', e.target.value); }, 320);
    });
    ['grade', 'status', 'lifecycle'].forEach((f) =>
      $(`#c-${f}`)?.addEventListener('change', (e) => setFilter(f, e.target.value)));
    $('#c-import')?.addEventListener('click', importModal);
    $('#c-add')?.addEventListener('click', addContactModal);
    $('#c-export')?.addEventListener('click', exportContacts);
  },

  lists(root) {
    $('#l-new')?.addEventListener('click', newListModal);
    $('#l-builder')?.addEventListener('click', segmentBuilder);
    root.querySelectorAll('[data-list-view]').forEach((b) =>
      b.addEventListener('click', () => showList(b.dataset.listView)));
    root.querySelectorAll('[data-list-refresh]').forEach((b) =>
      b.addEventListener('click', async () => {
        const r = await api(`/api/lists/${b.dataset.listRefresh}/refresh`, { method: 'POST' });
        toast(`Refreshed — ${num(r.members)} members`, 'ok');
        load(true);
      }));
    root.querySelectorAll('[data-list-audience]').forEach((b) =>
      b.addEventListener('click', () => newAudienceModal(b.dataset.listAudience)));
  },

  email(root) {
    root.querySelectorAll('[data-tab]').forEach((t) =>
      t.addEventListener('click', () => { state.tab = t.dataset.tab; render(); }));
    $('#cp-new')?.addEventListener('click', newCampaignModal);
    $('#t-new')?.addEventListener('click', () => templateModal(null));
    root.querySelectorAll('[data-template]').forEach((b) =>
      b.addEventListener('click', () => templateModal(b.dataset.template)));
    root.querySelectorAll('[data-cp-preflight]').forEach((b) =>
      b.addEventListener('click', () => preflightModal(b.dataset.cpPreflight)));
    root.querySelectorAll('[data-cp-send]').forEach((b) =>
      b.addEventListener('click', () => sendCampaign(b.dataset.cpSend)));
    root.querySelectorAll('[data-cp-pause]').forEach((b) =>
      b.addEventListener('click', async () => {
        await api(`/api/campaigns/${b.dataset.cpPause}/pause`, { method: 'POST' });
        toast('Campaign paused', 'ok'); load(true);
      }));
    root.querySelectorAll('[data-cp-view]').forEach((b) =>
      b.addEventListener('click', () => showCampaign(b.dataset.cpView)));
  },

  ads(root) {
    root.querySelectorAll('[data-platform]').forEach((t) =>
      t.addEventListener('click', () => { state.adPlatform = t.dataset.platform; render(); }));
    $('#au-new')?.addEventListener('click', () => newAudienceModal(null));
    $('#au-mirror')?.addEventListener('click', mirrorModal);
    $('#ads-sync')?.addEventListener('click', async () => {
      toast('Syncing both platforms…');
      const r = await api('/api/ads/sync', { method: 'POST', body: { what: 'all' } });
      const added = r.audiences?.added ?? 0;
      toast(`Sync complete — ${added} contacts pushed`, 'ok');
      load(true);
    });
    root.querySelectorAll('[data-audience]').forEach((el) =>
      el.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        showAudience(el.dataset.audience);
      }));
    root.querySelectorAll('[data-au-sync]').forEach((b) =>
      b.addEventListener('click', async (e) => {
        e.stopPropagation();
        b.innerHTML = '<span class="spinner"></span>';
        const r = await api(`/api/ads/audiences/${b.dataset.auSync}/sync`, { method: 'POST' });
        toast(`${r.added} added, ${r.removed} removed${r.dry_run ? ' (dry run)' : ''}`, 'ok');
        if (r.warnings?.length) toast(r.warnings[0]);
        load(true);
      }));
    root.querySelectorAll('[data-au-cohort]').forEach((b) =>
      b.addEventListener('click', async (e) => {
        e.stopPropagation();
        b.innerHTML = '<span class="spinner"></span>';
        await api(`/api/ads/audiences/${b.dataset.auCohort}`, { method: 'PATCH', body: { cohort_mode: true } });
        const r = await api(`/api/ads/audiences/${b.dataset.auCohort}/cohorts`, { method: 'POST' });
        toast(`${r.cohorts} cohorts of ~${r.cohort_size}`, 'ok');
        if (r.warnings?.length) toast(r.warnings[0]);
        showAudience(b.dataset.auCohort);
        load(true);
      }));
  },

  journeys(root) {
    $('#j-new')?.addEventListener('click', newJourneyModal);
    root.querySelectorAll('[data-j-toggle]').forEach((b) =>
      b.addEventListener('click', async () => {
        await api(`/api/journeys/${b.dataset.jToggle}`, {
          method: 'PATCH', body: { enabled: b.dataset.enabled !== 'true' },
        });
        load(true);
      }));
    root.querySelectorAll('[data-j-preview]').forEach((b) =>
      b.addEventListener('click', async () => {
        const p = await api(`/api/journeys/${b.dataset.jPreview}/preview`);
        openModal({
          title: 'Journey preview', subtitle: `${p.would_fire_for} contacts would trigger right now`,
          confirm: 'Close', onConfirm: () => {},
          body: p.contacts.length
            ? `<table><thead><tr><th>Contact</th><th>Company</th><th class="num">Score</th></tr></thead>
                <tbody>${p.contacts.map((c) => `<tr><td>${esc(c.email)}</td>
                  <td>${esc(c.company || '—')}</td><td class="num">${c.score}</td></tr>`).join('')}</tbody></table>`
            : '<div class="empty">Nobody matches right now.</div>',
        });
      }));
    root.querySelectorAll('[data-j-run]').forEach((b) =>
      b.addEventListener('click', async () => {
        const r = await api(`/api/journeys/${b.dataset.jRun}/run`, { method: 'POST' });
        toast(`Fired for ${r.fired} contacts`, 'ok'); load(true);
      }));
  },

  activity(root) {
    $('#a-channel')?.addEventListener('change', (e) => setFilter('channel', e.target.value));
    $('#a-identified')?.addEventListener('change', (e) => setFilter('identified', e.target.value));
  },

  setup(root) {
    $('#copy-snippet')?.addEventListener('click', () => {
      navigator.clipboard.writeText(state.data.setup.snippet.snippet);
      toast('Snippet copied', 'ok');
    });
    $('#verify-email')?.addEventListener('click', async () => {
      const r = await api('/api/email/verify', { method: 'POST', body: {} });
      $('#verify-out').innerHTML = `<div class="code">${esc(JSON.stringify(r, null, 2))}</div>`;
    });
    $('#verify-ads')?.addEventListener('click', async () => {
      const r = await api('/api/ads/verify');
      $('#verify-out').innerHTML = `<div class="code">${esc(JSON.stringify(r, null, 2))}</div>`;
    });
    $('#verify-capi')?.addEventListener('click', async () => {
      const r = await api('/api/meta/capi');
      $('#verify-out').innerHTML = `<div class="code">${esc(JSON.stringify(r, null, 2))}</div>`;
    });
    $('#rescore')?.addEventListener('click', async () => {
      const r = await api('/api/score/recompute', { method: 'POST' });
      toast(`Rescored ${r.scored} contacts (${r.changed} changed)`, 'ok');
      load(true);
    });
    root.querySelectorAll('[data-job]').forEach((b) =>
      b.addEventListener('click', async () => {
        b.innerHTML = '<span class="spinner"></span>';
        const r = await api(`/api/jobs/${b.dataset.job}/run`, { method: 'POST' });
        toast(`${b.dataset.job}: ${r.status || 'done'}`, r.status === 'error' ? 'err' : 'ok');
        load(true);
      }));
  },
};

function setFilter(key, value) {
  state.filters = { ...(state.filters || {}), [key]: value };
  loadView();
}

// ----------------------------------------------------------------- details --
async function showContact(id) {
  openDrawer(`<div class="drawer-head"><div><h2>Loading…</h2></div>
    <button class="btn ghost sm" data-close style="margin-left:auto">✕</button></div>`);
  const c = await api(`/api/contacts/${id}`);
  const sd = c.score_detail || {};
  openDrawer(`
    <div class="drawer-head">
      <span class="grade ${esc(c.grade)}" style="width:34px;height:34px;font-size:14px">${esc(c.grade)}</span>
      <div style="flex:1">
        <h2>${esc(name(c))}</h2>
        <div class="sub">${esc([c.job_title, c.company].filter(Boolean).join(' · ') || c.email)}</div>
      </div>
      <button class="btn ghost sm" data-close>✕</button>
    </div>
    <div class="drawer-body">
      <div class="grid g3" style="gap:10px;margin-bottom:6px">
        ${miniStat('Score', c.score, `fit ${sd.fit ?? 0} + intent ${sd.intent ?? 0}`)}
        ${miniStat('Stage', c.lifecycle_stage, statusPlain(c.status))}
        ${miniStat('Events', c.timeline.length, `last ${ago(c.last_seen_at)}`)}
      </div>

      <div class="section-title">Details</div>
      <dl class="kv">
        <dt>Email</dt><dd>${esc(c.email)}</dd>
        <dt>Company</dt><dd>${esc(c.company || '—')}${c.domain ? ` <span style="color:var(--text-muted)">(${esc(c.domain)})</span>` : ''}</dd>
        <dt>Title</dt><dd>${esc(c.job_title || '—')}</dd>
        <dt>Seniority</dt><dd>${esc(c.seniority || '—')} ${c.function ? `· ${esc(c.function)}` : ''}</dd>
        <dt>Country</dt><dd>${esc(c.country || '—')}</dd>
        <dt>LinkedIn</dt><dd>${c.linkedin_url ? `<a href="${esc(c.linkedin_url)}" target="_blank" rel="noopener">profile ↗</a>` : '—'}</dd>
        <dt>Source</dt><dd>${esc(c.source || '—')}</dd>
        <dt>Email consent</dt><dd>${c.consent_email ? '<span class="tag good">yes</span>' : '<span class="tag crit">no</span>'}</dd>
        <dt>Ad consent</dt><dd>${c.consent_ads ? '<span class="tag good">yes</span>' : '<span class="tag crit">no</span>'}</dd>
        ${Object.entries(c.attrs || {}).slice(0, 8).map(([k, v]) =>
          `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}
      </dl>

      ${c.audiences?.length ? `<div class="section-title">LinkedIn audiences</div>
        <div style="display:flex;gap:7px;flex-wrap:wrap">${c.audiences.map((a) =>
          `<span class="tag ${a.state === 'pushed' ? 'good' : ''}">${esc(a.name)} · ${esc(a.state)}</span>`).join('')}</div>` : ''}

      ${c.lists?.length ? `<div class="section-title">Lists</div>
        <div style="display:flex;gap:7px;flex-wrap:wrap">${c.lists.map((l) =>
          `<span class="tag">${esc(l.name)}</span>`).join('')}</div>` : ''}

      ${sd.by_type?.length ? `<div class="section-title">Score contribution</div>
        <table><thead><tr><th>Signal</th><th class="num">Count</th><th class="num">Decayed points</th></tr></thead>
        <tbody>${sd.by_type.map((t) => `<tr><td>${esc(t.type.replace(/_/g, ' '))}</td>
          <td class="num">${t.count}</td><td class="num">${t.decayed}</td></tr>`).join('')}</tbody></table>
        <div class="help">Points halve every ${sd.half_life_days} days, so this is current value, not lifetime total.</div>` : ''}

      ${c.sends?.length ? `<div class="section-title">Email</div>
        <table><thead><tr><th>Campaign</th><th>Sent</th><th class="num">Opens</th><th class="num">Clicks</th></tr></thead>
        <tbody>${c.sends.map((s) => `<tr><td class="trunc">${esc(s.campaign)}</td>
          <td class="nowrap" style="color:var(--text-muted)">${ago(s.sent_at)}</td>
          <td class="num">${s.open_count}</td><td class="num">${s.click_count}</td></tr>`).join('')}</tbody></table>` : ''}

      <div class="section-title">Timeline</div>
      ${c.timeline.length ? `<div class="tl">${c.timeline.slice(0, 60).map((e) => `
        <div class="tl-item ${esc(e.channel)}">
          <div class="t">${esc(e.type.replace(/_/g, ' '))}${e.points ? ` <span class="tag ${e.points > 0 ? 'accent' : 'crit'}">${e.points > 0 ? '+' : ''}${e.points}</span>` : ''}</div>
          <div class="m">${esc(e.path || e.url || e.meta?.subject || e.meta?.audience || '')} · ${ago(e.occurred_at)}</div>
        </div>`).join('')}</div>` : '<div class="empty">No activity recorded.</div>'}
    </div>`);
}

const statusPlain = (s) => s;

async function showList(id) {
  const l = await api(`/api/lists/${id}`);
  openDrawer(`
    <div class="drawer-head"><div style="flex:1"><h2>${esc(l.name)}</h2>
      <div class="sub">${num(l.member_count)} contacts · ${esc(l.kind)}</div></div>
      <button class="btn ghost sm" data-close>✕</button></div>
    <div class="drawer-body">
      ${l.description ? `<p style="color:var(--text-secondary);margin-bottom:16px">${esc(l.description)}</p>` : ''}
      ${l.kind === 'dynamic' ? `<div class="section-title">Rules</div>
        <div class="code">${esc(JSON.stringify(l.rules, null, 2))}</div>` : ''}
      <div class="section-title">Members</div>
      <table><thead><tr><th>Contact</th><th>Company</th><th class="num">Score</th></tr></thead>
        <tbody>${l.members.map((c) => `<tr class="clickable" data-contact="${esc(c.id)}">
          <td>${esc(name(c))}<div style="font-size:11px;color:var(--text-muted)">${esc(c.email)}</div></td>
          <td>${esc(c.company || '—')}</td><td class="num">${c.score}</td></tr>`).join('')}</tbody></table>
    </div>`);
  $('#drawer').querySelectorAll('[data-contact]').forEach((el) =>
    el.addEventListener('click', () => showContact(el.dataset.contact)));
}

async function showAudience(id) {
  const a = await api(`/api/ads/audiences/${id}`);
  const p = a.precision;
  openDrawer(`
    <div class="drawer-head"><div style="flex:1"><h2>${esc(a.name)}</h2>
      <div class="sub">${esc(a.platform === 'meta' ? 'Meta' : 'LinkedIn')} ·
        ${num(a.member_count)} contacts · ${num(a.matched_count)} matched</div></div>
      <button class="btn ghost sm" data-close>✕</button></div>
    <div class="drawer-body">
      <div class="grid g3" style="gap:10px">
        ${miniStat('Targeted', num(a.member_count), `${num(a.resolved)} currently match`)}
        ${miniStat('Cohorts', num(a.cohorts.length), a.cohort_mode ? `~${num(a.cohort_size)} each` : 'cohorts off')}
        ${miniStat('Precision', p.with_cohorts, `was ${p.without_cohorts}`)}
      </div>

      <div class="section-title">What this audience can prove</div>
      <div class="banner info" style="margin:0 0 12px"><span>◈</span><div>
        <strong>Impressions:</strong> ${esc(p.impressions_note)}<br />
        <strong>Clicks:</strong> ${esc(p.clicks_note)}
      </div></div>

      ${a.cohorts.length ? `<div class="section-title">Cohorts</div>
        <table><thead><tr><th>#</th><th class="num">People</th><th class="num">Impr.</th>
          <th class="num">Clicks</th><th class="num">Spend</th><th>Resolves to</th></tr></thead>
        <tbody>${a.cohorts.map((c) => `<tr class="clickable" data-cohort="${esc(c.id)}">
          <td><strong>${c.seq}</strong>${c.status === 'retired' ? ' <span class="tag">retired</span>' : ''}</td>
          <td class="num">${num(c.members)}</td>
          <td class="num">${num(c.impressions)}</td>
          <td class="num">${num(c.clicks)}</td>
          <td class="num">${money(c.spend)}</td>
          <td style="color:var(--text-secondary)">${esc(c.attribution_precision)}</td>
        </tr>`).join('')}</tbody></table>
        ${a.cohorts[0]?.landing_url_with_token ? `
          <div class="section-title">Cohort landing URL</div>
          <div class="help" style="margin-bottom:6px">Put each cohort's URL behind its own ad creative.
            The token identifies which slice clicked; the site tracker identifies the person.</div>
          <div class="code">${esc(a.cohorts[0].landing_url_with_token)}</div>` : ''}`
        : `<div class="section-title">Cohorts</div>
           <div class="empty">Cohorts are off for this audience. Turning them on splits it into
             slices of ~${num(Math.ceil(a.min_audience_size * 1.6))} so reporting resolves to named people.</div>`}

      <div class="section-title">Members</div>
      <table><thead><tr><th>Contact</th><th>Company</th><th>Cohort</th><th class="num">Score</th></tr></thead>
        <tbody>${a.members.slice(0, 60).map((m) => `<tr class="clickable" data-contact="${esc(m.id)}">
          <td>${esc(name(m))}<div style="font-size:11px;color:var(--text-muted)">${esc(m.email)}</div></td>
          <td>${esc(m.company || '—')}</td>
          <td style="color:var(--text-muted)">${esc(m.cohort_label ? m.cohort_label.split('·').pop().trim() : '—')}</td>
          <td class="num">${m.score}</td></tr>`).join('')}</tbody></table>
    </div>`);
  $('#drawer').querySelectorAll('[data-contact]').forEach((el) =>
    el.addEventListener('click', () => showContact(el.dataset.contact)));
  $('#drawer').querySelectorAll('[data-cohort]').forEach((el) =>
    el.addEventListener('click', () => showCohort(el.dataset.cohort)));
}

async function showCohort(id) {
  const members = await api(`/api/ads/cohorts/${id}/members`);
  openModal({
    title: 'Cohort members', confirm: 'Close', onConfirm: () => {}, wide: true,
    subtitle: `An impression on this cohort's ad reached one of these ${members.length} named people.`,
    body: members.length ? `<div class="table-wrap" style="max-height:420px"><table>
      <thead><tr><th>Contact</th><th>Company</th><th>Title</th><th class="num">Score</th></tr></thead>
      <tbody>${members.map((m) => `<tr><td>${esc(name(m))}
        <div style="font-size:11px;color:var(--text-muted)">${esc(m.email)}</div></td>
        <td>${esc(m.company || '—')}</td><td class="trunc">${esc(m.job_title || '—')}</td>
        <td class="num">${m.score}</td></tr>`).join('')}</tbody></table></div>`
      : '<div class="empty">No members.</div>',
  });
}

async function showCampaign(id) {
  const c = await api(`/api/campaigns/${id}`);
  const sends = await api(`/api/campaigns/${id}/sends?limit=100`);
  openDrawer(`
    <div class="drawer-head"><div style="flex:1"><h2>${esc(c.name)}</h2>
      <div class="sub">${esc(c.status)} · from ${esc(c.from_email)}</div></div>
      <button class="btn ghost sm" data-close>✕</button></div>
    <div class="drawer-body">
      <div class="grid g4" style="gap:10px">
        ${miniStat('Sent', num(c.stats.sent), `of ${num(c.stats.total)}`)}
        ${miniStat('Open rate', pct(c.stats.open_rate), `${num(c.stats.total_opens)} opens`)}
        ${miniStat('Click rate', pct(c.stats.click_rate), `${pct(c.stats.click_to_open_rate)} CTOR`)}
        ${miniStat('Failed', num(c.stats.failed), `${num(c.stats.skipped)} skipped`)}
      </div>
      ${c.links.length ? `<div class="section-title">Links</div>
        <table><thead><tr><th>Destination</th><th class="num">Clicks</th></tr></thead>
        <tbody>${c.links.map((l) => `<tr><td class="trunc">${esc(l.url)}</td>
          <td class="num">${num(l.click_count)}</td></tr>`).join('')}</tbody></table>` : ''}
      <div class="section-title">Recipients</div>
      <table><thead><tr><th>Contact</th><th>Status</th><th class="num">Opens</th><th class="num">Clicks</th></tr></thead>
        <tbody>${sends.map((s) => `<tr class="clickable" data-contact="${esc(s.contact_id)}">
          <td>${esc(s.email)}<div style="font-size:11px;color:var(--text-muted)">${esc(s.company || '')}</div></td>
          <td>${esc(s.status)}${s.error ? `<div style="color:var(--st-crit);font-size:11px">${esc(s.error)}</div>` : ''}</td>
          <td class="num">${s.open_count}</td><td class="num">${s.click_count}</td></tr>`).join('')}</tbody></table>
    </div>`);
  $('#drawer').querySelectorAll('[data-contact]').forEach((el) =>
    el.addEventListener('click', () => showContact(el.dataset.contact)));
}

// ------------------------------------------------------------------ modals --
function importModal() {
  const lists = state.data.lists || [];
  openModal({
    title: 'Import contacts',
    subtitle: 'Paste CSV or choose a file. Columns are matched automatically.',
    confirm: 'Import',
    wide: true,
    body: `
      <label class="field"><span>Add to list</span>
        <select id="i-list"><option value="">— none —</option>
          ${lists.map((l) => `<option value="${esc(l.id)}">${esc(l.name)}</option>`).join('')}</select></label>
      <label class="field"><span>CSV file</span>
        <input type="file" id="i-file" accept=".csv,text/csv" /></label>
      <label class="field"><span>…or paste CSV</span>
        <textarea id="i-csv" placeholder="email,first name,last name,company,title
noa@wix.com,Noa,Cohen,Wix,VP Engineering"></textarea></label>
      <label style="display:flex;gap:8px;align-items:center;font-size:12.5px;margin-bottom:8px">
        <input type="checkbox" id="i-overwrite" style="width:auto" />
        Overwrite existing values (off = only fill in blanks)</label>
      <div id="i-out"></div>`,
    onConfirm: async (body) => {
      const file = body.querySelector('#i-file').files[0];
      const csv = file ? await file.text() : body.querySelector('#i-csv').value;
      if (!csv.trim()) throw new Error('No CSV supplied');
      const r = await api('/api/contacts/import', {
        method: 'POST',
        body: {
          csv,
          list_id: body.querySelector('#i-list').value || null,
          overwrite: body.querySelector('#i-overwrite').checked,
          source: file ? `import:${file.name}` : 'import:paste',
        },
      });
      toast(`${r.created} created, ${r.updated} updated, ${r.skipped} skipped`, 'ok');
      load(true);
    },
  });
}

function addContactModal() {
  openModal({
    title: 'Add contact', confirm: 'Add',
    body: `
      <label class="field"><span>Email *</span><input type="email" id="n-email" /></label>
      <div class="row-inline">
        <label class="field"><span>First name</span><input type="text" id="n-first" /></label>
        <label class="field"><span>Last name</span><input type="text" id="n-last" /></label>
      </div>
      <div class="row-inline">
        <label class="field"><span>Company</span><input type="text" id="n-company" /></label>
        <label class="field"><span>Job title</span><input type="text" id="n-title" /></label>
      </div>
      <label class="field"><span>LinkedIn URL</span><input type="url" id="n-li" /></label>`,
    onConfirm: async (body) => {
      const get = (id) => body.querySelector(id).value.trim();
      await api('/api/contacts', {
        method: 'POST',
        body: {
          email: get('#n-email'), first_name: get('#n-first'), last_name: get('#n-last'),
          company: get('#n-company'), job_title: get('#n-title'), linkedin_url: get('#n-li'),
          source: 'console',
        },
      });
      toast('Contact added', 'ok');
      load(true);
    },
  });
}

async function exportContacts() {
  const d = await api(`/api/contacts?limit=500${filterQuery()}`);
  const cols = ['email', 'first_name', 'last_name', 'company', 'job_title', 'seniority',
    'country', 'lifecycle_stage', 'status', 'score', 'grade', 'last_seen_at'];
  const csv = [cols.join(','), ...d.contacts.map((c) =>
    cols.map((k) => {
      const v = String(c[k] ?? '');
      return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
    }).join(','))].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = `beamr-contacts-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast(`Exported ${d.contacts.length} contacts`, 'ok');
}

function newListModal() {
  openModal({
    title: 'New list', confirm: 'Create',
    body: `
      <label class="field"><span>Name *</span><input type="text" id="l-name" placeholder="Dedicated ABM list" /></label>
      <label class="field"><span>Description</span><input type="text" id="l-desc" /></label>
      <label class="field"><span>Kind</span>
        <select id="l-kind"><option value="static">Static — explicit membership</option>
          <option value="dynamic">Dynamic — rule re-evaluates itself</option></select></label>
      <label class="field" id="l-rules-wrap" style="display:none"><span>Rules (JSON)</span>
        <textarea id="l-rules">{
  "op": "and",
  "rules": [
    { "field": "seniority", "operator": "in", "value": ["vp", "cxo"] },
    { "field": "page_views_30d", "operator": "gte", "value": 2 }
  ]
}</textarea></label>
      <label style="display:flex;gap:8px;align-items:center;font-size:12.5px">
        <input type="checkbox" id="l-dedicated" style="width:auto" /> This is the dedicated list</label>`,
    onConfirm: async (body) => {
      const kind = body.querySelector('#l-kind').value;
      await api('/api/lists', {
        method: 'POST',
        body: {
          name: body.querySelector('#l-name').value.trim(),
          description: body.querySelector('#l-desc').value.trim(),
          kind,
          rules: kind === 'dynamic' ? JSON.parse(body.querySelector('#l-rules').value || '{}') : {},
          is_dedicated: body.querySelector('#l-dedicated').checked,
        },
      });
      toast('List created', 'ok');
      load(true);
    },
  });
  $('#l-kind').addEventListener('change', (e) => {
    $('#l-rules-wrap').style.display = e.target.value === 'dynamic' ? 'block' : 'none';
  });
}

function segmentBuilder() {
  openModal({
    title: 'Segment builder', wide: true,
    subtitle: 'Write a rule, see who matches, then save it as a list.',
    confirm: 'Save as list',
    body: `
      <label class="field"><span>Rules (JSON)</span>
        <textarea id="s-rules" style="min-height:170px">{
  "op": "and",
  "rules": [
    { "field": "seniority", "operator": "in", "value": ["vp", "cxo", "director"] },
    { "field": "visited_path(/pricing)", "operator": "gte", "value": 1 },
    { "field": "days_since_last_event", "operator": "lte", "value": 30 }
  ]
}</textarea>
        <div class="help">Fields: contact columns, <code>attrs.*</code>, behavioural counters
          (<code>page_views_30d</code>, <code>email_clicks_30d</code>, <code>ad_clicks_30d</code>,
          <code>days_since_last_event</code>) and parameterised ones
          (<code>visited_path(/pricing)</code>, <code>in_list(ls_…)</code>).</div></label>
      <button class="btn" id="s-run" style="margin-bottom:14px">Preview matches</button>
      <div id="s-out"></div>
      <label class="field" style="margin-top:14px"><span>Save as list named</span>
        <input type="text" id="s-name" placeholder="VP+ pricing viewers" /></label>`,
    onConfirm: async (body) => {
      const name = body.querySelector('#s-name').value.trim();
      if (!name) throw new Error('Give the list a name');
      await api('/api/lists', {
        method: 'POST',
        body: { name, kind: 'dynamic', rules: JSON.parse(body.querySelector('#s-rules').value) },
      });
      toast('Saved as dynamic list', 'ok');
      load(true);
    },
  });
  $('#s-run').addEventListener('click', async () => {
    try {
      const r = await api('/api/segments/preview', {
        method: 'POST', body: { rules: JSON.parse($('#s-rules').value), limit: 25 },
      });
      $('#s-out').innerHTML = `
        <div class="banner info" style="margin-bottom:12px"><span>◈</span>
          <div><strong>${num(r.count)} contacts</strong> match this rule.</div></div>
        ${r.sample.length ? `<div class="table-wrap" style="max-height:260px"><table>
          <thead><tr><th>Contact</th><th>Company</th><th>Title</th><th class="num">Score</th></tr></thead>
          <tbody>${r.sample.map((c) => `<tr><td>${esc(c.email)}</td><td>${esc(c.company || '—')}</td>
            <td class="trunc">${esc(c.job_title || '—')}</td><td class="num">${c.score}</td></tr>`).join('')}
          </tbody></table></div>` : ''}`;
    } catch (err) {
      $('#s-out').innerHTML = `<div class="banner"><span>⚠</span><div>${esc(err.message)}</div></div>`;
    }
  });
}

function newAudienceModal(listId) {
  const lists = state.data.lists || [];
  openModal({
    title: 'New matched audience',
    subtitle: 'Mirrors a list into an ad platform as hashed identities.',
    confirm: 'Create & sync',
    body: `
      <label class="field"><span>Platform *</span>
        <select id="a-platform">
          <option value="linkedin">LinkedIn — work context, ~300 member floor</option>
          <option value="meta">Meta — Facebook &amp; Instagram, ~100 member floor</option>
        </select>
        <div class="help" id="a-plat-note">LinkedIn matches on the hashed email only.</div></label>
      <label class="field"><span>Name *</span>
        <input type="text" id="a-name" placeholder="VP+ media — retargeting" /></label>
      <label class="field"><span>Source list</span>
        <select id="a-list"><option value="">— all contacts —</option>
          ${lists.map((l) => `<option value="${esc(l.id)}" ${l.id === listId ? 'selected' : ''}>${esc(l.name)} (${l.member_count})</option>`).join('')}
        </select></label>
      <label class="field"><span>Extra rules (JSON, optional)</span>
        <textarea id="a-rules">{}</textarea></label>
      <label style="display:flex;gap:8px;align-items:center;font-size:12.5px">
        <input type="checkbox" id="a-cohorts" style="width:auto" />
        Split into cohorts for contact-level attribution</label>
      <div class="help">Only contacts with ad consent are ever pushed. Cohorts create one platform
        audience per slice, so reporting resolves to a handful of named people.</div>`,
    onConfirm: async (body) => {
      const a = await api('/api/ads/audiences', {
        method: 'POST',
        body: {
          name: body.querySelector('#a-name').value.trim(),
          platform: body.querySelector('#a-platform').value,
          list_id: body.querySelector('#a-list').value || null,
          rules: JSON.parse(body.querySelector('#a-rules').value || '{}'),
          cohort_mode: body.querySelector('#a-cohorts').checked,
        },
      });
      const r = await api(`/api/ads/audiences/${a.id}/sync`, { method: 'POST' });
      toast(`Audience created — ${r.added} contacts${r.dry_run ? ' (dry run)' : ''}`, 'ok');
      if (r.warnings?.length) toast(r.warnings[0]);
      go('ads');
    },
  });
  $('#a-platform').addEventListener('change', (e) => {
    $('#a-plat-note').textContent = e.target.value === 'meta'
      ? 'Meta matches on up to nine keys — email, name, city, state, zip, country, phone. More keys, higher match rate.'
      : 'LinkedIn matches on the hashed email only.';
  });
}

function mirrorModal() {
  const lists = state.data.lists || [];
  openModal({
    title: 'Mirror a list to both platforms',
    subtitle: 'Creates one audience per platform from the same contacts, and syncs both.',
    confirm: 'Mirror & sync',
    body: `
      <label class="field"><span>Name *</span>
        <input type="text" id="m-name" placeholder="Dedicated list — VP+ media" /></label>
      <label class="field"><span>Source list</span>
        <select id="m-list"><option value="">— all contacts —</option>
          ${lists.map((l) => `<option value="${esc(l.id)}">${esc(l.name)} (${l.member_count})</option>`).join('')}
        </select></label>
      <label class="field"><span>Extra rules (JSON, optional)</span>
        <textarea id="m-rules">{ "field": "seniority", "operator": "in", "value": ["vp", "cxo", "director"] }</textarea></label>
      <label style="display:flex;gap:8px;align-items:center;font-size:12.5px">
        <input type="checkbox" id="m-cohorts" style="width:auto" checked />
        Split into cohorts on both platforms</label>
      <div class="help">The same people, reached in two contexts. Meta is typically a fraction of
        LinkedIn's cost per click and allows roughly 3× tighter cohorts; LinkedIn reaches them
        with work intent. The contact record is what ties the two together.</div>`,
    onConfirm: async (body) => {
      const r = await api('/api/ads/audiences', {
        method: 'POST',
        body: {
          mirror: true,
          name: body.querySelector('#m-name').value.trim(),
          list_id: body.querySelector('#m-list').value || null,
          rules: JSON.parse(body.querySelector('#m-rules').value || '{}'),
          cohort_mode: body.querySelector('#m-cohorts').checked,
        },
      });
      toast(`Mirrored to ${r.mirrored} platforms`, 'ok');
      go('ads');
    },
  });
}

function templateModal(id) {
  const existing = id ? (state.data.email?.templates || []).find((t) => t.id === id) : null;
  openModal({
    title: existing ? 'Edit template' : 'New template',
    wide: true,
    confirm: existing ? 'Save' : 'Create',
    body: `
      <label class="field"><span>Name *</span>
        <input type="text" id="t-name" value="${esc(existing?.name || '')}" /></label>
      <label class="field"><span>Subject *</span>
        <input type="text" id="t-subject" value="${esc(existing?.subject || '')}"
          placeholder="{{ first_name | fallback: &quot;Hi&quot; }}, cut your CDN bill by half" /></label>
      <label class="field"><span>Preheader</span>
        <input type="text" id="t-pre" value="${esc(existing?.preheader || '')}" /></label>
      <label class="field"><span>HTML *</span>
        <textarea id="t-html" style="min-height:230px">${esc(existing?.html || `<p>Hi {{ first_name | fallback: "there" }},</p>
<p>{{ company_or_default }} moves a lot of video. Beamr's CABR encoding cuts bitrate
   by up to 50% at the same perceptual quality — same player, same workflow.</p>
<p><a href="https://beamr.com/demo">Book 20 minutes</a></p>
<p>— {{ sender_name }}</p>`)}</textarea>
        <div class="help">Merge tags: <code>{{ first_name }}</code>, <code>{{ company }}</code>,
          <code>{{ job_title }}</code>, <code>{{ attrs.anything }}</code>. Filters:
          <code>| fallback: "there"</code>, <code>| title</code>, <code>| truncate: 40</code>.
          Conditionals: <code>{% if company %}…{% endif %}</code>.
          Links are rewritten for click tracking; the unsubscribe footer is added automatically.</div></label>`,
    onConfirm: async (body) => {
      const payload = {
        name: body.querySelector('#t-name').value.trim(),
        subject: body.querySelector('#t-subject').value.trim(),
        preheader: body.querySelector('#t-pre').value.trim(),
        html: body.querySelector('#t-html').value,
      };
      if (existing) await api(`/api/templates/${existing.id}`, { method: 'PATCH', body: payload });
      else await api('/api/templates', { method: 'POST', body: payload });
      toast('Template saved', 'ok');
      load(true);
    },
  });
}

function newCampaignModal() {
  const { templates } = state.data.email || { templates: [] };
  const lists = state.data.lists || [];
  if (!templates.length) { toast('Create a template first', 'err'); return; }
  openModal({
    title: 'New campaign', confirm: 'Create draft',
    body: `
      <label class="field"><span>Name *</span>
        <input type="text" id="k-name" placeholder="Q3 CDN cost play — VP media" /></label>
      <label class="field"><span>Template *</span>
        <select id="k-template">${templates.map((t) =>
          `<option value="${esc(t.id)}">${esc(t.name)}</option>`).join('')}</select></label>
      <label class="field"><span>Send to list</span>
        <select id="k-list"><option value="">— all mailable contacts —</option>
          ${lists.map((l) => `<option value="${esc(l.id)}">${esc(l.name)} (${l.member_count})</option>`).join('')}
        </select></label>
      <label class="field"><span>Extra segment rules (JSON, optional)</span>
        <textarea id="k-rules" style="min-height:74px">{}</textarea></label>
      <div class="row-inline">
        <label class="field"><span>Throttle / minute</span>
          <input type="number" id="k-throttle" value="60" min="1" max="600" /></label>
        <label class="field"><span>Don't re-mail within (days)</span>
          <input type="number" id="k-suppress" value="3" min="0" max="90" /></label>
      </div>`,
    onConfirm: async (body) => {
      await api('/api/campaigns', {
        method: 'POST',
        body: {
          name: body.querySelector('#k-name').value.trim(),
          template_id: body.querySelector('#k-template').value,
          list_id: body.querySelector('#k-list').value || null,
          segment_rules: JSON.parse(body.querySelector('#k-rules').value || '{}'),
          throttle_per_min: Number(body.querySelector('#k-throttle').value),
          suppress_days: Number(body.querySelector('#k-suppress').value),
        },
      });
      toast('Campaign created as draft', 'ok');
      load(true);
    },
  });
}

async function preflightModal(id) {
  const p = await api(`/api/campaigns/${id}/preflight`);
  openModal({
    title: 'Preflight', wide: true,
    subtitle: `${num(p.recipients)} contacts would receive this campaign`,
    confirm: 'Close', onConfirm: () => {},
    body: `
      ${p.warnings.length ? p.warnings.map((w) =>
        `<div class="banner"><span>⚠</span><div>${esc(w)}</div></div>`).join('')
        : '<div class="banner info"><span>✓</span><div>No issues found.</div></div>'}
      <div class="section-title">Merge tags used</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${p.merge_tags.map((t) =>
        `<span class="tag ${p.missing_values[t] ? 'warn' : 'good'}">${esc(t)}${p.missing_values[t] ? ` · ${p.missing_values[t]} blank` : ''}</span>`).join('') || '<span class="tag">none</span>'}</div>
      <div class="section-title">Tracked links</div>
      <div class="code">${p.links.map(esc).join('\n') || 'none'}</div>
      <div class="section-title">Rendered samples</div>
      ${p.sample.map((s) => `
        <div style="border:1px solid var(--border);border-radius:11px;padding:13px;margin-bottom:10px">
          <div style="font-size:11px;color:var(--text-muted)">${esc(s.email)}</div>
          <div style="font-weight:650;margin:4px 0 6px">${esc(s.subject)}</div>
          <div style="font-size:12.5px;color:var(--text-secondary)">${esc(s.preview)}…</div>
        </div>`).join('')}`,
  });
}

async function sendCampaign(id) {
  const p = await api(`/api/campaigns/${id}/preflight`);
  openModal({
    title: 'Send campaign',
    subtitle: `This queues ${num(p.recipients)} personalised emails.`,
    confirm: `Send to ${num(p.recipients)}`,
    body: `
      ${p.warnings.length ? p.warnings.map((w) =>
        `<div class="banner"><span>⚠</span><div>${esc(w)}</div></div>`).join('') : ''}
      ${state.status?.email?.dry_run ? `<div class="banner info"><span>◔</span><div>
        <strong>Dry-run mode.</strong> Messages are rendered and written to
        <code>data/outbox</code> as .eml files, not delivered.</div></div>` : ''}
      <p style="font-size:12.5px;color:var(--text-secondary)">
        Sending is throttled and unsubscribed, bounced and recently-mailed contacts are
        skipped automatically at send time.</p>`,
    onConfirm: async () => {
      const r = await api(`/api/campaigns/${id}/send`, { method: 'POST', body: {} });
      toast(`Queued ${num(r.queued)} sends`, 'ok');
      load(true);
    },
  });
}

function newJourneyModal() {
  const lists = state.data.lists || [];
  const campaigns = state.data.email?.campaigns || [];
  const audiences = state.data.ads?.audiences || [];
  openModal({
    title: 'New journey', wide: true, confirm: 'Create',
    body: `
      <label class="field"><span>Name *</span>
        <input type="text" id="j-name" placeholder="Pricing visit → case study + retarget" /></label>
      <label class="field"><span>Description</span><input type="text" id="j-desc" /></label>
      <label class="field"><span>Trigger</span>
        <select id="j-trigger">
          <option value="event">An event happened</option>
          <option value="score_threshold">Score crossed a threshold</option>
          <option value="segment_entry">Contact entered a segment</option>
        </select></label>
      <label class="field"><span>Trigger config (JSON)</span>
        <textarea id="j-tcfg">{ "event_type": "page_view", "path_contains": "/pricing", "within_hours": 48 }</textarea></label>
      <label class="field"><span>Conditions the contact must also match (JSON)</span>
        <textarea id="j-cond">{ "field": "seniority", "operator": "in", "value": ["vp", "cxo", "director"] }</textarea></label>
      <label class="field"><span>Actions (JSON array)</span>
        <textarea id="j-actions" style="min-height:120px">[
  ${campaigns[0] ? `{ "type": "send_email", "campaign_id": "${campaigns[0].id}" },` : ''}
  ${audiences[0] ? `{ "type": "add_to_audience", "audience_id": "${audiences[0].id}", "sync_now": true },` : ''}
  { "type": "set_lifecycle", "stage": "mql" },
  { "type": "alert", "title": "Hot: pricing page visit" }
]</textarea>
        <div class="help">Actions: send_email, add_to_list, add_to_audience, set_lifecycle,
          set_field, alert, webhook, record_event.</div></label>
      <div class="row-inline">
        <label class="field"><span>Cooldown (hours)</span>
          <input type="number" id="j-cool" value="168" min="0" /></label>
        <label class="field"><span>Start</span>
          <select id="j-enabled"><option value="false">Paused</option>
            <option value="true">Live immediately</option></select></label>
      </div>`,
    onConfirm: async (body) => {
      await api('/api/journeys', {
        method: 'POST',
        body: {
          name: body.querySelector('#j-name').value.trim(),
          description: body.querySelector('#j-desc').value.trim(),
          trigger_type: body.querySelector('#j-trigger').value,
          trigger_config: JSON.parse(body.querySelector('#j-tcfg').value || '{}'),
          conditions: JSON.parse(body.querySelector('#j-cond').value || '{}'),
          actions: JSON.parse(body.querySelector('#j-actions').value || '[]'),
          cooldown_hours: Number(body.querySelector('#j-cool').value),
          enabled: body.querySelector('#j-enabled').value === 'true',
        },
      });
      toast('Journey created', 'ok');
      load(true);
    },
  });
}

// -------------------------------------------------------------------- load --
function filterQuery() {
  const f = state.filters || {};
  return Object.entries(f)
    .filter(([, v]) => v)
    .map(([k, v]) => `&${k === 'q' ? 'q' : k}=${encodeURIComponent(v)}`)
    .join('');
}

async function loadView() {
  const d = state.days;
  try {
    switch (state.view) {
      case 'overview':
        state.data.dashboard = await api(`/api/dashboard?days=${d}`);
        break;
      case 'contacts':
        state.data.contacts = await api(`/api/contacts?limit=100${filterQuery()}`);
        break;
      case 'lists':
        state.data.lists = await api('/api/lists');
        break;
      case 'email':
        state.data.lists = await api('/api/lists');
        state.data.email = {
          campaigns: await api('/api/campaigns'),
          templates: await api('/api/templates'),
        };
        break;
      case 'ads':
        state.data.lists = await api('/api/lists');
        state.data.ads = {
          platforms: await api('/api/ads/platforms'),
          audiences: await api('/api/ads/audiences'),
          campaigns: await api(`/api/ads/campaigns?days=${d}`),
          influence: await api(`/api/ads/influence?days=${d}`),
          comparison: await api(`/api/ads/comparison?days=${d}`),
        };
        break;
      case 'journeys':
        state.data.journeys = await api('/api/journeys');
        state.data.lists = await api('/api/lists');
        state.data.email = {
          campaigns: await api('/api/campaigns'),
          templates: await api('/api/templates'),
        };
        state.data.ads = { ...(state.data.ads || {}), audiences: await api('/api/ads/audiences') };
        break;
      case 'activity':
        state.data.activity = await api(`/api/events?limit=200${filterQuery()}`);
        break;
      case 'accounts':
        state.data.accounts = await api(`/api/accounts?days=${d}`);
        break;
      case 'setup':
        state.data.setup = {
          snippet: await api('/api/setup/snippet'),
          settings: await api('/api/settings'),
          jobs: await api('/api/jobs'),
        };
        break;
    }
    render();
  } catch (err) {
    if (err.message !== 'Unauthorized') toast(err.message, 'err');
  }
}

async function load(force = false) {
  state.status = await api('/api/status');
  if (force) state.data = {};
  await loadView();
}

async function boot() {
  document.documentElement.dataset.theme = localStorage.getItem('beamr_theme') || 'dark';
  const hash = location.hash.replace('#', '');
  if (VIEWS[hash]) state.view = hash;
  try {
    await load(true);
  } catch (err) {
    if (err.message === 'Unauthorized') return;
    toast(err.message, 'err');
  }
  // Keep the overview and activity feed fresh without a manual refresh.
  setInterval(() => {
    if (['overview', 'activity'].includes(state.view) && !document.hidden) loadView();
  }, 30000);
}

window.addEventListener('hashchange', () => {
  const h = location.hash.replace('#', '');
  if (VIEWS[h] && h !== state.view) { state.view = h; render(); loadView(); }
});

if (token) boot(); else renderLogin();
