import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStore } from "@/lib/db";
import { SESSION_COOKIE, createSessionToken, seedDefaultAdmin, sessionCookieOptions, verifyPassword } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`login:${ip}`, 8, 10 * 60 * 1000).allowed) {
    return NextResponse.json({ ok: false, message: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  if (!email || !password) {
    return NextResponse.json({ ok: false, message: "Email and password are required." }, { status: 422 });
  }

  await seedDefaultAdmin();

  const user = await getStore().findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ ok: false, message: "Invalid credentials." }, { status: 401 });
  }

  const token = createSessionToken(user);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions);

  return NextResponse.json({ ok: true, role: user.role, name: user.name });
}
