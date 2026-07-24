import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Outfit, Inter } from "next/font/google";
import { ClockIcon, CalendarIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

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

// Mock data (replace with Supabase later)
const MOCK_ARTICLES: Record<string, any> = {
  "jio-financial-services-ipo-details": {
    title: "Jio Financial Services IPO: What You Need to Know",
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
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = MOCK_ARTICLES[slug];
  
  if (!article) return { title: "Article Not Found" };
  
  return {
    title: `${article.title} | IPOCraft Insights`,
    description: article.content.substring(0, 150).replace(/<[^>]*>?/gm, ''),
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = MOCK_ARTICLES[slug];

  if (!article) {
    notFound();
  }

  return (
    <div
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased pb-20`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <Link 
          href="/articles" 
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors mb-8"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Articles
        </Link>
        
        <article className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-10 shadow-sm">
          <header className="mb-8 border-b border-[#f1f5f9] pb-8">
            <span className="inline-flex items-center text-[10.5px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-5">
              {article.category}
            </span>
            
            <h1 
              className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-[#0f172a] leading-tight mb-5"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {article.title}
            </h1>
            
            <div className="flex items-center gap-5 text-[13px] text-[#64748b] font-medium">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-4.5 h-4.5" />
                {article.date}
              </div>
              <div className="flex items-center gap-1.5">
                <ClockIcon className="w-4.5 h-4.5" />
                {article.readTime}
              </div>
            </div>
          </header>
          
          <div 
            className="prose prose-blue max-w-none prose-headings:font-semibold prose-headings:font-outfit prose-h2:text-2xl prose-p:text-[#475569] prose-p:leading-relaxed prose-a:text-blue-600 hover:prose-a:text-blue-700"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </div>
  );
}
