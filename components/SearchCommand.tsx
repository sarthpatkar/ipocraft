"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon, XMarkIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

type SearchResult = {
  id: number;
  slug: string;
  name: string;
  gmp: number | null;
  price_max: number | null;
  status: string | null;
  ipo_type: string | null;
};

const STATUS_COLORS: Record<string, string> = {
  Open: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border dark:border-emerald-800/40",
  Upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 dark:border dark:border-blue-800/40",
  Closed: "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 dark:border dark:border-rose-800/40",
  Listed: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 dark:border dark:border-purple-800/40",
};

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
    debounceRef.current = setTimeout(() => search(val), 250);
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
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl rounded-xl shadow-2xl overflow-hidden bg-white dark:bg-[#111B2D] border border-gray-200 dark:border-[#22304A]"
      >
        {/* Input row */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200 dark:border-[#22304A] bg-white dark:bg-[#162238]"
        >
          <MagnifyingGlassIcon className="w-5 h-5 shrink-0 text-gray-400 dark:text-[#94A3B8]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Search IPOs by name or symbol…"
            className="flex-1 bg-transparent text-[14.5px] outline-none text-gray-900 dark:text-[#F1F5F9] placeholder-gray-400 dark:placeholder-[#64748B]"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-[#94A3B8] dark:hover:text-[#F1F5F9]">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="max-h-[360px] overflow-y-auto py-2 divide-y divide-gray-100 dark:divide-[#22304A]/60">
            {results.map((ipo, i) => {
              const isActive = i === activeIndex;
              const gmpColor = ipo.gmp != null
                ? (ipo.gmp >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400")
                : "text-gray-400 dark:text-[#64748B]";

              return (
                <li key={ipo.id}>
                  <Link
                    href={`/ipo/${ipo.slug}`}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isActive 
                        ? "bg-blue-50/60 dark:bg-[#162238]" 
                        : "hover:bg-gray-50 dark:hover:bg-[#162238]/50"
                    }`}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    {/* Name + type */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-gray-900 dark:text-[#F1F5F9] truncate">{ipo.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {ipo.ipo_type && (
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            ipo.ipo_type.toLowerCase() === "sme" 
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" 
                              : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                          }`}>
                            {ipo.ipo_type.toUpperCase()}
                          </span>
                        )}
                        {ipo.status && (
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${STATUS_COLORS[ipo.status] ?? "bg-gray-100 text-gray-600 dark:bg-[#162238] dark:text-[#94A3B8]"}`}>
                            {ipo.status}
                          </span>
                        )}
                      </div>
                    </div>


                    {/* GMP + arrow */}
                    <div className="flex items-center gap-2 shrink-0">
                      {ipo.gmp != null && (
                        <span className={`text-[13px] font-semibold tabular-nums ${gmpColor}`}>
                          GMP ₹{ipo.gmp}
                        </span>
                      )}
                      <ArrowRightIcon className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Empty state */}
        {query.length > 1 && !loading && results.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-[13px] text-gray-500 dark:text-slate-400">
              No IPOs found for &ldquo;<strong className="text-gray-800 dark:text-slate-200">{query}</strong>&rdquo;
            </p>
          </div>
        )}

        {/* Hint when empty */}
        {query.length === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="text-[12px] text-gray-500 dark:text-slate-400">
              Type to search across all IPOs — Mainboard &amp; SME
            </p>
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center gap-3 px-4 py-2 border-t border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-[#0f172a] text-[11px] text-gray-500 dark:text-slate-400"
        >
          <span><kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px]">↑↓</kbd> navigate</span>
          <span><kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px]">↵</kbd> open</span>
          <span><kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px]">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
