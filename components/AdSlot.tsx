"use client";

import { useEffect, useRef } from "react";

const ADSENSE_CLIENT = "ca-pub-4829097668877345";
const ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

type Props = {
  /** AdSense ad slot ID (from the AdSense dashboard). */
  slot: string;
  /** Reserved height in px so the layout doesn't shift while the ad loads. */
  minHeight?: number;
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Layout-shift-free Google AdSense slot. Renders nothing unless
 * NEXT_PUBLIC_ADSENSE_ENABLED=true — the AdSense loader script itself is
 * already included globally in app/layout.tsx; this only renders individual
 * ad units. Always reserves `minHeight` so the slot never causes CLS.
 */
export default function AdSlot({ slot, minHeight = 250, className = "" }: Props) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_ENABLED || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.error("AdSense push failed:", err);
    }
  }, []);

  if (!ADSENSE_ENABLED) return null;

  return (
    <div
      className={`w-full overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", minHeight }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
