/**
 * lib/chat/dataFetcher.ts
 * Fetches relevant IPO data from Supabase based on classified intent.
 * Returns a compact JSON context string to be injected into the LLM prompt.
 */

import { createClient } from "@supabase/supabase-js";
import type { ClassifiedIntent } from "./intentClassifier";

function getDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Core fields for rich responses (verified against database schema)
const CORE_FIELDS =
  "name, slug, status, ipo_type, gmp, price_min, price_max, issue_price, sub_total, sub_rii, sub_qib, sub_nii, sub_bhni, sub_shni, open_date, close_date, allotment_date, listing_date, listing_price, listing_gain, listing_gain_percent, lot_size, issue_size, about_company, sector";

interface FetchResult {
  context: string;
  timestamp: string;
  found: boolean;
}

const STOP_WORDS = new Set([
  "ipo", "ipos", "latest", "recent", "closed",
  "new", "yesterday", "tomorrow", "this", "week", "month", "all",
  "gmp", "allotment", "status", "subscription", "price", "band", "date",
  "gain", "return", "performance", "sme", "mainboard", "compare", "vs",
  "about", "what", "is", "the", "for", "in", "of", "and", "or", "tell", "me"
]);

/** Enrich IPO records with estimated listing and formatted numbers */
function enrichIpos(ipos: any[]) {
  return ipos.map((ipo) => {
    const priceMax = ipo.price_max || ipo.issue_price || ipo.price_min || 0;
    const gmp = ipo.gmp != null ? Number(ipo.gmp) : null;
    const estimatedListing = gmp != null && priceMax > 0 ? priceMax + gmp : null;
    const gmpPct =
      gmp != null && priceMax > 0
        ? Number(((gmp / priceMax) * 100).toFixed(1))
        : null;

    return {
      name: ipo.name,
      segment: ipo.ipo_type || (ipo.name?.toLowerCase().includes("sme") ? "SME" : "Mainboard"),
      status: ipo.status,
      price_band:
        ipo.price_min && ipo.price_max
          ? `₹${ipo.price_min} - ₹${ipo.price_max}`
          : ipo.issue_price
          ? `₹${ipo.issue_price}`
          : "—",
      gmp_in_rupees: gmp != null ? `₹${gmp}` : "—",
      gmp_percentage: gmpPct != null ? `${gmpPct > 0 ? "+" : ""}${gmpPct}%` : "—",
      estimated_listing_price: estimatedListing != null ? `₹${estimatedListing}` : "—",
      sub_total: ipo.sub_total != null ? `${ipo.sub_total}x` : "—",
      sub_retail: ipo.sub_rii != null ? `${ipo.sub_rii}x` : "—",
      sub_qib: ipo.sub_qib != null ? `${ipo.sub_qib}x` : "—",
      sub_hni: ipo.sub_nii != null ? `${ipo.sub_nii}x` : "—",
      lot_size: ipo.lot_size ? `${ipo.lot_size} shares` : "—",
      issue_size: ipo.issue_size ? `₹${ipo.issue_size} Cr` : "—",
      open_date: ipo.open_date || "—",
      close_date: ipo.close_date || "—",
      allotment_date: ipo.allotment_date || "—",
      listing_date: ipo.listing_date || "—",
      listing_gain:
        ipo.listing_gain_percent != null
          ? `${ipo.listing_gain_percent > 0 ? "+" : ""}${ipo.listing_gain_percent}%`
          : "—",
    };
  });
}

/** Clean search term and search IPOs by company name or slug */
async function findIposByNames(db: ReturnType<typeof getDb>, names: string[]) {
  if (!names || names.length === 0) return [];
  const results: any[] = [];

  for (const rawName of names.slice(0, 5)) {
    let clean = rawName.toLowerCase().trim();
    clean = clean.replace(/\b(ipo|ipos|ltd|limited|pvt|private|shares|stock|issue)\b/gi, "").trim();
    if (!clean || STOP_WORDS.has(clean)) continue;

    // Search 1: direct match
    const { data: directData } = await db
      .from("ipos")
      .select(CORE_FIELDS)
      .or(`name.ilike.%${clean}%,slug.ilike.%${clean}%`)
      .limit(3);

    if (directData && directData.length > 0) {
      results.push(...directData);
      continue;
    }

    // Search 2: first significant word
    const words = clean.split(/\s+/).filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
    if (words.length > 0) {
      const firstWord = words[0];
      const { data: wordData } = await db
        .from("ipos")
        .select(CORE_FIELDS)
        .or(`name.ilike.%${firstWord}%,slug.ilike.%${firstWord}%`)
        .limit(3);

      if (wordData && wordData.length > 0) {
        results.push(...wordData);
      }
    }
  }

  // Deduplicate by slug
  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.slug)) return false;
    seen.add(r.slug);
    return true;
  });
}

