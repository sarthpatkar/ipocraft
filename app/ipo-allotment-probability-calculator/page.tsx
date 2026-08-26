import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { canonicalUrl } from "@/lib/site-url";
import AllotmentCalculatorStandalone from "./AllotmentCalculatorStandalone";

const pageUrl = canonicalUrl("/ipo-allotment-probability-calculator");

export const metadata: Metadata = {
  title: "Free IPO Allotment Probability Calculator — SEBI Lottery Method | IPOCraft",
  description:
    "Calculate your IPO allotment probability using the correct SEBI lottery method. See your actual '1 in X' odds for Retail, sNII and bNII categories. Free and accurate.",
  keywords: [
    "IPO allotment probability calculator",
    "IPO allotment chances calculator India",
    "retail IPO lottery calculator",
    "IPO allotment odds",
    "how to calculate IPO allotment probability",
    "SEBI IPO lottery allotment",
    "IPO allotment calculator free",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Free IPO Allotment Probability Calculator — SEBI Lottery Method | IPOCraft",
    description:
      "Find out your real IPO allotment odds using SEBI's computerized lottery formula. See your '1 in X' chance instantly.",
    url: pageUrl,
    siteName: "IPOCraft",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPO Allotment Probability Calculator — SEBI Method | IPOCraft",
    description: "Calculate your exact IPO allotment odds for Retail, sNII, and bNII categories.",
  },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Calculate IPO Allotment Probability",
  description: "Use IPOCraft's free calculator to find your chance of getting IPO allotment using the SEBI lottery method.",
  step: [
    { "@type": "HowToStep", name: "Select your investor category", text: "Choose Retail (up to ₹2 lakh), sNII (₹2L–₹10L), or bNII (above ₹10 lakh)." },
    { "@type": "HowToStep", name: "Enter the subscription multiple", text: "Enter how many times the IPO is subscribed in your category. Find this on NSE/BSE or on IPOCraft's live subscription page." },
    { "@type": "HowToStep", name: "Read your probability", text: "The calculator shows your estimated chance as both a percentage and a '1 in X applications' ratio." },
  ],
  tool: { "@type": "HowToTool", name: "IPOCraft Allotment Probability Calculator" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How is IPO allotment done for retail investors?",
      acceptedAnswer: { "@type": "Answer", text: "When a retail IPO category is oversubscribed, SEBI mandates a computerized lottery. Each valid application is entered once regardless of how many lots were applied for. The registrar randomly selects applications until the available retail shares are distributed, giving each winner exactly 1 lot." },
    },
    {
      "@type": "Question",
      name: "Does applying for more lots increase IPO allotment chances?",
      acceptedAnswer: { "@type": "Answer", text: "No. In an oversubscribed retail IPO, applying for more lots does NOT increase your probability of allotment. SEBI's lottery treats each application as one entry. Your odds are identical whether you apply for 1 lot or the maximum 13 lots." },
    },
    {
      "@type": "Question",
      name: "What does '1 in 7 applications' mean for IPO allotment?",
      acceptedAnswer: { "@type": "Answer", text: "It means that out of every 7 valid retail applications submitted, approximately 1 will receive allotment. This ratio is published in the official Basis of Allotment document by the registrar after the IPO closes." },
    },
    {
      "@type": "Question",
      name: "What is the difference between retail, sNII, and bNII in IPO allotment?",
      acceptedAnswer: { "@type": "Answer", text: "Retail Individual Investors (RII) apply for up to ₹2 lakh and receive allotment via lottery. Small Non-Institutional Investors (sNII) apply between ₹2L and ₹10L — also lottery-based. Big Non-Institutional Investors (bNII) apply above ₹10L — proportional allotment applies, meaning you may receive partial lots." },
    },
    {
      "@type": "Question",
      name: "What happens if an IPO is undersubscribed in the retail category?",
      acceptedAnswer: { "@type": "Answer", text: "If the retail category receives fewer applications than available shares (subscription below 1x), all valid applications receive full allotment. No lottery is conducted. The probability is 100%." },
    },
    {
      "@type": "Question",
      name: "What is the Basis of Allotment in an IPO?",
      acceptedAnswer: { "@type": "Answer", text: "The Basis of Allotment is an official document published by the IPO registrar after the subscription period closes. It details the exact lottery ratio used for retail allotment and the total number of valid applications received in each category." },
    },
    {
      "@type": "Question",
      name: "Can I improve my IPO allotment chances?",
      acceptedAnswer: { "@type": "Answer", text: "The only legitimate way to improve allotment chances in retail is to apply through multiple family members' demat accounts. Each account counts as a separate application in the lottery. Each must have a unique PAN, demat account, and bank account." },
    },
    {
      "@type": "Question",
      name: "Does subscription multiple equal allotment probability?",
      acceptedAnswer: { "@type": "Answer", text: "Not exactly. A 7x subscription does not mean exactly a 1-in-7 chance. The actual ratio is calculated using total applications, not total lots. In practice it is close to 1/subscription_multiple, and the official ratio is published in the Basis of Allotment." },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
    { "@type": "ListItem", position: 2, name: "IPO Allotment Probability Calculator", item: pageUrl },
  ],
};

