"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { sortIposByNewestOpenDate } from "@/lib/ipoSort";

type IpoRow = {
  id: number;
  name: string;
  slug: string;
  gmp: number | null;
  sub_total: number | null;
  price_min: number | null;
  price_max: number | null;
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

function getLifecycleStatus(ipo: Pick<IpoRow, "open_date" | "close_date">) {
  const today = new Date();
  if (ipo.close_date) {
    const closeDate = new Date(ipo.close_date);
    if (closeDate < today) return "closed";
  }
  if (ipo.open_date) {
    const openDate = new Date(ipo.open_date);
    if (openDate > today) return "upcoming";
    return "open";
  }
  return "upcoming";
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

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    let rows = sortIposByNewestOpenDate(data);

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
  }, [activeOnly, data, debounced, filterStatus, sort, sortDir, sortKey, typeFilter]);

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
    <div className="w-full flex flex-col gap-4">
      {/* Modern Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search IPOs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>
        <div className="text-sm font-medium text-gray-500">
          Showing {filtered.length} IPOs
        </div>
      </div>

      {/* Tabular Layout (Maintained across all screen sizes) */}
      <div className="w-full max-h-[75vh] overflow-auto overscroll-contain bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="min-w-max w-full text-left relative">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium sticky top-0 z-30 shadow-sm">
            <tr className="divide-x divide-gray-100">
              <th className="p-2 sm:p-3 md:p-4 uppercase text-xs tracking-wider w-[140px] sm:w-[160px] md:w-[220px] sticky left-0 z-40 bg-gray-50 drop-shadow-[2px_0_4px_rgba(0,0,0,0.05)] border-r border-gray-200">IPO Name</th>
              <th className="p-2 sm:p-3 md:p-4 uppercase text-xs tracking-wider cursor-pointer hover:text-gray-700" onClick={() => toggleSort("gmp")}>
                GMP {sortKey === "gmp" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
              </th>
              <th className="p-2 sm:p-3 md:p-4 uppercase text-xs tracking-wider cursor-pointer hover:text-gray-700" onClick={() => toggleSort("sub")}>
                Sub {sortKey === "sub" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
              </th>
              <th className="p-2 sm:p-3 md:p-4 uppercase text-xs tracking-wider">Price Band</th>
              <th className="p-2 sm:p-3 md:p-4 uppercase text-xs tracking-wider">Size</th>
              <th className="p-2 sm:p-3 md:p-4 uppercase text-xs tracking-wider">Dates</th>
              <th className="p-2 sm:p-3 md:p-4 uppercase text-xs tracking-wider">Listing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No IPOs found matching your filters.
                </td>
              </tr>
            ) : (
              filtered.map((ipo) => {
                const latest = gmpMap?.[String(ipo.id)]?.latest;
                const prev = gmpMap?.[String(ipo.id)]?.prev;
                const trend = ipo.gmp_trend ?? (latest != null && prev != null ? latest - prev : 0);
                
                return (
                  <tr key={ipo.id} className="group hover:bg-gray-50 transition-colors divide-x divide-gray-100">
                    <td className="p-2 sm:p-3 md:p-4 w-[140px] sm:w-[160px] md:w-[220px] sticky left-0 z-20 bg-white group-hover:bg-gray-50 drop-shadow-[2px_0_4px_rgba(0,0,0,0.05)] border-r border-gray-100">
                      <Link href={`/ipo/${ipo.slug}`} className="font-semibold text-gray-900 hover:text-blue-600 block whitespace-normal break-words">
                        {highlight(ipo.name)}
                      </Link>
                    </td>
                    <td className="p-2 sm:p-3 md:p-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="font-bold text-gray-900">
                          {ipo.gmp != null ? `₹${ipo.gmp}` : "-"}
                        </span>
                        {trend !== 0 && (
                          <span className={`text-[9px] sm:text-xs font-semibold px-1 py-0.5 rounded ${trend > 0 ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}`}>
                            {trend > 0 ? "↑" : "↓"}{Math.abs(trend)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-2 sm:p-3 md:p-4 font-medium text-gray-800">
                      {ipo.sub_total ? `${ipo.sub_total}x` : "-"}
                    </td>
                    <td className="p-2 sm:p-3 md:p-4 text-gray-600 whitespace-nowrap">
                      {ipo.price_min && ipo.price_max ? `₹${ipo.price_min} - ${ipo.price_max}` : "-"}
                    </td>
                    <td className="p-2 sm:p-3 md:p-4 text-gray-600 whitespace-nowrap">
                      {ipo.issue_size ?? "-"}
                    </td>
                    <td className="p-2 sm:p-3 md:p-4 text-gray-600">
                      {ipo.open_date ? (
                        <div className="flex flex-col xl:flex-row xl:gap-1">
                          <span className="whitespace-nowrap">{ipo.open_date.slice(0, 5)}</span>
                          <span className="hidden xl:inline">to</span>
                          <span className="whitespace-nowrap">{ipo.close_date?.slice(0, 5)}</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2 sm:p-3 md:p-4 text-gray-600 whitespace-nowrap">
                      {ipo.listing_date ?? "-"}
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
