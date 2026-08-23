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

export default function OpenIpoTicker() {
  const [openIpos, setOpenIpos] = useState<TickerIpo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOpenIpos() {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const { data, error } = await supabase
          .from("ipos")
          .select("id, name, slug, ipo_type, gmp, price_max, price_min, status, close_date")
          .in("status", ["Open", "open"])
          .order("id", { ascending: false })
          .limit(10);

        if (!error && data && data.length > 0) {
          setOpenIpos(data);
        } else {
          // Fallback to active/upcoming if no strictly open IPOs currently in DB
          const { data: fallbackData } = await supabase
            .from("ipos")
            .select("id, name, slug, ipo_type, gmp, price_max, price_min, status, close_date")
            .gte("close_date", today)
            .order("gmp", { ascending: false, nullsFirst: false })
            .limit(8);

          if (fallbackData && fallbackData.length > 0) {
            setOpenIpos(fallbackData);
          }
        }
      } catch (e) {
        console.error("Failed to load ticker IPOs", e);
      } finally {
        setLoading(false);
      }
    }

    fetchOpenIpos();
  }, []);

  if (loading || openIpos.length === 0) return null;

  // Duplicate items for infinite marquee loop
  const displayItems = [...openIpos, ...openIpos, ...openIpos];

  return (
    <div className="w-full bg-[#f8fafc]/95 dark:bg-[#0D1015]/95 border-b border-gray-200 dark:border-[#252A31] backdrop-blur-md overflow-hidden select-none h-8 flex items-center text-[12px] relative z-20">
      {/* Static Label Badge */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-[#171B20] text-slate-700 dark:text-[#F1F3F5] font-semibold text-[11px] uppercase tracking-wider shrink-0 border-r border-gray-200 dark:border-[#252A31] z-10 h-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>Open Issues</span>
      </div>

      {/* Marquee Container (Moving Left-to-Right) */}
      <div className="flex-1 overflow-hidden relative flex items-center group">
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
                <span className="font-semibold text-[#0f172a] dark:text-[#F1F3F5]">
                  {ipo.name}
                </span>

                {ipo.ipo_type === "SME" && (
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                    (SME)
                  </span>
                )}

                {gmp != null && gmp > 0 ? (
                  <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    GMP: ₹{gmp} {gmpPct && `(+${gmpPct}%)`}
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-[#6B7280]">
                    GMP: -
                  </span>
                )}

                <span className="text-gray-300 dark:text-[#252A31] select-none">•</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
