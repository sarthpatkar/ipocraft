"use client";

import { useEffect, useState } from "react";
import IpoList from "@/components/IpoList";
import IpoTable from "@/components/IpoTable";
import type { IPOListItem } from "@/components/IpoCard";
import type { IpoCursor } from "@/lib/ipoFeed";
import { TableCellsIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

type IpoFeedApiResponse = {
  items: IPOListItem[];
  hasMore: boolean;
  nextCursor: IpoCursor | null;
  snapshot: string;
};

type Props = {
  initialItems: IPOListItem[];
  initialHasMore: boolean;
  initialNextCursor: IpoCursor | null;
  snapshot: string;
  status?: string;
  type?: string;
  q?: string;
  limit?: number;
  emptyMessage?: string;
};

const DEFAULT_LIMIT = 10;

export default function IpoLoadMoreClient({
  initialItems,
  initialHasMore,
  initialNextCursor,
  snapshot,
  status,
  type,
  q,
  limit = DEFAULT_LIMIT,
  emptyMessage,
}: Props) {
  const [items, setItems] = useState<IPOListItem[]>(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextCursor, setNextCursor] = useState<IpoCursor | null>(initialNextCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  useEffect(() => {
    setItems(initialItems);
    setHasMore(initialHasMore);
    setNextCursor(initialNextCursor);
    setError(null);
    setLoading(false);
  }, [initialHasMore, initialItems, initialNextCursor, snapshot, status, type, q]);

  async function loadMore() {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("limit", String(limit));
      params.set("snapshot", snapshot);

      if (status) params.set("status", status);
      if (type) params.set("type", type);
      if (q) params.set("q", q);
      if (nextCursor?.open_date) params.set("cursorOpenDate", nextCursor.open_date);
      if (nextCursor?.created_at) params.set("cursorCreatedAt", nextCursor.created_at);
      if (nextCursor?.slug) params.set("cursorSlug", nextCursor.slug);

      const response = await fetch(`/api/ipos?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load more IPOs");
      }

      const payload = (await response.json()) as IpoFeedApiResponse;

      setItems((prev) => {
        const seen = new Set(prev.map((ipo) => ipo.id));
        const merged = [...prev];
        for (const ipo of payload.items ?? []) {
          if (seen.has(ipo.id)) continue;
          seen.add(ipo.id);
          merged.push(ipo);
        }
        return merged;
      });

      setHasMore(Boolean(payload.hasMore));
      setNextCursor(payload.nextCursor ?? null);
    } catch (err) {
      console.error("Load-more error:", err);
      setError("Unable to load more IPOs. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* View Switcher & Result Count */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[12px] font-medium text-gray-500 dark:text-[#9AA1AA]">
          Showing {items.length} {status ? status.toLowerCase() : ""} IPO{items.length === 1 ? "" : "s"}
        </span>

        {/* View toggle (Cards / Table) */}
        <div className="hidden sm:flex items-center gap-1 rounded-md border border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#171B20] p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11.5px] font-medium transition-colors ${
              viewMode === "cards"
                ? "bg-white dark:bg-white text-[#0f172a] dark:text-black font-semibold shadow-xs"
                : "text-gray-500 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-[#F1F5F9]"
            }`}
          >
            <Squares2X2Icon className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11.5px] font-medium transition-colors ${
              viewMode === "table"
                ? "bg-white dark:bg-white text-[#0f172a] dark:text-black font-semibold shadow-xs"
                : "text-gray-500 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-[#F1F5F9]"
            }`}
          >
            <TableCellsIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Cards by default, Table if toggled */}
      {viewMode === "table" ? (
        <>
          <div className="hidden sm:block">
            <IpoTable items={items} emptyMessage={emptyMessage} />
          </div>
          <div className="block sm:hidden">
            <IpoList items={items} emptyMessage={emptyMessage} />
          </div>
        </>
      ) : (
        <IpoList items={items} emptyMessage={emptyMessage} />
      )}

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md border border-gray-900 dark:border-white bg-gray-900 text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 px-5 py-2 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 shadow-xs"
          >
            {loading ? "Loading more..." : "Load More IPOs"}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 text-center text-[13px] text-rose-600 dark:text-rose-400">{error}</p>
      )}
    </div>
  );
}
