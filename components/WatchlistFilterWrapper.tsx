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
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-colors border ${
              showWatchlist
                ? "bg-[#1e3a8a] dark:bg-[#171B20] text-white dark:text-[#F1F3F5] border-transparent dark:border-[#252A31]"
                : "bg-white dark:bg-[#111418] text-gray-700 dark:text-[#9AA1AA] border-gray-200 dark:border-[#252A31] hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            {showWatchlist ? "Viewing Watchlist" : "My Watchlist"}
          </button>
        )}
      </div>

      {showWatchlist && displayedIpos.length === 0 ? (
        <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-8 text-center text-gray-500 dark:text-[#9AA1AA]">
          <p>Your watchlist is empty.</p>
          <p className="text-sm mt-2">Click the star icon on any IPO to save it here.</p>
        </div>
      ) : (
        <IpoList items={displayedIpos} />
      )}
    </div>
  );
}
