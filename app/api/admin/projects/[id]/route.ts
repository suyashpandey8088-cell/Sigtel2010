import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { projectUpsertSchema } from "@/lib/project-schema";
import { toProject } from "@/lib/project-mapper";
import { revalidatePublicContent } from "@/lib/revalidate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, message: "Unauthorised" }, { status: 401 });
  if (session.role !== "ADMIN") return NextResponse.json({ ok: false, message: "Admin role required" }, { status: 403 });

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = projectUpsertSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Validation failed" }, { status: 422 });
  }

  const store = getStore();
  const current = (await store.listProjects(true)).find((project) => project.id === id);
  if (!current) return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });

  const merged = toProject({ ...toInput(current), ...parsed.data } as never, id);
  const updated = await store.updateProject(id, merged);
  revalidatePublicContent();
  return NextResponse.json({ ok: true, project: updated });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, message: "Unauthorised" }, { status: 401 });
  if (session.role !== "ADMIN") return NextResponse.json({ ok: false, message: "Admin role required" }, { status: 403 });

  const { id } = await context.params;
  const removed = await getStore().deleteProject(id);
  if (removed) revalidatePublicContent();
  return NextResponse.json({ ok: removed }, { status: removed ? 200 : 404 });
}

function toInput(project: import("@/lib/types").Project) {
  const joinPairs = (items: { title: string; body: string }[]) =>
    items.map((item) => `${item.title} | ${item.body}`).join("\n");
  return {
    ...project,
    clientDivision: project.clientDivision ?? "",
    year: project.year ?? "",
    scope: project.scope.join("\n"),
    challenges: joinPairs(project.challenges),
    approach: joinPairs(project.approach),
    equipment: project.equipment.join("\n"),
    results: project.results.join("\n"),
    images: project.images.join("\n"),
  };
}
