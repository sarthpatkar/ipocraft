"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

export type PerformanceIpo = {
  id: number;
  name: string;
  slug: string;
  ipo_type: string | null;
  price_min: number | null;
  price_max: number | null;
  issue_price: number | null;
  listing_price: number | null;
  listing_date: string | null;
  listing_gain: string | null;
};

export default function PerformanceClient({ ipos }: { ipos: PerformanceIpo[] }) {
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<"ALL" | "MAINBOARD" | "SME">("ALL");
  const [outcomeFilter, setOutcomeFilter] = useState<"ALL" | "GAINERS" | "DISCOUNT" | "MULTIBAGGER">("ALL");
  const [sortBy, setSortBy] = useState<"date-desc" | "gain-desc" | "gain-asc" | "price-desc">("date-desc");

  // Compute enriched list with calculated gains
  const enrichedIpos = useMemo(() => {
    return ipos.map((ipo) => {
      const issue = Number(ipo.issue_price ?? ipo.price_max ?? ipo.price_min ?? 0);
      const listing = Number(ipo.listing_price ?? 0);
      const gain = issue > 0 && listing > 0 ? ((listing - issue) / issue) * 100 : null;
      return {
        ...ipo,
        parsedIssue: issue > 0 ? issue : null,
        parsedListing: listing > 0 ? listing : null,
        calculatedGain: gain,
      };
    });
  }, [ipos]);

  // Overall KPI Analytics
  const stats = useMemo(() => {
    const valid = enrichedIpos.filter((x) => x.calculatedGain != null);
    if (valid.length === 0) return { avgGain: 0, winRate: 0, topGainer: null, total: 0, positiveCount: 0 };

    const totalGain = valid.reduce((acc, curr) => acc + (curr.calculatedGain ?? 0), 0);
    const avgGain = totalGain / valid.length;
    const positiveCount = valid.filter((x) => (x.calculatedGain ?? 0) >= 0).length;
    const winRate = (positiveCount / valid.length) * 100;

    const topGainer = [...valid].sort((a, b) => (b.calculatedGain ?? 0) - (a.calculatedGain ?? 0))[0] ?? null;

    return {
      avgGain,
      winRate,
      topGainer,
      total: valid.length,
      positiveCount,
    };
  }, [enrichedIpos]);

  // Filter and Sort
  const filteredAndSortedIpos = useMemo(() => {
    return enrichedIpos
      .filter((ipo) => {
        // Search
        if (search.trim()) {
          const q = search.toLowerCase();
          if (!ipo.name.toLowerCase().includes(q)) return false;
        }

        // Segment
        if (segmentFilter === "SME" && ipo.ipo_type?.toUpperCase() !== "SME") return false;
        if (segmentFilter === "MAINBOARD" && ipo.ipo_type?.toUpperCase() === "SME") return false;

        // Outcome
        const gain = ipo.calculatedGain;
        if (outcomeFilter === "GAINERS" && (gain == null || gain < 0)) return false;
        if (outcomeFilter === "DISCOUNT" && (gain == null || gain >= 0)) return false;
        if (outcomeFilter === "MULTIBAGGER" && (gain == null || gain < 100)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "gain-desc") {
          return (b.calculatedGain ?? -999) - (a.calculatedGain ?? -999);
        }
        if (sortBy === "gain-asc") {
          return (a.calculatedGain ?? 999) - (b.calculatedGain ?? 999);
        }
        if (sortBy === "price-desc") {
          return (b.parsedIssue ?? 0) - (a.parsedIssue ?? 0);
        }
        return (b.listing_date ?? "").localeCompare(a.listing_date ?? "");
      });
  }, [enrichedIpos, search, segmentFilter, outcomeFilter, sortBy]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-gray-200 dark:border-[#252A31]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            Track Record
          </p>
          <h1
            className="text-xl sm:text-2xl font-semibold text-[#0f172a] dark:text-[#F1F5F9] tracking-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            IPO Performance &amp; Track Record
          </h1>
          <p className="mt-1 text-[13px] text-gray-500 dark:text-[#9AA1AA] max-w-2xl leading-relaxed">
            IPOCraft tracks post-listing performance for all Indian Mainboard and SME IPOs. The table shows issue price, listing price, and listing day gain or loss percentage for each IPO. Sorted by most recent listing. Use filters to compare gainers, multibaggers, and discounted issues.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/gmp"
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-md bg-[#1C317A] text-white text-[12px] font-semibold hover:bg-[#28439E] transition-colors shadow-xs"
          >
            Live GMP Tracker <span>→</span>
          </Link>
        </div>
      </div>

      {/* Single Compact Metrics Strip */}
      <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-4 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-[#252A31]">
          {/* Avg Gain */}
          <div className="flex flex-col justify-center px-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-[#9AA1AA]">
              Avg Listing Gain
            </span>
            <span className={`text-lg sm:text-xl font-bold mt-0.5 ${stats.avgGain >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {stats.avgGain >= 0 ? "+" : ""}{stats.avgGain.toFixed(1)}%
            </span>
            <span className="text-[11px] text-gray-400 dark:text-[#6B7280]">
              Across {stats.total} issues
            </span>
          </div>

          {/* Win Rate */}
          <div className="flex flex-col justify-center px-2 pt-3 md:pt-0">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-[#9AA1AA]">
              Positive Listings
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-[#F1F5F9]">
                {stats.winRate.toFixed(0)}%
              </span>
              <span className="text-[11.5px] text-gray-500 dark:text-[#9AA1AA]">
                ({stats.positiveCount}/{stats.total})
              </span>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-[#6B7280]">
              Listed above issue
            </span>
          </div>

          {/* Top Gainer */}
          <div className="flex flex-col justify-center px-2 pt-3 md:pt-0">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-[#9AA1AA]">
              Top Gainer
            </span>
            {stats.topGainer ? (
              <div className="mt-0.5 min-w-0">
                <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] truncate">
                  {stats.topGainer.name}
                </p>
                <p className="text-[11.5px] font-medium text-emerald-600 dark:text-emerald-400">
                  +{stats.topGainer.calculatedGain?.toFixed(1)}% gain
                </p>
              </div>
            ) : (
              <span className="text-gray-400 text-sm mt-0.5">-</span>
            )}
          </div>

          {/* Tracked Count */}
          <div className="flex flex-col justify-center px-2 pt-3 md:pt-0">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-[#9AA1AA]">
              Tracked Listings
            </span>
            <span className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-[#F1F5F9] mt-0.5">
              {stats.total}
            </span>
            <span className="text-[11px] text-gray-400 dark:text-[#6B7280]">
              Historical records
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 dark:text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company name…"
              className="w-full pl-9 pr-3.5 py-1.5 text-[13px] rounded-md border border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F5F9] focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-1 dark:focus:ring-white placeholder-gray-400 dark:placeholder-[#6B7280]"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-gray-500 dark:text-[#9AA1AA] whitespace-nowrap font-medium hidden sm:inline">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-[12px] font-medium rounded-md border border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F5F9] focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-1 dark:focus:ring-white"
            >
              <option value="date-desc">Newest Date</option>
              <option value="gain-desc">Highest Gain %</option>
              <option value="gain-asc">Lowest Gain %</option>
              <option value="price-desc">Issue Price</option>
            </select>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-gray-100 dark:border-[#252A31] text-[12px]">
          {/* Segment Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-gray-500 dark:text-[#9AA1AA] font-medium mr-1 text-[11.5px]">Segment:</span>
            {(["ALL", "MAINBOARD", "SME"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSegmentFilter(tab)}
                className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors ${
                  segmentFilter === tab
                    ? "bg-gray-900 text-white dark:bg-white dark:text-black border border-gray-900 dark:border-white shadow-xs font-semibold"
                    : "text-gray-500 dark:text-[#9AA1AA] hover:bg-gray-50 dark:hover:bg-[#171B20]"
                }`}
              >
                {tab === "ALL" ? "All" : tab === "MAINBOARD" ? "Mainboard" : "SME"}
              </button>
            ))}
          </div>

          {/* Outcome Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-gray-500 dark:text-[#9AA1AA] font-medium mr-1 text-[11.5px]">Outcome:</span>
            {(["ALL", "GAINERS", "DISCOUNT", "MULTIBAGGER"] as const).map((out) => (
              <button
                key={out}
                onClick={() => setOutcomeFilter(out)}
                className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors ${
                  outcomeFilter === out
                    ? "bg-gray-900 text-white dark:bg-white dark:text-black border border-gray-900 dark:border-white shadow-xs font-semibold"
                    : "text-gray-500 dark:text-[#9AA1AA] hover:bg-gray-50 dark:hover:bg-[#171B20]"
                }`}
              >
                {out === "ALL" ? "All" : out === "GAINERS" ? "Gains > 0%" : out === "DISCOUNT" ? "Discount < 0%" : "2x+ Multibaggers"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-[#f8fafc] dark:bg-[#171B20] border-b border-gray-200 dark:border-[#252A31]">
                <th className="py-2.5 px-4 text-[11.5px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider">Company</th>
                <th className="py-2.5 px-4 text-[11.5px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider">Listing Date</th>
                <th className="py-2.5 px-4 text-[11.5px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider text-right">Issue Price</th>
                <th className="py-2.5 px-4 text-[11.5px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider text-right">Listing Price</th>
                <th className="py-2.5 px-4 text-[11.5px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider text-right">Listing Gain</th>
                <th className="py-2.5 px-4 text-[11.5px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#252A31]">
              {filteredAndSortedIpos.map((ipo) => {
                const gain = ipo.calculatedGain;
                const isPositive = gain != null && gain >= 0;
                const isNegative = gain != null && gain < 0;

                return (
                  <tr key={ipo.id} className="hover:bg-gray-50/50 dark:hover:bg-[#171B20]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/ipo/${ipo.slug}`}
                          className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[220px]"
                        >
                          {ipo.name}
                        </Link>
                        {ipo.ipo_type?.toUpperCase() === "SME" && (
                          <span className="text-amber-700 dark:text-amber-400 text-[10.5px] font-medium shrink-0">
                            (SME)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[12.5px] text-[#64748B] dark:text-[#9AA1AA]">
                      {formatDate(ipo.listing_date)}
                    </td>
                    <td className="py-3 px-4 text-[12.5px] font-medium text-[#0f172a] dark:text-[#F1F3F5] text-right">
                      {ipo.parsedIssue != null ? `₹${ipo.parsedIssue.toLocaleString("en-IN")}` : "-"}
                    </td>
                    <td className="py-3 px-4 text-[12.5px] font-medium text-[#0f172a] dark:text-[#F1F3F5] text-right">
                      {ipo.parsedListing != null ? `₹${ipo.parsedListing.toLocaleString("en-IN")}` : "-"}
                    </td>
                    <td className="py-3 px-4 text-[12.5px] font-semibold text-right">
                      {gain != null ? (
                        <div className={`inline-flex items-center justify-end gap-1 ${isPositive ? "text-emerald-600 dark:text-emerald-400" : isNegative ? "text-rose-600 dark:text-rose-400" : "text-gray-500"}`}>
                          {isPositive ? <ArrowTrendingUpIcon className="w-3.5 h-3.5" /> : <ArrowTrendingDownIcon className="w-3.5 h-3.5" />}
                          <span>{isPositive ? "+" : ""}{gain.toFixed(2)}%</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/ipo/${ipo.slug}`}
                        className="text-[12px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredAndSortedIpos.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748B] dark:text-[#9AA1AA]">
                    <QuestionMarkCircleIcon className="w-7 h-7 mx-auto mb-2 text-gray-400 dark:text-[#6B7280]" />
                    <div className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F3F5]">No listed IPOs matched your filters</div>
                    <div className="text-[12px] mt-0.5">Try resetting the outcome or segment filter.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
