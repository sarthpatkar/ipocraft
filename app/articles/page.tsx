import type { Metadata } from "next";
import Link from "next/link";
import { Outfit, Inter } from "next/font/google";
import { ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IPO Market Articles & Insights | IPOCraft",
  description: "Read the latest IPO market articles, Grey Market Premium analysis, and listing strategies.",
};

// Mock data (replace with Supabase later)
const MOCK_ARTICLES = [
  {
    id: 1,
    slug: "jio-financial-services-ipo-details",
    title: "Jio Financial Services IPO: What You Need to Know",
    excerpt: "An in-depth look at the highly anticipated Jio Financial Services IPO, including valuation, promoter holding, and expected GMP.",
    date: "July 23, 2026",
    readTime: "5 min read",
    category: "Mainboard IPO",
  },
  {
    id: 2,
    slug: "understanding-sme-ipo-risks",
    title: "Understanding the Risks and Rewards of SME IPOs",
    excerpt: "SME IPOs have been delivering massive listing gains, but they come with significant risks. Here is our complete analysis.",
    date: "July 21, 2026",
    readTime: "4 min read",
    category: "SME IPO",
  },
  {
    id: 3,
    slug: "how-to-track-gmp-accurately",
    title: "How to Track IPO GMP Accurately Before Listing",
    excerpt: "Grey Market Premium is a strong indicator of listing performance. Learn how to track it accurately and avoid market manipulation.",
    date: "July 18, 2026",
    readTime: "6 min read",
    category: "Market Insights",
  }
];

export default function ArticlesPage() {
  return (
    <div
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased pb-20`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 text-center animate-fade-in-up">
          <p className="text-sm font-semibold uppercase text-blue-600 mb-3">
            IPOCraft Insights
          </p>
          <h1
            className="text-3xl sm:text-4xl lg:text-[2.8rem] font-bold leading-tight tracking-[-0.01em] text-[#0f172a]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Market Research & Articles
          </h1>
          <p className="mt-4 text-[15px] sm:text-base text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Deep-dive analysis, Grey Market updates, and listing strategies for Indian IPOs.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="space-y-8">
          {MOCK_ARTICLES.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="block group">
              <article className="bg-white border border-[#e2e8f0] rounded-xl p-6 sm:p-8 card-hover">
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-4">
                  {article.category}
                </span>
                
                <h2 
                  className="text-xl sm:text-2xl font-bold text-[#0f172a] group-hover:text-blue-600 transition-colors mb-3"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {article.title}
                </h2>
                
                <p className="text-[14px] sm:text-[15px] text-[#475569] leading-relaxed mb-6">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center gap-4 text-[12px] text-[#64748b] font-medium border-t border-[#f1f5f9] pt-4">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4" />
                    {article.readTime}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
