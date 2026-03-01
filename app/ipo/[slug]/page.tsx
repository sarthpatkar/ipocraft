export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: ipo } = await supabase
    .from("ipos")
    .select("name, sector, exchange, gmp, price_min, price_max")
    .eq("slug", slug)
    .single();

  const title = ipo?.name
    ? `${ipo.name} IPO GMP, Price, Dates, Details | IPOCraft`
    : "IPO Details | IPOCraft";

  const description = ipo?.name
    ? `Latest GMP, price band, dates, subscription, and listing insights for ${ipo.name} IPO. Data sourced from public filings and exchange disclosures.`
    : "IPO details including GMP, price band, dates, subscription, and listing insights.";

  return {
    title,
    description,
    keywords: [
      "IPO GMP",
      "IPO details",
      "IPO listing gain",
      "Grey Market Premium India",
      ipo?.name,
    ],
    openGraph: {
      title,
      description,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import GMPChart from "@/components/GmpChart";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

type StatusType = "Open" | "Upcoming" | "Listed" | "Closed";

const STATUS_STYLES: Record<StatusType, string> = {
  Open: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Upcoming: "bg-blue-50 text-blue-700 border border-blue-200",
  Listed: "bg-slate-100 text-slate-500 border border-slate-200",
  Closed: "bg-rose-50 text-rose-600 border border-rose-200",
};

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-[10.5px] font-semibold tracking-[0.22em] uppercase mb-4 ${light ? "text-[#93c5fd]" : "text-[#2563eb]"}`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {children}
    </p>
  );
}

function DataLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#94a3b8] mb-1.5"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {children}
    </p>
  );
}

export default async function IPODetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: ipo } = await supabase
    .from("ipos")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!ipo) return notFound();

  const { data: gmpHistory } = await supabase
    .from("gmp_history")
    .select("gmp, created_at")
    .eq("ipo_id", ipo.id)
    .order("created_at", { ascending: true });

  const status = ipo.status as StatusType;
  const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES["Listed"];

  const priceBand =
    ipo.price_min && ipo.price_max
      ? `₹${ipo.price_min} – ₹${ipo.price_max}`
      : "—";

  const gmpSeries = (gmpHistory ?? [])
    .map((point) => {
      if (point.gmp == null || !point.created_at) return null;
      const parsedGmp = Number(point.gmp);
      if (Number.isNaN(parsedGmp)) return null;
      return { gmp: parsedGmp, created_at: point.created_at };
    })
    .filter((point): point is { gmp: number; created_at: string } => point !== null);

  const latestHistoryPoint = gmpSeries.at(-1) ?? null;
  const previousHistoryPoint = gmpSeries.at(-2) ?? null;

  const fallbackIpoGmp = ipo.gmp != null ? Number(ipo.gmp) : null;
  const latestGmp =
    latestHistoryPoint?.gmp ??
    (fallbackIpoGmp != null && !Number.isNaN(fallbackIpoGmp)
      ? fallbackIpoGmp
      : null);
  const previousGmp = previousHistoryPoint?.gmp ?? null;

  const gmpDisplay =
    latestGmp != null
      ? `₹${latestGmp.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
      : "—";

  const gmpChangePercent =
    latestGmp != null && previousGmp != null && previousGmp !== 0
      ? ((latestGmp - previousGmp) / previousGmp) * 100
      : null;
  const trendUp = gmpChangePercent != null ? gmpChangePercent >= 0 : null;

  const highGmp =
    gmpSeries.length > 0 ? Math.max(...gmpSeries.map((point) => point.gmp)) : null;
  const lowGmp =
    gmpSeries.length > 0 ? Math.min(...gmpSeries.map((point) => point.gmp)) : null;

  const issuePriceRaw = ipo.price_max ?? ipo.price_min;
  const issuePrice = issuePriceRaw != null ? Number(issuePriceRaw) : null;
  const gmpVsIssuePricePercent =
    latestGmp != null &&
    issuePrice != null &&
    !Number.isNaN(issuePrice) &&
    issuePrice > 0
      ? (latestGmp / issuePrice) * 100
      : null;

  const lastUpdated = latestHistoryPoint
    ? new Date(latestHistoryPoint.created_at)
    : null;
  const hasGmpHistory = gmpSeries.length > 0;

  // ===== Allotment & Listed Logic =====
  const today = new Date();

  const listingDateObj =
    ipo.listing_date ? new Date(ipo.listing_date) : null;

  const allotmentDateObj =
    ipo.allotment_date ? new Date(ipo.allotment_date) : null;

  const isListed =
    listingDateObj && listingDateObj <= today;

  const isAllotmentDayReached =
    allotmentDateObj && allotmentDateObj <= today;

  const allotmentOut =
    ipo.allotment_out === true ||
    ipo.allotment_out === "true" ||
    ipo.allotment_out === 1 ||
    ipo.allotment_out === "1";

  let allotmentBadge: "Allotment Out" | "Allotment Awaited" | null = null;

  if (!isListed && isAllotmentDayReached) {
    allotmentBadge = allotmentOut
      ? "Allotment Out"
      : "Allotment Awaited";
  }

  function timeAgo(date: Date | null) {
    if (!date) return "Updated —";
    const diffMs = Number(new Date()) - date.getTime();
    if (diffMs < 0) return "Updated just now";
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Updated just now";
    if (diffMins < 60) {
      return `Updated ${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    }
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs === 1) return "Updated 1 hr ago";
    if (diffHrs < 24) return `Updated ${diffHrs} hrs ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `Updated ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  function valueOrDash(value: unknown) {
    if (value == null) return "—";
    if (typeof value === "string" && value.trim() === "") return "—";
    return String(value);
  }

  function percentOrDash(value: unknown) {
    if (value == null) return "—";
    if (typeof value === "string" && value.trim() === "") return "—";
    const parsedValue = Number(value);
    if (Number.isNaN(parsedValue)) return String(value);
    return `${parsedValue}%`;
  }

  function currencyOrDash(value: unknown) {
    if (value == null) return "—";
    if (typeof value === "string" && value.trim() === "") return "—";
    const parsedValue = Number(value);
    if (Number.isNaN(parsedValue)) return String(value);
    return `₹${parsedValue.toLocaleString("en-IN")}`;
  }

  function linkOrNull(value: unknown) {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }

  const importantLinks = [
    { label: "DRHP", href: linkOrNull(ipo.drhp_link) },
    { label: "RHP", href: linkOrNull(ipo.rhp_link) },
    { label: "Allotment Status", href: linkOrNull(ipo.allotment_link) },
  ];

  const timelineItems = [
    { label: "Open Date", value: valueOrDash(ipo.open_date) },
    { label: "Close Date", value: valueOrDash(ipo.close_date) },
    { label: "Allotment Date", value: valueOrDash(ipo.allotment_date) },
    { label: "Refund Date", value: valueOrDash(ipo.refund_date) },
    { label: "Listing Date", value: valueOrDash(ipo.listing_date) },
  ];

  const minInvestment =
    ipo.price_max && ipo.lot_size
      ? `₹${(ipo.price_max * ipo.lot_size).toLocaleString("en-IN")}`
      : "—";

  return (
    <div
      className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased overflow-x-hidden`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-11 flex items-center gap-2">
          <Link
            href="/"
            className="text-[11.5px] text-[#94a3b8] hover:text-[#0f172a] transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Home
          </Link>
          <svg className="w-3 h-3 text-[#cbd5e1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <Link
            href="/"
            className="text-[11.5px] text-[#94a3b8] hover:text-[#0f172a] transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            IPO Listings
          </Link>
          <svg className="w-3 h-3 text-[#cbd5e1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span
            className="text-[11.5px] text-[#0f172a] font-medium truncate max-w-[18rem]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {ipo.name}
          </span>
        </div>
      </div>

      {/* ── Hero Header ── */}
      <section className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <div className="flex-1 min-w-0">
              <Eyebrow>IPO Detail</Eyebrow>
              <h1
                className="text-2xl sm:text-3xl lg:text-[2.4rem] font-semibold leading-[1.15] tracking-[-0.01em] text-[#0f172a] mb-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {ipo.name}
              </h1>
              {ipo.ipo_type && (
                <span
                  className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded mb-2 ${
                    ipo.ipo_type.toLowerCase() === "sme"
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {ipo.ipo_type.toUpperCase()}
                </span>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <p
                  className="text-[14.5px] text-[#475569] leading-[1.78]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {ipo.exchange}
                  {ipo.sector ? ` · ${ipo.sector}` : ""}
                </p>
                <span
                  className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded ${statusStyle}`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {ipo.status}
                </span>
                {/* Allotment Badge */}
                {allotmentBadge && (
                  <span
                    className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded ${
                      allotmentBadge === "Allotment Out"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                    style={{
                      fontFamily: "var(--font-inter)",
                      ...(allotmentBadge === "Allotment Out"
                        ? { animation: "pulse 1s ease-in-out 1" }
                        : {}),
                    }}
                  >
                    {allotmentBadge}
                  </span>
                )}

                {/* Check Allotment Button */}
                {allotmentBadge === "Allotment Out" && ipo.allotment_link && (
                  <a
                    href={ipo.allotment_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium px-3 py-1 rounded transition-colors"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Check Allotment
                  </a>
                )}
              </div>
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FinancialProduct",
                  name: ipo.name,
                  description: "IPO information including GMP, price band, dates, and subscription details.",
                  provider: {
                    "@type": "Organization",
                    name: "IPOCraft",
                  },
                }),
              }}
            />

            <div className="shrink-0 flex flex-col sm:items-end gap-3 pt-1">
              <a
                href="#how-to-apply"
                className="inline-flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#1a327a] text-white text-[13px] font-medium px-6 py-[0.65rem] rounded-[4px] transition-colors duration-150"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                How to Apply
                <svg className="w-3.5 h-3.5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <p
                className="text-[10.5px] text-[#94a3b8] text-right max-w-[15rem] leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Not investment advice. Read RHP before applying.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* ── Summary Cards ── */}
      <section className="bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {[
              { label: "Price Band", value: priceBand, highlight: true },
              { label: "GMP (Indicative)", value: gmpDisplay, note: "Unofficial · not guaranteed" },
              { label: "Lot Size", value: ipo.lot_size ? `${ipo.lot_size} shares` : "—" },
              { label: "Status", value: ipo.status ?? "—" },
              { label: "Open Date", value: ipo.open_date ?? "—" },
              { label: "Close Date", value: ipo.close_date ?? "—" },
              { label: "Listing Date", value: ipo.listing_date ?? "—" },
              { label: "Min. Investment", value: minInvestment },
            ].map((card) => (
              <div
                key={card.label}
                className={`border rounded-lg p-5 space-y-1.5 ${
                  card.highlight
                    ? "border-[#1e3a8a]/20 bg-[#eff6ff]"
                    : "border-[#e2e8f0] bg-white"
                }`}
              >
                <DataLabel>{card.label}</DataLabel>
                <p
                  className={`text-[15px] font-semibold leading-tight ${
                    card.highlight ? "text-[#1e3a8a]" : "text-[#0f172a]"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {card.value}
                </p>
                {card.note && (
                  <p
                    className="text-[10.5px] text-[#94a3b8]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {card.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 lg:gap-10 items-start">

          {/* Left column */}
          <div className="min-w-0">

            {/* About */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Overview</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  About the Company
                </h2>
              </div>
              <p
                className="text-[14.5px] text-[#475569] leading-[1.78]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {valueOrDash(ipo.about_company ?? ipo.description) !== "—"
                  ? valueOrDash(ipo.about_company ?? ipo.description)
                  : "Detailed company information will appear here once the data is available from official exchange filings and the offer document (DRHP / RHP)."}
              </p>
            </section>

            {/* Financials */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Financials</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Key Financial Metrics
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
                {[
                  { label: "EPS Pre IPO", value: valueOrDash(ipo.eps_pre) },
                  { label: "EPS Post IPO", value: valueOrDash(ipo.eps_post) },
                  { label: "P/E Pre", value: valueOrDash(ipo.pe_pre) },
                  { label: "P/E Post", value: valueOrDash(ipo.pe_post) },
                  { label: "ROCE", value: percentOrDash(ipo.roce) },
                  { label: "Debt / Equity", value: valueOrDash(ipo.debt_equity) },
                  { label: "PAT Margin", value: percentOrDash(ipo.pat_margin) },
                  { label: "Market Cap", value: valueOrDash(ipo.market_cap) },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <DataLabel>{item.label}</DataLabel>
                    <p
                      className="text-[15px] font-semibold text-[#0f172a] leading-tight"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <p
                className="text-[11.5px] text-[#94a3b8] leading-relaxed pt-2 border-t border-[#f1f5f9]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Financial figures sourced from official offer documents. Always verify with the RHP.
              </p>
            </section>

            {/* Issue Details */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Issue</Eyebrow>
                <h2 className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a]">
                  IPO Issue Details
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div><DataLabel>Issue Price</DataLabel><p>{priceBand}</p></div>
                <div><DataLabel>Face Value</DataLabel><p>{currencyOrDash(ipo.face_value)}</p></div>
                <div><DataLabel>Issue Size</DataLabel><p>{valueOrDash(ipo.issue_size)}</p></div>
                <div><DataLabel>Fresh Issue</DataLabel><p>{valueOrDash(ipo.fresh_issue)}</p></div>
                <div><DataLabel>Listing At</DataLabel><p>{valueOrDash(ipo.listing_exchange)}</p></div>
                <div><DataLabel>Lead Manager</DataLabel><p>{valueOrDash(ipo.lead_managers)}</p></div>
                <div><DataLabel>Registrar</DataLabel><p>{valueOrDash(ipo.registrar)}</p></div>
                <div><DataLabel>Lot Size</DataLabel><p>{ipo.lot_size ?? "—"}</p></div>
              </div>
            </section>

            {/* GMP Card */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>GMP (Grey Market Premium)</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  GMP Overview
                </h2>
              </div>

              <div>
                <div className="flex items-end gap-3 mb-2">
                  <p
                    className="text-[1.9rem] font-semibold text-[#0f172a] leading-none"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {gmpDisplay}
                  </p>

                  {gmpChangePercent != null && (
                    <span
                      className={`text-[12px] font-semibold px-2 py-0.5 rounded ${
                        trendUp ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
                      }`}
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {trendUp ? "▲" : "▼"} {Math.abs(gmpChangePercent).toFixed(1)}%
                    </span>
                  )}
                </div>

                <p className="text-[11.5px] text-[#94a3b8] mb-1">
                  {timeAgo(lastUpdated)}
                </p>

                <div className="flex items-center gap-2 text-[11.5px] text-[#64748b] mb-1">
                  <span>
                    High {highGmp != null ? `₹${highGmp.toLocaleString("en-IN")}` : "—"}
                  </span>
                  <span className="text-[#cbd5e1]">·</span>
                  <span>
                    Low {lowGmp != null ? `₹${lowGmp.toLocaleString("en-IN")}` : "—"}
                  </span>
                </div>

                <p className="text-[11.5px] text-[#64748b] mb-2">
                  {gmpVsIssuePricePercent != null
                    ? `${gmpVsIssuePricePercent >= 0 ? "+" : ""}${gmpVsIssuePricePercent.toFixed(1)}% ${
                        gmpVsIssuePricePercent >= 0 ? "over" : "below"
                      } issue price`
                    : "Issue price comparison unavailable"}
                </p>

                <p className="text-[11.5px] text-[#94a3b8]">
                  GMP is unofficial and indicative only. It does not guarantee listing price or returns.
                </p>
              </div>
            </section>

            {/* GMP Trend */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Trend</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  GMP Trend
                </h2>
              </div>

              <div className="mt-4 w-full min-w-0 h-[260px] sm:h-[280px]">
                {hasGmpHistory ? (
                  <div className="w-full min-w-0 h-full">
                    <GMPChart data={gmpSeries} />
                  </div>
                ) : (
                  <p className="text-[12px] text-[#94a3b8] text-center">
                    No GMP data yet. Updates will appear once available.
                  </p>
                )}
              </div>
            </section>

            {/* Lot Size Table */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Investment</Eyebrow>
                <h2 className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a]">
                  Market Lot Details
                </h2>
              </div>

              <div className="w-full overflow-x-auto mt-4">
                <table className="min-w-[520px] w-full text-sm border">
                  <thead className="bg-[#f8fafc]">
                    <tr>
                      <th className="p-2 border">Application</th>
                      <th className="p-2 border">Lots</th>
                      <th className="p-2 border">Shares</th>
                      <th className="p-2 border">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border">Retail (Min)</td>
                      <td className="p-2 border">{ipo.retail_min_lots ?? "—"}</td>
                      <td className="p-2 border">{ipo.retail_min_shares ?? "—"}</td>
                      <td className="p-2 border">{ipo.retail_min_amount ?? "—"}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border">Retail (Max)</td>
                      <td className="p-2 border">{ipo.retail_max_lots ?? "—"}</td>
                      <td className="p-2 border">{ipo.retail_max_shares ?? "—"}</td>
                      <td className="p-2 border">{ipo.retail_max_amount ?? "—"}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border">SHNI</td>
                      <td className="p-2 border">{ipo.shni_lots ?? "—"}</td>
                      <td className="p-2 border">{ipo.shni_shares ?? "—"}</td>
                      <td className="p-2 border">{ipo.shni_amount ?? "—"}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border">BHNI</td>
                      <td className="p-2 border">{ipo.bhni_lots ?? "—"}</td>
                      <td className="p-2 border">{ipo.bhni_shares ?? "—"}</td>
                      <td className="p-2 border">{ipo.bhni_amount ?? "—"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Valuations */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Valuation</Eyebrow>
                <h2 className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a]">
                  IPO Valuation Metrics
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div><DataLabel>EPS Pre IPO</DataLabel><p>{valueOrDash(ipo.eps_pre)}</p></div>
                <div><DataLabel>EPS Post IPO</DataLabel><p>{valueOrDash(ipo.eps_post)}</p></div>
                <div><DataLabel>P/E Pre</DataLabel><p>{valueOrDash(ipo.pe_pre)}</p></div>
                <div><DataLabel>P/E Post</DataLabel><p>{valueOrDash(ipo.pe_post)}</p></div>
                <div><DataLabel>ROCE</DataLabel><p>{percentOrDash(ipo.roce)}</p></div>
                <div><DataLabel>Debt/Equity</DataLabel><p>{valueOrDash(ipo.debt_equity)}</p></div>
                <div><DataLabel>RoNW</DataLabel><p>{percentOrDash(ipo.ronw)}</p></div>
                <div><DataLabel>PAT Margin</DataLabel><p>{percentOrDash(ipo.pat_margin)}</p></div>
                <div><DataLabel>Market Cap</DataLabel><p>{valueOrDash(ipo.market_cap)}</p></div>
              </div>
            </section>

            {/* Contact Details */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Contacts</Eyebrow>
                <h2 className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a]">
                  Company & Registrar Details
                </h2>
              </div>

              <div className="space-y-2 text-sm">
                <p><strong>Company Address:</strong> {valueOrDash(ipo.company_address)}</p>
                <p><strong>Phone:</strong> {valueOrDash(ipo.company_phone)}</p>
                <p><strong>Email:</strong> {valueOrDash(ipo.company_email)}</p>
                <p><strong>Website:</strong> {valueOrDash(ipo.company_website)}</p>

                <hr className="my-3"/>

                <p><strong>Registrar:</strong> {valueOrDash(ipo.registrar)}</p>
                <p><strong>Registrar Phone:</strong> {valueOrDash(ipo.registrar_phone)}</p>
                <p><strong>Registrar Email:</strong> {valueOrDash(ipo.registrar_email)}</p>
                <p><strong>Registrar Website:</strong> {valueOrDash(ipo.registrar_website)}</p>
              </div>
            </section>

            {/* Objectives */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Issue Summary</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Objectives of Issue
                </h2>
              </div>
              <p
                className="text-[14.5px] text-[#475569] leading-[1.78]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {valueOrDash(ipo.objectives)}
              </p>
            </section>

            {/* Promoter Holdings */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Ownership</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Promoter Holdings
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {[
                  {
                    label: "Pre Issue",
                    value: percentOrDash(ipo.promoter_holding_pre),
                  },
                  {
                    label: "Post Issue",
                    value: percentOrDash(ipo.promoter_holding_post),
                  },
                ].map((row) => (
                  <div key={row.label} className="space-y-1.5">
                    <DataLabel>{row.label}</DataLabel>
                    <p
                      className="text-[15px] font-semibold text-[#0f172a] leading-tight"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Reservation Details */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Allocation</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Reservation Details
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                {[
                  { label: "QIB", value: valueOrDash(ipo.reservation_qib) },
                  { label: "NII", value: valueOrDash(ipo.reservation_nii) },
                  { label: "RII", value: valueOrDash(ipo.reservation_rii) },
                  {
                    label: "Employee",
                    value: valueOrDash(ipo.reservation_employee),
                  },
                ].map((row) => (
                  <div key={row.label} className="space-y-1.5">
                    <DataLabel>{row.label}</DataLabel>
                    <p
                      className="text-[15px] font-semibold text-[#0f172a] leading-tight"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Important Links */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Documents</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Important Links
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                {importantLinks.map((link) => (
                  <div key={link.label} className="space-y-1.5">
                    <DataLabel>{link.label}</DataLabel>
                    {link.href ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-[13.5px] font-medium text-[#2563eb] hover:text-[#1e3a8a] transition-colors break-all"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        Open Link
                      </a>
                    ) : (
                      <p
                        className="text-[13.5px] font-medium text-[#0f172a]"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        —
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Listing Performance */}
            {ipo.status === "Listed" && (
              <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
                <div className="pb-4 border-b border-[#f1f5f9]">
                  <Eyebrow>Performance</Eyebrow>
                  <h2
                    className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Listing Performance
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                  {[
                    {
                      label: "Listing Exchange",
                      value: valueOrDash(ipo.listing_exchange),
                    },
                    {
                      label: "Listing Price",
                      value: currencyOrDash(ipo.listing_price),
                    },
                    {
                      label: "Listing Gain",
                      value: percentOrDash(ipo.listing_gain_percent),
                    },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1.5">
                      <DataLabel>{item.label}</DataLabel>
                      <p
                        className="text-[15px] font-semibold text-[#0f172a] leading-tight"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Strengths and Risks */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-6 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Qualitative Factors</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Strengths &amp; Risks
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <DataLabel>Company Strengths</DataLabel>
                  <p
                    className="text-[14.5px] text-[#475569] leading-[1.78]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {valueOrDash(ipo.company_strengths)}
                  </p>
                </div>
                <div className="space-y-2">
                  <DataLabel>Company Risks</DataLabel>
                  <p
                    className="text-[14.5px] text-[#475569] leading-[1.78]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {valueOrDash(ipo.company_risks)}
                  </p>
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Schedule</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Timeline
                </h2>
              </div>
              <div className="space-y-3">
                {timelineItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 py-2 border-b border-[#f8fafc] last:border-0"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-[#2563eb] shrink-0" />
                      <p
                        className="text-[13.5px] text-[#475569] truncate"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {item.label}
                      </p>
                    </div>
                    <p
                      className="text-[13.5px] font-semibold text-[#0f172a] text-right"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Legal Disclaimer */}
            <div className="border border-[#dce4ef] bg-[#f8fafc] rounded-lg p-6 md:p-8 mb-10 sm:mb-12">
              <p
                className="text-[12.5px] font-semibold text-[#334155] mb-2"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Legal Disclaimer
              </p>
              <p
                className="text-[13.5px] text-[#64748b] leading-[1.78]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Information is sourced from publicly available exchange filings
                and company offer documents. GMP is unofficial and indicative.
                IPOCraft does not provide investment advice.
              </p>
            </div>

            {/* Subscription */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Subscription</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Live Subscription Details
                </h2>
              </div>

              <div className="divide-y divide-[#f1f5f9]">
                {[
                  { category: "QIB", value: ipo.sub_qib ?? "—" },
                  { category: "NII", value: ipo.sub_nii ?? "—" },
                  { category: "BHNI", value: ipo.sub_bhni ?? "—" },
                  { category: "SHNI", value: ipo.sub_shni ?? "—" },
                  { category: "Retail", value: ipo.sub_rii ?? "—" },
                  { category: "Total", value: ipo.sub_total ?? "—" },
                ].map((row) => (
                  <div key={row.category} className="flex items-center justify-between py-3">
                    <p className="text-[14.5px] text-[#475569]">{row.category}</p>
                    <p className="text-[15px] font-semibold text-[#0f172a]">{row.value}</p>
                  </div>
                ))}
              </div>

              <p className="text-[11.5px] text-[#94a3b8] pt-2 border-t border-[#f1f5f9]">
                Last updated: {ipo.subscription_updated_at ?? "—"}
              </p>
            </section>

            {/* How to Apply */}
            <section
              id="how-to-apply"
              className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12"
            >
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Application</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  How to Apply
                </h2>
              </div>
              <div className="space-y-6 pt-2">
                {[
                  {
                    index: "01",
                    title: "UPI Method (ASBA)",
                    body: "Log in to your broker's app or net banking, navigate to the IPO section, select this IPO, enter lot quantity, and authorise via UPI mandate. Funds are blocked, not debited, until allotment.",
                  },
                  {
                    index: "02",
                    title: "ASBA via Net Banking",
                    body: "Log in to your bank's net banking portal, go to the IPO / ASBA section, fill in the bid details, and submit. Your bank will block the required amount automatically.",
                  },
                  {
                    index: "03",
                    title: "Allotment & Refund",
                    body: "Allotment status is typically available within 6 days of the IPO close date. Refunds for unallotted bids are credited within 2 working days post allotment.",
                  },
                ].map((step) => (
                  <div key={step.index} className="flex gap-5">
                    <span
                      className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#cbd5e1] shrink-0 pt-0.5"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {step.index}
                    </span>
                    <div>
                      <p
                        className="text-[13px] font-semibold text-[#0f172a] mb-1.5"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {step.title}
                      </p>
                      <p
                        className="text-[14.5px] text-[#475569] leading-[1.78]"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Risk Disclosure */}
            <div className="border border-amber-200 bg-amber-50 rounded-lg p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full border border-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-[12.5px] font-semibold text-amber-800 mb-2"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Risk Disclosure
                  </p>
                  <p
                    className="text-[14.5px] text-amber-700 leading-[1.78]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Investments in IPOs are subject to market risks. Grey Market Premium (GMP) is unofficial and indicative only — it does not guarantee listing price or returns. Read the official offer documents (DRHP / RHP) and consult a SEBI-registered financial advisor before applying. IPOCraft does not provide investment advice.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="space-y-5">

            {/* Quick Facts */}
            <div className="bg-white border border-[#e2e8f0] rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-[#f1f5f9]">
                <p
                  className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#94a3b8]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Quick Facts
                </p>
              </div>
              <div className="px-5 py-2 divide-y divide-[#f8fafc]">
                {[
                  { label: "Issue Size", value: valueOrDash(ipo.issue_size) },
                  { label: "IPO Type", value: valueOrDash(ipo.ipo_type) },
                  { label: "Face Value", value: ipo.face_value ? `₹${ipo.face_value}` : "—" },
                  { label: "Lead Managers", value: valueOrDash(ipo.lead_managers) },
                  { label: "Registrar", value: valueOrDash(ipo.registrar) },
                  { label: "Exchange", value: valueOrDash(ipo.exchange) },
                  { label: "Min. Investment", value: minInvestment },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-3 py-3">
                    <p
                      className="text-[11.5px] text-[#94a3b8]"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {row.label}
                    </p>
                    <p
                      className="text-[12px] font-medium text-[#0f172a] text-right"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* GMP Card */}

            {/* GMP Trend Chart */}

            {/* Trust badge */}
            <div className="border border-[#dce4ef] bg-white rounded-lg p-5 flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full border border-[#dce4ef] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#1e3a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <p
                className="text-[11.5px] text-[#64748b] leading-[1.75]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Structured data sourced from official SEBI filings and exchange disclosures. IPOCraft is not SEBI-registered. Content is informational only.
              </p>
            </div>

            {/* Back link */}
            <Link
              href="/ipo"
              className="inline-flex items-center gap-2 text-[12.5px] font-medium text-[#2563eb] hover:text-[#1e3a8a] transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all IPOs
            </Link>
          </aside>
        </div>
      </div>

      {/* ── CTA Strip ── */}
      <section className="bg-[#1e3a8a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p
              className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-[#93c5fd] mb-2"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Research Before You Apply
            </p>
            <h2
              className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-white leading-[1.2] tracking-[-0.01em]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Explore More IPO Listings
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/ipo"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#f1f5f9] text-[#1e3a8a] text-[13px] font-semibold px-6 py-[0.65rem] rounded-[4px] transition-colors duration-150"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              View All IPOs
            </Link>
            <Link
              href="/gmp"
              className="inline-flex items-center gap-2 bg-transparent border border-[#3b5fad] hover:border-[#5272c0] text-white text-[13px] font-medium px-6 py-[0.65rem] rounded-[4px] transition-colors duration-150"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              GMP Tracker
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
