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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-[1.75rem] sm:text-[2.2rem] font-bold text-[#0f172a] dark:text-[#F1F5F9] leading-tight"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          IPO Performance &amp; Track Record
        </h1>
        <p className="text-[14px] sm:text-[14.5px] text-[#475569] dark:text-[#9AA1AA] max-w-3xl leading-relaxed mt-1">
          Historical listing day gains and performance track record for Indian Mainboard and SME IPOs. Compare issue price vs listing price returns.
        </p>
      </div>

      {/* KPI Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Avg Listing Gain */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418] shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B] dark:text-[#9AA1AA] mb-1">
            Avg Listing Gain
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-[1.4rem] sm:text-[1.6rem] font-bold ${stats.avgGain >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {stats.avgGain >= 0 ? "+" : ""}{stats.avgGain.toFixed(1)}%
            </span>
          </div>
          <div className="text-[11px] text-[#9AA1AA] dark:text-[#6B7280] mt-0.5">
            Across {stats.total} listings
          </div>
        </div>

        {/* Win Rate */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418] shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B] dark:text-[#9AA1AA] mb-1">
            Positive Listings
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[1.4rem] sm:text-[1.6rem] font-bold text-[#0f172a] dark:text-[#F1F3F5]">
              {stats.winRate.toFixed(0)}%
            </span>
            <span className="text-[12px] text-[#64748B] dark:text-[#9AA1AA]">
              ({stats.positiveCount}/{stats.total})
            </span>
          </div>
          <div className="text-[11px] text-[#9AA1AA] dark:text-[#6B7280] mt-0.5">
            Listed at premium
          </div>
        </div>

        {/* Top Performer */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418] shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B] dark:text-[#9AA1AA] mb-1">
            Top Gainer
          </div>
          {stats.topGainer ? (
            <div>
              <div className="text-[14px] font-bold text-[#0f172a] dark:text-[#F1F5F9] truncate">
                {stats.topGainer.name}
              </div>
              <div className="text-[12.5px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                +{stats.topGainer.calculatedGain?.toFixed(1)}% on listing
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-[13px]">-</div>
          )}
        </div>

        {/* Total Tracked */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418] shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B] dark:text-[#9AA1AA] mb-1">
            Tracked Listings
          </div>
          <div className="text-[1.4rem] sm:text-[1.6rem] font-bold text-[#0f172a] dark:text-[#F1F3F5]">
            {stats.total}
          </div>
          <div className="text-[11px] text-[#9AA1AA] dark:text-[#6B7280] mt-0.5">
            Historical records
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company name..."
              className="w-full pl-9 pr-3.5 py-1.5 text-[13px] rounded-md border border-gray-200 dark:border-[#252A31] bg-gray-50/50 dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F3F5] focus:outline-hidden focus:ring-1 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-[#6B7280]"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#64748B] dark:text-[#9AA1AA] whitespace-nowrap font-medium hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-[12px] rounded-md border border-gray-200 dark:border-[#252A31] bg-gray-50/50 dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F3F5] focus:outline-hidden"
            >
              <option value="date-desc">Newest Date</option>
              <option value="gain-desc">Highest Gain %</option>
              <option value="gain-asc">Lowest Gain %</option>
              <option value="price-desc">Issue Price</option>
            </select>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-[#252A31] text-[12px]">
          {/* Segment Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[#64748B] dark:text-[#9AA1AA] font-medium mr-1">Segment:</span>
            {(["ALL", "MAINBOARD", "SME"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSegmentFilter(tab)}
                className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors ${
                  segmentFilter === tab
                    ? "bg-gray-100 dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F3F5] font-semibold border border-gray-200 dark:border-[#252A31]"
                    : "text-[#64748B] dark:text-[#9AA1AA] hover:bg-gray-50 dark:hover:bg-[#171B20]"
                }`}
              >
                {tab === "ALL" ? "All" : tab === "MAINBOARD" ? "Mainboard" : "SME"}
              </button>
            ))}
          </div>

          {/* Outcome Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[#64748B] dark:text-[#9AA1AA] font-medium mr-1">Outcome:</span>
            {(["ALL", "GAINERS", "DISCOUNT", "MULTIBAGGER"] as const).map((out) => (
              <button
                key={out}
                onClick={() => setOutcomeFilter(out)}
                className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors ${
                  outcomeFilter === out
                    ? "bg-gray-100 dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F3F5] font-semibold border border-gray-200 dark:border-[#252A31]"
                    : "text-[#64748B] dark:text-[#9AA1AA] hover:bg-gray-50 dark:hover:bg-[#171B20]"
                }`}
              >
                {out === "ALL" ? "All" : out === "GAINERS" ? "Gainers (>0%)" : out === "DISCOUNT" ? "Discounts (<0%)" : "Multibaggers (>100%)"}
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
              <tr className="bg-gray-50/75 dark:bg-[#171B20]/75 border-b border-gray-200 dark:border-[#252A31]">
                <th className="py-2.5 px-4 text-[11.5px] font-semibold text-[#64748B] dark:text-[#9AA1AA] uppercase tracking-wider">Company</th>
                <th className="py-2.5 px-4 text-[11.5px] font-semibold text-[#64748B] dark:text-[#9AA1AA] uppercase tracking-wider">Listing Date</th>
                <th className="py-2.5 px-4 text-[11.5px] font-semibold text-[#64748B] dark:text-[#9AA1AA] uppercase tracking-wider text-right">Issue Price</th>
                <th className="py-2.5 px-4 text-[11.5px] font-semibold text-[#64748B] dark:text-[#9AA1AA] uppercase tracking-wider text-right">Listing Price</th>
                <th className="py-2.5 px-4 text-[11.5px] font-semibold text-[#64748B] dark:text-[#9AA1AA] uppercase tracking-wider text-right">Listing Gain</th>
                <th className="py-2.5 px-4 text-[11.5px] font-semibold text-[#64748B] dark:text-[#9AA1AA] uppercase tracking-wider text-right">Details</th>
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
                        View Analysis →
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
