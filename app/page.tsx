import type { Metadata } from "next";
import Link from "next/link";
import WatchlistFilterWrapper from "@/components/WatchlistFilterWrapper";
import BrokerList from "@/components/BrokerList";
import DataFreshnessBar from "@/components/DataFreshnessBar";
import HypeLeaderboard from "@/components/HypeLeaderboard";
import AnimatedCount from "@/components/AnimatedCount";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getIpoFeedPage } from "@/lib/ipoFeed";
import { canonicalUrl } from "@/lib/site-url";
import { calculateHypeScore } from "@/lib/hypeScore";



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
    languages: {
      en: homeUrl,
      hi: canonicalUrl("/hi"),
      mr: canonicalUrl("/mr"),
      "x-default": homeUrl,
    },
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

  // All data fetches run in parallel
  const [
    ipoFeedResult,
    freshRecordResult,
    openCountResult,
    upcomingCountResult,
    topGmpResult,
  ] = await Promise.all([
    getIpoFeedPage({
      supabase,
      limit: 6,
      status: params?.status,
      type: params?.type,
      q: params?.search,
    }),
    supabase
      .from("ipos")
      .select("updated_at")
      .not("updated_at", "is", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    // Count open IPOs
    supabase
      .from("ipos")
      .select("id", { count: "exact", head: true })
      .lte("open_date", new Date().toISOString().slice(0, 10))
      .gte("close_date", new Date().toISOString().slice(0, 10)),
    // Count upcoming IPOs
    supabase
      .from("ipos")
      .select("id", { count: "exact", head: true })
      .gt("open_date", new Date().toISOString().slice(0, 10)),
    // Active IPOs with GMP to determine highest GMP %
    supabase
      .from("ipos")
      .select("name, slug, gmp, price_max, price_min")
      .not("gmp", "is", null)
      .gt("gmp", 0)
      .gte("close_date", new Date().toISOString().slice(0, 10))
      .limit(20),
  ]);

  // These are secondary stat-tile queries — a failure here shouldn't crash
  // the whole homepage (the main feed above already throws into error.tsx
  // if it fails), but silently showing "0" as if that's real data is
  // misleading, so at minimum log it for visibility.
  if (freshRecordResult.error) console.error("[home] last-updated query failed:", freshRecordResult.error.message);
  if (openCountResult.error) console.error("[home] open-count query failed:", openCountResult.error.message);
  if (upcomingCountResult.error) console.error("[home] upcoming-count query failed:", upcomingCountResult.error.message);
  if (topGmpResult.error) console.error("[home] top-GMP query failed:", topGmpResult.error.message);

  const ipoFeed = ipoFeedResult;
  const lastUpdatedAt = freshRecordResult.data?.updated_at ?? null;
  const openCount = openCountResult.count ?? 0;
  const upcomingCount = upcomingCountResult.count ?? 0;
  const activeGmpIpos = (topGmpResult.data ?? []).filter((ipo) => {
    const price = ipo.price_max ?? ipo.price_min;
    return ipo.gmp != null && price != null && Number(price) > 0;
  });

  const topGmpIpo = activeGmpIpos.sort((a, b) => {
    const priceA = Number(a.price_max ?? a.price_min);
    const priceB = Number(b.price_max ?? b.price_min);
    const pctA = (Number(a.gmp) / priceA) * 100;
    const pctB = (Number(b.gmp) / priceB) * 100;
    return pctB - pctA;
  })[0] ?? null;

  const showMoreHref = buildHomeShowMoreHref({
    status: params?.status,
    type: params?.type,
    search: params?.search,
  });

  // ── Right rail live widgets (computed from feed — no extra query) ─────────
  const feedItems = ipoFeed.items;

  const topHypeItem = [...feedItems]
    .map((ipo) => ({
      ipo,
      score: calculateHypeScore({
        gmp: ipo.gmp != null ? Number(ipo.gmp) : null,
        issuePrice: ipo.price_max != null ? Number(ipo.price_max) : null,
        qibSub: ipo.sub_qib != null ? Number(ipo.sub_qib) : null,
        retailSub: ipo.sub_rii != null ? Number(ipo.sub_rii) : null,
        issueSize: ipo.issue_size != null ? Number(ipo.issue_size) : null,
      }),
    }))
    .filter((x) => x.score != null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0] ?? null;

  const topSubItem = [...feedItems]
    .filter((ipo) => ipo.sub_total != null)
    .sort(
      (a, b) =>
        parseFloat(String(b.sub_total) || "0") -
        parseFloat(String(a.sub_total) || "0")
    )[0] ?? null;

  const closingSoonItem = [...feedItems]
    .filter((ipo) => ipo.close_date != null)
    .sort((a, b) =>
      (a.close_date ?? "").localeCompare(b.close_date ?? "")
    )[0] ?? null;

  return (
    <div
      className={`min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] antialiased`}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Compact Hero Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-[#252A31]">
          <div>
            <p className="text-[11px] font-semibold uppercase text-blue-600 dark:text-blue-400 mb-1 tracking-wider">
              IPO Research &amp; Analytics
            </p>
            <h1
              className="text-xl sm:text-2xl lg:text-[1.85rem] font-semibold leading-tight tracking-tight text-[#0f172a] dark:text-[#F1F5F9]"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              IPOCraft: IPO GMP, Subscription &amp; Timeline Tracker
            </h1>
            <p className="mt-1 text-[13.5px] text-gray-500 dark:text-[#9AA1AA]">
              Track Grey Market Premiums, live bidding multiples, and allotment dates for Mainboard &amp; SME issues.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[12.5px]">
            <Link
              href="/ipo"
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              IPO Directory
            </Link>
            <span className="text-gray-300 dark:text-[#252A31]">|</span>
            <Link
              href="/gmp"
              className="font-medium text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white"
            >
              GMP Tracker
            </Link>
          </div>
        </div>

        {/* ── Market Snapshot KPI Metric Grid (Clean Institutional UX) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {/* Tile 1: Live Open Issues */}
          <Link
            href="/?status=open"
            className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 hover:border-gray-300 dark:hover:border-[#374151] transition-colors shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA]">
                Live Issues
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Open Now
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-[#F1F5F9] tabular-nums">
                <AnimatedCount value={openCount} />
              </span>
              <span className="text-[12.5px] text-gray-500 dark:text-[#9AA1AA]">
                {openCount === 1 ? "issue accepting bids" : "issues accepting bids"}
              </span>
            </div>
          </Link>

          {/* Tile 2: Upcoming Pipeline */}
          <Link
            href="/?status=upcoming"
            className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 hover:border-gray-300 dark:hover:border-[#374151] transition-colors shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA]">
                Pipeline
              </span>
              <span className="text-[11px] font-medium text-gray-500 dark:text-[#9AA1AA]">
                Next 14 Days
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-[#F1F5F9] tabular-nums">
                <AnimatedCount value={upcomingCount} />
              </span>
              <span className="text-[12.5px] text-gray-500 dark:text-[#9AA1AA]">
                {upcomingCount === 1 ? "upcoming issue" : "upcoming issues"}
              </span>
            </div>
          </Link>

          {/* Tile 3: Top Expected GMP */}
          {topGmpIpo?.gmp != null && (topGmpIpo.price_max != null || topGmpIpo.price_min != null) ? (
            <Link
              href={`/ipo/${topGmpIpo.slug}`}
              className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 hover:border-gray-300 dark:hover:border-[#374151] transition-colors shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA]">
                  Top Expected GMP
                </span>
                <span className="text-[11.5px] font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  +{((Number(topGmpIpo.gmp) / Number(topGmpIpo.price_max ?? topGmpIpo.price_min)) * 100).toFixed(1)}% Est.
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-2 min-w-0">
                <span className="text-sm font-semibold text-[#0f172a] dark:text-[#F1F5F9] truncate">
                  {topGmpIpo.name}
                </span>
                <span className="text-[12px] font-medium text-gray-500 dark:text-[#9AA1AA] shrink-0 tabular-nums">
                  GMP ₹{topGmpIpo.gmp}
                </span>
              </div>
            </Link>
          ) : (
            <Link
              href="/gmp"
              className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 hover:border-gray-300 dark:hover:border-[#374151] transition-colors shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA]">
                  GMP Tracker
                </span>
                <span className="text-[11px] font-medium text-gray-500 dark:text-[#9AA1AA]">
                  Live Rates
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-sm font-semibold text-[#0f172a] dark:text-[#F1F5F9]">
                  View all active premiums
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* ── Compare Quick-Launcher Strip ── */}
        {(() => {
          const openIpos = ipoFeed.items.filter((i) => i.status?.toLowerCase() === "open" || i.status?.toLowerCase() === "upcoming");
          if (openIpos.length >= 2) {
            const ipoA = openIpos[0];
            const ipoB = openIpos[1];
            return (
              <div className="bg-[#1C317A]/5 dark:bg-[#151E2E] border border-[#1C317A]/15 dark:border-[#3D5BA9]/30 rounded-lg p-3 sm:p-3.5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#1C317A] text-white text-[11px] font-bold shrink-0">
                    VS
                  </span>
                  <div className="text-[13px] text-[#0f172a] dark:text-[#F1F5F9] truncate">
                    <span className="font-semibold">{ipoA.name}</span>
                    <span className="text-gray-400 dark:text-[#64748B] mx-1.5">vs</span>
                    <span className="font-semibold">{ipoB.name}</span>
                  </div>
                </div>
                <Link
                  href={`/compare?ipos=${ipoA.slug},${ipoB.slug}`}
                  className="inline-flex items-center justify-center px-3.5 py-1.5 bg-[#1C317A] hover:bg-[#28439E] text-white text-[12px] font-semibold rounded-md transition-colors shrink-0 shadow-xs"
                >
                  Compare Metrics
                </Link>
              </div>
            );
          }
          return null;
        })()}

        {/* -- Data Freshness Bar -- */}
        <DataFreshnessBar lastUpdatedAt={lastUpdatedAt} syncIntervalMinutes={30} />

        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <h2
                className="text-[1.35rem] sm:text-[1.5rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F3F5]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Latest IPO Listings
              </h2>
              <p
                className="mt-1 text-[13px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed max-w-2xl"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Track offer dates, price bands, lot sizes, subscription trends, and GMP snapshots.
              </p>
            </div>
            <Link
              href="/ipo"
              className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-[12.5px] font-semibold px-3.5 py-1.5 rounded-md border border-gray-900 dark:border-white transition-colors shrink-0 shadow-xs"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              View All IPOs
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
                <svg className="w-4 h-4 text-gray-400 dark:text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="homeSearchInput"
                type="search"
                name="search"
                defaultValue={params?.search || ""}
                placeholder="Search IPO by company name…"
                className="w-full border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#171B20] text-gray-900 dark:text-[#F1F3F5] placeholder-gray-400 dark:placeholder-[#6B7280] rounded-md pl-9 pr-3.5 py-2 text-[13px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-1 dark:focus:ring-white shadow-xs transition-colors"
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
              className="px-3 py-1.5 text-[12px] font-medium bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-gray-400 dark:hover:border-gray-500 rounded-md transition-colors"
            >
              Mainboard
            </Link>

            <Link
              href="/?type=sme"
              className="px-3 py-1.5 text-[12px] font-medium bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-gray-400 dark:hover:border-gray-500 rounded-md transition-colors"
            >
              SME
            </Link>

            <span className="hidden sm:inline-block w-px h-4 bg-gray-200 dark:bg-[#252A31] mx-1 self-center" />

            {/* Status Filters */}
            <Link
              href="/?status=open"
              className="px-3 py-1.5 text-[12px] font-medium bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-emerald-500/50 rounded-md transition-colors"
            >
              Open
            </Link>

            <Link
              href="/?status=upcoming"
              className="px-3 py-1.5 text-[12px] font-medium bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-blue-500/50 rounded-md transition-colors"
            >
              Upcoming
            </Link>

            <Link
              href="/?status=closed"
              className="px-3 py-1.5 text-[12px] font-medium bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-rose-500/50 rounded-md transition-colors"
            >
              Closed
            </Link>

            <Link
              href="/"
              className="px-3 py-1.5 text-[12px] font-medium bg-gray-900 dark:bg-white text-white dark:text-black border border-gray-900 dark:border-white rounded-md transition-colors font-semibold shadow-xs"
            >
              All
            </Link>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <HypeLeaderboard ipos={ipoFeed.items} />
              <WatchlistFilterWrapper initialIpos={ipoFeed.items} />
              
              {ipoFeed.hasMore && (
                <div className="mt-6 flex justify-center lg:justify-start">
                  <Link
                    href={showMoreHref}
                    className="inline-flex items-center justify-center rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 border border-gray-900 dark:border-white px-5 py-2 text-[13px] font-semibold text-white dark:text-black transition-colors shadow-xs"
                  >
                    Show More IPOs
                  </Link>
                </div>
              )}
            </div>

            {/* Right Rail - Live Widgets */}
            <aside className="hidden lg:block space-y-3">

              {/* Widget: Highest Hype Score */}
              {topHypeItem && (
                <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#9AA1AA] mb-2.5">Highest Hype Score</p>
                  <Link href={`/ipo/${topHypeItem.ipo.slug}`} className="group block">
                    <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2">
                      {topHypeItem.ipo.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-[#252A31] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${topHypeItem.score}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {topHypeItem.score}/100
                      </span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Widget: Most Subscribed */}
              {topSubItem && (
                <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#9AA1AA] mb-2.5">Most Subscribed</p>
                  <Link href={`/ipo/${topSubItem.slug}`} className="group block">
                    <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {topSubItem.name}
                    </p>
                    <p className="text-[22px] font-bold text-[#1C317A] dark:text-[#F1F3F5] tabular-nums mt-1">
                      {parseFloat(String(topSubItem.sub_total)).toFixed(1)}×
                    </p>
                    <p className="text-[11px] text-[#64748B] dark:text-[#9AA1AA]">Total subscription</p>
                  </Link>
                </div>
              )}

              {/* Widget: Closes Soon */}
              {closingSoonItem && (
                <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#9AA1AA] mb-2.5">Closes Soonest</p>
                  <Link href={`/ipo/${closingSoonItem.slug}`} className="group block">
                    <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {closingSoonItem.name}
                    </p>
                    <p className="text-[12px] text-[#475569] dark:text-[#9AA1AA] mt-1">
                      Closes{" "}
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        {closingSoonItem.close_date}
                      </span>
                    </p>
                  </Link>
                </div>
              )}

              {/* Static: Education links */}
              <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#9AA1AA] mb-3">Research Guides</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/what-is-ipo-gmp" className="text-[12.5px] text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      What is IPO GMP
                    </Link>
                  </li>
                  <li>
                    <Link href="/how-ipo-allotment-works" className="text-[12.5px] text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      How Allotment Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/qib-hni-retail-explained" className="text-[12.5px] text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      QIB vs HNI vs Retail
                    </Link>
                  </li>
                </ul>
              </div>

            </aside>
          </div>

          {/* ── 4-Card Utility Strip: Tools for IPO Bidders ── */}
          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-[#252A31]">
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase text-blue-600 dark:text-blue-400 tracking-wider mb-1">
                Decision Tools
              </p>
              <h2
                className="text-[1.25rem] sm:text-[1.4rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Tools for IPO Bidders
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Card 1: Allotment Odds Calculator */}
              <Link
                href="/ipo-allotment-probability-calculator"
                className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] hover:border-gray-400 dark:hover:border-gray-600 rounded-xl p-4 flex flex-col justify-between transition-colors shadow-xs group"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Allotment Odds Calculator
                  </h4>
                  <p className="text-[12px] text-gray-500 dark:text-[#9AA1AA] mt-1 leading-relaxed">
                    Input subscription numbers to see your estimated retail and NII allotment probability.
                  </p>
                </div>
                <span className="text-[12px] font-semibold text-blue-600 dark:text-blue-400 mt-3 inline-flex items-center">
                  Calculate Odds
                </span>
              </Link>

              {/* Card 2: Expected Profit Estimator */}
              <Link
                href="/ipo-profit-calculator"
                className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] hover:border-gray-400 dark:hover:border-gray-600 rounded-xl p-4 flex flex-col justify-between transition-colors shadow-xs group"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Listing Profit Estimator
                  </h4>
                  <p className="text-[12px] text-gray-500 dark:text-[#9AA1AA] mt-1 leading-relaxed">
                    Calculate estimated net gain per lot based on price band and live Grey Market Premiums.
                  </p>
                </div>
                <span className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 mt-3 inline-flex items-center">
                  Estimate Profit
                </span>
              </Link>

              {/* Card 3: Side-by-Side Comparison */}
              <Link
                href="/compare"
                className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] hover:border-gray-400 dark:hover:border-gray-600 rounded-xl p-4 flex flex-col justify-between transition-colors shadow-xs group"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <h4 className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Compare Active IPOs
                  </h4>
                  <p className="text-[12px] text-gray-500 dark:text-[#9AA1AA] mt-1 leading-relaxed">
                    Compare price bands, lot sizes, subscription demand, and timelines across up to 3 issues.
                  </p>
                </div>
                <span className="text-[12px] font-semibold text-amber-600 dark:text-amber-400 mt-3 inline-flex items-center">
                  Open Comparison
                </span>
              </Link>
            </div>
          </div>

          {/* ── Daily Morning GMP Alert Digest Card ── */}
          <div className="mt-6 bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="max-w-xl">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                Morning Market Brief
              </span>
              <h4
                className="text-[1.1rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Daily IPO &amp; GMP Updates at 8:30 AM
              </h4>
              <p className="text-[13px] text-gray-500 dark:text-[#9AA1AA] mt-1">
                Receive the morning grey market digest and subscription closing notifications via email or Telegram.
              </p>
            </div>
            <Link
              href="/alerts"
              className="inline-flex items-center justify-center px-4 py-2 bg-[#1C317A] hover:bg-[#28439E] text-white text-[13px] font-semibold rounded-lg transition-colors shrink-0 shadow-xs"
            >
              Subscribe to Alerts
            </Link>
          </div>

          {/* Guides */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Link
              href="/what-is-ipo-gmp"
              className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] hover:border-gray-400 dark:hover:border-gray-500 rounded-lg p-5 block transition-colors"
            >
              <h3
                className="text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] mb-2"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                What is IPO GMP?
              </h3>
              <p className="text-[13px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
                Grey Market Premium (GMP) represents unofficial price indications observed prior to listing. IPOCraft provides GMP data strictly for structured market research.
              </p>
            </Link>

            <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-5">
              <h3
                className="text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] mb-2"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Data Transparency
              </h3>
              <p className="text-[13px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
                IPOCraft aggregates offer information from public filings and official disclosures. Always verify details with official offer documents submitted to SEBI and stock exchanges.
              </p>
            </div>
          </div>

          {/* LEGAL DISCLAIMER */}
          <div className="mt-6 text-[12px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed bg-[#f1f5f9] dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
            IPOCraft is a financial data and research platform and is not registered with SEBI as an investment advisor. Content is provided strictly for educational purposes and does not constitute investment advice.
          </div>
        </div>

        {/* Top Brokers */}
        <div className="border-t border-[#e2e8f0] dark:border-[#252A31] pt-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <h2
                className="text-[1.35rem] sm:text-[1.5rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Top Brokers
              </h2>
              <p
                className="mt-1 text-[13px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Compare core broker charges and quickly access verified account opening links.
              </p>
            </div>
            <Link
              href="/brokers"
              className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-[12.5px] font-semibold px-3.5 py-1.5 rounded-md border border-gray-900 dark:border-white transition-colors shrink-0 shadow-xs"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              View All Brokers
            </Link>
          </div>
          <div>
            <BrokerList limit={4} />
          </div>
        </div>
      </main>
    </div>
  );
}
