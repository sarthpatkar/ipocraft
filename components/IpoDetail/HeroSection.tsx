import React from "react";
import { CANONICAL_ORIGIN } from "@/lib/site-url";
import { calculateHypeScore } from "@/lib/hypeScore";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-[10.5px] font-semibold tracking-[0.22em] uppercase mb-4 ${light ? "text-[#93c5fd]" : "text-[#2563eb]"}`}
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
}: {
  ipo: any;
  statusStyle: string;
  allotmentBadge: string | null;
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
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#f8fafc] to-[#eef2ff] border-b border-[#e2e8f0]">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-200 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-200 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div className="flex-1 min-w-0">
            <Eyebrow>IPO Detail</Eyebrow>
            <h1
              className="text-2xl sm:text-3xl lg:text-[2.4rem] font-semibold leading-[1.15] tracking-[-0.01em] text-[#0f172a] mb-3"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {ipo.name}
            </h1>
            {ipo.ipo_type && (
              <span
                className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded mb-2 ${ipo.ipo_type.toLowerCase() === "sme"
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {ipo.ipo_type.toUpperCase()}
              </span>
            )}

            {/* Hype Score Stars */}
            {stars != null && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex text-yellow-400" title={`Rating: ${stars}/5`}>
                  {[1, 2, 3, 4, 5].map((s) =>
                    s <= stars ? (
                      <StarSolid key={s} className="w-[18px] h-[18px]" />
                    ) : (
                      <StarOutline key={s} className="w-[18px] h-[18px] text-gray-300" />
                    )
                  )}
                </div>
              </div>
            )}
            <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide items-center gap-3 pb-1 -mb-1">
              <p
                className="text-[14.5px] text-[#475569] leading-[1.78]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {ipo.exchange}
                {ipo.sector ? ` · ${ipo.sector}` : ""}
              </p>
              <span
                className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded ${statusStyle}`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {ipo.status}
              </span>
              {/* Allotment Badge */}
              {allotmentBadge && (
                <span
                  className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded ${allotmentBadge === "Allotment Out"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  style={{
                    fontFamily: "var(--font-inter)",
                    ...(allotmentBadge === "Allotment Out"
                      ? { animation: "pulse 1s ease-in-out 1" }
                      : {}),
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
                  className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium px-3 py-1 rounded transition-colors"
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
            <a
              href="#how-to-apply"
              className="inline-flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#1a327a] text-white text-[13px] font-medium px-6 py-[0.65rem] rounded-[4px] transition-colors duration-150"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              How to Apply
              <svg className="w-3.5 h-3.5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <p
              className="text-[10.5px] text-[#94a3b8] text-right max-w-[15rem] leading-relaxed"
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
