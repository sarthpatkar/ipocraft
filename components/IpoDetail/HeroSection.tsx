import React from "react";
import { CANONICAL_ORIGIN } from "@/lib/site-url";
import { calculateHypeScore } from "@/lib/hypeScore";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-[10.5px] font-semibold tracking-[0.22em] uppercase mb-4 ${light ? "text-[#93c5fd]" : "text-[#2563eb] dark:text-blue-400"}`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {children}
    </p>
  );
}

export default function HeroSection({
  ipo,
  statusStyle,
  allotmentBadge,
  shareButton,
}: {
  ipo: any;
  statusStyle: string;
  allotmentBadge: string | null;
  shareButton?: React.ReactNode;
}) {
  const hypeScore = calculateHypeScore({
    gmp: ipo.gmp != null ? Number(ipo.gmp) : null,
    issuePrice: ipo.price_max != null ? Number(ipo.price_max) : null,
    qibSub: ipo.sub_qib != null ? Number(ipo.sub_qib) : null,
    retailSub: ipo.sub_rii != null ? Number(ipo.sub_rii) : null,
    issueSize: ipo.issue_size != null ? Number(ipo.issue_size) : null,
  });

  // Convert 0-100 score to 0-5 stars
  const stars = hypeScore != null ? Math.round(hypeScore / 20) : null;

  return (
    <section className="bg-white dark:bg-[#111418] border-b border-[#e2e8f0] dark:border-[#252A31]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Eyebrow>IPO Research Overview</Eyebrow>
            <h1
              className="text-2xl sm:text-3xl lg:text-[2.1rem] font-semibold leading-tight tracking-tight text-[#0f172a] dark:text-[#F1F3F5] mb-2"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {ipo.name}
            </h1>
            {ipo.ipo_type && (
              <span
                className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md mb-2 ${ipo.ipo_type.toLowerCase() === "sme"
                    ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40"
                    : "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40"
                  }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {ipo.ipo_type.toUpperCase()}
              </span>
            )}


            {/* Hype Score Stars */}
            {stars != null && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex text-amber-400" title={`Rating: ${stars}/5`}>
                  {[1, 2, 3, 4, 5].map((s) =>
                    s <= stars ? (
                      <StarSolid key={s} className="w-[18px] h-[18px]" />
                    ) : (
                      <StarOutline key={s} className="w-[18px] h-[18px] text-gray-300 dark:text-[#252A31]" />
                    )
                  )}
                </div>
              </div>
            )}
            <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide items-center gap-3 pb-1 -mb-1">
              <p
                className="text-[13.5px] text-[#475569] dark:text-[#9AA1AA] leading-[1.78]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {ipo.exchange}
                {ipo.sector ? ` · ${ipo.sector}` : ""}
              </p>
              <span
                className={`inline-flex items-center text-[10.5px] font-semibold px-2 py-0.5 rounded-md ${statusStyle}`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {ipo.status}
              </span>
              {/* Allotment Badge */}
              {allotmentBadge && (
                <span
                  className={`inline-flex items-center text-[10.5px] font-semibold px-2 py-0.5 rounded-md ${allotmentBadge === "Allotment Out"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60"
                      : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60"
                    }`}
                  style={{
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {allotmentBadge}
                </span>
              )}

              {/* Check Allotment Button */}
              {allotmentBadge === "Allotment Out" && ipo.allotment_link && (
                <a
                  href={ipo.allotment_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Check Allotment
                </a>
              )}
            </div>
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FinancialProduct",
                name: ipo.name,
                description: "IPO information including GMP, price band, dates, and subscription details.",
                provider: {
                  "@type": "Organization",
                  name: "IPOCraft",
                  url: CANONICAL_ORIGIN,
                },
              }),
            }}
          />

          <div className="shrink-0 flex flex-col sm:items-end gap-3 pt-1">
            {/* Share button */}
            {shareButton && <div>{shareButton}</div>}
            <a
              href="#how-to-apply"
              className="inline-flex items-center gap-2 bg-[#1e3a8a] dark:bg-blue-600 hover:bg-[#1a327a] dark:hover:bg-blue-500 text-white text-[13px] font-medium px-5 py-2 rounded-md transition-colors shadow-xs"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              How to Apply
              <svg className="w-3.5 h-3.5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            {/* Prominent Allotment CTA */}
            {allotmentBadge === "Allotment Out" && ipo.allotment_link && (
              <a
                href={ipo.allotment_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold px-4 py-2 rounded-md transition-colors w-full sm:w-auto text-center"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Check Allotment Status ↗
              </a>
            )}
            <p
              className="text-[11px] text-gray-500 dark:text-[#9AA1AA] text-right max-w-[15rem] leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Not investment advice. Read RHP before applying.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
