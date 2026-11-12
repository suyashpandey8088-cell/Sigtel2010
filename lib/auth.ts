import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { AdminUser } from "@/lib/types";

export const SESSION_COOKIE = "sigtel_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@sig-tel.com";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "SigTel@2010";

const secret = process.env.AUTH_SECRET || "sigtel-dev-secret-change-in-production";

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: AdminUser["role"];
  exp: number;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

function sign(data: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function createSessionToken(user: Pick<AdminUser, "id" | "email" | "name" | "role">): string {
  const payload: SessionPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = b64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (!payload.exp || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

export async function requireSession(): Promise<SessionPayload | null> {
  return getSession();
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};

export async function seedDefaultAdmin(): Promise<{ email: string; password: string }> {
  const { getStore } = await import("@/lib/db");
  const store = getStore();
  const existing = await store.findUserByEmail(DEFAULT_ADMIN_EMAIL);
  if (existing) return { email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD };
  await store.ensureAdmin({
    id: `usr_${randomBytes(6).toString("hex")}`,
    email: DEFAULT_ADMIN_EMAIL,
    name: "SIG-TEL Admin",
    role: "ADMIN",
    passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
    createdAt: new Date().toISOString(),
  });
  return { email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD };
}
