const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const threshold = LEVELS[(process.env.LOG_LEVEL || 'info').toLowerCase()] ?? 20;

const COLOR = { debug: '\x1b[90m', info: '\x1b[36m', warn: '\x1b[33m', error: '\x1b[31m' };
const RESET = '\x1b[0m';
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;

function emit(level, scope, msg, extra) {
  if (LEVELS[level] < threshold) return;
  const ts = new Date().toISOString().slice(11, 23);
  const tag = `${level.toUpperCase().padEnd(5)}`;
  const head = useColor ? `${COLOR[level]}${tag}${RESET}` : tag;
  const line = `${ts} ${head} ${scope ? `[${scope}] ` : ''}${msg}`;
  const detail = extra === undefined ? ''
    : ' ' + (extra instanceof Error ? (extra.stack || extra.message)
      : typeof extra === 'string' ? extra : JSON.stringify(extra));
  (level === 'error' || level === 'warn' ? console.error : console.log)(line + detail);
}

export function logger(scope = '') {
  return {
    debug: (m, e) => emit('debug', scope, m, e),
    info: (m, e) => emit('info', scope, m, e),
    warn: (m, e) => emit('warn', scope, m, e),
    error: (m, e) => emit('error', scope, m, e),
    child: (sub) => logger(scope ? `${scope}:${sub}` : sub),
  };
}

export const log = logger();
