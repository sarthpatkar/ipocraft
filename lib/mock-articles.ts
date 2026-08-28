// NOTE: "jio-financial-services-ipo-details" was removed — it described a real
// company's IPO as "upcoming"/"highly anticipated", but Jio Financial Services
// actually demerged and listed in August 2023, making the article factually
// wrong rather than just generic. "understanding-sme-ipo-risks" was also
// removed from here — it's now sole-sourced from data/blog-registry.json
// (this file and that JSON registry previously had duplicate, drifting
// copies of both slugs).
export const MOCK_ARTICLES = [
  {
    id: 1,
    slug: "how-to-track-gmp-accurately",
    title: "How to Track IPO GMP Accurately Before Listing",
    excerpt: "Grey Market Premium is a strong indicator of listing performance. Learn how to track it accurately and avoid market manipulation.",
    content: "<p>Grey Market Premium is a strong indicator of listing performance. Learn how to track it accurately and avoid market manipulation.</p>",
    date: "July 18, 2026",
    readTime: "6 min read",
    category: "Market Insights",
  },
  {
    id: 2,
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
    id: 3,
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
