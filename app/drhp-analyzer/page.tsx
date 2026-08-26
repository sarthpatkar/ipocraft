import type { Metadata } from "next";
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
  },
};

export default function DRHPAnalyzerPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#090B0F] pb-20">
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
          <p className="text-[12px] text-amber-600 dark:text-amber-400 mt-3 flex items-start gap-1.5">
            <span className="mt-0.5 shrink-0">⚠️</span>
            This is an AI-generated summary for research purposes only. It is not investment advice. Always read the full DRHP before making investment decisions.
          </p>
        </div>
        <DRHPAnalyzerClient />
      </div>
    </main>
  );
}
