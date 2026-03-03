import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ipocraft.com";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: ipos } = await supabase
    .from("ipos")
    .select("slug, updated_at");

  const staticPages = [
    "",
    "/gmp",
    "/ipo",
    "/ipo-calendar",
    "/brokers",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/what-is-ipo-gmp",
    "/how-ipo-allotment-works",
    "/ipo-subscription-meaning",
    "/qib-hni-retail-explained",
    "/ipo-grey-market-guide",
  ];

  const staticUrls = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const dynamicUrls =
    ipos?.map((ipo) => ({
      url: `${baseUrl}/ipo/${ipo.slug}`,
      lastModified: ipo.updated_at
        ? new Date(ipo.updated_at)
        : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })) || [];

  return [...staticUrls, ...dynamicUrls];
}