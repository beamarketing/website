import net from 'node:net';
import tls from 'node:tls';
import { config } from '../../../config.js';
import { logger } from '../../../lib/logger.js';
import { buildMessage } from '../mime.js';

const log = logger('smtp');

/**
 * Minimal but correct ESMTP client: EHLO → STARTTLS → AUTH → MAIL/RCPT/DATA.
 * Talks to any relay (Google Workspace, SES, Postmark, Mailgun, a local
 * Postfix). DKIM/SPF alignment is the relay's job, which is why we don't
 * sign here.
 */
class SmtpSession {
  constructor(socket) {
    this.socket = socket;
    this.buffer = '';
    this.pending = [];
    this.closed = false;
    socket.setEncoding('utf8');
    socket.on('data', (chunk) => this._onData(chunk));
    socket.on('error', (err) => this._fail(err));
    socket.on('close', () => { this.closed = true; this._fail(new Error('SMTP connection closed')); });
  }

  _onData(chunk) {
    this.buffer += chunk;
    // A reply ends with "NNN <SP>text CRLF"; "NNN-text" lines are continuations.
    let match;
    while ((match = /^(\d{3})([ -])([\s\S]*?)\r\n/m.exec(this.buffer))) {
      const full = this.buffer.slice(0, match.index + match[0].length);
      const lines = full.trimEnd().split('\r\n');
      const last = lines[lines.length - 1];
      if (/^\d{3}-/.test(last)) break; // more continuation lines to come
      this.buffer = this.buffer.slice(full.length);
      const code = Number(lines[lines.length - 1].slice(0, 3));
      const text = lines.map((l) => l.slice(4)).join('\n');
      const waiter = this.pending.shift();
      if (waiter) {
        if (code >= 400) waiter.reject(new Error(`SMTP ${code}: ${text}`));
        else waiter.resolve({ code, text });
      }
    }
  }

  _fail(err) {
    while (this.pending.length) this.pending.shift().reject(err);
  }

  expect() {
    return new Promise((resolve, reject) => this.pending.push({ resolve, reject }));
  }

  send(command, { secret = false } = {}) {
    if (process.env.SMTP_DEBUG) log.debug(`C: ${secret ? '***' : command}`);
    this.socket.write(command + '\r\n');
    return this.expect();
  }

  async upgrade(host) {
    return new Promise((resolve, reject) => {
      this.socket.removeAllListeners('data');
      this.socket.removeAllListeners('error');
      this.socket.removeAllListeners('close');
      const secure = tls.connect(
        { socket: this.socket, servername: host, rejectUnauthorized: true },
        () => {
          this.socket = secure;
          this.buffer = '';
          this.pending = [];
          secure.setEncoding('utf8');
          secure.on('data', (chunk) => this._onData(chunk));
          secure.on('error', (err) => this._fail(err));
          secure.on('close', () => { this.closed = true; });
          resolve();
        },
      );
      secure.once('error', reject);
    });
  }

  quit() {
    try { this.socket.write('QUIT\r\n'); } catch { /* already gone */ }
    try { this.socket.end(); } catch { /* already gone */ }
  }
}

function connect({ host, port, secure, timeout = 20000 }) {
  return new Promise((resolve, reject) => {
    const socket = secure
      ? tls.connect({ host, port, servername: host, rejectUnauthorized: true })
      : net.connect({ host, port });
    const onError = (err) => { socket.destroy(); reject(err); };
    socket.setTimeout(timeout, () => onError(new Error(`SMTP connect timeout to ${host}:${port}`)));
    socket.once('error', onError);
    socket.once(secure ? 'secureConnect' : 'connect', () => {
      socket.removeListener('error', onError);
      socket.setTimeout(0);
      resolve(socket);
    });
  });
}

function parseCapabilities(text) {
  return new Set(
    text.split('\n').map((l) => l.trim().toUpperCase()).flatMap((l) => {
      const parts = l.split(/\s+/);
      return parts[0] === 'AUTH' ? ['AUTH', ...parts.slice(1).map((m) => `AUTH ${m}`)] : [parts[0]];
    }),
  );
}

export async function send(message) {
  const { host, port, secure, user, pass, requireTls } = config.email.smtp;
  if (!host) throw new Error('SMTP_HOST is not configured');

  const built = buildMessage(message);
  const socket = await connect({ host, port, secure });
  const session = new SmtpSession(socket);

  try {
    await session.expect(); // server greeting
    const me = process.env.SMTP_EHLO_NAME || 'beamr-abm';
    let caps = parseCapabilities((await session.send(`EHLO ${me}`)).text);

    if (!secure && caps.has('STARTTLS')) {
      await session.send('STARTTLS');
      await session.upgrade(host);
      caps = parseCapabilities((await session.send(`EHLO ${me}`)).text);
    } else if (!secure && requireTls) {
      throw new Error(`SMTP server ${host} does not offer STARTTLS and SMTP_REQUIRE_TLS is on`);
    }

    if (user && pass) {
      if (caps.has('AUTH PLAIN')) {
        const token = Buffer.from(`\0${user}\0${pass}`).toString('base64');
        await session.send(`AUTH PLAIN ${token}`, { secret: true });
      } else if (caps.has('AUTH LOGIN')) {
        await session.send('AUTH LOGIN');
        await session.send(Buffer.from(user).toString('base64'), { secret: true });
        await session.send(Buffer.from(pass).toString('base64'), { secret: true });
      } else {
        throw new Error(`SMTP server ${host} offers no supported AUTH mechanism`);
      }
    }

    await session.send(`MAIL FROM:<${message.from}>`);
    await session.send(`RCPT TO:<${message.to}>`);
    await session.send('DATA');
    // Dot-stuffing: a line that is just "." would otherwise end the message.
    const body = built.raw.replace(/\r\n\./g, '\r\n..');
    session.socket.write(body + '\r\n.\r\n');
    const result = await session.expect();
    session.quit();
    return { id: built.messageId, response: result.text, provider: 'smtp' };
  } catch (err) {
    session.quit();
    throw err;
  }
}

export async function verify() {
  const { host, port, secure } = config.email.smtp;
  if (!host) return { ok: false, error: 'SMTP_HOST is not configured' };
  try {
    const socket = await connect({ host, port, secure });
    const session = new SmtpSession(socket);
    await session.expect();
    const ehlo = await session.send('EHLO beamr-abm');
    session.quit();
    return { ok: true, host, port, capabilities: [...parseCapabilities(ehlo.text)] };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
