import type { Metadata } from "next";
import Link from "next/link";
import BrokerList from "@/components/BrokerList";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Best Stock Brokers in India (Charges Comparison) | IPOCraft",
  description:
    "Compare top stock brokers in India including Zerodha, Groww, Angel One and others. See brokerage charges, account fees, features and choose the best broker for IPO investing.",
  keywords: [
    "best broker india",
    "broker comparison india",
    "ipo brokers india",
    "zerodha vs groww",
    "stock broker charges india",
  ],
  openGraph: {
    title: "Best Stock Brokers in India | IPOCraft",
    description:
      "Compare brokerage charges, fees and IPO features across leading Indian brokers.",
    type: "website",
  },
};

export default async function BrokersPage() {
  return (
    <main
      className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a]`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#e2e8f0] bg-gradient-to-br from-white via-[#f8fafc] to-[#eef2ff]">
        {/* animated gradient blobs */}
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-200 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-14 lg:py-16">
          <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-[#2563eb] mb-3">
            Broker Comparison India
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.4rem] font-semibold leading-tight max-w-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Compare the Best Stock Brokers for IPO Investing
          </h1>

          <p className="mt-4 text-sm sm:text-[15px] text-[#475569] max-w-2xl leading-relaxed">
            Evaluate brokerage charges, account opening fees, platform features,
            and IPO application support across major brokers in India to choose
            the right partner for your investing journey.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mt-6 text-xs">
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              Data from Public Sources
            </span>
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              Research‑Focused Platform
            </span>
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              No Investment Advice
            </span>
          </div>
        </div>
      </section>

      {/* BROKER LIST */}
      <section className="bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
          <BrokerList />

          <p className="mt-6 text-[11.5px] text-[#94a3b8] leading-relaxed">
            Broker charges are indicative and subject to change. Please verify
            details with the respective broker before opening an account.
          </p>
        </div>
      </section>

      {/* INFO SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6">
            <h2
              className="text-lg font-semibold mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              How to Choose a Broker for IPO Investing
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              When selecting a broker, investors typically evaluate account
              opening fees, annual maintenance charges, brokerage structure,
              mobile app usability, IPO application process, and customer
              support quality. Choosing a reliable platform can improve overall
              investing experience.
            </p>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6">
            <h2
              className="text-lg font-semibold mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Data Transparency
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              IPOCraft aggregates broker information from publicly available
              sources including broker websites and regulatory disclosures.
              Users should always confirm the latest charges and policies
              directly with the broker before making decisions.
            </p>
          </div>
        </div>
      </section>

      {/* LEGAL + AFFILIATE DISCLOSURE */}
      <section className="bg-white border-t border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <h2
            className="text-lg font-semibold mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Disclaimer & Disclosure
          </h2>

          <p className="text-[13px] text-[#475569] leading-relaxed max-w-3xl">
            IPOCraft is an informational platform and is not registered with
            SEBI or any financial regulatory authority. This content does not
            constitute investment advice, recommendations, or solicitation.
            Users must conduct independent research and consult qualified
            financial advisors before investing.
          </p>

          <p className="mt-4 text-[12.5px] text-[#64748b] leading-relaxed max-w-3xl">
            Some links on this page may be affiliate links. IPOCraft may earn a
            referral commission if users open accounts through partner brokers.
            This does not influence our comparisons or content.
          </p>

          <div className="mt-6 text-[12px] text-[#94a3b8]">
            IPOCraft is independent and not affiliated with any broker unless
            explicitly stated.
          </div>
        </div>
      </section>
    </main>
  );
}
