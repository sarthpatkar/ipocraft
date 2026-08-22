"use client";

import { useState, useEffect, useCallback } from "react";

interface DataFreshnessBarProps {
  lastUpdatedAt: string | null; // ISO string from DB updated_at
  syncIntervalMinutes?: number; // default 30
}

function timeAgo(dateStr: string | null): { text: string; isStale: boolean } {
  if (!dateStr) return { text: "Unknown", isStale: true };
  const diffMs = Date.now() - new Date(dateStr).getTime();
  if (diffMs < 0) return { text: "Just now", isStale: false };
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return { text: "Just now", isStale: false };
  if (mins < 60) return { text: `${mins}m ago`, isStale: mins > 45 };
  const hrs = Math.floor(mins / 60);
  return { text: `${hrs}h ago`, isStale: true };
}

function nextRefreshIn(dateStr: string | null, intervalMinutes: number): string {
  if (!dateStr) return "soon";
  const updatedAt = new Date(dateStr).getTime();
  const nextAt = updatedAt + intervalMinutes * 60_000;
  const diffMs = nextAt - Date.now();
  if (diffMs <= 0) return "any moment";
  const mins = Math.ceil(diffMs / 60_000);
  if (mins <= 1) return "~1 min";
  return `~${mins} mins`;
}

export default function DataFreshnessBar({
  lastUpdatedAt,
  syncIntervalMinutes = 30,
}: DataFreshnessBarProps) {
  const [tick, setTick] = useState(0);

  // Re-render every 60 seconds to update relative timestamps
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  const { text: agoText, isStale } = timeAgo(lastUpdatedAt);
  const nextRefresh = nextRefreshIn(lastUpdatedAt, syncIntervalMinutes);

  return (
    <div
      className={`w-full flex items-center justify-center gap-2 px-4 py-1.5 text-[11.5px] font-medium transition-colors
        ${isStale
          ? "bg-amber-50 border-b border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800/40 dark:text-amber-300"
          : "bg-emerald-50 border-b border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800/40 dark:text-emerald-300"
        }`}
    >
      {/* Live pulse dot */}
      <span className="flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 rounded-full ${isStale ? "bg-amber-500" : "bg-emerald-500 animate-pulse"}`}
        />
        {isStale ? "Data may be stale" : "Live data"}
      </span>

      <span className="text-current opacity-40">·</span>

      {/* Last updated */}
      <span>
        GMP &amp; Subscription updated <strong>{agoText}</strong>
      </span>

      <span className="text-current opacity-40">·</span>

      {/* Next refresh */}
      <span className="hidden sm:inline">
        Next refresh in <strong>{nextRefresh}</strong>
      </span>

      {/* Refresh frequency label */}
      <span className="text-current opacity-40 hidden md:inline">·</span>
      <span className="hidden md:inline opacity-70">Refreshes every {syncIntervalMinutes} min</span>
    </div>
  );
}
