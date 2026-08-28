import type { Metadata } from "next";
import Link from "next/link";
import IpoLoadMoreClient from "@/components/IpoLoadMoreClient";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getIpoFeedPage } from "@/lib/ipoFeed";
import { unstable_noStore as noStore } from "next/cache";
import { CANONICAL_ORIGIN, canonicalUrl } from "@/lib/site-url";



const ipoListingsUrl = canonicalUrl("/ipo");

const STATUS_FILTERS = ["Open", "Upcoming", "Listed", "Closed"] as const;
type StatusFilter = "All" | (typeof STATUS_FILTERS)[number];

function buildTitle(status?: string) {
  if (!status || status.toLowerCase() === "all") {
    return "Latest IPO Listings | IPOCraft";
  }
  return `${status} IPOs | IPOCraft`;
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
  searchParams: Promise<{ status?: string; type?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const status = params.status ?? "All";
  const type = (params.type ?? "").toString();

  const baseTitle =
    (type ? `${type.toUpperCase()} ` : "") +
    buildTitle(status);

  return {
    title: `${baseTitle} — IPO GMP, Upcoming & Current IPO List India | IPOCraft`,
    description:
      "Explore the latest IPO listings in India including open, upcoming, and listed IPOs with GMP, price bands, subscription data, and key dates. Updated regularly by IPOCraft.",
    alternates: {
      canonical: ipoListingsUrl,
    },
    openGraph: {
      title: `${baseTitle} — IPO Listings India | IPOCraft`,
      description:
        "Track open, upcoming, and listed IPOs with GMP insights, subscription trends, and offer details in one place.",
      url: ipoListingsUrl,
      siteName: "IPOCraft",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${baseTitle} — IPO Listings India | IPOCraft`,
      description:
        "Latest IPO list with GMP, subscription data, and timelines — IPOCraft.",
    },
  };
}

function buildHref(status: StatusFilter, search: string, type?: string) {
  const params = new URLSearchParams();
  if (status !== "All") {
    params.set("status", status.toLowerCase());
  }
  if (search.trim()) {
    params.set("q", search.trim());
  }
  if (type) {
    params.set("type", type);
  }
  const query = params.toString();
  return query ? `/ipo?${query}` : "/ipo";
}


export default async function IPOPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; type?: string }>;
}) {
  noStore();
  const params = await searchParams;
  const rawStatus = (params.status ?? "").toString();
  const selectedStatus = normalizeStatus(rawStatus);
  const selectedStatusParam = selectedStatus.toLowerCase();
  const searchQuery = (params.q ?? "").toString().trim();
  const selectedType = (params.type ?? "").toString();
  const statusFilter = selectedStatus === "All" ? undefined : selectedStatus;
  const typeFilter = selectedType || undefined;
  const queryFilter = searchQuery || undefined;
  const supabase = await createSupabaseServerClient();
  const initialFeed = await getIpoFeedPage({
    supabase,
    limit: 10,
    status: statusFilter,
    type: typeFilter,
    q: queryFilter,
  });

  return (
    <div
      className={`min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] antialiased`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            name: "IPO Listings India",
            provider: {
              "@type": "Organization",
              name: "IPOCraft",
              url: CANONICAL_ORIGIN,
            },
            description:
              "Latest IPO listings in India including open, upcoming, and listed IPOs with price bands, dates, and subscription insights.",
          }),
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Compact Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-[#252A31]">
          <div>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-1">
              IPO Directory
            </p>
            <h1
              className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0f172a] dark:text-[#F1F5F9]"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Latest IPO Listings in India
            </h1>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-[#9AA1AA]">
              Track open, upcoming, and recently listed Mainboard &amp; SME issues.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[12.5px]">
            <Link
              href="/gmp"
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              GMP Tracker
            </Link>
            <span className="text-gray-300 dark:text-[#252A31]">|</span>
            <Link
              href="/allotment-status"
              className="font-medium text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white"
            >
              Allotment Status
            </Link>
          </div>
        </div>

        {/* Compact Filters Ribbon */}
        <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 mb-5 shadow-xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <form id="searchForm" method="GET" className="relative flex-1 max-w-md">
              <svg
                className="w-4 h-4 text-gray-400 dark:text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search IPOs by company name…"
                className="w-full pl-9 pr-3.5 py-1.5 text-[13px] rounded-md border border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F5F9] focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-1 dark:focus:ring-white placeholder-gray-400 dark:placeholder-[#6B7280]"
              />
              {selectedStatusParam !== "all" && (
                <input type="hidden" name="status" value={selectedStatusParam} />
              )}
              {selectedType && (
                <input type="hidden" name="type" value={selectedType} />
              )}
            </form>

            {/* Type & Status Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Type pills */}
              <div className="flex items-center gap-1 rounded-md border border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#171B20] p-0.5">
                <Link
                  href={buildHref(selectedStatus, searchQuery, "")}
                  className={`px-2.5 py-1 text-[11.5px] font-medium rounded transition-colors ${
                    !selectedType
                      ? "bg-white dark:bg-white text-[#0f172a] dark:text-black shadow-xs font-semibold"
                      : "text-gray-500 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-[#F1F5F9]"
                  }`}
                >
                  All
                </Link>
                <Link
                  href={buildHref(selectedStatus, searchQuery, "mainboard")}
                  className={`px-2.5 py-1 text-[11.5px] font-medium rounded transition-colors ${
                    selectedType === "mainboard"
                      ? "bg-white dark:bg-white text-[#0f172a] dark:text-black shadow-xs font-semibold"
                      : "text-gray-500 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-[#F1F5F9]"
                  }`}
                >
                  Mainboard
                </Link>
                <Link
                  href={buildHref(selectedStatus, searchQuery, "sme")}
                  className={`px-2.5 py-1 text-[11.5px] font-medium rounded transition-colors ${
                    selectedType === "sme"
                      ? "bg-white dark:bg-white text-[#0f172a] dark:text-black shadow-xs font-semibold"
                      : "text-gray-500 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-[#F1F5F9]"
                  }`}
                >
                  SME
                </Link>
              </div>

              <span className="hidden sm:inline-block w-px h-4 bg-gray-200 dark:bg-[#252A31] mx-1" />

              {/* Status Toggles */}
              {STATUS_FILTERS.map((status) => (
                <Link
                  key={status}
                  href={buildHref(status, searchQuery, selectedType)}
                  className={`px-2.5 py-1 text-[11.5px] font-medium rounded-md border transition-colors ${
                    selectedStatus === status
                      ? "bg-gray-900 text-white dark:bg-white dark:text-black border-gray-900 dark:border-white shadow-xs font-semibold"
                      : "bg-white dark:bg-[#171B20] text-gray-600 dark:text-[#9AA1AA] border-gray-200 dark:border-[#252A31] hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  {status}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Data Presentation (Table default on Desktop, Cards on Mobile) */}
        <div>
          <IpoLoadMoreClient
            initialItems={initialFeed.items}
            initialHasMore={initialFeed.hasMore}
            initialNextCursor={initialFeed.nextCursor}
            snapshot={initialFeed.snapshot}
            status={statusFilter}
            type={typeFilter}
            q={queryFilter}
            limit={10}
          />
        </div>

        {/* Subordinated Educational Footnote */}
        <div className="mt-10 border-t border-gray-200 dark:border-[#252A31] pt-6 text-[12.5px] text-gray-500 dark:text-[#9AA1AA] leading-relaxed">
          <h2 className="text-[13.5px] font-semibold text-gray-700 dark:text-[#F1F5F9] mb-1.5">
            About IPO Listings &amp; Tracking in India
          </h2>
          <p>
            IPOCraft aggregates publicly available offer data across Mainboard and SME segments from exchange filings and registrars. Track indicative pricing on the <Link href="/gmp" className="text-blue-600 dark:text-blue-400 hover:underline">IPO GMP tracker</Link> and verify allotment outcomes on the <Link href="/allotment-status" className="text-blue-600 dark:text-blue-400 hover:underline">Allotment Hub</Link>. Always consult official DRHP/RHP filings before investing.
          </p>
        </div>
      </main>
    </div>
  );
}

