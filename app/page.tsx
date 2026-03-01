import type { Metadata } from "next";
import Link from "next/link";
import { Playfair_Display, Inter } from "next/font/google";
import IpoList from "@/components/IpoList";
import BrokerList from "@/components/BrokerList";

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
  title: "IPOCraft | Smart IPO Research Platform",
  description:
    "IPOCraft provides structured IPO data, Grey Market Premium (GMP) trends, subscription insights, allotment timelines, listing performance, and broker comparisons for research purposes.",
  keywords: [
    "IPO GMP",
    "IPO subscription",
    "IPO allotment status",
    "IPO listing gain",
    "SME IPO",
    "Mainboard IPO",
    "IPO calendar",
    "Grey Market Premium",
    "IPO research",
  ],
  openGraph: {
    title: "IPOCraft | Smart IPO Research Platform",
    description:
      "Structured IPO data, GMP trends, subscription insights, allotment timelines, and listing information in one place.",
    url: "https://ipocraft.com",
    siteName: "IPOCraft",
    type: "website",
  },
  alternates: {
    canonical: "https://ipocraft.com",
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; type?: string }>;
}) {
  const params = await searchParams;
  return (
    <div
      className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Structured Data for SEO & GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "IPOCraft",
            url: "https://ipocraft.com",
            description:
              "IPOCraft is a research-focused platform providing IPO GMP trends, subscription data, allotment timelines, and listing insights.",
          }),
        }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#e2e8f0] bg-gradient-to-br from-white via-[#f8fafc] to-[#eef2ff]">
        <div className="absolute inset-0 opacity-[0.35] pointer-events-none">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-200 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-14 lg:py-16">
          <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-[#2563eb] mb-3">
            Smart IPO Research Platform
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.6rem] font-semibold leading-tight tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            IPOCraft — IPO GMP, Subscription & Listing Insights
          </h1>

          <p className="mt-4 text-sm sm:text-[15px] text-[#475569] max-w-3xl leading-relaxed">
            IPOCraft provides structured IPO data including Grey Market Premium (GMP)
            trends, subscription demand insights, price bands, allotment timelines,
            and listing performance information sourced from publicly available
            filings and disclosures. Designed for research clarity across Mainboard
            and SME IPOs in India.
          </p>

          {/* TRUST BADGES */}
          <div className="flex flex-wrap gap-3 mt-6 text-xs">
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              SEBI Filings Referenced
            </span>
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              Structured IPO Data
            </span>
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              Research‑Focused Platform
            </span>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 mt-7">
            <Link
              href="/ipo"
              className="inline-flex items-center justify-center bg-[#1e3a8a] hover:bg-[#1a327a] text-white text-sm font-semibold px-5 py-2 rounded-md transition"
            >
              Explore IPOs
            </Link>

            <Link
              href="/gmp"
              className="inline-flex items-center justify-center border border-[#cbd5e1] hover:border-[#94a3b8] text-[#0f172a] text-sm font-semibold px-5 py-2 rounded-md transition"
            >
              View GMP Tracker
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-12 pb-12 sm:pb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2
                className="text-[1.5rem] sm:text-[1.75rem] font-semibold leading-[1.2] text-[#0f172a]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Latest IPO Listings
              </h2>
              <p
                className="mt-2 text-[13.5px] text-[#64748b] leading-[1.75] max-w-2xl"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Track offer dates, price bands, lot sizes, subscription trends,
                and GMP snapshots.
              </p>
            </div>
            <Link
              href="/ipo"
              className="inline-flex items-center justify-center gap-2 bg-[#1e3a8a] hover:bg-[#1a327a] text-white text-[13px] font-semibold px-5 py-[0.62rem] rounded-[4px] transition-colors duration-150"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              View All IPOs
            </Link>
          </div>
          {/* Instant Search Bar (auto submit) */}
          <form
            id="homeSearchForm"
            action="/"
            method="get"
            className="flex flex-col sm:flex-row gap-3 mb-6 w-full"
          >
            <input
              id="homeSearchInput"
              type="search"
              name="search"
              defaultValue={params?.search || ""}
              placeholder="Search IPO by company name..."
              className="flex-1 border border-[#cbd5e1] rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          {/* Auto-submit script with debounce */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const input = document.getElementById('homeSearchInput');
                  const form = document.getElementById('homeSearchForm');
                  if (!input || !form) return;

                  let timer;
                  input.addEventListener('input', function () {
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                      form.submit();
                    }, 400);
                  });
                })();
              `,
            }}
          />
          <div className="flex flex-wrap gap-2 mb-6">

            {/* IPO Type Filters */}
            <Link
              href="/?type=mainboard"
              className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded"
            >
              Mainboard
            </Link>

            <Link
              href="/?type=sme"
              className="px-3 py-1.5 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded"
            >
              SME
            </Link>

            {/* Status Filters */}
            <Link
              href="/?status=open"
              className="px-3 py-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Open
            </Link>

            <Link
              href="/?status=upcoming"
              className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Upcoming
            </Link>

            <Link
              href="/?status=closed"
              className="px-3 py-1.5 text-xs font-medium bg-gray-600 hover:bg-gray-700 text-white rounded"
            >
              Closed
            </Link>

            <Link
              href="/"
              className="px-3 py-1.5 text-xs font-medium bg-black hover:bg-gray-900 text-white rounded"
            >
              All
            </Link>
          </div>
          <IpoList
            status={params?.status}
            search={params?.search}
            type={params?.type}
          />

          {/* SEO + GEO CONTENT */}
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                What is IPO GMP?
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Grey Market Premium (GMP) represents unofficial price indications
                observed before IPO listing. It is widely used by market
                participants to estimate potential listing sentiment, although it
                is not an official metric. IPOCraft presents GMP data strictly for
                informational and research purposes.
              </p>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Data Transparency
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                IPOCraft aggregates IPO information from publicly available
                sources including exchange filings, company disclosures, and
                registrar announcements. Users should verify information from
                official documents before making financial decisions.
              </p>
            </div>
          </div>

          {/* Additional SEO Content */}
          <div className="mt-6 bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6">
            <h3
              className="text-lg font-semibold mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              IPO Research Insights
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              IPOCraft helps users understand IPO timelines, demand indicators,
              and listing expectations through structured data presentation.
              Key elements such as price bands, subscription demand, and GMP
              movements are commonly monitored by investors to interpret market
              sentiment before listing. This platform is designed to improve
              clarity and accessibility of publicly available IPO information.
            </p>
          </div>

          {/* LEGAL DISCLAIMER */}
          <div className="mt-6 text-xs text-[#64748b] leading-relaxed bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg p-4">
            IPOCraft is an informational platform and is not registered with SEBI
            or any financial regulatory authority. This content does not
            constitute investment advice, recommendations, or solicitation.
            Investors should conduct independent research and consult qualified
            financial advisors before investing.
          </div>

          {/* FAQ for GEO */}
          <div className="mt-8 bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Frequently Asked Questions
            </h3>

            <div className="space-y-4 text-sm text-[#475569]">
              <div>
                <strong>What is IPO GMP?</strong>
                <p>
                  IPO GMP refers to unofficial price indications observed before
                  listing. It is not an official metric and should be used only
                  for informational research purposes.
                </p>
              </div>

              <div>
                <strong>How is IPO subscription data used?</strong>
                <p>
                  Subscription data indicates demand levels across investor
                  categories and may help interpret interest levels in a public
                  offering.
                </p>
              </div>

              <div>
                <strong>Is IPOCraft a financial advisor?</strong>
                <p>
                  No. IPOCraft is an informational platform providing structured
                  data derived from publicly available sources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-12 pb-12 sm:pb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2
                className="text-[1.5rem] sm:text-[1.75rem] font-semibold leading-[1.2] text-[#0f172a]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Top Brokers
              </h2>
              <p
                className="mt-2 text-[13.5px] text-[#64748b] leading-[1.75] max-w-2xl"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Compare core broker charges and quickly access broker account
                links.
              </p>
            </div>
            <Link
              href="/brokers"
              className="inline-flex items-center justify-center gap-2 bg-[#1e3a8a] hover:bg-[#1a327a] text-white text-[13px] font-semibold px-5 py-[0.62rem] rounded-[4px] transition-colors duration-150"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              View All Brokers
            </Link>
          </div>
          <BrokerList limit={4} />
        </div>
      </section>
    </div>
  );
}
