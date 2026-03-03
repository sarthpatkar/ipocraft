import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Playfair_Display, Inter } from "next/font/google";

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

export const metadata: Metadata = {
  title:
    "How IPO Allotment Works? Complete Process Explained (Retail, HNI, QIB) | IPOCraft",
  description:
    "Understand how IPO allotment works in India, including retail quota, HNI allocation, oversubscription rules, lottery system, and refund process.",
  alternates: {
    canonical: "/how-ipo-allotment-works",
  },
  openGraph: {
    title: "How IPO Allotment Works in India – Complete Guide",
    description: "Detailed explanation of IPO allotment rules, lottery system, oversubscription logic, and allocation process.",
    url: "/how-ipo-allotment-works",
    siteName: "IPOCraft",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How IPO Allotment Works – IPOCraft",
    description: "Retail, HNI & QIB allotment explained with examples and probability logic.",
  },
};

export default function IpoAllotmentGuide() {
  return (
    <div
      className={`${playfair.variable} ${inter.variable} min-h-screen scroll-smooth bg-[#f8fafc] text-[#0f172a]`}
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
          How IPO Allotment Works in India – Complete Process Explained (2026)
        </h1>

        <div className="mt-3 text-xs text-[#64748b] flex flex-wrap gap-3">
          <span>Last Updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span>•</span>
          <span>Approx. 8–10 min read</span>
        </div>

        <p className="mt-6 text-[15px] text-[#475569] leading-relaxed">
          IPO allotment is the process through which shares are distributed to
          investors after the IPO bidding period closes. When demand exceeds
          supply (oversubscription), allotment follows structured rules defined
          by stock exchanges and SEBI regulations.
        </p>

        <p className="mt-4 text-[15px] text-[#475569] leading-relaxed">
          Investors tracking IPO demand through subscription ratios and{" "}
          <Link href="/gmp" className="text-[#2563eb] underline">
            IPO GMP
          </Link>{" "}
          often want to understand how shares are actually allocated. This guide
          explains the complete allotment mechanism for Retail, HNI, and QIB
          categories.
        </p>

        {/* Jump Navigation */}
        <div className="mt-8 sticky top-24 z-30 bg-white/95 backdrop-blur border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
          <p className="text-sm font-semibold mb-3">Jump to Section</p>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <a href="#timeline" className="text-[#2563eb] hover:underline">IPO Timeline</a>
            <a href="#retail" className="text-[#2563eb] hover:underline">Retail Allotment</a>
            <a href="#hni" className="text-[#2563eb] hover:underline">HNI Allotment</a>
            <a href="#qib" className="text-[#2563eb] hover:underline">QIB Allotment</a>
            <a href="#probability" className="text-[#2563eb] hover:underline">Probability Example</a>
            <a href="#comparison" className="text-[#2563eb] hover:underline">Allotment vs GMP vs Listing</a>
          </div>
        </div>

        <div className="mt-10 space-y-12">

          <div id="timeline"><Section title="IPO Allotment Timeline">
            <ul className="list-disc pl-6 space-y-2">
              <li>IPO Opens for subscription</li>
              <li>IPO Closes after bidding period</li>
              <li>Basis of Allotment finalised</li>
              <li>Shares credited to Demat accounts</li>
              <li>Refunds initiated for non-allottees</li>
              <li>Listing on stock exchange</li>
            </ul>
            <p>
              You can track upcoming IPO timelines via the{" "}
              <Link href="/ipo-calendar" className="text-[#2563eb] underline">
                IPO Calendar
              </Link>.
            </p>
          </Section></div>

          <Section title="IPO Allotment Categories">
            <p>
              IPO shares are divided into structured categories:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Retail Individual Investors (RII)</li>
              <li>High Net-worth Individuals (HNI / NII)</li>
              <li>Qualified Institutional Buyers (QIB)</li>
              <li>Anchor Investors (in certain IPOs)</li>
            </ul>
          </Section>

          <div id="retail"><Section title="How Retail IPO Allotment Works">
            <p>
              In the retail category, allotment is often done through a lottery
              system when the IPO is oversubscribed. The goal is to ensure
              equitable distribution among individual investors.
            </p>
            <p>
              If an IPO is subscribed 10x in retail, only a fraction of
              applicants will receive one lot. Preference is typically given to
              ensuring maximum investors receive at least one lot.
            </p>
          </Section></div>

          <div id="hni"><Section title="How HNI (NII) Allotment Works">
            <p>
              HNI allotment is proportional rather than lottery-based. Shares
              are allocated in proportion to the number of shares applied for.
            </p>
            <p>
              If HNI subscription is 5x, applicants may receive approximately
              1/5th of their requested quantity.
            </p>
          </Section></div>

          <div id="qib"><Section title="How QIB Allotment Works">
            <p>
              QIB allotment is entirely proportionate. Institutional investors
              receive allocations based on their application size relative to
              total institutional demand.
            </p>
          </Section></div>

          <Section title="What is Basis of Allotment?">
            <p>
              Basis of Allotment is the final allocation document approved by
              the stock exchange. It defines how shares were distributed across
              categories.
            </p>
          </Section>

          <Section title="Refund Process in IPO">
            <p>
              If shares are not allotted, blocked funds in ASBA are released
              back to the investor’s bank account. Refunds typically happen
              before listing.
            </p>
          </Section>

          <Section title="Common IPO Allotment Scenarios">
            <ul className="list-disc pl-6 space-y-2">
              <li>Undersubscribed IPO – full allotment</li>
              <li>Moderately oversubscribed – partial allotment</li>
              <li>Highly oversubscribed – lottery (retail)</li>
            </ul>
          </Section>

          <Section title="Advanced Insights: Probability in Oversubscribed IPOs">
            <p>
              Retail allotment probability can be estimated by dividing total
              retail lots available by total retail applications. However, the
              actual allocation depends on valid bids and category rules.
            </p>
          </Section>

          <Section title="IPO Allotment Probability Calculation Logic">
            <p>
              You can estimate retail allotment probability using a simple formula:
            </p>

            <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 text-sm font-medium">
              Probability (%) = (Retail Lots Available ÷ Retail Applications) × 100
            </div>

            <p>
              Example:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Retail Lots: 15,000</li>
              <li>Applications: 1,50,000</li>
              <li>Probability ≈ 10%</li>
            </ul>

            <p>
              This estimation assumes uniform lot distribution and valid applications.
              Actual allotment may vary depending on category adjustments.
            </p>
          </Section>

          <Section title="SME IPO Allotment Differences">
            <p>
              SME IPOs often have larger lot sizes and lower liquidity.
              Allotment may still follow structured distribution but can be
              impacted by smaller investor pools.
            </p>
          </Section>

          {/* --- INSERTED AUTHORITY SECTIONS BELOW --- */}
          <div id="probability"><Section title="Detailed Retail Lottery Example (With Math)">
            <p>
              Suppose an IPO has 10,00,000 shares reserved for retail investors,
              and the lot size is 50 shares. This means 20,000 retail lots are available.
            </p>
            <p>
              If 2,00,000 valid retail applications are received, the IPO is
              oversubscribed 10x in the retail category.
            </p>
            <p>
              Since only 20,000 lots are available but 2,00,000 applicants applied,
              the probability of receiving one lot becomes approximately:
            </p>
            <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 text-sm font-medium text-[#0f172a]">
              Probability ≈ 20,000 ÷ 2,00,000 = 10%
            </div>
            <p>
              In such cases, allotment is conducted through a computerized lottery
              system approved by the stock exchange.
            </p>
          </Section></div>
          <div id="comparison">
          <Section title="Allotment vs GMP vs Listing – What’s the Difference?">
            <p>
              IPO allotment, Grey Market Premium (GMP), and listing gains are
              often confused but represent different stages of an IPO lifecycle.
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Allotment:</strong> Distribution of shares after IPO closes.</li>
              <li><strong>GMP:</strong> Unofficial premium indicating perceived demand before listing.</li>
              <li><strong>Listing:</strong> First day of trading on stock exchange.</li>
            </ul>

            <p>
              GMP reflects sentiment, allotment reflects allocation rules, and
              listing reflects real market pricing based on supply-demand.
            </p>
          </Section>
          </div>

          <Section title="Real Oversubscription Case Scenario">
            <p>
              In many popular IPOs, retail subscription can exceed 30x or even 50x.
              In such scenarios, only a small percentage of applicants receive
              one minimum lot.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Retail category uses lottery-based allocation</li>
              <li>HNI category follows proportionate allocation</li>
              <li>QIB category uses full proportionate distribution</li>
            </ul>
            <p>
              Highly oversubscribed IPOs significantly reduce retail allotment
              probability despite strong market sentiment.
            </p>
          </Section>

          <Section title="Step-by-Step ASBA Process Explained">
            <p>
              ASBA (Application Supported by Blocked Amount) is the mechanism
              used for IPO applications in India.
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Investor applies for IPO through bank or broker.</li>
              <li>Application amount is blocked in bank account.</li>
              <li>If shares are allotted, amount is debited.</li>
              <li>If not allotted, blocked amount is released.</li>
            </ol>
            <p>
              This system ensures investor funds remain secure until final
              allotment confirmation.
            </p>
          </Section>

          <Section title="How to Check IPO Allotment Status">
            <p>
              Investors can check allotment status through the official registrar
              website or stock exchange portals after the allotment date.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Visit registrar website</li>
              <li>Select IPO name</li>
              <li>Enter PAN / Application number</li>
              <li>View allotment result</li>
            </ul>
            <p>
              You can also monitor IPO timelines via the{" "}
              <Link href="/ipo-calendar" className="text-[#2563eb] underline">
                IPO Calendar
              </Link>.
            </p>
          </Section>
          {/* --- END INSERTED AUTHORITY SECTIONS --- */}

          <Section title="Frequently Asked Questions (FAQs)">
            <h3 className="font-semibold mt-4">How is IPO allotment decided?</h3>
            <p className="text-[#475569] mt-1">
              Allotment is determined based on category subscription and
              exchange-approved allocation rules.
            </p>

            <h3 className="font-semibold mt-4">Is IPO allotment random?</h3>
            <p className="text-[#475569] mt-1">
              In retail oversubscription cases, allotment may be through a
              computerized lottery system.
            </p>

            <h3 className="font-semibold mt-4">When is IPO allotment date?</h3>
            <p className="text-[#475569] mt-1">
              Typically 2–3 working days after IPO closure.
            </p>
          </Section>

        </div>

        <div className="mt-12 text-xs text-[#64748b] bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg p-4">
          IPOCraft provides informational content only and is not registered
          with SEBI. This guide is for educational and research purposes and
          does not constitute investment advice.
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
          headline: "How IPO Allotment Works in India",
          description:
            "Comprehensive explanation of IPO allotment process for Retail, HNI, and QIB investors.",
          dateModified: new Date().toISOString(),
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
              name: "How is IPO allotment decided?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "IPO allotment is determined based on subscription levels within each category and stock exchange approved allocation rules."
              }
            },
            {
              "@type": "Question",
              name: "Is IPO allotment random for retail investors?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "In oversubscribed IPOs, retail allotment is conducted through a computerized lottery system to ensure fair distribution."
              }
            },
            {
              "@type": "Question",
              name: "How can I check IPO allotment status?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "IPO allotment status can be checked on the official registrar website using PAN or application number after the allotment date."
              }
            }
          ]
        })}
      </Script>
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
              item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ipocraft.com"}/`
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "IPO Learning Guides",
              item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ipocraft.com"}`
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "How IPO Allotment Works",
              item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ipocraft.com"}/how-ipo-allotment-works`
            }
          ]
        })}
      </Script>
      <Script
        id="toc-schema"
        type="application/ld+json"
        strategy="lazyOnload"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "IPO Timeline" },
            { "@type": "ListItem", position: 2, name: "Retail Allotment" },
            { "@type": "ListItem", position: 3, name: "HNI Allotment" },
            { "@type": "ListItem", position: 4, name: "QIB Allotment" },
            { "@type": "ListItem", position: 5, name: "Probability Example" },
            { "@type": "ListItem", position: 6, name: "Allotment vs GMP vs Listing" }
          ]
        })}
      </Script>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="scroll-mt-24">
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