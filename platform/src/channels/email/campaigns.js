import { all, get, run, tx } from '../../db/index.js';
import { config } from '../../config.js';
import { badRequest, notFound } from '../../lib/http.js';
import { id, now, parseJson, slugify } from '../../lib/util.js';
import { render, renderText, htmlToText, extractTags } from '../../lib/template.js';
import { buildQuery } from '../../core/segments.js';
import { recordEvent } from '../../core/events.js';
import { sendMessage } from './provider.js';
import * as tracking from './tracking.js';
import { logger } from '../../lib/logger.js';

const log = logger('campaigns');

// ---------------------------------------------------------------- templates --
export function createTemplate({ name, subject, html, text = null, preheader = '' }) {
  if (!name || !subject || !html) throw badRequest('Template needs name, subject and html');
  const ts = now();
  const templateId = id('tpl');
  let slug = slugify(name);
  if (get('SELECT id FROM email_templates WHERE slug = ?', slug)) slug = `${slug}-${templateId.slice(-4)}`;
  run(
    `INSERT INTO email_templates (id, name, slug, subject, preheader, html, text, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    templateId, name, slug, subject, preheader, html, text ?? htmlToText(html), ts, ts,
  );
  return get('SELECT * FROM email_templates WHERE id = ?', templateId);
}

export function updateTemplate(templateId, patch) {
  const tpl = getTemplate(templateId);
  const fields = ['name', 'subject', 'preheader', 'html', 'text'];
  const sets = [];
  const args = [];
  for (const f of fields) {
    if (patch[f] === undefined) continue;
    sets.push(`${f} = ?`);
    args.push(patch[f]);
  }
  if (!sets.length) return tpl;
  sets.push('updated_at = ?'); args.push(now());
  run(`UPDATE email_templates SET ${sets.join(', ')} WHERE id = ?`, ...args, tpl.id);
  return getTemplate(tpl.id);
}

export function getTemplate(templateId) {
  const tpl = get('SELECT * FROM email_templates WHERE id = ? OR slug = ?', templateId, templateId);
  if (!tpl) throw notFound(`No template ${templateId}`);
  return tpl;
}

// ---------------------------------------------------------------- campaigns --
export function createCampaign(input) {
  if (!input.name) throw badRequest('Campaign needs a name');
  const template = getTemplate(input.template_id);
  const ts = now();
  const campaignId = id('cp');
  run(
    `INSERT INTO campaigns (id, name, template_id, list_id, segment_rules, from_name, from_email,
       reply_to, status, scheduled_at, throttle_per_min, suppress_days, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    campaignId, input.name, template.id, input.list_id || null,
    JSON.stringify(input.segment_rules || {}),
    input.from_name || config.email.fromName,
    input.from_email || config.email.fromEmail,
    input.reply_to || config.email.replyTo || null,
    'draft',
    input.scheduled_at || null,
    Number(input.throttle_per_min) || config.email.maxPerMinute,
    input.suppress_days === undefined ? 3 : Number(input.suppress_days),
    ts, ts,
  );
  return getCampaign(campaignId);
}

export function getCampaign(campaignId) {
  const c = get('SELECT * FROM campaigns WHERE id = ?', campaignId);
  if (!c) throw notFound(`No campaign ${campaignId}`);
  return c;
}

export function updateCampaign(campaignId, patch) {
  const campaign = getCampaign(campaignId);
  if (campaign.status === 'sending') throw badRequest('Cannot edit a campaign while it is sending — pause it first');
  const fields = ['name', 'template_id', 'list_id', 'from_name', 'from_email', 'reply_to', 'scheduled_at', 'throttle_per_min', 'suppress_days'];
  const sets = [];
  const args = [];
  for (const f of fields) {
    if (patch[f] === undefined) continue;
    sets.push(`${f} = ?`); args.push(patch[f]);
  }
  if (patch.segment_rules !== undefined) { sets.push('segment_rules = ?'); args.push(JSON.stringify(patch.segment_rules)); }
  if (!sets.length) return campaign;
  sets.push('updated_at = ?'); args.push(now());
  run(`UPDATE campaigns SET ${sets.join(', ')} WHERE id = ?`, ...args, campaign.id);
  return getCampaign(campaign.id);
}

/**
 * Resolves who a campaign would actually reach.
 * `mailable: true` applies consent + suppression, and the frequency cap keeps
 * us from mailing the same person twice in `suppress_days`.
 */
export function audienceFor(campaign, { limit = null, countOnly = false } = {}) {
  const suppressDays = Number(campaign.suppress_days) || 0;
  const extraWhere = suppressDays > 0
    ? `NOT EXISTS (SELECT 1 FROM sends s2 WHERE s2.contact_id = contacts.id AND s2.status = 'sent'
         AND s2.campaign_id != ? AND s2.sent_at >= datetime('now', ?))`
    : null;
  const extraArgs = suppressDays > 0 ? [campaign.id, `-${suppressDays} days`] : [];

  const opts = {
    rules: parseJson(campaign.segment_rules, {}),
    listId: campaign.list_id,
    mailable: true,
    extraWhere,
    extraArgs,
    select: countOnly ? 'COUNT(*) AS n' : 'contacts.*',
    orderBy: countOnly ? null : 'contacts.score DESC',
    limit: countOnly ? null : limit,
  };
  const { sql, args } = buildQuery(opts);
  return countOnly ? (get(sql, ...args)?.n ?? 0) : all(sql, ...args);
}

/** Renders one contact's copy of a campaign, fully personalised. */
export function renderFor(campaign, contact, { sendId = null } = {}) {
  const template = getTemplate(campaign.template_id);
  const ctx = buildContext(contact, campaign);
  const token = tracking.sendToken(sendId || 'preview', contact.id);

  const subject = renderText(template.subject, ctx).trim();
  const { html: linked } = tracking.rewriteLinks(template.html, campaign.id);
  const rendered = render(linked, ctx);
  const withLinks = tracking.personalizeLinks(rendered, token);
  const html = tracking.decorateHtml(withLinks, { token, campaignName: campaign.name });
  const text = template.text
    ? renderText(template.text, ctx) + `\n\n—\nUnsubscribe: ${tracking.unsubUrl(token)}\n${config.email.postalAddress}`
    : htmlToText(html);

  return { subject, html, text, token, preheader: renderText(template.preheader || '', ctx) };
}

function buildContext(contact, campaign) {
  return {
    ...contact,
    attrs: parseJson(contact.attrs, {}),
    full_name: [contact.first_name, contact.last_name].filter(Boolean).join(' '),
    campaign_name: campaign?.name,
    company_or_default: contact.company || 'your team',
    sender_name: campaign?.from_name || config.email.fromName,
  };
}

/**
 * Pre-flight: everything you want to know before a campaign goes out.
 * Missing merge tags are the classic "Hi {{first_name}}," disaster, so they
 * are reported per tag with the number of contacts that would render blank.
 */
export function preflight(campaignId) {
  const campaign = getCampaign(campaignId);
  const template = getTemplate(campaign.template_id);
  const recipients = audienceFor(campaign, { limit: 500 });
  const total = audienceFor(campaign, { countOnly: true });

  const tags = extractTags(`${template.subject} ${template.html} ${template.preheader || ''}`)
    .filter((t) => !['campaign_name', 'sender_name', 'company_or_default', 'full_name'].includes(t));

  const missing = {};
  for (const contact of recipients) {
    const ctx = buildContext(contact, campaign);
    for (const tag of tags) {
      const value = tag.split('.').reduce((a, k) => (a == null ? undefined : a[k]), ctx);
      if (value === undefined || value === null || String(value).trim() === '') {
        missing[tag] = (missing[tag] || 0) + 1;
      }
    }
  }

  const { links } = tracking.rewriteLinks(template.html, campaign.id);
  const warnings = [];
  if (!total) warnings.push('No contacts match this campaign — nothing would send.');
  if (!links.length) warnings.push('The template has no trackable links, so clicks cannot be attributed.');
  if (!/{{\s*first_name/.test(template.html)) warnings.push('Template does not personalise on first_name.');
  for (const [tag, count] of Object.entries(missing)) {
    warnings.push(`${count} of ${recipients.length} sampled contacts have no value for {{${tag}}} — add a | fallback.`);
  }
  if (!config.email.postalAddress) warnings.push('EMAIL_POSTAL_ADDRESS is empty; a physical address is legally required.');

  return {
    campaign: campaign.name,
    recipients: total,
    sampled: recipients.length,
    merge_tags: tags,
    missing_values: missing,
    links: links.map((l) => l.url),
    warnings,
    sample: recipients.slice(0, 3).map((c) => {
      const r = renderFor(campaign, c);
      return { email: c.email, subject: r.subject, preview: htmlToText(r.html).slice(0, 240) };
    }),
  };
}

/** Materialises the audience into queued send rows. Idempotent per contact. */
export function queueCampaign(campaignId, { limit = null } = {}) {
  const campaign = getCampaign(campaignId);
  if (!['draft', 'scheduled', 'paused'].includes(campaign.status)) {
    throw badRequest(`Campaign is ${campaign.status}; only draft, scheduled or paused campaigns can be queued`);
  }
  const recipients = audienceFor(campaign, { limit });
  const ts = now();

  const queued = tx(() => {
    let n = 0;
    for (const contact of recipients) {
      const existing = get('SELECT id FROM sends WHERE campaign_id = ? AND contact_id = ?', campaign.id, contact.id);
      if (existing) continue;
      const sendId = id('sd');
      run(
        `INSERT INTO sends (id, campaign_id, contact_id, token, status, queued_at)
         VALUES (?,?,?,?,?,?)`,
        sendId, campaign.id, contact.id, tracking.sendToken(sendId, contact.id), 'queued', ts,
      );
      n += 1;
    }
    run(
      "UPDATE campaigns SET status = 'sending', started_at = COALESCE(started_at, ?), updated_at = ? WHERE id = ?",
      ts, ts, campaign.id,
    );
    return n;
  });

  log.info(`campaign "${campaign.name}": queued ${queued} sends`);
  return { campaign_id: campaign.id, queued, audience: recipients.length };
}

/**
 * Drains the queue, respecting each campaign's per-minute throttle.
 * Called on an interval by the scheduler; safe to call concurrently because
 * each row is claimed with a conditional UPDATE before sending.
 */
export async function processQueue({ max = null } = {}) {
  const results = { sent: 0, failed: 0, skipped: 0, campaigns: [] };
  const active = all("SELECT * FROM campaigns WHERE status = 'sending' ORDER BY started_at");

  for (const campaign of active) {
    const perTick = max ?? Math.max(1, Math.ceil((campaign.throttle_per_min || 60) * (config.jobs.queueIntervalSec / 60)));
    const batch = all(
      `SELECT s.*, c.* , s.id AS send_id, s.status AS send_status
       FROM sends s JOIN contacts c ON c.id = s.contact_id
       WHERE s.campaign_id = ? AND s.status = 'queued'
       ORDER BY c.score DESC, s.queued_at LIMIT ?`,
      campaign.id, perTick,
    );

    let sent = 0;
    for (const row of batch) {
      // Claim the row so a second worker cannot send it twice.
      const claim = run(
        "UPDATE sends SET status = 'sending', attempts = attempts + 1 WHERE id = ? AND status = 'queued'",
        row.send_id,
      );
      if (!claim.changes) continue;

      const contact = get('SELECT * FROM contacts WHERE id = ?', row.contact_id);
      const guard = mailabilityGuard(contact);
      if (guard) {
        run("UPDATE sends SET status = 'skipped', skip_reason = ? WHERE id = ?", guard, row.send_id);
        results.skipped += 1;
        continue;
      }

      try {
        const rendered = renderFor(campaign, contact, { sendId: row.send_id });
        const result = await sendMessage({
          from: campaign.from_email,
          fromName: campaign.from_name,
          to: contact.email,
          toName: [contact.first_name, contact.last_name].filter(Boolean).join(' '),
          replyTo: campaign.reply_to,
          subject: rendered.subject,
          html: rendered.html,
          text: rendered.text,
          unsubscribeUrl: tracking.unsubUrl(rendered.token),
          listId: campaign.list_id || campaign.id,
        });
        run(
          "UPDATE sends SET status = 'sent', sent_at = ?, subject = ?, provider_id = ?, error = NULL WHERE id = ?",
          now(), rendered.subject, result.id || null, row.send_id,
        );
        recordEvent({
          contact_id: contact.id,
          channel: 'email',
          type: 'email_sent',
          campaign_id: campaign.id,
          meta: { send_id: row.send_id, subject: rendered.subject, provider: result.provider },
        });
        sent += 1;
        results.sent += 1;
      } catch (err) {
        const attempts = (row.attempts || 0) + 1;
        // Three strikes, then it is a real failure rather than a transient one.
        run(
          `UPDATE sends SET status = ?, error = ? WHERE id = ?`,
          attempts >= 3 ? 'failed' : 'queued', String(err.message).slice(0, 500), row.send_id,
        );
        results.failed += 1;
        log.warn(`send failed for ${contact.email} (attempt ${attempts}): ${err.message}`);
      }
    }

    const remaining = get(
      "SELECT COUNT(*) AS n FROM sends WHERE campaign_id = ? AND status IN ('queued','sending')",
      campaign.id,
    )?.n ?? 0;
    if (remaining === 0) {
      run("UPDATE campaigns SET status = 'sent', completed_at = ?, updated_at = ? WHERE id = ?", now(), now(), campaign.id);
      log.info(`campaign "${campaign.name}" completed`);
    }
    if (sent) results.campaigns.push({ id: campaign.id, name: campaign.name, sent, remaining });
  }

  return results;
}

/** Last-second consent check — state can change between queueing and sending. */
function mailabilityGuard(contact) {
  if (!contact) return 'contact deleted';
  if (contact.status !== 'active') return `contact is ${contact.status}`;
  if (!contact.consent_email) return 'no email consent';
  if (get('SELECT email FROM suppressions WHERE email = ?', contact.email)) return 'suppressed';
  return null;
}

export function pauseCampaign(campaignId) {
  const campaign = getCampaign(campaignId);
  run("UPDATE campaigns SET status = 'paused', updated_at = ? WHERE id = ?", now(), campaign.id);
  return getCampaign(campaign.id);
}

export function resumeCampaign(campaignId) {
  const campaign = getCampaign(campaignId);
  if (campaign.status !== 'paused') throw badRequest('Campaign is not paused');
  run("UPDATE campaigns SET status = 'sending', updated_at = ? WHERE id = ?", now(), campaign.id);
  return getCampaign(campaign.id);
}

export function cancelCampaign(campaignId) {
  const campaign = getCampaign(campaignId);
  run("UPDATE sends SET status = 'skipped', skip_reason = 'campaign cancelled' WHERE campaign_id = ? AND status = 'queued'", campaign.id);
  run("UPDATE campaigns SET status = 'cancelled', completed_at = ?, updated_at = ? WHERE id = ?", now(), now(), campaign.id);
  return getCampaign(campaign.id);
}

/** Sends one message to one address, outside any campaign (tests, journeys). */
export async function sendOne(campaignId, contactId) {
  const campaign = getCampaign(campaignId);
  const contact = get('SELECT * FROM contacts WHERE id = ?', contactId);
  if (!contact) throw notFound(`No contact ${contactId}`);
  const guard = mailabilityGuard(contact);
  if (guard) return { sent: false, reason: guard };

  let send = get('SELECT * FROM sends WHERE campaign_id = ? AND contact_id = ?', campaign.id, contact.id);
  if (!send) {
    const sendId = id('sd');
    run(
      'INSERT INTO sends (id, campaign_id, contact_id, token, status, queued_at) VALUES (?,?,?,?,?,?)',
      sendId, campaign.id, contact.id, tracking.sendToken(sendId, contact.id), 'queued', now(),
    );
    send = get('SELECT * FROM sends WHERE id = ?', sendId);
  } else if (send.status === 'sent') {
    return { sent: false, reason: 'already sent to this contact in this campaign' };
  }

  const rendered = renderFor(campaign, contact, { sendId: send.id });
  const result = await sendMessage({
    from: campaign.from_email,
    fromName: campaign.from_name,
    to: contact.email,
    toName: [contact.first_name, contact.last_name].filter(Boolean).join(' '),
    replyTo: campaign.reply_to,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    unsubscribeUrl: tracking.unsubUrl(rendered.token),
    listId: campaign.list_id || campaign.id,
  });
  run("UPDATE sends SET status = 'sent', sent_at = ?, subject = ?, provider_id = ? WHERE id = ?",
    now(), rendered.subject, result.id || null, send.id);
  recordEvent({
    contact_id: contact.id, channel: 'email', type: 'email_sent',
    campaign_id: campaign.id, meta: { send_id: send.id, subject: rendered.subject, one_off: true },
  });
  return { sent: true, send_id: send.id, provider: result.provider };
}

/** Per-campaign performance, the numbers a marketer actually reports on. */
export function campaignStats(campaignId) {
  const campaign = getCampaign(campaignId);
  const s = get(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'sent') AS sent,
       SUM(status = 'queued') AS queued,
       SUM(status = 'failed') AS failed,
       SUM(status = 'skipped') AS skipped,
       SUM(status = 'bounced') AS bounced,
       SUM(opened_at IS NOT NULL) AS opened,
       SUM(first_click_at IS NOT NULL) AS clicked,
       SUM(open_count) AS total_opens,
       SUM(click_count) AS total_clicks
     FROM sends WHERE campaign_id = ?`,
    campaign.id,
  ) || {};
  const sent = Number(s.sent || 0);
  const pct = (n) => (sent ? Math.round((Number(n || 0) / sent) * 1000) / 10 : 0);

  return {
    ...campaign,
    segment_rules: parseJson(campaign.segment_rules, {}),
    stats: {
      total: Number(s.total || 0),
      sent,
      queued: Number(s.queued || 0),
      failed: Number(s.failed || 0),
      skipped: Number(s.skipped || 0),
      bounced: Number(s.bounced || 0),
      opened: Number(s.opened || 0),
      clicked: Number(s.clicked || 0),
      total_opens: Number(s.total_opens || 0),
      total_clicks: Number(s.total_clicks || 0),
      open_rate: pct(s.opened),
      click_rate: pct(s.clicked),
      // CTOR is the honest measure of whether the copy worked.
      click_to_open_rate: Number(s.opened) ? Math.round((Number(s.clicked) / Number(s.opened)) * 1000) / 10 : 0,
      bounce_rate: pct(s.bounced),
    },
    links: all(
      'SELECT url, label, click_count FROM email_links WHERE campaign_id = ? ORDER BY click_count DESC',
      campaign.id,
    ),
  };
}
