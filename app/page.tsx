import type { Metadata } from "next";
import Link from "next/link";
import { Outfit, Inter } from "next/font/google";
import WatchlistFilterWrapper from "@/components/WatchlistFilterWrapper";
import BrokerList from "@/components/BrokerList";
import DataFreshnessBar from "@/components/DataFreshnessBar";
import HypeLeaderboard from "@/components/HypeLeaderboard";
import AnimatedCount from "@/components/AnimatedCount";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getIpoFeedPage } from "@/lib/ipoFeed";
import { canonicalUrl } from "@/lib/site-url";
import { calculateHypeScore } from "@/lib/hypeScore";

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

// ── Stat pill helper (server-rendered) ──────────────────────────────────────
type PillColor = "emerald" | "blue" | "slate" | "amber";
function StatPill({
  color,
  label,
  href,
  animated,
  count,
}: {
  color: PillColor;
  label: string;
  href?: string;
  animated?: boolean;
  count?: number;
}) {
  const colorMap: Record<PillColor, string> = {
    emerald:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    blue: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
    slate:
      "bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800/60",
    amber:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
  };
  const cls = `inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
    colorMap[color]
  } shrink-0`;
  const dot = (
    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />
  );

  // Extract suffix (text after the number) for animated pills
  const suffix = animated && count != null ? label.replace(String(count), "") : null;
  const content = animated && count != null
    ? <>{dot}<AnimatedCount value={count} />{suffix}</>
    : <>{dot}{label}</>;

  if (href)
    return (
      <Link href={href} className={`${cls} hover:opacity-80`}>
        {content}
      </Link>
    );
  return (
    <span className={cls}>
      {content}
    </span>
  );
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
            IPOCraft: IPO GMP, Subscription &amp; Timeline Tracker
          </h1>

          <p className="mt-2 text-sm sm:text-[14.5px] text-[#475569] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
            Track <Link href="/what-is-ipo-gmp" className="text-[#2563eb] dark:text-[#3B82F6] hover:underline font-medium">Grey Market Premium (GMP)</Link>, subscription demand multiples, and allotment dates for Mainboard &amp; SME IPOs.
          </p>

          {/* LIVE STATS ROW */}
          <div className="flex flex-wrap gap-2 mt-4">
            <StatPill color="emerald" label={`${openCount} Open`} href="/?status=open" animated count={openCount} />
            <StatPill color="blue" label={`${upcomingCount} Upcoming`} href="/?status=upcoming" animated count={upcomingCount} />
            {topGmpIpo?.gmp != null && (topGmpIpo.price_max != null || topGmpIpo.price_min != null) && (
              <StatPill
                color="blue"
                label={`Top GMP: ${topGmpIpo.name} ₹${topGmpIpo.gmp} (+${((Number(topGmpIpo.gmp) / Number(topGmpIpo.price_max ?? topGmpIpo.price_min)) * 100).toFixed(1)}%)`}
                href={`/ipo/${topGmpIpo.slug}`}
              />
            )}
            <StatPill color="amber" label="Exchange Filings Referenced" />
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
              {/* Hype Score Leaderboard — IPOCraft's key differentiator */}
              <HypeLeaderboard ipos={ipoFeed.items} />
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

            {/* Right Rail — Live Widgets */}
            <aside className="hidden lg:block space-y-3">

              {/* Widget: Highest Hype Score */}
              {topHypeItem && (
                <div className="bg-white dark:bg-[#0D1525] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B] dark:text-[#94A3B8] mb-2.5">Highest Hype Score</p>
                  <Link href={`/ipo/${topHypeItem.ipo.slug}`} className="group block">
                    <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-blue-600 dark:group-hover:text-[#3B82F6] transition-colors leading-snug mb-2">
                      {topHypeItem.ipo.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-[#22304A] rounded-full overflow-hidden">
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
                <div className="bg-white dark:bg-[#0D1525] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B] dark:text-[#94A3B8] mb-2.5">Most Subscribed</p>
                  <Link href={`/ipo/${topSubItem.slug}`} className="group block">
                    <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-blue-600 dark:group-hover:text-[#3B82F6] transition-colors leading-snug">
                      {topSubItem.name}
                    </p>
                    <p className="text-[22px] font-bold text-[#1e3a8a] dark:text-[#3B82F6] tabular-nums mt-1">
                      {parseFloat(String(topSubItem.sub_total)).toFixed(1)}×
                    </p>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Total subscription</p>
                  </Link>
                </div>
              )}

              {/* Widget: Closes Soon */}
              {closingSoonItem && (
                <div className="bg-white dark:bg-[#0D1525] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B] dark:text-[#94A3B8] mb-2.5">Closes Soonest</p>
                  <Link href={`/ipo/${closingSoonItem.slug}`} className="group block">
                    <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-blue-600 dark:group-hover:text-[#3B82F6] transition-colors leading-snug">
                      {closingSoonItem.name}
                    </p>
                    <p className="text-[12px] text-[#475569] dark:text-[#94A3B8] mt-1">
                      Closes{" "}
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        {closingSoonItem.close_date}
                      </span>
                    </p>
                  </Link>
                </div>
              )}

              {/* Static: Education links */}
              <div className="bg-white dark:bg-[#0D1525] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B] dark:text-[#94A3B8] mb-3">Research Guides</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/what-is-ipo-gmp" className="text-[12.5px] text-[#2563eb] dark:text-[#3B82F6] hover:underline font-medium">
                      What is IPO GMP
                    </Link>
                  </li>
                  <li>
                    <Link href="/how-ipo-allotment-works" className="text-[12.5px] text-[#2563eb] dark:text-[#3B82F6] hover:underline font-medium">
                      How Allotment Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/qib-hni-retail-explained" className="text-[12.5px] text-[#2563eb] dark:text-[#3B82F6] hover:underline font-medium">
                      QIB vs HNI vs Retail
                    </Link>
                  </li>
                </ul>
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
