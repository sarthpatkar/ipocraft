import React from "react";
import Link from "next/link";
import { formatDisplayDate } from "@/lib/formatters";

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-[11px] font-semibold tracking-wider uppercase mb-2 ${light ? "text-[#93c5fd]" : "text-blue-600 dark:text-blue-400"}`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {children}
    </p>
  );
}

export default function TimelineTracker({ ipo }: { ipo: any }) {
  const timelineItems = [
    { label: "Open Date", value: formatDisplayDate(ipo.open_date) },
    { label: "Close Date", value: formatDisplayDate(ipo.close_date) },
    { label: "Allotment Date", value: formatDisplayDate(ipo.allotment_date) },
    { label: "Refund Date", value: formatDisplayDate(ipo.refund_date) },
    { label: "Listing Date", value: formatDisplayDate(ipo.listing_date) },
  ];

  return (
    <section className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-5 sm:p-6 space-y-3 mb-6">
      <div className="pb-3 border-b border-gray-100 dark:border-[#252A31]">
        <Eyebrow>Milestones</Eyebrow>
        <h2
          className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Key Timeline &amp; Dates
        </h2>
      </div>
      <div className="pt-1 divide-y divide-gray-100 dark:divide-[#252A31]">
        {timelineItems.map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center py-2.5"
          >
            <span
              className="text-[13px] text-[#475569] dark:text-[#9AA1AA]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {item.label}
            </span>
            <span
              className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
