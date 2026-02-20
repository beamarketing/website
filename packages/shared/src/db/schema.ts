import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  real,
  jsonb,
  uniqueIndex,
  index,
  customType,
} from "drizzle-orm/pg-core";

// Custom pgvector type for embedding columns
const vector = customType<{ data: number[]; driverParam: string }>({
  dataType() {
    return "vector(1536)";
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: unknown): number[] {
    const str = value as string;
    return str
      .slice(1, -1)
      .split(",")
      .map((v) => parseFloat(v));
  },
});

// ─── documents ───────────────────────────────────────────────────────────────

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceType: text("source_type").notNull(),
    sourceId: text("source_id").notNull(),
    title: text("title").notNull(),
    url: text("url"),
    mimeType: text("mime_type"),
    folderPath: text("folder_path"),
    isApproved: boolean("is_approved").default(false),
    detectedVersion: text("detected_version"),
    ownerEmail: text("owner_email"),
    rawTextHash: text("raw_text_hash"),
    modifiedTime: timestamp("modified_time", { withTimezone: true }),
    lastIndexedAt: timestamp("last_indexed_at", { withTimezone: true }),
    metadata: jsonb("metadata").default({}),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_documents_source").on(table.sourceType, table.sourceId),
  ]
);

// ─── chunks ──────────────────────────────────────────────────────────────────

export const chunks = pgTable(
  "chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id),
    chunkIndex: integer("chunk_index").notNull(),
    text: text("text").notNull(),
    tokenCount: integer("token_count"),
    embedding: vector("embedding"),
    speakerLabel: text("speaker_label"),
    timestampStart: real("timestamp_start"),
    timestampEnd: real("timestamp_end"),
    metadata: jsonb("metadata").default({}),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_chunks_document_id").on(table.documentId),
  ]
);

// ─── entities ────────────────────────────────────────────────────────────────

export const entities = pgTable(
  "entities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: text("type").notNull(),
    name: text("name").notNull(),
    domain: text("domain"),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_entities_type_name").on(table.type, table.name),
  ]
);

// ─── entity_links ────────────────────────────────────────────────────────────

export const entityLinks = pgTable(
  "entity_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entityId: uuid("entity_id")
      .notNull()
      .references(() => entities.id),
    documentId: uuid("document_id").references(() => documents.id),
    chunkId: uuid("chunk_id").references(() => chunks.id),
    linkType: text("link_type").default("mention"),
    confidence: real("confidence").default(1.0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_entity_links_entity").on(table.entityId),
    index("idx_entity_links_document").on(table.documentId),
  ]
);

// ─── insights ────────────────────────────────────────────────────────────────

export const insights = pgTable(
  "insights",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: text("type").notNull(),
    title: text("title").notNull(),
    entityType: text("entity_type"),
    entityId: uuid("entity_id").references(() => entities.id),
    summary: text("summary").notNull(),
    whatChanged: text("what_changed"),
    evidence: jsonb("evidence").notNull().default([]),
    confidence: real("confidence").notNull().default(0.5),
    confidenceRationale: text("confidence_rationale"),
    recommendedActions: jsonb("recommended_actions").notNull().default([]),
    alertScore: jsonb("alert_score"),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_insights_type").on(table.type),
    index("idx_insights_entity").on(table.entityType, table.entityId),
    index("idx_insights_status").on(table.status),
  ]
);

// ─── assumptions ─────────────────────────────────────────────────────────────

export const assumptions = pgTable("assumptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").references(() => entities.id),
  statement: text("statement").notNull(),
  confidence: real("confidence").notNull().default(0.5),
  lastEvaluatedAt: timestamp("last_evaluated_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ─── assumption_events ───────────────────────────────────────────────────────

export const assumptionEvents = pgTable("assumption_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  assumptionId: uuid("assumption_id")
    .notNull()
    .references(() => assumptions.id),
  changeType: text("change_type").notNull(),
  previousConfidence: real("previous_confidence").notNull(),
  newConfidence: real("new_confidence").notNull(),
  evidence: jsonb("evidence").notNull().default([]),
  rationale: text("rationale"),
  triggeredByDocumentId: uuid("triggered_by_document_id").references(
    () => documents.id
  ),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ─── notifications ───────────────────────────────────────────────────────────

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  channel: text("channel").notNull(),
  insightId: uuid("insight_id").references(() => insights.id),
  payload: jsonb("payload").notNull(),
  isRead: boolean("is_read").default(false),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ─── sync_cursors ────────────────────────────────────────────────────────────

export const syncCursors = pgTable("sync_cursors", {
  id: text("id").primaryKey(),
  cursorValue: text("cursor_value").notNull(),
  lastSyncedAt: timestamp("last_synced_at", {
    withTimezone: true,
  }).defaultNow(),
});

// ─── llm_usage ───────────────────────────────────────────────────────────────

export const llmUsage = pgTable("llm_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  provider: text("provider").notNull(),
  model: text("model").notNull(),
  operation: text("operation").notNull(),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  costUsd: real("cost_usd"),
  documentId: uuid("document_id").references(() => documents.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ─── generated_cache ─────────────────────────────────────────────────────────

export const generatedCache = pgTable("generated_cache", {
  id: uuid("id").primaryKey().defaultRandom(),
  cacheKey: text("cache_key").notNull().unique(),
  content: jsonb("content").notNull(),
  sourceDocumentIds: text("source_document_ids")
    .array()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

// ─── conversations ───────────────────────────────────────────────────────────

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  title: text("title"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ─── messages ────────────────────────────────────────────────────────────────

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  citations: jsonb("citations").default([]),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
