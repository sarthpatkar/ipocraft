"use client";
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
  allotment_link?: string | null;
  sub_total: string | number | null;
  listing_price?: number | null;
  issue_price?: number | null;
};

const STATUS_STYLES: Record<string, string> = {
  Open: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Upcoming: "bg-blue-50 text-blue-700 border border-blue-200",
  Listed: "bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse",
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


function getFinalStatus(ipo: IPOListItem) {
  const today = new Date();

  // 1️⃣ Listed override (highest priority)
  if (ipo.listing_date) {
    const list = new Date(ipo.listing_date);
    if (!isNaN(list.getTime()) && today >= list) {
      return "Listed";
    }
  }

  // 2️⃣ Normal lifecycle
  const base = calculateStatus(ipo.open_date, ipo.close_date);
  return base;
}

function getAllotmentBadge(ipo: IPOListItem) {
  const today = new Date();

  // If IPO is already listed → do NOT show allotment badges
  if (ipo.listing_date) {
    const list = new Date(ipo.listing_date);
    if (!isNaN(list.getTime()) && today >= list) {
      return null;
    }
  }

  // Admin marked as OUT (highest priority) — force boolean conversion (Supabase may return "true"/"false")
  const allotmentOut =
    Boolean(ipo.allotment_out) || ipo.allotment_status === "out";

  if (allotmentOut) {
    return {
      text: "Allotment Out",
      className:
        "bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse",
    };
  }

  // Date reached but admin not updated yet
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

  return null;
}

function getListedReturnBadge(
  listingDate?: string | null,
  listingPrice?: number | null,
  issuePrice?: number | null
) {
  if (!listingDate || listingPrice == null || issuePrice == null) return null;

  const today = new Date();
  const list = new Date(listingDate);

  if (isNaN(list.getTime()) || today < list) return null;

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
  const displayStatus = getFinalStatus(ipo);

  const statusStyle =
    STATUS_STYLES[displayStatus] ?? STATUS_STYLES.Listed;

  const allotmentBadge = getAllotmentBadge(ipo);

  const listedReturnBadge = getListedReturnBadge(
    ipo.listing_date,
    ipo.listing_price,
    ipo.issue_price ?? ipo.price_max ?? null
  );

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-lg overflow-hidden hover:border-[#b8c9e0] hover:shadow-[0_6px_28px_rgba(0,0,0,0.07)] transition-all duration-200 h-full">
      <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-[#f8fafc] gap-3">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-[#0f172a] truncate">
            {ipo.name}
          </h3>
          <p className="text-[11.5px] text-[#94a3b8] mt-1 truncate">
            {ipo.exchange ?? "—"}
            {ipo.sector ? ` · ${ipo.sector}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {ipo.ipo_type && (
            <span className="shrink-0 inline-flex items-center text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              {ipo.ipo_type}
            </span>
          )}
          <span
            className={`shrink-0 inline-flex items-center text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded ${statusStyle}`}
          >
            {displayStatus}
          </span>
          {allotmentBadge && (
            <span
              className={`shrink-0 inline-flex items-center text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded ${allotmentBadge.className}`}
            >
              {allotmentBadge.text}
            </span>
          )}
          {listedReturnBadge && (
            <span
              className={`shrink-0 inline-flex items-center text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded ${listedReturnBadge.className}`}
            >
              Listed: {listedReturnBadge.text}
            </span>
          )}
        </div>
      </div>

      <div className="px-5 py-5 grid grid-cols-2 gap-x-6 gap-y-5">
        <div className="col-span-2">
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#94a3b8] mb-1.5">
            Offer Dates
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] leading-tight">
            {formatOfferDates(ipo.open_date, ipo.close_date)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#94a3b8] mb-1.5">
            Price Band
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] leading-tight">
            {formatPriceBand(ipo.price_min, ipo.price_max)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#94a3b8] mb-1.5">
            Subscription
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] leading-tight">
            {formatSubscription(ipo.sub_total)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#94a3b8] mb-1.5">
            Lot Size
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] leading-tight">
            {ipo.lot_size != null ? `${ipo.lot_size} shares` : "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#94a3b8] mb-1.5">
            GMP
          </p>
          <p className="text-[13px] font-semibold text-[#0f172a] leading-tight">
            {ipo.gmp != null ? `₹${ipo.gmp.toLocaleString("en-IN")}` : "—"}
          </p>
        </div>
      </div>
      {allotmentBadge?.text === "Allotment Out" && ipo.allotment_link && (
        <div className="px-5 pb-5">
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