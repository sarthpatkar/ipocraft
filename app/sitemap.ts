import type { MetadataRoute } from "next";
import { getSanitizedIpoSlugs } from "@/lib/ipo.server";
import { canonicalUrl } from "@/lib/site-url";
import { MOCK_ARTICLES } from "@/lib/mock-articles";
import fs from "fs";
import path from "path";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "/",
    "/gmp",
    "/ipo",
    "/ipo-calendar",
    "/subscriptions",
    "/performance",
    "/allotment-status",
    "/sme-ipo",
    "/brokers",
    "/about",
    "/chat",
    "/contact",
    "/privacy",
    "/terms",
    "/what-is-ipo-gmp",
    "/how-ipo-allotment-works",
    "/ipo-subscription-meaning",
    "/qib-hni-retail-explained",
    "/ipo-grey-market-guide",
    "/blog",
  ];

  const lastModified = new Date();

  // High-priority standalone tool pages for SEO
  const toolPages = [
    "/ipo-allotment-probability-calculator",
    "/ipo-profit-calculator",
    "/compare",
    "/chat",
    "/feedback",
  ];
  const toolUrls = toolPages.map((route) => ({
    url: canonicalUrl(route),
    lastModified,
    changeFrequency: "daily" as const,
    priority: route === "/chat" || route === "/compare" ? 0.9 : 0.8,
  }));

  const infoPages = ["/alerts", "/methodology", "/drhp-analyzer"];
  const infoUrls = infoPages.map((route) => ({
    url: canonicalUrl(route),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

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

  // Blog dynamic urls
  const blogRegistryPath = path.join(process.cwd(), "data", "blog-registry.json");
  let blogUrls: MetadataRoute.Sitemap = [];
  try {
    if (fs.existsSync(blogRegistryPath)) {
      const fileContents = fs.readFileSync(blogRegistryPath, "utf8");
      const articles = JSON.parse(fileContents);
      blogUrls = articles.map((article: any) => ({
        url: canonicalUrl(`/blog/${article.slug}`),
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Error reading blog-registry.json in sitemap:", error);
  }
  
  // Additional mock educational blogs
  const educationalBlogUrls: MetadataRoute.Sitemap = MOCK_ARTICLES.map((article) => ({
    url: canonicalUrl(`/blog/${article.slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...toolUrls, ...infoUrls, ...staticUrls, ...dynamicUrls, ...blogUrls, ...educationalBlogUrls];
}
