import type { MetadataRoute } from "next";
import { CANONICAL_ORIGIN, canonicalUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/auth"],
      },
    ],
    sitemap: canonicalUrl("/sitemap.xml"),
    host: CANONICAL_ORIGIN,
  };
}
