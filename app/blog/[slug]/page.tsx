import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Outfit, Inter } from "next/font/google";
import { ClockIcon, CalendarIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { canonicalUrl } from "@/lib/site-url";
import { getMockArticleBySlug, MOCK_ARTICLES } from "@/lib/mock-articles";
import ReadingProgress from "@/components/ReadingProgress";
import SocialShare from "@/components/SocialShare";
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
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased pb-20`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <ReadingProgress />
      <div className="bg-gradient-to-b from-blue-50/80 to-white border-b border-[#e2e8f0] relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm font-medium text-[#64748b] hover:text-[#0f172a] transition-colors mb-8"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-[#64748b]">
            <span className="font-semibold tracking-wider uppercase bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
              {article.category}
            </span>
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              {article.date}
            </div>
            <div className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4" />
              {article.readTime}
            </div>
          </div>
          
          <h1
            className="text-3xl sm:text-4xl md:text-[2.75rem] font-semibold leading-[1.2] tracking-tight text-[#0f172a]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {article.title}
          </h1>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-12 animate-fade-in-up">
        <article 
          className="prose prose-slate prose-lg sm:prose-xl max-w-none prose-headings:font-semibold prose-headings:text-[#0f172a] prose-headings:mt-10 prose-headings:mb-4 prose-p:mb-6 prose-p:leading-loose prose-a:text-blue-600 prose-a:decoration-blue-300 prose-a:underline-offset-4 hover:prose-a:decoration-blue-600 prose-img:rounded-xl [&>p:first-of-type]:first-letter:text-[4rem] [&>p:first-of-type]:first-letter:font-bold [&>p:first-of-type]:first-letter:text-blue-600 [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:leading-[0.8]"
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        />
        
        <SocialShare title={article.title} />

        {/* Legal Disclaimer */}
        <div className="mt-12 p-5 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-3 text-sm text-[#475569] leading-relaxed">
          <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <strong className="text-blue-900 font-semibold block mb-1">Important Disclaimer</strong>
            This article is authored by the IPOCraft Research Team for educational purposes only. It does not constitute financial or investment advice. Always consult with a SEBI-registered financial advisor before making investment decisions.
          </div>
        </div>
      </div>

      {/* Read Next Section */}
      {nextArticle && (
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-12 border-t border-[#e2e8f0]">
          <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-outfit)" }}>
            Read Next
          </h3>
          <Link href={`/blog/${nextArticle.slug}`} className="block group">
            <div className="p-6 bg-white border border-[#e2e8f0] rounded-xl group-hover:shadow-md transition-shadow">
              <span className="text-xs font-semibold uppercase text-blue-600 mb-2 block">{nextArticle.category}</span>
              <h4 className="text-xl font-medium text-[#0f172a] group-hover:text-blue-600 transition-colors mb-2">{nextArticle.title}</h4>
              <p className="text-[#64748b] text-sm">{nextArticle.excerpt}</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
