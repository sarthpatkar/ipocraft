"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";

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

const ROW_HEIGHT = 48;
const VISIBLE_COUNT = 18; // virtualization window

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
  const [scrollTop, setScrollTop] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    let rows = data;

    if (debounced) {
      rows = rows.filter((ipo) =>
        ipo.name.toLowerCase().includes(debounced)
      );
    }

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const aVal =
          sortKey === "gmp"
            ? a.gmp ?? 0
            : sortKey === "sub"
            ? a.sub_total ?? 0
            : 0;

        const bVal =
          sortKey === "gmp"
            ? b.gmp ?? 0
            : sortKey === "sub"
            ? b.sub_total ?? 0
            : 0;

        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      });
    }

    return rows;
  }, [data, debounced, sortKey, sortDir]);

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
        <mark className="bg-yellow-200 px-0.5 rounded">
          {text.slice(idx, idx + debounced.length)}
        </mark>
        {text.slice(idx + debounced.length)}
      </>
    );
  }

  // virtualization math
  const totalHeight = filtered.length * ROW_HEIGHT;
  const startIndex = Math.floor(scrollTop / ROW_HEIGHT);
  const endIndex = startIndex + VISIBLE_COUNT;
  const visibleRows = filtered.slice(startIndex, endIndex);

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    setScrollTop(e.currentTarget.scrollTop);
  }

  return (
    <div className="w-full">
      {/* Search */}
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-2">
        <input
          type="text"
          placeholder="Search IPO..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="text-xs text-gray-500">
          {filtered.length} IPOs
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="relative w-full overflow-x-auto">
        {/* Mobile swipe hint */}
        <div className="md:hidden text-xs text-gray-500 mb-1 animate-pulse">
          ← Swipe →
        </div>

        {/* Virtual scroll container */}
        <div
          ref={containerRef}
          onScroll={onScroll}
          className="max-h-[70vh] overflow-y-auto border border-gray-200 rounded-lg"
        >
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 sticky top-0 z-20">
              <tr>
                <th className="px-3 py-2 text-left sticky left-0 bg-gray-50 z-30 shadow">
                  IPO
                </th>

                <th
                  className="px-3 py-2 cursor-pointer select-none"
                  onClick={() => toggleSort("gmp")}
                >
                  GMP{" "}
                  {sortKey === "gmp"
                    ? sortDir === "asc"
                      ? "▲"
                      : "▼"
                    : "↕"}
                </th>

                <th
                  className="px-3 py-2 cursor-pointer select-none"
                  onClick={() => toggleSort("sub")}
                >
                  Sub{" "}
                  {sortKey === "sub"
                    ? sortDir === "asc"
                      ? "▲"
                      : "▼"
                    : "↕"}
                </th>

                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Issue</th>
                <th className="px-3 py-2">Open</th>
                <th className="px-3 py-2">Close</th>
                <th className="px-3 py-2">List</th>
              </tr>
            </thead>

            <tbody>
              {/* spacer top */}
              <tr style={{ height: startIndex * ROW_HEIGHT }} />

              {visibleRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-8 text-gray-500"
                  >
                    No IPOs found for selected filters
                  </td>
                </tr>
              ) : (
                visibleRows.map((ipo) => {
                  const trend = ipo.gmp_trend ?? 0;

                  return (
                    <MemoRow
                      key={ipo.id}
                      ipo={ipo}
                      trend={trend}
                      highlight={highlight}
                    />
                  );
                })
              )}

              {/* spacer bottom */}
              <tr
                style={{
                  height:
                    totalHeight -
                    endIndex * ROW_HEIGHT,
                }}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= ROW ================= */

type RowProps = {
  ipo: IpoRow;
  trend: number;
  highlight: (t: string) => React.ReactNode;
};

const Row = ({ ipo, trend, highlight }: RowProps) => {
  return (
    <tr className="border-t hover:bg-gray-50 transition h-[48px]">
      {/* Sticky name */}
      <td className="px-3 py-2 sticky left-0 bg-white z-10 shadow-sm font-medium">
        <Link
          href={`/ipo/${ipo.slug}`}
          className="hover:text-blue-600"
        >
          {highlight(ipo.name)}
        </Link>
      </td>

      <td className="px-3 py-2">
        <div className="flex items-center gap-1">
          <span className="font-semibold">
            {ipo.gmp ?? "-"}
          </span>

          {trend !== 0 && (
            <span
              className={`text-xs font-medium ${
                trend > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}
            </span>
          )}
        </div>
      </td>

      <td className="px-3 py-2">
        {ipo.sub_total ?? "-"}
      </td>

      <td className="px-3 py-2">
        {ipo.price_min && ipo.price_max
          ? `₹${ipo.price_min} - ₹${ipo.price_max}`
          : "-"}
      </td>

      <td className="px-3 py-2">
        {ipo.issue_size ?? "-"}
      </td>

      <td className="px-3 py-2">
        {ipo.open_date ?? "-"}
      </td>

      <td className="px-3 py-2">
        {ipo.close_date ?? "-"}
      </td>

      <td className="px-3 py-2">
        {ipo.listing_date ?? "-"}
      </td>
    </tr>
  );
};

// memoized row for Lighthouse performance
const MemoRow = React.memo(Row);