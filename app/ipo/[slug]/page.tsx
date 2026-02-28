import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";

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

  const status = ipo.status as StatusType;
  const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES["Listed"];

  const priceBand =
    ipo.price_min && ipo.price_max
      ? `₹${ipo.price_min} – ₹${ipo.price_max}`
      : "—";

  const gmpDisplay = ipo.gmp != null ? `₹${ipo.gmp}` : "—";

  const minInvestment =
    ipo.price_max && ipo.lot_size
      ? `₹${(ipo.price_max * ipo.lot_size).toLocaleString("en-IN")}`
      : "—";

  return (
    <div
      className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased`}
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
              </div>
            </div>

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-10 items-start">

          {/* Left column */}
          <div>

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
                {ipo.description ??
                  "Detailed company information will appear here once the data is available from official exchange filings and the offer document (DRHP / RHP)."}
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
                  { label: "Revenue (FY)", value: ipo.revenue ?? "—" },
                  { label: "Net Profit (FY)", value: ipo.net_profit ?? "—" },
                  { label: "EBITDA", value: ipo.ebitda ?? "—" },
                  { label: "EPS", value: ipo.eps ?? "—" },
                  { label: "P/E (Post-Issue)", value: ipo.pe_ratio ?? "—" },
                  { label: "RoNW", value: ipo.ronw ?? "—" },
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

            {/* Subscription */}
            <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
              <div className="pb-4 border-b border-[#f1f5f9]">
                <Eyebrow>Subscription</Eyebrow>
                <h2
                  className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Category-wise Subscription
                </h2>
              </div>
              <div className="divide-y divide-[#f1f5f9]">
                {[
                  { category: "QIB (Qualified Institutional Buyers)", value: ipo.sub_qib ?? "—" },
                  { category: "NII (Non-Institutional Investors)", value: ipo.sub_nii ?? "—" },
                  { category: "RII (Retail Individual Investors)", value: ipo.sub_rii ?? "—" },
                  { category: "Total Subscription", value: ipo.sub_total ?? "—" },
                ].map((row) => (
                  <div key={row.category} className="flex items-center justify-between py-3">
                    <p
                      className="text-[14.5px] text-[#475569] leading-[1.78]"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {row.category}
                    </p>
                    <p
                      className="text-[15px] font-semibold text-[#0f172a]"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
              <p
                className="text-[11.5px] text-[#94a3b8] leading-relaxed pt-2 border-t border-[#f1f5f9]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Subscription data sourced from official exchange disclosures, updated each trading day during the offer period.
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
                  { label: "Issue Size", value: ipo.issue_size ?? "—" },
                  { label: "Issue Type", value: ipo.issue_type ?? "—" },
                  { label: "Face Value", value: ipo.face_value ? `₹${ipo.face_value}` : "—" },
                  { label: "Registrar", value: ipo.registrar ?? "—" },
                  { label: "Exchange", value: ipo.exchange ?? "—" },
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
            <div className="bg-white border border-[#e2e8f0] rounded-lg p-5">
              <DataLabel>GMP (Grey Market Premium)</DataLabel>
              <p
                className="text-[1.75rem] font-semibold text-[#0f172a] leading-none mb-3 mt-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {gmpDisplay}
              </p>
              <p
                className="text-[11.5px] text-[#94a3b8] leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                GMP is sourced from unofficial channels, is unregulated, and is indicative only. It does not reflect guaranteed listing prices and should not be used as a basis for investment decisions.
              </p>
            </div>

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
              href="/"
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
              href="/"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#f1f5f9] text-[#1e3a8a] text-[13px] font-semibold px-6 py-[0.65rem] rounded-[4px] transition-colors duration-150"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              View All IPOs
            </Link>
            <Link
              href="/#gmp"
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