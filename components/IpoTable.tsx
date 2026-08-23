"use client";

import Link from "next/link";
import type { IPOListItem } from "@/components/IpoCard";
import { formatDisplayDate, formatShortDate } from "@/lib/formatters";

type Props = {
  items: IPOListItem[];
  emptyMessage?: string;
};

const STATUS_STYLES: Record<string, string> = {
  Open: "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60",
  Upcoming: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-[#171B20] dark:text-[#9AA1AA] dark:border-[#252A31]",
  Listed: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-[#171B20] dark:text-[#9AA1AA] dark:border-[#252A31]",
  Closed: "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60",
};

function formatPriceBand(min: number | null, max: number | null) {
  if (min != null && max != null) {
    if (min === max) return `₹${min.toLocaleString("en-IN")}`;
    return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
  }
  if (max != null) return `₹${max.toLocaleString("en-IN")}`;
  return "-";
}

function formatDates(open: string | null, close: string | null) {
  if (!open && !close) return "-";
  const o = formatShortDate(open);
  const c = formatDisplayDate(close);
  if (o !== "-" && c !== "-") return `${o} - ${c}`;
  if (o !== "-") return o;
  if (c !== "-") return c;
  return "-";
}

export default function IpoTable({ items, emptyMessage = "No IPO listings found." }: Props) {
  if (items.length === 0) {
    return (
      <div className="border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418] rounded-lg px-5 py-8 text-center">
        <p className="text-[13px] text-gray-500 dark:text-[#9AA1AA]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418]">
      <table className="min-w-[880px] w-full text-[13px] text-left border-collapse">
        <thead className="bg-[#f8fafc] dark:bg-[#171B20] border-b border-gray-200 dark:border-[#252A31]">
          <tr>
            <th className="py-2.5 px-4 text-[11px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider sticky left-0 bg-[#f8fafc] dark:bg-[#171B20] z-10 w-[240px]">
              Company &amp; Segment
            </th>
            <th className="py-2.5 px-3 text-[11px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider">
              Status
            </th>
            <th className="py-2.5 px-3 text-[11px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider">
              Offer Dates
            </th>
            <th className="py-2.5 px-3 text-[11px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider">
              Price Band
            </th>
            <th className="py-2.5 px-3 text-[11px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider">
              Lot Size
            </th>
            <th className="py-2.5 px-3 text-[11px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider">
              GMP (Est. Gain)
            </th>
            <th className="py-2.5 px-3 text-[11px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider">
              Sub Total
            </th>
            <th className="py-2.5 px-4 text-[11px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-[#252A31]">
          {items.map((ipo) => {
            const price = Number(ipo.price_max ?? ipo.price_min ?? 0);
            const gmp = ipo.gmp != null ? Number(ipo.gmp) : null;
            const gmpPct = gmp != null && price > 0 ? ((gmp / price) * 100).toFixed(1) : null;
            const isPositive = gmp != null && gmp >= 0;
            const isNegative = gmp != null && gmp < 0;

            const status = ipo.status ?? "Upcoming";
            const statusStyle = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600 dark:bg-[#171B20] dark:text-[#9AA1AA]";

            const segment = ipo.ipo_type?.toLowerCase() === "sme"
              ? (ipo.exchange ? `${ipo.exchange} SME` : "SME")
              : (ipo.exchange ?? "Mainboard");

            return (
              <tr
                key={ipo.id}
                className="group hover:bg-gray-50 dark:hover:bg-[#171B20]/60 transition-colors"
              >
                {/* Company Name & Segment */}
                <td className="py-3 px-4 sticky left-0 bg-white dark:bg-[#111418] group-hover:bg-gray-50 dark:group-hover:bg-[#171B20] z-10 border-r border-gray-100 dark:border-[#252A31]">
                  <Link
                    href={`/ipo/${ipo.slug}`}
                    className="font-semibold text-[#0f172a] dark:text-[#F1F5F9] hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 text-[13.5px]"
                  >
                    {ipo.name}
                  </Link>
                  <p className="text-[11px] text-gray-500 dark:text-[#9AA1AA] mt-0.5">
                    {segment}
                  </p>
                </td>

                {/* Status */}
                <td className="py-3 px-3 align-middle">
                  <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md ${statusStyle}`}>
                    {status}
                  </span>
                </td>

                {/* Offer Dates */}
                <td className="py-3 px-3 align-middle text-gray-700 dark:text-[#9AA1AA] whitespace-nowrap text-[12.5px]">
                  {formatDates(ipo.open_date, ipo.close_date)}
                </td>

                {/* Price Band */}
                <td className="py-3 px-3 align-middle font-medium text-gray-800 dark:text-[#F1F5F9] whitespace-nowrap text-[12.5px]">
                  {formatPriceBand(ipo.price_min, ipo.price_max)}
                </td>

                {/* Lot Size */}
                <td className="py-3 px-3 align-middle text-gray-700 dark:text-[#9AA1AA] text-[12.5px]">
                  {ipo.lot_size != null ? `${ipo.lot_size} shares` : "-"}
                </td>

                {/* GMP */}
                <td className="py-3 px-3 align-middle whitespace-nowrap font-medium text-[13px]">
                  {gmp != null ? (
                    <span className={`inline-flex items-center gap-1 tabular-nums ${
                      isPositive ? "text-emerald-600 dark:text-emerald-400" : isNegative ? "text-rose-600 dark:text-rose-400" : "text-[#0f172a] dark:text-[#F1F5F9]"
                    }`}>
                      {isPositive ? "+" : ""}₹{gmp.toLocaleString("en-IN")}
                      {gmpPct && (
                        <span className={`text-[10px] px-1 py-0.2 rounded font-medium ${
                          isPositive 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}>
                          ({isPositive ? "+" : ""}{gmpPct}%)
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-gray-400 dark:text-[#6B7280]">-</span>
                  )}
                </td>

                {/* Sub Total */}
                <td className="py-3 px-3 align-middle font-medium text-[#0f172a] dark:text-[#F1F5F9] tabular-nums text-[12.5px]">
                  {ipo.sub_total != null && Number(ipo.sub_total) > 0 ? `${Number(ipo.sub_total).toFixed(2)}x` : "-"}
                </td>

                {/* Action */}
                <td className="py-3 px-4 align-middle text-right whitespace-nowrap">
                  <Link
                    href={`/ipo/${ipo.slug}`}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
