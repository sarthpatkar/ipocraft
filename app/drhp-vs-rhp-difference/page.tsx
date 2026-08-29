import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";
import RelatedGuides from "@/components/RelatedGuides";

const pageUrl = canonicalUrl("/drhp-vs-rhp-difference");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "DRHP vs RHP: Difference Explained (Full Forms & Meaning) | IPOCraft",
  description:
    "DRHP full form is Draft Red Herring Prospectus, RHP full form is Red Herring Prospectus. Learn the difference between DRHP and RHP, what each contains, and when they’re filed.",
  alternates: {
    canonical: pageUrl,
    languages: {
      en: pageUrl,
      hi: canonicalUrl("/hi/drhp-vs-rhp-difference"),
      mr: canonicalUrl("/mr/drhp-vs-rhp-difference"),
      "x-default": pageUrl,
    },
  },
};

export default function DrhpVsRhpPage() {
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
          DRHP vs RHP: Full Forms, Meaning &amp; Difference Explained ({CURRENT_YEAR} Guide)
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          <strong>DRHP full form</strong> is Draft Red Herring Prospectus, and{" "}
          <strong>RHP full form</strong> is Red Herring Prospectus. Both are IPO offer documents
          filed with SEBI and the stock exchanges, but at different stages — and with one crucial
          difference: only the RHP contains the final price band.
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/hi/drhp-vs-rhp-difference" className="text-[#1C317A] dark:text-blue-400 underline">
            हिंदी
          </Link>{" "}
          and{" "}
          <Link href="/mr/drhp-vs-rhp-difference" className="text-[#1C317A] dark:text-blue-400 underline">
            मराठी
          </Link>
          .
        </p>

        <div className="mt-10 space-y-12">
          <Section id="drhp" title="What is DRHP?">
            <p>
              A Draft Red Herring Prospectus (DRHP) is the first offer document a company files
              with SEBI when planning an IPO. It discloses the company’s business, financials,
              risk factors, promoters, and objects of the issue — but does <strong>not</strong>{" "}
              include the final price band or exact number of shares on offer. SEBI and the
              public get roughly 21 days to review and comment on a filed DRHP before the company
              proceeds.
            </p>
          </Section>

          <Section id="rhp" title="What is RHP?">
            <p>
              The Red Herring Prospectus (RHP) is filed just before the IPO opens for bidding. It
              is the updated, near-final version of the DRHP that now includes the price band,
              lot size, issue size, and any changes made in response to SEBI’s observations. The
              RHP (or an even later “final prospectus” with the exact issue price after book
              building) is the document investors are legally bidding against.
            </p>
          </Section>

          <Section title="DRHP vs RHP: Key Differences">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-[#e2e8f0] dark:border-[#252A31] rounded-lg overflow-hidden">
                <thead className="bg-[#f1f5f9] dark:bg-[#171B20] text-left">
                  <tr>
                    <th className="p-3 font-semibold">Aspect</th>
                    <th className="p-3 font-semibold">DRHP</th>
                    <th className="p-3 font-semibold">RHP</th>
                  </tr>
                </thead>
                <tbody className="[&>tr]:border-t [&>tr]:border-[#e2e8f0] dark:[&>tr]:border-[#252A31]">
                  <tr>
                    <td className="p-3">When filed</td>
                    <td className="p-3">Before the IPO roadshow, for SEBI/public review</td>
                    <td className="p-3">Just before the IPO opens for bidding</td>
                  </tr>
                  <tr>
                    <td className="p-3">Price band</td>
                    <td className="p-3">Not included</td>
                    <td className="p-3">Included</td>
                  </tr>
                  <tr>
                    <td className="p-3">Issue size / lot size</td>
                    <td className="p-3">Indicative only</td>
                    <td className="p-3">Finalized</td>
                  </tr>
                  <tr>
                    <td className="p-3">Purpose</td>
                    <td className="p-3">Regulatory &amp; public comment</td>
                    <td className="p-3">Investor bidding reference</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Why This Matters to Investors">
            <p>
              Reading the RHP (not just the DRHP) before applying matters because it’s the only
              document with the actual price you’ll be paying. IPOCraft’s{" "}
              <Link href="/drhp-analyzer" className="text-[#1C317A] dark:text-blue-400 underline">
                DRHP Analyzer
              </Link>{" "}
              summarizes the key highlights and risk factors from these offer documents so you
              don’t have to read hundreds of pages manually.
            </p>
          </Section>

          <Section id="faqs" title="Frequently Asked Questions">
            <h3 className="font-semibold mt-4">What is the full form of DRHP and RHP?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              DRHP stands for Draft Red Herring Prospectus. RHP stands for Red Herring Prospectus.
            </p>

            <h3 className="font-semibold mt-4">Does DRHP have the IPO price?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              No. The price band is only finalized and disclosed in the RHP, filed closer to the
              IPO’s opening date.
            </p>

            <h3 className="font-semibold mt-4">Can DRHP details change before the RHP is filed?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              Yes. SEBI’s observations, market conditions, or updated financials can all lead to
              changes between the DRHP and the final RHP.
            </p>
          </Section>

          <Section id="related-resources" title="Related IPO Learning Resources">
            <RelatedGuides
              exclude="what-is-ipo-gmp"
              only={["what-is-ipo-gmp", "ipo-subscription-meaning", "qib-hni-retail-explained", "how-ipo-allotment-works"]}
            />
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft provides informational content only and is not registered with SEBI. Always
          refer to the official DRHP/RHP filed on SEBI, BSE, or NSE websites before making
          investment decisions.
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "DRHP vs RHP: Full Forms, Meaning & Difference Explained",
            description:
              "Explains the difference between DRHP (Draft Red Herring Prospectus) and RHP (Red Herring Prospectus), what each contains, and when they’re filed.",
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
                name: "What is the full form of DRHP and RHP?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "DRHP stands for Draft Red Herring Prospectus. RHP stands for Red Herring Prospectus.",
                },
              },
              {
                "@type": "Question",
                name: "Does DRHP have the IPO price?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. The price band is only finalized and disclosed in the RHP, filed closer to the IPO’s opening date.",
                },
              },
              {
                "@type": "Question",
                name: "What is the difference between DRHP and RHP?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "DRHP is a draft filed for SEBI and public review before the roadshow, with no price band. RHP is the updated, near-final document filed just before bidding opens, with the price band and issue size finalized.",
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
