"use client";

import { useState } from "react";

/**
 * Renders a broker's logo image with a graceful initials-avatar fallback —
 * broker.logo_url previously existed in the data model but was never
 * actually rendered anywhere in BrokerCard, and a plain <img> with no
 * fallback would show a broken-image icon for any dead/missing URL.
 */
export default function BrokerLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const [failed, setFailed] = useState(false);

  if (!logoUrl || failed) {
    return (
      <div
        className="w-9 h-9 rounded-lg bg-[#1C317A]/10 dark:bg-[#1C317A]/25 text-[#1C317A] dark:text-[#93B4FF] flex items-center justify-center text-[13px] font-bold shrink-0"
        aria-hidden="true"
      >
        {name.trim().charAt(0).toUpperCase() || "?"}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- logo_url is an
    // arbitrary admin-supplied external domain, not in next/image's remotePatterns.
    <img
      src={logoUrl}
      alt={`${name} logo`}
      width={36}
      height={36}
      loading="lazy"
      onError={() => setFailed(true)}
      className="w-9 h-9 rounded-lg object-contain bg-white border border-gray-100 dark:border-[#252A31] shrink-0"
    />
  );
}
