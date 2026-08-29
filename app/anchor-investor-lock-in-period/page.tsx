import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";
import RelatedGuides from "@/components/RelatedGuides";

const pageUrl = canonicalUrl("/anchor-investor-lock-in-period");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "Anchor Investor Lock-in Period in IPO: Rules & Why It Matters | IPOCraft",
  description:
    "Anchor investor lock-in period explained: SEBI’s 30/90-day lock-in rule, why anchor unlock dates often move IPO share prices, and how to track them.",
  alternates: {
    canonical: pageUrl,
    languages: {
      en: pageUrl,
      hi: canonicalUrl("/hi/anchor-investor-lock-in-period"),
      mr: canonicalUrl("/mr/anchor-investor-lock-in-period"),
      "x-default": pageUrl,
    },
  },
};

export default function AnchorLockInPage() {
  return (
    <div
      className="min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-sm uppercase text-blue-600 font-semibold mb-4">IPO Learning Guide</p>

        <h1
          className="text-2xl sm:text-3xl lg:text-[2.5rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Anchor Investor Lock-in Period in IPO: Rules &amp; Why It Matters ({CURRENT_YEAR})
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          Anchor investors — large institutional investors allotted shares a day before an IPO
          opens — are required to hold those shares for a fixed period under SEBI rules before
          they can sell. This <strong>anchor investor lock-in period</strong> is closely watched
          because its expiry can trigger a wave of selling and price volatility in a newly listed
          stock.
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/hi/anchor-investor-lock-in-period" className="text-[#1C317A] dark:text-blue-400 underline">
            हिंदी
          </Link>{" "}
          and{" "}
          <Link href="/mr/anchor-investor-lock-in-period" className="text-[#1C317A] dark:text-blue-400 underline">
            मराठी
          </Link>
          .
        </p>

        <div className="mt-10 space-y-12">
          <Section id="who" title="Who Are Anchor Investors?">
            <p>
              Anchor investors are Qualified Institutional Buyers (QIBs) — mutual funds,
              insurance companies, foreign portfolio investors, and similar large institutions —
              who are allotted a portion of an IPO’s shares one day before the issue opens to the
              public, at a price fixed by the issuer. Their strong participation is often read as
              a vote of institutional confidence and can influence retail sentiment and GMP.
            </p>
          </Section>

          <Section id="rules" title="SEBI’s Anchor Lock-in Rules">
            <p>
              Under current SEBI ICDR rules, anchor investor shares are locked in across two
              tranches from the date of allotment:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>50% of the anchor allocation</strong> — locked in for 90 days</li>
              <li><strong>Remaining 50%</strong> — locked in for 30 days</li>
            </ul>
            <p>
              This means a portion of anchor shares becomes sellable relatively early (around the
              30-day mark), while the rest stays locked for a further two months. SEBI has revised
              these lock-in norms before and may do so again — always cross-check the exact
              tranche split against the specific IPO’s RHP and the latest SEBI circular.
            </p>
          </Section>

          <Section title="Why Lock-in Expiry Dates Matter to Investors">
            <ul className="list-disc pl-6 space-y-2">
              <li>Unlock dates can increase available float and trading volume sharply</li>
              <li>Some anchor investors book profits immediately on unlock, pressuring the price</li>
              <li>Others (especially long-only mutual funds) may hold well beyond the lock-in</li>
              <li>Thinner post-listing liquidity in SME IPOs makes this effect more pronounced</li>
            </ul>
            <p>
              Watching the calendar of anchor lock-in expiries alongside{" "}
              <Link href="/gmp" className="text-[#1C317A] dark:text-blue-400 underline">
                GMP
              </Link>{" "}
              and subscription trends gives a fuller picture of a stock’s near-term supply-demand
              dynamics after listing.
            </p>
          </Section>

          <Section id="faqs" title="Frequently Asked Questions">
            <h3 className="font-semibold mt-4">How long is the anchor investor lock-in period?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              Under current SEBI rules, 50% of anchor shares are locked in for 90 days and the
              remaining 50% for 30 days from the date of allotment.
            </p>

            <h3 className="font-semibold mt-4">Does anchor lock-in expiry always cause a price drop?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              Not always — it depends on whether the anchor investors choose to sell. It does
              increase the sellable float on that date, which can add downward pressure if selling
              does occur.
            </p>

            <h3 className="font-semibold mt-4">Where can I find an IPO’s anchor allocation details?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              Anchor investor allocation lists are disclosed by the exchanges (BSE/NSE) typically
              a day before the IPO opens, and are referenced in the company’s RHP and listing
              disclosures.
            </p>
          </Section>

          <Section id="related-resources" title="Related IPO Learning Resources">
            <RelatedGuides
              exclude="what-is-ipo-gmp"
              only={["what-is-ipo-gmp", "ipo-grey-market-guide", "qib-hni-retail-explained", "ipo-subscription-meaning"]}
            />
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft provides informational content only and is not registered with SEBI. Lock-in
          rules are set and periodically revised by SEBI — always verify the applicable tranche
          split against the specific IPO’s offer document.
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Anchor Investor Lock-in Period in IPO: Rules & Why It Matters",
            description:
              "Explains SEBI’s anchor investor lock-in rules, the 30/90-day tranche split, and why unlock dates affect newly listed stock prices.",
            author: { "@type": "Organization", name: "IPOCraft Research Team" },
            publisher: {
              "@type": "Organization",
              name: "IPOCraft",
              logo: { "@type": "ImageObject", url: "https://ipocraft.com/logo2.png" },
            },
            datePublished: `${CURRENT_YEAR}-01-01`,
            dateModified: new Date().toISOString(),
            mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How long is the anchor investor lock-in period?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Under current SEBI rules, 50% of anchor investor shares are locked in for 90 days and the remaining 50% for 30 days from the date of allotment.",
                },
              },
              {
                "@type": "Question",
                name: "Who are anchor investors in an IPO?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Anchor investors are large Qualified Institutional Buyers allotted IPO shares a day before the issue opens to the public, at a price fixed by the issuer.",
                },
              },
              {
                "@type": "Question",
                name: "Why does anchor lock-in expiry matter for stock price?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "When the lock-in expires, previously restricted shares become sellable, increasing available float. If anchor investors sell, it can add downward pressure on the stock price.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}

function Section({ id, title, children }: any) {
  return (
    <div id={id} className="scroll-mt-40 sm:scroll-mt-44">
      <h2
        className="text-xl sm:text-2xl font-semibold mb-4 text-[#0f172a] dark:text-[#F1F5F9]"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {title}
      </h2>
      <div className="text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}
