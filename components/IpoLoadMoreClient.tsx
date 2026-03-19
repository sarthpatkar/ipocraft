"use client";

import { useEffect, useState } from "react";
import IpoList from "@/components/IpoList";
import type { IPOListItem } from "@/components/IpoCard";
import type { IpoCursor } from "@/lib/ipoFeed";

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

const DEFAULT_LIMIT = 6;

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
      <IpoList items={items} emptyMessage={emptyMessage} />

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-[#1e3a8a] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1a327a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Show More IPOs"}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 text-center text-[13px] text-rose-700">{error}</p>
      )}
    </div>
  );
}
