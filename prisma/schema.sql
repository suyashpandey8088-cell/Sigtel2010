-- SIG-TEL 2.0 — PostgreSQL schema
-- Apply with: psql "$DATABASE_URL" -f prisma/schema.sql

CREATE TABLE IF NOT EXISTS "Project" (
  "id"        TEXT PRIMARY KEY,
  "slug"      TEXT UNIQUE NOT NULL,
  "division"  TEXT NOT NULL,
  "status"    TEXT NOT NULL,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "order"     INTEGER NOT NULL DEFAULT 0,
  "payload"   JSONB NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "Project_division_status_idx" ON "Project" ("division", "status");
CREATE INDEX IF NOT EXISTS "Project_published_order_idx" ON "Project" ("published", "order");

CREATE TABLE IF NOT EXISTS "Enquiry" (
  "id"        TEXT PRIMARY KEY,
  "email"     TEXT NOT NULL,
  "status"    TEXT NOT NULL DEFAULT 'new',
  "payload"   JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "Enquiry_status_created_idx" ON "Enquiry" ("status", "createdAt" DESC);

CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id"        TEXT PRIMARY KEY,
  "email"     TEXT UNIQUE NOT NULL,
  "role"      TEXT NOT NULL DEFAULT 'ADMIN',
  "payload"   JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
