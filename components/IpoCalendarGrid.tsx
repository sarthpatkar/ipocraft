"use client";

import { useState } from "react";
import Link from "next/link";
import { XMarkIcon, CalendarDaysIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

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
  listing: "Listing",
  allotment: "Allotment",
};

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function IpoCalendarGrid({ ipos }: Props) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedDate, setSelectedDate] = useState<{ dateStr: string; events: DayEvent[] } | null>(null);
  const months = generateCalendarMonths(3);

  // Build a map of date -> events
  const eventMap: Record<string, DayEvent[]> = {};

  function addEvent(dateStr: string | null, event: DayEvent) {
    if (!dateStr) return;
    if (!eventMap[dateStr]) eventMap[dateStr] = [];
    eventMap[dateStr].push(event);
  }

  for (const ipo of ipos) {
    const shortName = ipo.name.length > 18 ? ipo.name.slice(0, 16) + "…" : ipo.name;
    if (ipo.open_date) addEvent(ipo.open_date, { slug: ipo.slug, name: shortName, type: "open", gmp: ipo.gmp });
    if (ipo.close_date) addEvent(ipo.close_date, { slug: ipo.slug, name: shortName, type: "close" });
    if (ipo.listing_date) addEvent(ipo.listing_date, { slug: ipo.slug, name: shortName, type: "listing" });
    if (ipo.allotment_date) addEvent(ipo.allotment_date, { slug: ipo.slug, name: shortName, type: "allotment" });
  }

  const todayIST = new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10);

  return (
    <div>
      {/* View Switcher & Legend Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-[#252A31]">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {Object.entries(EVENT_LABELS).map(([type, label]) => (
            <span key={type} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border ${EVENT_STYLES[type]} font-medium`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {label}
            </span>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-md border border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#171B20] p-0.5 self-start sm:self-auto">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-2.5 py-1 rounded text-[11.5px] font-medium capitalize transition-colors ${
                view === v
                  ? "bg-white dark:bg-[#111418] text-[#0f172a] dark:text-[#F1F3F5] shadow-xs font-semibold"
                  : "text-gray-500 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-[#F1F5F9]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <div className="space-y-6">
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
                <h3 className="text-[13.5px] font-semibold mb-2 text-[#0f172a] dark:text-[#F1F5F9]">
                  {MONTH_NAMES[month]} {year}
                </h3>
                {/* Day headers */}
                <div className="grid grid-cols-7 mb-1 bg-gray-50 dark:bg-[#171B20] rounded-t-md border border-gray-200 dark:border-[#252A31]">
                  {DAY_NAMES.map((d) => (
                    <div key={d} className="text-center text-[10.5px] font-semibold uppercase py-1 text-gray-500 dark:text-[#9AA1AA]">
                      {d}
                    </div>
                  ))}
                </div>
                {/* Calendar grid */}
                <div className="grid grid-cols-7 border-l border-t border-gray-200 dark:border-[#252A31] rounded-b-md overflow-hidden bg-gray-200 dark:bg-[#252A31] gap-[1px]">
                  {cells.map((cell, idx) => {
                    const hasEvents = cell && cell.events.length > 0;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (hasEvents) {
                            setSelectedDate({ dateStr: cell.dateStr, events: cell.events });
                          }
                        }}
                        className={`min-h-[80px] sm:min-h-[90px] p-1.5 text-[11px] transition-colors ${
                          !cell 
                            ? "bg-gray-50/60 dark:bg-[#090B0F]"
                            : cell.isToday
                            ? "bg-blue-50/40 dark:bg-[#151921] cursor-pointer"
                            : hasEvents
                            ? "bg-white dark:bg-[#111418] hover:bg-gray-50 dark:hover:bg-[#171B20] cursor-pointer"
                            : "bg-white dark:bg-[#111418]"
                        }`}
                      >
                        {cell && (
                          <>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-[10.5px] font-semibold w-4.5 h-4.5 flex items-center justify-center rounded-full ${
                                cell.isToday 
                                  ? "bg-blue-600 text-white font-bold" 
                                  : "text-gray-600 dark:text-[#9AA1AA]"
                              }`}>
                                {cell.day}
                              </span>
                              {cell.events.length > 2 && (
                                <span className="text-[9.5px] font-semibold text-blue-600 dark:text-blue-400">
                                  {cell.events.length} events
                                </span>
                              )}
                            </div>
                            <div className="space-y-1">
                              {cell.events.slice(0, 2).map((ev, i) => (
                                <div
                                  key={i}
                                  className={`truncate px-1.5 py-0.5 rounded text-[9.5px] font-medium border ${EVENT_STYLES[ev.type]} leading-tight flex items-center justify-between gap-1`}
                                  title={`${ev.name} — ${EVENT_LABELS[ev.type]}`}
                                >
                                  <span className="truncate">{ev.name}</span>
                                  <span className="opacity-80 text-[8.5px] shrink-0 font-semibold">{EVENT_LABELS[ev.type]}</span>
                                </div>
                              ))}
                              {cell.events.length > 2 && (
                                <div className="text-[9px] text-center text-gray-500 dark:text-[#9AA1AA] font-medium">
                                  +{cell.events.length - 2} more →
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="space-y-2">
          {Object.entries(eventMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([dateStr, events]) => (
              <div key={dateStr} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-2.5 rounded-lg border border-gray-100 dark:border-[#252A31] bg-white dark:bg-[#111418]">
                <div className="w-24 shrink-0 text-[12.5px] font-semibold tabular-nums text-gray-800 dark:text-[#F1F5F9]">
                  {new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", weekday: "short" })}
                </div>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {events.map((ev, i) => (
                    <Link
                      key={i}
                      href={`/ipo/${ev.slug}`}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11.5px] font-medium ${EVENT_STYLES[ev.type]} hover:opacity-90 transition-opacity`}
                    >
                      <span className="font-semibold">{ev.name}</span>
                      <span className="opacity-75 font-normal">({EVENT_LABELS[ev.type]})</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Date Event Drawer / Modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg shadow-xl max-w-md w-full p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#252A31] mb-3">
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h4 className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">
                  Events on {new Date(selectedDate.dateStr + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </h4>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {selectedDate.events.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-md border border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#171B20] flex items-center justify-between gap-2"
                >
                  <div>
                    <Link
                      href={`/ipo/${ev.slug}`}
                      className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] hover:underline"
                    >
                      {ev.name}
                    </Link>
                    <div className="mt-0.5">
                      <span className={`inline-flex items-center text-[10.5px] px-1.5 py-0.2 rounded border font-medium ${EVENT_STYLES[ev.type]}`}>
                        {EVENT_LABELS[ev.type]} Event
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/ipo/${ev.slug}`}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 font-medium shrink-0"
                  >
                    View IPO <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#252A31] text-right">
              <button
                onClick={() => setSelectedDate(null)}
                className="px-3.5 py-1 text-xs font-semibold rounded-md bg-gray-100 dark:bg-[#171B20] text-gray-700 dark:text-[#F1F5F9] hover:bg-gray-200 dark:hover:bg-[#252A31]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
