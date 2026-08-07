import { useState, useEffect } from "react";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ipocraft_watchlist");
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load watchlist", e);
    }
    setIsLoaded(true);
  }, []);

  const toggleWatchlist = (slug: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      
      try {
        localStorage.setItem("ipocraft_watchlist", JSON.stringify(next));
      } catch (e) {
        console.warn("Failed to save watchlist", e);
      }
      
      return next;
    });
  };

  const isInWatchlist = (slug: string) => watchlist.includes(slug);

  return { watchlist, toggleWatchlist, isInWatchlist, isLoaded };
}
