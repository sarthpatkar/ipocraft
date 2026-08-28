"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  CalendarDaysIcon,
  ListBulletIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { CalendarDaysIcon as CalendarDaysIconSolid } from "@heroicons/react/24/solid";

// ─── Types ────────────────────────────────────────────────────────────────────
type CalendarIpo = {
  slug: string;
  name: string;
  open_date: string | null;
  close_date: string | null;
  listing_date: string | null;
  allotment_date: string | null;
  gmp?: string | number | null;
  price_min?: string | number | null;
  price_max?: string | number | null;
  ipo_type?: string | null;
};

type EventType = "open" | "close" | "listing" | "allotment";

type DayEvent = {
  slug: string;
  name: string;
  fullName: string;
  type: EventType;
  gmp?: string | number | null;
  price_min?: string | number | null;
  price_max?: string | number | null;
  ipo_type?: string | null;
};

type SelectedDay = { dateStr: string; events: DayEvent[] };

// ─── Semantic colour config — dots only, no bg blobs ─────────────────────────
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAY_MIN     = ["S","M","T","W","T","F","S"];

type EvConfig = { label: string; dot: string; tag: string; tagText: string };
const EV: Record<EventType, EvConfig> = {
  open:      { label: "Opens",     dot: "bg-emerald-500", tag: "bg-emerald-100 dark:bg-emerald-900/40",  tagText: "text-emerald-800 dark:text-emerald-300" },
  close:     { label: "Closes",    dot: "bg-rose-500",    tag: "bg-rose-100 dark:bg-rose-900/40",         tagText: "text-rose-800 dark:text-rose-300" },
  listing:   { label: "Listing",   dot: "bg-violet-500",  tag: "bg-violet-100 dark:bg-violet-900/40",     tagText: "text-violet-800 dark:text-violet-300" },
  allotment: { label: "Allotment", dot: "bg-amber-500",   tag: "bg-amber-100 dark:bg-amber-900/40",       tagText: "text-amber-800 dark:text-amber-300" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function todayIST() { return new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10); }
function mkDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function daysIn(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function startDow(y: number, m: number) { return new Date(y, m, 1).getDay(); }

function buildMap(ipos: CalendarIpo[]): Record<string, DayEvent[]> {
  const map: Record<string, DayEvent[]> = {};
  const push = (d: string | null, ev: DayEvent) => { if (d) (map[d] ??= []).push(ev); };
  for (const ip of ipos) {
    const short = ip.name.length > 22 ? ip.name.slice(0, 20) + "…" : ip.name;
    const base = { slug: ip.slug, fullName: ip.name, name: short, gmp: ip.gmp, price_min: ip.price_min, price_max: ip.price_max, ipo_type: ip.ipo_type };
    push(ip.open_date,      { ...base, type: "open" });
    push(ip.close_date,     { ...base, type: "close" });
    push(ip.listing_date,   { ...base, type: "listing" });
    push(ip.allotment_date, { ...base, type: "allotment" });
  }
  return map;
}

// ─── Inline event type tag ────────────────────────────────────────────────────
function Tag({ type }: { type: EventType }) {
  const c = EV[type];
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-px text-[9.5px] font-semibold rounded ${c.tag} ${c.tagText} shrink-0`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shrink-0`} />
      {c.label}
    </span>
  );
}

