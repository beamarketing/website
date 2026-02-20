import { Worker, Queue } from "bullmq";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

function parseRedisUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname || "localhost",
    port: parseInt(parsed.port || "6379", 10),
    password: parsed.password || undefined,
  };
}

const connection = parseRedisUrl(REDIS_URL);

// Queue definitions -- processors will be added in later milestones
const QUEUE_NAMES = [
  "ingestion",
  "analysis",
  "notification",
  "digest",
] as const;

const queues = QUEUE_NAMES.map(
  (name) => new Queue(name, { connection })
);

const workers = QUEUE_NAMES.map(
  (name) =>
    new Worker(
      name,
      async (job) => {
        console.log(
          `[worker:${name}] Processing job ${job.id} (${job.name})`,
          { data: job.data }
        );
        // TODO Milestone 2+: Route to specific job handlers
      },
      { connection }
    )
);

// Graceful shutdown
async function shutdown() {
  console.log("[worker] Shutting down...");
  await Promise.all(workers.map((w) => w.close()));
  await Promise.all(queues.map((q) => q.close()));
  console.log("[worker] Shutdown complete.");
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

console.log(
  `[worker] Started. Listening on queues: ${QUEUE_NAMES.join(", ")}`
);
