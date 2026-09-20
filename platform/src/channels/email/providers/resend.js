import { config } from '../../../config.js';

/** Resend HTTPS API adapter. */
export async function send(message) {
  const key = config.email.resendKey;
  if (!key) throw new Error('RESEND_API_KEY is not configured');

  const headers = {};
  if (message.unsubscribeUrl) {
    headers['List-Unsubscribe'] = `<${message.unsubscribeUrl}>`;
    headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click';
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: message.fromName ? `${message.fromName} <${message.from}>` : message.from,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      ...(Object.keys(headers).length ? { headers } : {}),
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Resend ${res.status}: ${body.message || JSON.stringify(body)}`);
  return { id: body.id, provider: 'resend' };
}

export async function verify() {
  if (!config.email.resendKey) return { ok: false, error: 'RESEND_API_KEY is not configured' };
  const res = await fetch('https://api.resend.com/domains', {
    headers: { authorization: `Bearer ${config.email.resendKey}` },
  });
  if (!res.ok) return { ok: false, error: `Resend ${res.status}` };
  const body = await res.json().catch(() => ({}));
  return { ok: true, domains: (body.data || []).map((d) => ({ name: d.name, status: d.status })) };
}
