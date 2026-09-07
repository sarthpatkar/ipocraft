type CacheEntry<T> = { value: T; expires: number };

const store = new Map<string, CacheEntry<unknown>>();

/**
 * Tiny in-memory memoization for short-lived, non-user-specific reads (the
 * public IPO feed + homepage stat-tile queries). Lives only for the
 * lifetime of a warm serverless instance — it's not a substitute for a real
 * cache (Redis/CDN) — but it collapses duplicate DB round-trips during
 * traffic bursts and repeated crawls (PSI re-runs, search bots hitting the
 * same route back-to-back) at effectively zero staleness risk, since the
 * TTL is far shorter than how often this data actually changes (IPO data
 * syncs on a ~30 min cron cycle — see DataFreshnessBar).
 *
 * This directly targets the "reduce initial server response time" /
 * "website loads slowly" findings from the SEOptimer audit: a cache hit
 * returns in-process in <1ms instead of round-tripping to Supabase.
 */
export async function withShortCache<T>(
  key: string,
  ttlMs: number,
  // Accepts anything awaitable — including Supabase's PostgrestFilterBuilder,
  // which is thenable but not a literal Promise instance.
  fetcher: () => PromiseLike<T> | T
): Promise<T> {
  const now = Date.now();
  const hit = store.get(key);
  if (hit && hit.expires > now) {
    return hit.value as T;
  }

  const value = await fetcher();
  store.set(key, { value, expires: now + ttlMs });

  // Opportunistic cleanup so this Map can't grow unbounded across the life
  // of a long-warm instance — cheap since it only runs on a cache miss.
  if (store.size > 500) {
    for (const [k, entry] of store) {
      if (entry.expires <= now) store.delete(k);
    }
  }

  return value;
}
