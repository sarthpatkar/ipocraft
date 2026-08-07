import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Outfit, Inter } from "next/font/google";
import { ClockIcon, CalendarIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { canonicalUrl } from "@/lib/site-url";
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
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const articles = JSON.parse(fileContents);
    return articles.find((a: any) => a.slug === slug);
  } catch (error) {
    console.error("Error reading blog-registry.json:", error);
    return null;
  }
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

  return (
    <div
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased pb-20`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <div className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
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

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10">
        <article 
          className="prose prose-slate prose-lg sm:prose-xl max-w-none prose-headings:font-semibold prose-headings:text-[#0f172a] prose-a:text-blue-600 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        />
      </div>
    </div>
  );
}
