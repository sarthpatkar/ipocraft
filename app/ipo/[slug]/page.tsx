import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { sanitizeIpoSlug } from "@/lib/ipo.server";
import { CANONICAL_ORIGIN, canonicalUrl } from "@/lib/site-url";
import { Outfit, Inter } from "next/font/google";
import GMPChart from "@/components/GmpChart";
import HeroSection from "@/components/IpoDetail/HeroSection";
import FinancialMetrics from "@/components/IpoDetail/FinancialMetrics";
import TimelineTracker from "@/components/IpoDetail/TimelineTracker";
import ProfitCalculator from "@/components/IpoDetail/ProfitCalculator";
import AllotmentCalculator from "@/components/IpoDetail/AllotmentCalculator";
import GlossaryTooltip from "@/components/GlossaryTooltip";
import { cache } from "react";

const getCachedIpoBySlug = cache(async (slug: string) => {
  const { data } = await supabase
    .from("ipos")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return data;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = sanitizeIpoSlug(rawSlug);

  if (!slug) {
    notFound();
  }

  const ipo = await getCachedIpoBySlug(slug);

  if (!ipo) {
    notFound();
  }

  const title = `${ipo.name} IPO GMP, Price, Dates, Details | IPOCraft`;

  const description = `Latest GMP, price band, dates, subscription, and listing insights for ${ipo.name} IPO. Data sourced from public filings and exchange disclosures.`;

  const detailUrl = canonicalUrl(`/ipo/${encodeURIComponent(slug)}`);

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
    alternates: {
      canonical: detailUrl,
    },
    openGraph: {
      title,
      description,
      url: detailUrl,
      siteName: "IPOCraft",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
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
  Open: "bg-emerald-50 text-emerald-700 border border-emerald-200 status-open",
  Upcoming: "bg-blue-50 text-blue-700 border border-blue-200",
  Listed: "bg-violet-50 text-violet-700 border border-violet-200",
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
  const { slug: rawSlug } = await params;
  const slug = sanitizeIpoSlug(rawSlug);

  if (!slug) {
    notFound();
  }

  const ipo = await getCachedIpoBySlug(slug);

  if (!ipo) {
    notFound();
  }

  const detailUrl = canonicalUrl(`/ipo/${encodeURIComponent(slug)}`);

  const { data: subscriptionHistory } = await supabase
    .from("subscription_history")
    .select("*")
    .eq("ipo_id", ipo?.id)
    .order("day", { ascending: true });

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

  // ===== Allotment & Listed Logic (Priority System Fixed) =====
  const today = new Date();

  const listingDateObj =
    ipo.listing_date ? new Date(ipo.listing_date) : null;

  const allotmentDateObj =
    ipo.allotment_date ? new Date(ipo.allotment_date) : null;

  // Listed detection (status OR date)
  const isListed =
    ipo.status === "Listed" ||
    (listingDateObj && listingDateObj <= today);

  // Allotment day reached
  const isAllotmentDayReached =
    allotmentDateObj && allotmentDateObj <= today;

  /**
   * Admin override detection
   * Handles:
   * boolean true
   * string "true"
   * number 1
   * allotment_status = "out"
   */
  const adminMarkedOut =
    Boolean(ipo.allotment_out) ||
    ipo.allotment_out === "true" ||
    ipo.allotment_out === 1 ||
    ipo.allotment_out === "1" ||
    (typeof ipo.allotment_status === "string" &&
      ipo.allotment_status.toLowerCase() === "out");

  /**
   * PRIORITY ORDER
   * 1. Admin marked OUT → always show OUT
   * 2. If Listed → always show OUT
   * 3. If allotment date reached → Awaited
   * 4. Else → nothing
   */
  let allotmentBadge: "Allotment Out" | "Allotment Awaited" | null = null;

  if (adminMarkedOut) {
    allotmentBadge = "Allotment Out";
  } else if (isListed) {
    allotmentBadge = "Allotment Out";
  } else if (isAllotmentDayReached) {
    allotmentBadge = "Allotment Awaited";
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

  function renderPoints(text?: string) {
    if (!text) return null;

    // Normalize literal \n (stored as backslash-n) to actual newlines
    const normalized = text.replace(/\\n/g, "\n").trim();

    // Detect numbered list (1. 2. 3.) or bullet formats (•, -, *)
    const hasBulletFormat = /(\d+\.\s)|(^[•\-\*]\s)/m.test(normalized);

    if (!hasBulletFormat) {
      // Render as plain pre-wrapped text (for paragraphs)
      return (
        <p className="whitespace-pre-line leading-relaxed">
          {normalized}
        </p>
      );
    }

    // Split on numbered items (1. ) or bullet chars (• - *)
    const points = normalized
      .split(/\n/)
      .map((p) => p.replace(/^(\d+\.\s|[•\-\*]\s)/, "").trim())
      .filter(Boolean);

    return (
      <ol className="space-y-2 list-none">
        {points.map((point, i) => (
          <li key={i} className="flex gap-2 items-start">
            <span className="text-[#2563eb] font-bold shrink-0 mt-0.5">{i + 1}.</span>
            <span>{point}</span>
          </li>
        ))}
      </ol>
    );
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
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased pb-20`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: canonicalUrl("/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "IPO",
                item: canonicalUrl("/ipo"),
              },
              {
                "@type": "ListItem",
                position: 3,
                name: ipo.name,
                item: detailUrl,
              },
            ],
          }),
        }}
      />

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
      <HeroSection ipo={ipo} statusStyle={statusStyle} allotmentBadge={allotmentBadge} />



      {/* ── Summary Cards ── */}
      <section className="bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 lg:pb-0 lg:grid lg:grid-cols-4 lg:gap-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                className={`shrink-0 w-[180px] lg:w-auto snap-start border rounded-xl p-5 space-y-1.5 card-hover ${
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

      {/* ── Sticky Tabbed Navigation ── */}
      <div className="sticky top-[60px] z-40 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <nav className="flex gap-6 text-[13px] sm:text-[14px] font-semibold text-[#64748b]" style={{ fontFamily: "var(--font-inter)" }}>
            <a href="#overview" className="px-1 py-4 hover:text-[#1e3a8a] border-b-2 border-transparent hover:border-[#1e3a8a] transition-colors">Overview</a>
            <a href="#financials" className="px-1 py-4 hover:text-[#1e3a8a] border-b-2 border-transparent hover:border-[#1e3a8a] transition-colors">Financials</a>
            <a href="#issue-details" className="px-1 py-4 hover:text-[#1e3a8a] border-b-2 border-transparent hover:border-[#1e3a8a] transition-colors">Issue Details</a>
            <a href="#gmp" className="px-1 py-4 hover:text-[#1e3a8a] border-b-2 border-transparent hover:border-[#1e3a8a] transition-colors">GMP Tracker</a>
            <a href="#performance" className="px-1 py-4 hover:text-[#1e3a8a] border-b-2 border-transparent hover:border-[#1e3a8a] transition-colors">Listing Performance</a>
          </nav>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 lg:gap-10 items-start">

          {/* Left column */}
          <div className="min-w-0 pt-4 flex flex-col stagger-children">

{/* About */}
            <section id="overview" className="scroll-mt-[120px] bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Overview</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  About the Company
                </h2>
              </div>
              <p
                className="text-[14.5px] text-[#475569] leading-loose"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {valueOrDash(ipo.about_company ?? ipo.description) !== "—"
                  ? valueOrDash(ipo.about_company ?? ipo.description)
                  : "Detailed company information will appear here once the data is available from official exchange filings and the offer document (DRHP / RHP)."}
              </p>
              <p
                className="text-[12.5px] text-[#64748b] mt-3"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                New to IPO analysis? You may review our structured guides on <Link href="/how-ipo-allotment-works" className="text-[#2563eb] hover:underline font-medium">how IPO allotment works</Link> and <Link href="/ipo-subscription-meaning" className="text-[#2563eb] hover:underline font-medium">IPO subscription meaning</Link> to better understand demand and allocation mechanics.
              </p>
            </section>

            {/* Issue Details */}
            <section id="issue-details" className="scroll-mt-[120px] bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Issue</Eyebrow>
                <h2 className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a]" style={{ fontFamily: "var(--font-outfit)" }}>
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
              <p
                className="text-[12.5px] text-[#64748b] mt-4"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                For category-wise quota breakdown such as QIB, HNI, and Retail allocation, refer to our <Link href="/qib-hni-retail-explained" className="text-[#2563eb] hover:underline font-medium">IPO quota structure explanation</Link>.
              </p>
            </section>

            <TimelineTracker ipo={ipo} />

            {/* Subscription (Structured Table) */}
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

              <div className="mt-4 flex flex-col gap-3">
                {/* Desktop Header */}
                <div className="hidden lg:grid grid-cols-7 px-4 py-2 bg-gray-50 dark:bg-[#0f172a] rounded-lg text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                  <div>Day</div>
                  <div>QIB</div>
                  <div>NII</div>
                  <div>sNII (&lt; ₹10L)</div>
                  <div>bNII (&gt; ₹10L)</div>
                  <div>Retail</div>
                  <div>Total</div>
                </div>

                {/* Rows */}
                {subscriptionHistory && subscriptionHistory.length > 0 ? (
                  subscriptionHistory.map((row: any, idx: number) => (
                    <div key={idx} className="flex flex-col lg:grid lg:grid-cols-7 gap-1 lg:gap-0 px-4 py-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-[#1e293b] hover:shadow-sm transition-shadow text-sm">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 mb-2 lg:mb-0 lg:flex lg:items-center border-b lg:border-none pb-2 lg:pb-0">{row.day ?? "Day"}</div>
                      <div className="flex justify-between lg:block"><span className="text-xs text-gray-500 lg:hidden">QIB:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{row.qib ?? "—"}x</span></div>
                      <div className="flex justify-between lg:block"><span className="text-xs text-gray-500 lg:hidden">NII:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{row.nii ?? "—"}x</span></div>
                      <div className="flex justify-between lg:block"><span className="text-xs text-gray-500 lg:hidden">sNII:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{row.shni ?? "—"}x</span></div>
                      <div className="flex justify-between lg:block"><span className="text-xs text-gray-500 lg:hidden">bNII:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{row.bhni ?? "—"}x</span></div>
                      <div className="flex justify-between lg:block"><span className="text-xs text-gray-500 lg:hidden">Retail:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{row.rii ?? "—"}x</span></div>
                      <div className="flex justify-between lg:block pt-1 lg:pt-0 mt-1 lg:mt-0 border-t lg:border-none"><span className="text-xs font-semibold text-gray-600 lg:hidden">Total:</span> <span className="font-bold text-gray-900 dark:text-gray-100">{row.total ?? "—"}x</span></div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col lg:grid lg:grid-cols-7 gap-1 lg:gap-0 px-4 py-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-[#1e293b] hover:shadow-sm transition-shadow text-sm">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-2 lg:mb-0 lg:flex lg:items-center border-b lg:border-none pb-2 lg:pb-0">{ipo.subscription_updated_at ?? "Latest"}</div>
                    <div className="flex justify-between lg:block"><span className="text-xs text-gray-500 lg:hidden">QIB:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{ipo.sub_qib ?? "—"}x</span></div>
                    <div className="flex justify-between lg:block"><span className="text-xs text-gray-500 lg:hidden">NII:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{ipo.sub_nii ?? "—"}x</span></div>
                    <div className="flex justify-between lg:block"><span className="text-xs text-gray-500 lg:hidden">sNII:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{ipo.sub_shni ?? "—"}x</span></div>
                    <div className="flex justify-between lg:block"><span className="text-xs text-gray-500 lg:hidden">bNII:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{ipo.sub_bhni ?? "—"}x</span></div>
                    <div className="flex justify-between lg:block"><span className="text-xs text-gray-500 lg:hidden">Retail:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{ipo.sub_rii ?? "—"}x</span></div>
                    <div className="flex justify-between lg:block pt-1 lg:pt-0 mt-1 lg:mt-0 border-t lg:border-none"><span className="text-xs font-semibold text-gray-600 lg:hidden">Total:</span> <span className="font-bold text-gray-900 dark:text-gray-100">{ipo.sub_total ?? "—"}x</span></div>
                  </div>
                )}
              </div>

              {/* Subscription Progress Bars */}
              {(() => {
                const latest =
                  subscriptionHistory && subscriptionHistory.length > 0
                    ? subscriptionHistory[subscriptionHistory.length - 1]
                    : {
                        qib: ipo.sub_qib,
                        nii: ipo.sub_nii,
                        shni: ipo.sub_shni,
                        bhni: ipo.sub_bhni,
                        rii: ipo.sub_rii,
                        total: ipo.sub_total,
                      };

                const categories = [
                  { label: "QIB", value: Number(latest?.qib) || 0 },
                  { label: "NII", value: Number(latest?.nii) || 0 },
                  { label: "sNII", value: Number(latest?.shni) || 0 },
                  { label: "bNII", value: Number(latest?.bhni) || 0 },
                  { label: "Retail", value: Number(latest?.rii) || 0 },
                ];

                const maxValue = Math.max(
                  ...categories.map((c) => c.value),
                  1
                );

                return (
                  <div className="mt-6 space-y-3">
                    <p
                      className="text-[12px] font-semibold text-[#475569]"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Subscription Progress
                    </p>

                    {categories.map((cat) => {
                      const width = (cat.value / maxValue) * 100;

                      return (
                        <div key={cat.label} className="space-y-1">
                          <div className="flex justify-between text-[12px]">
                            <span><GlossaryTooltip term={cat.label}>{cat.label}</GlossaryTooltip></span>
                            <span className="font-semibold">
                              {cat.value || "—"}x
                            </span>
                          </div>

                          <div className="w-full h-2 bg-[#e2e8f0] rounded overflow-hidden">
                            <div
                              className="h-full bg-[#2563eb] rounded transition-all"
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              <p className="text-[11.5px] text-[#94a3b8] pt-2 border-t border-[#f1f5f9]">
                Subscription data sourced from exchange updates. Values represent times subscribed (x).
              </p>
              <p className="text-[12px] text-[#64748b] mt-2" style={{ fontFamily: "var(--font-inter)" }}>
                Learn how subscription categories are allocated by reading our guide on <Link href="/qib-hni-retail-explained" className="text-[#2563eb] hover:underline font-medium">QIB, HNI and Retail IPO quota structure</Link>.
              </p>
              <p
                className="text-[12px] text-[#64748b] mt-2"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                If you are tracking GMP alongside subscription demand, see our <Link href="/ipo-grey-market-guide" className="text-[#2563eb] hover:underline font-medium">grey market premium guide</Link> for a structured comparison framework.
              </p>
            </section>

            {/* Allotment Probability Calculator */}
            <AllotmentCalculator 
              subRii={ipo.sub_rii != null ? Number(ipo.sub_rii) : null}
              subShni={ipo.sub_shni != null ? Number(ipo.sub_shni) : null}
              subBhni={ipo.sub_bhni != null ? Number(ipo.sub_bhni) : null}
              subNii={ipo.sub_nii != null ? Number(ipo.sub_nii) : null}
            />

            {/* GMP Card */}
            <section id="gmp" className="scroll-mt-[120px] bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>GMP (Grey Market Premium)</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a]"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  GMP Overview
                </h2>
              </div>

              <div>
                <div className="flex items-end gap-3 mb-2">
                  <p
                    className="text-[1.9rem] font-semibold text-[#0f172a] leading-none"
                    style={{ fontFamily: "var(--font-outfit)" }}
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
                <p
                  className="text-[12px] text-[#64748b] mt-2"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  GMP is unofficial and indicative. To understand interpretation logic and limitations, read our <Link href="/ipo-grey-market-guide" className="text-[#2563eb] hover:underline font-medium">IPO Grey Market Guide</Link> or begin with <Link href="/what-is-ipo-gmp" className="text-[#2563eb] hover:underline font-medium">what IPO GMP means</Link>.
                </p>
              </div>
            </section>

            {/* GMP Trend */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Trend</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a]"
                  style={{ fontFamily: "var(--font-outfit)" }}
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

            {/* Market Lot Details (Structured) */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Investment</Eyebrow>
                <h2 className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a]" style={{ fontFamily: "var(--font-outfit)" }}>
                  Market Lot Details
                </h2>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-4 px-4 py-2 bg-gray-50 dark:bg-[#0f172a] rounded-lg text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                  <div>Application</div>
                  <div>Lots</div>
                  <div>Shares</div>
                  <div>Amount</div>
                </div>

                {/* Rows */}
                {[
                  { label: "Retail (Min)", lots: ipo.retail_min_lots, shares: ipo.retail_min_shares, amount: ipo.retail_min_amount },
                  { label: "Retail (Max)", lots: ipo.retail_max_lots, shares: ipo.retail_max_shares, amount: ipo.retail_max_amount },
                  { label: "sNII (Min)", lots: ipo.shni_lots, shares: ipo.shni_shares, amount: ipo.shni_amount },
                  { label: "sNII (Max)", lots: ipo.shni_max_lots, shares: ipo.shni_max_shares, amount: ipo.shni_max_amount },
                  { label: "bNII (Min)", lots: ipo.bhni_lots, shares: ipo.bhni_shares, amount: ipo.bhni_amount },
                  { label: "bNII (Max)", lots: ipo.bhni_max_lots, shares: ipo.bhni_max_shares, amount: ipo.bhni_max_amount }
                ].map((row, i) => (
                  <div key={i} className="flex flex-col md:grid md:grid-cols-4 gap-2 md:gap-0 px-4 py-3 md:py-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-[#1e293b] hover:shadow-sm transition-shadow text-sm">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1 md:mb-0 md:flex md:items-center">{row.label}</div>
                    <div className="flex justify-between md:block"><span className="text-xs text-gray-500 md:hidden">Lots:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{row.lots ?? "—"}</span></div>
                    <div className="flex justify-between md:block"><span className="text-xs text-gray-500 md:hidden">Shares:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{row.shares ?? "—"}</span></div>
                    <div className="flex justify-between md:block"><span className="text-xs text-gray-500 md:hidden">Amount:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{row.amount ?? "—"}</span></div>
                  </div>
                ))}
              </div>

              <p className="text-[11.5px] text-[#94a3b8] mt-3">
                Investors can bid in multiples of the lot size. Final investment depends on the cutoff price.
              </p>
            </section>

            {/* Reservation Details */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Allocation</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-outfit)" }}
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

            {/* Objectives */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Issue Summary</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Objectives of Issue
                </h2>
              </div>
              <div
                className="text-[14.5px] text-[#475569] leading-[1.78]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {renderPoints(ipo.objectives)}
              </div>
            </section>

            {/* Financials */}
            <FinancialMetrics ipo={ipo} />

            {/* Promoter Holdings */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Ownership</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-outfit)" }}
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

            {/* Contact Details */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Contacts</Eyebrow>
                <h2 className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a]" style={{ fontFamily: "var(--font-outfit)" }}>
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

            {/* Anchor Investors */}
            {ipo.anchor_investors && (
              <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
                <div className="pb-4 border-b border-[#f1f5f9]">
                  <Eyebrow>Investors</Eyebrow>
                  <h2
                    className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a]"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    Anchor Investors
                  </h2>
                </div>

                <p
                  className="text-[14.5px] text-[#475569] leading-[1.78]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {valueOrDash(ipo.anchor_investors)}
                </p>
              </section>
            )}

            {/* SME Market Maker Details */}
            {ipo.ipo_type?.toLowerCase() === "sme" && (
              <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
                <div className="pb-4 border-b border-[#f1f5f9]">
                  <Eyebrow>SME Specific</Eyebrow>
                  <h2
                    className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a]"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    Market Maker Details
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <DataLabel>Market Maker Shares Offered</DataLabel>
                    <p>{valueOrDash(ipo.market_maker_shares)}</p>
                  </div>

                  <div>
                    <DataLabel>Market Maker Reservation (%)</DataLabel>
                    <p>{percentOrDash(ipo.market_maker_reservation)}</p>
                  </div>
                </div>

                <p
                  className="text-[11.5px] text-[#94a3b8] pt-2 border-t border-[#f1f5f9]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Applicable only for SME IPOs where a market maker is appointed to provide liquidity post listing.
                </p>
              </section>
            )}

            {/* Important Links */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Documents</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-outfit)" }}
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
              <section id="performance" className="scroll-mt-[120px] bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
                <div className="pb-4 border-b border-[#f1f5f9]">
                  <Eyebrow>Performance</Eyebrow>
                  <h2
                    className="text-2xl sm:text-[1.75rem] font-bold text-[#0f172a] leading-tight"
                    style={{ fontFamily: "var(--font-outfit)" }}
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

                {ipo.listing_gain_percent != null && ipo.gmp != null && ipo.price_max != null && (
                  <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Pre-Listing Prediction</p>
                        <p className="text-[14px] text-gray-700 mt-1">
                          Est. Gain: <span className="font-semibold text-gray-900">{((Number(ipo.gmp) / Number(ipo.price_max)) * 100).toFixed(2)}%</span>
                          <span className="mx-2 text-gray-300">|</span>
                          Actual Gain: <span className="font-semibold text-gray-900">{Number(ipo.listing_gain_percent).toFixed(2)}%</span>
                        </p>
                      </div>
                      
                      {(() => {
                        const estGain = (Number(ipo.gmp) / Number(ipo.price_max)) * 100;
                        const actualGain = Number(ipo.listing_gain_percent);
                        const diff = Math.abs(estGain - actualGain);
                        
                        if (diff <= 5) {
                          return (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              High Accuracy Prediction
                            </span>
                          );
                        } else if (diff <= 15) {
                          return (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              Moderate Accuracy
                            </span>
                          );
                        } else {
                          return (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                              Market Diverged
                            </span>
                          );
                        }
                      })()}
                    </div>
                  </div>
                )}
              </section>
            )}

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
              <p className="text-[12px] text-[#64748b] pt-4 border-t border-[#f1f5f9]" style={{ fontFamily: "var(--font-inter)" }}>
                You may also review the complete <Link href="/how-ipo-allotment-works" className="text-[#2563eb] hover:underline font-medium">IPO allotment process explanation</Link> to understand lottery mechanics and refund timelines.
              </p>
            </section>

            {/* Strengths & Risks */}
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
                  <div
                    className="text-[14.5px] text-[#475569] leading-[1.78]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {renderPoints(ipo.company_strengths)}
                  </div>
                </div>
                <div className="space-y-2">
                  <DataLabel>Company Risks</DataLabel>
                  <div
                    className="text-[14.5px] text-[#475569] leading-[1.78]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {renderPoints(ipo.company_risks)}
                  </div>
                </div>
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
    </div>
  );
}
