import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";
import RelatedGuides from "@/components/RelatedGuides";

const pageUrl = canonicalUrl("/kostak-rate-meaning");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "What is Kostak Rate in IPO? Meaning & How It Differs from GMP | IPOCraft",
  description:
    "Kostak rate meaning explained: what a kostak deal is in the IPO grey market, how it differs from GMP and subject-to-sauda, and the risks involved.",
  alternates: {
    canonical: pageUrl,
    languages: {
      en: pageUrl,
      hi: canonicalUrl("/hi/kostak-rate-meaning"),
      mr: canonicalUrl("/mr/kostak-rate-meaning"),
      "x-default": pageUrl,
    },
  },
};

export default function KostakRatePage() {
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
          What is Kostak Rate in IPO? Meaning &amp; How It Differs from GMP ({CURRENT_YEAR} Guide)
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          <strong>Kostak rate</strong> is a grey market term for the fixed, lump-sum price at
          which an IPO applicant sells their entire application to another buyer, before
          allotment is even known. Unlike{" "}
          <Link href="/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">
            GMP
          </Link>
          , which is a per-share premium paid only if shares are allotted, a kostak deal is paid
          regardless of allotment outcome.
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/hi/kostak-rate-meaning" className="text-[#1C317A] dark:text-blue-400 underline">
            हिंदी
          </Link>{" "}
          and{" "}
          <Link href="/mr/kostak-rate-meaning" className="text-[#1C317A] dark:text-blue-400 underline">
            मराठी
          </Link>
          .
        </p>

        <div className="mt-10 space-y-12">
          <Section id="what-is-kostak" title="What Does Kostak Rate Mean?">
            <p>
              In grey market slang, a “kostak” deal means selling your IPO application form
              itself — your right to whatever gets allotted against it — for a flat amount
              agreed upfront. The buyer pays the seller the kostak rate whether the application
              gets full allotment, partial allotment, or none at all.
            </p>
            <p>
              This is fundamentally different from GMP, which only pays out per share actually
              allotted. Kostak shifts the allotment risk entirely to the buyer.
            </p>
          </Section>

          <Section title="Kostak Rate vs GMP vs Subject-to-Sauda">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>GMP (Grey Market Premium):</strong> A per-share premium, paid only on
                shares actually allotted.
              </li>
              <li>
                <strong>Kostak rate:</strong> A fixed lump sum for the whole application,
                irrespective of allotment.
              </li>
              <li>
                <strong>Subject-to-sauda (STS):</strong> A hybrid — the deal is priced per lot but
                only executes “subject to” a minimum allotment being received; if nothing is
                allotted, the deal is void.
              </li>
            </ul>
            <p>
              All three are informal, unregulated grey market arrangements and none of them are
              recognized or enforceable by any exchange, registrar, or SEBI process.
            </p>
          </Section>

          <Section title="Why Kostak Rates Exist">
            <p>
              Kostak deals let an applicant lock in a guaranteed gain (or avoid a loss) before
              allotment is announced, especially useful when an IPO is heavily oversubscribed and
              the odds of allotment are low. The buyer, in turn, is betting that the expected
              value of the application — combining allotment probability and expected listing
              gain — exceeds the kostak price they’re paying.
            </p>
          </Section>

          <Section id="risks" title="Risks of Kostak Deals">
            <ul className="list-disc pl-6 space-y-2">
              <li>Entirely unregulated — no exchange, escrow, or legal enforcement mechanism</li>
              <li>Counterparty risk: either side can default with no recourse</li>
              <li>Rates are word-of-mouth and can vary widely between brokers/dealers</li>
              <li>Not connected to official subscription or allotment data in any way</li>
            </ul>
            <p>
              IPOCraft does not facilitate, verify, or endorse kostak transactions. This page is
              informational only, explaining a term investors frequently encounter in IPO
              discussions.
            </p>
          </Section>

          <Section id="faqs" title="Frequently Asked Questions">
            <h3 className="font-semibold mt-4">Is kostak rate the same as GMP?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              No. GMP is a per-share premium paid on allotted shares; kostak is a flat amount paid
              for the entire application regardless of allotment.
            </p>

            <h3 className="font-semibold mt-4">Is trading in kostak deals legal?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              Kostak deals are informal grey-market arrangements outside official exchange
              mechanisms. They carry no regulatory recognition or protection.
            </p>

            <h3 className="font-semibold mt-4">Where can I see today’s GMP instead?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              Track official-adjacent, publicly discussed GMP data on the{" "}
              <Link href="/gmp" className="text-[#1C317A] dark:text-blue-400 underline">
                IPO GMP tracker
              </Link>
              .
            </p>
          </Section>

          <Section id="related-resources" title="Related IPO Learning Resources">
            <RelatedGuides
              exclude="what-is-ipo-gmp"
              only={["what-is-ipo-gmp", "ipo-grey-market-guide", "ipo-subscription-meaning", "how-ipo-allotment-works"]}
            />
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft provides informational content only and is not registered with SEBI. Grey
          market terms like kostak rate describe unregulated, informal activity and are explained
          here for educational purposes only — not as investment advice or facilitation.
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "What is Kostak Rate in IPO? Meaning & How It Differs from GMP",
            description:
              "Explains kostak rate, how it differs from GMP and subject-to-sauda deals, and the risks of grey market IPO trading.",
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
                name: "What is kostak rate in an IPO?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Kostak rate is the fixed, lump-sum grey market price at which an IPO applicant sells their entire application to a buyer, paid regardless of whether the application is allotted shares.",
                },
              },
              {
                "@type": "Question",
                name: "Is kostak rate the same as GMP?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. GMP is a per-share premium paid only on allotted shares, while kostak is a flat amount for the whole application irrespective of allotment outcome.",
                },
              },
              {
                "@type": "Question",
                name: "What is subject-to-sauda?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Subject-to-sauda is a grey market deal priced per lot that only executes if a minimum allotment is received; if nothing is allotted, the deal is void.",
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
