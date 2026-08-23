"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MagnifyingGlassIcon,
  ChartBarSquareIcon,
  TrophyIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  FunnelIcon,
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

  const calculateGain = (ipo: PerformanceIpo) => {
    const issue = Number(ipo.issue_price ?? ipo.price_max ?? ipo.price_min ?? 0);
    const listing = Number(ipo.listing_price ?? 0);
    if (!issue || !listing || issue <= 0) return null;
    return ((listing - issue) / issue) * 100;
  };

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

  // Overall KPI Analytics (calculated across all valid listings)
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
        // default date-desc
        return (b.listing_date ?? "").localeCompare(a.listing_date ?? "");
      });
  }, [enrichedIpos, search, segmentFilter, outcomeFilter, sortBy]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBA";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header with Beta Badge */}
      <div>
        <div className="flex items-center gap-2.5 mb-2 flex-wrap">
          <h1
            className="text-[1.75rem] sm:text-[2.25rem] font-bold text-[#0f172a] dark:text-[#F1F5F9] leading-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            IPO Performance &amp; Track Record
          </h1>
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/60">
            Beta
          </span>
        </div>
        <p className="text-[14px] sm:text-[15px] text-[#475569] dark:text-[#94A3B8] max-w-3xl leading-relaxed">
          Historical listing day gains and performance track record for Indian Mainboard and SME IPOs. Compare issue price vs listing price returns.
        </p>
      </div>

      {/* KPI Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Avg Listing Gain */}
        <div className="p-4 rounded-xl border border-[#e2e8f0] dark:border-[#22304A] bg-white dark:bg-[#111B2D] shadow-xs">
          <div className="text-[11.5px] uppercase tracking-wider font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1">
            Avg Listing Gain
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-[1.5rem] sm:text-[1.75rem] font-bold ${stats.avgGain >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {stats.avgGain >= 0 ? "+" : ""}{stats.avgGain.toFixed(1)}%
            </span>
          </div>
          <div className="text-[11.5px] text-[#94A3B8] dark:text-[#64748B] mt-1">
            Across {stats.total} listings
          </div>
        </div>

        {/* Win Rate */}
        <div className="p-4 rounded-xl border border-[#e2e8f0] dark:border-[#22304A] bg-white dark:bg-[#111B2D] shadow-xs">
          <div className="text-[11.5px] uppercase tracking-wider font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1">
            Positive Listings
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[1.5rem] sm:text-[1.75rem] font-bold text-blue-600 dark:text-[#3B82F6]">
              {stats.winRate.toFixed(0)}%
            </span>
            <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
              ({stats.positiveCount}/{stats.total})
            </span>
          </div>
          <div className="text-[11.5px] text-[#94A3B8] dark:text-[#64748B] mt-1">
            Listed at premium
          </div>
        </div>

        {/* Top Performer */}
        <div className="p-4 rounded-xl border border-[#e2e8f0] dark:border-[#22304A] bg-white dark:bg-[#111B2D] shadow-xs">
          <div className="text-[11.5px] uppercase tracking-wider font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1">
            Top Gainer
          </div>
          {stats.topGainer ? (
            <div>
              <div className="text-[14.5px] font-bold text-[#0f172a] dark:text-[#F1F5F9] truncate">
                {stats.topGainer.name}
              </div>
              <div className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                +{stats.topGainer.calculatedGain?.toFixed(1)}% on listing
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-[13px]">-</div>
          )}
        </div>

        {/* Total Tracked */}
        <div className="p-4 rounded-xl border border-[#e2e8f0] dark:border-[#22304A] bg-white dark:bg-[#111B2D] shadow-xs">
          <div className="text-[11.5px] uppercase tracking-wider font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1">
            Tracked Listings
          </div>
          <div className="text-[1.5rem] sm:text-[1.75rem] font-bold text-[#0f172a] dark:text-[#F1F5F9]">
            {stats.total}
          </div>
          <div className="text-[11.5px] text-[#94A3B8] dark:text-[#64748B] mt-1">
            Historical database entries
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company name..."
              className="w-full pl-9 pr-3.5 py-2 text-[13.5px] rounded-lg border border-gray-200 dark:border-[#22304A] bg-gray-50/50 dark:bg-[#080D18] text-[#0f172a] dark:text-[#F1F5F9] focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[12.5px] text-[#64748B] dark:text-[#94A3B8] whitespace-nowrap font-medium hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-[12.5px] rounded-lg border border-gray-200 dark:border-[#22304A] bg-gray-50/50 dark:bg-[#080D18] text-[#0f172a] dark:text-[#F1F5F9] focus:outline-hidden"
            >
              <option value="date-desc">Newest Listing Date</option>
              <option value="gain-desc">Highest Gain %</option>
              <option value="gain-asc">Lowest Gain %</option>
              <option value="price-desc">Highest Issue Price</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-[#22304A] text-[12px]">
          {/* Segment Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[#64748B] dark:text-[#94A3B8] font-medium mr-1">Segment:</span>
            {(["ALL", "MAINBOARD", "SME"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSegmentFilter(tab)}
                className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors ${
                  segmentFilter === tab
                    ? "bg-[#1e3a8a] text-white dark:bg-[#3B82F6] dark:text-white font-semibold"
                    : "text-[#64748B] dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#162238]"
                }`}
              >
                {tab === "ALL" ? "All" : tab === "MAINBOARD" ? "Mainboard" : "SME"}
              </button>
            ))}
          </div>

          {/* Outcome Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[#64748B] dark:text-[#94A3B8] font-medium mr-1">Outcome:</span>
            {(["ALL", "GAINERS", "DISCOUNT", "MULTIBAGGER"] as const).map((out) => (
              <button
                key={out}
                onClick={() => setOutcomeFilter(out)}
                className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors ${
                  outcomeFilter === out
                    ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800"
                    : "text-[#64748B] dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#162238]"
                }`}
              >
                {out === "ALL" ? "All" : out === "GAINERS" ? "Gainers (>0%)" : out === "DISCOUNT" ? "Discounts (<0%)" : "Multibaggers (>100%)"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table / Desktop */}
      <div className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-[#0D1525]/50 border-b border-[#e2e8f0] dark:border-[#22304A]">
                <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Company</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Listing Date</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider text-right">Issue Price</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider text-right">Listing Price</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider text-right">Listing Gain</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#22304A]">
              {filteredAndSortedIpos.map((ipo) => {
                const gain = ipo.calculatedGain;
                const isPositive = gain != null && gain >= 0;
                const isNegative = gain != null && gain < 0;

                return (
                  <tr key={ipo.id} className="hover:bg-gray-50/50 dark:hover:bg-[#162238]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/ipo/${ipo.slug}`}
                          className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] hover:text-[#3B82F6] dark:hover:text-[#3B82F6] transition-colors truncate max-w-[220px]"
                        >
                          {ipo.name}
                        </Link>
                        {ipo.ipo_type?.toUpperCase() === "SME" && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 text-[9px] font-bold uppercase tracking-wider shrink-0">
                            SME
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[13px] text-[#64748B] dark:text-[#94A3B8]">
                      {formatDate(ipo.listing_date)}
                    </td>
                    <td className="py-3.5 px-4 text-[13px] font-medium text-[#0f172a] dark:text-[#F1F5F9] text-right">
                      {ipo.parsedIssue != null ? `₹${ipo.parsedIssue.toLocaleString("en-IN")}` : "-"}
                    </td>
                    <td className="py-3.5 px-4 text-[13px] font-medium text-[#0f172a] dark:text-[#F1F5F9] text-right">
                      {ipo.parsedListing != null ? `₹${ipo.parsedListing.toLocaleString("en-IN")}` : "-"}
                    </td>
                    <td className="py-3.5 px-4 text-[13px] font-semibold text-right">
                      {gain != null ? (
                        <div className={`inline-flex items-center justify-end gap-1 ${isPositive ? "text-emerald-600 dark:text-emerald-400" : isNegative ? "text-red-600 dark:text-red-400" : "text-gray-500"}`}>
                          {isPositive ? <ArrowTrendingUpIcon className="w-3.5 h-3.5" /> : <ArrowTrendingDownIcon className="w-3.5 h-3.5" />}
                          <span>{isPositive ? "+" : ""}{gain.toFixed(2)}%</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/ipo/${ipo.slug}`}
                        className="text-[12.5px] text-blue-600 dark:text-[#3B82F6] hover:underline font-medium"
                      >
                        View Analysis →
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredAndSortedIpos.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#64748B] dark:text-[#94A3B8]">
                    <QuestionMarkCircleIcon className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-slate-600" />
                    <div className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">No listed IPOs matched your filters</div>
                    <div className="text-[12.5px] mt-1">Try resetting the outcome or segment filter.</div>
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
