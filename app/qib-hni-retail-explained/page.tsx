import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Playfair_Display, Inter } from "next/font/google";
import { canonicalUrl } from "@/lib/site-url";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const investorCategoriesUrl = canonicalUrl("/qib-hni-retail-explained");

export const metadata: Metadata = {
  title: "QIB vs HNI vs Retail Investors – IPO Categories Explained",
  description:
    "Understand QIB, HNI (NII), and Retail investor categories in IPOs, their allocation quotas, subscription impact, and allotment differences.",
  alternates: {
    canonical: investorCategoriesUrl,
  },
  openGraph: {
    title: "QIB vs HNI vs Retail – IPO Investor Categories Explained",
    description:
      "Detailed explanation of IPO investor categories, quota allocation, and how subscription differs across QIB, HNI, and Retail.",
    url: investorCategoriesUrl,
    siteName: "IPOCraft",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "QIB vs HNI vs Retail – IPOCraft Guide",
    description:
      "Learn the difference between QIB, HNI and Retail categories in IPO allotment.",
  },
};

export default function InvestorCategoriesGuide() {
  return (
    <div
      className={`${playfair.variable} ${inter.variable} min-h-screen scroll-smooth bg-[#f8fafc] text-[#0f172a]`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#2563eb]">
          IPO Learning Guide
        </p>

        <h1
          className="mt-3 text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          QIB vs HNI vs Retail Investors – Complete IPO Category Breakdown (2026)
        </h1>

        <div className="mt-3 text-xs text-[#64748b] flex flex-wrap gap-3">
          <span>
            Last Updated: {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>•</span>
          <span>Approx. 10–12 min read</span>
        </div>

        <p className="mt-6 text-[15px] text-[#475569] leading-relaxed">
          In an Initial Public Offering (IPO), shares are divided into different
          investor categories: Qualified Institutional Buyers (QIB), High
          Net-worth Individuals (HNI/NII), and Retail Individual Investors
          (RII). Each category has a specific quota, allocation method, and
          subscription dynamics. Understanding these differences helps investors
          evaluate allotment chances and demand trends more accurately.
        </p>

        {/* Quick Comparison Card */}
        <div className="mt-6 bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
            Quick Comparison: QIB vs HNI vs Retail
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-[#f8fafc] rounded-lg p-3 border border-[#e2e8f0]">
              <p className="font-semibold text-[#0f172a]">Retail (RII)</p>
              <ul className="mt-2 list-disc pl-4 space-y-1 text-[#475569]">
                <li>Up to ₹2 lakh application</li>
                <li>~35% allocation</li>
                <li>Lottery-based allotment</li>
              </ul>
            </div>
            <div className="bg-[#f8fafc] rounded-lg p-3 border border-[#e2e8f0]">
              <p className="font-semibold text-[#0f172a]">HNI / NII</p>
              <ul className="mt-2 list-disc pl-4 space-y-1 text-[#475569]">
                <li>Above ₹2 lakh</li>
                <li>~15% allocation</li>
                <li>Proportionate allotment</li>
              </ul>
            </div>
            <div className="bg-[#f8fafc] rounded-lg p-3 border border-[#e2e8f0]">
              <p className="font-semibold text-[#0f172a]">QIB</p>
              <ul className="mt-2 list-disc pl-4 space-y-1 text-[#475569]">
                <li>Institutional investors</li>
                <li>~50% allocation</li>
                <li>Book-building driven</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Jump Navigation */}
        <div className="mt-8 sticky top-24 z-30 bg-white/95 backdrop-blur border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
          <p className="text-sm font-semibold mb-3">Jump to Section</p>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <a href="#overview" className="text-[#2563eb] hover:underline">Category Overview</a>
            <a href="#retail" className="text-[#2563eb] hover:underline">Retail Investors</a>
            <a href="#hni" className="text-[#2563eb] hover:underline">HNI / NII</a>
            <a href="#qib" className="text-[#2563eb] hover:underline">QIB</a>
            <a href="#allocation" className="text-[#2563eb] hover:underline">Allocation Rules</a>
            <a href="#impact" className="text-[#2563eb] hover:underline">Impact on Listing</a>
          </div>
        </div>

        <div className="mt-10 space-y-16">

          <Section id="overview" title="IPO Investor Categories Overview (Mainboard vs SME)">
            <p>
              IPO allocation in India is divided into structured investor buckets to ensure fair participation across institutional and non-institutional investors. In a typical Mainboard IPO, allocation is generally structured as:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>QIB (Qualified Institutional Buyers):</strong> ~50%</li>
              <li><strong>Retail Individual Investors (RII):</strong> ~35%</li>
              <li><strong>HNI / NII (Non-Institutional Investors):</strong> ~15%</li>
            </ul>
            <p>
              However, in SME IPOs, the structure differs significantly. SME issues often have a much higher Retail allocation and a separate Market Maker portion. Institutional participation may be lower compared to Mainboard IPOs.
            </p>
            <p>
              Understanding whether an IPO is SME or Mainboard is critical before interpreting subscription data.
            </p>
          </Section>

          <Section id="retail" title="Retail Individual Investors (RII) – Lottery Based Allocation">
            <p>
              Retail investors can apply up to ₹2 lakh in a Mainboard IPO. If the Retail category is oversubscribed, allotment is done via a computerized lottery system.
            </p>
            <p>
              Example: Suppose Retail quota has 10 lakh shares available and receives applications for 100 lakh shares. That means Retail is subscribed 10x.
            </p>
            <p>
              If 5 lakh valid retail applications exist and only 1 lakh applications can be allotted minimum lots, effective probability becomes:
            </p>
            <p className="font-medium">
              1,00,000 ÷ 5,00,000 = 20% allotment probability
            </p>
            <p>
              This is why even strong IPOs often result in no allotment for most retail investors.
            </p>
          </Section>

          <Section id="hni" title="HNI / NII – Proportionate Allocation with Leverage Impact">
            <p>
              HNI investors apply above ₹2 lakh. Unlike Retail, HNI allocation is proportionate.
            </p>
            <p>
              Example: If HNI category is subscribed 30x, and an investor applies for 300 lots, effective allotment may reduce proportionately to roughly 10 lots.
            </p>
            <p>
              In strong IPOs, HNI subscription is often driven by leveraged funding. This can distort perceived demand.
            </p>
          </Section>

          <Section id="qib" title="QIB – Institutional Demand as Confidence Indicator">
            <p>
              QIBs include mutual funds, insurance companies, banks, and foreign institutional investors. They typically receive 50% allocation in Mainboard IPOs.
            </p>
            <p>
              Strong QIB subscription, especially on Day 2 and Day 3, often signals institutional conviction. Many analysts consider QIB participation more reliable than Retail oversubscription when assessing listing strength.
            </p>
          </Section>

          <Section id="allocation" title="Detailed Allocation Math Example">
            <p>
              Assume an IPO has total issue size of 1 crore shares.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>QIB: 50 lakh shares</li>
              <li>Retail: 35 lakh shares</li>
              <li>HNI: 15 lakh shares</li>
            </ul>
            <p>
              If subscription levels are:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>QIB: 8x</li>
              <li>Retail: 20x</li>
              <li>HNI: 50x</li>
            </ul>
            <p>
              Then effective competition differs dramatically across categories. Retail might have lower probability than QIB despite higher multiplier.
            </p>
          </Section>

          <Section id="case-study" title="Real Oversubscription Case Study Logic">
            <p>
              Consider a strong Mainboard IPO where Retail subscription reached 25x, HNI reached 120x, and QIB reached 15x.
            </p>
            <p>
              Even though HNI shows 120x, much of it may be funded by short-term leverage. QIB participation at 15x often provides stronger signal of long-term institutional interest.
            </p>
            <p>
              Listing gains in such IPOs are frequently supported when QIB demand remains strong.
            </p>
          </Section>

          <Section id="probability" title="Probability Comparison Across Categories">
            <p>
              Retail probability is lottery-based. HNI probability reduces proportionately. QIB allocation depends on book building and institutional bidding patterns.
            </p>
            <p>
              In heavily oversubscribed IPOs, Retail probability can fall below 5%, while HNI may receive partial allotment.
            </p>
          </Section>

          <Section id="flow-diagram" title="How IPO Subscription Flows Across Categories (Visual Guide)">
            <p>
              The subscription process follows a structured flow — bids are collected category-wise, tallied daily, and finalized at issue close before allotment logic is applied.
            </p>

            <div className="mt-6 bg-white border border-[#e2e8f0] rounded-xl p-6 overflow-x-auto">
              <svg viewBox="0 0 800 200" className="min-w-[600px] w-full h-auto">
                <defs>
                  <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#2563eb" />
                  </marker>
                </defs>

                <rect x="20" y="70" width="180" height="50" rx="8" fill="#eef2ff" stroke="#2563eb" />
                <text x="110" y="100" textAnchor="middle" fontSize="14" fill="#0f172a">Investor Bids</text>

                <line x1="200" y1="95" x2="320" y2="95" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arrow)" />

                <rect x="320" y="70" width="180" height="50" rx="8" fill="#f1f5f9" stroke="#2563eb" />
                <text x="410" y="90" textAnchor="middle" fontSize="13" fill="#0f172a">Category-wise</text>
                <text x="410" y="108" textAnchor="middle" fontSize="13" fill="#0f172a">Tally (QIB / HNI / Retail)</text>

                <line x1="500" y1="95" x2="620" y2="95" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arrow)" />

                <rect x="620" y="70" width="160" height="50" rx="8" fill="#eef2ff" stroke="#2563eb" />
                <text x="700" y="100" textAnchor="middle" fontSize="14" fill="#0f172a">Allotment Logic</text>
              </svg>
            </div>

            <p className="mt-4">
              After bidding closes, each category is evaluated independently. Retail follows lottery allocation, HNI follows proportionate allocation, and QIB allocation depends on institutional book building.
            </p>
          </Section>

          <Section id="impact" title="Advanced Interpretation Strategies">
            <ul className="list-disc pl-6 space-y-2">
              <li>Strong QIB demand late in bidding window is a positive signal.</li>
              <li>Retail-only oversubscription without QIB strength may indicate speculative interest.</li>
              <li>SME IPOs behave differently due to lower liquidity and market maker structure.</li>
              <li>Compare subscription with Grey Market Premium trends on our <Link href="/gmp" className="text-[#2563eb] underline">IPO GMP tracker</Link>.</li>
            </ul>
          </Section>

          <Section id="institutional" title="Institutional Behavior Insights">
            <p>
              Institutions often bid conservatively early and aggressively near closing. Monitoring daily subscription breakdown helps understand institutional intent.
            </p>
            <p>
              QIB anchor allocations prior to IPO opening also influence post-listing stability.
            </p>
          </Section>

          <Section id="data" title="Data Transparency & Source Context">
            <p>
              IPO subscription figures are sourced from exchange disclosures and official bid data released during the IPO bidding period. Investors should always verify subscription numbers through official filings before making decisions.
            </p>
            <p>
              IPOCraft aggregates publicly available data for informational and research purposes only.
            </p>
          </Section>

          <Section id="comparison-table" title="Mainboard vs SME IPO Quota Comparison Table">
            <p>
              Allocation structure differs significantly between Mainboard and SME IPOs. Understanding this structural difference is essential when analyzing subscription data.
            </p>

            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm border border-[#e2e8f0]">
                <thead className="bg-[#f1f5f9]">
                  <tr>
                    <th className="text-left px-4 py-2 border">Category</th>
                    <th className="text-left px-4 py-2 border">Mainboard IPO</th>
                    <th className="text-left px-4 py-2 border">SME IPO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border font-medium">QIB</td>
                    <td className="px-4 py-2 border">~50%</td>
                    <td className="px-4 py-2 border">Lower or optional</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border font-medium">Retail</td>
                    <td className="px-4 py-2 border">~35%</td>
                    <td className="px-4 py-2 border">Often 40%+</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border font-medium">HNI / NII</td>
                    <td className="px-4 py-2 border">~15%</td>
                    <td className="px-4 py-2 border">Present</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border font-medium">Market Maker</td>
                    <td className="px-4 py-2 border">Not applicable</td>
                    <td className="px-4 py-2 border">Mandatory portion</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4">
              SME IPOs typically have higher lot sizes and lower liquidity post-listing, which makes category interpretation different compared to Mainboard IPOs.
            </p>
          </Section>

          <Section id="historical-example" title="Historical IPO Example – Institutional vs Retail Demand">
            <p>
              Consider a well-known Mainboard IPO such as Tata Technologies (2023). The IPO saw strong participation across categories, with QIB demand significantly higher toward the final bidding day.
            </p>
            <p>
              Despite heavy Retail oversubscription, institutional participation provided stronger confidence regarding listing sentiment. This example highlights why analysts often prioritize QIB demand over Retail multiples alone.
            </p>
            <p>
              Historical examples demonstrate that balanced demand across QIB and Retail categories tends to create more stable listing outcomes.
            </p>
          </Section>

          <Section id="visual-allocation" title="Visual Allocation Breakdown Example">
            <p>
              Suppose an IPO has 10 lakh total shares available for allocation:
            </p>

            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm border border-[#e2e8f0]">
                <thead className="bg-[#f8fafc]">
                  <tr>
                    <th className="text-left px-4 py-2 border">Category</th>
                    <th className="text-left px-4 py-2 border">Shares Allocated</th>
                    <th className="text-left px-4 py-2 border">Subscription</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border font-medium">QIB</td>
                    <td className="px-4 py-2 border">5,00,000</td>
                    <td className="px-4 py-2 border">12x</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border font-medium">Retail</td>
                    <td className="px-4 py-2 border">3,50,000</td>
                    <td className="px-4 py-2 border">25x</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border font-medium">HNI</td>
                    <td className="px-4 py-2 border">1,50,000</td>
                    <td className="px-4 py-2 border">80x</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4">
              This simplified breakdown visually demonstrates how oversubscription levels differ across categories even when allocation percentages are fixed.
            </p>
          </Section>

          {/* FAQ Section */}
          <Section id="faqs" title="Frequently Asked Questions (Investor Categories)">
            <div className="space-y-6">
              <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
                <h3 className="font-semibold text-[#0f172a]">Does higher QIB subscription guarantee listing gains?</h3>
                <p className="mt-2 text-[#475569]">
                  No. Strong QIB demand often reflects institutional confidence, but listing performance depends on valuation, market conditions, and overall demand balance.
                </p>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
                <h3 className="font-semibold text-[#0f172a]">Why is HNI subscription sometimes extremely high?</h3>
                <p className="mt-2 text-[#475569]">
                  HNI subscription can appear very high due to leveraged funding, where investors borrow capital to apply for large quantities.
                </p>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
                <h3 className="font-semibold text-[#0f172a]">Is Retail allotment purely lottery-based?</h3>
                <p className="mt-2 text-[#475569]">
                  Yes. In oversubscribed IPOs, valid retail applications enter a computerized lottery system where minimum lots are distributed fairly among applicants.
                </p>
              </div>
            </div>
          </Section>

          <Section id="cross-links" title="Related IPO Learning Resources">
            <p>
              To understand how subscription connects with other IPO metrics, explore:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Link href="/ipo-subscription-meaning" className="text-[#2563eb] underline">
                  IPO Subscription Meaning Guide
                </Link>
              </li>
              <li>
                <Link href="/how-ipo-allotment-works" className="text-[#2563eb] underline">
                  How IPO Allotment Works
                </Link>
              </li>
              <li>
                <Link href="/gmp" className="text-[#2563eb] underline">
                  IPO GMP Tracker
                </Link>
              </li>
            </ul>
          </Section>

        </div>
      </section>

      {/* Article Schema */}
      <Script
        id="article-schema"
        type="application/ld+json"
        strategy="lazyOnload"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "QIB vs HNI vs Retail Investors – IPO Category Breakdown",
          description:
            "Comprehensive explanation of IPO investor categories and allocation rules.",
          dateModified: new Date().toISOString(),
          author: {
            "@type": "Organization",
            name: "IPOCraft",
          },
        })}
      </Script>

      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="lazyOnload"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is the difference between QIB and Retail investors?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "QIBs are institutional investors with 50% allocation, while retail investors apply up to ₹2 lakh and have 35% allocation.",
              },
            },
            {
              "@type": "Question",
              name: "Is HNI allotment lottery based?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. HNI allotment is proportionate based on the number of shares applied.",
              },
            },
            {
              "@type": "Question",
              name: "What does 20x subscription mean in IPO?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "A 20x subscription means investors have applied for 20 times the shares available in that category of the IPO.",
              },
            },
            {
              "@type": "Question",
              name: "Does higher QIB subscription indicate strong listing?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Higher QIB subscription often reflects institutional confidence, which can support listing sentiment, but it does not guarantee listing gains.",
              },
            },
            {
              "@type": "Question",
              name: "Why is HNI subscription sometimes extremely high?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "HNI subscription can appear very high due to leveraged applications where investors use funding to apply for larger quantities.",
              },
            },
            {
              "@type": "Question",
              name: "Is SME IPO subscription interpreted differently from Mainboard?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. SME IPOs have different allocation structures, higher lot sizes, and lower liquidity, so subscription multiples should be interpreted carefully.",
              },
            },
            {
              "@type": "Question",
              name: "Can retail investors increase allotment chances?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "In oversubscribed IPOs, retail allotment follows a lottery system, so applying multiple times through the same PAN does not increase chances.",
              },
            }
          ],
        })}
      </Script>

      {/* Breadcrumb Schema */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="lazyOnload"
      >
        {JSON.stringify({
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
              name: "QIB vs HNI vs Retail",
              item: investorCategoriesUrl,
            },
          ],
        })}
      </Script>
    </div>
  );
}

function Section({ id, title, children }: any) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2
        className="text-xl sm:text-2xl font-semibold mb-4"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h2>
      <div className="text-[15px] text-[#475569] leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  );
}
