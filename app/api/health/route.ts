import { NextResponse } from "next/server";
import { getStore, storeDriver } from "@/lib/db";
import { activeDatabaseHost, pgStore } from "@/lib/db/pg-store";

/**
 * Deployment health probe.
 *
 * Reports which data layer is active and whether it actually responds. Never
 * returns connection strings or secret values — only booleans and counts.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const driver = storeDriver();
  let database: "up" | "down" | "not-configured" = "not-configured";
  let projects = 0;
  let databaseError: string | null = null;

  if (driver === "postgresql") {
    try {
      await pgStore.init?.();
      projects = (await pgStore.listProjects()).length;
      database = "up";
    } catch (error) {
      database = "down";
      const message = error instanceof Error ? error.message : String(error);
      // Never echo a connection string: strip anything URL-shaped before reporting.
      databaseError = message.replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted]").slice(0, 300);
      console.error("[health] database probe failed", message);
    }
  }

  if (database !== "up") {
    try {
      projects = (await getStore().listProjects()).length;
    } catch {
      projects = 0;
    }
  }

  return NextResponse.json(
    {
      ok: database !== "down",
      driver,
      database,
      databaseHost: activeDatabaseHost(),
      databaseError,
      projects,
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      configured: {
        databaseUrl: Boolean(process.env.DATABASE_URL),
        authSecret: Boolean(process.env.AUTH_SECRET),
        adminLogin: Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD),
        mail: Boolean(process.env.RESEND_API_KEY),
        siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
      },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
