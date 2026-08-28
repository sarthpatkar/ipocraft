import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/site-url";

const aboutUrl = canonicalUrl("/about");

export const metadata: Metadata = {
  title:
    "About IPOCraft — IPO GMP, Subscription & IPO Research Platform India",
  description:
    "Learn about IPOCraft, an independent IPO information platform providing IPO GMP trends, subscription data, allotment timelines, and structured IPO insights sourced from publicly available filings.",
  keywords: [
    "IPOCraft",
    "IPO GMP India",
    "IPO calendar India",
    "Grey market premium",
    "SME IPO",
    "Mainboard IPO",
    "IPO subscription data",
    "IPO listing performance",
    "IPO research platform",
  ],
  alternates: {
    canonical: aboutUrl,
  },
  openGraph: {
    title: "About IPOCraft — IPO Research Platform India",
    description:
      "Understand IPOCraft’s mission, data sources, and platform features for tracking IPO GMP and subscription insights.",
    url: aboutUrl,
    siteName: "IPOCraft",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About IPOCraft — IPO Research Platform India",
    description:
      "Learn about IPOCraft, a platform for tracking IPO GMP and subscription insights.",
  },
};



export default function AboutPage() {
  return (
    <div
      className={`min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9] overflow-x-hidden`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* HERO */}
      <section className="bg-white dark:bg-[#111418] border-b border-gray-200 dark:border-[#252A31]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-14">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-2">
            About IPOCraft
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.4rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            IPO Research Platform for Structured Market Insights
          </h1>

          <p className="mt-4 text-sm sm:text-[15px] text-gray-600 dark:text-[#9AA1AA] max-w-2xl leading-relaxed">
            IPOCraft (ipocraft.com) is an Indian IPO tracking platform providing live GMP, subscription data, allotment probability calculators, and listing performance analytics for Mainboard and SME IPOs.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mt-6 text-xs">
            <span className="bg-white dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-gray-700 dark:text-[#9AA1AA] px-3 py-1.5 rounded-md shadow-xs">
              Public Data Sources
            </span>
            <span className="bg-white dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-gray-700 dark:text-[#9AA1AA] px-3 py-1.5 rounded-md shadow-xs">
              Exchange Filings Referenced
            </span>
            <span className="bg-white dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-gray-700 dark:text-[#9AA1AA] px-3 py-1.5 rounded-md shadow-xs">
              Informational Platform
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 space-y-12 animate-fade-in-up">

        {/* ABOUT TEXT */}
        <div className="max-w-3xl space-y-4">
          <p className="text-sm sm:text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-loose">
            IPOCraft is an independent informational platform designed to help users
            monitor Initial Public Offerings (IPOs), Grey Market Premium trends,
            subscription updates, and listing performance across Indian equity markets.
          </p>

          <p className="text-sm sm:text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-loose">
            Our objective is to simplify publicly available financial information and
            present it in a structured format so users can stay informed and conduct
            their own independent research.
          </p>
        </div>

        {/* SEO CONTENT */}
        <div className="max-w-3xl space-y-4">
          <h2
            className="text-xl sm:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            What IPOCraft Provides
          </h2>

          <p className="text-sm sm:text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-loose">
            IPOCraft provides structured IPO data including Grey Market Premium (GMP),
            subscription demand statistics, price bands, IPO sizes, allotment timelines,
            and listing outcomes across Mainboard and SME IPO segments in India.
          </p>

          <p className="text-sm sm:text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-loose">
            The platform aggregates publicly available information from regulatory filings
            and exchange disclosures to help users monitor IPO activity in one place.
            IPOCraft does not provide investment advice or recommendations.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Mission */}
          <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5 sm:p-6 shadow-sm">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Our Mission
            </h3>

            <p className="text-sm text-[#475569] dark:text-[#9AA1AA] leading-loose">
              We aim to improve accessibility and transparency in IPO market data by
              aggregating information from publicly available sources and presenting
              it in a structured, user‑friendly interface for independent research.
            </p>
          </div>

          {/* Data Sources */}
          <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5 sm:p-6 shadow-sm">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Data Sources
            </h3>

            <ul className="text-sm text-[#475569] dark:text-[#9AA1AA] leading-loose space-y-1 list-disc pl-5">
              <li>Stock exchange filings (NSE, BSE)</li>
              <li>Company prospectuses and regulatory documents (DRHP / RHP)</li>
              <li>Registrar announcements and allotment data</li>
              <li>Public market channels for Grey Market Premium tracking</li>
            </ul>
          </div>

        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: "IPO Timeline Tracking",
              desc: "Track open, close, allotment, and listing dates for every active Mainboard and SME IPO in one place.",
            },
            {
              title: "GMP Trend Analysis",
              desc: "Monitor Grey Market Premium movement over time, updated multiple times daily from public market channels.",
            },
            {
              title: "Subscription Insights",
              desc: "View day-wise subscription multiples across QIB, NII, and Retail categories sourced from exchange bid data.",
            },
            {
              title: "Listing Performance",
              desc: "Compare issue price vs. listing price, day-1 gain percentage, and post-listing price trajectory.",
            },
            {
              title: "Mainboard & SME Coverage",
              desc: "Full coverage of both segments — large-cap Mainboard issues and high-growth SME IPOs on NSE Emerge and BSE SME.",
            },
            {
              title: "Research Tools",
              desc: "Allotment probability calculator, listing profit estimator, DRHP analyzer, and side-by-side comparison — all free.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <h4 className="font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-1">{item.title}</h4>
              <p className="text-sm text-[#475569] dark:text-[#9AA1AA]">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* LEGAL */}
        <div className="text-xs text-[#64748b] dark:text-[#9AA1AA] leading-loose bg-[#f1f5f9] dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft is an informational platform and is not registered with any financial regulatory authority. Content is provided for informational
          purposes only and does not constitute investment advice or recommendations.
          Users should verify details with official sources and consult a qualified financial advisor before making investment decisions.
        </div>

      </section>

      {/* GEO + TRUST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5 sm:p-6">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Data Transparency
            </h3>
            <p className="text-sm text-[#475569] dark:text-[#9AA1AA] leading-loose">
              IPOCraft compiles IPO information from publicly available exchange filings,
              registrar announcements, and company prospectuses. Grey Market Premium data is
              sourced from public market channels and is unofficial in nature. Users should verify
              information with official sources before making financial decisions.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5 sm:p-6">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Frequently Asked Questions
            </h3>

            <div className="space-y-3 text-sm text-[#475569] dark:text-[#9AA1AA]">
              <p>
                <strong>Is IPOCraft registered with any regulator?</strong><br />
                No. IPOCraft is an independent informational platform and is not
                registered with any financial regulatory authority.
              </p>

              <p>
                <strong>Does IPOCraft provide investment advice?</strong><br />
                No. All content is for informational and research purposes only. For investment decisions, consult a registered financial advisor.
              </p>

              <p>
                <strong>Where does IPO data come from?</strong><br />
                Data is sourced from publicly available regulatory filings, exchange disclosures, and registrar announcements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
