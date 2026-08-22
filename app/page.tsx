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
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-[#0f172a] dark:text-slate-100 antialiased`}
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
      <section className="border-b border-[#e2e8f0] dark:border-[#22304A] bg-white dark:bg-[#0D1525]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-[10.5px] font-semibold uppercase text-blue-600 dark:text-[#3B82F6] mb-2 tracking-wide">
            IPO Research &amp; Analytics Platform
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.25rem] font-semibold leading-tight tracking-tight text-[#0f172a] dark:text-[#F1F5F9]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            IPOCraft — IPO GMP, Subscription &amp; Timeline Tracker
          </h1>

          <p className="mt-2 text-sm sm:text-[14.5px] text-[#475569] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
            Track <Link href="/what-is-ipo-gmp" className="text-[#2563eb] dark:text-[#3B82F6] hover:underline font-medium">Grey Market Premium (GMP)</Link>, subscription demand multiples, and allotment dates for Mainboard &amp; SME IPOs.
          </p>

          {/* TRUST BADGES */}
          <div className="flex gap-2 mt-4 text-[11px] overflow-x-auto whitespace-nowrap pb-1">
            <span className="bg-[#f1f5f9] dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] text-[#475569] dark:text-[#94A3B8] px-2.5 py-1 rounded-md shrink-0">
              Exchange Filings Referenced
            </span>
            <span className="bg-[#f1f5f9] dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] text-[#475569] dark:text-[#94A3B8] px-2.5 py-1 rounded-md shrink-0">
              Normalized IPO Data
            </span>
            <span className="bg-[#f1f5f9] dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] text-[#475569] dark:text-[#94A3B8] px-2.5 py-1 rounded-md shrink-0">
              Research Platform
            </span>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-2.5 mt-5">
            <Link
              href="/ipo"
              className="inline-flex items-center justify-center bg-[#1e3a8a] dark:bg-[#3B82F6] hover:bg-[#1a327a] dark:hover:bg-[#2563EB] text-white text-[13px] font-semibold px-4.5 py-2 rounded-lg shadow-xs transition-colors"
            >
              Explore IPOs
            </Link>

            <Link
              href="/gmp"
              className="inline-flex items-center justify-center border border-[#cbd5e1] dark:border-[#22304A] hover:border-[#94a3b8] dark:hover:border-[#3B82F6]/50 bg-white dark:bg-[#162238] text-[#0f172a] dark:text-[#F1F5F9] text-[13px] font-semibold px-4.5 py-2 rounded-lg transition-colors"
            >
              View GMP Tracker
            </Link>
          </div>
        </div>
      </section>

      {/* ── Data Freshness Bar ── */}
      <DataFreshnessBar lastUpdatedAt={lastUpdatedAt} syncIntervalMinutes={30} />

      <section className="bg-[#f8fafc] dark:bg-[#080D18] border-b border-[#e2e8f0] dark:border-[#22304A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <h2
                className="text-[1.35rem] sm:text-[1.5rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Latest IPO Listings
              </h2>
              <p
                className="mt-1 text-[13px] text-[#64748b] dark:text-[#94A3B8] leading-relaxed max-w-2xl"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Track offer dates, price bands, lot sizes, subscription trends, and GMP snapshots.
              </p>
            </div>
            <Link
              href="/ipo"
              className="inline-flex items-center justify-center gap-1.5 bg-[#1e3a8a] dark:bg-[#3B82F6] hover:bg-[#1a327a] dark:hover:bg-[#2563EB] text-white text-[12.5px] font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              View All IPOs →
            </Link>
          </div>
          {/* Instant Search Bar */}
          <form
            id="homeSearchForm"
            action="/"
            method="get"
            className="flex flex-col sm:flex-row gap-3 mb-4 w-full"
          >
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400 dark:text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="homeSearchInput"
                type="search"
                name="search"
                defaultValue={params?.search || ""}
                placeholder="Search IPO by company name…"
                className="w-full border border-gray-200 dark:border-[#22304A] bg-white dark:bg-[#162238] text-gray-900 dark:text-[#F1F5F9] placeholder-gray-400 dark:placeholder-[#64748B] rounded-lg pl-9 pr-3.5 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] shadow-xs transition-colors"
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
          <div className="flex overflow-x-auto whitespace-nowrap gap-1.5 mb-6 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* IPO Type Filters */}
            <Link
              href="/?type=mainboard"
              className="px-3 py-1.5 text-[12px] font-medium bg-white dark:bg-[#162238] text-gray-700 dark:text-[#94A3B8] border border-gray-200 dark:border-[#22304A] hover:border-[#3B82F6]/50 rounded-lg transition-colors"
            >
              Mainboard
            </Link>

            <Link
              href="/?type=sme"
              className="px-3 py-1.5 text-[12px] font-medium bg-white dark:bg-[#162238] text-gray-700 dark:text-[#94A3B8] border border-gray-200 dark:border-[#22304A] hover:border-[#8B5CF6]/50 rounded-lg transition-colors"
            >
              SME
            </Link>

            <span className="hidden sm:inline-block w-px h-4 bg-gray-200 dark:bg-[#22304A] mx-1 self-center" />

            {/* Status Filters */}
            <Link
              href="/?status=open"
              className="px-3 py-1.5 text-[12px] font-medium bg-white dark:bg-[#162238] text-gray-700 dark:text-[#94A3B8] border border-gray-200 dark:border-[#22304A] hover:border-emerald-500/50 rounded-lg transition-colors"
            >
              Open
            </Link>

            <Link
              href="/?status=upcoming"
              className="px-3 py-1.5 text-[12px] font-medium bg-white dark:bg-[#162238] text-gray-700 dark:text-[#94A3B8] border border-gray-200 dark:border-[#22304A] hover:border-blue-500/50 rounded-lg transition-colors"
            >
              Upcoming
            </Link>

            <Link
              href="/?status=closed"
              className="px-3 py-1.5 text-[12px] font-medium bg-white dark:bg-[#162238] text-gray-700 dark:text-[#94A3B8] border border-gray-200 dark:border-[#22304A] hover:border-rose-500/50 rounded-lg transition-colors"
            >
              Closed
            </Link>

            <Link
              href="/"
              className="px-3 py-1.5 text-[12px] font-medium bg-[#1e3a8a] dark:bg-[#3B82F6] text-white rounded-lg transition-colors font-semibold"
            >
              All
            </Link>
          </div>

          {/* Ad-Ready Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <WatchlistFilterWrapper initialIpos={ipoFeed.items} />
              
              {ipoFeed.hasMore && (
                <div className="mt-6 flex justify-center lg:justify-start">
                  <Link
                    href={showMoreHref}
                    className="inline-flex items-center justify-center rounded-lg bg-[#1e3a8a] dark:bg-[#3B82F6] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#1a327a] dark:hover:bg-[#2563EB]"
                  >
                    Show More IPOs
                  </Link>
                </div>
              )}
            </div>

            {/* Right Rail */}
            <aside className="hidden lg:block space-y-4">
              <div className="bg-white dark:bg-[#0D1525] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 min-h-[220px] flex flex-col items-center justify-center text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-1.5">Market Education</p>
                <p className="text-[13px] text-[#0f172a] dark:text-[#F1F5F9] font-medium mb-3">Understanding Grey Market Trends &amp; Valuations</p>
                <Link href="/what-is-ipo-gmp" className="text-[12px] text-[#2563eb] dark:text-[#3B82F6] hover:underline font-semibold">
                  Read GMP Guide →
                </Link>
              </div>
              <div className="bg-white dark:bg-[#0D1525] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 min-h-[220px] flex flex-col items-center justify-center text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-1.5">Allotment Insights</p>
                <p className="text-[13px] text-[#0f172a] dark:text-[#F1F5F9] font-medium mb-3">How Allotment Odds &amp; Registrar Timelines Work</p>
                <Link href="/how-ipo-allotment-works" className="text-[12px] text-[#2563eb] dark:text-[#3B82F6] hover:underline font-semibold">
                  View Allotment Guide →
                </Link>
              </div>
            </aside>
          </div>

          {/* SEO Guides */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Link
              href="/what-is-ipo-gmp"
              className="bg-white dark:bg-[#11182D] border border-[#e2e8f0] dark:border-[#22304A] hover:border-[#3B82F6]/50 rounded-xl p-5 block transition-colors"
            >
              <h3
                className="text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-2"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                What is IPO GMP?
              </h3>
              <p className="text-[13px] text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Grey Market Premium (GMP) represents unofficial price indications observed prior to listing. IPOCraft provides GMP data strictly for structured market research.
              </p>
            </Link>

            <div className="bg-white dark:bg-[#11182D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5">
              <h3
                className="text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-2"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Data Transparency
              </h3>
              <p className="text-[13px] text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                IPOCraft aggregates offer information from public filings and official disclosures. Always verify details with official offer documents submitted to SEBI and stock exchanges.
              </p>
            </div>
          </div>

          {/* LEGAL DISCLAIMER */}
          <div className="mt-6 text-[12px] text-[#64748b] dark:text-[#94A3B8] leading-relaxed bg-[#f1f5f9] dark:bg-[#0D1525] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-4">
            IPOCraft is a financial data and research platform and is not registered with SEBI as an investment advisor. Content is provided strictly for educational purposes and does not constitute investment advice.
          </div>
        </div>
      </section>

      {/* Top Brokers */}
      <section className="bg-white dark:bg-[#0D1525] border-b border-[#e2e8f0] dark:border-[#22304A] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <h2
                className="text-[1.35rem] sm:text-[1.5rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Top Brokers
              </h2>
              <p
                className="mt-1 text-[13px] text-[#64748b] dark:text-[#94A3B8] leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Compare core broker charges and quickly access verified account opening links.
              </p>
            </div>
          </div>
          <div>
            <BrokerList limit={4} />
          </div>
        </div>
      </section>

    </div>
  );
}
