import type { MetadataRoute } from "next";
import { getSanitizedIpoSlugs } from "@/lib/ipo.server";
import { canonicalUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "/",
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

  const lastModified = new Date();
  const staticUrls = staticPages.map((route) => ({
    url: canonicalUrl(route),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : 0.7,
  }));

  const ipoSlugs = await getSanitizedIpoSlugs();
  const dynamicUrls = ipoSlugs.map((slug) => ({
    url: canonicalUrl(`/ipo/${encodeURIComponent(slug)}`),
    lastModified,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticUrls, ...dynamicUrls];
}
