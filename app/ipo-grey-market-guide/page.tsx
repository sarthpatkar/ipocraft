import Link from "next/link";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { canonicalUrl } from "@/lib/site-url";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const ipoGreyMarketGuideUrl = canonicalUrl("/ipo-grey-market-guide");

export const metadata: Metadata = {
  title: "IPO Grey Market Guide – Complete GMP Explained (Authority Edition)",
  description:
    "Advanced IPO Grey Market Guide covering GMP calculation, historical listing comparisons, SME vs Mainboard analysis, probability interpretation, risks, and data transparency.",
  alternates: {
    canonical: ipoGreyMarketGuideUrl,
  },
};

export default function IpoGreyMarketGuide() {
  const lastUpdatedISO = new Date().toISOString();
  const lastUpdatedReadable = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is IPO GMP accurate for predicting listing gains?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GMP reflects market sentiment but does not guarantee listing price. It must be analysed alongside subscription data, institutional demand, and broader market conditions."
        }
      },
      {
        "@type": "Question",
        name: "Why are SME IPO GMP movements more volatile?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SME IPOs have smaller issue sizes and lower liquidity, which amplifies sentiment-driven price swings in the grey market."
        }
      },
      {
        "@type": "Question",
        name: "Does high GMP always mean oversubscription?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "High GMP often aligns with strong subscription, but not always. Institutional participation and market environment play a critical role."
        }
      },
      {
        "@type": "Question",
        name: "Is grey market trading legal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Grey market activity operates outside formal exchange systems and is not regulated. Investors should treat GMP only as a sentiment indicator."
        }
      },
      {
        "@type": "Question",
        name: "How should investors use GMP responsibly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GMP should be used as a probabilistic sentiment signal, not as a guaranteed listing predictor. Combine it with subscription strength and risk management principles."
        }
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "IPO Grey Market Guide – Complete Authority Breakdown",
    dateModified: lastUpdatedISO,
    author: {
      "@type": "Organization",
      name: "IPOCraft"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: canonicalUrl("/")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "IPO Grey Market Guide",
        item: ipoGreyMarketGuideUrl
      }
    ]
  };

  return (
    <div
      className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a]`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* HERO */}
      <section className="border-b border-[#e2e8f0] bg-gradient-to-br from-white via-[#f8fafc] to-[#eef2ff]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h1
            className="text-2xl sm:text-3xl lg:text-[2.4rem] font-semibold leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            IPO Grey Market Guide – Complete Authority Breakdown
          </h1>

          <p className="mt-6 text-sm sm:text-[15px] text-[#475569] leading-relaxed">
            The IPO grey market plays a powerful psychological role in shaping investor expectations before listing. This guide explains how Grey Market Premium (GMP) forms, how it correlates with listing performance, historical behaviour patterns, SME differences, and how to interpret probability instead of certainty.
          </p>

          <p className="mt-4 text-xs text-[#64748b]">Last updated: {lastUpdatedReadable}</p>
        </div>
      </section>

      {/* STICKY NAV */}
      <div className="sticky top-24 z-30 bg-white/95 backdrop-blur border-b border-[#e2e8f0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs sm:text-sm flex flex-wrap gap-4">
          <a href="#how-it-works" className="text-[#2563eb] hover:underline">How It Works</a>
          <a href="#case-study" className="text-[#2563eb] hover:underline">Case Study</a>
          <a href="#historical" className="text-[#2563eb] hover:underline">Historical Patterns</a>
          <a href="#correlation" className="text-[#2563eb] hover:underline">Correlation Table</a>
          <a href="#probability" className="text-[#2563eb] hover:underline">Probability Logic</a>
          <a href="#sme" className="text-[#2563eb] hover:underline">SME vs Mainboard</a>
          <a href="#gmp-trend" className="text-[#2563eb] hover:underline">GMP Trend Example</a>
          <a href="#faq" className="text-[#2563eb] hover:underline">FAQs</a>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        <Section id="how-it-works" title="How the IPO Grey Market Works">
          <p>
            The IPO grey market operates informally before a company lists on stock exchanges. Participants agree to trade shares at a premium (or discount) to the issue price. This premium reflects collective expectations about listing demand.
          </p>
          <p>
            GMP is influenced by subscription momentum, institutional participation, anchor investor confidence, sector trends, and overall market conditions. Unlike exchange pricing, grey market pricing is sentiment-driven.
          </p>
          <p>
            It is important to understand that GMP does not represent guaranteed pricing. It represents perceived probability based on demand signals.
          </p>
        </Section>

        <Section id="case-study" title="Realistic IPO Case Study">
          <p>
            Consider an IPO priced at ₹150. Before listing, GMP rises steadily from ₹20 to ₹55 as subscription crosses 100× overall and QIB portion is heavily oversubscribed. On listing day, the stock opens at ₹198 — close to GMP implied expectation.
          </p>
          <p>
            In contrast, another IPO with GMP of ₹60 but weak institutional demand lists at only ₹170. This demonstrates that institutional participation strengthens correlation reliability.
          </p>
        </Section>

        <Section id="historical" title="Historical GMP vs Listing Behaviour">
          <p>
            Historically, IPOs with strong QIB subscription (often above 20×) show closer alignment between GMP and listing price. When subscription is retail-heavy but institutional demand is weak, listing prices can deviate sharply.
          </p>
          <p>
            Market volatility before listing day also impacts outcomes. Sudden index corrections may reduce listing gains despite strong GMP.
          </p>
        </Section>

        <Section id="correlation" title="GMP vs Listing Correlation Table">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-[#e2e8f0] text-sm">
              <thead className="bg-[#f1f5f9]">
                <tr>
                  <th className="p-3 border">Scenario</th>
                  <th className="p-3 border">GMP Trend</th>
                  <th className="p-3 border">Subscription Profile</th>
                  <th className="p-3 border">Listing Alignment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border">Strong Institutional Demand</td>
                  <td className="p-3 border">Rising</td>
                  <td className="p-3 border">QIB 20×+</td>
                  <td className="p-3 border">High Probability Alignment</td>
                </tr>
                <tr>
                  <td className="p-3 border">Retail Driven Only</td>
                  <td className="p-3 border">High but Volatile</td>
                  <td className="p-3 border">Weak QIB</td>
                  <td className="p-3 border">Uncertain</td>
                </tr>
                <tr>
                  <td className="p-3 border">Market Correction</td>
                  <td className="p-3 border">Stable</td>
                  <td className="p-3 border">Strong</td>
                  <td className="p-3 border">May Underperform GMP</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="probability" title="Probability Interpretation Strategy">
          <p>
            GMP should be viewed as a probability signal rather than a fixed forecast. Rising multi-day GMP trend + strong QIB subscription + stable broader market = higher probability of listing alignment.
          </p>
          <p>
            Falling GMP before listing may indicate weakening sentiment. Investors should focus on trend direction rather than a single-day premium value.
          </p>
        </Section>

        <Section id="sme" title="SME vs Mainboard Grey Market Behaviour">
          <p>
            SME IPOs typically have smaller issue sizes and concentrated investor pools. This often leads to sharper GMP spikes and declines. Mainboard IPOs, due to broader participation, show relatively smoother sentiment formation.
          </p>
          <p>
            Because SME liquidity post-listing is lower, price swings can exceed GMP expectations in either direction.
          </p>
        </Section>

        <Section id="gmp-trend" title="GMP Trend Example (Visual Illustration)">
          <p>
            Below is a simplified illustration of how GMP may trend upward during strong subscription momentum.
          </p>

          <div className="mt-6 bg-white border border-[#e2e8f0] rounded-xl p-4 overflow-x-auto">
            <svg viewBox="0 0 400 180" className="w-full max-w-md mx-auto">
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                points="10,150 80,120 150,90 220,70 300,40 380,30"
              />
              <text x="10" y="165" fontSize="10" fill="#64748b">Day 1</text>
              <text x="150" y="165" fontSize="10" fill="#64748b">Mid Subscription</text>
              <text x="320" y="165" fontSize="10" fill="#64748b">Pre Listing</text>
            </svg>
          </div>

          <p className="mt-4">
            Rising multi-day GMP trends often align with increasing demand visibility. However, sudden reversals may signal sentiment shifts.
          </p>
        </Section>

        <Section id="faq" title="Frequently Asked Questions">
          <div className="space-y-4">
            {[
              {
                q: "Is IPO GMP reliable for listing gain prediction?",
                a: "GMP reflects sentiment but does not guarantee listing performance. It should be combined with subscription strength and market conditions."
              },
              {
                q: "Why do SME IPOs show higher GMP swings?",
                a: "SME IPOs have lower liquidity and smaller issue sizes, which amplifies sentiment-driven movements."
              },
              {
                q: "Should investors rely only on GMP?",
                a: "No. GMP is a probability indicator, not a certainty signal. Institutional subscription and broader market stability are critical."
              }
            ].map((item, index) => (
              <details
                key={index}
                className="bg-white border border-[#e2e8f0] rounded-lg p-4 group"
              >
                <summary className="cursor-pointer font-medium text-[#0f172a]">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm text-[#475569] leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Section>

        <Section title="Explore More">
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li><Link href="/gmp" className="text-[#2563eb] hover:underline">IPO GMP Tracker</Link></li>
            <li><Link href="/ipo-calendar" className="text-[#2563eb] hover:underline">IPO Calendar</Link></li>
            <li><Link href="/how-ipo-allotment-works" className="text-[#2563eb] hover:underline">IPO Allotment Guide</Link></li>
          </ul>
        </Section>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-xs text-[#64748b] bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg p-4">
          IPOCraft is an informational platform and not registered with SEBI. Content is for educational purposes only and does not constitute investment advice.
        </div>
      </section>
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
      <div className="space-y-4 text-sm sm:text-[15px] text-[#475569] leading-relaxed">
        {children}
      </div>
    </div>
  );
}
