/**
 * lib/chat/rateLimit.ts
 * IP-based sliding window rate limit for the chat route — 20 requests per hour per IP.
 *
 * Thin wrapper around the shared lib/rateLimit.ts factory (Upstash Redis in
 * production, in-memory fallback locally).
 */

import { createRateLimiter, type RateLimitResult } from "@/lib/rateLimit";

const MAX_REQUESTS = 20;
const WINDOW_MS = 60 * 60 * 1000;

const limiter = createRateLimiter("chat", MAX_REQUESTS, WINDOW_MS);

/** Returns whether the IP is allowed, and how many requests remain this hour. */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  return limiter(ip);
}
