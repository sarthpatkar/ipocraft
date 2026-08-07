import React from "react";
import Link from "next/link";

function valueOrDash(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

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

export default function TimelineTracker({ ipo }: { ipo: any }) {
  const timelineItems = [
    { label: "Open Date", value: valueOrDash(ipo.open_date) },
    { label: "Close Date", value: valueOrDash(ipo.close_date) },
    { label: "Allotment Date", value: valueOrDash(ipo.allotment_date) },
    { label: "Refund Date", value: valueOrDash(ipo.refund_date) },
    { label: "Listing Date", value: valueOrDash(ipo.listing_date) },
  ];

  return (
    <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
      <div className="pb-4 border-b border-[#f1f5f9]">
        <Eyebrow>Milestones</Eyebrow>
        <h2
          className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Timeline
        </h2>
      </div>
      <div className="pt-2">
        {timelineItems.map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center py-3 border-b border-[#f1f5f9] last:border-0"
          >
            <span
              className="text-[14px] text-[#475569]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {item.label}
            </span>
            <span
              className="text-[14px] font-semibold text-[#0f172a]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
      <p
        className="text-[12px] text-[#64748b] mt-2"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        If you are tracking GMP alongside subscription demand, see our <Link href="/ipo-grey-market-guide" className="text-[#2563eb] hover:underline font-medium">grey market premium guide</Link> for a structured comparison framework.
      </p>
    </section>
  );
}
