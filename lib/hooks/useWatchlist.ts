"use client";

import { useState, useEffect, useCallback } from "react";

const WATCHLIST_KEY = "ipocraft_watchlist";
const DEVICE_ID_KEY = "ipocraft_device_id";

function getDeviceId(): string {
  if (typeof localStorage === "undefined") return "";
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    // crypto.randomUUID() — 122 bits of real entropy, not brute-forceable.
    // (Previously Date.now()+Math.random(), which was guessable and made
    // the old permissive watchlists RLS policy an exploitable IDOR.)
    id = crypto.randomUUID();
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
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(slugs));
  } catch (e) {
    console.warn("Failed to save watchlist", e);
  }
}

async function syncToServer(deviceId: string, slugs: string[]) {
  try {
    await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, slugs }),
    });
  } catch {
    // Best-effort — the local copy is always the source of truth for this session.
  }
}

/**
 * Cross-device watchlist: local-first (instant, works offline) with a
 * background merge against the server copy (keyed by a random per-device
 * UUID in localStorage) so the same watchlist follows a user across
 * devices/browsers once they've opened the site on both.
 */
export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const localSlugs = getLocalWatchlist();
    setWatchlist(localSlugs); // show local immediately, don't block on network
    setIsLoaded(true);

    const deviceId = getDeviceId();
    if (!deviceId) return;

    fetch(`/api/watchlist?deviceId=${deviceId}`)
      .then((r) => r.json())
      .then(({ slugs: serverSlugs }: { slugs: string[] }) => {
        const merged = Array.from(new Set([...localSlugs, ...(serverSlugs ?? [])]));
        setWatchlist(merged);
        saveLocalWatchlist(merged);
        // Push the merged result back so both copies agree going forward.
        if (merged.length !== (serverSlugs ?? []).length) {
          syncToServer(deviceId, merged);
        }
      })
      .catch(() => {
        // Offline or first-ever load — local copy stands.
      });
  }, []);

  const toggleWatchlist = useCallback((slug: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      saveLocalWatchlist(next);
      syncToServer(getDeviceId(), next);
      return next;
    });
  }, []);

  const isInWatchlist = useCallback((slug: string) => watchlist.includes(slug), [watchlist]);

  return { watchlist, toggleWatchlist, isInWatchlist, isLoaded };
}
