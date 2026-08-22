import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { sanitizeIpoSlug } from "@/lib/ipo.server";
import { CANONICAL_ORIGIN, canonicalUrl } from "@/lib/site-url";
import GMPChart from "@/components/GmpChart";
import HeroSection from "@/components/IpoDetail/HeroSection";
import FinancialMetrics from "@/components/IpoDetail/FinancialMetrics";
import TimelineTracker from "@/components/IpoDetail/TimelineTracker";
import ProfitCalculator from "@/components/IpoDetail/ProfitCalculator";
import AllotmentCalculator from "@/components/IpoDetail/AllotmentCalculator";
import GlossaryTooltip from "@/components/GlossaryTooltip";
import DataFreshnessBar from "@/components/DataFreshnessBar";
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareButton from "@/components/ShareButton";
import CopyButton from "@/components/CopyButton";
import SubscriptionChart from "@/components/IpoDetail/SubscriptionChart";
import JumpNav from "@/components/IpoDetail/JumpNav";
import RelatedIpos from "@/components/IpoDetail/RelatedIpos";
import { formatDisplayDate, formatTimeAgo, formatSubscriptionDayHeader, formatSubscriptionTimes } from "@/lib/formatters";
import { cache } from "react";

// ISR: revalidate every 30 minutes
export const revalidate = 1800;

