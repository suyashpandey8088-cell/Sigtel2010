import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, message: "Unauthorised" }, { status: 401 });
  const enquiries = await getStore().listEnquiries();
  return NextResponse.json({ ok: true, enquiries });
}
