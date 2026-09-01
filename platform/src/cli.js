#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { config, ensureSecrets } from './config.js';
import { db, settings, all, get } from './db/index.js';
import { logger } from './lib/logger.js';

const log = logger('cli');
const [, , command, ...args] = process.argv;

function flag(name, fallback = null) {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const next = args[i + 1];
  return next && !next.startsWith('--') ? next : true;
}

const COMMANDS = {
  async migrate() {
    db();
    ensureSecrets(settings);
    const tables = all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    console.log(`Database ready at ${config.dbPath}`);
    console.log(`${tables.length} tables: ${tables.map((t) => t.name).join(', ')}`);
    if (config.adminTokenGenerated) console.log(`\nAdmin token: ${config.adminToken}`);
  },

  async seed() {
    const { seed } = await import('./db/seed.js');
    const result = await seed({ reset: flag('reset') === true });
    console.log(JSON.stringify(result, null, 2));
  },

  async import() {
    const file = flag('file') || args[0];
    if (!file) { console.error('Usage: npm run import -- --file contacts.csv [--list <id>] [--dry-run]'); process.exit(1); }
    const { importCsv } = await import('./core/contacts.js');
    const report = importCsv(readFileSync(file, 'utf8'), {
      listId: flag('list'),
      overwrite: flag('overwrite') === true,
      dryRun: flag('dry-run') === true,
      source: `import:${file.split('/').pop()}`,
    });
    console.log(JSON.stringify(report, null, 2));
  },

  async score() {
    const { recomputeAll } = await import('./core/scoring.js');
    console.log(JSON.stringify(recomputeAll(), null, 2));
  },

  async 'sync-linkedin'() {
    const { syncAll } = await import('./channels/linkedin/audiences.js');
    console.log(JSON.stringify(await syncAll(), null, 2));
  },

  async 'pull-ads'() {
    const { syncCampaigns, syncMetrics, syncLeadResponses } = await import('./channels/linkedin/insights.js');
    console.log(JSON.stringify({
      campaigns: await syncCampaigns(),
      metrics: await syncMetrics({ days: Number(flag('days', 30)) }),
      leads: await syncLeadResponses(),
    }, null, 2));
  },

  async send() {
    const campaignId = flag('campaign') || args[0];
    if (!campaignId) { console.error('Usage: node src/cli.js send --campaign <id>'); process.exit(1); }
    const { queueCampaign, processQueue } = await import('./channels/email/campaigns.js');
    console.log(JSON.stringify(queueCampaign(campaignId), null, 2));
    console.log(JSON.stringify(await processQueue({ max: 1000 }), null, 2));
  },

  async journeys() {
    const { runAll } = await import('./core/journeys.js');
    console.log(JSON.stringify(await runAll(), null, 2));
  },

  async token() {
    db();
    ensureSecrets(settings);
    console.log(config.adminToken);
  },

  async stats() {
    db();
    const { overview } = await import('./core/analytics.js');
    console.log(JSON.stringify(overview({ days: Number(flag('days', 30)) }), null, 2));
  },

  async help() {
    console.log(`
Beamr contact-based marketing engine — CLI

  migrate                          create/upgrade the database
  seed [--reset]                   load a realistic demo dataset
  token                            print the admin token
  import --file <csv> [--list <id>] [--overwrite] [--dry-run]
  score                            recompute every contact's score
  send --campaign <id>             queue and flush one campaign
  journeys                         evaluate all enabled journeys once
  sync-linkedin                    push matched audiences to LinkedIn
  pull-ads [--days 30]             pull campaigns, metrics and lead forms
  stats [--days 30]                print the overview metrics

Start the server with:  npm start
`);
  },
};

const fn = COMMANDS[command] || COMMANDS.help;
db();
ensureSecrets(settings);
fn().catch((err) => { log.error(err.message, err); process.exit(1); });
