/**
 * lib/chat/rateLimit.ts
 * IP-based sliding window rate limiter — 20 requests per hour per IP.
 *
 * Uses Upstash Redis in production (distributed, persists across serverless instances).
 * Falls back to in-memory store when UPSTASH_REDIS_REST_URL is not set (local dev).
 *
 * Setup:
 *   1. Create a free database at https://console.upstash.com
 *   2. Add to .env.local (and Vercel env vars):
 *      UPSTASH_REDIS_REST_URL=https://...
 *      UPSTASH_REDIS_REST_TOKEN=...
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const MAX_REQUESTS = 20;

// --- Upstash Redis (production) ---
let _ratelimit: Ratelimit | null = null;

function getUpstashRatelimit(): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!_ratelimit) {
    _ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "1 h"),
      analytics: false,
      prefix: "ipocraft_chat",
    });
  }
  return _ratelimit;
}

// --- In-memory fallback (local dev only) ---
interface Entry {
  count: number;
  resetAt: number;
}
const WINDOW_MS = 60 * 60 * 1000;
const store = new Map<string, Entry>();

function checkInMemory(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }
  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }
  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

/** Returns whether the IP is allowed, and how many requests remain this hour. */
export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const rl = getUpstashRatelimit();

  // Production path: Upstash Redis (distributed, survives cold starts)
  if (rl) {
    const identifier = ip === "unknown" ? "anon" : ip;
    const { success, remaining } = await rl.limit(identifier);
    return { allowed: success, remaining: Math.max(0, remaining) };
  }

  // Local dev fallback: in-memory Map
  return checkInMemory(ip);
}
