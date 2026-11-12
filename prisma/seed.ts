/**
 * Seeds the PostgreSQL project register from the verified content set.
 * Run with: npm run db:seed (requires DATABASE_URL)
 */
import { Pool } from "pg";
import { projects } from "../lib/content/projects";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set — nothing to seed.");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "false" ? undefined : { rejectUnauthorized: false },
  });

  await pool.query(`
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
  `);

  for (const project of projects) {
    await pool.query(
      `INSERT INTO "Project" ("id","slug","division","status","published","order","payload")
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT ("id") DO UPDATE SET
         "slug" = EXCLUDED."slug",
         "division" = EXCLUDED."division",
         "status" = EXCLUDED."status",
         "published" = EXCLUDED."published",
         "order" = EXCLUDED."order",
         "payload" = EXCLUDED."payload",
         "updatedAt" = now()`,
      [project.id, project.slug, project.division, project.status, project.published, project.order, project],
    );
  }

  console.log(`Seeded ${projects.length} projects.`);
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
