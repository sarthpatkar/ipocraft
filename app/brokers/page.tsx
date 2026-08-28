import type { Metadata } from "next";
import BrokerList from "@/components/BrokerList";
import { canonicalUrl } from "@/lib/site-url";



const brokersUrl = canonicalUrl("/brokers");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title:
    `Best Stock Brokers in India ${CURRENT_YEAR} — Charges, Fees & IPO Support Comparison | IPOCraft`,
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
      className={`min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5]`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* HERO */}
      <section className="border-b border-[#e2e8f0] dark:border-[#252A31] bg-white dark:bg-[#111418]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
          <p className="text-[11px] font-semibold uppercase text-blue-600 dark:text-blue-400 mb-1.5 tracking-wider">
            Broker Comparison India
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight max-w-3xl text-[#0f172a] dark:text-[#F1F3F5]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Compare the Best Stock Brokers for IPO Investing
          </h1>

          <p className="mt-2 text-sm sm:text-[14.5px] text-[#475569] dark:text-[#9AA1AA] max-w-2xl leading-relaxed">
            Evaluate brokerage charges, account opening fees, platform features, and UPI IPO bidding support across major brokers in India.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2 mt-4 text-[11px]">
            <span className="bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-[#475569] dark:text-[#9AA1AA] px-2.5 py-1 rounded-md">
              Data from Public Disclosures
            </span>
            <span className="bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-[#475569] dark:text-[#9AA1AA] px-2.5 py-1 rounded-md">
              Research Comparison
            </span>
          </div>
        </div>
      </section>

      {/* BROKER LIST */}
      <section className="bg-[#f8fafc] dark:bg-[#090B0F] border-b border-[#e2e8f0] dark:border-[#252A31]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <BrokerList />

          <p className="mt-4 text-[11.5px] text-gray-500 dark:text-[#9AA1AA] leading-relaxed">
            Broker charges are indicative and subject to change. Please verify current tariffs directly with the respective broker before opening an account.
          </p>
        </div>
      </section>

      {/* INFO SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-5 shadow-xs">
            <h2
              className="text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-2"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              How to Choose a Broker for IPO Investing
            </h2>
            <p className="text-[13px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
              Key considerations include UPI 2.0 IPO mandate reliability, zero-AMC accounts, delivery brokerage rates, and platform stability during peak subscription hours.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-5 shadow-xs">
            <h2
              className="text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-2"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Data Transparency
            </h2>
            <p className="text-[13px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
              IPOCraft aggregates tariff schedules from public exchange filings and broker websites for research comparison purposes.
            </p>
          </div>
        </div>
      </section>

      {/* LEGAL + AFFILIATE DISCLOSURE */}
      <section className="bg-white dark:bg-[#111418] border-t border-gray-200 dark:border-[#252A31]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
          <h2
            className="text-base font-semibold mb-2.5 text-[#0f172a] dark:text-[#F1F5F9]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Disclaimer &amp; Disclosure
          </h2>

          <p className="text-[13px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed max-w-3xl">
            IPOCraft is an informational platform and is not registered with
            SEBI or any financial regulatory authority. This content does not
            constitute investment advice, recommendations, or solicitation.
            Users must conduct independent research and consult qualified
            financial advisors before investing.
          </p>

          <p className="mt-3 text-[12.5px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed max-w-3xl">
            Some links on this page may be referral links. IPOCraft may earn a
            referral commission if users open accounts through partner brokers.
            This does not influence our comparisons or content.
          </p>
        </div>
      </section>
    </main>
  );
}