export default function AllotmentCalculatorPage() {
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
          <span className="text-[#0f172a] dark:text-[#F1F5F9] font-medium">Allotment Probability Calculator</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#1C317A] dark:text-blue-400 mb-3" style={{ fontFamily: "var(--font-inter)" }}>
            Free Tool · SEBI Lottery Method
          </p>
          <h1 className="text-[1.75rem] sm:text-[2.25rem] font-bold text-[#0f172a] dark:text-[#F1F5F9] leading-tight mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
            IPO Allotment Probability Calculator
          </h1>
          <p className="text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed max-w-2xl" style={{ fontFamily: "var(--font-inter)" }}>
            Calculate your real chance of getting IPO allotment using the same formula SEBI registrars use.
            See your odds as a percentage and as a <strong className="text-[#0f172a] dark:text-[#F1F5F9]">&quot;1 in X applications&quot;</strong> ratio.
          </p>
        </div>

        {/* Calculator */}
        <Suspense fallback={
          <div className="h-48 flex items-center justify-center text-[13px] text-gray-400">Loading calculator...</div>
        }>
          <AllotmentCalculatorStandalone />
        </Suspense>

        {/* CTA link */}
        <div className="mt-4 p-4 bg-[#eef2ff] dark:bg-[#1C317A]/10 border border-[#c7d2fe] dark:border-[#1C317A]/30 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[13px] text-[#334155] dark:text-[#9AA1AA]" style={{ fontFamily: "var(--font-inter)" }}>
            Want pre-filled data for a specific IPO? Open that IPO&apos;s detail page on IPOCraft.
          </p>
          <Link href="/ipo" className="inline-flex items-center text-[13px] font-semibold text-[#1C317A] dark:text-blue-400 hover:underline shrink-0" style={{ fontFamily: "var(--font-inter)" }}>
            View All Active IPOs
          </Link>
        </div>

        {/* Educational Content */}
        <div className="mt-12 space-y-10">

          <section>
            <h2 className="text-[1.25rem] sm:text-[1.4rem] font-bold text-[#0f172a] dark:text-[#F1F5F9] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
              How Does IPO Allotment Work in India?
            </h2>
            <p className="text-[14.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              When an IPO receives more applications than available shares, SEBI mandates a{" "}
              <strong className="text-[#0f172a] dark:text-[#F1F5F9]">computerized lottery</strong> for the retail category.
              Each valid application is entered into the draw exactly once — regardless of how many lots were applied for.
              The registrar runs this lottery and publishes results in the official{" "}
              <strong className="text-[#0f172a] dark:text-[#F1F5F9]">Basis of Allotment</strong> document.
            </p>
            <p className="text-[14.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed mt-3" style={{ fontFamily: "var(--font-inter)" }}>
              Every successful applicant receives exactly <strong className="text-[#0f172a] dark:text-[#F1F5F9]">1 lot</strong> — the minimum lot size.
              Extra lots applied for are not allotted in an oversubscribed scenario.
            </p>
          </section>

          <section>
            <h2 className="text-[1.25rem] sm:text-[1.4rem] font-bold text-[#0f172a] dark:text-[#F1F5F9] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
              Does Applying for More Lots Increase Your Chances?
            </h2>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg mb-4">
              <p className="text-[14px] font-semibold text-amber-800 dark:text-amber-400" style={{ fontFamily: "var(--font-inter)" }}>
                No — applying for more lots from the same demat account does NOT improve your allotment probability in the retail category.
              </p>
            </div>
            <p className="text-[14.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              SEBI&apos;s lottery counts each <em>application</em> once, not each <em>lot</em>.
              Whether you apply for 1 lot or the maximum 13 lots (₹2 lakh limit), your application appears in the draw exactly once.
              The only way to increase chances is to apply through <strong className="text-[#0f172a] dark:text-[#F1F5F9]">multiple unique demat accounts</strong> (e.g., your own + spouse + parent accounts).
            </p>
          </section>

          <section>
            <h2 className="text-[1.25rem] sm:text-[1.4rem] font-bold text-[#0f172a] dark:text-[#F1F5F9] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
              Retail vs sNII vs bNII — Key Differences
            </h2>
            <div className="overflow-x-auto rounded-lg border border-[#e2e8f0] dark:border-[#252A31]">
              <table className="w-full text-[13px]" style={{ fontFamily: "var(--font-inter)" }}>
                <thead className="bg-[#f8fafc] dark:bg-[#171B20]">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-[#0f172a] dark:text-[#F1F5F9]">Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#0f172a] dark:text-[#F1F5F9]">Investment Range</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#0f172a] dark:text-[#F1F5F9]">Allotment Method</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#0f172a] dark:text-[#F1F5F9]">More Lots Help?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#252A31]">
                  <tr className="bg-white dark:bg-[#111418]">
                    <td className="px-4 py-3 font-medium text-[#0f172a] dark:text-[#F1F5F9]">Retail (RII)</td>
                    <td className="px-4 py-3 text-[#475569] dark:text-[#9AA1AA]">Up to ₹2,00,000</td>
                    <td className="px-4 py-3 text-[#475569] dark:text-[#9AA1AA]">Computerized Lottery</td>
                    <td className="px-4 py-3 text-red-600 dark:text-red-400 font-semibold">No</td>
                  </tr>
                  <tr className="bg-white dark:bg-[#111418]">
                    <td className="px-4 py-3 font-medium text-[#0f172a] dark:text-[#F1F5F9]">sNII</td>
                    <td className="px-4 py-3 text-[#475569] dark:text-[#9AA1AA]">₹2,00,001 – ₹10,00,000</td>
                    <td className="px-4 py-3 text-[#475569] dark:text-[#9AA1AA]">Lottery (min 1 lot)</td>
                    <td className="px-4 py-3 text-red-600 dark:text-red-400 font-semibold">No</td>
                  </tr>
                  <tr className="bg-white dark:bg-[#111418]">
                    <td className="px-4 py-3 font-medium text-[#0f172a] dark:text-[#F1F5F9]">bNII</td>
                    <td className="px-4 py-3 text-[#475569] dark:text-[#9AA1AA]">Above ₹10,00,000</td>
                    <td className="px-4 py-3 text-[#475569] dark:text-[#9AA1AA]">Proportional</td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold">Yes (partial)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-[1.25rem] sm:text-[1.4rem] font-bold text-[#0f172a] dark:text-[#F1F5F9] mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                { q: "What is the Basis of Allotment?", a: "The Basis of Allotment is an official document published by the IPO registrar after the subscription closes. It shows the exact lottery ratio used — e.g., '1 in 7 applications' — and the total number of valid applications per category." },
                { q: "When is the Basis of Allotment published?", a: "Typically 6 business days after the IPO closes. You can find it on the registrar's website (KFintech, Link Intime, Bigshare Services, etc.) and on the BSE/NSE websites." },
                { q: "What if the IPO is undersubscribed?", a: "If the retail category receives fewer applications than available shares (subscription below 1x), all valid applications receive full allotment. No lottery is conducted." },
                { q: "Does subscription multiple equal allotment probability?", a: "Not exactly. A 7x subscription does not mean a 1-in-7 chance. The actual ratio uses total applications, not total lots. The official ratio is published in the Basis of Allotment document." },
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
                { href: "/ipo-profit-calculator", label: "IPO Profit & Listing Gain Calculator" },
                { href: "/how-ipo-allotment-works", label: "How IPO Allotment Works" },
                { href: "/ipo-subscription-meaning", label: "What is IPO Subscription?" },
                { href: "/qib-hni-retail-explained", label: "QIB, HNI & Retail Explained" },
                { href: "/gmp", label: "IPO GMP Today" },
                { href: "/ipo", label: "All Active IPOs" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="flex items-center p-3 rounded-lg border border-[#e2e8f0] dark:border-[#252A31] bg-white dark:bg-[#111418] hover:border-[#1C317A] dark:hover:border-blue-500 transition-colors text-[13.5px] font-medium text-[#334155] dark:text-[#9AA1AA] hover:text-[#1C317A] dark:hover:text-blue-400" style={{ fontFamily: "var(--font-inter)" }}>
                  {label}
                </Link>
              ))}
            </div>
          </section>

          <p className="text-[11.5px] text-[#94a3b8] dark:text-[#6B7280] leading-relaxed border-t border-[#e2e8f0] dark:border-[#252A31] pt-6" style={{ fontFamily: "var(--font-inter)" }}>
            <strong>Disclaimer:</strong> This calculator is for informational and educational purposes only. Allotment probability is an estimate and does not guarantee actual allotment. IPO investing carries market risk. Please read all offer documents carefully before investing. IPOCraft is not a SEBI-registered investment adviser.
          </p>
        </div>
      </div>
    </div>
  );
}
