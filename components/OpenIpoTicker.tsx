"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type TickerIpo = {
  id: number;
  name: string;
  slug: string;
  ipo_type: string | null;
  gmp: number | null;
  price_max: number | null;
  price_min: number | null;
  status: string | null;
  close_date: string | null;
};

function getMarketStatusIST(): { isOpen: boolean; label: string } {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 3600000 * 5.5);
  const day = ist.getDay(); // 0 = Sun, 6 = Sat
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const timeNum = hours * 60 + minutes;

  const isWeekday = day >= 1 && day <= 5;
  const isTradingHours = timeNum >= 9 * 60 + 15 && timeNum < 15 * 60 + 30;

  if (isWeekday && isTradingHours) {
    return { isOpen: true, label: "Market Open" };
  }
  return { isOpen: false, label: "Market Closed" };
}

export default function OpenIpoTicker() {
  const [openIpos, setOpenIpos] = useState<TickerIpo[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketStatus, setMarketStatus] = useState<{ isOpen: boolean; label: string }>({ isOpen: false, label: "Market Closed" });

  useEffect(() => {
    setMarketStatus(getMarketStatusIST());
    const interval = setInterval(() => {
      setMarketStatus(getMarketStatusIST());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchOpenIpos() {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const { data, error } = await supabase
          .from("ipos")
          .select("id, name, slug, ipo_type, gmp, price_max, price_min, status, close_date")
          .in("status", ["Open", "open"])
          .gte("close_date", today)
          .order("close_date", { ascending: true });

        if (error) {
          console.error("Error fetching ticker IPOs:", error);
          return;
        }

        setOpenIpos((data as TickerIpo[]) || []);
      } catch (e) {
        console.error("Failed to load ticker IPOs", e);
      } finally {
        setLoading(false);
      }
    }

    fetchOpenIpos();
  }, []);

  if (loading || openIpos.length === 0) return null;

  // Only duplicate if needed for smooth continuous loop
  const displayItems = openIpos.length <= 3 
    ? [...openIpos, ...openIpos] 
    : openIpos;

  return (
    <div className="w-full bg-[#f8fafc]/95 dark:bg-[#0D1015]/95 border-b border-gray-200 dark:border-[#252A31] backdrop-blur-md overflow-hidden select-none h-7 flex items-center text-[12px] relative z-20">
      {/* Static Label Badge with Market Status */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-0.5 bg-slate-100 dark:bg-[#14181F] text-slate-700 dark:text-[#E8EDF3] font-semibold text-[10px] uppercase tracking-wider shrink-0 border-r border-gray-200 dark:border-[#252A31] z-20 h-full">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>OPEN IPOs ({openIpos.length})</span>
        </div>
        <span className="text-gray-300 dark:text-[#252A31]">|</span>
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-[#8E97A6]">
          <span className={`w-1.5 h-1.5 rounded-full ${marketStatus.isOpen ? "bg-emerald-500" : "bg-gray-400 dark:bg-gray-600"}`} />
          <span>{marketStatus.label}</span>
        </div>
      </div>

      {/* Marquee Container with smooth gradient masks */}
      <div className="flex-1 overflow-hidden relative flex items-center group h-full">
        {/* Left fade */}
        <div className="absolute left-0 inset-y-0 w-6 bg-gradient-to-r from-[#f8fafc] dark:from-[#0D1015] to-transparent z-10 pointer-events-none" />

        {/* Scrolling items */}
        <div
          className="flex items-center gap-6 whitespace-nowrap animate-ticker-ltr group-hover:[animation-play-state:paused]"
          style={{ willChange: "transform" }}
        >
          {displayItems.map((ipo, idx) => {
            const price = Number(ipo.price_max ?? ipo.price_min ?? 0);
            const gmp = ipo.gmp != null ? Number(ipo.gmp) : null;
            const gmpPct = gmp != null && price > 0 ? ((gmp / price) * 100).toFixed(1) : null;

            return (
              <Link
                key={`${ipo.id}-${idx}`}
                href={`/ipo/${ipo.slug}`}
                className="inline-flex items-center gap-2 text-[#334155] dark:text-[#9AA1AA] hover:text-[#0f172a] dark:hover:text-[#F1F3F5] transition-colors py-0.5 cursor-pointer shrink-0"
              >
                <span className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">
                  {ipo.name}
                </span>

                {ipo.ipo_type === "SME" && (
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                    (SME)
                  </span>
                )}

                {gmp != null && gmp > 0 ? (
                  <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium tabular-nums">
                    GMP ₹{gmp} {gmpPct && `(+${gmpPct}%)`}
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-[#6B7280]">
                    GMP -
                  </span>
                )}

                <span className="text-gray-300 dark:text-[#252A31] select-none">•</span>
              </Link>
            );
          })}
        </div>

        {/* Right fade */}
        <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-[#f8fafc] dark:from-[#0D1015] to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
}
