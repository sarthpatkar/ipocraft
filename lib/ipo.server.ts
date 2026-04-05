import "server-only";

import { createClient } from "@supabase/supabase-js";
import { cache } from "react";

type IpoSlugRow = {
  slug?: unknown;
};

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
  const { data, error } = await supabase.from("ipos").select("slug");

  if (error) {
    console.error("Failed to load IPO slugs for sitemap", {
      message: error.message,
    });
    return [];
  }

  const seen = new Set<string>();

  return ((data as IpoSlugRow[] | null) ?? []).flatMap((row) => {
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
