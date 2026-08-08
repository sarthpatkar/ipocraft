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
  },
  {
    id: 4,
    slug: "what-is-rhp-red-herring-prospectus",
    title: "What is a Red Herring Prospectus (RHP) and How to Read It?",
    excerpt: "The RHP is the most important document for an IPO investor. Learn the key sections you must check before applying for an IPO.",
    content: `
      <p>Before any company goes public in India, it must file a Red Herring Prospectus (RHP) with the Securities and Exchange Board of India (SEBI). This document contains everything you need to know about the company's business, financials, and the risks involved.</p>
      <h2>Top 3 Things to Check in an RHP</h2>
      <ul>
        <li><strong>Objects of the Issue:</strong> Is the company using the money to pay off debt or to fund future growth? Growth is generally preferred.</li>
        <li><strong>Financial Track Record:</strong> Look at the revenue and profit growth over the last 3 years. Are they consistent?</li>
        <li><strong>Risk Factors:</strong> What are the internal and external risks that could destroy the company's business model?</li>
      </ul>
      <p>Always remember, investing without reading the RHP is like buying a house without looking inside.</p>
    `,
    date: "July 15, 2026",
    readTime: "7 min read",
    category: "IPO Basics",
  },
  {
    id: 5,
    slug: "understanding-asba",
    title: "Understanding ASBA: How IPO Application Works",
    excerpt: "ASBA ensures your money never leaves your bank account until you get an allotment. Learn how this game-changing mechanism works.",
    content: `
      <p>ASBA (Application Supported by Blocked Amount) is a system developed by SEBI to make IPO applications safer for retail investors. When you apply for an IPO, the application amount is only blocked in your bank account, not debited.</p>
      <h2>Why is ASBA better?</h2>
      <p>Previously, investors had to write cheques, and refunds took weeks. With ASBA, you continue to earn interest on your blocked amount until the allotment day. If you don't get the allotment, the block is instantly released.</p>
      <h2>UPI vs ASBA</h2>
      <p>While UPI is extremely popular for IPO applications (up to ₹5 Lakhs), net-banking ASBA is often more reliable and less prone to mandate failures.</p>
    `,
    date: "July 12, 2026",
    readTime: "4 min read",
    category: "Guides",
  }
];

export function getMockArticleBySlug(slug: string) {
  return MOCK_ARTICLES.find(article => article.slug === slug);
}
