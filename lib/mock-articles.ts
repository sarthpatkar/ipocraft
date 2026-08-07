export const MOCK_ARTICLES = [
  {
    id: 1,
    slug: "jio-financial-services-ipo-details",
    title: "Jio Financial Services IPO: What You Need to Know",
    excerpt: "An in-depth look at the highly anticipated Jio Financial Services IPO, including valuation, promoter holding, and expected GMP.",
    content: `
      <p>The upcoming IPO of Jio Financial Services is highly anticipated by retail and institutional investors alike. Expected to be one of the largest offerings this year, the company plans to use the proceeds to expand its lending footprint across India.</p>
      <h2>Key Valuation Metrics</h2>
      <p>Market experts suggest that the valuation is aggressive but justified given the massive distribution network of Reliance. Investors should look closely at the Price-to-Book (P/B) ratio compared to peers like Bajaj Finance.</p>
      <h2>Grey Market Premium (GMP) Expectations</h2>
      <p>Currently, the unofficial grey market is showing robust demand, with GMP indicating a potential 25-30% listing gain. However, GMP is highly volatile and should not be the sole factor for investment.</p>
    `,
    date: "July 23, 2026",
    readTime: "5 min read",
    category: "Mainboard IPO",
  },
  {
    id: 2,
    slug: "understanding-sme-ipo-risks",
    title: "Understanding the Risks and Rewards of SME IPOs",
    excerpt: "SME IPOs have been delivering massive listing gains, but they come with significant risks. Here is our complete analysis.",
    content: `
      <p>SME IPOs are known for massive listing gains, often exceeding 100% on day one. However, the lack of institutional participation makes them highly volatile and prone to lower liquidity post-listing.</p>
    `,
    date: "July 21, 2026",
    readTime: "4 min read",
    category: "SME IPO",
  },
  {
    id: 3,
    slug: "how-to-track-gmp-accurately",
    title: "How to Track IPO GMP Accurately Before Listing",
    excerpt: "Grey Market Premium is a strong indicator of listing performance. Learn how to track it accurately and avoid market manipulation.",
    content: "<p>Grey Market Premium is a strong indicator of listing performance. Learn how to track it accurately and avoid market manipulation.</p>",
    date: "July 18, 2026",
    readTime: "6 min read",
    category: "Market Insights",
  }
];

export function getMockArticleBySlug(slug: string) {
  return MOCK_ARTICLES.find(article => article.slug === slug);
}
