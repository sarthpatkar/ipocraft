import "server-only";

import { createClient } from "@supabase/supabase-js";
import { cache } from "react";

export type IpoRecord = {
  [key: string]: unknown;
  id: number | string;
  slug: string | null;
  name?: string | null;
  sector?: string | null;
  exchange?: string | null;
  gmp?: number | string | null;
  price_min?: number | string | null;
  price_max?: number | string | null;
  status?: string | null;
  listing_date?: string | null;
  allotment_date?: string | null;
  allotment_out?: boolean | string | number | null;
  allotment_status?: string | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function sanitizeIpoSlug(rawSlug?: string | null) {
  const normalized = rawSlug?.trim().replace(/^\/+|\/+$/g, "");

  if (!normalized) {
    return null;
  }

  if (
    normalized.includes("/") ||
    normalized.includes("?") ||
    normalized.includes("#")
  ) {
    return null;
  }

  return normalized;
}

export const getIpoBySlug = cache(
  async (rawSlug: string): Promise<IpoRecord | null> => {
    const slug = sanitizeIpoSlug(rawSlug);

    if (!slug) {
      return null;
    }

    const { data, error } = await supabase
      .from("ipos")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Failed to load IPO by slug", {
        slug,
        message: error.message,
      });
      return null;
    }

    return (data as IpoRecord | null) ?? null;
  }
);

export async function getSanitizedIpoSlugs() {
  const rows = await fetchAllIpoSlugRows();
  const seen = new Set<string>();

  return rows.flatMap((row) => {
    const slug = sanitizeIpoSlug(
      typeof row.slug === "string" ? row.slug : null
    );

    if (!slug || seen.has(slug)) {
      return [];
    }

    seen.add(slug);
    return [slug];
  });
}

export type IpoSitemapRow = {
  slug: string;
  status: string | null;
  listing_date: string | null;
};

/**
 * Same slug list, plus status/listing_date so the sitemap can set
 * changeFrequency conditionally instead of "daily" for every page —
 * a long-since-listed historical IPO's page rarely changes, unlike an
 * open/upcoming one.
 */
export async function getSitemapIpoRows(): Promise<IpoSitemapRow[]> {
  const rows = await fetchAllIpoSlugRows();
  const seen = new Set<string>();
  const out: IpoSitemapRow[] = [];

  for (const row of rows) {
    const slug = sanitizeIpoSlug(
      typeof row.slug === "string" ? row.slug : null
    );
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    out.push({
      slug,
      status: typeof row.status === "string" ? row.status : null,
      listing_date: typeof row.listing_date === "string" ? row.listing_date : null,
    });
  }

  return out;
}

// PostgREST caps rows per request (commonly 1000) regardless of .limit() —
// page through with .range() so this stays correct as the table grows past
// that cap, rather than silently truncating (the old select("slug") call
// with no pagination would have hit exactly this once the table crossed
// ~1000 rows).
async function fetchAllIpoSlugRows(): Promise<
  { slug?: unknown; status?: unknown; listing_date?: unknown }[]
> {
  const PAGE = 1000;
  const all: { slug?: unknown; status?: unknown; listing_date?: unknown }[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("ipos")
      .select("slug, status, listing_date")
      .range(from, from + PAGE - 1);

    if (error) {
      console.error("Failed to load IPO rows for sitemap", { message: error.message });
      break;
    }
    if (!data || data.length === 0) break;

    all.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  return all;
}
