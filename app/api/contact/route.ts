import { NextResponse } from "next/server";
import { randomBytes, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { contactSchema } from "@/lib/validation";
import { getStore } from "@/lib/db";
import { sendEnquiryNotification } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), ".data", "uploads");

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const limit = rateLimit(`contact:${ip}`, 6, 10 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many enquiries from this connection. Please call us on +91 93200 01996." },
      { status: 429 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid submission." }, { status: 400 });
  }

  const get = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  // Spam protection: honeypot + minimum completion time.
  if (get("website")) {
    return NextResponse.json({ ok: true, message: "Received." });
  }
  const startedAt = Number(get("startedAt") || 0);
  if (startedAt && Date.now() - startedAt < 2500) {
    return NextResponse.json(
      { ok: false, message: "That was quick — please review your details and submit again." },
      { status: 400 },
    );
  }

  // Cloudflare Turnstile (optional, enabled by env).
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = get("turnstileToken");
    const verified = await verifyTurnstile(token, ip, turnstileSecret);
    if (!verified) {
      return NextResponse.json({ ok: false, message: "Verification failed. Please reload and try again." }, { status: 400 });
    }
  }

  const payload = {
    name: get("name"),
    company: get("company"),
    email: get("email"),
    phone: get("phone"),
    category: get("category"),
    location: get("location"),
    message: get("message"),
    consent: get("consent") === "true",
    website: get("website"),
    startedAt,
  };

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields.", fieldErrors },
      { status: 422 },
    );
  }

  let attachmentName: string | undefined;
  const file = formData.get("attachment");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { ok: false, message: "Attachment is larger than 5 MB.", fieldErrors: { attachment: "Max 5 MB" } },
        { status: 413 },
      );
    }
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
    const stored = `${randomBytes(8).toString("hex")}-${safeName}`;
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(UPLOAD_DIR, stored), buffer);
      attachmentName = stored;
    } catch (error) {
      console.error("[contact] attachment could not be stored", error);
    }
  }

  const enquiry = {
    id: `enq_${randomUUID()}`,
    name: parsed.data.name,
    company: parsed.data.company || undefined,
    email: parsed.data.email,
    phone: parsed.data.phone,
    category: parsed.data.category,
    location: parsed.data.location || undefined,
    message: parsed.data.message,
    attachment: attachmentName,
    status: "new" as const,
    createdAt: new Date().toISOString(),
  };

  try {
    await getStore().createEnquiry(enquiry);
  } catch (error) {
    console.error("[contact] could not store enquiry", error);
    return NextResponse.json(
      { ok: false, message: "We could not record your enquiry. Please email sigtel2011@gmail.com." },
      { status: 500 },
    );
  }

  if (!process.env.DATABASE_URL && !process.env.RESEND_API_KEY) {
    console.warn(
      "[contact] No DATABASE_URL and no RESEND_API_KEY configured — this enquiry exists only in this instance's memory. Configure durable storage or email delivery.",
    );
  }

  const { delivered } = await sendEnquiryNotification({
    ...enquiry,
    attachment: attachmentName,
  });

  return NextResponse.json({
    ok: true,
    message: "Enquiry received.",
    delivered,
  });
}

async function verifyTurnstile(token: string, ip: string, secret: string) {
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const data = (await response.json()) as { success: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}
