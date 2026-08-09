"use client";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { useWatchlist } from "@/lib/hooks/useWatchlist";
import GlossaryTooltip from "./GlossaryTooltip";
import { calculateHypeScore, getHypeScoreColor } from "@/lib/hypeScore";

export type IPOListItem = {
  id: number;
  slug: string;
  name: string;
  exchange: string | null;
  sector: string | null;
  status: string | null;
  ipo_type?: string | null; // Mainboard or SME
  price_min: number | null;
  price_max: number | null;
  gmp: number | null;
  lot_size: number | null;
  open_date: string | null;
  close_date: string | null;
  allotment_date?: string | null;
  listing_date?: string | null;
  allotment_status?: string | null; // "out" | null
  allotment_out?: boolean | null; // true when admin marks allotment out
  sub_total: string | number | null;
  sub_qib?: string | number | null;
  sub_rii?: string | number | null;
  issue_size?: string | number | null;
  allotment_link?: string | null;
  issue_price?: number | null; // usually same as price_max
  listing_price?: number | null; // exact listing price on exchange
};

const STATUS_STYLES: Record<string, string> = {
  Open: "bg-emerald-50 text-emerald-700 border border-emerald-200 status-open",
  Upcoming: "bg-blue-50 text-blue-700 border border-blue-200",
  Listed: "bg-violet-50 text-violet-700 border border-violet-200",
  Closed: "bg-rose-50 text-rose-600 border border-rose-200",
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
        "bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse",
    };
  }

  // 2️⃣ Allotment date reached → Awaited
  if (ipo.allotment_date) {
    const allot = new Date(ipo.allotment_date);
    if (!isNaN(allot.getTime()) && today >= allot) {
      return {
        text: "Allotment Awaited",
        className:
          "bg-amber-50 text-amber-700 border border-amber-200",
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
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse"
      : "bg-rose-50 text-rose-600 border border-rose-200",
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
  const open = valueOrDash(openDate);
  const close = valueOrDash(closeDate);
  if (open === "—" && close === "—") return "—";
  return `${open} – ${close}`;
}

function formatSubscription(subTotal: string | number | null) {
  if (subTotal == null) return "—";
  if (typeof subTotal === "string") {
    const trimmed = subTotal.trim();
    return trimmed ? trimmed : "—";
  }
  return `${subTotal}x`;
}

export default function IpoCard({ ipo }: { ipo: IPOListItem }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const isStarred = isInWatchlist(ipo.slug);
  const displayStatus = getFinalStatus(ipo);

  const statusStyle =
    STATUS_STYLES[displayStatus] ?? STATUS_STYLES.Listed;

  const allotmentBadge = getAllotmentBadge(ipo);

  const listedReturnBadge = getListedReturnBadge(
    ipo.listing_date,
    ipo.listing_price,
    ipo.issue_price ?? ipo.price_max ?? null
  );

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
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden card-hover gradient-border h-full flex flex-col">
      <div className="px-5 pt-5 pb-4 border-b border-[#f8fafc] space-y-2.5">
        {/* IPO Name & Star */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold text-[#0f172a] leading-snug line-clamp-2">
            {ipo.name}
          </h3>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWatchlist(ipo.slug);
            }}
            className="text-gray-400 hover:text-yellow-500 transition-colors flex-shrink-0"
            title={isStarred ? "Remove from watchlist" : "Add to watchlist"}
          >
            {isStarred ? (
              <StarSolid className="w-5 h-5 text-yellow-400" />
            ) : (
              <StarOutline className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-[11.5px] text-[#64748b] leading-tight">
          {ipo.exchange ?? "—"}
          {ipo.sector ? ` · ${ipo.sector}` : ""}
        </p>
        {/* Badges — wrap naturally below the name */}
        <div className="flex flex-wrap items-center gap-1.5">
          {ipo.ipo_type && (
            <span className="inline-flex items-center text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              {ipo.ipo_type}
            </span>
          )}
          <span
            className={`inline-flex items-center text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded ${statusStyle}`}
          >
            {displayStatus}
          </span>
          {allotmentBadge && (
            <span
              className={`inline-flex items-center text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded ${allotmentBadge.className}`}
            >
              {allotmentBadge.text}
            </span>
          )}
          {listedReturnBadge && (
            <span
              className={`inline-flex items-center text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded ${listedReturnBadge.className}`}
            >
              Listed: {listedReturnBadge.text}
            </span>
          )}
        </div>
      </div>

      <div className="px-5 py-5 grid grid-cols-2 gap-x-6 gap-y-5 flex-1">
        <div className="col-span-2">
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#64748b] mb-1.5">
            Offer Dates
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] leading-tight">
            {formatOfferDates(ipo.open_date, ipo.close_date)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#64748b] mb-1.5">
            Price Band
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] leading-tight">
            {formatPriceBand(ipo.price_min, ipo.price_max)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#64748b] mb-1.5">
            Subscription
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] leading-tight">
            {formatSubscription(ipo.sub_total)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#64748b] mb-1.5">
            Lot Size
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] leading-tight">
            {ipo.lot_size != null ? `${ipo.lot_size} shares` : "—"}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#64748b] mb-1.5">
            <GlossaryTooltip term="GMP">GMP</GlossaryTooltip>
          </p>
          <p className={`text-[13px] font-semibold leading-tight flex items-center gap-1 ${ipo.gmp != null
              ? ipo.gmp >= 0
                ? "gmp-positive"
                : "gmp-negative"
              : "text-[#0f172a]"
            }`}>
            {ipo.gmp != null ? `₹${ipo.gmp.toLocaleString("en-IN")}` : "—"}
            {ipo.gmp != null && ipo.price_max && (
              <span className={`text-[10px] px-1 py-0.5 rounded ml-1 ${ipo.gmp >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {ipo.gmp > 0 ? "+" : ""}{((ipo.gmp / ipo.price_max) * 100).toFixed(1)}%
              </span>
            )}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#64748b] mb-1.5 flex items-center gap-1 group/tooltip relative w-fit">
            Hype Score
            <span className="cursor-help flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-gray-400 text-[9px] hover:text-[#0f172a] hover:border-[#0f172a] transition-colors">
              i
            </span>
            <span className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-48 p-2.5 bg-gray-900 text-white text-[11px] leading-relaxed rounded-md shadow-xl z-[100] pointer-events-none before:content-[''] before:absolute before:top-full before:left-2.5 before:border-[5px] before:border-transparent before:border-t-gray-900">
              Algorithmically generated out of 100 based on live momentum. Not investment advice.
            </span>
          </p>
          <p className={`text-[13px] font-semibold leading-tight flex items-center gap-1 ${hypeScore != null ? getHypeScoreColor(hypeScore) : 'text-[#0f172a]'}`}>
            {hypeScore != null ? `${hypeScore} / 100` : "—"}
          </p>
        </div>
      </div>
      {isAllotmentOut && ipo.allotment_link && (
        <div className="px-5 pb-5 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(ipo.allotment_link!, "_blank");
            }}
            className="block w-full text-center text-sm font-semibold rounded-lg py-2.5
                       bg-emerald-600 text-white hover:bg-emerald-700
                       transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            Check Allotment
          </button>
        </div>
      )}
    </div>
  );
}