export async function fetchDataForIntent(
  intent: ClassifiedIntent
): Promise<FetchResult> {
  const db = getDb();
  const timestamp = new Date().toISOString();

  const noData: FetchResult = {
    context: "",
    timestamp,
    found: false,
  };

  try {
    // ── Educational / off-topic ──
    if (intent.intent === "educational" || intent.intent === "off_topic") {
      return { context: "", timestamp, found: true };
    }

    // Filter out stopwords from extracted ipoNames
    const validNames = (intent.ipoNames || [])
      .map((n) => n.trim().toLowerCase().replace(/\b(ipo|ipos)\b/g, "").trim())
      .filter((n) => n.length >= 2 && !STOP_WORDS.has(n));

    // ── 1. If specific IPO names were mentioned, look them up ──
    if (validNames.length > 0) {
      const ipos = await findIposByNames(db, validNames);
      if (ipos.length > 0) {
        return {
          context: JSON.stringify(enrichIpos(ipos)),
          timestamp,
          found: true,
        };
      }

      // If specific name not matched, provide active market context
      const { data: fallbackMarket } = await db
        .from("ipos")
        .select(CORE_FIELDS)
        .or("status.ilike.open,status.ilike.Open,status.ilike.upcoming,status.ilike.Upcoming")
        .order("gmp", { ascending: false, nullsFirst: false })
        .limit(8);

      if (fallbackMarket && fallbackMarket.length > 0) {
        return {
          context: JSON.stringify(enrichIpos(fallbackMarket)),
          timestamp,
          found: true,
        };
      }
      return noData;
    }

    // ── 2. Performance lookup (listed IPOs) ──
    if (intent.intent === "performance_lookup") {
      const { data } = await db
        .from("ipos")
        .select(CORE_FIELDS)
        .or("status.ilike.listed,status.ilike.Listed")
        .order("listing_date", { ascending: false, nullsFirst: false })
        .limit(intent.limit ?? 10);

      if (data && data.length > 0) {
        return { context: JSON.stringify(enrichIpos(data)), timestamp, found: true };
      }
    }

    // ── 3. Open IPOs / Current GMP / Active Bids ──
    if (intent.statusFilter === "open" || intent.intent === "gmp_lookup" || intent.intent === "subscription_lookup") {
      // Query Open IPOs first
      const { data: openData } = await db
        .from("ipos")
        .select(CORE_FIELDS)
        .or("status.ilike.open,status.ilike.Open")
        .order("gmp", { ascending: false, nullsFirst: false })
        .limit(10);

      // Query Upcoming IPOs to provide comprehensive market context
      const { data: upcomingData } = await db
        .from("ipos")
        .select(CORE_FIELDS)
        .or("status.ilike.upcoming,status.ilike.Upcoming")
        .order("open_date", { ascending: true, nullsFirst: false })
        .limit(6);

      const combined = [...(openData || []), ...(upcomingData || [])];
      if (combined.length > 0) {
        return {
          context: JSON.stringify(enrichIpos(combined)),
          timestamp,
          found: true,
        };
      }
    }

    // ── 4. General list / Upcoming / Timeline ──
    let query = db
      .from("ipos")
      .select(CORE_FIELDS)
      .order("open_date", { ascending: false, nullsFirst: false })
      .limit(intent.limit ?? 12);

    if (intent.statusFilter && intent.statusFilter !== "all") {
      const sf = intent.statusFilter.toLowerCase();
      query = query.or(
        `status.ilike.${sf},status.ilike.${sf.charAt(0).toUpperCase() + sf.slice(1)}`
      );
    } else {
      query = query.or("status.ilike.open,status.ilike.Open,status.ilike.upcoming,status.ilike.Upcoming,status.ilike.closed,status.ilike.Closed");
    }

    const { data } = await query;
    if (data && data.length > 0) {
      return { context: JSON.stringify(enrichIpos(data)), timestamp, found: true };
    }

    // Fallback: fetch any latest 10 IPOs
    const { data: fallbackData } = await db
      .from("ipos")
      .select(CORE_FIELDS)
      .order("id", { ascending: false })
      .limit(10);

    if (fallbackData && fallbackData.length > 0) {
      return { context: JSON.stringify(enrichIpos(fallbackData)), timestamp, found: true };
    }

    return noData;
  } catch (err) {
    console.error("fetchDataForIntent error:", err);
    return noData;
  }
}

