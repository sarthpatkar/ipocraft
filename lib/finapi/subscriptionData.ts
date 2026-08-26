/**
 * lib/finapi/subscriptionData.ts
 *
 * Stub for future commercial IPO subscription data API integration.
 *
 * HOW TO ACTIVATE:
 * 1. Subscribe to a commercial data provider (e.g., NSE Data, BSE API, IndiaCorp, or similar)
 * 2. Add your API key to .env.local as FINAPI_KEY=<your_key>
 * 3. Replace the stub implementation below with the actual API call
 * 4. No other code changes needed — all consumers use this function
 *
 * Until activated, this returns null and the system falls back to
 * manually entered admin data (AdminForm → Total Retail Applications field).
 */

export interface SubscriptionDataResult {
  /** IPO slug as stored in the ipos table */
  slug: string;
  /** Total number of valid retail applications (used in SEBI allotment formula) */
  totalRetailApplications: number | null;
  /** Retail (RII) subscription multiple, e.g. 12.45 */
  subRii: number | null;
  /** Total subscription multiple across all categories */
  subTotal: number | null;
  /** Timestamp of the data from the provider */
  asOf: string | null;
}

/**
 * Fetch live subscription data for a given IPO slug from the commercial API.
 *
 * @param slug - The IPO slug (matches `ipos.slug` in Supabase)
 * @returns SubscriptionDataResult if available, null if API is not configured or slug not found
 */
export async function getSubscriptionData(
  slug: string
): Promise<SubscriptionDataResult | null> {
  const apiKey = process.env.FINAPI_KEY;

  // Not configured — fall back to manual admin data
  if (!apiKey) {
    return null;
  }

  try {
    // ── STUB: Replace this block with actual API call ──────────────────────
    // Example (hypothetical endpoint):
    //
    // const res = await fetch(`https://api.yourprovider.com/ipo/subscription?slug=${slug}`, {
    //   headers: { Authorization: `Bearer ${apiKey}` },
    //   next: { revalidate: 300 }, // Cache for 5 minutes
    // });
    // if (!res.ok) return null;
    // const data = await res.json();
    // return {
    //   slug,
    //   totalRetailApplications: data.retail_applications ?? null,
    //   subRii: data.sub_rii ?? null,
    //   subTotal: data.sub_total ?? null,
    //   asOf: data.timestamp ?? null,
    // };
    // ──────────────────────────────────────────────────────────────────────

    console.warn(`[finapi] subscriptionData: FINAPI_KEY is set but stub is not replaced. Returning null for slug: ${slug}`);
    return null;
  } catch (err) {
    console.error("[finapi] subscriptionData fetch error:", err);
    return null;
  }
}
