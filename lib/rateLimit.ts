/**
 * lib/rateLimit.ts
 * Generic IP-based sliding-window rate limiter factory.
 *
 * Uses Upstash Redis in production (distributed, persists across serverless
 * instances/cold starts). Falls back to an in-memory Map when
 * UPSTASH_REDIS_REST_URL is not set (local dev only — resets per instance).
 *
 * Setup:
 *   1. Create a free database at https://console.upstash.com
 *   2. Add to .env.local (and Vercel env vars):
 *      UPSTASH_REDIS_REST_URL=https://...
 *      UPSTASH_REDIS_REST_TOKEN=...
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

interface Entry {
  count: number;
  resetAt: number;
}

/**
 * Creates an independent rate limiter identified by `prefix`, allowing
 * `maxRequests` per `windowMs` per identifier (typically an IP).
 */
export function createRateLimiter(prefix: string, maxRequests: number, windowMs: number) {
  let upstash: Ratelimit | null = null;
  let upstashChecked = false;
  const store = new Map<string, Entry>();

  function getUpstash(): Ratelimit | null {
    if (upstashChecked) return upstash;
    upstashChecked = true;
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return null;
    }
    upstash = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(maxRequests, `${Math.max(1, Math.round(windowMs / 1000))} s`),
      analytics: false,
      prefix: `ipocraft_${prefix}`,
    });
    return upstash;
  }

  function checkInMemory(id: string): RateLimitResult {
    const now = Date.now();
    const entry = store.get(id);
    if (!entry || now > entry.resetAt) {
      store.set(id, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1 };
    }
    if (entry.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }
    entry.count++;
    return { allowed: true, remaining: maxRequests - entry.count };
  }

  return async function check(id: string): Promise<RateLimitResult> {
    const rl = getUpstash();
    if (rl) {
      const identifier = id === "unknown" ? "anon" : id;
      const { success, remaining } = await rl.limit(identifier);
      return { allowed: success, remaining: Math.max(0, remaining) };
    }
    return checkInMemory(id);
  };
}
