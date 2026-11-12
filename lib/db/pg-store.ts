import { Pool } from "pg";
import type { AdminUser, Enquiry, Project } from "@/lib/types";
import type { Store } from "./types";
import { projects as seedProjects } from "@/lib/content/projects";

/**
 * PostgreSQL store. Activated automatically when DATABASE_URL is present.
 * Schema: prisma/schema.prisma and prisma/schema.sql.
 * Records are stored with a JSONB payload plus indexed scalar columns so the
 * same shape can be read by the Prisma models.
 */

/**
 * The primary connection plus optional failover endpoints. Pooled Postgres
 * providers publish several reachable endpoints (direct host, session pooler,
 * transaction pooler); listing them here means a provider-side hostname change
 * degrades to a retry instead of taking the site down.
 */
function candidates(): string[] {
  const list = [process.env.DATABASE_URL, ...(process.env.DATABASE_FALLBACK_URLS || "").split(",")]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
  return Array.from(new Set(list));
}

let pool: Pool | null = null;
let activeConnection: string | null = null;

function createPool(connectionString: string): Pool {
  const instance = new Pool({
    connectionString,
    ssl: process.env.DATABASE_SSL === "false" ? undefined : { rejectUnauthorized: false },
    max: 5,
    // Fail fast: an unreachable host must degrade to the bundled content in
    // seconds, not hang a serverless render until the platform timeout.
    connectionTimeoutMillis: 8000,
    idleTimeoutMillis: 8000,
    query_timeout: 10000,
    statement_timeout: 10000,
  });
  // A pool-level error (dropped connection, DNS failure) must never surface as
  // an unhandled event that kills the function instance.
  instance.on("error", (error) => {
    console.error("[store] PostgreSQL pool error", error instanceof Error ? error.message : error);
  });
  return instance;
}

/** Host of the connection currently in use — safe to log, never includes credentials. */
export function activeDatabaseHost(): string | null {
  if (!activeConnection) return null;
  try {
    return new URL(activeConnection).host;
  } catch {
    return null;
  }
}

function db(): Pool {
  // init() (awaited by every store method through run()) always establishes a
  // pool before a query runs.
  if (!pool) throw new Error("PostgreSQL store used before initialisation");
  return pool;
}

/** Connect, creating the schema and seeding it, falling back through the endpoint list. */
async function connectAny(): Promise<void> {
  const urls = candidates();
  const errors: string[] = [];

  for (const url of urls) {
    const instance = createPool(url);
    try {
      await instance.query("SELECT 1");
      await migrate(instance);
      await seedIfEmpty(instance);
      if (pool && pool !== instance) await pool.end().catch(() => undefined);
      pool = instance;
      activeConnection = url;
      return;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      await instance.end().catch(() => undefined);
    }
  }

  throw new Error(`No database endpoint reachable: ${errors.join(" | ") || "none configured"}`);
}

let initialised: Promise<void> | null = null;

function init(): Promise<void> {
  if (!initialised) {
    initialised = connectAny().catch((error) => {
      // Never cache a rejected initialisation: a transient outage must not
      // disable the database for the lifetime of this instance.
      initialised = null;
      throw error;
    });
  }
  return initialised;
}