const getCachedIpoBySlug = cache(async (slug: string) => {
  const supabase = await createSupabaseServerClient();
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
      className={`text-[10.5px] font-semibold tracking-[0.22em] uppercase mb-4 ${light ? "text-[#93c5fd]" : "text-[#2563eb] dark:text-blue-400"}`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {children}
    </p>
  );
}

function DataLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#94a3b8] dark:text-slate-500 mb-1.5"
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

  const supabase = await createSupabaseServerClient();

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
    : ipo.updated_at
      ? new Date(ipo.updated_at)
      : null;

  const subscriptionLastUpdated = ipo.subscription_updated_at
    ? new Date(ipo.subscription_updated_at)
    : ipo.updated_at
      ? new Date(ipo.updated_at)
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
    return `${Number.isInteger(parsedValue) ? parsedValue : parsedValue.toFixed(2)}%`;
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
            <span className="text-[#2563eb] dark:text-blue-400 font-bold shrink-0 mt-0.5">{i + 1}.</span>
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
      className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-[#0f172a] dark:text-slate-100 antialiased pb-20"
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

      {/* ── Navigation Bar ── */}
      <div className="bg-white dark:bg-[#0D1525] border-b border-[#e2e8f0] dark:border-[#22304A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center gap-3">
          <BackButton fallbackHref="/ipo" />
          <span className="text-gray-300 dark:text-[#22304A]">|</span>
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "IPO", href: "/ipo" },
            { label: ipo.name },
          ]} />
        </div>
      </div>

      {/* ── Hero Header ── */}
      <HeroSection ipo={ipo} statusStyle={statusStyle} allotmentBadge={allotmentBadge} shareButton={
        <ShareButton
          title={`${ipo.name} IPO`}
          url={detailUrl}
          text={`${ipo.name} IPO — GMP: ${gmpDisplay}, Price: ${priceBand} | ipocraft.com`}
        />
      } />

      {/* ── Summary Cards ── */}
      <section className="bg-[#f8fafc] dark:bg-[#080D18] border-b border-[#e2e8f0] dark:border-[#22304A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-2.5 pb-2 lg:pb-0 lg:grid lg:grid-cols-4 lg:gap-3.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { label: "Price Band", value: priceBand, highlight: true },
              {
                label: "GMP (Indicative)",
                value: gmpDisplay,
                isCopyable: true,
                note: lastUpdated ? formatTimeAgo(lastUpdated, "Live · ") : "Unofficial · not guaranteed",
              },
              { label: "Lot Size", value: ipo.lot_size ? `${ipo.lot_size} shares` : "—" },
              { label: "Status", value: ipo.status ?? "—" },
              { label: "Open Date", value: formatDisplayDate(ipo.open_date) },
              { label: "Close Date", value: formatDisplayDate(ipo.close_date) },
              {
                label: "Subscription",
                value: ipo.sub_total != null ? `${ipo.sub_total}x` : "—",
                note: subscriptionLastUpdated ? formatTimeAgo(subscriptionLastUpdated, "Live • ") : undefined,
              },
              { label: "Min. Investment", value: minInvestment },
            ].map((card) => (
              <div
                key={card.label}
                className={`shrink-0 w-[170px] lg:w-auto snap-start border rounded-xl p-3.5 sm:p-4 space-y-1 ${
                  card.highlight
                    ? "border-blue-500/30 bg-blue-50/70 dark:bg-[#162238] dark:border-[#3B82F6]/50"
                    : "border-[#e2e8f0] dark:border-[#22304A] bg-white dark:bg-[#111B2D]"
                }`}
              >
                <DataLabel>{card.label}</DataLabel>
                <div
                  className={`text-[14.5px] font-semibold leading-tight ${
                    card.highlight ? "text-[#1e3a8a] dark:text-[#3B82F6]" : "text-[#0f172a] dark:text-[#F1F5F9]"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {card.isCopyable && card.value !== "—" ? (
                    <CopyButton value={String(card.value)}>{card.value}</CopyButton>
                  ) : (
                    card.value
                  )}
                </div>
                {card.note && (
                  <p
                    className="text-[10px] text-[#94a3b8] dark:text-[#64748B]"
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
      <div className="sticky top-[56px] z-40 bg-white/95 dark:bg-[#0D1525]/95 backdrop-blur-md border-b border-[#e2e8f0] dark:border-[#22304A] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <nav className="flex gap-5 text-[13px] font-medium text-[#64748b] dark:text-[#94A3B8]" style={{ fontFamily: "var(--font-inter)" }}>
            <a href="#overview" className="px-1 py-3 hover:text-[#1e3a8a] dark:hover:text-[#F1F5F9] border-b-2 border-transparent hover:border-[#1e3a8a] dark:hover:border-[#3B82F6] transition-colors">Overview</a>
            <a href="#issue-details" className="px-1 py-3 hover:text-[#1e3a8a] dark:hover:text-[#F1F5F9] border-b-2 border-transparent hover:border-[#1e3a8a] dark:hover:border-[#3B82F6] transition-colors">Issue Details</a>
            <a href="#subscription" className="px-1 py-3 hover:text-[#1e3a8a] dark:hover:text-[#F1F5F9] border-b-2 border-transparent hover:border-[#1e3a8a] dark:hover:border-[#3B82F6] transition-colors">Subscription</a>
            <a href="#gmp" className="px-1 py-3 hover:text-[#1e3a8a] dark:hover:text-[#F1F5F9] border-b-2 border-transparent hover:border-[#1e3a8a] dark:hover:border-[#3B82F6] transition-colors">GMP Tracker</a>
            <a href="#profit-calculator" className="px-1 py-3 hover:text-[#1e3a8a] dark:hover:text-[#F1F5F9] border-b-2 border-transparent hover:border-[#1e3a8a] dark:hover:border-[#3B82F6] transition-colors">Profit Calculator</a>
            <a href="#financials" className="px-1 py-3 hover:text-[#1e3a8a] dark:hover:text-[#F1F5F9] border-b-2 border-transparent hover:border-[#1e3a8a] dark:hover:border-[#3B82F6] transition-colors">Financials</a>
            <a href="#performance" className="px-1 py-3 hover:text-[#1e3a8a] dark:hover:text-[#F1F5F9] border-b-2 border-transparent hover:border-[#1e3a8a] dark:hover:border-[#3B82F6] transition-colors">Listing Performance</a>
          </nav>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-[#f8fafc] dark:bg-[#080D18]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">

          {/* Left column */}
          <div className="min-w-0 flex flex-col">

            {/* About */}
            <section id="overview" className="scroll-mt-[120px] bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-3 mb-6">
              <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                <Eyebrow>Overview</Eyebrow>
                <h2
                  className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  About the Company
                </h2>
              </div>
              <p
                className="text-[13.5px] text-[#475569] dark:text-[#94A3B8] leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {valueOrDash(ipo.about_company ?? ipo.description) !== "—"
                  ? valueOrDash(ipo.about_company ?? ipo.description)
                  : "Detailed company information will appear here once the data is available from official exchange filings and the offer document (DRHP / RHP)."}
              </p>
              <p
                className="text-[12.5px] text-[#64748b] dark:text-slate-400 mt-3"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                New to IPO analysis? You may review our structured guides on <Link href="/how-ipo-allotment-works" className="text-[#2563eb] dark:text-blue-400 hover:underline font-medium">how IPO allotment works</Link> and <Link href="/ipo-subscription-meaning" className="text-[#2563eb] dark:text-blue-400 hover:underline font-medium">IPO subscription meaning</Link> to better understand demand and allocation mechanics.
              </p>
            </section>

            {/* Issue Details */}
            <section id="issue-details" className="scroll-mt-[120px] bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-3 mb-6">
              <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                <Eyebrow>Issue Details</Eyebrow>
                <h2 className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
                  IPO Issue Details
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
                <div><DataLabel>Issue Price</DataLabel><p className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">{priceBand}</p></div>
                <div><DataLabel>Face Value</DataLabel><p className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">{currencyOrDash(ipo.face_value)}</p></div>
                <div><DataLabel>Issue Size</DataLabel><p className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">{valueOrDash(ipo.issue_size)}</p></div>
                <div><DataLabel>Fresh Issue</DataLabel><p className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">{valueOrDash(ipo.fresh_issue)}</p></div>
                <div><DataLabel>Listing At</DataLabel><p className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">{valueOrDash(ipo.listing_exchange)}</p></div>
                <div><DataLabel>Lead Manager</DataLabel><p className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">{valueOrDash(ipo.lead_managers)}</p></div>
                <div><DataLabel>Registrar</DataLabel><p className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">{valueOrDash(ipo.registrar)}</p></div>
                <div><DataLabel>Lot Size</DataLabel><p className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">{ipo.lot_size ? `${ipo.lot_size} shares` : "—"}</p></div>
              </div>
              <p
                className="text-[12px] text-[#64748b] dark:text-[#94A3B8] mt-3"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                For category-wise quota breakdown such as QIB, HNI, and Retail allocation, refer to our <Link href="/qib-hni-retail-explained" className="text-[#2563eb] dark:text-blue-400 hover:underline font-medium">IPO quota structure explanation</Link>.
              </p>
            </section>

            <div id="timeline" className="scroll-mt-[120px]">
              <TimelineTracker ipo={ipo} />
            </div>

            {/* Subscription (Structured Table) */}
            <section id="subscription" className="scroll-mt-[120px] bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-3 mb-6">
              <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <Eyebrow>Subscription</Eyebrow>
                  <h2
                    className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    Live Subscription Details
                  </h2>
                </div>
                {subscriptionLastUpdated && (
                  <span className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">
                    {formatTimeAgo(subscriptionLastUpdated, "Updated ")}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {/* Desktop Header */}
                <div className="hidden lg:grid grid-cols-7 px-3.5 py-2 bg-gray-50 dark:bg-[#0D1525] border border-gray-100 dark:border-[#22304A] rounded-lg text-[11px] font-semibold uppercase text-gray-500 dark:text-[#94A3B8]">
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
                    <div key={idx} className="flex flex-col lg:grid lg:grid-cols-7 gap-1 lg:gap-0 px-3.5 py-2.5 border border-gray-100 dark:border-[#22304A] rounded-lg bg-white dark:bg-[#162238] text-[13px]">
                      <div className="font-semibold text-gray-900 dark:text-[#F1F5F9] mb-1.5 lg:mb-0 lg:flex lg:items-center border-b lg:border-none pb-1.5 lg:pb-0">
                        {formatSubscriptionDayHeader(row.day, idx)}
                      </div>
                      <div className="flex justify-between lg:block"><span className="text-[11px] text-gray-500 dark:text-[#64748B] lg:hidden">QIB:</span> <span className="font-medium text-[#334155] dark:text-[#CBD5E1] tabular-nums">{formatSubscriptionTimes(row.qib)}</span></div>
                      <div className="flex justify-between lg:block"><span className="text-[11px] text-gray-500 dark:text-[#64748B] lg:hidden">NII:</span> <span className="font-medium text-[#334155] dark:text-[#CBD5E1] tabular-nums">{formatSubscriptionTimes(row.nii)}</span></div>
                      <div className="flex justify-between lg:block"><span className="text-[11px] text-gray-500 dark:text-[#64748B] lg:hidden">sNII:</span> <span className="font-medium text-[#334155] dark:text-[#CBD5E1] tabular-nums">{formatSubscriptionTimes(row.shni)}</span></div>
                      <div className="flex justify-between lg:block"><span className="text-[11px] text-gray-500 dark:text-[#64748B] lg:hidden">bNII:</span> <span className="font-medium text-[#334155] dark:text-[#CBD5E1] tabular-nums">{formatSubscriptionTimes(row.bhni)}</span></div>
                      <div className="flex justify-between lg:block"><span className="text-[11px] text-gray-500 dark:text-[#64748B] lg:hidden">Retail:</span> <span className="font-medium text-[#334155] dark:text-[#CBD5E1] tabular-nums">{formatSubscriptionTimes(row.rii)}</span></div>
                      <div className="flex justify-between lg:block pt-1 lg:pt-0 mt-1 lg:mt-0 border-t lg:border-none"><span className="text-[11px] font-semibold text-gray-600 dark:text-[#64748B] lg:hidden">Total:</span> <span className="font-bold text-[#0f172a] dark:text-[#F1F5F9] tabular-nums">{formatSubscriptionTimes(row.total)}</span></div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col lg:grid lg:grid-cols-7 gap-1 lg:gap-0 px-3.5 py-2.5 border border-gray-100 dark:border-[#22304A] rounded-lg bg-white dark:bg-[#162238] text-[13px]">
                    <div className="font-semibold text-gray-900 dark:text-[#F1F5F9] mb-1.5 lg:mb-0 lg:flex lg:items-center border-b lg:border-none pb-1.5 lg:pb-0">
                      {formatSubscriptionDayHeader(ipo.subscription_updated_at)}
                    </div>
                    <div className="flex justify-between lg:block"><span className="text-[11px] text-gray-500 dark:text-[#64748B] lg:hidden">QIB:</span> <span className="font-medium text-[#334155] dark:text-[#CBD5E1] tabular-nums">{formatSubscriptionTimes(ipo.sub_qib)}</span></div>
                    <div className="flex justify-between lg:block"><span className="text-[11px] text-gray-500 dark:text-[#64748B] lg:hidden">NII:</span> <span className="font-medium text-[#334155] dark:text-[#CBD5E1] tabular-nums">{formatSubscriptionTimes(ipo.sub_nii)}</span></div>
                    <div className="flex justify-between lg:block"><span className="text-[11px] text-gray-500 dark:text-[#64748B] lg:hidden">sNII:</span> <span className="font-medium text-[#334155] dark:text-[#CBD5E1] tabular-nums">{formatSubscriptionTimes(ipo.sub_shni)}</span></div>
                    <div className="flex justify-between lg:block"><span className="text-[11px] text-gray-500 dark:text-[#64748B] lg:hidden">bNII:</span> <span className="font-medium text-[#334155] dark:text-[#CBD5E1] tabular-nums">{formatSubscriptionTimes(ipo.sub_bhni)}</span></div>
                    <div className="flex justify-between lg:block"><span className="text-[11px] text-gray-500 dark:text-[#64748B] lg:hidden">Retail:</span> <span className="font-medium text-[#334155] dark:text-[#CBD5E1] tabular-nums">{formatSubscriptionTimes(ipo.sub_rii)}</span></div>
                    <div className="flex justify-between lg:block pt-1 lg:pt-0 mt-1 lg:mt-0 border-t lg:border-none"><span className="text-[11px] font-semibold text-gray-600 dark:text-[#64748B] lg:hidden">Total:</span> <span className="font-bold text-[#0f172a] dark:text-[#F1F5F9] tabular-nums">{formatSubscriptionTimes(ipo.sub_total)}</span></div>
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
                  <div className="mt-4 space-y-2.5">
                    <p
                      className="text-[11.5px] font-semibold text-[#475569] dark:text-[#94A3B8]"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Subscription Progress
                    </p>

                    {categories.map((cat) => {
                      const width = Math.min((cat.value / maxValue) * 100, 100);

                      return (
                        <div key={cat.label} className="space-y-1">
                          <div className="flex justify-between text-[11.5px]">
                            <span className="text-[#475569] dark:text-[#94A3B8]"><GlossaryTooltip term={cat.label}>{cat.label}</GlossaryTooltip></span>
                            <span className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">
                              {cat.value || "—"}x
                            </span>
                          </div>

                          <div className="w-full h-1.5 bg-[#e2e8f0] dark:bg-[#162238] rounded overflow-hidden">
                            <div
                              className="h-full bg-[#3B82F6] rounded transition-all"
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Day-wise Subscription Chart */}
              <SubscriptionChart history={subscriptionHistory ?? []} />

              <p className="text-[11.5px] text-[#94a3b8] dark:text-[#64748B] pt-2 border-t border-[#f1f5f9] dark:border-[#22304A]">
                Subscription figures represent category demand ratios reported by exchange bidding engines.
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
            <section id="gmp" className="scroll-mt-[120px] bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-3 mb-6">
              <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <Eyebrow>GMP (Grey Market Premium)</Eyebrow>
                  <h2
                    className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    GMP Overview
                  </h2>
                </div>
                {lastUpdated && (
                  <span className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">
                    Recorded {timeAgo(lastUpdated)}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-end gap-3 mb-2">
                  <div
                    className="text-[1.75rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-none"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {gmpDisplay !== "—" ? (
                      <CopyButton value={gmpDisplay}>{gmpDisplay}</CopyButton>
                    ) : (
                      gmpDisplay
                    )}
                  </div>

                  {gmpChangePercent != null && (
                    <span
                      className={`text-[11.5px] font-semibold px-2 py-0.5 rounded ${
                        trendUp ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300"
                      }`}
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {trendUp ? "▲" : "▼"} {Math.abs(gmpChangePercent).toFixed(1)}%
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11.5px] text-[#64748b] dark:text-[#94A3B8] mb-1">
                  <span>
                    High {highGmp != null ? `₹${highGmp.toLocaleString("en-IN")}` : "—"}
                  </span>
                  <span className="text-gray-300 dark:text-[#22304A]">·</span>
                  <span>
                    Low {lowGmp != null ? `₹${lowGmp.toLocaleString("en-IN")}` : "—"}
                  </span>
                </div>

                <p className="text-[11.5px] text-[#64748b] dark:text-[#94A3B8] mb-2">
                  {gmpVsIssuePricePercent != null
                    ? `${gmpVsIssuePricePercent >= 0 ? "+" : ""}${gmpVsIssuePricePercent.toFixed(1)}% ${
                        gmpVsIssuePricePercent >= 0 ? "over" : "below"
                      } issue price`
                    : "Issue price comparison unavailable"}
                </p>

                <p className="text-[11px] text-[#94a3b8] dark:text-[#64748B]">
                  GMP is unofficial and indicative only. It does not guarantee listing price or returns.
                </p>
              </div>
            </section>

            {/* GMP Trend */}
            <section className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 mb-6">
              <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                <Eyebrow>Trend</Eyebrow>
                <h2
                  className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  GMP Trend
                </h2>
              </div>

              <div className="mt-4 w-full min-w-0 h-[240px] sm:h-[260px]">
                {hasGmpHistory ? (
                  <div className="w-full min-w-0 h-full">
                    <GMPChart data={gmpSeries} />
                  </div>
                ) : (
                  <p className="text-[12px] text-[#94a3b8] dark:text-[#64748B] text-center pt-20">
                    No historical GMP data points recorded yet.
                  </p>
                )}
              </div>
            </section>

            {/* Listing Profit Calculator */}
            <ProfitCalculator ipo={ipo} />

            {/* Market Lot Details (Structured) */}
            <section className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 mb-6">
              <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                <Eyebrow>Investment</Eyebrow>
                <h2 className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
                  Market Lot Details
                </h2>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {(() => {
                  const lotSz = ipo.lot_size ? Number(ipo.lot_size) : null;
                  const prcMax = ipo.price_max ? Number(ipo.price_max) : (ipo.price_min ? Number(ipo.price_min) : null);

                  if (!lotSz || !prcMax) {
                    return (
                      <div className="bg-[#f8fafc] dark:bg-[#0D1525] border border-[#e2e8f0] dark:border-[#22304A] rounded-lg p-4 text-center">
                        <p className="text-[12.5px] text-[#64748b] dark:text-[#94A3B8]" style={{ fontFamily: "var(--font-inter)" }}>
                          Market lot sizes and allocation brackets will be announced upon price band finalization.
                        </p>
                      </div>
                    );
                  }

                  const rMinLots = ipo.retail_min_lots ?? 1;
                  const rMinShares = ipo.retail_min_shares ?? (rMinLots * lotSz);
                  const rMinAmt = ipo.retail_min_amount ?? (rMinShares * prcMax);

                  const rMaxLots = ipo.retail_max_lots ?? Math.max(1, Math.floor(200000 / (lotSz * prcMax)));
                  const rMaxShares = ipo.retail_max_shares ?? (rMaxLots * lotSz);
                  const rMaxAmt = ipo.retail_max_amount ?? (rMaxShares * prcMax);

                  const sMinLots = ipo.shni_min_lots ?? ipo.shni_lots ?? (rMaxLots + 1);
                  const sMinShares = ipo.shni_min_shares ?? (sMinLots * lotSz);
                  const sMinAmt = ipo.shni_min_amount ?? (sMinShares * prcMax);

                  const sMaxLots = ipo.shni_max_lots ?? Math.floor(1000000 / (lotSz * prcMax));
                  const sMaxShares = ipo.shni_max_shares ?? (sMaxLots * lotSz);
                  const sMaxAmt = ipo.shni_max_amount ?? (sMaxShares * prcMax);

                  const bMinLots = ipo.bhni_min_lots ?? ipo.bhni_lots ?? (sMaxLots + 1);
                  const bMinShares = ipo.bhni_min_shares ?? (bMinLots * lotSz);
                  const bMinAmt = ipo.bhni_min_amount ?? (bMinShares * prcMax);

                  const fmtAmt = (amt: number | null) => amt ? `₹${amt.toLocaleString("en-IN")}` : "—";

                  const rows = [
                    { label: "Retail (Min)", lots: rMinLots, shares: rMinShares, amount: fmtAmt(rMinAmt) },
                    { label: "Retail (Max)", lots: rMaxLots, shares: rMaxShares, amount: fmtAmt(rMaxAmt) },
                    { label: "sNII (Min)", lots: sMinLots, shares: sMinShares, amount: fmtAmt(sMinAmt) },
                    { label: "sNII (Max)", lots: sMaxLots, shares: sMaxShares, amount: fmtAmt(sMaxAmt) },
                    { label: "bNII (Min)", lots: bMinLots, shares: bMinShares, amount: fmtAmt(bMinAmt) },
                    { label: "bNII (Max)", lots: ipo.bhni_max_lots ?? "—", shares: ipo.bhni_max_shares ?? "—", amount: ipo.bhni_max_amount ? fmtAmt(ipo.bhni_max_amount) : "—" }
                  ];

                  return (
                    <>
                      {/* Desktop Header */}
                      <div className="hidden md:grid grid-cols-4 px-3.5 py-2 bg-gray-50 dark:bg-[#0D1525] border border-gray-100 dark:border-[#22304A] rounded-lg text-[11px] font-semibold uppercase text-gray-500 dark:text-[#94A3B8]">
                        <div>Application</div>
                        <div>Lots</div>
                        <div>Shares</div>
                        <div>Amount</div>
                      </div>

                      {rows.map((row, i) => (
                        <div key={i} className="flex flex-col md:grid md:grid-cols-4 gap-1.5 md:gap-0 px-3.5 py-2.5 border border-gray-100 dark:border-[#22304A] rounded-lg bg-white dark:bg-[#162238] text-[13px]">
                          <div className="font-semibold text-gray-900 dark:text-[#F1F5F9] mb-1 md:mb-0 md:flex md:items-center">{row.label}</div>
                          <div className="flex justify-between md:block"><span className="text-[11px] text-gray-500 dark:text-[#64748B] md:hidden">Lots:</span> <span className="font-medium text-gray-800 dark:text-[#F1F5F9]">{row.lots ?? "—"}</span></div>
                          <div className="flex justify-between md:block"><span className="text-[11px] text-gray-500 dark:text-[#64748B] md:hidden">Shares:</span> <span className="font-medium text-gray-800 dark:text-[#F1F5F9]">{row.shares ?? "—"}</span></div>
                          <div className="flex justify-between md:block"><span className="text-[11px] text-gray-500 dark:text-[#64748B] md:hidden">Amount:</span> <span className="font-medium text-gray-800 dark:text-[#F1F5F9]">{row.amount ?? "—"}</span></div>
                        </div>
                      ))}
                    </>
                  );
                })()}
              </div>

              <p className="text-[11.5px] text-[#94a3b8] dark:text-[#64748B] mt-2.5">
                Investors can bid in multiples of the lot size at the cut-off price.
              </p>
            </section>

            {/* Reservation Details */}
            <section className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-3 mb-6">
              <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                <Eyebrow>Allocation</Eyebrow>
                <h2
                  className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Reservation Details
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: "QIB", value: valueOrDash(ipo.reservation_qib || (ipo.ipo_type?.toLowerCase() === "sme" ? "50%" : "50%")) },
                  { label: "NII", value: valueOrDash(ipo.reservation_nii || "15%") },
                  { label: "RII", value: valueOrDash(ipo.reservation_rii || "35%") },
                  {
                    label: "Employee",
                    value: valueOrDash(ipo.reservation_employee),
                  },
                ].map((row) => (
                  <div key={row.label} className="space-y-1">
                    <DataLabel>{row.label}</DataLabel>
                    <p
                      className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-tight"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Objectives */}
            {ipo.objectives && (
              <section className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-3 mb-6">
                <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                  <Eyebrow>Issue Summary</Eyebrow>
                  <h2
                    className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    Objectives of Issue
                  </h2>
                </div>
                <div
                  className="text-[13.5px] text-[#475569] dark:text-[#94A3B8] leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {renderPoints(ipo.objectives)}
                </div>
              </section>
            )}

            {/* Financials */}
            <FinancialMetrics ipo={ipo} />

            {/* Promoter Holdings */}
            <section className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-3 mb-6">
              <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                <Eyebrow>Ownership</Eyebrow>
                <h2
                  className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Promoter Holdings
                </h2>
              </div>
              {ipo.promoter_holding_pre != null || ipo.promoter_holding_post != null ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
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
                    <div key={row.label} className="space-y-1">
                      <DataLabel>{row.label}</DataLabel>
                      <p
                        className="text-[14.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-tight"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {row.value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#f8fafc] dark:bg-[#0D1525] border border-[#e2e8f0] dark:border-[#22304A] rounded-lg p-4 text-center">
                  <p className="text-[12.5px] text-[#64748b] dark:text-[#94A3B8]" style={{ fontFamily: "var(--font-inter)" }}>
                    Promoter shareholding pre and post-issue will be updated once the final capital structure is published.
                  </p>
                </div>
              )}
            </section>

            {/* Contact Details */}
            <section className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-3 mb-6">
              <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                <Eyebrow>Contacts</Eyebrow>
                <h2 className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
                  Company &amp; Registrar Details
                </h2>
              </div>

              {ipo.company_address || ipo.company_phone || ipo.company_email || ipo.company_website || ipo.registrar ? (
                <div className="space-y-2 text-[13px] text-[#475569] dark:text-[#94A3B8]">
                  {ipo.company_address && <p><strong className="text-[#0f172a] dark:text-[#F1F5F9]">Company Address:</strong> {ipo.company_address}</p>}
                  {ipo.company_phone && <p><strong className="text-[#0f172a] dark:text-[#F1F5F9]">Phone:</strong> {ipo.company_phone}</p>}
                  {ipo.company_email && <p><strong className="text-[#0f172a] dark:text-[#F1F5F9]">Email:</strong> {ipo.company_email}</p>}
                  {ipo.company_website && <p><strong className="text-[#0f172a] dark:text-[#F1F5F9]">Website:</strong> {ipo.company_website}</p>}

                  {(ipo.company_address || ipo.company_phone) && ipo.registrar && <hr className="my-2.5 border-[#f1f5f9] dark:border-[#22304A]" />}

                  {ipo.registrar && <p><strong className="text-[#0f172a] dark:text-[#F1F5F9]">Registrar:</strong> {ipo.registrar}</p>}
                  {ipo.registrar_phone && <p><strong className="text-[#0f172a] dark:text-[#F1F5F9]">Registrar Phone:</strong> {ipo.registrar_phone}</p>}
                  {ipo.registrar_email && <p><strong className="text-[#0f172a] dark:text-[#F1F5F9]">Registrar Email:</strong> {ipo.registrar_email}</p>}
                  {ipo.registrar_website && <p><strong className="text-[#0f172a] dark:text-[#F1F5F9]">Registrar Website:</strong> {ipo.registrar_website}</p>}
                </div>
              ) : (
                <div className="bg-[#f8fafc] dark:bg-[#0D1525] border border-[#e2e8f0] dark:border-[#22304A] rounded-lg p-4 text-center">
                  <p className="text-[12.5px] text-[#64748b] dark:text-[#94A3B8]" style={{ fontFamily: "var(--font-inter)" }}>
                    Registrar appointment and registered office contacts will be confirmed in the statutory exchange disclosures.
                  </p>
                </div>
              )}
            </section>

            {/* Anchor Investors */}
            {ipo.anchor_investors && (
              <section className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-3 mb-6">
                <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                  <Eyebrow>Investors</Eyebrow>
                  <h2
                    className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    Anchor Investors
                  </h2>
                </div>

                <p
                  className="text-[13.5px] text-[#475569] dark:text-[#94A3B8] leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {valueOrDash(ipo.anchor_investors)}
                </p>
              </section>
            )}

            {/* SME Market Maker Details */}
            {ipo.ipo_type?.toLowerCase() === "sme" && (
              <section className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-3 mb-6">
                <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                  <Eyebrow>SME Specific</Eyebrow>
                  <h2
                    className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    Market Maker Details
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
                  <div>
                    <DataLabel>Market Maker Shares Offered</DataLabel>
                    <p className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">{valueOrDash(ipo.market_maker_shares)}</p>
                  </div>

                  <div>
                    <DataLabel>Market Maker Reservation (%)</DataLabel>
                    <p className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">{percentOrDash(ipo.market_maker_reservation)}</p>
                  </div>
                </div>

                <p
                  className="text-[11.5px] text-[#94a3b8] dark:text-[#64748B] pt-2 border-t border-[#f1f5f9] dark:border-[#22304A]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Applicable only for SME IPOs where a market maker is appointed to provide liquidity post listing.
                </p>
              </section>
            )}

            {/* Important Links */}
            <section className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-3 mb-6">
              <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                <Eyebrow>Documents</Eyebrow>
                <h2
                  className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Important Links
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  ...importantLinks,
                  ...(ipo.nse_info_url ? [{ label: "NSE Info Page", href: ipo.nse_info_url }] : []),
                ].map((link) => (
                  <div key={link.label} className="space-y-1">
                    <DataLabel>{link.label}</DataLabel>
                    {link.href ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-[13px] font-medium text-[#2563eb] dark:text-[#3B82F6] hover:underline transition-colors break-all"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        Open Link ↗
                      </a>
                    ) : (
                      <p
                        className="text-[13px] font-medium text-[#0f172a] dark:text-[#F1F5F9]"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        —
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* In the News */}
            {(() => {
              let mediaLinks: string[] = [];
              try {
                if (ipo.media_links) mediaLinks = JSON.parse(ipo.media_links);
              } catch { }
              if (mediaLinks.length === 0) return null;
              return (
                <section className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-3 mb-6">
                  <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                    <Eyebrow>Media Coverage</Eyebrow>
                    <h2
                      className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      In the News
                    </h2>
                  </div>
                  <ul className="space-y-2">
                    {mediaLinks.map((href, i) => {
                      let domain = "";
                      try { domain = new URL(href).hostname.replace(/^www\./, ""); } catch { }
                      return (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-[13px] font-medium text-[#2563eb] dark:text-[#3B82F6] hover:underline transition-colors truncate"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {domain || `Coverage ${i + 1}`} ↗
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })()}

            {/* Listing Performance */}
            {ipo.status === "Listed" && (
              <section id="performance" className="scroll-mt-[120px] bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-3 mb-6">
                <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                  <Eyebrow>Performance</Eyebrow>
                  <h2
                    className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-tight"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    Listing Performance
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                  {[
                    {
                      label: "Listing Exchange",
                      value: valueOrDash(ipo.listing_exchange || ipo.exchange || "NSE, BSE"),
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
                    <div key={item.label} className="space-y-1">
                      <DataLabel>{item.label}</DataLabel>
                      <p
                        className="text-[14.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-tight"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {ipo.listing_gain_percent != null && ipo.gmp != null && ipo.price_max != null && (
                  <div className="mt-4 p-3.5 rounded-lg bg-[#f8fafc] dark:bg-[#0D1525] border border-gray-100 dark:border-[#22304A]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
                      <div>
                        <p className="text-[10.5px] font-semibold text-gray-500 dark:text-[#94A3B8] uppercase tracking-wide">Pre-Listing Prediction</p>
                        <p className="text-[13px] text-gray-700 dark:text-[#94A3B8] mt-1">
                          Est. Gain: <span className="font-semibold text-gray-900 dark:text-[#F1F5F9]">{((Number(ipo.gmp) / Number(ipo.price_max)) * 100).toFixed(2)}%</span>
                          <span className="mx-2 text-gray-300 dark:text-[#22304A]">|</span>
                          Actual Gain: <span className="font-semibold text-gray-900 dark:text-[#F1F5F9]">{Number(ipo.listing_gain_percent).toFixed(2)}%</span>
                        </p>
                      </div>

                      {(() => {
                        const estGain = (Number(ipo.gmp) / Number(ipo.price_max)) * 100;
                        const actualGain = Number(ipo.listing_gain_percent);
                        const diff = Math.abs(estGain - actualGain);

                        if (diff <= 5) {
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-100 dark:bg-emerald-950/40 text-green-700 dark:text-emerald-300 border border-green-200 dark:border-emerald-800/40">
                              High Accuracy Prediction
                            </span>
                          );
                        } else if (diff <= 15) {
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                              Moderate Accuracy
                            </span>
                          );
                        } else {
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 dark:bg-amber-950/40 text-orange-700 dark:text-amber-300 border border-orange-200 dark:border-amber-800/40">
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
              className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-3 mb-6"
            >
              <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                <Eyebrow>Application</Eyebrow>
                <h2
                  className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  How to Apply
                </h2>
              </div>
              <div className="space-y-4 pt-1">
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
                  <div key={step.index} className="flex gap-4">
                    <span
                      className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 dark:text-[#64748B] shrink-0 pt-0.5"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {step.index}
                    </span>
                    <div>
                      <p
                        className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-1"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {step.title}
                      </p>
                      <p
                        className="text-[13.5px] text-[#475569] dark:text-[#94A3B8] leading-relaxed"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11.5px] text-[#64748b] dark:text-[#64748B] pt-3 border-t border-[#f1f5f9] dark:border-[#22304A]" style={{ fontFamily: "var(--font-inter)" }}>
                You may also review the complete <Link href="/how-ipo-allotment-works" className="text-[#2563eb] dark:text-[#3B82F6] hover:underline font-medium">IPO allotment process explanation</Link> to understand lottery mechanics and refund timelines.
              </p>
            </section>

            {/* Strengths & Risks */}
            {(ipo.company_strengths || ipo.company_risks) && (
              <section className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-4 mb-6">
                <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                  <Eyebrow>Qualitative Factors</Eyebrow>
                  <h2
                    className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    Strengths &amp; Risks
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {ipo.company_strengths && (
                    <div className="space-y-1.5">
                      <DataLabel>Company Strengths</DataLabel>
                      <div
                        className="text-[13px] text-[#475569] dark:text-[#94A3B8] leading-relaxed"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {renderPoints(ipo.company_strengths)}
                      </div>
                    </div>
                  )}
                  {ipo.company_risks && (
                    <div className="space-y-1.5">
                      <DataLabel>Company Risks</DataLabel>
                      <div
                        className="text-[13px] text-[#475569] dark:text-[#94A3B8] leading-relaxed"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {renderPoints(ipo.company_risks)}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Legal Disclaimer */}
            <div className="border border-[#e2e8f0] dark:border-[#22304A] bg-[#f1f5f9] dark:bg-[#0D1525] rounded-xl p-4 sm:p-5 mb-6">
              <p
                className="text-[12px] font-semibold text-[#334155] dark:text-[#F1F5F9] mb-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Legal Disclaimer
              </p>
              <p
                className="text-[12.5px] text-[#64748b] dark:text-[#94A3B8] leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Information is sourced from publicly available exchange filings and company offer documents. GMP is unofficial and indicative. IPOCraft does not provide investment advice.
              </p>
            </div>

          </div>{/* ── end left column ── */}

          {/* Right sidebar */}
          <aside className="space-y-4">

            {/* Quick Facts */}
            <div className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#f1f5f9] dark:border-[#22304A]">
                <p
                  className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#94a3b8] dark:text-[#64748B]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Quick Facts
                </p>
              </div>
              <div className="px-4 py-1.5 divide-y divide-[#f8fafc] dark:divide-[#22304A]">
                {[
                  { label: "Issue Size", value: valueOrDash(ipo.issue_size), isLink: false },
                  { label: "IPO Type", value: valueOrDash(ipo.ipo_type), isLink: false },
                  { label: "Face Value", value: ipo.face_value ? `₹${ipo.face_value}` : "—", isLink: false },
                  { label: "Lead Managers", value: valueOrDash(ipo.lead_managers), isLink: false },
                  { label: "Registrar", value: valueOrDash(ipo.registrar), isLink: false },
                  { label: "Exchange", value: valueOrDash(ipo.exchange || ipo.listing_exchange || "NSE, BSE"), isLink: false },
                  { label: "Min. Investment", value: minInvestment, isLink: false },
                  ...(ipo.nse_info_url ? [{ label: "NSE Info", value: ipo.nse_info_url, isLink: true }] : []),
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-3 py-2.5">
                    <p
                      className="text-[11.5px] text-[#94a3b8] dark:text-[#94A3B8]"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {row.label}
                    </p>
                    {row.isLink ? (
                      <a
                        href={row.value}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-[12px] font-medium text-[#2563eb] dark:text-[#3B82F6] hover:underline text-right"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        View on NSE ↗
                      </a>
                    ) : (
                      <p
                        className="text-[12px] font-medium text-[#0f172a] dark:text-[#F1F5F9] text-right"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {row.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badge */}
            <div className="border border-[#e2e8f0] dark:border-[#22304A] bg-white dark:bg-[#111B2D] rounded-xl p-4 flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full border border-blue-200 dark:border-[#3B82F6]/30 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-[#1e3a8a] dark:text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <p
                className="text-[11.5px] text-[#64748b] dark:text-[#94A3B8] leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Structured data sourced from official SEBI filings and exchange disclosures. Content is for informational research only.
              </p>
            </div>

            {/* Back link */}
            <Link
              href="/ipo"
              className="inline-flex items-center gap-2 text-[12px] font-medium text-[#2563eb] dark:text-[#3B82F6] hover:underline transition-colors"
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
        <section className="mt-8 rounded-xl overflow-hidden bg-white dark:bg-[#0D1525] border border-[#e2e8f0] dark:border-[#22304A] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p
              className="text-[10px] font-semibold tracking-[0.2em] uppercase text-blue-600 dark:text-[#3B82F6] mb-1"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Research Before You Apply
            </p>
            <h2
              className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Explore More IPO Listings &amp; GMP
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/ipo"
              className="inline-flex items-center gap-2 bg-[#1e3a8a] dark:bg-[#3B82F6] text-white text-[12.5px] font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-[#1a327a] dark:hover:bg-[#2563EB]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              View All IPOs
            </Link>
            <Link
              href="/gmp"
              className="inline-flex items-center gap-2 bg-[#f1f5f9] dark:bg-[#162238] border border-gray-200 dark:border-[#22304A] text-[#0f172a] dark:text-[#F1F5F9] text-[12.5px] font-medium px-4 py-2 rounded-lg transition-colors hover:border-[#3B82F6]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              GMP Tracker
            </Link>
          </div>
        </section>

        {/* Related IPOs */}
        <div className="mt-8">
          <RelatedIpos sector={ipo.sector} currentSlug={slug} />
        </div>

      </div>
    </div>
  );
}
