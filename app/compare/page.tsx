import type { Metadata } from "next";
import { Suspense } from "react";
import IpoCompareClient from "./IpoCompareClient";

export const metadata: Metadata = {
  title: "IPO Comparison Tool — Compare GMP, Subscription & Timeline | IPOCraft",
  description:
    "Compare up to 3 IPOs side-by-side. Instantly see GMP, subscription demand, price band, issue size, and listing dates for any Mainboard or SME IPO.",
  alternates: { canonical: "https://www.ipocraft.com/compare" },
  openGraph: {
    title: "IPO Comparison Tool | IPOCraft",
    description: "Side-by-side IPO comparison: GMP, subscription multiples, price band, and timeline.",
    type: "website",
  },
};

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#090B0F] pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="mb-8">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#1C317A] dark:text-blue-400 mb-2" style={{ fontFamily: "var(--font-inter)" }}>
            Free Tool
          </p>
          <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-[#0f172a] dark:text-[#F1F5F9] leading-tight" style={{ fontFamily: "var(--font-outfit)" }}>
            IPO Comparison Tool
          </h1>
          <p className="text-[14px] text-[#475569] dark:text-[#9AA1AA] mt-2 leading-relaxed max-w-2xl" style={{ fontFamily: "var(--font-inter)" }}>
            Select up to 3 IPOs and compare GMP, subscription multiples, price band, issue size, and key dates side-by-side.
          </p>
        </div>
        <Suspense fallback={<div className="h-64 flex items-center justify-center text-gray-400 text-[13px]">Loading comparison tool...</div>}>
          <IpoCompareClient />
        </Suspense>
      </div>
    </main>
  );
}
