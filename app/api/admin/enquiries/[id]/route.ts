import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowed = new Set(["new", "read", "responded", "archived"]);

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, message: "Unauthorised" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const status = body?.status as string | undefined;
  if (!status || !allowed.has(status)) {
    return NextResponse.json({ ok: false, message: "Invalid status" }, { status: 422 });
  }

  const updated = await getStore().updateEnquiryStatus(id, status as "new" | "read" | "responded" | "archived");
  return NextResponse.json({ ok: Boolean(updated), enquiry: updated });
}