async function migrate(instance: Pool): Promise<void> {
  await instance.query(`
        CREATE TABLE IF NOT EXISTS "Project" (
          "id" TEXT PRIMARY KEY,
          "slug" TEXT UNIQUE NOT NULL,
          "division" TEXT NOT NULL,
          "status" TEXT NOT NULL,
          "published" BOOLEAN NOT NULL DEFAULT true,
          "order" INTEGER NOT NULL DEFAULT 0,
          "payload" JSONB NOT NULL,
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS "Enquiry" (
          "id" TEXT PRIMARY KEY,
          "email" TEXT NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'new',
          "payload" JSONB NOT NULL,
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS "AdminUser" (
          "id" TEXT PRIMARY KEY,
          "email" TEXT UNIQUE NOT NULL,
          "role" TEXT NOT NULL DEFAULT 'ADMIN',
          "payload" JSONB NOT NULL,
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
}

async function seedIfEmpty(instance: Pool): Promise<void> {
  const { rows } = await instance.query(`SELECT EXISTS (SELECT 1 FROM "Project") AS present`);
  if (rows[0]?.present) return;

  const client = await instance.connect();
  try {
    await client.query("BEGIN");
    for (const project of seedProjects) {
      await client.query(
        `INSERT INTO "Project" ("id","slug","division","status","published","order","payload")
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT ("slug") DO NOTHING`,
        [project.id, project.slug, project.division, project.status, project.published, project.order, project],
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

async function run<T>(fn: () => Promise<T>): Promise<T> {
  await init();
  return fn();
}

export const pgStore: Store = {
  listProjects(includeUnpublished = false) {
    return run(async () => {
      const res = await db().query(
        `SELECT "payload" FROM "Project" ${includeUnpublished ? "" : "WHERE published = true"} ORDER BY "order" ASC`,
      );
      return res.rows.map((r) => r.payload as Project);
    });
  },

  getProject(slug) {
    return run(async () => {
      const res = await db().query(`SELECT "payload" FROM "Project" WHERE slug = $1 LIMIT 1`, [slug]);
      return (res.rows[0]?.payload as Project) ?? null;
    });
  },

  createProject(project) {
    return run(async () => {
      await db().query(
        `INSERT INTO "Project" ("id","slug","division","status","published","order","payload") VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [project.id, project.slug, project.division, project.status, project.published, project.order, project],
      );
      return project;
    });
  },

  updateProject(id, patch) {
    return run(async () => {
      const current = await db().query(`SELECT "payload" FROM "Project" WHERE id = $1`, [id]);
      if (!current.rows[0]) return null;
      const merged = { ...(current.rows[0].payload as Project), ...patch, id };
      await db().query(
        `UPDATE "Project" SET "slug"=$2,"division"=$3,"status"=$4,"published"=$5,"order"=$6,"payload"=$7,"updatedAt"=now() WHERE id=$1`,
        [id, merged.slug, merged.division, merged.status, merged.published, merged.order, merged],
      );
      return merged;
    });
  },

  deleteProject(id) {
    return run(async () => {
      const res = await db().query(`DELETE FROM "Project" WHERE id = $1`, [id]);
      return (res.rowCount ?? 0) > 0;
    });
  },

  createEnquiry(enquiry) {
    return run(async () => {
      await db().query(`INSERT INTO "Enquiry" ("id","email","status","payload") VALUES ($1,$2,$3,$4)`, [
        enquiry.id,
        enquiry.email,
        enquiry.status,
        enquiry,
      ]);
      return enquiry;
    });
  },

  listEnquiries() {
    return run(async () => {
      const res = await db().query(`SELECT "payload" FROM "Enquiry" ORDER BY "createdAt" DESC`);
      return res.rows.map((r) => r.payload as Enquiry);
    });
  },

  updateEnquiryStatus(id, status) {
    return run(async () => {
      const res = await db().query(
        `UPDATE "Enquiry" SET "status"=$2, "payload"=jsonb_set("payload",'{status}',to_jsonb($2::text)) WHERE id=$1 RETURNING "payload"`,
        [id, status],
      );
      return (res.rows[0]?.payload as Enquiry) ?? null;
    });
  },

  findUserByEmail(email) {
    return run(async () => {
      const res = await db().query(`SELECT "payload" FROM "AdminUser" WHERE lower(email) = lower($1) LIMIT 1`, [email]);
      return (res.rows[0]?.payload as AdminUser) ?? null;
    });
  },

  ensureAdmin(user) {
    return run(async () => {
      await db().query(
        `INSERT INTO "AdminUser" ("id","email","role","payload") VALUES ($1,$2,$3,$4)
         ON CONFLICT ("email") DO NOTHING`,
        [user.id, user.email, user.role, user],
      );
    });
  },
};
