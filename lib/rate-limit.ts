/**
 * Simple in-memory fixed-window rate limiter. Adequate for a single instance;
 * for multi-instance deployments back this with Redis (e.g. Upstash).
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string = "anonymous", limit = 6, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  existing.count += 1;
  return { allowed: existing.count <= limit, remaining: Math.max(0, limit - existing.count) };
}
