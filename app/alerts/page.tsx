import type { Metadata } from "next";
import AlertsClient from "./AlertsClient";

export const metadata: Metadata = {
  title: "Get Daily IPO GMP Alerts — Email & Telegram | IPOCraft",
  description:
    "Subscribe to free daily IPO GMP alerts from IPOCraft. Get live Grey Market Premium updates straight to your email or Telegram — no account required.",
  alternates: { canonical: "https://www.ipocraft.com/alerts" },
  openGraph: {
    title: "Free IPO GMP Alerts | IPOCraft",
    description: "Get daily GMP updates for Indian IPOs via email or Telegram. Free, no signup.",
    type: "website",
  },
};

export default function AlertsPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#090B0F] pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/30 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4">
            Free · No Account Required
          </div>
          <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
            Daily IPO GMP Alerts
          </h1>
          <p className="text-[14px] text-[#475569] dark:text-[#9AA1AA] mt-2 leading-relaxed">
            Get the top 5 IPO Grey Market Premiums every morning — before you start your day.
            Pick your preferred channel below.
          </p>
        </div>
        <AlertsClient />
        <p className="text-[11px] text-gray-400 dark:text-[#64748B] text-center mt-8 leading-relaxed">
          GMP is an informal, unofficial indicator sourced from public market channels.
          It is indicative only and does not constitute investment advice.
        </p>
      </div>
    </main>
  );
}
