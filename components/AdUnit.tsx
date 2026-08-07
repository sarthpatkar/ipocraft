"use client";

import { useEffect, useRef } from "react";

interface AdUnitProps {
  /** AdSense ad slot ID (the data-ad-slot value from your AdSense dashboard). */
  slot: string;
  /** Ad format. Defaults to "auto". */
  format?: string;
  /** Whether the ad should be responsive. Defaults to true. */
  responsive?: boolean;
  /** Additional className applied to the outer wrapper div. */
  className?: string;
}

/**
 * AdUnit renders a single Google AdSense ad slot.
 *
 * Design decisions:
 * - The <ins> element has static attributes and renders identically on the
 *   server and client, so there is no hydration mismatch risk. The
 *   adsbygoogle.push() call is deferred to useEffect (client-only).
 * - React Strict Mode intentionally mounts components twice in development
 *   (react.dev/reference/react/StrictMode). A useRef guard ensures push()
 *   is called only once per mount: the ref value persists across the Strict
 *   Mode unmount/remount cycle because no cleanup function resets it.
 * - A min-height wrapper reserves space before the ad loads to reduce layout
 *   shift. The 90px value is a convention; actual ad height depends on what
 *   AdSense serves into the slot.
 */
export default function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdUnitProps) {
  const initialised = useRef(false);

  useEffect(() => {
    // Guard: do not push more than once per mount, even in React Strict Mode.
    if (initialised.current) return;
    initialised.current = true;

    try {
      // adsbygoogle is injected by the global AdSense script in layout.tsx.
      // Initialise the array on window if not already present, then push an
      // empty config object to request an ad for the <ins> element above.
      type AdsWindow = Window & { adsbygoogle?: object[] };
      const w = window as AdsWindow;
      w.adsbygoogle = w.adsbygoogle ?? [];
      w.adsbygoogle.push({});
    } catch {
      // Silently ignore errors in environments where the script is blocked
      // (e.g., ad blockers, automated tests) so the page still renders.
    }
  }, []);

  return (
    <div
      className={className || undefined}
      // Reserve vertical space so the layout does not shift when the ad loads.
      // 90px covers a standard leaderboard height; AdSense will adjust to fit.
      style={{ minHeight: "90px" }}
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4829097668877345"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
