import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";
import ProfitCalculatorStandalone from "./ProfitCalculatorStandalone";

const pageUrl = canonicalUrl("/ipo-profit-calculator");

export const metadata: Metadata = {
  title: "Free IPO Profit & Listing Gain Calculator — Estimate Your Returns | IPOCraft",
  description:
    "Calculate your estimated IPO listing profit using GMP and issue price. Enter lots applied, issue price, and GMP to instantly estimate your listing day return. Free IPO profit calculator by IPOCraft.",
  keywords: [
    "IPO profit calculator",
    "IPO listing gain calculator",
    "IPO return calculator India",
    "how much profit from IPO",
    "IPO investment calculator",
    "IPO listing gain estimator",
    "GMP profit calculator",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "IPO Profit & Listing Gain Calculator — Estimate Your Returns | IPOCraft",
    description:
      "Estimate your IPO listing day profit using live GMP and issue price. Free calculator for all investor categories.",
    url: pageUrl,
    siteName: "IPOCraft",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPO Profit & Listing Gain Calculator | IPOCraft",
    description: "Calculate your estimated IPO return using GMP and issue price. Free tool by IPOCraft.",
  },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Calculate IPO Listing Profit",
  description: "Use IPOCraft's free calculator to estimate your IPO listing day profit based on GMP and issue price.",
  step: [
    { "@type": "HowToStep", name: "Enter the issue price", text: "Type the IPO's issue price (upper price band). You can find this on the IPO detail page or the DRHP." },
    { "@type": "HowToStep", name: "Enter the lot size", text: "Enter the lot size — the minimum number of shares per application for this IPO." },
    { "@type": "HowToStep", name: "Enter GMP or estimated listing price", text: "Enter the current Grey Market Premium (GMP). The calculator estimates listing price as: Issue Price + GMP." },
    { "@type": "HowToStep", name: "Select number of lots", text: "Choose how many lots you applied for to see your total estimated profit." },
  ],
  tool: { "@type": "HowToTool", name: "IPOCraft IPO Profit Calculator" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How is IPO listing profit calculated?",
      acceptedAnswer: { "@type": "Answer", text: "IPO listing profit is calculated as: (Listing Price − Issue Price) × Lot Size × Number of Lots. The listing price is estimated using GMP (Grey Market Premium): Estimated Listing Price = Issue Price + GMP. If GMP is ₹50 on an issue price of ₹200, estimated listing is ₹250 — a 25% return." },
    },
    {
      "@type": "Question",
      name: "Is GMP a reliable indicator of listing gain?",
      acceptedAnswer: { "@type": "Answer", text: "GMP is an informal, unregulated sentiment indicator from the grey market. It is not official or guaranteed. In heavily hyped IPOs GMP can overestimate listing gains. In low-demand IPOs it can underestimate. Use GMP as a rough directional guide, not a precise prediction." },
    },
    {
      "@type": "Question",
      name: "What is the maximum retail IPO application amount?",
      acceptedAnswer: { "@type": "Answer", text: "Retail investors can apply for a maximum of ₹2,00,000 worth of shares in a single IPO application. Above ₹2 lakh you fall in the sNII (Small Non-Institutional Investor) category with different allotment rules." },
    },
    {
      "@type": "Question",
      name: "Do I pay tax on IPO listing gains?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. If you sell IPO shares on listing day (within 12 months of allotment), the profit is treated as Short Term Capital Gain (STCG) and taxed at 20% (post Budget 2024). If you hold for more than 12 months, gains above ₹1.25 lakh are taxed at 12.5% as Long Term Capital Gain (LTCG). Consult a tax advisor for your specific situation." },
    },
    {
      "@type": "Question",
      name: "What is Kostak rate in IPO?",
      acceptedAnswer: { "@type": "Answer", text: "Kostak is the price at which you can sell your IPO application before allotment — regardless of whether you get allotment. It is a grey market concept, entirely unofficial and unregulated. It represents the buyer's willingness to pay for the chance of allotment." },
    },
    {
      "@type": "Question",
      name: "Can listing price go below issue price?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. IPOs can list below their issue price (negative listing). This typically happens when the company is overvalued, market sentiment deteriorates between filing and listing, or broader market conditions are weak. Negative GMP before listing often signals this risk." },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
    { "@type": "ListItem", position: 2, name: "IPO Profit Calculator", item: pageUrl },
  ],
};

