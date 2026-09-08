import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  turbopack: {
    root: __dirname,
  },
  images: {
    // 50: used for the flat two-tone logo wordmark, which compresses
    // heavily with no visible quality loss (flagged as oversized /
    // under-compressed by Lighthouse and third-party SEO audits).
    // 75 stays as the default for photographic content.
    qualities: [50, 75],
  },
};

export default nextConfig;
