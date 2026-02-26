"use client";

import { Playfair_Display, Inter } from "next/font/google";
import Image from "next/image";

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

// ─── Types ────────────────────────────────────────────────────────────────────
type ExchangeType = "NSE" | "BSE" | "NSE SME" | "BSE SME";
type StatusType = "Open" | "Upcoming" | "Listed" | "Closed";

interface IPO {
  id: number;
  company: string;
  exchange: ExchangeType;
  sector: string;
  priceBand: string;
  openDate: string;
  closeDate: string;
  lotSize: number;
  gmpLabel: string; // Indicative only — not financial advice
  status: StatusType;
}

// ─── Sample IPO Data ──────────────────────────────────────────────────────────
// ALL data below is ILLUSTRATIVE only — for UI layout demonstration.
// It does NOT represent real companies, real prices, or real market data.
const SAMPLE_IPOS: IPO[] = [
  {
    id: 1,
    company: "Sample Technology Ltd.",
    exchange: "NSE",
    sector: "Technology",
    priceBand: "₹XXX – ₹XXX",
    openDate: "DD Mon YYYY",
    closeDate: "DD Mon YYYY",
    lotSize: 50,
    gmpLabel: "—",
    status: "Upcoming",
  },
  {
    id: 2,
    company: "Sample Infrastructure Corp.",
    exchange: "BSE",
    sector: "Infrastructure",
    priceBand: "₹XXX – ₹XXX",
    openDate: "DD Mon YYYY",
    closeDate: "DD Mon YYYY",
    lotSize: 100,
    gmpLabel: "—",
    status: "Open",
  },
  {
    id: 3,
    company: "Sample Chemicals Pvt. Ltd.",
    exchange: "NSE SME",
    sector: "Chemicals",
    priceBand: "₹XXX – ₹XXX",
    openDate: "DD Mon YYYY",
    closeDate: "DD Mon YYYY",
    lotSize: 2000,
    gmpLabel: "—",
    status: "Listed",
  },
  {
    id: 4,
    company: "Sample Finance Services Ltd.",
    exchange: "BSE",
    sector: "NBFC",
    priceBand: "₹XXX – ₹XXX",
    openDate: "DD Mon YYYY",
    closeDate: "DD Mon YYYY",
    lotSize: 75,
    gmpLabel: "—",
    status: "Listed",
  },
  {
    id: 5,
    company: "Sample EV Solutions Ltd.",
    exchange: "NSE",
    sector: "EV / Auto",
    priceBand: "₹XXX – ₹XXX",
    openDate: "DD Mon YYYY",
    closeDate: "DD Mon YYYY",
    lotSize: 40,
    gmpLabel: "—",
    status: "Upcoming",
  },
  {
    id: 6,
    company: "Sample Healthcare Pvt. Ltd.",
    exchange: "BSE SME",
    sector: "Healthcare",
    priceBand: "₹XXX – ₹XXX",
    openDate: "DD Mon YYYY",
    closeDate: "DD Mon YYYY",
    lotSize: 1200,
    gmpLabel: "—",
    status: "Closed",
  },
];

// ─── Status styles ────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<StatusType, string> = {
  Open: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Upcoming: "bg-blue-50 text-blue-700 border border-blue-200",
  Listed: "bg-slate-100 text-slate-500 border border-slate-200",
  Closed: "bg-rose-50 text-rose-600 border border-rose-200",
};

// ─── Static content ───────────────────────────────────────────────────────────
const PLATFORM_FEATURES = [
  {
    index: "01",
    title: "GMP Tracking",
    body: "Grey Market Premium data aggregated and presented in a structured format to help investors understand pre-listing sentiment. GMP is unofficial and indicative only — it does not represent guaranteed listing outcomes.",
  },
  {
    index: "02",
    title: "SME IPO Coverage",
    body: "Dedicated section for SME board listings — NSE SME and BSE SME — with offer documents, subscription figures, and allotment information, a segment often under-covered by mainstream financial portals.",
  },
  {
    index: "03",
    title: "Subscription Analytics",
    body: "Category-wise subscription data — QIB, NII, and RII — sourced from official exchange disclosures and updated at each publishing cycle during the offer period, giving investors a structured view of demand.",
  },
];

