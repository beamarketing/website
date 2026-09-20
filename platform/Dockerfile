# Zero-dependency app: no npm install, no build step, no native modules.
FROM node:22-alpine

WORKDIR /app

# su-exec lets the entrypoint drop from root to an unprivileged user after
# fixing the volume's ownership. It is ~20 KB and nothing else is added.
RUN apk add --no-cache su-exec \
 && addgroup -S beamr && adduser -S beamr -G beamr

COPY package.json ./
COPY src ./src
COPY docker-entrypoint.sh /usr/local/bin/

RUN mkdir -p /app/data && chown -R beamr:beamr /app

ENV NODE_ENV=production \
    PORT=4000 \
    HOST=0.0.0.0 \
    DB_PATH=/app/data/beamr-abm.db

EXPOSE 4000
VOLUME ["/app/data"]

# /healthz is public and also confirms the database is readable, which a
# static asset would not. Running it as a check means a database that cannot
# be opened marks the instance unhealthy instead of silently serving errors.
HEALTHCHECK --interval=30s --timeout=4s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT:-4000}/healthz" > /dev/null || exit 1

# Starts as root only to chown the mounted volume, then drops to `beamr`.
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "--no-warnings", "src/index.js"]
