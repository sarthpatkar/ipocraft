import type { Metadata } from "next";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import DRHPAnalyzerClient from "./DRHPAnalyzerClient";

export const metadata: Metadata = {
  title: "DRHP AI Analyzer — Risks, Opportunities & Financials | IPOCraft",
  description:
    "Paste any DRHP URL and get an AI-generated summary of key risks, growth opportunities, and financial metrics. Free IPO research tool by IPOCraft.",
  alternates: { canonical: "https://www.ipocraft.com/drhp-analyzer" },
  openGraph: {
    title: "DRHP AI Analyzer | IPOCraft",
    description: "AI-powered DRHP analysis: key risks, opportunities, and financials in seconds.",
    type: "website",
    images: [{ url: "https://www.ipocraft.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DRHP AI Analyzer | IPOCraft",
    description: "AI-powered DRHP analysis: key risks, opportunities, and financials in seconds.",
    images: ["https://www.ipocraft.com/og-image.png"],
  },
};

export default function DRHPAnalyzerPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#090B0F] pb-20">
      {/* Prominent legal disclaimer banner */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800/30 -mx-4 sm:-mx-6 lg:-mx-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl mx-auto py-2.5 flex items-start gap-2.5">
          <ExclamationTriangleIcon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[12px] text-amber-700 dark:text-amber-400 leading-relaxed">
            <strong>Research context only.</strong> AI-generated summaries may contain inaccuracies and do not constitute investment advice. Always read the complete DRHP/RHP before making any investment decisions.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30 text-[10.5px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4">
            Beta · AI-Powered
          </div>
          <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-[#0f172a] dark:text-[#F1F5F9] leading-tight" style={{ fontFamily: "var(--font-outfit)" }}>
            DRHP AI Analyzer
          </h1>
          <p className="text-[14px] text-[#475569] dark:text-[#9AA1AA] mt-2 leading-relaxed max-w-2xl" style={{ fontFamily: "var(--font-inter)" }}>
            Paste a DRHP PDF URL and our AI extracts the key risks, growth opportunities, and financial snapshot — so you can research any IPO faster.
          </p>
        </div>
        <DRHPAnalyzerClient />
      </div>
    </main>
  );
}