const PLATFORM_PILLARS = [
  {
    label: "Data Source",
    value: "Exchange Filings",
    note: "Sourced from official SEBI and exchange documents",
  },
  {
    label: "Coverage",
    value: "Mainboard & SME",
    note: "NSE, BSE, NSE SME, and BSE SME segments",
  },
  {
    label: "GMP Data",
    value: "Indicative Only",
    note: "Unofficial grey market data — not investment advice",
  },
  {
    label: "Updates",
    value: "Each Trading Day",
    note: "Data refreshed on working days during offer periods",
  },
];

const NAV_LINKS = ["Home", "IPO Listings", "GMP", "SME IPO", "Allotment"];

// ─── Reusable atoms ───────────────────────────────────────────────────────────
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

function SectionHeading({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2
      className={`text-[2rem] font-semibold leading-[1.2] tracking-[-0.01em] ${light ? "text-white" : "text-[#0f172a]"}`}
      style={{ fontFamily: "var(--font-playfair)" }}
    >
      {children}
    </h2>
  );
}

function BodyText({
  children,
  className = "",
  light = false,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <p
      className={`text-[14.5px] leading-[1.78] ${light ? "text-[#bfdbfe]" : "text-[#475569]"} ${className}`}
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

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div
      className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* ════════════════════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[4rem] flex items-center justify-between gap-8">

          {/* Logo */}
          <a
            href="/"
            aria-label="IPOCraft"
            className="flex items-center shrink-0 h-full"
          >
            <Image
              src="/logo2.png"
              alt="IPOCraft"
              width={520}
              height={200}
              priority
              className="h-[72px] w-auto object-contain -my-1"
            />
          </a>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Primary navigation">
            {NAV_LINKS.map((item) => (
              <a
                key={item}
                href="#"
                className="text-[13px] font-medium text-[#64748b] hover:text-[#0f172a] transition-colors duration-150 whitespace-nowrap"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#"
              className="hidden md:inline-flex items-center text-[12.5px] font-medium text-[#475569] hover:text-[#0f172a] transition-colors px-3 py-1.5"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Sign in
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 bg-[#1e3a8a] hover:bg-[#1a327a] text-white text-[12.5px] font-medium px-4 py-[0.45rem] rounded-[4px] transition-colors duration-150 whitespace-nowrap"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              View GMP Data
              <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
            {/* Mobile menu */}
            <button className="lg:hidden ml-1 text-[#475569] hover:text-[#0f172a] transition-colors" aria-label="Open menu">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
      <section className="bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-24 lg:pt-24 lg:pb-28 grid lg:grid-cols-[1fr_1.1fr] gap-14 xl:gap-24 items-center">

          {/* Left — copy */}
          <div>
            <Eyebrow>IPO Intelligence Platform</Eyebrow>

            <h1
              className="text-[2.75rem] lg:text-[3.25rem] font-semibold leading-[1.12] tracking-[-0.022em] text-[#0f172a] mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Structured IPO
              <br />
              <em className="not-italic text-[#1e3a8a]">Data & Insights</em>
            </h1>

            <BodyText className="max-w-[27rem] mb-9">
              Structured IPO data, grey market premium tracking, and SME IPO information — organised for investors who prefer clarity over noise. IPOCraft provides informational content only and does not offer investment advice.
            </BodyText>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-14">
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#1a327a] text-white text-[13px] font-medium px-6 py-[0.7rem] rounded-[4px] transition-colors duration-150"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Explore IPO Listings
                <svg className="w-3.5 h-3.5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-white border border-[#d1d9e6] hover:border-[#94a3b8] text-[#0f172a] text-[13px] font-medium px-6 py-[0.7rem] rounded-[4px] transition-colors duration-150"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                View GMP Data
              </a>
            </div>

            {/* Stat strip */}
            <div className="flex flex-wrap items-start gap-x-10 gap-y-5 pt-8 border-t border-[#e2e8f0]">
              {[
                { value: "Mainboard & SME", note: "Both segments covered" },
                { value: "Exchange Sourced", note: "Official filings only" },
                { value: "Updated Daily", note: "Every trading day" },
              ].map((s) => (
                <div key={s.note}>
                  <p
                    className="text-[14.5px] font-semibold text-[#0f172a] leading-tight"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {s.value}
                  </p>
                  <p
                    className="text-[11px] text-[#94a3b8] mt-1.5"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {s.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — sample dashboard card */}
          <div className="hidden lg:block">
            <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-[0_4px_28px_rgba(0,0,0,0.06)] overflow-hidden">

              {/* Card header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
                <div>
                  <p
                    className="text-[11.5px] font-semibold text-[#0f172a]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    IPO Overview
                  </p>
                  <p
                    className="text-[10px] font-medium text-[#94a3b8] mt-0.5 tracking-wide"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Illustrative layout · Not real data
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-[#94a3b8] bg-[#f8fafc] border border-[#e2e8f0] rounded px-2.5 py-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  Sample Data
                </span>
              </div>

              {/* Table head */}
              <div className="grid grid-cols-[2fr_1.2fr_0.8fr_0.85fr] gap-3 px-6 py-3 bg-[#f8fafc] border-b border-[#f1f5f9]">
                {["Company", "Price Band", "GMP*", "Status"].map((h) => (
                  <p key={h} className="text-[9.5px] font-semibold tracking-[0.16em] uppercase text-[#94a3b8]" style={{ fontFamily: "var(--font-inter)" }}>
                    {h}
                  </p>
                ))}
              </div>

              {/* Rows */}
              {SAMPLE_IPOS.slice(0, 5).map((ipo, i) => (
                <div
                  key={ipo.id}
                  className={`grid grid-cols-[2fr_1.2fr_0.8fr_0.85fr] gap-3 px-6 py-3.5 items-center hover:bg-[#fafbfd] transition-colors ${i < 4 ? "border-b border-[#f8fafc]" : ""}`}
                >
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-medium text-[#0f172a] truncate leading-tight" style={{ fontFamily: "var(--font-inter)" }}>
                      {ipo.company}
                    </p>
                    <p className="text-[10px] text-[#94a3b8] mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>
                      {ipo.exchange}
                    </p>
                  </div>
                  <p className="text-[12px] text-[#475569]" style={{ fontFamily: "var(--font-inter)" }}>
                    {ipo.priceBand}
                  </p>
                  <p className="text-[12px] text-[#94a3b8] italic" style={{ fontFamily: "var(--font-inter)" }}>
                    {ipo.gmpLabel}
                  </p>
                  <span
                    className={`inline-flex items-center text-[9.5px] font-semibold tracking-wide px-2 py-0.5 rounded ${STATUS_STYLES[ipo.status]}`}
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {ipo.status}
                  </span>
                </div>
              ))}

              {/* Footer */}
              <div className="px-6 py-3.5 bg-[#f8fafc] border-t border-[#f1f5f9] flex items-center justify-between">
                <p className="text-[10.5px] text-[#94a3b8] italic" style={{ fontFamily: "var(--font-inter)" }}>
                  *GMP is unofficial and indicative only
                </p>
                <a href="#" className="text-[12px] font-medium text-[#2563eb] hover:text-[#1e3a8a] transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
                  All IPOs →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PILLARS — separated by hairline grid
      ════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e2e8f0]">
            {PLATFORM_PILLARS.map((p, i) => (
              <div
                key={p.label}
                className={`px-8 py-10 ${i === 0 ? "pl-0" : ""} ${i === 3 ? "pr-0" : ""}`}
              >
                <DataLabel>{p.label}</DataLabel>
                <p
                  className="text-[17px] font-semibold text-[#0f172a] leading-snug mb-2.5 mt-0.5"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {p.value}
                </p>
                <p
                  className="text-[12px] text-[#94a3b8] leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {p.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          LATEST IPOS
      ════════════════════════════════════════════════════════ */}
      <section className="bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-24">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <Eyebrow>IPO Listings</Eyebrow>
              <SectionHeading>Recent &amp; Upcoming IPOs</SectionHeading>
              <BodyText className="mt-3 max-w-md">
                Sample layout. Live IPO data will populate here once the
                platform is connected to exchange feeds.
              </BodyText>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#2563eb] hover:text-[#1e3a8a] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              View all IPOs
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {SAMPLE_IPOS.map((ipo) => (
              <a
                key={ipo.id}
                href="#"
                className="group bg-white border border-[#e2e8f0] rounded-lg overflow-hidden hover:border-[#b8c9e0] hover:shadow-[0_6px_28px_rgba(0,0,0,0.07)] transition-all duration-200 flex flex-col"
              >
                {/* Card header */}
                <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-[#f8fafc]">
                  <div className="flex-1 min-w-0 pr-3">
                    <p
                      className="text-[14px] font-semibold text-[#0f172a] leading-snug truncate group-hover:text-[#1e3a8a] transition-colors"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {ipo.company}
                    </p>
                    <p
                      className="text-[11px] text-[#94a3b8] mt-1"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {ipo.exchange} &middot; {ipo.sector}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded ${STATUS_STYLES[ipo.status]}`}
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {ipo.status}
                  </span>
                </div>

                {/* Card body */}
                <div className="px-5 py-5 grid grid-cols-2 gap-x-6 gap-y-5 flex-1">
                  {[
                    { label: "Price Band", value: ipo.priceBand, dimmed: false },
                    { label: "GMP (Indicative)", value: ipo.gmpLabel, dimmed: true },
                    { label: "Open Date", value: ipo.openDate, dimmed: false },
                    { label: "Close Date", value: ipo.closeDate, dimmed: false },
                  ].map((field) => (
                    <div key={field.label}>
                      <DataLabel>{field.label}</DataLabel>
                      <p
                        className={`text-[13px] font-semibold leading-tight ${field.dimmed ? "text-[#94a3b8] font-normal italic" : "text-[#0f172a]"}`}
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {field.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Card footer */}
                <div className="px-5 py-3.5 border-t border-[#f8fafc] bg-[#fafbfd] flex items-center justify-between">
                  <p
                    className="text-[11px] text-[#94a3b8]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Lot size:{" "}
                    <span className="text-[#64748b] font-medium">{ipo.lotSize} shares</span>
                  </p>
                  <span
                    className="text-[11.5px] font-medium text-[#2563eb] group-hover:text-[#1e3a8a] transition-colors"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Details →
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* GMP note */}
          <p
            className="mt-8 text-[11.5px] text-[#94a3b8] leading-relaxed max-w-2xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <strong className="font-medium text-[#64748b]">Note:</strong> Grey Market
            Premium (GMP) is sourced from unofficial channels, is unregulated, and is
            indicative only. It does not reflect guaranteed listing prices and should
            not be used as a basis for investment decisions. All other data above is
            illustrative for layout purposes. IPOCraft does not participate in grey market transactions.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PLATFORM FEATURES
      ════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-24">

          {/* Two-column header */}
          <div className="grid lg:grid-cols-[1fr_1.7fr] gap-10 items-start mb-16">
            <div>
              <Eyebrow>Platform</Eyebrow>
              <SectionHeading>Built for the Discerning Investor</SectionHeading>
            </div>
            <BodyText className="lg:pt-[2.7rem] max-w-prose">
              IPOCraft is a structured data and research platform — not a
              broker, and not a SEBI-registered advisor. Our role is to
              organise publicly available IPO information into formats that
              help investors do their own research more efficiently.
            </BodyText>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLATFORM_FEATURES.map((f) => (
              <div
                key={f.title}
                className="border border-[#e2e8f0] rounded-lg px-8 py-9 bg-[#f8fafc] flex flex-col"
              >
                <div className="flex items-center gap-4 mb-8">
                  <span
                    className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#cbd5e1]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {f.index}
                  </span>
                  <div className="flex-1 h-px bg-[#e8ecf2]" />
                </div>
                <h3
                  className="text-[1.2rem] font-semibold text-[#0f172a] mb-4 leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-[13.5px] text-[#64748b] leading-[1.78] flex-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          DATA PHILOSOPHY CALLOUT
      ════════════════════════════════════════════════════════ */}
      <section className="bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="border border-[#dce4ef] bg-white rounded-lg overflow-hidden grid md:grid-cols-[1fr_auto]">
            <div className="px-9 py-10 md:py-12">
              <Eyebrow>Our Data Philosophy</Eyebrow>
              <h2
                className="text-[1.5rem] font-semibold text-[#0f172a] mb-4 leading-snug"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Accuracy Starts With the Right Sources
              </h2>
              <BodyText className="max-w-2xl">
                All structured IPO data on IPOCraft — price bands, offer
                dates, lot sizes, subscription figures, and allotment
                outcomes — is drawn from official exchange disclosures and
                SEBI filings. We do not fabricate or extrapolate structured
                data. GMP figures, where displayed, are clearly marked as
                unofficial and indicative. IPOCraft does not participate in or facilitate grey market trading activities. While we strive for accuracy, information may contain errors, omissions, or delays.
              </BodyText>
            </div>
            <div className="hidden md:flex flex-col items-center justify-center bg-[#f8fafc] border-l border-[#e2e8f0] px-12 gap-3 text-center min-w-[11rem]">
              <div className="w-12 h-12 rounded-full border border-[#dce4ef] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#1e3a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <p
                className="text-[11px] font-medium text-[#94a3b8] leading-relaxed max-w-[9rem]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Exchange-sourced data only
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════ */}
      <section className="bg-[#1e3a8a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 text-center">
          <Eyebrow light>Research Before You Apply</Eyebrow>
          <h2
            className="text-[2.25rem] lg:text-[2.7rem] font-semibold text-white leading-[1.14] tracking-[-0.018em] mb-5 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Make Better-Informed IPO Decisions
          </h2>
          <BodyText light className="max-w-[34rem] mx-auto mb-10">
            Access structured IPO data, GMP trackers, subscription analytics,
            and allotment status — organised for investors who research before
            they act.
          </BodyText>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#f1f5f9] text-[#1e3a8a] text-[13px] font-semibold px-7 py-3 rounded-[4px] transition-colors duration-150"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Explore IPO Database
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-transparent border border-[#3b5fad] hover:border-[#5272c0] text-white text-[13px] font-medium px-7 py-3 rounded-[4px] transition-colors duration-150"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              View GMP Tracker
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════ */}
      <footer className="bg-[#0c1526]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 py-16 border-b border-[#1a2640]">

            {/* Brand */}
            <div>
            <div className="mb-5">
              <Image
                src="/logo2.png"
                alt="IPOCraft"
                width={300}
                height={110}
                className="h-[64px] w-auto object-contain"
              />
            </div>
              <p
                className="text-[12.5px] text-[#475569] leading-relaxed max-w-[17rem]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                A structured IPO data and information platform. Not a broker. Not SEBI-registered. Content is for informational purposes only and should not be considered financial advice.
              </p>
            </div>

            {/* Link columns */}
            {[
              {
                heading: "Platform",
                links: ["IPO Listings", "GMP Tracker", "SME IPO", "Allotment Status", "Subscription Data"],
              },
              {
                heading: "Company",
                links: ["About", "Data Methodology", "Blog", "Contact"],
              },
              {
                heading: "Legal",
                links: ["Disclaimer", "Privacy Policy", "Terms of Use", "Cookie Policy"],
              },
            ].map((col) => (
              <div key={col.heading}>
                <p
                  className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#334155] mb-5"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {col.heading}
                </p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[12.5px] text-[#475569] hover:text-[#64748b] transition-colors duration-150"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Legal disclaimer */}
          <div className="py-8 border-b border-[#1a2640]">
            <p
              className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#334155] mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Important Disclaimer
            </p>
            <p
              className="text-[11.5px] text-[#334155] leading-[1.85] max-w-5xl"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              IPOCraft is an independent informational platform and is{" "}
              <strong className="font-medium text-[#475569]">not registered with SEBI</strong>{" "}
              as an investment advisor, research analyst, or stockbroker. IPOCraft does not participate in or facilitate grey market trading activities. Nothing on this
              platform constitutes investment advice, a solicitation to buy or sell
              securities, or a recommendation of any kind. Grey Market Premium (GMP) data is
              sourced from unofficial, unregulated channels and is provided for informational
              reference only — it does not reflect guaranteed listing prices or future returns.
              Structured IPO data (price bands, dates, lot sizes, subscription figures) is
              sourced from publicly available exchange filings on a best-effort basis and may
              contain errors or omissions. Investors are strongly advised to read the official
              offer documents (DRHP / RHP) and consult a SEBI-registered financial advisor
              before applying to any IPO. Past subscription activity or listing performance
              is not indicative of future results. IPOCraft assumes no liability for any
              financial decisions made based on information displayed on this platform. While we aim to keep information accurate and up to date, data may contain inaccuracies or delays. This page may contain affiliate links, and IPOCraft may earn a commission at no additional cost to users.
            </p>
          </div>

          {/* Bottom bar */}
          <div className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p
              className="text-[11px] text-[#2a3a52]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              © {new Date().getFullYear()} IPOCraft. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {["Disclaimer", "Privacy", "Terms"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-[11px] text-[#2a3a52] hover:text-[#475569] transition-colors"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}