// ─── Single event row — flat, thin-line separated, NO card border ─────────────
function EventRow({ ev, isLast }: { ev: DayEvent; isLast: boolean }) {
  const gmp = ev.gmp != null ? Number(ev.gmp) : null;
  const pos = gmp != null && gmp >= 0;
  const price =
    ev.price_min && ev.price_max ? `₹${ev.price_min}–${ev.price_max}` :
    ev.price_max ? `₹${ev.price_max}` :
    ev.price_min ? `₹${ev.price_min}` : null;

  return (
    <Link
      href={`/ipo/${ev.slug}`}
      className={`
        group flex items-center gap-3 py-3 px-0
        hover:bg-gray-50 dark:hover:bg-[#14181F] -mx-1 px-1
        transition-colors duration-100
        ${!isLast ? "border-b border-gray-100 dark:border-[#1E2329]" : ""}
      `}
    >
      {/* Dot */}
      <span className={`w-2 h-2 rounded-full shrink-0 ${EV[ev.type].dot}`} />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-semibold text-[#0f172a] dark:text-[#E8EDF3] group-hover:text-[#1C317A] dark:group-hover:text-[#93B4FF] transition-colors truncate leading-none">
            {ev.fullName}
          </span>
          <Tag type={ev.type} />
          {ev.ipo_type && (
            <span className="text-[9.5px] font-medium text-gray-400 dark:text-[#4B5563] uppercase tracking-wide">
              {ev.ipo_type}
            </span>
          )}
          {price && (
            <span className="text-[10.5px] text-gray-400 dark:text-[#4B5563]">{price}</span>
          )}
        </div>
      </div>

      {/* Right: GMP + icon */}
      <div className="flex items-center gap-2 shrink-0">
        {gmp != null && (
          <span className={`text-[11px] font-bold tabular-nums ${pos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {pos ? "+" : ""}₹{gmp} GMP
          </span>
        )}
        <ArrowTopRightOnSquareIcon className="w-3 h-3 text-gray-300 dark:text-[#3A4050] group-hover:text-gray-500 dark:group-hover:text-[#6B7280] transition-colors" />
      </div>
    </Link>
  );
}

// ─── Day detail — flat list, no cards ────────────────────────────────────────
function DayDetail({ sel, today }: { sel: SelectedDay; today: string }) {
  const d = new Date(sel.dateStr + "T00:00:00");
  const isToday = sel.dateStr === today;
  return (
    <div>
      {/* Date header */}
      <div className="mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-[#4B5563] mb-0.5">
          {isToday ? "Today" : d.toLocaleDateString("en-IN", { weekday: "long" })}
        </p>
        <p className="text-[16px] font-bold text-[#0f172a] dark:text-[#E8EDF3] leading-tight">
          {d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <p className="text-[11px] text-gray-400 dark:text-[#4B5563] mt-0.5">
          {sel.events.length} event{sel.events.length !== 1 ? "s" : ""}
        </p>
      </div>
      {/* Flat event list */}
      <div className="border-t border-gray-100 dark:border-[#1E2329]">
        {sel.events.map((ev, i) => (
          <EventRow key={i} ev={ev} isLast={i === sel.events.length - 1} />
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function IpoCalendarGrid({ ipos }: { ipos: CalendarIpo[] }) {
  const today = todayIST();
  const td    = new Date(today + "T00:00:00");

  const [month,  setMonth]  = useState(td.getMonth());
  const [year,   setYear]   = useState(td.getFullYear());
  const [sel,    setSel]    = useState<SelectedDay | null>(null);
  const [mode,   setMode]   = useState<"cal" | "agenda">("cal");
  const [sheet,  setSheet]  = useState(false);

  const map = buildMap(ipos);

  useEffect(() => {
    if (map[today]?.length) setSel({ dateStr: today, events: map[today] });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function prev() { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); setSel(null); }
  function next() { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); setSel(null); }
  function goToday() {
    setMonth(td.getMonth()); setYear(td.getFullYear());
    setSel(map[today]?.length ? { dateStr: today, events: map[today] } : null);
  }
  function clickDay(ds: string, evs: DayEvent[]) {
    if (!evs.length) return;
    setSel({ dateStr: ds, events: evs });
    if (window.innerWidth < 768) setSheet(true);
  }

  const dim    = daysIn(year, month);
  const fd     = startDow(year, month);
  const cells  = Math.ceil((fd + dim) / 7) * 7;
  const isCurr = month === td.getMonth() && year === td.getFullYear();

  const agendaRows = Object.entries(map)
    .filter(([d]) => { const o = new Date(d + "T00:00:00"); return o.getFullYear() === year && o.getMonth() === month; })
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div>
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        {/* Nav */}
        <div className="flex items-center gap-1">
          <button onClick={prev} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#1A1F26] text-gray-500 dark:text-[#6B7280] transition-colors" aria-label="Previous month" title="Previous month">
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <span className="text-[15px] font-bold text-[#0f172a] dark:text-[#E8EDF3] min-w-[140px] text-center" style={{ fontFamily: "var(--font-outfit)" }}>
            {MONTH_NAMES[month]} {year}
          </span>
          <button onClick={next} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#1A1F26] text-gray-500 dark:text-[#6B7280] transition-colors" aria-label="Next month" title="Next month">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
          {!isCurr && (
            <button onClick={goToday} title="Go to current month" className="ml-2 px-2.5 py-1 rounded text-[11px] font-semibold border border-gray-200 dark:border-[#252A31] text-gray-500 dark:text-[#6B7280] hover:bg-gray-50 dark:hover:bg-[#1A1F26] transition-colors">
              Today
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-3">
            {(Object.keys(EV) as EventType[]).map(t => (
              <span key={t} className="flex items-center gap-1.5 text-[10.5px] text-gray-500 dark:text-[#5A6070]">
                <span className={`w-2 h-2 rounded-full ${EV[t].dot}`} />
                {EV[t].label}
              </span>
            ))}
          </div>
          {/* View toggle — minimal, flat */}
          <div className="flex items-center border border-gray-200 dark:border-[#252A31] rounded overflow-hidden">
            <button
              onClick={() => setMode("cal")}
              className={`px-2.5 py-1.5 transition-colors ${mode === "cal" ? "bg-gray-100 dark:bg-[#1A1F26] text-[#0f172a] dark:text-[#E8EDF3]" : "text-gray-400 dark:text-[#4B5563] hover:text-gray-600 dark:hover:text-[#6B7280]"}`}
              title="Calendar"
            >
              <CalendarDaysIcon className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-gray-200 dark:bg-[#252A31]" />
            <button
              onClick={() => setMode("agenda")}
              className={`px-2.5 py-1.5 transition-colors ${mode === "agenda" ? "bg-gray-100 dark:bg-[#1A1F26] text-[#0f172a] dark:text-[#E8EDF3]" : "text-gray-400 dark:text-[#4B5563] hover:text-gray-600 dark:hover:text-[#6B7280]"}`}
              title="Agenda"
            >
              <ListBulletIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Agenda view — flat date-grouped rows ── */}
      {mode === "agenda" ? (
        <div>
          {agendaRows.length === 0 ? (
            <p className="py-12 text-center text-[13px] text-gray-400 dark:text-[#4B5563]">
              No events in {MONTH_NAMES[month]}.
            </p>
          ) : agendaRows.map(([ds, evs]) => {
            const d   = new Date(ds + "T00:00:00");
            const isTd = ds === today;
            return (
              <div key={ds} className="flex gap-0 border-b border-gray-100 dark:border-[#1E2329] last:border-0">
                {/* Date column — fixed width, right-aligned */}
                <div className="w-16 shrink-0 pt-3 pr-4 text-right">
                  <span className="block text-[9.5px] font-semibold uppercase tracking-wider text-gray-400 dark:text-[#4B5563]">
                    {d.toLocaleDateString("en-IN", { weekday: "short" })}
                  </span>
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded text-[13px] font-bold mt-0.5 ${isTd ? "bg-[#1C317A] text-white" : "text-[#0f172a] dark:text-[#E8EDF3]"}`}>
                    {d.getDate()}
                  </span>
                </div>

                {/* Thin separator */}
                <div className="w-px bg-gray-100 dark:bg-[#1E2329] my-2" />

                {/* Events — flat list */}
                <div className="flex-1 min-w-0 py-1 pl-4">
                  {evs.map((ev, i) => <EventRow key={i} ev={ev} isLast={i === evs.length - 1} />)}
                </div>
              </div>
            );
          })}
        </div>

      ) : (
        /* ── Calendar grid + side panel ── */
        <div className="flex gap-5">
          {/* Grid */}
          <div className="flex-1 min-w-0 overflow-hidden">
            {/* DOW header row */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-[#252A31]">
              {DAY_LABELS.map((d, i) => (
                <div
                  key={i}
                  className={`py-2 text-center text-[9.5px] font-semibold uppercase tracking-wide select-none ${i === 0 || i === 6 ? "text-rose-400 dark:text-rose-600" : "text-gray-400 dark:text-[#4B5563]"}`}
                >
                  <span className="hidden sm:inline">{d}</span>
                  <span className="sm:hidden">{DAY_MIN[i]}</span>
                </div>
              ))}
            </div>

            {/* Cells — classic grid with hairline borders */}
            <div className="grid grid-cols-7">
              {Array.from({ length: cells }, (_, idx) => {
                const dayNum  = idx - fd + 1;
                const inMonth = dayNum >= 1 && dayNum <= dim;
                const ds      = inMonth ? mkDate(year, month, dayNum) : "";
                const evs     = inMonth ? (map[ds] ?? []) : [];
                const isTd    = inMonth && ds === today;
                const isSel   = inMonth && sel?.dateStr === ds;
                const hasEv   = evs.length > 0;
                const dow     = (fd + dayNum - 1) % 7;
                const isWkd   = dow === 0 || dow === 6;
                const isLastRow = idx >= cells - 7;
                const isLastCol = (idx % 7) === 6;
                const dots    = [...new Set(evs.map(e => e.type))].slice(0, 4) as EventType[];

                return (
                  <div
                    key={idx}
                    onClick={() => inMonth && clickDay(ds, evs)}
                    className={`
                      relative
                      aspect-square sm:aspect-auto sm:h-[88px]
                      p-1 sm:p-1.5
                      flex flex-col
                      border-b border-r
                      transition-colors duration-100
                      ${isLastRow ? "border-b-0" : "border-gray-100 dark:border-[#1E2329]"}
                      ${isLastCol ? "border-r-0" : "border-gray-100 dark:border-[#1E2329]"}
                      ${!inMonth
                        ? "bg-gray-50/60 dark:bg-[#090B0F]/60"
                        : isSel
                        ? "bg-blue-50/60 dark:bg-[#111C2E]"
                        : isTd
                        ? "bg-blue-50/30 dark:bg-[#0E1520]"
                        : hasEv
                        ? "bg-white dark:bg-[#111418] hover:bg-gray-50/80 dark:hover:bg-[#13171D] cursor-pointer"
                        : "bg-white dark:bg-[#111418]"
                      }
                    `}
                  >
                    {/* Selected: thin top accent line */}
                    {isSel && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#1C317A] dark:bg-[#3D5BA9]" />
                    )}

                    {inMonth && (
                      <>
                        {/* Day number */}
                        <span className={`
                          flex items-center justify-center self-start
                          w-5 h-5 sm:w-6 sm:h-6 rounded
                          text-[10px] sm:text-[11px] font-bold leading-none
                          ${isTd
                            ? "bg-[#1C317A] text-white"
                            : isWkd
                            ? "text-rose-500 dark:text-rose-600"
                            : "text-[#0f172a] dark:text-[#9AA5B4]"
                          }
                        `}>
                          {dayNum}
                        </span>

                        {/* Mobile: just dots row */}
                        <div className="sm:hidden flex gap-0.5 mt-1 pl-0.5">
                          {dots.map(t => (
                            <span key={t} className={`w-1.5 h-1.5 rounded-full ${EV[t].dot}`} />
                          ))}
                        </div>

                        {/* Desktop: compact text rows */}
                        <div className="hidden sm:flex flex-col gap-[2px] mt-1 flex-1 min-h-0 overflow-hidden">
                          {evs.slice(0, 2).map((ev, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-0.5 leading-tight"
                              title={`${ev.fullName} — ${EV[ev.type].label}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${EV[ev.type].dot}`} />
                              <span className="text-[9px] font-medium text-[#374151] dark:text-[#8B95A1] truncate">
                                {ev.name}
                              </span>
                            </div>
                          ))}
                          {evs.length > 2 && (
                            <span className="text-[8.5px] text-gray-400 dark:text-[#4B5563] pl-2">
                              +{evs.length - 2} more
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Desktop side panel — no card, just border-left ── */}
          <div className="hidden md:block w-[260px] lg:w-[288px] shrink-0 border-l border-gray-100 dark:border-[#1E2329] pl-5">
            <div className="sticky top-20">
              {sel ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9.5px] font-bold uppercase tracking-widest text-gray-400 dark:text-[#4B5563]">
                      Events
                    </span>
                    <button
                      onClick={() => setSel(null)}
                      aria-label="Close day details"
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#1A1F26] text-gray-300 dark:text-[#4B5563] transition-colors"
                    >
                      <XMarkIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <DayDetail sel={sel} today={today} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CalendarDaysIconSolid className="w-6 h-6 text-gray-200 dark:text-[#252A31] mb-2" />
                  <p className="text-[11.5px] text-gray-400 dark:text-[#4B5563]">
                    Select a date<br />to view events
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile bottom sheet — flat rows, no cards ── */}
      {sheet && sel && (
        <>
          <div
            className="md:hidden fixed inset-0 z-[60] bg-black/30"
            onClick={() => setSheet(false)}
          />
          <div className="md:hidden fixed bottom-0 inset-x-0 z-[70]">
            {/* Sheet container — rounded top only, no shadow-2xl */}
            <div className="bg-white dark:bg-[#111418] border-t border-gray-200 dark:border-[#252A31] rounded-t-xl overflow-hidden">
              {/* Handle */}
              <div className="flex justify-center pt-2.5 pb-0">
                <div className="w-8 h-1 bg-gray-200 dark:bg-[#252A31] rounded-full" />
              </div>

              {/* Sheet header */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100 dark:border-[#1E2329]">
                <div>
                  <p className="text-[9.5px] font-semibold uppercase tracking-widest text-gray-400 dark:text-[#4B5563]">
                    {new Date(sel.dateStr + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long" }).toUpperCase()}
                  </p>
                  <p className="text-[15px] font-bold text-[#0f172a] dark:text-[#E8EDF3] leading-tight">
                    {new Date(sel.dateStr + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <p className="text-[10.5px] text-gray-400 dark:text-[#4B5563]">
                    {sel.events.length} event{sel.events.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => setSheet(false)}
                  aria-label="Close day details"
                  className="p-2 -mr-1 text-gray-400 dark:text-[#4B5563] hover:text-gray-600 dark:hover:text-[#6B7280] transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Flat event list — no cards, just divider rows */}
              <div className="overflow-y-auto max-h-[55vh] px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
                {sel.events.map((ev, i) => {
                  const gmp = ev.gmp != null ? Number(ev.gmp) : null;
                  const pos = gmp != null && gmp >= 0;
                  const price =
                    ev.price_min && ev.price_max ? `₹${ev.price_min}–${ev.price_max}` :
                    ev.price_max ? `₹${ev.price_max}` :
                    ev.price_min ? `₹${ev.price_min}` : null;
                  const isLast = i === sel.events.length - 1;

                  return (
                    <Link
                      key={i}
                      href={`/ipo/${ev.slug}`}
                      onClick={() => setSheet(false)}
                      className={`
                        group flex items-center gap-3 py-3.5
                        hover:bg-gray-50 dark:hover:bg-[#14181F] -mx-1 px-1
                        transition-colors duration-100
                        ${!isLast ? "border-b border-gray-100 dark:border-[#1E2329]" : ""}
                      `}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${EV[ev.type].dot}`} />

                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#E8EDF3] truncate leading-snug">
                          {ev.fullName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <Tag type={ev.type} />
                          {ev.ipo_type && (
                            <span className="text-[9.5px] uppercase font-medium text-gray-400 dark:text-[#4B5563] tracking-wide">
                              {ev.ipo_type}
                            </span>
                          )}
                          {price && (
                            <span className="text-[10px] text-gray-400 dark:text-[#4B5563]">{price}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {gmp != null && (
                          <span className={`text-[11.5px] font-bold tabular-nums ${pos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                            {pos ? "+" : ""}₹{gmp} GMP
                          </span>
                        )}
                        <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-gray-300 dark:text-[#3A4050]" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
