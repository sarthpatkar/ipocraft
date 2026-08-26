"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { sortIposByNewestOpenDate } from "@/lib/ipoSort";
import { formatDisplayDate, formatShortDate, formatSubscriptionTimes } from "@/lib/formatters";

type IpoRow = {
  id: number;
  name: string;
  slug: string;
  gmp: number | null;
  sub_total: number | null;
  price_min: number | null;
  price_max: number | null;
  lot_size?: number | null;
  issue_size: string | null;
  open_date: string | null;
  close_date: string | null;
  allotment_date: string | null;
  listing_date: string | null;
  ipo_type: string | null;
  gmp_trend?: number | null;
};

type Props = {
  data: IpoRow[];
  gmpMap?: Record<string, { latest?: number; prev?: number }>;
  filterStatus?: string;
  sort?: string;
  activeOnly?: string | boolean;
  typeFilter?: string;
};

type SortKey = "gmp" | "sub" | null;

function getLocalYYYYMMDD(date = new Date()) {
  // Force Indian Standard Time (IST) exactly like IpoCard logic
  const istTime = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
  const year = istTime.getUTCFullYear();
  const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istTime.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getLifecycleStatus(ipo: Pick<IpoRow, "open_date" | "close_date">) {
  const todayStr = getLocalYYYYMMDD();

  if (ipo.close_date) {
    if (ipo.close_date < todayStr) return "closed";
  }
  if (ipo.open_date) {
    if (ipo.open_date > todayStr) return "upcoming";
    return "open";
  }
  return "upcoming";
}

function getUrgencyBadge(ipo: Pick<IpoRow, "open_date" | "close_date">) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayStr = getLocalYYYYMMDD(today);
  const tomorrowStr = getLocalYYYYMMDD(tomorrow);

  if (ipo.close_date && ipo.close_date === todayStr) {
    return <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mt-1">Closing Today</span>;
  }

  if (ipo.open_date) {
    if (ipo.open_date === todayStr) {
      return <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mt-1">Opens Today</span>;
    }
    if (ipo.open_date === tomorrowStr) {
      return <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block mt-1">Opens Tomorrow</span>;
    }
  }
  const status = getLifecycleStatus(ipo);
  if (status === "open") {
    return <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mt-1">Open</span>;
  }
  if (status === "closed") {
    return <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mt-1">Closed</span>;
  }
  return <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block mt-1">Upcoming</span>;
}

function compareByClosingSoon(a: IpoRow, b: IpoRow) {
  const aTimestamp = a.close_date ? Date.parse(a.close_date) : null;
  const bTimestamp = b.close_date ? Date.parse(b.close_date) : null;
  if (aTimestamp == null && bTimestamp == null) return 0;
  if (aTimestamp == null) return 1;
  if (bTimestamp == null) return -1;
  return aTimestamp - bTimestamp;
}

