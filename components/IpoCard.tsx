"use client";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { useWatchlist } from "@/lib/hooks/useWatchlist";
import GlossaryTooltip from "./GlossaryTooltip";
import { calculateHypeScore, getHypeScoreColor } from "@/lib/hypeScore";
import { formatDisplayDate, formatShortDate, formatSubscriptionTimes } from "@/lib/formatters";

export type IPOListItem = {
  id: number;
  slug: string;
  name: string;
  exchange: string | null;
  sector: string | null;
  status: string | null;
  ipo_type?: string | null;
  price_min: number | null;
  price_max: number | null;
  gmp: number | null;
  lot_size: number | null;
  open_date: string | null;
  close_date: string | null;
  allotment_date?: string | null;
  listing_date?: string | null;
  allotment_status?: string | null;
  allotment_out?: boolean | null;
  sub_total: string | number | null;
  sub_qib?: string | number | null;
  sub_rii?: string | number | null;
  issue_size?: string | number | null;
  allotment_link?: string | null;
  issue_price?: number | null;
  listing_price?: number | null;
  listing_gain?: string | null;       // From IPOAlerts enrichment
  subscription_updated_at?: string | null;
  updated_at?: string | null;
};

const STATUS_STYLES: Record<string, string> = {
  Open: "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60",
  Upcoming: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-[#171B20] dark:text-[#9AA1AA] dark:border-[#252A31]",
  Listed: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-[#171B20] dark:text-[#9AA1AA] dark:border-[#252A31]",
  Closed: "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60",
};

function calculateStatus(
  openDate: string | null,
  closeDate: string | null
): string {
  if (!openDate || !closeDate) return "Upcoming";
  const today = new Date();
  const open = new Date(openDate);
  const close = new Date(closeDate);
  if (today < open) return "Upcoming";
  if (today >= open && today <= close) return "Open";
  if (today > close) return "Closed";
  return "Upcoming";
}

function getLocalDateStr(date = new Date()): string {
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

function getUrgencyText(ipo: IPOListItem): string | null {
  const todayIST = getLocalDateStr();
  const tomorrowIST = getLocalDateStr(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const in2Days = getLocalDateStr(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));

  if (ipo.close_date === todayIST) return "Closes today";
  if (ipo.close_date === tomorrowIST) return "Closes tomorrow";
  if (ipo.open_date === todayIST) return "Opens today";
  if (ipo.open_date === tomorrowIST) return "Opens tomorrow";
  if (ipo.open_date === in2Days) return "Opens in 2 days";
  return null;
}

function isListed4pmIST(listingDate: string | null | undefined): boolean {
  if (!listingDate) return false;
  const cutoffUTC = new Date(`${listingDate}T10:30:00Z`);
  return !isNaN(cutoffUTC.getTime()) && Date.now() >= cutoffUTC.getTime();
}

function getFinalStatus(ipo: IPOListItem) {
  if (isListed4pmIST(ipo.listing_date)) {
    return "Listed";
  }
  return calculateStatus(ipo.open_date, ipo.close_date);
}

function formatPriceBand(priceMin: number | null, priceMax: number | null) {
  if (priceMin != null && priceMax != null) {
    return `₹${priceMin.toLocaleString("en-IN")} - ₹${priceMax.toLocaleString("en-IN")}`;
  }
  return "-";
}

function formatOfferDates(openDate: string | null, closeDate: string | null) {
  if (!openDate && !closeDate) return "-";
  const open = formatShortDate(openDate);
  const close = formatDisplayDate(closeDate);
  if (open !== "-" && close !== "-") return `${open} - ${close}`;
  if (open !== "-") return open;
  if (close !== "-") return close;
  return "-";
}

function formatSubscription(subTotal: string | number | null) {
  return formatSubscriptionTimes(subTotal, "-");
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

export default function IpoCard({ ipo }: { ipo: IPOListItem }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const isStarred = isInWatchlist(ipo.slug);
  const displayStatus = getFinalStatus(ipo);
  const statusStyle = STATUS_STYLES[displayStatus] ?? STATUS_STYLES.Listed;
  const urgency = getUrgencyText(ipo);

  const isAllotmentOut =
    Boolean(ipo.allotment_out) ||
    ipo.allotment_status === "out" ||
    (ipo.listing_date && !isNaN(new Date(ipo.listing_date).getTime()) && new Date().getTime() >= new Date(ipo.listing_date).getTime());

  const hypeScore = calculateHypeScore({
    gmp: ipo.gmp != null ? Number(ipo.gmp) : null,
    issuePrice: ipo.price_max != null ? Number(ipo.price_max) : null,
    qibSub: ipo.sub_qib != null ? Number(ipo.sub_qib) : null,
    retailSub: ipo.sub_rii != null ? Number(ipo.sub_rii) : null,
    issueSize: ipo.issue_size != null ? Number(ipo.issue_size) : null,
  });

  // Clean segment tag: "NSE SME" or "Mainboard"
  const segmentText = ipo.ipo_type?.toLowerCase() === "sme" 
    ? (ipo.exchange ? `${ipo.exchange} SME` : "SME")
    : (ipo.exchange ?? "Mainboard");

  return (
    <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] hover:border-gray-300 dark:hover:border-[#374151] rounded-lg overflow-hidden h-full flex flex-col transition-colors duration-150">
      
      {/* Header section with Company Name, Subtitle and Star */}
      <div className="px-4 pt-3.5 pb-3 border-b border-gray-100 dark:border-[#252A31]">
        <div className="flex items-start gap-2.5">
          <CompanyAvatar name={ipo.name} />
          <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] leading-snug line-clamp-1">
                {ipo.name}
              </h3>
              <p className="text-[11.5px] text-[#64748b] dark:text-[#9AA1AA] leading-tight mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>{segmentText}</span>
                {urgency && (
                  <>
                    <span className="text-gray-300 dark:text-[#252A31]">•</span>
                    <span className="text-amber-700 dark:text-amber-400 font-medium">{urgency}</span>
                  </>
                )}
              </p>
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWatchlist(ipo.slug);
              }}
              className="text-gray-400 hover:text-amber-500 dark:text-[#6B7280] dark:hover:text-amber-400 transition-colors flex-shrink-0 mt-0.5"
              title={isStarred ? "Remove from watchlist" : "Add to watchlist"}
            >
              {isStarred ? (
                <StarSolid className="w-4 h-4 text-amber-400" />
              ) : (
                <StarOutline className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Clean Status & Metadata indicator */}
        <div className="flex items-center gap-2 mt-2.5">
          <span
            className={`inline-flex items-center text-[10.5px] font-semibold px-2 py-0.5 rounded-md ${statusStyle}`}
          >
            {displayStatus}
          </span>
          {isAllotmentOut && displayStatus !== "Listed" && (
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50">
              Allotment Out
            </span>
          )}
        </div>
      </div>

      {/* Grid: Financial & Issue Details */}
      <div className="px-4 py-3.5 grid grid-cols-2 gap-x-4 gap-y-3 flex-1">
        <div className="col-span-2">
          <p className="text-[11px] font-medium text-[#64748b] dark:text-[#9AA1AA] mb-0.5">
            Offer dates
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] leading-tight">
            {formatOfferDates(ipo.open_date, ipo.close_date)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-[#64748b] dark:text-[#9AA1AA] mb-0.5">
            Price band
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] leading-tight">
            {formatPriceBand(ipo.price_min, ipo.price_max)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-[#64748b] dark:text-[#9AA1AA] mb-0.5">
            Subscription
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] leading-tight">
            {formatSubscription(ipo.sub_total)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-[#64748b] dark:text-[#9AA1AA] mb-0.5">
            Lot size
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] leading-tight">
            {ipo.lot_size != null ? `${ipo.lot_size} shares` : "-"}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-[#64748b] dark:text-[#9AA1AA] mb-0.5">
            <GlossaryTooltip term="GMP">GMP</GlossaryTooltip>
          </p>
          <p className={`text-[13px] font-semibold leading-tight flex items-center gap-1.5 ${
            ipo.gmp != null
              ? ipo.gmp >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              : "text-[#0f172a] dark:text-[#F1F3F5]"
          }`}>
            {ipo.gmp != null ? `₹${ipo.gmp.toLocaleString("en-IN")}` : "-"}
            {ipo.gmp != null && ipo.price_max && (
              <span className={`text-[10px] px-1 py-0.2 rounded font-medium ${
                ipo.gmp >= 0 
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
              }`}>
                {ipo.gmp > 0 ? "+" : ""}{((ipo.gmp / ipo.price_max) * 100).toFixed(1)}%
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Outbound Allotment CTA if Out */}
      {isAllotmentOut && ipo.allotment_link && (
        <div className="px-4 pb-3.5 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(ipo.allotment_link!, "_blank");
            }}
            className="block w-full text-center text-[12.5px] font-semibold rounded-md py-1.5 bg-emerald-600 dark:bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Check Allotment Status
          </button>
        </div>
      )}
    </div>
  );
}