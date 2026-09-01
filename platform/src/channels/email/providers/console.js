import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { config } from '../../../config.js';
import { logger } from '../../../lib/logger.js';
import { buildMessage } from '../mime.js';

const log = logger('email:console');

/**
 * Dry-run provider — the default until real credentials are set.
 * Renders the message exactly as it would go out and writes it to
 * data/outbox/, so a campaign can be built, personalised and reviewed
 * end-to-end without sending anything to a real person.
 */
export async function send(message) {
  const built = buildMessage(message);
  const dir = join(config.root, 'data', 'outbox');
  mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const safe = String(message.to).replace(/[^\w@.-]/g, '_');
  const file = join(dir, `${stamp}__${safe}.eml`);
  writeFileSync(file, built.raw, 'utf8');
  log.info(`[dry-run] → ${message.to} · "${message.subject}" · ${file}`);
  return { id: built.messageId, provider: 'console', file };
}

export async function verify() {
  return {
    ok: true,
    dryRun: true,
    note: 'Console provider writes .eml files to data/outbox instead of sending. Set EMAIL_PROVIDER to smtp, resend or sendgrid to send for real.',
  };
}
