"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  ArrowRightIcon,
  BanknotesIcon,
  ChartBarIcon,
  UsersIcon,
  CheckBadgeIcon,
  BuildingStorefrontIcon
} from "@heroicons/react/24/outline";

type SearchResult = {
  id: number;
  slug: string;
  name: string;
  gmp: number | null;
  price_max: number | null;
  price_min: number | null;
  status: string | null;
  ipo_type: string | null;
  exchange?: string | null;
};

const QUICK_LINKS = [
  { href: "/ipo", label: "IPO Directory", desc: "Open, upcoming & listed issues", Icon: BanknotesIcon },
  { href: "/gmp", label: "GMP Tracker", desc: "Live Grey Market Premiums & momentum", Icon: ChartBarIcon },
  { href: "/sme-ipo", label: "SME IPO Hub", desc: "BSE SME & NSE Emerge listings", Icon: BuildingStorefrontIcon },
  { href: "/subscriptions", label: "Live Subscriptions", desc: "QIB, NII, and Retail bidding demand", Icon: UsersIcon },
  { href: "/allotment-status", label: "Allotment Status", desc: "Registrar & exchange verification", Icon: CheckBadgeIcon },
];

export default function SearchCommand({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setActiveIndex(0);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Search with debounce
  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/ipos?q=${encodeURIComponent(q)}&limit=8`);
      const data = await res.json();
      setResults(data.items ?? []);
      setActiveIndex(0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      onClose();
      window.location.href = `/ipo/${results[activeIndex].slug}`;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl rounded-lg shadow-md overflow-hidden bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] focus-within:border-black dark:focus-within:border-white focus-within:ring-1 focus-within:ring-black dark:focus-within:ring-white transition-colors"
      >
        {/* Input row */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#171B20]"
        >
          <MagnifyingGlassIcon className="w-5 h-5 shrink-0 text-gray-400 dark:text-[#9AA1AA]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Search IPOs by company name or symbol…"
            className="flex-1 bg-transparent text-[14px] outline-none text-gray-900 dark:text-[#F1F5F9] placeholder-gray-400 dark:placeholder-[#6B7280]"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-[#9AA1AA] dark:hover:text-[#F1F5F9]">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="max-h-[380px] overflow-y-auto py-1 divide-y divide-gray-100 dark:divide-[#252A31]">
            {results.map((ipo, i) => {
              const isActive = i === activeIndex;
              const price = Number(ipo.price_max ?? ipo.price_min ?? 0);
              const gmp = ipo.gmp != null ? Number(ipo.gmp) : null;
              const gmpPct = gmp != null && price > 0 ? ((gmp / price) * 100).toFixed(1) : null;
              const isPositive = gmp != null && gmp >= 0;

              const segment = ipo.ipo_type?.toLowerCase() === "sme"
                ? (ipo.exchange ? `${ipo.exchange} SME` : "SME")
                : "Mainboard";

              return (
                <li key={ipo.id}>
                  <Link
                    href={`/ipo/${ipo.slug}`}
                    onClick={onClose}
                    className={`flex items-center justify-between gap-3 px-4 py-2.5 transition-colors ${
                      isActive 
                        ? "bg-gray-50 dark:bg-[#171B20]" 
                        : "hover:bg-gray-50 dark:hover:bg-[#171B20]/60"
                    }`}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-semibold text-gray-900 dark:text-[#F1F5F9] truncate">
                        {ipo.name}
                      </p>
                      <p className="text-[11.5px] text-gray-500 dark:text-[#9AA1AA] mt-0.5">
                        {segment} · {ipo.status ?? "Upcoming"}
                      </p>
                    </div>

                    {/* GMP */}
                    <div className="flex items-center gap-3 shrink-0">
                      {gmp != null ? (
                        <div className="text-right">
                          <span className={`text-[12.5px] font-semibold tabular-nums ${
                            isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                          }`}>
                            {isPositive ? "+" : ""}₹{gmp}
                          </span>
                          {gmpPct && (
                            <span className="text-[10.5px] text-gray-500 dark:text-[#9AA1AA] block tabular-nums">
                              ({isPositive ? "+" : ""}{gmpPct}%)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-[#6B7280]">-</span>
                      )}
                      <ArrowRightIcon className="w-3.5 h-3.5 text-gray-400 dark:text-[#6B7280]" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Empty state when searching with no results */}
        {query.length > 1 && !loading && results.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-[13px] text-gray-500 dark:text-[#9AA1AA]">
              No IPOs found for &ldquo;<strong className="text-gray-800 dark:text-[#F1F5F9]">{query}</strong>&rdquo;
            </p>
          </div>
        )}

        {/* Quick Links Section when input is empty */}
        {query.length === 0 && (
          <div className="p-3 sm:p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-[#6B7280] mb-2 px-1">
              Quick Links
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {QUICK_LINKS.map((item) => {
                const Icon = item.Icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-[#171B20] text-left transition-colors group"
                  >
                    <div className="w-7 h-7 rounded bg-gray-100 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] flex items-center justify-center text-gray-600 dark:text-[#9AA1AA] group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-medium text-gray-800 dark:text-[#F1F5F9] group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                        {item.label}
                      </p>
                      <p className="text-[10.5px] text-gray-500 dark:text-[#9AA1AA] truncate">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Keyboard hints */}
        <div
          className="flex items-center gap-3 px-4 py-2 border-t border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#171B20] text-[11px] text-gray-500 dark:text-[#9AA1AA]"
        >
          <span><kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-[#252A31] bg-white dark:bg-[#111418] text-[10px]">↑↓</kbd> navigate</span>
          <span><kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-[#252A31] bg-white dark:bg-[#111418] text-[10px]">↵</kbd> select</span>
          <span><kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-[#252A31] bg-white dark:bg-[#111418] text-[10px]">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
