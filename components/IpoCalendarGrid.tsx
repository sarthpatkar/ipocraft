"use client";

import { useState } from "react";
import Link from "next/link";

type CalendarIpo = {
  slug: string;
  name: string;
  open_date: string | null;
  close_date: string | null;
  listing_date: string | null;
  allotment_date: string | null;
  gmp?: string | number | null;
};

type Props = {
  ipos: CalendarIpo[];
};

function getISTDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00+05:30");
}

function generateCalendarMonths(count = 3): Date[] {
  const months: Date[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    months.push(new Date(now.getFullYear(), now.getMonth() + i, 1));
  }
  return months;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay(); // 0=Sun
}

type DayEvent = {
  slug: string;
  name: string;
  type: "open" | "close" | "listing" | "allotment";
  gmp?: string | number | null;
};

const EVENT_STYLES: Record<string, string> = {
  open: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
  close: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40",
  listing: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40",
  allotment: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
};

const EVENT_LABELS: Record<string, string> = {
  open: "Opens",
  close: "Closes",
  listing: "Lists",
  allotment: "Allotment",
};

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function IpoCalendarGrid({ ipos }: Props) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const months = generateCalendarMonths(3);

  // Build a map of date -> events
  const eventMap: Record<string, DayEvent[]> = {};

  function addEvent(dateStr: string | null, event: DayEvent) {
    if (!dateStr) return;
    if (!eventMap[dateStr]) eventMap[dateStr] = [];
    eventMap[dateStr].push(event);
  }

  for (const ipo of ipos) {
    const shortName = ipo.name.length > 16 ? ipo.name.slice(0, 14) + "…" : ipo.name;
    if (ipo.open_date) addEvent(ipo.open_date, { slug: ipo.slug, name: shortName, type: "open", gmp: ipo.gmp });
    if (ipo.close_date) addEvent(ipo.close_date, { slug: ipo.slug, name: shortName, type: "close" });
    if (ipo.listing_date) addEvent(ipo.listing_date, { slug: ipo.slug, name: shortName, type: "listing" });
    if (ipo.allotment_date) addEvent(ipo.allotment_date, { slug: ipo.slug, name: shortName, type: "allotment" });
  }

  const todayIST = new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10);

  return (
    <div>
      {/* View toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[12.5px] text-[#64748B] dark:text-[#94A3B8]">
          Quarterly IPO event timeline
        </p>
        <div className="flex items-center gap-1 rounded-lg border border-[#e2e8f0] dark:border-[#22304A] bg-[#f8fafc] dark:bg-[#0D1525] p-1">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-md text-[12px] font-medium capitalize transition-colors ${
                view === v
                  ? "bg-white dark:bg-[#162238] text-[#0f172a] dark:text-[#F1F5F9] shadow-xs"
                  : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0f172a] dark:hover:text-[#F1F5F9]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 mb-5 text-[11px]">
        {Object.entries(EVENT_LABELS).map(([type, label]) => (
          <span key={type} className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border ${EVENT_STYLES[type]}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {label}
          </span>
        ))}
      </div>

      {view === "grid" ? (
        <div className="space-y-8">
          {months.map((monthDate) => {
            const year = monthDate.getFullYear();
            const month = monthDate.getMonth();
            const daysInMonth = getDaysInMonth(year, month);
            const firstDay = getFirstDayOfMonth(year, month);
            const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
              if (i < firstDay) return null;
              const day = i - firstDay + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const events = eventMap[dateStr] ?? [];
              const isToday = dateStr === todayIST;
              return { day, dateStr, events, isToday };
            });

            return (
              <div key={`${year}-${month}`}>
                <h3 className="text-[14.5px] font-semibold mb-2.5 text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
                  {MONTH_NAMES[month]} {year}
                </h3>
                {/* Day headers */}
                <div className="grid grid-cols-7 mb-1 bg-gray-50 dark:bg-[#0D1525] rounded-lg border border-gray-100 dark:border-[#22304A]">
                  {DAY_NAMES.map((d) => (
                    <div key={d} className="text-center text-[10.5px] font-semibold uppercase py-1 text-gray-500 dark:text-[#94A3B8]">
                      {d}
                    </div>
                  ))}
                </div>
                {/* Calendar grid */}
                <div className="grid grid-cols-7 border border-[#e2e8f0] dark:border-[#22304A] rounded-xl overflow-hidden">
                  {cells.map((cell, idx) => (
                    <div
                      key={idx}
                      className={`min-h-[76px] p-1.5 border-b border-r border-[#e2e8f0] dark:border-[#22304A] text-[11px] ${
                        cell?.isToday
                          ? "bg-blue-50/50 dark:bg-[#162238]"
                          : cell
                          ? "bg-white dark:bg-[#111B2D]"
                          : "bg-gray-50/40 dark:bg-[#080D18]"
                      }`}
                    >
                      {cell && (
                        <>
                          <div className={`text-[10.5px] font-semibold w-4.5 h-4.5 flex items-center justify-center rounded-full mb-0.5 ${
                            cell.isToday ? "bg-[#3B82F6] text-white" : "text-gray-600 dark:text-[#94A3B8]"
                          }`}>
                            {cell.day}
                          </div>
                          <div className="space-y-0.5">
                            {cell.events.slice(0, 2).map((ev, i) => (
                              <Link
                                key={i}
                                href={`/ipo/${ev.slug}`}
                                className={`block truncate px-1.5 py-0.5 rounded text-[9.5px] font-medium border ${EVENT_STYLES[ev.type]} leading-tight`}
                                title={`${ev.name} — ${EVENT_LABELS[ev.type]}`}
                              >
                                {ev.name}
                              </Link>
                            ))}
                            {cell.events.length > 2 && (
                              <div className="text-[9px] text-center text-gray-400 dark:text-[#64748B]">
                                +{cell.events.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="space-y-1.5">
          {Object.entries(eventMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([dateStr, events]) => (
              <div key={dateStr} className="flex items-start gap-4 py-2 border-b border-[#e2e8f0] dark:border-[#22304A]">
                <div className="w-20 shrink-0 text-[12px] font-medium tabular-nums text-gray-600 dark:text-[#94A3B8]">
                  {new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {events.map((ev, i) => (
                    <Link
                      key={i}
                      href={`/ipo/${ev.slug}`}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-medium ${EVENT_STYLES[ev.type]}`}
                    >
                      <span className="font-semibold">{ev.name}</span>
                      <span className="opacity-70">· {EVENT_LABELS[ev.type]}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

