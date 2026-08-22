import type { Metadata } from "next";
import BrokerList from "@/components/BrokerList";
import { Outfit, Inter } from "next/font/google";
import { canonicalUrl } from "@/lib/site-url";

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

const brokersUrl = canonicalUrl("/brokers");

export const metadata: Metadata = {
  title:
    "Best Stock Brokers in India 2026 — Charges, Fees & IPO Support Comparison | IPOCraft",
  description:
    "Compare the best stock brokers in India including Zerodha, Groww, Angel One and others. Review brokerage charges, account fees, platform features, and IPO application support to choose the right broker.",
  keywords: [
    "best stock broker India",
    "broker comparison India",
    "IPO brokers India",
    "Zerodha vs Groww",
    "brokerage charges India",
    "Demat account comparison",
    "Angel One charges",
  ],
  alternates: {
    canonical: brokersUrl,
  },
  openGraph: {
    title:
      "Best Stock Brokers in India — Charges & IPO Comparison | IPOCraft",
    description:
      "Compare brokerage fees, features, and IPO support across leading Indian brokers.",
    url: brokersUrl,
    siteName: "IPOCraft",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Best Stock Brokers in India — Charges & IPO Comparison | IPOCraft",
    description:
      "Compare brokerage charges and IPO features across top brokers — IPOCraft.",
  },
};

export default async function BrokersPage() {
  return (
    <main
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] dark:bg-[#080D18] text-[#0f172a] dark:text-[#F1F5F9]`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* HERO */}
      <section className="border-b border-[#e2e8f0] dark:border-[#22304A] bg-white dark:bg-[#0D1525]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-[10.5px] font-semibold uppercase text-blue-600 dark:text-[#3B82F6] mb-2 tracking-wide">
            Broker Comparison India
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.25rem] font-semibold leading-tight max-w-3xl text-[#0f172a] dark:text-[#F1F5F9]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Compare the Best Stock Brokers for IPO Investing
          </h1>

          <p className="mt-2 text-sm sm:text-[14.5px] text-[#475569] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
            Evaluate brokerage charges, account opening fees, platform features, and UPI IPO bidding support across major brokers in India.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2 mt-4 text-[11px]">
            <span className="bg-[#f1f5f9] dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] text-gray-700 dark:text-[#94A3B8] px-2.5 py-1 rounded-md">
              Data from Public Disclosures
            </span>
            <span className="bg-[#f1f5f9] dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] text-gray-700 dark:text-[#94A3B8] px-2.5 py-1 rounded-md">
              Research Comparison
            </span>
          </div>
        </div>
      </section>

      {/* BROKER LIST */}
      <section className="bg-[#f8fafc] dark:bg-[#080D18] border-b border-[#e2e8f0] dark:border-[#22304A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <BrokerList />

          <p className="mt-4 text-[11.5px] text-[#94a3b8] dark:text-[#64748B] leading-relaxed">
            Broker charges are indicative and subject to change. Please verify current tariffs directly with the respective broker before opening an account.
          </p>
        </div>
      </section>

      {/* INFO SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#11182D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 shadow-xs">
            <h2
              className="text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-2"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              How to Choose a Broker for IPO Investing
            </h2>
            <p className="text-[13px] text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              Key considerations include UPI 2.0 IPO mandate reliability, zero-AMC accounts, delivery brokerage rates, and high-frequency stability during peak subscription hours.
            </p>
          </div>

          <div className="bg-white dark:bg-[#11182D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 shadow-xs">
            <h2
              className="text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-2"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Data Transparency
            </h2>
            <p className="text-[13px] text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              IPOCraft aggregates tariff schedules from public exchange filings and broker websites for research comparison purposes.
            </p>
          </div>
        </div>
      </section>

      {/* LEGAL + AFFILIATE DISCLOSURE */}
      <section className="bg-white dark:bg-[#111827] border-t border-[#e2e8f0] dark:border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <h2
            className="text-lg font-semibold mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Disclaimer & Disclosure
          </h2>

          <p className="text-[13px] text-[#475569] dark:text-slate-400 leading-relaxed max-w-3xl">
            IPOCraft is an informational platform and is not registered with
            SEBI or any financial regulatory authority. This content does not
            constitute investment advice, recommendations, or solicitation.
            Users must conduct independent research and consult qualified
            financial advisors before investing.
          </p>

          <p className="mt-4 text-[12.5px] text-[#64748b] dark:text-slate-400 leading-relaxed max-w-3xl">
            Some links on this page may be affiliate links. IPOCraft may earn a
            referral commission if users open accounts through partner brokers.
            This does not influence our comparisons or content.
          </p>

          <div className="mt-6 text-[12px] text-[#94a3b8] dark:text-slate-500">
            IPOCraft is independent and not affiliated with any broker unless
            explicitly stated.
          </div>
        </div>
      </section>
    </main>
  );
}
