"use client";

import { useState } from "react";
import IpoList from "./IpoList";
import { useWatchlist } from "@/lib/hooks/useWatchlist";

type IpoItem = any; // You can refine this with the actual IPO type used in IpoList

export default function WatchlistFilterWrapper({ initialIpos }: { initialIpos: IpoItem[] }) {
  const { watchlist, isLoaded } = useWatchlist();
  const [showWatchlist, setShowWatchlist] = useState(false);

  // Filter IPOs client-side if the toggle is active
  const displayedIpos = showWatchlist
    ? initialIpos.filter((ipo) => watchlist.includes(ipo.slug))
    : initialIpos;

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        {isLoaded && (
          <button
            onClick={() => setShowWatchlist(!showWatchlist)}
            className={`px-3.5 py-1.5 text-[12px] font-semibold rounded-lg transition-colors border ${
              showWatchlist
                ? "bg-[#1e3a8a] dark:bg-[#3B82F6] text-white border-transparent"
                : "bg-white dark:bg-[#111B2D] text-[#475569] dark:text-[#94A3B8] border-[#e2e8f0] dark:border-[#22304A] hover:border-[#3B82F6]/50"
            }`}
          >
            {showWatchlist ? "Viewing Watchlist" : "My Watchlist"}
          </button>
        )}
      </div>

      {showWatchlist && displayedIpos.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-700 rounded-xl p-8 text-center text-gray-500 dark:text-slate-400">
          <p>Your watchlist is empty.</p>
          <p className="text-sm mt-2">Click the star icon on any IPO to save it here.</p>
        </div>
      ) : (
        <IpoList items={displayedIpos} />
      )}
    </div>
  );
}
