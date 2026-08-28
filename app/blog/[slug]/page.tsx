import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClockIcon, CalendarIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { canonicalUrl } from "@/lib/site-url";
import { getMockArticleBySlug, MOCK_ARTICLES } from "@/lib/mock-articles";
import ReadingProgress from "@/components/ReadingProgress";
import SocialShare from "@/components/SocialShare";
import { formatDisplayDate } from "@/lib/formatters";
import fs from "fs";
import path from "path";



async function getArticle(slug: string) {
  const filePath = path.join(process.cwd(), "data", "blog-registry.json");
  let article = null;
  try {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const articles = JSON.parse(fileContents);
      article = articles.find((a: any) => a.slug === slug);
    }
  } catch (error) {
    console.error("Error reading blog-registry.json:", error);
  }

  // Fallback to mock educational articles
  if (!article) {
    article = getMockArticleBySlug(slug);
  }

  return article;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  
  if (!article) return { title: "Article Not Found" };
  
  return {
    title: `${article.title} | IPOCraft Insights`,
    description: article.excerpt,
    alternates: {
      canonical: canonicalUrl(`/blog/${slug}`),
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  
  if (!article) return notFound();

  // Get next article for "Read Next" (simple logic: get first mock article that isn't this one)
  const nextArticle = MOCK_ARTICLES.find(a => a.slug !== slug) || MOCK_ARTICLES[0];

  return (
    <div
      className={`min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9] antialiased pb-20`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <ReadingProgress />
      <div className="bg-white dark:bg-[#111418] border-b border-gray-200 dark:border-[#252A31] relative">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-xs font-medium text-gray-500 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-[#F1F5F9] transition-colors mb-5"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5 mr-1.5" />
            Back to Articles
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-gray-500 dark:text-[#9AA1AA]">
            <span className="font-semibold tracking-wider uppercase bg-blue-50 dark:bg-[#171B20] text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-[#252A31] px-2.5 py-0.5 rounded-md text-[10.5px]">
              {article.category}
            </span>
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              {formatDisplayDate(article.date)}
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3.5 h-3.5" />
              {article.readTime}
            </div>
          </div>
          
          <h1
            className="text-2xl sm:text-3xl md:text-[2.25rem] font-semibold leading-[1.25] tracking-tight text-[#0f172a] dark:text-[#F1F5F9]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {article.title}
          </h1>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <article 
          className="prose prose-slate dark:prose-invert prose-base sm:prose-lg max-w-none prose-headings:font-semibold prose-headings:text-[#0f172a] dark:prose-headings:text-[#F1F5F9] prose-p:leading-relaxed prose-p:text-[#334155] dark:prose-p:text-[#9AA1AA] prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        />
        
        <SocialShare title={article.title} />

        {/* Legal Disclaimer */}
        <div className="mt-10 p-4 bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] rounded-lg flex gap-3 text-xs text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <strong className="text-gray-900 dark:text-[#F1F5F9] font-semibold block mb-0.5">Disclaimer</strong>
            This article is for educational and informational purposes only. It does not constitute financial or investment advice. Always consult a qualified SEBI-registered financial advisor before making investment decisions.
          </div>
        </div>
      </div>

      {/* Read Next Section */}
      {nextArticle && (
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-12 border-t border-gray-200 dark:border-[#252A31]">
          <h3 className="text-2xl font-semibold mb-6 text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
            Read Next
          </h3>
          <Link
            href={`/blog/${nextArticle.slug}`}
            className="group block bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-6 hover:shadow-lg hover:border-gray-400 dark:hover:border-gray-500 transition-all"
          >
            <span className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
              {nextArticle.category}
            </span>
            <h4 className="text-xl font-semibold text-[#0f172a] dark:text-[#F1F5F9] mt-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {nextArticle.title}
            </h4>
            <p className="text-sm text-[#475569] dark:text-[#9AA1AA] line-clamp-2">
              {nextArticle.excerpt}
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
