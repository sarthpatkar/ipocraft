"use client";

// Note: This is the updated useWatchlist hook - rename to useWatchlist.ts

import { useState, useEffect, useCallback } from "react";

const WATCHLIST_KEY = "ipo-watchlist";
const DEVICE_ID_KEY = "ipo-device-id";

function getDeviceId(): string {
  if (typeof localStorage === "undefined") return "";
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

function getLocalWatchlist(): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveLocalWatchlist(slugs: string[]) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(slugs));
}

async function syncToServer(deviceId: string, slugs: string[]) {
  try {
    await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, slugs }),
    });
  } catch {}
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const localSlugs = getLocalWatchlist();
    const deviceId = getDeviceId();

    // Merge server + local (local takes priority)
    fetch(`/api/watchlist?deviceId=${deviceId}`)
      .then((r) => r.json())
      .then(({ slugs: serverSlugs }: { slugs: string[] }) => {
        const merged = Array.from(new Set([...localSlugs, ...(serverSlugs ?? [])]));
        setWatchlist(merged);
        saveLocalWatchlist(merged);
      })
      .catch(() => {
        setWatchlist(localSlugs);
      })
      .finally(() => setIsLoaded(true));
  }, []);

  const toggle = useCallback((slug: string) => {
    setWatchlist((prev) => {
      const updated = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      saveLocalWatchlist(updated);
      syncToServer(getDeviceId(), updated);
      return updated;
    });
  }, []);

  const isWatched = useCallback((slug: string) => watchlist.includes(slug), [watchlist]);

  return { watchlist, toggle, isWatched, isLoaded };
}
