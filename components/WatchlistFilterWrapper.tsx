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
            className={`px-4 py-1.5 text-xs font-semibold rounded-full shadow-sm transition-all duration-200 border ${
              showWatchlist
                ? "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {showWatchlist ? "★ Viewing Watchlist" : "☆ My Watchlist"}
          </button>
        )}
      </div>

      {showWatchlist && displayedIpos.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
          <p>Your watchlist is empty.</p>
          <p className="text-sm mt-2">Click the star icon on any IPO to save it here.</p>
        </div>
      ) : (
        <IpoList items={displayedIpos} />
      )}
    </div>
  );
}
