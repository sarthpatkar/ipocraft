import type { Metadata } from "next";
import Link from "next/link";
import IpoLoadMoreClient from "@/components/IpoLoadMoreClient";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getIpoFeedPage } from "@/lib/ipoFeed";
import { unstable_noStore as noStore } from "next/cache";
import { canonicalUrl } from "@/lib/site-url";



const smeIpoUrl = canonicalUrl("/sme-ipo");

const STATUS_FILTERS = ["Open", "Upcoming", "Listed", "Closed"] as const;
type StatusFilter = "All" | (typeof STATUS_FILTERS)[number];

function buildTitle(status?: string) {
  if (!status || status.toLowerCase() === "all") {
    return "SME IPO List | Latest SME IPOs in India";
  }
  return `${status} SME IPOs in India`;
}

function normalizeStatus(input?: string): StatusFilter {
  if (!input) return "All";
  const match = STATUS_FILTERS.find(
    (s) => s.toLowerCase() === input.toLowerCase()
  );
  return match ?? "All";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const status = params.status ?? "All";

  const baseTitle = buildTitle(status);

  return {
    title: `${baseTitle} — Live GMP, Subscriptions & Dates | IPOCraft`,
    description:
      "Track the latest SME IPOs in India. View live Grey Market Premium (GMP), daily subscription demand, price bands, and listing dates for all upcoming and current SME IPOs.",
    alternates: {
      canonical: smeIpoUrl,
    },
    openGraph: {
      title: `${baseTitle} — Live GMP & Dates | IPOCraft`,
      description:
        "The ultimate dashboard for SME IPOs. Track live GMP, exact subscription data, and key timelines.",
      url: smeIpoUrl,
      siteName: "IPOCraft",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${baseTitle} — Live GMP & Dates | IPOCraft`,
      description:
        "SME IPO dashboard with live GMP, subscription demand, and dates — IPOCraft.",
    },
  };
}

function buildHref(status: StatusFilter, search: string) {
  const params = new URLSearchParams();
  if (status !== "All") {
    params.set("status", status.toLowerCase());
  }
  if (search.trim()) {
    params.set("q", search.trim());
  }
  const query = params.toString();
  return query ? `/sme-ipo?${query}` : "/sme-ipo";
}

export default async function SMEIPOPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  noStore();
  const params = await searchParams;
  const rawStatus = (params.status ?? "").toString();
  const selectedStatus = normalizeStatus(rawStatus);
  const selectedStatusParam = selectedStatus.toLowerCase();
  const searchQuery = (params.q ?? "").toString().trim();
  const statusFilter = selectedStatus === "All" ? undefined : selectedStatus;
  const queryFilter = searchQuery || undefined;
  
  const supabase = await createSupabaseServerClient();
  const initialFeed = await getIpoFeedPage({
    supabase,
    limit: 12,
    status: statusFilter,
    type: "sme", // HARDCODED TO ONLY SME
    q: queryFilter,
  });

  return (
    <div
      className={`min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] antialiased overflow-x-hidden`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "SME IPO Hub India",
            description: "Track all SME IPOs in India with live GMP, dates, and subscription data.",
            publisher: {
              "@type": "Organization",
              name: "IPOCraft",
              url: "https://ipocraft.com",
            }
          }),
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Compact Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-[#252A31]">
          <div>
            <p
              className="text-[11px] font-semibold tracking-wider uppercase text-amber-700 dark:text-amber-400 mb-1"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              SME IPO Segment
            </p>
            <h1
              className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0f172a] dark:text-[#F1F5F9]"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Latest SME IPOs in India
            </h1>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-[#9AA1AA]">
              BSE SME &amp; NSE Emerge issues, lot sizes, subscription multipliers, and indicative GMPs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[12.5px]">
            <Link
              href="/gmp?type=sme"
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              SME GMP Tracker
            </Link>
            <span className="text-gray-300 dark:text-[#252A31]">|</span>
            <a
              href="#what-is-sme"
              className="font-medium text-gray-500 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white"
            >
              What is an SME IPO?
            </a>
          </div>
        </div>

        {/* Compact Filters Bar */}
        <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 mb-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <form action="/sme-ipo" method="get" className="relative flex-1 max-w-md">
              {selectedStatus !== "All" && (
                <input type="hidden" name="status" value={selectedStatusParam} />
              )}
              <svg className="w-4 h-4 text-gray-400 dark:text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search SME IPO by company name…"
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-gray-900 dark:text-[#F1F3F5] placeholder-gray-400 dark:placeholder-[#6B7280] rounded-md text-[13px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-1 dark:focus:ring-white transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              />
            </form>

            {/* Status Tabs */}
            <div className="flex bg-gray-50 dark:bg-[#171B20] p-0.5 rounded-md border border-gray-200 dark:border-[#252A31]">
              <Link
                href={buildHref("All", searchQuery)}
                className={`px-3 py-1 text-[11.5px] font-semibold rounded transition-colors ${
                  selectedStatus === "All"
                    ? "bg-white dark:bg-white text-[#0f172a] dark:text-black shadow-xs"
                    : "text-gray-500 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-[#F1F5F9]"
                }`}
                scroll={false}
              >
                All
              </Link>
              {STATUS_FILTERS.map((s) => (
                <Link
                  key={s}
                  href={buildHref(s, searchQuery)}
                  className={`px-3 py-1 text-[11.5px] font-semibold rounded transition-colors ${
                    selectedStatus === s
                      ? "bg-white dark:bg-white text-[#0f172a] dark:text-black shadow-xs"
                      : "text-gray-500 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-[#F1F5F9]"
                  }`}
                  scroll={false}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Primary Data Table / Grid */}
        <div className="w-full">
          <IpoLoadMoreClient
            initialItems={initialFeed.items}
            initialHasMore={initialFeed.hasMore}
            initialNextCursor={initialFeed.nextCursor}
            snapshot={initialFeed.snapshot}
            status={statusFilter}
            type="sme"
            q={queryFilter}
            limit={12}
          />
        </div>

        {/* Subordinated Educational Footnote at Bottom */}
        <section id="what-is-sme" className="mt-12 border-t border-gray-200 dark:border-[#252A31] pt-7">
          <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-5 sm:p-6 shadow-xs max-w-4xl">
            <h2
              className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-2 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              What is an SME IPO?
            </h2>
            <div className="text-[13px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed space-y-2">
              <p>
                SME IPOs enable Small and Medium Enterprises with lower post-issue capital to raise public funds and list on specialized exchange platforms like <strong>BSE SME</strong> or <strong>NSE Emerge</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-gray-50 dark:bg-[#171B20] p-3 rounded-md border border-gray-100 dark:border-[#252A31]">
                  <p className="font-semibold text-gray-900 dark:text-[#F1F5F9] text-xs">Standard Lot Sizes</p>
                  <p className="text-[12px] text-gray-500 dark:text-[#9AA1AA] mt-0.5">Traded in large bundled lots (e.g. 1,000–3,000 shares per lot).</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#171B20] p-3 rounded-md border border-gray-100 dark:border-[#252A31]">
                  <p className="font-semibold text-gray-900 dark:text-[#F1F5F9] text-xs">Minimum Investment</p>
                  <p className="text-[12px] text-gray-500 dark:text-[#9AA1AA] mt-0.5">Minimum application ticket size is ≥ ₹1 Lakh per application.</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#171B20] p-3 rounded-md border border-gray-100 dark:border-[#252A31]">
                  <p className="font-semibold text-gray-900 dark:text-[#F1F5F9] text-xs">Market Making</p>
                  <p className="text-[12px] text-gray-500 dark:text-[#9AA1AA] mt-0.5">Appointed market makers guarantee 2-way bid/ask liquidity post listing.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