export default function ProfitCalculatorPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-4xl mx-auto py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12px] text-[#64748b] dark:text-[#9AA1AA] mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1C317A] dark:hover:text-blue-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#0f172a] dark:text-[#F1F5F9] font-medium">IPO Profit Calculator</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#1C317A] dark:text-blue-400 mb-3" style={{ fontFamily: "var(--font-inter)" }}>
            Free Tool · GMP-Based Estimation
          </p>
          <h1 className="text-[1.75rem] sm:text-[2.25rem] font-bold text-[#0f172a] dark:text-[#F1F5F9] leading-tight mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
            IPO Profit & Listing Gain Calculator
          </h1>
          <p className="text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed max-w-2xl" style={{ fontFamily: "var(--font-inter)" }}>
            Estimate your IPO listing day profit based on issue price, lot size, GMP, and number of lots applied.
            Works for any Mainboard or SME IPO.
          </p>
        </div>

        {/* Calculator */}
        <ProfitCalculatorStandalone />

        {/* Link to active IPOs */}
        <div className="mt-4 p-4 bg-[#eef2ff] dark:bg-[#1C317A]/10 border border-[#c7d2fe] dark:border-[#1C317A]/30 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[13px] text-[#334155] dark:text-[#9AA1AA]" style={{ fontFamily: "var(--font-inter)" }}>
            Want pre-filled issue price and live GMP for a specific IPO?
          </p>
          <Link href="/ipo" className="inline-flex items-center text-[13px] font-semibold text-[#1C317A] dark:text-blue-400 hover:underline shrink-0" style={{ fontFamily: "var(--font-inter)" }}>
            View All Active IPOs
          </Link>
        </div>

        {/* Educational Content */}
        <div className="mt-12 space-y-10">

          <section>
            <h2 className="text-[1.25rem] sm:text-[1.4rem] font-bold text-[#0f172a] dark:text-[#F1F5F9] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
              How is IPO Listing Profit Calculated?
            </h2>
            <p className="text-[14.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              IPO listing profit depends on the difference between the listing price and the issue price. Since the actual listing price is unknown before the IPO lists, the GMP (Grey Market Premium) is used as an estimate:
            </p>
            <div className="mt-4 p-4 bg-[#f8fafc] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg font-mono text-[13px] text-[#0f172a] dark:text-[#F1F5F9] space-y-1">
              <p>Estimated Listing Price = Issue Price + GMP</p>
              <p>Profit per Share = Estimated Listing Price − Issue Price</p>
              <p>Total Profit = Profit per Share × Lot Size × Lots Applied</p>
              <p className="text-[#1C317A] dark:text-blue-400 font-semibold">Return % = (GMP ÷ Issue Price) × 100</p>
            </div>
            <p className="text-[13px] text-[#64748b] dark:text-[#9AA1AA] mt-3 italic" style={{ fontFamily: "var(--font-inter)" }}>
              Note: GMP is unofficial and unregulated. Actual listing gains may differ significantly. This is an estimate only.
            </p>
          </section>

          <section>
            <h2 className="text-[1.25rem] sm:text-[1.4rem] font-bold text-[#0f172a] dark:text-[#F1F5F9] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
              Is GMP a Reliable Predictor of Listing Gains?
            </h2>
            <p className="text-[14.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              GMP reflects informal market sentiment — not a guarantee. Historically, high-GMP IPOs do tend to list well, but there are notable exceptions. GMP can be inflated by a small group of market participants and may not reflect actual demand from institutional investors (QIBs), who are the largest allottees.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "GMP is useful for", items: ["Gauging retail/HNI sentiment", "Estimating listing direction (positive/negative)", "Comparing relative demand across IPOs"] },
                { label: "GMP is not reliable for", items: ["Predicting exact listing price", "Making final investment decisions", "Measuring institutional demand"] },
              ].map(({ label, items }) => (
                <div key={label} className="p-4 bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-[#64748b] dark:text-[#9AA1AA] mb-2" style={{ fontFamily: "var(--font-inter)" }}>{label}</p>
                  <ul className="space-y-1">
                    {items.map(item => (
                      <li key={item} className="text-[13px] text-[#475569] dark:text-[#9AA1AA] flex items-start gap-1.5" style={{ fontFamily: "var(--font-inter)" }}>
                        <span className="text-[#1C317A] dark:text-blue-400 mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[1.25rem] sm:text-[1.4rem] font-bold text-[#0f172a] dark:text-[#F1F5F9] mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                { q: "Do I pay tax on IPO listing gains?", a: "Yes. Selling IPO shares on listing day is treated as Short Term Capital Gain (STCG), taxed at 20%. Holding more than 12 months makes gains above ₹1.25 lakh taxable at 12.5% LTCG. Consult a tax advisor for your specific situation." },
                { q: "What is the maximum retail IPO investment?", a: "Retail investors can apply for a maximum of ₹2,00,000 in a single IPO application. Above this, you fall in the sNII category." },
                { q: "Can the IPO list below issue price?", a: "Yes. IPOs can and do list below their issue price. This typically happens when the company is overvalued, market sentiment weakens between the IPO date and listing date, or broader market conditions are weak. A negative GMP before listing often signals this risk." },
                { q: "What is Kostak rate?", a: "Kostak is the price at which you can sell your entire IPO application (before allotment is known) in the grey market. It is an informal, unregulated concept. A high Kostak rate suggests strong demand. IPOCraft recommends against participating in grey market transactions." },
              ].map(({ q, a }) => (
                <div key={q} className="border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4 bg-white dark:bg-[#111418]">
                  <p className="font-semibold text-[14px] text-[#0f172a] dark:text-[#F1F5F9] mb-1.5" style={{ fontFamily: "var(--font-inter)" }}>{q}</p>
                  <p className="text-[13.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related links */}
          <section className="border-t border-[#e2e8f0] dark:border-[#252A31] pt-8">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-[#64748b] dark:text-[#9AA1AA] mb-4" style={{ fontFamily: "var(--font-inter)" }}>
              Related Tools & Guides
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: "/ipo-allotment-probability-calculator", label: "IPO Allotment Probability Calculator" },
                { href: "/how-ipo-allotment-works", label: "How IPO Allotment Works" },
                { href: "/what-is-ipo-gmp", label: "What is IPO GMP?" },
                { href: "/ipo-grey-market-guide", label: "IPO Grey Market Guide" },
                { href: "/ipo-subscription-meaning", label: "What is IPO Subscription?" },
                { href: "/qib-hni-retail-explained", label: "QIB, HNI & Retail Explained" },
                { href: "/gmp", label: "IPO GMP Today (Live)" },
                { href: "/ipo", label: "All Active IPOs" },
                { href: "/blog", label: "IPOCraft Blog" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="flex items-center p-3 rounded-lg border border-[#e2e8f0] dark:border-[#252A31] bg-white dark:bg-[#111418] hover:border-[#1C317A] dark:hover:border-blue-500 transition-colors text-[13.5px] font-medium text-[#334155] dark:text-[#9AA1AA] hover:text-[#1C317A] dark:hover:text-blue-400" style={{ fontFamily: "var(--font-inter)" }}>
                  {label}
                </Link>
              ))}
            </div>
          </section>

          <p className="text-[11.5px] text-[#94a3b8] dark:text-[#6B7280] leading-relaxed border-t border-[#e2e8f0] dark:border-[#252A31] pt-6" style={{ fontFamily: "var(--font-inter)" }}>
            <strong>Disclaimer:</strong> This calculator is for informational and educational purposes only. GMP is unofficial and unregulated. Estimated profits do not guarantee actual listing gains. IPO investing carries market risk. Please read all offer documents carefully before investing. IPOCraft is not a SEBI-registered investment adviser.
          </p>
        </div>
      </div>
    </div>
  );
}
