"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { sortIposByNewestOpenDate } from "@/lib/ipoSort";

type Ipo = {
  id: number;
  name: string;
  slug: string;
  gmp: number | null;
  sub_total: string | null;
  price_min: number | null;
  price_max: number | null;
  issue_size: string | null;
  open_date: string | null;
  close_date: string | null;
  allotment_date: string | null;
  listing_date: string | null;
  ipo_type: string | null;
};

type Props = {
  ipos: Ipo[];
  gmpMap?: Record<number, number>;
};

function formatDate(d?: string | null) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return "—";
  }
}

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-yellow-200 dark:bg-yellow-700/40 dark:text-yellow-200 rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

type FilterPillProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function FilterPill({ active, onClick, children }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-colors shrink-0 ${
        active
          ? "bg-[#1e3a8a] dark:bg-[#3B82F6] text-white border-transparent font-semibold"
          : "bg-white dark:bg-[#162238] text-gray-700 dark:text-[#94A3B8] border-gray-200 dark:border-[#22304A] hover:border-[#3B82F6]/50"
      }`}
    >
      {children}
    </button>
  );
}

export default function GmpTable({ ipos, gmpMap = {} }: Props) {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState<"none" | "gmp" | "sub">("none");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    let data = sortIposByNewestOpenDate(ipos);

    if (debounced) {
      data = data.filter((ipo) =>
        ipo.name.toLowerCase().includes(debounced.toLowerCase())
      );
    }

    if (type !== "all") {
      data = data.filter((ipo) => ipo.ipo_type === type);
    }

    if (sort === "gmp") {
      data = [...data].sort((a, b) => (b.gmp || 0) - (a.gmp || 0));
    } else if (sort === "sub") {
      data = [...data].sort(
        (a, b) =>
          parseFloat(b.sub_total || "0") - parseFloat(a.sub_total || "0")
      );
    }

    return data;
  }, [ipos, debounced, type, sort]);

  return (
    <div className="w-full">
      {/* ── Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-3.5 h-3.5 text-gray-400 dark:text-[#64748B]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="search"
            placeholder="Search IPO…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 dark:border-[#22304A] bg-white dark:bg-[#162238] text-gray-900 dark:text-[#F1F5F9] placeholder-gray-400 dark:placeholder-[#64748B] rounded-lg pl-8 pr-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-colors"
          />
        </div>

        {/* Type filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          <FilterPill active={type === "all"} onClick={() => setType("all")}>All</FilterPill>
          <FilterPill active={type === "mainboard"} onClick={() => setType("mainboard")}>Mainboard</FilterPill>
          <FilterPill active={type === "sme"} onClick={() => setType("sme")}>SME</FilterPill>
        </div>

        {/* Sort pills */}
        <div className="flex gap-1.5 flex-wrap">
          <FilterPill active={sort === "none"} onClick={() => setSort("none")}>Default</FilterPill>
          <FilterPill active={sort === "gmp"} onClick={() => setSort("gmp")}>Highest GMP</FilterPill>
          <FilterPill active={sort === "sub"} onClick={() => setSort("sub")}>Most Subscribed</FilterPill>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="w-full overflow-x-auto overscroll-x-contain rounded-xl border border-[#e2e8f0] dark:border-[#22304A]">
        <table className="min-w-[860px] w-full text-[13px]">
          <thead className="bg-[#f8fafc] dark:bg-[#0D1525] sticky top-0">
            <tr className="text-left">
              {["IPO", "GMP", "Subscription", "Price Band", "Size", "Open", "Close", "Allotment", "Listing"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-[10.5px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] border-b border-[#e2e8f0] dark:border-[#22304A] whitespace-nowrap"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#22304A]">
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-12 text-[#64748B] dark:text-[#94A3B8] text-[13px]"
                >
                  No IPOs found for the selected filters.
                </td>
              </tr>
            )}

            {filtered.map((ipo) => {
              const gmp = ipo.gmp ?? gmpMap[ipo.id] ?? null;
              const isPositive = gmp != null && gmp >= 0;
              const isNegative = gmp != null && gmp < 0;

              return (
                <tr
                  key={ipo.id}
                  className="hover:bg-[#f8fafc] dark:hover:bg-[#162238] transition-colors bg-white dark:bg-[#111B2D]"
                >
                  {/* IPO Name */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/ipo/${ipo.slug}`}
                      className="font-semibold text-[#0f172a] dark:text-[#F1F5F9] hover:text-blue-600 dark:hover:text-[#3B82F6] transition-colors"
                    >
                      {highlight(ipo.name, debounced)}
                    </Link>
                    {ipo.ipo_type && (
                      <span
                        className={`ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          ipo.ipo_type.toLowerCase() === "sme"
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                            : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                        }`}
                      >
                        {ipo.ipo_type.toUpperCase()}
                      </span>
                    )}
                  </td>

                  {/* GMP */}
                  <td className="px-4 py-3 font-semibold tabular-nums whitespace-nowrap">
                    {gmp != null ? (
                      <span
                        className={
                          isPositive
                            ? "text-emerald-600 dark:text-[#34D399]"
                            : isNegative
                            ? "text-rose-600 dark:text-[#F87171]"
                            : "text-[#0f172a] dark:text-[#F1F5F9]"
                        }
                      >
                        {isPositive ? "+" : ""}₹{gmp}
                        {ipo.price_max && (
                          <span className="ml-1 text-[10.5px] opacity-70 font-medium">
                            ({((gmp / ipo.price_max) * 100).toFixed(1)}%)
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-[#94A3B8]">—</span>
                    )}
                  </td>

                  {/* Subscription */}
                  <td className="px-4 py-3 font-semibold tabular-nums text-[#0f172a] dark:text-[#F1F5F9]">
                    {ipo.sub_total ? `${ipo.sub_total}×` : <span className="text-[#94A3B8]">—</span>}
                  </td>

                  {/* Price Band */}
                  <td className="px-4 py-3 text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">
                    {ipo.price_min && ipo.price_max
                      ? `₹${ipo.price_min} – ₹${ipo.price_max}`
                      : "—"}
                  </td>

                  {/* Issue Size */}
                  <td className="px-4 py-3 text-[#475569] dark:text-[#94A3B8]">
                    {ipo.issue_size ?? "—"}
                  </td>

                  {/* Dates */}
                  <td className="px-4 py-3 text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">{formatDate(ipo.open_date)}</td>
                  <td className="px-4 py-3 text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">{formatDate(ipo.close_date)}</td>
                  <td className="px-4 py-3 text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">{formatDate(ipo.allotment_date)}</td>
                  <td className="px-4 py-3 text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">{formatDate(ipo.listing_date)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Row count */}
      <p className="mt-3 text-[11.5px] text-[#94A3B8] dark:text-[#64748B]">
        Showing {filtered.length} of {ipos.length} IPOs
      </p>
    </div>
  );
}
