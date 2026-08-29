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
    images: [{ url: "https://www.ipocraft.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Daily IPO GMP Alerts | IPOCraft",
    description: "Get daily GMP updates for Indian IPOs via email or Telegram. Free, no signup.",
    images: ["https://www.ipocraft.com/og-image.png"],
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

        {/* Sample Digest Preview */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-[11.5px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA]">
              Sample Alert Preview
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#1F242B] text-gray-500 dark:text-[#9AA1AA] font-semibold border border-gray-200 dark:border-[#252A31]">
              Preview Only
            </span>
          </div>
          <div className="bg-[#17212B] rounded-xl p-4 font-mono text-[12.5px] leading-relaxed text-[#E8E8E8] border border-[#2B3947] shadow-lg">
            <p className="text-[#7EC8E3] font-semibold mb-1">IPOCraft Morning GMP Brief</p>
            <p className="text-[#9AA1AA] text-[11px] mb-3">Daily at 9:30 AM IST · ipocraft.com</p>
            <p className="text-[#64B5F6] font-semibold mb-1 text-[11px] uppercase tracking-wider">Mainboard IPOs</p>
            <p>
              <span className="text-white font-semibold">ABC Technologies Ltd</span>{" "}
              <span className="text-[#4CAF50]">+145 GMP (+29%)</span>
            </p>
            <p className="text-[#9AA1AA] text-[11px] ml-3">Open until 28 Aug · Price Band 490–500</p>
            <p className="mt-1">
              <span className="text-white font-semibold">XYZ Infra Corp</span>{" "}
              <span className="text-[#9AA1AA]">0 GMP (–)</span>
            </p>
            <p className="text-[#9AA1AA] text-[11px] ml-3">Closing Today · Last day to apply</p>
            <p className="mt-2 text-[#64B5F6] font-semibold text-[11px] uppercase tracking-wider">SME IPOs</p>
            <p>
              <span className="text-white font-semibold">PQR Micro Solutions</span>{" "}
              <span className="text-[#4CAF50]">+55 GMP (+22%)</span>
            </p>
            <p className="text-[#9AA1AA] text-[11px] ml-3">Last Day Today · NSE Emerge</p>
            <div className="border-t border-[#2B3947] mt-3 pt-2 text-[11px] text-[#9AA1AA]">
              Unsubscribe anytime · ipocraft.com/alerts · Data is indicative only
            </div>
          </div>
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
