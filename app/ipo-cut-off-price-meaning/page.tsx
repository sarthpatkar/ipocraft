import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";
import RelatedGuides from "@/components/RelatedGuides";

const pageUrl = canonicalUrl("/ipo-cut-off-price-meaning");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "IPO Cut-off Price Meaning: What It Is & Who Can Use It | IPOCraft",
  description:
    "IPO cut-off price explained: what bidding ’at cut-off’ means, who is eligible (Retail investors only), how refunds work if the final price is lower, and when to use it.",
  alternates: {
    canonical: pageUrl,
    languages: {
      en: pageUrl,
      hi: canonicalUrl("/hi/ipo-cut-off-price-meaning"),
      mr: canonicalUrl("/mr/ipo-cut-off-price-meaning"),
      "x-default": pageUrl,
    },
  },
};

export default function CutOffPricePage() {
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
          IPO Cut-off Price Meaning: What It Is &amp; Who Can Use It ({CURRENT_YEAR} Guide)
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          The <strong>cut-off price option</strong> lets an investor bid at whatever the final
          IPO price turns out to be, instead of picking a specific price within the band. It’s
          available only to Retail Individual Investors (RIIs) and is the simplest way to avoid
          your bid being rejected for pricing too low.
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/hi/ipo-cut-off-price-meaning" className="text-[#1C317A] dark:text-blue-400 underline">
            हिंदी
          </Link>{" "}
          and{" "}
          <Link href="/mr/ipo-cut-off-price-meaning" className="text-[#1C317A] dark:text-blue-400 underline">
            मराठी
          </Link>
          .
        </p>

        <div className="mt-10 space-y-12">
          <Section id="what-is-cutoff" title="What Does 'Bidding at Cut-off' Mean?">
            <p>
              Every IPO has a price band — for example ₹100 to ₹110. Instead of choosing a price
              inside that band, an investor can select “Cut-off Price,” which is an instruction to
              buy at whatever final price the company determines through book building — even if
              that turns out to be the upper end of the band, ₹110.
            </p>
          </Section>

          <Section title="Who Can Use the Cut-off Option?">
            <p>
              Only <strong>Retail Individual Investors</strong> (applications up to ₹2 lakh) can
              bid at cut-off price. QIBs and NII/HNI investors are required to bid a specific
              price within the band and cannot use the cut-off option — see our{" "}
              <Link
                href="/qib-hni-retail-explained"
                className="text-[#1C317A] dark:text-blue-400 underline"
              >
                QIB vs HNI vs Retail guide
              </Link>{" "}
              for the full category breakdown.
            </p>
          </Section>

          <Section title="How Money Blocking and Refunds Work">
            <p>
              When you bid at cut-off, the amount blocked in your bank account (via ASBA) is
              calculated at the <strong>upper end</strong> of the price band — the worst case. If
              the final issue price is set lower than the band’s top, the difference is
              unblocked/refunded automatically after allotment.
            </p>
            <p>
              Example: Price band ₹100–₹110, lot size 100 shares. Bidding at cut-off blocks
              ₹11,000. If the final price is fixed at ₹105, only ₹10,500 is actually debited and
              ₹500 is released back.
            </p>
          </Section>

          <Section title="Why Investors Choose Cut-off Price">
            <ul className="list-disc pl-6 space-y-2">
              <li>Removes the risk of your bid being rejected for pricing below the final cut-off</li>
              <li>Simplifies the application — no need to guess where demand will settle</li>
              <li>Commonly recommended for retail applicants applying purely for listing gains</li>
            </ul>
            <p>
              The trade-off is minor: your funds are blocked at the higher end of the band until
              allotment, even if the final price is lower.
            </p>
          </Section>

          <Section id="faqs" title="Frequently Asked Questions">
            <h3 className="font-semibold mt-4">Can HNI or QIB investors bid at cut-off price?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              No. The cut-off option is reserved exclusively for Retail Individual Investors.
            </p>

            <h3 className="font-semibold mt-4">
              What happens if the final price is lower than the band’s top?
            </h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              The extra blocked amount is automatically refunded or unblocked once the final issue
              price and allotment are confirmed.
            </p>

            <h3 className="font-semibold mt-4">
              Is bidding at cut-off the same as bidding at the highest price in the band?
            </h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              Functionally similar for fund-blocking purposes, but “cut-off” specifically means
              “whatever price is finally decided,” whereas manually selecting the top price is a
              fixed bid at that exact number.
            </p>
          </Section>

          <Section id="related-resources" title="Related IPO Learning Resources">
            <RelatedGuides
              exclude="what-is-ipo-gmp"
              only={["qib-hni-retail-explained", "how-ipo-allotment-works", "ipo-allotment-probability-calculator", "ipo-profit-calculator"]}
            />
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft provides informational content only and is not registered with SEBI. Refer to
          the official RHP and your broker’s application interface for exact bidding mechanics.
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "IPO Cut-off Price Meaning: What It Is & Who Can Use It",
            description:
              "Explains the IPO cut-off price option, retail-only eligibility, and how refunds work when the final price is lower than the band’s top.",
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
                name: "What does IPO cut-off price mean?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Cut-off price is a bidding option that instructs the exchange to allot shares at whatever final price is decided through book building, instead of a specific price chosen by the investor.",
                },
              },
              {
                "@type": "Question",
                name: "Who can bid at cut-off price in an IPO?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Only Retail Individual Investors (applications up to ₹2 lakh) can use the cut-off price option. QIB and NII/HNI investors must bid a specific price.",
                },
              },
              {
                "@type": "Question",
                name: "Do I get a refund if I bid at cut-off and the final price is lower?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. The amount blocked at the top of the price band is adjusted, and any excess is refunded or unblocked once the final issue price is confirmed.",
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
