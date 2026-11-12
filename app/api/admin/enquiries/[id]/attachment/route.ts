import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { getStore } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, message: "Unauthorised" }, { status: 401 });

  const { id } = await context.params;
  const enquiry = (await getStore().listEnquiries()).find((item) => item.id === id);
  if (!enquiry?.attachment) return NextResponse.json({ ok: false, message: "No attachment" }, { status: 404 });

  const safe = path.basename(enquiry.attachment);
  const filePath = path.join(process.cwd(), ".data", "uploads", safe);
  try {
    const file = await fs.readFile(filePath);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${safe.replace(/^[a-f0-9]+-/, "")}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, message: "Attachment unavailable" }, { status: 404 });
  }
}
