# Zero-dependency app: no npm install, no build step, no native modules.
FROM node:22-alpine

WORKDIR /app

# Non-root, and the data directory must be writable by it.
RUN addgroup -S beamr && adduser -S beamr -G beamr

COPY package.json ./
COPY src ./src

RUN mkdir -p /app/data && chown -R beamr:beamr /app
USER beamr

ENV NODE_ENV=production \
    PORT=4000 \
    HOST=0.0.0.0 \
    DB_PATH=/app/data/beamr-abm.db

EXPOSE 4000
VOLUME ["/app/data"]

# The status endpoint needs auth, so probe the always-public tracker instead.
HEALTHCHECK --interval=30s --timeout=4s --start-period=8s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/t/beamr.js > /dev/null || exit 1

CMD ["node", "--no-warnings", "src/index.js"]
