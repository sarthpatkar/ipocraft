import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { canonicalUrl } from "@/lib/site-url";
import HistoricalIpoCard, { type HistoricalIpoItem } from "@/components/HistoricalIpoCard";

const ipoHistoryUrl = canonicalUrl("/ipo-history");
const PAGE_SIZE = 24;

const SORTS = {
  newest: { column: "listing_date", ascending: false, label: "Newest Listed" },
  gain_desc: { column: "listing_gain_percent", ascending: false, label: "Best Gain" },
  gain_asc: { column: "listing_gain_percent", ascending: true, label: "Worst Gain" },
} as const;
type SortKey = keyof typeof SORTS;

function normalizeSort(input?: string): SortKey {
  return input && input in SORTS ? (input as SortKey) : "newest";
}

function normalizeType(input?: string): "mainboard" | "sme" | undefined {
  const v = (input ?? "").toLowerCase();
  return v === "mainboard" || v === "sme" ? v : undefined;
}

function buildHref(params: { year?: string; type?: string; sort?: SortKey; page?: number }) {
  const q = new URLSearchParams();
  if (params.year && params.year !== "all") q.set("year", params.year);
  if (params.type) q.set("type", params.type);
  if (params.sort && params.sort !== "newest") q.set("sort", params.sort);
  if (params.page && params.page > 1) q.set("page", String(params.page));
  const query = q.toString();
  return query ? `/ipo-history?${query}` : "/ipo-history";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const yearLabel = params.year && params.year !== "all" ? params.year : "2004–2026";
  const title = `IPO History India ${yearLabel} — Past IPO Listing Gains & Data | IPOCraft`;
  const description =
    "Browse the complete archive of past Indian IPOs by year — issue price, listing price, realized listing gains, and lot size for Mainboard and SME issues.";
  return {
    title,
    description,
    alternates: { canonical: ipoHistoryUrl },
    openGraph: { title, description, url: ipoHistoryUrl, siteName: "IPOCraft", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function IpoHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; type?: string; sort?: string; page?: string }>;
}) {
  noStore();
  const params = await searchParams;
  const selectedYear = (params.year ?? "").toString() || "all";
  const selectedType = normalizeType(params.type);
  const selectedSort = normalizeSort(params.sort);
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const supabase = await createSupabaseServerClient();

  // Distinct years present among listed IPOs — cheap single-column fetch.
  const { data: dateRows } = await supabase
    .from("ipos")
    .select("listing_date")
    .eq("status", "Listed")
    .not("listing_date", "is", null);

  const years = Array.from(
    new Set((dateRows ?? []).map((r) => (r.listing_date as string).slice(0, 4)))
  ).sort((a, b) => b.localeCompare(a));

  let query = supabase
    .from("ipos")
    .select(
      "id, slug, name, ipo_type, exchange, listing_date, price_min, price_max, listing_price, listing_gain_percent, lot_size",
      { count: "exact" }
    )
    .eq("status", "Listed");

  if (selectedYear !== "all") {
    query = query.gte("listing_date", `${selectedYear}-01-01`).lte("listing_date", `${selectedYear}-12-31`);
  }
  if (selectedType) {
    query = query.eq("ipo_type", selectedType);
  }

  const sortDef = SORTS[selectedSort];
  const from = (currentPage - 1) * PAGE_SIZE;
  const { data: rows, count } = await query
    .order(sortDef.column, { ascending: sortDef.ascending, nullsFirst: false })
    .range(from, from + PAGE_SIZE - 1);

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const ipos = (rows ?? []) as HistoricalIpoItem[];

  const gains = ipos.map((i) => i.listing_gain_percent).filter((g): g is number => g != null);
  const avgGain = gains.length ? gains.reduce((s, g) => s + g, 0) / gains.length : null;
  const gainerCount = gains.filter((g) => g >= 0).length;
  const gainerPct = gains.length ? Math.round((gainerCount / gains.length) * 100) : null;

  return (
    <div
      className="min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] antialiased"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "Historical IPO Listings India",
            description:
              "Archive of past Indian IPOs with issue price, listing price, and realized listing gains across Mainboard and SME segments.",
            url: ipoHistoryUrl,
          }),
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-[#252A31]">
          <div>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-1">
              Historical Archive
            </p>
            <h1
              className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0f172a] dark:text-[#F1F5F9]"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Complete IPO History — India
            </h1>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-[#9AA1AA]">
              {totalCount.toLocaleString("en-IN")} past Mainboard &amp; SME IPOs — issue price, listing price, and realized gains.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[12.5px]">
            <Link href="/performance" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Top Performers
            </Link>
            <span className="text-gray-300 dark:text-[#252A31]">|</span>
            <Link href="/ipo" className="font-medium text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white">
              Live IPO Directory
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3.5">
            <p className="text-[11px] font-medium text-[#64748b] dark:text-[#9AA1AA] mb-0.5">
              {selectedYear === "all" ? "All-Time" : selectedYear} IPOs
            </p>
            <p className="text-[18px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
              {totalCount.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3.5">
            <p className="text-[11px] font-medium text-[#64748b] dark:text-[#9AA1AA] mb-0.5">Avg. Listing Gain (page)</p>
            <p
              className={`text-[18px] font-semibold ${
                avgGain == null ? "text-[#0f172a] dark:text-[#F1F5F9]" : avgGain >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              }`}
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {avgGain != null ? `${avgGain >= 0 ? "+" : ""}${avgGain.toFixed(1)}%` : "-"}
            </p>
          </div>
          <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3.5">
            <p className="text-[11px] font-medium text-[#64748b] dark:text-[#9AA1AA] mb-0.5">Gainers (page)</p>
            <p className="text-[18px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
              {gainerPct != null ? `${gainerPct}%` : "-"}
            </p>
          </div>
          <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3.5">
            <p className="text-[11px] font-medium text-[#64748b] dark:text-[#9AA1AA] mb-0.5">Page</p>
            <p className="text-[18px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
              {currentPage} / {totalPages}
            </p>
          </div>
        </div>

        {/* Filters ribbon */}
        <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 mb-5 shadow-xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Year pills */}
            <div className="flex flex-wrap items-center gap-1 rounded-md border border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#171B20] p-0.5">
              <Link
                href={buildHref({ year: "all", type: selectedType, sort: selectedSort })}
                className={`px-2.5 py-1 text-[11.5px] font-medium rounded transition-colors ${
                  selectedYear === "all"
                    ? "bg-white dark:bg-white text-[#0f172a] dark:text-black shadow-xs font-semibold"
                    : "text-gray-500 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-[#F1F5F9]"
                }`}
              >
                All Years
              </Link>
              {years.map((y) => (
                <Link
                  key={y}
                  href={buildHref({ year: y, type: selectedType, sort: selectedSort })}
                  className={`px-2.5 py-1 text-[11.5px] font-medium rounded transition-colors ${
                    selectedYear === y
                      ? "bg-white dark:bg-white text-[#0f172a] dark:text-black shadow-xs font-semibold"
                      : "text-gray-500 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-[#F1F5F9]"
                  }`}
                >
                  {y}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {/* Type pills */}
              <div className="flex items-center gap-1 rounded-md border border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#171B20] p-0.5">
                <Link
                  href={buildHref({ year: selectedYear, sort: selectedSort })}
                  className={`px-2.5 py-1 text-[11.5px] font-medium rounded transition-colors ${
                    !selectedType
                      ? "bg-white dark:bg-white text-[#0f172a] dark:text-black shadow-xs font-semibold"
                      : "text-gray-500 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-[#F1F5F9]"
                  }`}
                >
                  All
                </Link>
                <Link
                  href={buildHref({ year: selectedYear, type: "mainboard", sort: selectedSort })}
                  className={`px-2.5 py-1 text-[11.5px] font-medium rounded transition-colors ${
                    selectedType === "mainboard"
                      ? "bg-white dark:bg-white text-[#0f172a] dark:text-black shadow-xs font-semibold"
                      : "text-gray-500 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-[#F1F5F9]"
                  }`}
                >
                  Mainboard
                </Link>
                <Link
                  href={buildHref({ year: selectedYear, type: "sme", sort: selectedSort })}
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

              {/* Sort toggles */}
              {(Object.keys(SORTS) as SortKey[]).map((key) => (
                <Link
                  key={key}
                  href={buildHref({ year: selectedYear, type: selectedType, sort: key })}
                  className={`px-2.5 py-1 text-[11.5px] font-medium rounded-md border transition-colors ${
                    selectedSort === key
                      ? "bg-gray-900 text-white dark:bg-white dark:text-black border-gray-900 dark:border-white shadow-xs font-semibold"
                      : "bg-white dark:bg-[#171B20] text-gray-600 dark:text-[#9AA1AA] border-gray-200 dark:border-[#252A31] hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  {SORTS[key].label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {ipos.length === 0 ? (
          <div className="bg-white dark:bg-[#111418] border border-dashed border-gray-300 dark:border-[#252A31] rounded-lg p-8 text-center text-[#64748b] dark:text-[#9AA1AA] text-sm mb-6">
            No IPOs found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {ipos.map((ipo) => (
              <HistoricalIpoCard key={ipo.id} ipo={ipo} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <Link
              href={buildHref({ year: selectedYear, type: selectedType, sort: selectedSort, page: currentPage - 1 })}
              aria-disabled={currentPage <= 1}
              className={`px-3.5 py-1.5 text-[12.5px] font-semibold rounded-md border transition-colors ${
                currentPage <= 1
                  ? "pointer-events-none opacity-40 border-gray-200 dark:border-[#252A31] text-gray-400 dark:text-[#6B7280]"
                  : "border-gray-900 dark:border-white bg-gray-900 text-white dark:bg-white dark:text-black shadow-xs hover:opacity-90"
              }`}
            >
              Previous
            </Link>
            <span className="text-[12.5px] text-gray-500 dark:text-[#9AA1AA] px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Link
              href={buildHref({ year: selectedYear, type: selectedType, sort: selectedSort, page: currentPage + 1 })}
              aria-disabled={currentPage >= totalPages}
              className={`px-3.5 py-1.5 text-[12.5px] font-semibold rounded-md border transition-colors ${
                currentPage >= totalPages
                  ? "pointer-events-none opacity-40 border-gray-200 dark:border-[#252A31] text-gray-400 dark:text-[#6B7280]"
                  : "border-gray-900 dark:border-white bg-gray-900 text-white dark:bg-white dark:text-black shadow-xs hover:opacity-90"
              }`}
            >
              Next
            </Link>
          </div>
        )}

        {/* Footnote */}
        <div className="border-t border-gray-200 dark:border-[#252A31] pt-6 text-[12.5px] text-gray-500 dark:text-[#9AA1AA]">
          <p>
            Listing gain is calculated as (listing price − issue price) / issue price. Some historical records may be missing lot size or subscription
            data where the original source didn&apos;t disclose it — see our <Link href="/methodology" className="text-blue-600 dark:text-blue-400 hover:underline">data methodology</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}
