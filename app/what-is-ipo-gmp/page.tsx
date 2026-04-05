import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Playfair_Display, Inter } from "next/font/google";
import { canonicalUrl } from "@/lib/site-url";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const whatIsIpoGmpUrl = canonicalUrl("/what-is-ipo-gmp");

export const metadata: Metadata = {
  title: "What is IPO GMP? Grey Market Premium Meaning & Calculation | IPOCraft",
  description:
    "Learn what IPO GMP (Grey Market Premium) means, how IPO GMP is calculated, why it changes daily, and how investors estimate listing gains using GMP data.",
  alternates: {
    canonical: whatIsIpoGmpUrl,
  },
};

export default function WhatIsIpoGmpPage() {
  return (
    <div
      className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a]`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-[11px] tracking-[0.22em] uppercase text-[#2563eb] font-semibold mb-4">
          IPO Learning Guide
        </p>

        <h1
          className="text-2xl sm:text-3xl lg:text-[2.5rem] font-semibold leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          What is IPO GMP? Grey Market Premium Meaning, Calculation & Risks (2026 Guide)
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] leading-relaxed">
          IPO GMP stands for <strong>Grey Market Premium</strong>. It refers to the
          premium at which IPO shares are traded unofficially before listing on the
          stock exchange. Investors track IPO GMP to estimate potential listing
          gains, but it is important to understand that the grey market is not
          regulated and operates outside official exchanges.
        </p>

        <p className="mt-4 text-[15px] text-[#475569] leading-relaxed">
          On IPOCraft, investors can monitor{" "}
          <Link href="/gmp" className="text-[#2563eb] underline">
            IPO GMP Today
          </Link>{" "}
          along with subscription data and IPO calendar timelines. However, GMP
          should always be interpreted cautiously and not treated as guaranteed
          listing performance.
        </p>

        {/* Jump Navigation */}
        <div className="mt-8 sticky top-24 z-30 bg-white/95 backdrop-blur border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-[#0f172a] mb-3 uppercase tracking-wide">
            On this page
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            <a href="#what-is-gmp" className="text-[#2563eb] hover:underline">What is IPO GMP</a>
            <a href="#calculation" className="text-[#2563eb] hover:underline">How GMP is Calculated</a>
            <a href="#reliability" className="text-[#2563eb] hover:underline">Is GMP Reliable?</a>
            <a href="#mainboard-vs-sme" className="text-[#2563eb] hover:underline">Mainboard vs SME</a>
            <a href="#strategies" className="text-[#2563eb] hover:underline">Advanced Strategies</a>
            <a href="#faqs" className="text-[#2563eb] hover:underline">FAQs</a>
          </div>
        </div>

        <div className="mt-10 space-y-12">

          <Section id="what-is-gmp" title="What is IPO GMP?">
            <p>
              IPO GMP represents the extra amount investors are willing to pay
              over the IPO issue price in the unofficial grey market. For example,
              if an IPO price band is ₹100–₹110 and the GMP is ₹25, the expected
              listing price may be around ₹135.
            </p>
            <p>
              Grey market transactions happen before listing and are based on
              demand, speculation, and market sentiment. These trades are private
              arrangements between buyers and sellers.
            </p>
          </Section>

          <Section id="calculation" title="How IPO GMP is Calculated">
            <p>
              The estimated listing price is calculated using a simple formula:
            </p>

            <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 text-sm font-medium text-[#0f172a]">
              Estimated Listing Price = Issue Price + GMP
            </div>

            <p className="mt-4">
              Example:
              <br />
              Issue Price: ₹110
              <br />
              GMP: ₹25
              <br />
              Estimated Listing Price ≈ ₹135
            </p>

            <p>
              This formula provides only an indicative estimate and not a
              guaranteed outcome.
            </p>
          </Section>

          <Section title="Why IPO GMP Changes Daily">
            <ul className="list-disc pl-6 space-y-2">
              <li>Market sentiment and overall index movement</li>
              <li>Subscription levels (Retail, HNI, QIB demand)</li>
              <li>Anchor investor participation</li>
              <li>Company fundamentals and sector outlook</li>
              <li>News and macroeconomic factors</li>
            </ul>

            <p>
              High subscription, especially from QIBs or HNIs, may influence GMP
              positively. However, GMP can reverse quickly if broader markets turn
              negative.
            </p>
          </Section>

          <Section title="How Investors Use IPO GMP">
            <p>
              Investors often compare GMP with official subscription data before
              applying. You can track upcoming IPO timelines using the{" "}
              <Link href="/ipo-calendar" className="text-[#2563eb] underline">
                IPO Calendar
              </Link>{" "}
              and analyze IPO details through individual IPO pages.
            </p>

            <p>
              GMP is commonly used to estimate short-term listing gains. Long-term
              investors typically focus more on company fundamentals than grey
              market trends.
            </p>
          </Section>

          <Section id="reliability" title="Is IPO GMP Reliable?">
            <p>
              IPO GMP is unofficial and speculative. It is not regulated by SEBI
              or stock exchanges. While it may indicate sentiment, actual listing
              prices can differ significantly.
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Grey market transactions are private and unregulated</li>
              <li>No official reporting or guarantee exists</li>
              <li>Prices can fluctuate sharply before listing</li>
            </ul>
          </Section>

          <Section title="Difference Between IPO GMP and Subscription Data">
            <p>
              Subscription data reflects official demand from retail investors,
              HNIs, and QIBs. It is released by exchanges during the IPO bidding
              period.
            </p>

            <p>
              GMP, on the other hand, reflects informal market sentiment. A
              combination of both provides better context for understanding demand
              trends.
            </p>
          </Section>

          <Section title="Risks of Grey Market Premium">
            <ul className="list-disc pl-6 space-y-2">
              <li>Unregulated trading environment</li>
              <li>Counterparty risk in private transactions</li>
              <li>Possibility of sudden price correction</li>
              <li>Over-reliance on short-term speculation</li>
            </ul>
          </Section>

          <Section title="Real-World IPO GMP Case Study">
            <p>
              Consider a hypothetical IPO priced at ₹150 with a Grey Market Premium of ₹40 before listing. Market sentiment was strong, subscription crossed 50x, and institutional participation was high.
            </p>
            <p>
              Estimated Listing Price = ₹150 + ₹40 = ₹190
            </p>
            <p>
              On listing day, the stock opened at ₹185 — slightly below the implied GMP price. This illustrates that while GMP reflects sentiment, actual listing price depends on broader market liquidity and final demand during price discovery.
            </p>
          </Section>

          <Section title="Historical GMP vs Actual Listing Comparison">
            <p>
              Historically, IPO GMP has often tracked listing momentum but not with perfect accuracy. In bullish markets, IPOs with strong GMP frequently list near or slightly below GMP-adjusted expectations.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Strong QIB demand tends to validate GMP trends</li>
              <li>Weak secondary market sentiment can compress listing gains</li>
              <li>Overheated GMP may normalize on listing day</li>
            </ul>
            <p>
              Therefore, GMP should be interpreted alongside subscription ratios and sector outlook rather than in isolation.
            </p>
          </Section>

          <Section id="mainboard-vs-sme" title="Difference Between Mainboard and SME IPO GMP">
            <p>
              SME IPOs typically have lower issue sizes and limited liquidity compared to Mainboard IPOs. As a result, SME IPO GMP can be more volatile and sentiment-driven.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SME IPO GMP may fluctuate sharply near listing</li>
              <li>Lot sizes are usually larger in SME IPOs</li>
              <li>Liquidity post-listing may impact price stability</li>
            </ul>
            <p>
              Investors tracking SME IPO GMP should account for lower liquidity and wider spreads compared to Mainboard IPOs.
            </p>
          </Section>

          <Section id="strategies" title="Advanced Interpretation Strategies">
            <ul className="list-disc pl-6 space-y-2">
              <li>Compare GMP trend over multiple days instead of single value</li>
              <li>Cross-check with subscription momentum (Retail vs QIB)</li>
              <li>Monitor anchor investor allocation</li>
              <li>Evaluate broader market direction before listing</li>
            </ul>
            <p>
              Professional investors treat GMP as a sentiment indicator, not a valuation model.
            </p>
          </Section>

          <Section title="Data Source Transparency">
            <p>
              IPOCraft aggregates IPO timelines, subscription updates, and listing information from publicly available exchange filings and registrar disclosures. Grey Market Premium figures reflect unofficial market sentiment and are presented for informational purposes only.
            </p>
            <p>
              Users are encouraged to verify details directly with official stock exchange announcements before making financial decisions.
            </p>
          </Section>

          <Section title="Current IPOs Where GMP Is Being Tracked">
            <p>
              Grey Market Premium becomes meaningful only when observed alongside live IPO data. You can review
              currently active public issues on the <Link href="/ipo" className="text-[#2563eb] underline">IPO listings page</Link>
              and monitor real-time sentiment through the <Link href="/gmp" className="text-[#2563eb] underline">IPO GMP tracker</Link>.
            </p>
            <p>
              Comparing live subscription demand, price band, and grey market movement together
              provides better context than viewing GMP in isolation.
            </p>
          </Section>

          <Section id="faqs" title="Frequently Asked Questions (FAQs)">
            <h3 className="font-semibold mt-4">What does positive GMP indicate?</h3>
            <p className="text-[#475569] mt-1">
              A positive GMP suggests that investors expect the IPO to list above
              the issue price.
            </p>

            <h3 className="font-semibold mt-4">Can IPO GMP be negative?</h3>
            <p className="text-[#475569] mt-1">
              Yes. Negative GMP indicates expected listing below the issue price.
            </p>

            <h3 className="font-semibold mt-4">Is IPO GMP legal?</h3>
            <p className="text-[#475569] mt-1">
              Grey market activity exists informally. It is not part of official
              exchange mechanisms.
            </p>

            <h3 className="font-semibold mt-4">Where can I track live GMP updates?</h3>
            <p className="text-[#475569] mt-1">
              You can track updated values on the{" "}
              <Link href="/gmp" className="text-[#2563eb] underline">
                IPO GMP Tracker
              </Link>.
            </p>
          </Section>

        </div>

        <div className="mt-12 text-xs text-[#64748b] bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg p-4">
          IPOCraft provides informational content only and is not registered
          with SEBI. IPO GMP is unofficial market information and should not be
          considered investment advice. Investors must verify details from
          official exchange filings and consult qualified advisors.
        </div>
      </section>

      <Script
        id="article-schema"
        type="application/ld+json"
        strategy="lazyOnload"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "What is IPO GMP? Grey Market Premium Meaning and Calculation",
          description:
            "Comprehensive guide explaining IPO Grey Market Premium, calculation method, historical comparison, SME differences, and risk considerations.",
          author: {
            "@type": "Organization",
            name: "IPOCraft"
          },
          publisher: {
            "@type": "Organization",
            name: "IPOCraft"
          }
        })}
      </Script>

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
              name: "What is IPO GMP?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "IPO GMP refers to Grey Market Premium, the unofficial premium at which IPO shares trade before listing.",
              },
            },
            {
              "@type": "Question",
              name: "How is IPO GMP calculated?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "Estimated listing price is calculated as Issue Price plus GMP.",
              },
            },
            {
              "@type": "Question",
              name: "Is IPO GMP reliable?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "IPO GMP is speculative and unofficial. It may indicate sentiment but does not guarantee listing gains.",
              },
            },
          ],
        })}
      </Script>
    </div>
  );
}

function Section({ id, title, children }: any) {
  return (
    <div id={id} className="scroll-mt-40 sm:scroll-mt-44">
      <h2
        className="text-xl sm:text-2xl font-semibold mb-4"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h2>
      <div className="text-[15px] text-[#475569] leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}
