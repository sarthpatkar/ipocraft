import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";
import { ClockIcon } from "@heroicons/react/24/outline";
import { MOCK_ARTICLES } from "@/lib/mock-articles";
import { formatDisplayDate } from "@/lib/formatters";
import fs from "fs";
import path from "path";



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

  // Merge registry articles with mock articles — deduplicate by slug (registry takes precedence)
  const slugsSeen = new Set<string>();
  const allArticles = [...articles, ...MOCK_ARTICLES].filter((a: any) => {
    if (slugsSeen.has(a.slug)) return false;
    slugsSeen.add(a.slug);
    return true;
  });

  return (
    <div
      className={`min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9] antialiased pb-16`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <div className="bg-white dark:bg-[#111418] border-b border-gray-200 dark:border-[#252A31]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 sm:py-10 text-center">
          <p className="text-[11px] font-semibold uppercase text-blue-600 dark:text-blue-400 mb-2 tracking-wider">
            IPO Education &amp; Insights
          </p>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 text-[#0f172a] dark:text-[#F1F5F9]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            IPO Insights &amp; Market Research
          </h1>
          <p className="text-gray-600 dark:text-[#9AA1AA] text-sm sm:text-[15px] max-w-xl mx-auto leading-relaxed">
            Market analysis, grey market premium dynamics, allotment processes, and subscription breakdowns.
          </p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {allArticles.map((article: any) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg overflow-hidden hover:border-gray-400 dark:hover:border-gray-500 transition-colors flex flex-col shadow-xs"
            >
              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10.5px] font-semibold tracking-wider uppercase bg-blue-50 dark:bg-[#171B20] text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-[#252A31] px-2.5 py-0.5 rounded-md">
                    {article.category}
                  </span>
                  <div className="flex items-center text-gray-400 dark:text-[#6B7280] text-[11.5px]">
                    <ClockIcon className="w-3.5 h-3.5 mr-1" />
                    {article.readTime}
                  </div>
                </div>
                
                <h2
                  className="text-lg sm:text-xl font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {article.title}
                </h2>
                
                <p className="text-[#475569] dark:text-[#9AA1AA] text-[13px] leading-relaxed mb-5 flex-1">
                  {article.excerpt}
                </p>

                <div className="pt-3 border-t border-gray-100 dark:border-[#252A31] flex items-center justify-between mt-auto">
                  <span className="text-[12px] text-gray-500 dark:text-[#9AA1AA] font-medium">{formatDisplayDate(article.date)}</span>
                  <span className="text-blue-600 dark:text-blue-400 text-[12.5px] font-semibold">
                    Read Article
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
