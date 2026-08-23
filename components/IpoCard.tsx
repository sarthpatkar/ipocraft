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
  Open: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60 status-open",
  Upcoming: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60",
  Listed: "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60",
  Closed: "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60",
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
  // IST = UTC+5:30
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

function getUrgencyChip(ipo: IPOListItem): { text: string; className: string } | null {
  const todayIST = getLocalDateStr();
  const tomorrowIST = getLocalDateStr(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const in2Days = getLocalDateStr(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));

  if (ipo.close_date === todayIST) {
    return {
      text: "Closes Today",
      className: "bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/60",
    };
  }
  if (ipo.close_date === tomorrowIST) {
    return {
      text: "Closes Tomorrow",
      className: "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/60",
    };
  }
  if (ipo.open_date === todayIST) {
    return {
      text: "Opens Today",
      className: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60",
    };
  }
  if (ipo.open_date === tomorrowIST) {
    return {
      text: "Opens Tomorrow",
      className: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60",
    };
  }
  if (ipo.open_date === in2Days) {
    return {
      text: "Opens in 2 Days",
      className: "bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60",
    };
  }
  return null;
}

function gmpAgeText(updatedAt?: string | null): string | null {
  if (!updatedAt) return null;
  const diffMs = Date.now() - new Date(updatedAt).getTime();
  if (diffMs < 0) return null;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

function getListingGainBadge(listingGain?: string | null) {
  if (!listingGain) return null;
  const num = parseFloat(listingGain);
  if (isNaN(num)) return null;
  const isPositive = num >= 0;
  return {
    text: `${isPositive ? "+" : ""}${num.toFixed(1)}% Listed`,
    className: isPositive
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60"
      : "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60",
  };
}

function isListed4pmIST(listingDate: string | null | undefined): boolean {
  if (!listingDate) return false;
  // Convert listing date to exactly 4:00 PM IST (which is 10:30 AM UTC)
  // We append T10:30:00Z to ensure strict UTC parsing independent of user browser
  const cutoffUTC = new Date(`${listingDate}T10:30:00Z`);
  return !isNaN(cutoffUTC.getTime()) && Date.now() >= cutoffUTC.getTime();
}

function getFinalStatus(ipo: IPOListItem) {
  // 1️⃣ Listed override (highest priority) - Active ONLY after 4:00 PM IST on listing day
  if (isListed4pmIST(ipo.listing_date)) {
    return "Listed";
  }

  // 2️⃣ Normal lifecycle
  const base = calculateStatus(ipo.open_date, ipo.close_date);
  return base;
}

function getAllotmentBadge(ipo: IPOListItem) {
  const today = new Date();

  // If the IPO is officially listed (after 4 PM IST on listing day), REMOVE the allotment badge!
  if (isListed4pmIST(ipo.listing_date)) {
    return null;
  }

  // Force boolean conversion (Supabase may return truthy values)
  const allotmentOut =
    Boolean(ipo.allotment_out) || ipo.allotment_status === "out";

  // 1️⃣ Admin marked OUT → always show (unless already listed, handled above)
  if (allotmentOut) {
    return {
      text: "Allotment Out",
      className:
        "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60",
    };
  }

  // 2️⃣ Allotment date reached → Awaited
  if (ipo.allotment_date) {
    const allot = new Date(ipo.allotment_date);
    if (!isNaN(allot.getTime()) && today >= allot) {
      return {
        text: "Allotment Awaited",
        className:
          "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60",
      };
    }
  }

  // 3️⃣ Else → nothing
  return null;
}

function getListedReturnBadge(
  listingDate?: string | null,
  listingPrice?: number | null,
  issuePrice?: number | null
) {
  if (!listingDate || listingPrice == null || issuePrice == null) return null;

  // Only show the listed return AFTER 4:00 PM IST on listing day
  if (!isListed4pmIST(listingDate)) return null;

  const returnPct = ((listingPrice - issuePrice) / issuePrice) * 100;
  const positive = returnPct >= 0;

  return {
    text: `${positive ? "+" : ""}${returnPct.toFixed(1)}%`,
    className: positive
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60"
      : "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60",
  };
}

function formatPriceBand(priceMin: number | null, priceMax: number | null) {
  if (priceMin != null && priceMax != null) {
    return `₹${priceMin.toLocaleString("en-IN")} – ₹${priceMax.toLocaleString("en-IN")}`;
  }
  return "—";
}

function valueOrDash(value: unknown) {
  if (value == null) return "—";
  if (typeof value === "string" && value.trim() === "") return "—";
  return String(value);
}

function formatOfferDates(openDate: string | null, closeDate: string | null) {
  if (!openDate && !closeDate) return "—";
  const open = formatShortDate(openDate);
  const close = formatDisplayDate(closeDate);
  if (open !== "—" && close !== "—") return `${open} – ${close}`;
  if (open !== "—") return open;
  if (close !== "—") return close;
  return "—";
}

function formatSubscription(subTotal: string | number | null) {
  return formatSubscriptionTimes(subTotal, "—");
}

function CompanyAvatar({ name }: { name: string }) {
  const letter = name.trim().charAt(0).toUpperCase();
  return (
    <span
      className="w-9 h-9 rounded-lg flex items-center justify-center text-[14px] font-bold shrink-0 select-none bg-[#f1f5f9] text-[#475569] dark:bg-[#162238] dark:text-[#94A3B8]"
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
  const allotmentBadge = getAllotmentBadge(ipo);
  const urgencyChip = getUrgencyChip(ipo);
  const gmpAge = gmpAgeText(ipo.updated_at);

  const listedReturnBadge = getListedReturnBadge(
    ipo.listing_date,
    ipo.listing_price,
    ipo.issue_price ?? ipo.price_max ?? null
  );

  // If we have enriched listing_gain from IPOAlerts, prefer that over computed
  const listingGainBadge = displayStatus === "Listed"
    ? (getListingGainBadge(ipo.listing_gain) ?? listedReturnBadge)
    : listedReturnBadge;

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

  return (
    <div className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] hover:border-gray-300 dark:hover:border-[#3B82F6]/60 rounded-xl overflow-hidden card-hover h-full flex flex-col transition-colors duration-150">
      <div className="px-4.5 pt-4 pb-3 border-b border-[#f1f5f9] dark:border-[#22304A] space-y-2">
        {/* IPO Name, Avatar & Star */}
        <div className="flex items-start gap-2.5">
          <CompanyAvatar name={ipo.name} />
          <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug line-clamp-2">
                {ipo.name}
              </h3>
              <p className="text-[11px] text-[#64748b] dark:text-[#94A3B8] leading-tight mt-0.5">
                {ipo.exchange ?? "—"}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWatchlist(ipo.slug);
              }}
              className="text-gray-400 hover:text-yellow-500 dark:text-[#64748B] dark:hover:text-yellow-400 transition-colors flex-shrink-0 mt-0.5"
              title={isStarred ? "Remove from watchlist" : "Add to watchlist"}
            >
              {isStarred ? (
                <StarSolid className="w-4.5 h-4.5 text-yellow-400" />
              ) : (
                <StarOutline className="w-4.5 h-4.5" />
              )}
            </button>
          </div>
        </div>
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {ipo.ipo_type && (
            <span className={`inline-flex items-center text-[10.5px] font-semibold tracking-wide px-2 py-0.5 rounded ${
              ipo.ipo_type.toLowerCase() === "sme"
                ? "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40"
                : "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40"
            }`}>
              {ipo.ipo_type.toUpperCase()}
            </span>
          )}
          <span
            className={`inline-flex items-center text-[10.5px] font-semibold tracking-wide px-2 py-0.5 rounded ${statusStyle}`}
          >
            {displayStatus}
          </span>
          {allotmentBadge && (
            <span
              className={`inline-flex items-center text-[10.5px] font-semibold tracking-wide px-2 py-0.5 rounded ${allotmentBadge.className}`}
            >
              {allotmentBadge.text}
            </span>
          )}
          {/* Urgency chip — Closes Today / Opens Today etc */}
          {urgencyChip && displayStatus !== "Listed" && (
            <span
              className={`inline-flex items-center text-[10.5px] font-semibold tracking-wide px-2 py-0.5 rounded ${urgencyChip.className}`}
            >
              {urgencyChip.text}
            </span>
          )}
          {/* Listing gain badge */}
          {listingGainBadge && (
            <span
              className={`inline-flex items-center text-[10.5px] font-semibold tracking-wide px-2 py-0.5 rounded ${listingGainBadge.className}`}
            >
              {listingGainBadge.text}
            </span>
          )}
        </div>
      </div>

      <div className="px-4.5 py-3.5 grid grid-cols-2 gap-x-4 gap-y-3.5 flex-1">
        <div className="col-span-2">
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#64748b] dark:text-[#94A3B8] mb-1">
            Offer Dates
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-tight">
            {formatOfferDates(ipo.open_date, ipo.close_date)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#64748b] dark:text-[#94A3B8] mb-1">
            Price Band
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-tight">
            {formatPriceBand(ipo.price_min, ipo.price_max)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#64748b] dark:text-[#94A3B8] mb-1">
            Subscription
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-tight">
            {formatSubscription(ipo.sub_total)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#64748b] dark:text-[#94A3B8] mb-1">
            Lot Size
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-tight">
            {ipo.lot_size != null ? `${ipo.lot_size} shares` : "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#64748b] dark:text-[#94A3B8] mb-1">
            <GlossaryTooltip term="GMP">GMP</GlossaryTooltip>
          </p>
          <p className={`text-[13px] font-semibold leading-tight flex items-center gap-1 ${
            ipo.gmp != null
              ? ipo.gmp >= 0 ? "text-emerald-600 dark:text-[#34D399]" : "text-rose-600 dark:text-[#F87171]"
              : "text-[#0f172a] dark:text-[#F1F5F9]"
          }`}>
            {ipo.gmp != null ? `₹${ipo.gmp.toLocaleString("en-IN")}` : "—"}
            {ipo.gmp != null && ipo.price_max && (
              <span className={`text-[10px] px-1 py-0.2 rounded font-medium ${
                ipo.gmp >= 0 
                  ? 'bg-green-100 text-green-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                  : 'bg-red-100 text-red-700 dark:bg-rose-950/40 dark:text-rose-300'
              }`}>
                {ipo.gmp > 0 ? "+" : ""}{((ipo.gmp / ipo.price_max) * 100).toFixed(1)}%
              </span>
            )}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#64748b] dark:text-[#94A3B8] mb-1 flex items-center gap-1 group/tooltip relative w-fit">
            Hype Score
            <span className="cursor-help flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-[#22304A] text-gray-400 dark:text-[#64748B] text-[9px] hover:text-[#0f172a] dark:hover:text-[#F1F5F9] transition-colors">
              i
            </span>
            <span className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-48 p-2.5 bg-gray-900 dark:bg-[#162238] text-white text-[11px] leading-relaxed rounded-md shadow-xl z-[100] pointer-events-none border border-[#22304A]">
              Algorithmically generated momentum metric (0-100). Informational only, not investment advice.
            </span>
          </p>
          <p className={`text-[13px] font-semibold leading-tight flex items-center gap-1 ${hypeScore != null ? getHypeScoreColor(hypeScore) : 'text-[#0f172a] dark:text-[#F1F5F9]'}`}>
            {hypeScore != null ? `${hypeScore} / 100` : "—"}
          </p>
        </div>
      </div>
      {isAllotmentOut && ipo.allotment_link && (
        <div className="px-4.5 pb-4 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(ipo.allotment_link!, "_blank");
            }}
            className="block w-full text-center text-[13px] font-semibold rounded-lg py-2
                       bg-emerald-600 dark:bg-emerald-600 text-white hover:bg-emerald-700
                       transition-colors shadow-xs"
          >
            Check Allotment
          </button>
        </div>
      )}
    </div>
  );
}