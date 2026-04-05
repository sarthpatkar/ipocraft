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

const ipoSubscriptionUrl = canonicalUrl("/ipo-subscription-meaning");
const logoUrl = canonicalUrl("/logo.png");

export const metadata: Metadata = {
  title: "IPO Subscription Meaning – What Does IPO Subscription Status Mean?",
  description:
    "Understand IPO subscription meaning, oversubscription, undersubscription, category-wise demand, and how IPO subscription impacts allotment and listing.",
  alternates: {
    canonical: ipoSubscriptionUrl,
  },
  openGraph: {
    title: "IPO Subscription Meaning Explained – IPOCraft",
    description:
      "Detailed guide on IPO subscription ratios, oversubscription logic, retail vs HNI vs QIB demand, and listing impact.",
    url: ipoSubscriptionUrl,
    siteName: "IPOCraft",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPO Subscription Meaning – IPOCraft",
    description:
      "Learn what IPO subscription status means and how it affects allotment probability and listing gains.",
  },
};

export default function IpoSubscriptionMeaning() {
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
          IPO Subscription Meaning – Complete Explanation (2026 Guide)
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
          <span>Approx. 12 min read</span>
        </div>

        <p className="mt-6 text-[15px] text-[#475569] leading-relaxed">
          IPO subscription refers to the number of times investors apply for
          shares compared to the total shares offered in an Initial Public
          Offering. It reflects demand levels across Retail, HNI (NII), and QIB
          categories. Investors track IPO subscription status daily to estimate
          allotment probability and potential listing performance.
        </p>

        {/* Jump Navigation */}
        <nav
          aria-label="Jump to Section"
          className="mt-8 bg-white border border-[#e2e8f0] rounded-xl p-5 sticky top-16 z-10"
        >
          <p className="text-sm font-semibold mb-3">Jump to Section</p>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <a href="#meaning" className="text-[#2563eb] hover:underline">
              What IPO Subscription Means
            </a>
            <a href="#oversub" className="text-[#2563eb] hover:underline">
              Oversubscription
            </a>
            <a href="#undersub" className="text-[#2563eb] hover:underline">
              Undersubscription
            </a>
            <a href="#categories" className="text-[#2563eb] hover:underline">
              Category-wise Subscription
            </a>
            <a href="#impact" className="text-[#2563eb] hover:underline">
              Impact on Allotment
            </a>
            <a href="#listing" className="text-[#2563eb] hover:underline">
              Impact on Listing
            </a>
            <a href="#faq" className="text-[#2563eb] hover:underline">
              FAQs
            </a>
          </div>
        </nav>

        <article className="mt-10 space-y-12">
          <Section id="meaning" title="What Does IPO Subscription Mean?">
            <p>
              IPO subscription indicates how many times investors have bid for
              shares relative to the shares available in the IPO. For example,
              if an IPO receives bids for 10 million shares against 1 million
              shares offered, it is said to be subscribed 10 times (10x).
            </p>
            <p>
              This subscription ratio is a critical indicator of investor
              interest and helps gauge the demand strength in the market.
            </p>
            <p>
              IPO subscription data is usually segmented into three main
              categories: Retail Individual Investors (RII), High Net-worth
              Individuals (HNI or NII), and Qualified Institutional Buyers
              (QIBs). Each category has its own allocation quota and demand
              dynamics.
            </p>
          </Section>

          <Section id="oversub" title="What Is IPO Oversubscription?">
            <p>
              Oversubscription occurs when the demand for shares exceeds the
              number of shares offered. For instance, if the retail portion of
              an IPO is subscribed 20 times, it means investors applied for 20
              times the shares allocated to retail investors.
            </p>
            <p>
              Oversubscription is generally seen as a positive signal, indicating
              strong investor confidence and interest in the company going
              public. However, it also means that not all investors will receive
              shares, as allotment is done proportionally or by lottery.
            </p>
            <p>
              Oversubscription ratios can vary widely based on market conditions,
              company reputation, sector interest, and pricing. For example,
              technology IPOs often see higher oversubscription compared to other
              sectors.
            </p>
          </Section>

          <Section id="undersub" title="What Is IPO Undersubscription?">
            <p>
              Undersubscription happens when the demand for shares is lower than
              the number of shares offered. For example, a subscription ratio of
              0.8x means only 80% of the shares were applied for.
            </p>
            <p>
              This may indicate weak investor sentiment, concerns about the
              company’s fundamentals, pricing, or market conditions. Undersubscribed
              IPOs often face challenges in listing gains and may require price
              corrections.
            </p>
            <p>
              Sometimes, undersubscription can be category-specific, where one
              investor class (e.g., retail) is oversubscribed while others (e.g.,
              QIB) are undersubscribed.
            </p>
          </Section>

          <Section id="categories" title="Category-wise IPO Subscription Explained">
            <p>
              IPO shares are divided among three primary investor categories:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Retail Individual Investors (RII):</strong> These are
                individual investors applying for shares up to ₹2 lakh. Retail
                investors usually get a quota of 35% of the total shares.
              </li>
              <li>
                <strong>High Net-worth Individuals (HNI/NII):</strong> Investors
                applying for shares above the retail limit. This category often
                gets around 15% allocation.
              </li>
              <li>
                <strong>Qualified Institutional Buyers (QIB):</strong> Institutional
                investors like mutual funds, insurance companies, and foreign
                institutional investors. QIBs typically get 50% allocation.
              </li>
            </ul>
            <p>
              Each category has separate subscription ratios and demand levels.
              Understanding category-wise subscription helps investors gauge
              where the strongest interest lies and predict allotment chances.
            </p>
          </Section>

          <Section id="impact" title="How IPO Subscription Impacts Allotment">
            <p>
              Allotment is the process of distributing shares among applicants.
              When an IPO is oversubscribed, shares are allocated on a pro-rata
              basis or via lottery, especially in the retail category.
            </p>
            <p>
              For retail investors, oversubscription reduces the probability of
              getting full allotment. For example, if the retail portion is
              subscribed 10x, an investor applying for 100 shares might only
              receive 10 shares.
            </p>
            <p>
              HNI and QIB categories usually follow proportionate allotment,
              where shares are allocated based on the size of the bid.
            </p>
            <p>
              The allotment process is governed by SEBI regulations to ensure
              fairness and transparency.
            </p>
            <p>
              For an in-depth understanding, see our guide on{" "}
              <Link href="/how-ipo-allotment-works" className="text-[#2563eb] underline">
                how IPO allotment works
              </Link>.
            </p>
          </Section>

          <Section id="listing" title="How IPO Subscription Affects Listing Gains">
            <p>
              IPO subscription levels often influence listing day performance.
              A heavily oversubscribed IPO signals strong demand, potentially
              leading to listing gains as investors scramble to buy shares on
              the secondary market.
            </p>
            <p>
              However, listing performance also depends on broader market
              conditions, sector trends, and institutional investor sentiment.
            </p>
            <p>
              Undersubscribed IPOs may face subdued listing prices or even list
              below issue price.
            </p>
            <p>
              Investors should consider subscription data alongside other
              factors such as company fundamentals, valuation, and market
              environment.
            </p>
          </Section>

          <Section id="faq" title="Frequently Asked Questions (FAQs)">
            <dl className="space-y-6">
              <div>
                <dt className="font-semibold text-[#2563eb]">What does 10x IPO subscription mean?</dt>
                <dd className="mt-1 text-[#475569]">
                  It means investors have applied for 10 times more shares than available in the IPO.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#2563eb]">Does high IPO subscription guarantee listing gains?</dt>
                <dd className="mt-1 text-[#475569]">
                  No. High subscription reflects demand but listing depends on market conditions and institutional interest.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#2563eb]">Can IPO subscription vary by category?</dt>
                <dd className="mt-1 text-[#475569]">
                  Yes, subscription ratios often differ across retail, HNI, and QIB categories due to different investor bases and quotas.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#2563eb]">How is IPO allotment decided in oversubscribed IPOs?</dt>
                <dd className="mt-1 text-[#475569]">
                  Retail allotment is usually done by lottery, while HNI and QIB allotments are proportional to bids.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#2563eb]">Where can I check IPO subscription status?</dt>
                <dd className="mt-1 text-[#475569]">
                  IPO subscription status is published daily on stock exchanges' websites and financial portals during the IPO period.
                </dd>
              </div>
            </dl>
          </Section>
        </article>
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
          headline: "IPO Subscription Meaning – Complete Explanation",
          description:
            "Detailed guide explaining IPO subscription ratios, oversubscription, category demand, and listing impact.",
          dateModified: new Date().toISOString(),
          author: {
            "@type": "Organization",
            name: "IPOCraft",
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": ipoSubscriptionUrl,
          },
          publisher: {
            "@type": "Organization",
            name: "IPOCraft",
            logo: {
              "@type": "ImageObject",
              url: logoUrl,
            },
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
              name: "What does 10x IPO subscription mean?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "It means investors have applied for 10 times more shares than available in the IPO.",
              },
            },
            {
              "@type": "Question",
              name: "Does high IPO subscription guarantee listing gains?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. High subscription reflects demand but listing depends on market conditions and institutional interest.",
              },
            },
            {
              "@type": "Question",
              name: "Can IPO subscription vary by category?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, subscription ratios often differ across retail, HNI, and QIB categories due to different investor bases and quotas.",
              },
            },
            {
              "@type": "Question",
              name: "How is IPO allotment decided in oversubscribed IPOs?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Retail allotment is usually done by lottery, while HNI and QIB allotments are proportional to bids.",
              },
            },
            {
              "@type": "Question",
              name: "Where can I check IPO subscription status?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "IPO subscription status is published daily on stock exchanges' websites and financial portals during the IPO period.",
              },
            },
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
              name: "IPO Subscription Meaning",
              item: ipoSubscriptionUrl,
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
