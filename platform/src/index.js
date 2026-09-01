import { config, ensureSecrets } from './config.js';
import { db, settings } from './db/index.js';
import { createServer } from './web/server.js';
import { startScheduler, stopScheduler } from './jobs/scheduler.js';
import { isDryRun } from './config.js';
import { logger } from './lib/logger.js';

const log = logger('beamr');

function banner() {
  const lines = [
    '',
    '  \x1b[32m▍\x1b[0m \x1b[1mBeamr — contact-based marketing engine\x1b[0m',
    '',
    `    console        ${config.publicUrl}/`,
    `    tracker        ${config.publicUrl}/t/beamr.js`,
    `    api            ${config.publicUrl}/api/status`,
    `    database       ${config.dbPath}`,
    `    email          ${config.email.provider}${isDryRun.email ? ' \x1b[33m(dry run — writes .eml to data/outbox)\x1b[0m' : ''}`,
    `    linkedin       ${isDryRun.linkedin ? '\x1b[33mnot configured (dry run)\x1b[0m' : `account ${config.linkedin.adAccountId}`}`,
    '',
  ];
  if (config.adminTokenGenerated) {
    lines.push(
      '  \x1b[33m▍ Generated an admin token (set ADMIN_TOKEN to pin your own):\x1b[0m',
      `    \x1b[1m${config.adminToken}\x1b[0m`,
      '',
    );
  }
  console.log(lines.join('\n'));
}

async function main() {
  db();                     // opens + migrates
  ensureSecrets(settings);  // fills in SECRET_KEY / ADMIN_TOKEN if unset

  const server = createServer();

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(config.port, config.host, resolve);
  });

  banner();
  log.info(`listening on ${config.host}:${config.port}`);
  startScheduler();

  const shutdown = (signal) => {
    log.info(`${signal} received, shutting down`);
    stopScheduler();
    server.close(() => process.exit(0));
    // Don't hang forever on a keep-alive connection.
    setTimeout(() => process.exit(0), 5000).unref();
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (err) => log.error('unhandled rejection', err));
}

main().catch((err) => {
  log.error('failed to start', err);
  process.exit(1);
});
