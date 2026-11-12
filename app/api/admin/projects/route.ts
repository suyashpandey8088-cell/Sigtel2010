import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getStore } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { projectUpsertSchema } from "@/lib/project-schema";
import { toProject } from "@/lib/project-mapper";
import { revalidatePublicContent } from "@/lib/revalidate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, message: "Unauthorised" }, { status: 401 });
  const projects = await getStore().listProjects(true);
  return NextResponse.json({ ok: true, projects });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, message: "Unauthorised" }, { status: 401 });
  if (session.role !== "ADMIN") return NextResponse.json({ ok: false, message: "Admin role required" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = projectUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Validation failed", fieldErrors: flatten(parsed.error.issues) },
      { status: 422 },
    );
  }

  const store = getStore();
  const existing = await store.getProject(parsed.data.slug);
  if (existing) {
    return NextResponse.json({ ok: false, message: "That slug is already in use." }, { status: 409 });
  }

  const project = toProject(parsed.data, randomUUID());
  const created = await store.createProject(project);
  revalidatePublicContent();
  return NextResponse.json({ ok: true, project: created });
}

function flatten(issues: { path: (string | number)[]; message: string }[]) {
  const result: Record<string, string> = {};
  issues.forEach((issue) => {
    const key = String(issue.path[0] ?? "form");
    if (!result[key]) result[key] = issue.message;
  });
  return result;
}
