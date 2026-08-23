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
    <div className="w-full bg-[#f1f5f9]/90 dark:bg-[#0b1322]/90 border-b border-[#e2e8f0] dark:border-[#22304A] backdrop-blur-md overflow-hidden select-none h-8.5 flex items-center text-[12px] relative z-20">
      {/* Static Label Badge */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] uppercase tracking-wider shrink-0 border-r border-[#e2e8f0] dark:border-[#22304A] z-10 h-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>Open IPOs</span>
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
                className="inline-flex items-center gap-2 text-[#334155] dark:text-[#CBD5E1] hover:text-[#2563eb] dark:hover:text-[#3B82F6] transition-colors py-1 cursor-pointer shrink-0"
              >
                <span className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">
                  {ipo.name}
                </span>

                {ipo.ipo_type === "SME" && (
                  <span className="px-1 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[9px] font-bold uppercase tracking-wider">
                    SME
                  </span>
                )}

                {gmp != null && gmp > 0 ? (
                  <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    GMP: ₹{gmp} {gmpPct && `(+${gmpPct}%)`}
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-slate-500 font-normal">
                    GMP: -
                  </span>
                )}

                <span className="text-gray-300 dark:text-slate-700 select-none">•</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