export default function GmpTableClient({
  data,
  gmpMap,
  filterStatus,
  sort,
  activeOnly,
  typeFilter,
}: Props) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  
  // Date range filter state (Default to "60days" as requested by user)
  const [timeRange, setTimeRange] = useState<"60days" | "30days" | "6months" | "1year" | "all" | "custom">("60days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    let rows = sortIposByNewestOpenDate(data);

    // Apply Date Range Filter (Default: Last 60 Days + Active/Upcoming)
    const today = new Date();
    const todayStr = getLocalYYYYMMDD(today);

    if (timeRange === "60days") {
      const past60 = new Date(today);
      past60.setDate(today.getDate() - 60);
      const cutoffStr = getLocalYYYYMMDD(past60);

      rows = rows.filter((ipo) => {
        const status = getLifecycleStatus(ipo);
        if (status === "open" || status === "upcoming") return true;
        const targetDate = ipo.listing_date || ipo.close_date || ipo.open_date;
        if (!targetDate) return true;
        return targetDate >= cutoffStr;
      });
    } else if (timeRange === "30days") {
      const past30 = new Date(today);
      past30.setDate(today.getDate() - 30);
      const cutoffStr = getLocalYYYYMMDD(past30);

      rows = rows.filter((ipo) => {
        const status = getLifecycleStatus(ipo);
        if (status === "open" || status === "upcoming") return true;
        const targetDate = ipo.listing_date || ipo.close_date || ipo.open_date;
        if (!targetDate) return true;
        return targetDate >= cutoffStr;
      });
    } else if (timeRange === "6months") {
      const past180 = new Date(today);
      past180.setDate(today.getDate() - 180);
      const cutoffStr = getLocalYYYYMMDD(past180);

      rows = rows.filter((ipo) => {
        const targetDate = ipo.listing_date || ipo.close_date || ipo.open_date;
        if (!targetDate) return true;
        return targetDate >= cutoffStr;
      });
    } else if (timeRange === "1year") {
      const past365 = new Date(today);
      past365.setDate(today.getDate() - 365);
      const cutoffStr = getLocalYYYYMMDD(past365);

      rows = rows.filter((ipo) => {
        const targetDate = ipo.listing_date || ipo.close_date || ipo.open_date;
        if (!targetDate) return true;
        return targetDate >= cutoffStr;
      });
    } else if (timeRange === "custom" && (customStart || customEnd)) {
      rows = rows.filter((ipo) => {
        const targetDate = ipo.open_date || ipo.close_date || ipo.listing_date;
        if (!targetDate) return true;
        if (customStart && targetDate < customStart) return false;
        if (customEnd && targetDate > customEnd) return false;
        return true;
      });
    }

    if (filterStatus) {
      const normalizedStatus = filterStatus.toLowerCase();
      rows = rows.filter((ipo) => getLifecycleStatus(ipo) === normalizedStatus);
    }

    if (activeOnly) {
      rows = rows.filter((ipo) => {
        const status = getLifecycleStatus(ipo);
        return status === "open" || status === "upcoming";
      });
    }

    if (typeFilter) {
      const normalizedType = typeFilter.toLowerCase();
      rows = rows.filter((ipo) => (ipo.ipo_type ?? "").toLowerCase() === normalizedType);
    }

    if (debounced) {
      rows = rows.filter((ipo) => ipo.name.toLowerCase().includes(debounced));
    }

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const aVal = sortKey === "gmp" ? a.gmp ?? 0 : sortKey === "sub" ? a.sub_total ?? 0 : 0;
        const bVal = sortKey === "gmp" ? b.gmp ?? 0 : sortKey === "sub" ? b.sub_total ?? 0 : 0;
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      });
    } else if (sort === "gmp") {
      rows = [...rows].sort((a, b) => (b.gmp ?? 0) - (a.gmp ?? 0));
    } else if (sort === "sub") {
      rows = [...rows].sort((a, b) => (b.sub_total ?? 0) - (a.sub_total ?? 0));
    } else if (sort === "closing") {
      rows = [...rows].sort(compareByClosingSoon);
    }

    return rows;
  }, [activeOnly, customEnd, customStart, data, debounced, filterStatus, sort, sortDir, sortKey, timeRange, typeFilter]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function highlight(text: string) {
    if (!debounced) return text;
    const idx = text.toLowerCase().indexOf(debounced);
    if (idx === -1) return text;

    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-200 px-0.5 rounded text-black">
          {text.slice(idx, idx + debounced.length)}
        </mark>
        {text.slice(idx + debounced.length)}
      </>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Top Compare Banner if active issues available */}
      {(() => {
        const openOrUpcoming = data.filter((i) => {
          const s = getLifecycleStatus(i);
          return s === "open" || s === "upcoming";
        });
        if (openOrUpcoming.length >= 2) {
          const ipoA = openOrUpcoming[0];
          const ipoB = openOrUpcoming[1];
          return (
            <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#1C317A]/10 text-[#1C317A] dark:bg-[#1C317A]/25 dark:text-[#93B4FF] text-[11px] font-bold shrink-0">
                  Compare
                </span>
                <span className="text-[13px] text-gray-700 dark:text-[#CBD5E1] truncate">
                  Compare active issues: <strong className="text-[#0f172a] dark:text-[#F1F5F9]">{ipoA.name}</strong> vs <strong className="text-[#0f172a] dark:text-[#F1F5F9]">{ipoB.name}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/compare?ipos=${ipoA.slug},${ipoB.slug}`}
                  className="inline-flex items-center text-[12px] font-semibold text-[#1C317A] dark:text-[#93B4FF] hover:underline"
                >
                  Side-by-Side Comparison
                </Link>
              </div>
            </div>
          );
        }
        return null;
      })()}

      {/* 2-Level Filter Ribbon */}
      <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 shadow-xs flex flex-col gap-3">
        {/* Level 1: Primary Status Tabs & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex bg-gray-50 dark:bg-[#171B20] p-0.5 rounded-md border border-gray-200 dark:border-[#252A31]">
            {[
              { id: "all", label: "All" },
              { id: "open", label: "Open" },
              { id: "upcoming", label: "Upcoming" },
              { id: "closed", label: "Closed" },
            ].map((tab) => {
              const currentStatus = (filterStatus ?? "all").toLowerCase();
              const isMatch = currentStatus === tab.id;
              const href = tab.id === "all" ? "/gmp" : `/gmp?status=${tab.id}`;
              return (
                <Link
                  key={tab.id}
                  href={href}
                  className={`px-3 py-1 text-[11.5px] font-semibold rounded transition-colors ${
                    isMatch
                      ? "bg-white dark:bg-white text-[#0f172a] dark:text-black shadow-xs font-semibold"
                      : "text-gray-500 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-[#F1F5F9]"
                  }`}
                  scroll={false}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* Search Box & Alerts Pill */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <svg className="h-4 w-4 text-gray-400 dark:text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder="Search IPO by company name…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-gray-900 dark:text-[#F1F5F9] placeholder-gray-400 dark:placeholder-[#6B7280] rounded-md text-[13px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-1 dark:focus:ring-white transition-colors"
              />
            </div>
            <Link
              href="/alerts"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-blue-200 dark:border-blue-900/40 bg-blue-50/60 dark:bg-[#151D2A] text-blue-700 dark:text-blue-300 text-[11.5px] font-medium hover:bg-blue-100 transition-colors shrink-0"
              title="Subscribe to daily morning GMP alerts"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Daily Alerts
            </Link>
          </div>
        </div>

        {/* Level 2: Secondary Dropdowns Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-gray-100 dark:border-[#252A31] text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 dark:text-[#9AA1AA] font-medium">Sort:</span>
              <select
                value={sortKey ?? (sort ?? "default")}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "gmp") { setSortKey("gmp"); setSortDir("desc"); }
                  else if (val === "sub") { setSortKey("sub"); setSortDir("desc"); }
                  else { setSortKey(null); }
                }}
                className="px-2 py-1 bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-gray-800 dark:text-[#F1F5F9] rounded-md text-xs font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-1 dark:focus:ring-white"
              >
                <option value="default">Default (Newest)</option>
                <option value="gmp">Highest GMP</option>
                <option value="sub">Most Subscribed</option>
              </select>
            </div>

            {/* Period Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 dark:text-[#9AA1AA] font-medium">Period:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-2 py-1 bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-gray-800 dark:text-[#F1F5F9] rounded-md text-xs font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-1 dark:focus:ring-white"
              >
                <option value="60days">Last 60 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last 1 Year</option>
                <option value="all">All Time</option>
              </select>
            </div>

            {/* Segment Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 dark:text-[#9AA1AA] font-medium">Segment:</span>
              <select
                value={typeFilter ?? "all"}
                onChange={(e) => {
                  const val = e.target.value;
                  const url = new URL(window.location.href);
                  if (val === "all") url.searchParams.delete("type");
                  else url.searchParams.set("type", val);
                  window.history.pushState({}, "", url.toString());
                  window.location.reload();
                }}
                className="px-2 py-1 bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-gray-800 dark:text-[#F1F5F9] rounded-md text-xs font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-1 dark:focus:ring-white"
              >
                <option value="all">All Segments</option>
                <option value="mainboard">Mainboard Only</option>
                <option value="sme">SME Only</option>
              </select>
            </div>
          </div>

          <span className="text-[12px] font-medium text-gray-500 dark:text-[#9AA1AA]">
            Showing <strong className="text-gray-900 dark:text-[#F1F5F9]">{filtered.length}</strong> IPOs
          </span>
        </div>
      </div>

      {/* Tabular Layout */}
      <div className="w-full max-h-[75vh] overflow-auto overscroll-contain bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg shadow-xs">
        <table className="min-w-max w-full text-left relative">
          <thead className="bg-[#f8fafc] dark:bg-[#171B20] border-b border-gray-200 dark:border-[#252A31] text-[#475569] dark:text-[#9AA1AA] font-medium sticky top-0 z-30 shadow-xs">
            <tr className="divide-x divide-gray-200 dark:divide-[#252A31]">
              <th className="p-2.5 sm:p-3 uppercase text-[11px] tracking-wider w-[140px] sm:w-[160px] md:w-[220px] sticky left-0 z-40 bg-[#f8fafc] dark:bg-[#171B20] border-r border-gray-200 dark:border-[#252A31]">IPO Name</th>
              <th className="p-2.5 sm:p-3 uppercase text-[11px] tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-[#F1F3F5]" onClick={() => toggleSort("gmp")}>
                GMP {sortKey === "gmp" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
              </th>
              <th className="p-2.5 sm:p-3 uppercase text-[11px] tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-[#F1F5F9]" onClick={() => toggleSort("sub")}>
                Sub {sortKey === "sub" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
              </th>
              <th className="p-2.5 sm:p-3 uppercase text-[11px] tracking-wider">Price Band</th>
              <th className="p-2.5 sm:p-3 uppercase text-[11px] tracking-wider">Size</th>
              <th className="p-2.5 sm:p-3 uppercase text-[11px] tracking-wider">Dates</th>
              <th className="p-2.5 sm:p-3 uppercase text-[11px] tracking-wider">Listing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#252A31] text-xs sm:text-[13px]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-[#9AA1AA]">
                  No IPOs found matching your filters.
                </td>
              </tr>
            ) : (
              filtered.map((ipo) => {
                const latest = gmpMap?.[String(ipo.id)]?.latest;
                const prev = gmpMap?.[String(ipo.id)]?.prev;
                const trend = ipo.gmp_trend ?? (latest != null && prev != null ? latest - prev : 0);
                
                return (
                  <tr key={ipo.id} className="group transition-colors divide-x divide-gray-200 dark:divide-[#252A31] bg-white dark:bg-[#111418] hover:bg-gray-50 dark:hover:bg-[#171B20]/60">
                    <td className="p-2.5 sm:p-3 w-[140px] sm:w-[160px] md:w-[220px] sticky left-0 z-20 bg-white dark:bg-[#111418] group-hover:bg-gray-50 dark:group-hover:bg-[#171B20] border-r border-gray-200 dark:border-[#252A31]">
                      <Link href={`/ipo/${ipo.slug}`} className="font-semibold text-gray-900 dark:text-[#F1F5F9] hover:text-blue-600 dark:hover:text-blue-400 block whitespace-normal break-words">
                        {highlight(ipo.name)}
                      </Link>
                      {getUrgencyBadge(ipo)}
                    </td>
                    <td className="p-2.5 sm:p-3">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <span className="font-bold text-gray-900 dark:text-[#F1F5F9]">
                            {ipo.gmp != null ? `₹${ipo.gmp}` : "-"}
                          </span>
                          {trend !== 0 && (
                            <span className={`text-[9px] sm:text-[10px] font-semibold px-1 py-0.5 rounded ${
                              trend > 0 
                                ? "text-emerald-700 bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300" 
                                : "text-rose-700 bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300"
                            }`}>
                              {trend > 0 ? "↑" : "↓"}{Math.abs(trend)}
                            </span>
                          )}
                        </div>
                        {ipo.gmp != null && (
                          <div className="flex flex-col">
                            {ipo.price_max && (
                              <span className={`text-[10px] font-semibold ${ipo.gmp >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                Est. {ipo.gmp > 0 ? "+" : ""}{((ipo.gmp / ipo.price_max) * 100).toFixed(1)}%
                              </span>
                            )}
                            {ipo.lot_size && (
                              <Link
                                href={`/ipo-profit-calculator?gmp=${ipo.gmp}&price=${ipo.price_max ?? ipo.price_min}&lot=${ipo.lot_size}`}
                                className="text-[10px] text-gray-500 dark:text-[#9AA1AA] hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline tabular-nums"
                                title="Calculate expected listing profit per lot"
                              >
                                {ipo.gmp >= 0 ? "+" : ""}₹{(Number(ipo.gmp) * Number(ipo.lot_size)).toLocaleString("en-IN")}/lot
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2.5 sm:p-3 text-[#334155] dark:text-[#9AA1AA] font-medium tabular-nums">
                      {formatSubscriptionTimes(ipo.sub_total)}
                    </td>
                    <td className="p-2.5 sm:p-3 text-gray-600 dark:text-[#9AA1AA] whitespace-nowrap">
                      {ipo.price_min && ipo.price_max ? `₹${ipo.price_min} - ₹${ipo.price_max}` : "-"}
                    </td>
                    <td className="p-2.5 sm:p-3 text-gray-600 dark:text-[#9AA1AA] whitespace-nowrap">
                      {ipo.issue_size ?? "-"}
                    </td>
                    <td className="p-2.5 sm:p-3 text-gray-600 dark:text-[#9AA1AA]">
                      {ipo.open_date ? (
                        <div className="flex flex-col xl:flex-row xl:gap-1 whitespace-nowrap">
                          <span>{formatShortDate(ipo.open_date)}</span>
                          <span className="hidden xl:inline">-</span>
                          <span>{formatShortDate(ipo.close_date)}</span>
                        </div>
                      ) : "-"}
                    </td>
                    <td className="p-2.5 sm:p-3 text-gray-600 dark:text-[#9AA1AA] whitespace-nowrap">
                      {ipo.listing_date ? formatDisplayDate(ipo.listing_date) : "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

