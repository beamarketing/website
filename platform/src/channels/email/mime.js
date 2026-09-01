import { randomBytes } from 'node:crypto';
import { config } from '../../config.js';

/**
 * RFC-5322 / MIME message building. No dependency, because the only thing we
 * need is a correct multipart/alternative with proper header encoding.
 */

/** Encoded-word for headers containing non-ASCII (RFC 2047). */
export function encodeHeader(value) {
  const s = String(value ?? '');
  if (/^[\x20-\x7e]*$/.test(s)) return s;
  // Split into <=63-byte base64 chunks so no encoded word exceeds 75 chars.
  const buf = Buffer.from(s, 'utf8');
  const chunks = [];
  for (let i = 0; i < buf.length; i += 45) {
    chunks.push(`=?UTF-8?B?${buf.subarray(i, i + 45).toString('base64')}?=`);
  }
  return chunks.join('\r\n ');
}

/** "Name <addr>" with the display name safely encoded and quoted. */
export function formatAddress(email, name) {
  if (!name) return email;
  const encoded = encodeHeader(name);
  const needsQuotes = /[",:;<>@\\[\]]/.test(name) && encoded === name;
  return `${needsQuotes ? `"${name.replace(/(["\\])/g, '\\$1')}"` : encoded} <${email}>`;
}

/**
 * Quoted-printable, required for 8-bit bodies over SMTP without BINARYMIME.
 * Also protects against SMTP dot-stuffing and >998-char line limits.
 */
export function quotedPrintable(input) {
  const bytes = Buffer.from(String(input ?? ''), 'utf8');
  let out = '';
  let lineLen = 0;

  const push = (chunk) => {
    if (lineLen + chunk.length > 75) { out += '=\r\n'; lineLen = 0; }
    out += chunk;
    lineLen += chunk.length;
  };

  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if (b === 0x0d && bytes[i + 1] === 0x0a) { out += '\r\n'; lineLen = 0; i++; continue; }
    if (b === 0x0a) { out += '\r\n'; lineLen = 0; continue; }
    const isPrintable = (b >= 33 && b <= 126 && b !== 61) || b === 32 || b === 9;
    if (isPrintable) {
      // Trailing whitespace must be encoded or it will be stripped in transit.
      const atEol = bytes[i + 1] === 0x0d || bytes[i + 1] === 0x0a || i === bytes.length - 1;
      if ((b === 32 || b === 9) && atEol) push(`=${b.toString(16).toUpperCase().padStart(2, '0')}`);
      else push(String.fromCharCode(b));
    } else {
      push(`=${b.toString(16).toUpperCase().padStart(2, '0')}`);
    }
  }
  return out;
}

export const messageId = (domain) =>
  `<${Date.now().toString(36)}.${randomBytes(8).toString('hex')}@${domain || 'localhost'}>`;

/**
 * Builds the full RFC-5322 message.
 *
 * List-Unsubscribe + List-Unsubscribe-Post give Gmail/Outlook the native
 * one-click unsubscribe button. Without them, marketing mail to consumer
 * mailboxes gets penalised — so they are always set, never optional.
 */
export function buildMessage({
  from, fromName, to, toName, subject, html, text, replyTo,
  unsubscribeUrl, listId, headers = {},
}) {
  const domain = String(from).split('@')[1];
  const boundary = `--_bmr_${randomBytes(12).toString('hex')}`;
  const id = messageId(domain);

  const lines = [
    `From: ${formatAddress(from, fromName)}`,
    `To: ${formatAddress(to, toName)}`,
    `Subject: ${encodeHeader(subject)}`,
    `Message-ID: ${id}`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
  ];
  if (replyTo) lines.push(`Reply-To: ${formatAddress(replyTo)}`);
  if (unsubscribeUrl) {
    lines.push(`List-Unsubscribe: <${unsubscribeUrl}>, <mailto:${from}?subject=unsubscribe>`);
    lines.push('List-Unsubscribe-Post: List-Unsubscribe=One-Click');
  }
  if (listId) lines.push(`List-ID: <${listId}.${domain}>`);
  lines.push('Precedence: bulk');
  lines.push('Auto-Submitted: auto-generated');
  for (const [k, v] of Object.entries(headers)) lines.push(`${k}: ${encodeHeader(v)}`);

  const plain = text || '';
  if (html) {
    lines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
    lines.push('');
    lines.push('This is a multi-part message in MIME format.');
    lines.push(`--${boundary}`);
    lines.push('Content-Type: text/plain; charset=UTF-8');
    lines.push('Content-Transfer-Encoding: quoted-printable');
    lines.push('');
    lines.push(quotedPrintable(plain));
    lines.push(`--${boundary}`);
    lines.push('Content-Type: text/html; charset=UTF-8');
    lines.push('Content-Transfer-Encoding: quoted-printable');
    lines.push('');
    lines.push(quotedPrintable(html));
    lines.push(`--${boundary}--`);
  } else {
    lines.push('Content-Type: text/plain; charset=UTF-8');
    lines.push('Content-Transfer-Encoding: quoted-printable');
    lines.push('');
    lines.push(quotedPrintable(plain));
  }

  return { raw: lines.join('\r\n') + '\r\n', messageId: id };
}

export const defaultFrom = () => ({
  email: config.email.fromEmail,
  name: config.email.fromName,
});
