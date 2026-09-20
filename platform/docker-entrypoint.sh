#!/bin/sh
set -e

# ---------------------------------------------------------------------------
# A mounted volume does not inherit the image's ownership. On Render, Fly, or
# plain `docker run -v`, /app/data can arrive owned by root while the process
# runs as an unprivileged user — and SQLite then fails with a bare
# SQLITE_CANTOPEN that says nothing about permissions.
#
# So: if we start as root, fix the mount and drop privileges. Every step is
# best-effort, because the writability check below is the real gate — an
# entrypoint that dies inside a chown tells you less than one that reaches the
# check and names the problem.
# ---------------------------------------------------------------------------
DATA_DIR="$(dirname "${DB_PATH:-/app/data/beamr-abm.db}")"
RUN_AS="${RUN_AS_USER:-beamr}"

mkdir -p "$DATA_DIR" 2>/dev/null || true

if [ "$(id -u)" = "0" ]; then
  if ! chown -R "$RUN_AS:$RUN_AS" "$DATA_DIR" 2>/dev/null; then
    echo "WARN: could not chown $DATA_DIR to $RUN_AS; continuing as root." >&2
  elif command -v su-exec > /dev/null 2>&1; then
    exec su-exec "$RUN_AS" "$@"
  else
    echo "WARN: su-exec not found; continuing as root." >&2
  fi
fi

if [ ! -w "$DATA_DIR" ]; then
  echo "FATAL: $DATA_DIR is not writable by $(id -un 2>/dev/null || id -u) (uid $(id -u))." >&2
  echo "       The SQLite database lives here. Check the volume's ownership." >&2
  exit 1
fi

exec "$@"
