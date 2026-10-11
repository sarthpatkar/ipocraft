import type { createSupabaseServerClient } from "@/lib/supabaseServer";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

// gmp_history.created_at is `timestamp without time zone` (stored as UTC), so
// it comes back without an offset — pin it to UTC before the browser parses it.
function toUtcIso(value: string | null | undefined): string | null {
  if (!value) return null;
  return /(?:Z|[+-]\d{2}:?\d{2})$/.test(value) ? value : `${value}Z`;
}

/**
 * When GMP / subscription figures last actually changed, for DataFreshnessBar.
 *
 * ipos.updated_at is bumped by every sync (dates, allotment, enrichment), so
 * it kept reading "updated 6h ago" while the GMP/subscription feed had been
 * down for over a week. Returns the same { data: { updated_at }, error } shape
 * as the single-row query it replaces.
 */
export async function getMarketDataFreshness(
  supabase: SupabaseServerClient,
  scope: "gmp" | "gmp+subscription"
) {
  const [gmpResult, subResult] = await Promise.all([
    supabase
      .from("gmp_history")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    scope === "gmp"
      ? null
      : supabase
          .from("ipos")
          .select("subscription_updated_at")
          .not("subscription_updated_at", "is", null)
          .order("subscription_updated_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
  ]);

  const stamps = [
    toUtcIso(gmpResult.data?.created_at),
    toUtcIso(subResult?.data?.subscription_updated_at),
  ].filter((s): s is string => s != null);

  const latest = stamps.length
    ? stamps.reduce((a, b) => (new Date(a).getTime() >= new Date(b).getTime() ? a : b))
    : null;

  return {
    data: { updated_at: latest },
    error: gmpResult.error ?? subResult?.error ?? null,
  };
}
