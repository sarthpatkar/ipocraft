import type { MetadataRoute } from "next";
import { getSitemapIpoRows } from "@/lib/ipo.server";
import { canonicalUrl } from "@/lib/site-url";
import { MOCK_ARTICLES } from "@/lib/mock-articles";
import fs from "fs";
import path from "path";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const urlMap = new Map<string, MetadataRoute.Sitemap[number]>();

  const addUrl = (
    path: string,
    priority: number,
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  ) => {
    const fullUrl = canonicalUrl(path);
    // If URL already exists, keep the one with higher priority
    const existing = urlMap.get(fullUrl);
    if (!existing || existing.priority! < priority) {
      urlMap.set(fullUrl, {
        url: fullUrl,
        lastModified,
        changeFrequency,
        priority,
      });
    }
  };

  // ── 1. Core Platform & Real-Time Trackers (Highest Priority) ──
  addUrl("/", 1.0, "daily");
  addUrl("/gmp", 0.95, "daily");
  addUrl("/ipo", 0.9, "daily");
  addUrl("/sme-ipo", 0.9, "daily");
  addUrl("/subscriptions", 0.9, "daily");
  addUrl("/performance", 0.85, "daily");
  addUrl("/ipo-calendar", 0.85, "daily");
  addUrl("/ipo-history", 0.85, "weekly");
  addUrl("/allotment-status", 0.85, "daily");

  // ── 2. Standalone Research Tools & AI Workstation ──
  addUrl("/chat", 0.9, "daily");
  addUrl("/compare", 0.9, "daily");
  addUrl("/drhp-analyzer", 0.85, "weekly");
  addUrl("/ipo-profit-calculator", 0.85, "weekly");
  addUrl("/ipo-allotment-probability-calculator", 0.85, "weekly");
  addUrl("/alerts", 0.8, "weekly");
  addUrl("/methodology", 0.8, "monthly");

  // ── 3. Educational Guides & Knowledge Center ──
  addUrl("/how-ipo-allotment-works", 0.8, "monthly");
  addUrl("/what-is-ipo-gmp", 0.8, "monthly");
  addUrl("/ipo-subscription-meaning", 0.8, "monthly");
  addUrl("/qib-hni-retail-explained", 0.8, "monthly");
  addUrl("/ipo-grey-market-guide", 0.8, "monthly");
  addUrl("/blog", 0.75, "weekly");
  addUrl("/brokers", 0.7, "monthly");

  // ── 4. Transparency, Company & Legal Pages ──
  addUrl("/about", 0.5, "monthly");
  addUrl("/contact", 0.5, "monthly");
  addUrl("/feedback", 0.5, "monthly");
  addUrl("/privacy", 0.4, "monthly");
  addUrl("/terms", 0.4, "monthly");
  addUrl("/disclaimer", 0.4, "monthly");

  // ── 5. Dynamic IPO Detail Pages ──
  try {
    const ipoRows = await getSitemapIpoRows();
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    for (const row of ipoRows) {
      // A long-since-listed historical IPO's page rarely changes — "daily"
      // for all 600+ of them was both wasteful and a wrong freshness signal
      // to search engines. Open/upcoming/recently-listed pages still move
      // often (GMP, subscription, allotment) and keep "daily".
      const isOldListed =
        row.status === "Listed" &&
        row.listing_date != null &&
        new Date(row.listing_date) < ninetyDaysAgo;
      addUrl(
        `/ipo/${encodeURIComponent(row.slug)}`,
        0.8,
        isOldListed ? "monthly" : "daily"
      );
    }
  } catch (error) {
    console.error("Error loading IPO rows for sitemap:", error);
  }

  // ── 6. Dynamic Blog Articles ──
  try {
    const blogRegistryPath = path.join(process.cwd(), "data", "blog-registry.json");
    if (fs.existsSync(blogRegistryPath)) {
      const fileContents = fs.readFileSync(blogRegistryPath, "utf8");
      const articles = JSON.parse(fileContents);
      if (Array.isArray(articles)) {
        for (const article of articles) {
          if (article?.slug) {
            addUrl(`/blog/${article.slug}`, 0.65, "monthly");
          }
        }
      }
    }
  } catch (error) {
    console.error("Error reading blog-registry.json in sitemap:", error);
  }

  // ── 7. Educational Mock Articles ──
  for (const article of MOCK_ARTICLES) {
    if (article?.slug) {
      addUrl(`/blog/${article.slug}`, 0.65, "monthly");
    }
  }

  return Array.from(urlMap.values());
}

