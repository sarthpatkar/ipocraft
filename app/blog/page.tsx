import type { Metadata } from "next";
import Link from "next/link";
import { Outfit, Inter } from "next/font/google";
import { canonicalUrl } from "@/lib/site-url";
import { ClockIcon } from "@heroicons/react/24/outline";
import { MOCK_ARTICLES } from "@/lib/mock-articles";
import fs from "fs";
import path from "path";

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
  title: "IPO Market Blog & Insights | IPOCraft",
  description: "Read the latest IPO market articles, Grey Market Premium analysis, and listing strategies.",
  alternates: {
    canonical: canonicalUrl("/blog"),
  },
};

export default async function BlogIndexPage() {
  const filePath = path.join(process.cwd(), "data", "blog-registry.json");
  let articles = [];
  try {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      articles = JSON.parse(fileContents);
    }
  } catch (error) {
    console.error("Error reading blog-registry.json:", error);
  }

  // Merge registry articles with mock articles
  const allArticles = [...articles, ...MOCK_ARTICLES];

  return (
    <div
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased pb-20`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <div className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 text-[#0f172a]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            IPO Insights & Blog
          </h1>
          <p className="text-[#64748b] text-base sm:text-lg max-w-2xl mx-auto">
            Deep-dive analysis, GMP trends, and investment strategies for upcoming IPOs.
          </p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allArticles.map((article: any) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold tracking-wider uppercase bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <div className="flex items-center text-[#94a3b8] text-xs">
                    <ClockIcon className="w-4 h-4 mr-1.5" />
                    {article.readTime}
                  </div>
                </div>
                
                <h2
                  className="text-xl sm:text-2xl font-semibold text-[#0f172a] mb-3 group-hover:text-blue-600 transition-colors"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {article.title}
                </h2>
                
                <p className="text-[#475569] text-sm leading-relaxed mb-6 flex-1">
                  {article.excerpt}
                </p>

                <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between mt-auto">
                  <span className="text-sm text-[#64748b] font-medium">{article.date}</span>
                  <span className="text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Read Article &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
