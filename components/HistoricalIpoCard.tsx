import Link from "next/link";
import { formatDisplayDate } from "@/lib/formatters";

export type HistoricalIpoItem = {
  id: number;
  slug: string;
  name: string;
  ipo_type: string | null;
  exchange: string | null;
  listing_date: string | null;
  price_min: number | null;
  price_max: number | null;
  listing_price: number | null;
  listing_gain_percent: number | null;
  lot_size: number | null;
};

function formatPriceBand(min: number | null, max: number | null) {
  if (min != null && max != null) {
    if (min === max) return `₹${min.toLocaleString("en-IN")}`;
    return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
  }
  if (max != null) return `₹${max.toLocaleString("en-IN")}`;
  return "-";
}

function CompanyAvatar({ name }: { name: string }) {
  const letter = name.trim().charAt(0).toUpperCase();
  return (
    <span
      className="w-8 h-8 rounded-md flex items-center justify-center text-[13px] font-bold shrink-0 select-none bg-gray-100 text-gray-700 dark:bg-[#171B20] dark:text-[#F1F3F5] border border-gray-200 dark:border-[#252A31]"
      aria-hidden="true"
    >
      {letter}
    </span>
  );
}

/**
 * Card for an already-listed historical IPO. Unlike IpoCard (built for
 * open/upcoming IPOs and centred on GMP, which is a pre-listing signal),
 * this surfaces the realized outcome — actual listing gain % — since GMP
 * is null for every historical record and would otherwise render as a
 * dead "GMP: -" field on every single card.
 */
export default function HistoricalIpoCard({ ipo }: { ipo: HistoricalIpoItem }) {
  const segmentText =
    ipo.ipo_type?.toLowerCase() === "sme"
      ? ipo.exchange
        ? `${ipo.exchange} SME`
        : "SME"
      : ipo.exchange ?? "Mainboard";

  const gain = ipo.listing_gain_percent;
  const gainKnown = gain != null;
  const gainPositive = gainKnown && gain >= 0;

  return (
    <Link
      href={`/ipo/${ipo.slug}`}
      className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] hover:border-gray-300 dark:hover:border-[#374151] rounded-lg overflow-hidden h-full flex flex-col transition-colors duration-150"
    >
      <div className="px-4 pt-3.5 pb-3 border-b border-gray-100 dark:border-[#252A31]">
        <div className="flex items-start gap-2.5">
          <CompanyAvatar name={ipo.name} />
          <div className="min-w-0">
            <h3 className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] leading-snug line-clamp-1">
              {ipo.name}
            </h3>
            <p className="text-[11.5px] text-[#64748b] dark:text-[#9AA1AA] leading-tight mt-0.5">
              {segmentText} · Listed {formatDisplayDate(ipo.listing_date)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3.5 grid grid-cols-2 gap-x-4 gap-y-3 flex-1">
        <div>
          <p className="text-[11px] font-medium text-[#64748b] dark:text-[#9AA1AA] mb-0.5">
            Issue Price
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] leading-tight">
            {formatPriceBand(ipo.price_min, ipo.price_max)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-[#64748b] dark:text-[#9AA1AA] mb-0.5">
            Listing Price
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] leading-tight">
            {ipo.listing_price != null ? `₹${ipo.listing_price.toLocaleString("en-IN")}` : "-"}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-[#64748b] dark:text-[#9AA1AA] mb-0.5">
            Lot Size
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] leading-tight">
            {ipo.lot_size != null ? `${ipo.lot_size} shares` : "-"}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-[#64748b] dark:text-[#9AA1AA] mb-0.5">
            Listing Gain
          </p>
          <p
            className={`text-[13px] font-semibold leading-tight ${
              !gainKnown
                ? "text-[#0f172a] dark:text-[#F1F3F5]"
                : gainPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {gainKnown ? `${gainPositive ? "+" : ""}${gain.toFixed(2)}%` : "-"}
          </p>
        </div>
      </div>
    </Link>
  );
}
