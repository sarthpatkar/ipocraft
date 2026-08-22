import type { Metadata } from "next";
import Link from "next/link";
import { Outfit, Inter } from "next/font/google";
import WatchlistFilterWrapper from "@/components/WatchlistFilterWrapper";
import BrokerList from "@/components/BrokerList";
import DataFreshnessBar from "@/components/DataFreshnessBar";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getIpoFeedPage } from "@/lib/ipoFeed";
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

const homeUrl = canonicalUrl("/");

export const metadata: Metadata = {
  title: "IPOCraft — IPO GMP, Subscription & Listing Insights Platform",
  description:
    "Track IPO GMP, subscription status, allotment dates, and listing performance with IPOCraft. Data-driven IPO insights for smarter investing decisions.",
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
    title: "IPOCraft — IPO GMP, Subscription & Listing Insights Platform",
    description:
      "Track IPO GMP, subscription status, allotment dates, and listing performance with IPOCraft in one place.",
    url: homeUrl,
    siteName: "IPOCraft",
    type: "website",
  },
  alternates: {
    canonical: homeUrl,
  },
};

function buildHomeShowMoreHref(params: {
  status?: string;
  search?: string;
  type?: string;
}) {
  const query = new URLSearchParams();
  const status = params.status?.trim();
  const type = params.type?.trim();
  const search = params.search?.trim();

  if (status && status.toLowerCase() !== "all") query.set("status", status);
  if (type && type.toLowerCase() !== "all") query.set("type", type);
  if (search) query.set("q", search);

  const queryString = query.toString();
  return queryString ? `/ipo?${queryString}` : "/ipo";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; type?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const ipoFeed = await getIpoFeedPage({
    supabase,
    limit: 6,
    status: params?.status,
    type: params?.type,
    q: params?.search,
  });

  // Fetch the most recent IPO updated_at for the freshness bar
  const { data: freshRecord } = await supabase
    .from("ipos")
    .select("updated_at")
    .not("updated_at", "is", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const lastUpdatedAt = freshRecord?.updated_at ?? null;

  const showMoreHref = buildHomeShowMoreHref({
    status: params?.status,
    type: params?.type,
    search: params?.search,
  });

  return (
    <div
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased`}
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
            url: homeUrl,
            description:
              "IPOCraft is a research-focused platform providing IPO GMP trends, subscription data, allotment timelines, and listing insights.",
          }),
        }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#e2e8f0] bg-gradient-to-br from-white via-[#f8fafc] to-[#eef2ff]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-14 lg:py-16 animate-fade-in-up">
          <p className="text-sm font-semibold uppercase text-blue-600 mb-3">
            Smart IPO Research Platform
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.6rem] font-semibold leading-tight tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            IPOCraft — IPO GMP, Subscription & Listing Insights
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#475569] max-w-2xl leading-relaxed">
            Track <Link href="/what-is-ipo-gmp" className="text-[#2563eb] hover:underline font-medium">Grey Market Premium (GMP)</Link>, subscription demand, and allotment timelines. 
            Data-driven research for Mainboard and SME IPOs.
          </p>

          {/* TRUST BADGES */}
          {/* TRUST BADGES - Horizontally Scrollable on Mobile to Save Space */}
          <div className="flex gap-3 mt-6 text-[11px] sm:text-xs overflow-x-auto whitespace-nowrap pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm shrink-0">
              SEBI Filings Referenced
            </span>
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm shrink-0">
              Structured IPO Data
            </span>
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm shrink-0">
              Research‑Focused Platform
            </span>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 mt-7">
            <Link
              href="/ipo"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#1e3a8a] to-[#4338ca] hover:from-[#1a327a] hover:to-[#3730a3] text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Explore IPOs
            </Link>

            <Link
              href="/gmp"
              className="inline-flex items-center justify-center border border-[#cbd5e1] hover:border-[#94a3b8] bg-white text-[#0f172a] text-sm font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
            >
              View GMP Tracker
            </Link>
          </div>
        </div>
      </section>

      {/* ── Data Freshness Bar ── */}
      <DataFreshnessBar lastUpdatedAt={lastUpdatedAt} syncIntervalMinutes={30} />

      <section className="bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-12 pb-12 sm:pb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2
                className="text-[1.5rem] sm:text-[1.75rem] font-semibold leading-[1.2] text-[#0f172a]"
                style={{ fontFamily: "var(--font-outfit)" }}
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
            <div className="relative w-full max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="homeSearchInput"
                type="search"
                name="search"
                defaultValue={params?.search || ""}
                placeholder="Search IPO by company name..."
                className="w-full border border-gray-200 bg-white rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm transition-all"
              />
            </div>
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
          <div className="flex overflow-x-auto whitespace-nowrap gap-2 mb-6 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* IPO Type Filters */}
            <Link
              href="/?type=mainboard"
              className="px-4 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
            >
              Mainboard
            </Link>

            <Link
              href="/?type=sme"
              className="px-4 py-1.5 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
            >
              SME
            </Link>

            {/* Status Filters */}
            <Link
              href="/?status=open"
              className="px-4 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
            >
              Open
            </Link>

            <Link
              href="/?status=upcoming"
              className="px-4 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
            >
              Upcoming
            </Link>

            <Link
              href="/?status=closed"
              className="px-4 py-1.5 text-xs font-medium bg-slate-600 hover:bg-slate-700 text-white rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
            >
              Closed
            </Link>

            <Link
              href="/"
              className="px-4 py-1.5 text-xs font-medium bg-slate-900 hover:bg-black text-white rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
            >
              All
            </Link>
          </div>
          {/* Ad-Ready Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area (Spans 3 columns on Desktop) */}
            <div className="lg:col-span-3">
              <WatchlistFilterWrapper initialIpos={ipoFeed.items} />
              
              {ipoFeed.hasMore && (
                <div className="mt-8 flex justify-center lg:justify-start">
                  <Link
                    href={showMoreHref}
                    className="inline-flex items-center justify-center rounded-md bg-[#1e3a8a] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1a327a]"
                  >
                    Show More IPOs
                  </Link>
                </div>
              )}
            </div>

            {/* Right Rail (Spans 1 column on Desktop) - Reserved for Ads & Articles */}
            <aside className="hidden lg:block space-y-6">
              <div className="bg-white border border-[#e2e8f0] rounded-lg p-6 min-h-[250px] flex items-center justify-center text-[#94a3b8] text-xs font-medium uppercase tracking-widest bg-gray-50/50">
                Ad Space / Articles
              </div>
              <div className="bg-white border border-[#e2e8f0] rounded-lg p-6 min-h-[300px] flex items-center justify-center text-[#94a3b8] text-xs font-medium uppercase tracking-widest bg-gray-50/50">
                Sticky Ad Space
              </div>
            </aside>
          </div>

          {/* SEO + GEO CONTENT */}
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <Link
              href="/what-is-ipo-gmp"
              className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6 block hover:shadow-md transition"
            >
              <h3
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: "var(--font-outfit)" }}
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
            </Link>

            <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: "var(--font-outfit)" }}
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
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              IPO Research Insights
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              IPOCraft helps users understand IPO timelines, demand indicators,
              and listing expectations through structured data presentation.
              Key elements such as price bands, <Link href="/ipo-subscription-meaning" className="text-[#2563eb] hover:underline font-medium">subscription demand</Link>, and
              <Link href="/ipo-grey-market-guide" className="text-[#2563eb] hover:underline font-medium">GMP interpretation</Link>
              are commonly monitored by investors to interpret market sentiment before listing.
              For investor category allocation mechanics, see our <Link href="/qib-hni-retail-explained" className="text-[#2563eb] hover:underline font-medium">QIB, HNI and Retail IPO guide</Link>.
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
              style={{ fontFamily: "var(--font-outfit)" }}
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
                  Subscription data indicates demand levels across investor categories and may help interpret interest levels in a public offering.
                  Learn more in our detailed guide on <Link href="/ipo-subscription-meaning" className="text-[#2563eb] hover:underline font-medium">IPO subscription meaning</Link>.
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
                style={{ fontFamily: "var(--font-outfit)" }}
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
          </div>
          <div className="mt-4">
            <BrokerList limit={4} />
          </div>
        </div>
      </section>
      <section className="bg-white border-t border-[#e2e8f0] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <h2
            className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Why Trust IPOCraft for Market Research?
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#475569] max-w-4xl leading-relaxed space-y-3">
            <span>IPOCraft provides structured IPO data including </span>
            <Link href="/what-is-ipo-gmp" className="text-[#2563eb] hover:underline font-medium">Grey Market Premium (GMP)</Link>
            <span> trends, </span>
            <Link href="/ipo-subscription-meaning" className="text-[#2563eb] hover:underline font-medium">subscription demand insights</Link>
            <span>, price bands, </span>
            <Link href="/how-ipo-allotment-works" className="text-[#2563eb] hover:underline font-medium">allotment timelines</Link>
            <span>, and listing performance information sourced from publicly available filings and disclosures. Designed for research clarity across Mainboard and SME IPOs in India, our platform helps retail investors track historical performance and anticipate market trends without the noise.</span>
          </p>
        </div>
      </section>
    </div>
  );
}
