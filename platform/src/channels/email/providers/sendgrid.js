import { config } from '../../../config.js';

/** SendGrid v3 mail/send adapter. */
export async function send(message) {
  const key = config.email.sendgridKey;
  if (!key) throw new Error('SENDGRID_API_KEY is not configured');

  const headers = {};
  if (message.unsubscribeUrl) {
    headers['List-Unsubscribe'] = `<${message.unsubscribeUrl}>`;
    headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click';
  }

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: message.to, name: message.toName || undefined }] }],
      from: { email: message.from, name: message.fromName },
      ...(message.replyTo ? { reply_to: { email: message.replyTo } } : {}),
      subject: message.subject,
      content: [
        ...(message.text ? [{ type: 'text/plain', value: message.text }] : []),
        ...(message.html ? [{ type: 'text/html', value: message.html }] : []),
      ],
      ...(Object.keys(headers).length ? { headers } : {}),
      // We do our own open/click tracking so links stay first-party.
      tracking_settings: {
        click_tracking: { enable: false },
        open_tracking: { enable: false },
      },
      mail_settings: { bypass_list_management: { enable: false } },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`SendGrid ${res.status}: ${body.slice(0, 300)}`);
  }
  return { id: res.headers.get('x-message-id') || null, provider: 'sendgrid' };
}

export async function verify() {
  if (!config.email.sendgridKey) return { ok: false, error: 'SENDGRID_API_KEY is not configured' };
  const res = await fetch('https://api.sendgrid.com/v3/user/profile', {
    headers: { authorization: `Bearer ${config.email.sendgridKey}` },
  });
  return res.ok ? { ok: true } : { ok: false, error: `SendGrid ${res.status}` };
}
