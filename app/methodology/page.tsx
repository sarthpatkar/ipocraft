import type { Metadata } from "next";
import Link from "next/link";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Data Methodology — How IPOCraft Tracks GMP & Subscription Data | IPOCraft",
  description:
    "Learn how IPOCraft collects, verifies, and updates IPO GMP, subscription, allotment, and listing data for 60+ Mainboard and SME IPOs tracked on the platform.",
  alternates: { canonical: "https://www.ipocraft.com/methodology" },
};

const methodologySchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "IPOCraft Data Methodology",
  description: "How IPOCraft collects, verifies, and updates IPO GMP, subscription, and listing data.",
  url: "https://www.ipocraft.com/methodology",
  publisher: {
    "@type": "Organization",
    name: "IPOCraft",
    url: "https://www.ipocraft.com",
  },
  dateModified: new Date().toISOString().split("T")[0],
};

export default function MethodologyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(methodologySchema) }} />
      <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#090B0F] pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
          <nav className="flex items-center gap-1.5 text-[12px] text-[#64748b] dark:text-[#9AA1AA] mb-8">
            <Link href="/" className="hover:text-[#1C317A] dark:hover:text-blue-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#0f172a] dark:text-[#F1F5F9] font-medium">Data Methodology</span>
          </nav>

          <div className="mb-10">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#1C317A] dark:text-blue-400 mb-3" style={{ fontFamily: "var(--font-inter)" }}>
              Transparency · Research · Accuracy
            </p>
            <h1 className="text-[2rem] sm:text-[2.25rem] font-bold text-[#0f172a] dark:text-[#F1F5F9] leading-tight mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
              How IPOCraft Tracks Data
            </h1>
            <p className="text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              IPOCraft is committed to transparency about how we source, process, and display market data. This page explains our methodology for each data type.
            </p>
          </div>

          <div className="space-y-8">
            {/* GMP */}
            <section className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#1C317A]/10 dark:bg-[#1C317A]/20 flex items-center justify-center shrink-0 mt-0.5 text-[#1C317A] dark:text-[#93B4FF]">
                  <ChartBarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-[1.1rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
                    Grey Market Premium (GMP)
                  </h2>
                  <p className="text-[11px] text-gray-400 dark:text-[#9AA1AA] mt-0.5">Updated approximately every 30–60 minutes during market hours</p>
                </div>
              </div>
              <div className="space-y-3 text-[13.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
                <p>IPOCraft aggregates Grey Market Premium data from publicly available market channels and discussion forums. GMP represents the informal premium at which IPO shares are being traded in the unofficial grey market before official listing.</p>
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3 text-[12.5px] text-amber-700 dark:text-amber-400">
                  <strong>Important:</strong> GMP is an unofficial, informal market indicator. It is not sourced from, regulated by, or affiliated with NSE, BSE, or SEBI. GMP can change rapidly and may not reflect actual listing prices. Use it for research context only — not as an investment signal.
                </div>
              </div>
            </section>

            {/* Subscription */}
            <section className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400">
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-[1.1rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
                    Subscription Data
                  </h2>
                  <p className="text-[11px] text-gray-400 dark:text-[#9AA1AA] mt-0.5">Sourced from NSE/BSE official bid announcements</p>
                </div>
              </div>
              <p className="text-[13.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
                Subscription multiples (QIB, HNI/NII, Retail) are sourced from official NSE and BSE bid data announcements published during and after the subscription period. Data is updated manually or via automated monitoring of exchange disclosure feeds. Day-wise breakdowns are shown when available from official exchange data.
              </p>
            </section>

            {/* IPO Details */}
            <section className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0 mt-0.5 text-blue-600 dark:text-blue-400">
                  <BuildingLibraryIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-[1.1rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
                    IPO Details & Timeline
                  </h2>
                  <p className="text-[11px] text-gray-400 dark:text-[#9AA1AA] mt-0.5">Sourced from official offer documents (DRHP / RHP) and exchange circulars</p>
                </div>
              </div>
              <p className="text-[13.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
                Price bands, lot sizes, issue sizes, open/close/allotment/listing dates, and company fundamentals are sourced from official offer documents (DRHP / RHP), NSE / BSE exchange filings, and registrar announcements. IPOCraft compiles this information for research convenience.
              </p>
            </section>

            {/* Update frequency */}
            <section className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-6">
              <h2 className="text-[1.1rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
                Data Update Frequency
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-[#252A31]">
                      <th className="text-left py-2 pr-4 text-gray-500 dark:text-[#9AA1AA] font-medium">Data Type</th>
                      <th className="text-left py-2 pr-4 text-gray-500 dark:text-[#9AA1AA] font-medium">Frequency</th>
                      <th className="text-left py-2 text-gray-500 dark:text-[#9AA1AA] font-medium">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-[#1F242C]">
                    {[
                      ["GMP", "Every 30–60 minutes (market hours)", "Public market channels"],
                      ["Subscription Data", "During subscription period daily", "NSE / BSE bid announcements"],
                      ["IPO Dates / Timeline", "On schedule change", "SEBI / Exchange filings"],
                      ["Listing Price / Gain", "On listing day", "NSE / BSE official price feed"],
                      ["Company Fundamentals", "Static (from offer document)", "DRHP / RHP"],
                    ].map(([type, freq, source]) => (
                      <tr key={type}>
                        <td className="py-2.5 pr-4 font-medium text-[#0f172a] dark:text-[#F1F5F9]">{type}</td>
                        <td className="py-2.5 pr-4 text-[#475569] dark:text-[#9AA1AA]">{freq}</td>
                        <td className="py-2.5 text-[#475569] dark:text-[#9AA1AA]">{source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-6">
              <h2 className="text-[1rem] font-semibold text-amber-800 dark:text-amber-300 mb-2" style={{ fontFamily: "var(--font-outfit)" }}>
                Disclaimer
              </h2>
              <p className="text-[13px] text-amber-700 dark:text-amber-400 leading-relaxed">
                All information on IPOCraft is for informational and research purposes only. IPOCraft does not provide investment advice. GMP data is unofficial and does not guarantee listing performance. Always verify information through official SEBI, NSE, and BSE disclosures before making any investment decision. Past performance of listed IPOs does not guarantee future results.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
