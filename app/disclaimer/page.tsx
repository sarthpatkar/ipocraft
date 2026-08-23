import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Outfit } from "next/font/google";
import { canonicalUrl } from "@/lib/site-url";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const disclaimerUrl = canonicalUrl("/disclaimer");

export const metadata: Metadata = {
  title: "Disclaimer — IPOCraft",
  description:
    "Legal disclaimer for IPOCraft. IPOCraft is not registered with SEBI. Information is for educational and research purposes only.",
  alternates: {
    canonical: disclaimerUrl,
  },
};

export default function DisclaimerPage() {
  return (
    <article
      className={`${outfit.variable} ${inter.variable} max-w-3xl mx-auto`}
    >
      <h1
        className="text-3xl sm:text-4xl font-semibold text-[#0f172a] dark:text-white mb-2"
        style={{ fontFamily: "var(--font-outfit), serif" }}
      >
        Disclaimer
      </h1>
      <p className="text-sm text-[#64748b] dark:text-slate-400 mb-8">
        Last updated: July 2026
      </p>

      <div className="space-y-6 text-[15px] text-[#334155] dark:text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <section>
          <h2 className="text-lg font-semibold text-[#0f172a] dark:text-white mb-2">
            1. Not a SEBI-Registered Entity
          </h2>
          <p>
            IPOCraft is not registered with the Securities and Exchange Board of India (SEBI)
            as an investment advisor, research analyst, stockbroker, or in any other capacity
            under any SEBI regulation. IPOCraft operates solely as an independent informational
            platform.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-lg font-semibold text-[#0f172a] dark:text-white mb-2">
            2. Not Financial Advice
          </h2>
          <p>
            All information provided on IPOCraft — including but not limited to IPO data,
            Grey Market Premium (GMP), subscription figures, financial ratios, listing
            performance, and company analysis — is for <strong>educational and research
            purposes only</strong>. Nothing on this platform constitutes financial advice,
            investment recommendation, or solicitation to buy, sell, or hold any securities.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-lg font-semibold text-[#0f172a] dark:text-white mb-2">
            3. Data Sources &amp; Accuracy
          </h2>
          <p>
            Information displayed on IPOCraft is sourced from publicly available documents
            including Red Herring Prospectus (RHP), Draft Red Herring Prospectus (DRHP),
            stock exchange disclosures, and registrar filings. While we strive for accuracy,
            IPOCraft makes <strong>no warranties or representations</strong> regarding the
            accuracy, completeness, timeliness, or reliability of any information provided.
          </p>
          <p className="mt-2">
            Users should independently verify all data with official sources such as{" "}
            <a
              href="https://www.sebi.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1C317A] dark:text-blue-400 hover:underline"
            >
              SEBI
            </a>
            ,{" "}
            <a
              href="https://www.nseindia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1C317A] dark:text-blue-400 hover:underline"
            >
              NSE
            </a>
            , and{" "}
            <a
              href="https://www.bseindia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1C317A] dark:text-blue-400 hover:underline"
            >
              BSE
            </a>{" "}
            before making any investment decisions.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-lg font-semibold text-[#0f172a] dark:text-white mb-2">
            4. Grey Market Premium (GMP) Disclaimer
          </h2>
          <p>
            Grey Market Premium (GMP) is an <strong>unofficial, unregulated market
            indicator</strong> that represents the premium at which IPO shares are traded
            in the unofficial grey market before listing. IPOCraft reports publicly
            available GMP data for informational purposes only. GMP values:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-[#475569] dark:text-slate-400">
            <li>Do not guarantee actual listing price or performance</li>
            <li>Are not verified by any regulatory authority</li>
            <li>Can change rapidly and without notice</li>
            <li>Should not be the basis for any investment decision</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-lg font-semibold text-[#0f172a] dark:text-white mb-2">
            5. No Liability
          </h2>
          <p>
            IPOCraft, its owners, operators, and contributors shall not be liable for any
            loss, damage, or expense arising from the use of or reliance on information
            provided on this platform. This includes but is not limited to direct, indirect,
            incidental, consequential, or punitive damages arising from investment decisions
            made based on information available on IPOCraft.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-lg font-semibold text-[#0f172a] dark:text-white mb-2">
            6. Third-Party Content &amp; Broker Listings
          </h2>
          <p>
            IPOCraft may display broker comparisons and external links for informational
            purposes. Some of these links may be affiliate links. Any such affiliate
            relationships will be clearly disclosed. Broker listings do not imply
            endorsement, recommendation, or partnership. Users should conduct their own
            due diligence before opening accounts with any broker.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-lg font-semibold text-[#0f172a] dark:text-white mb-2">
            7. Privacy &amp; Data Collection
          </h2>
          <p>
            IPOCraft does not maintain user accounts or store personally identifiable
            information on its own servers. Third-party services including Google Analytics
            may collect usage data as described in our Privacy Policy. There is no user registration, login system, or account creation.
            The IPOCraft Android app stores certain data (such as PAN numbers for allotment
            checking) <strong>only on the user&apos;s device</strong> using local storage and
            never transmits this information to any server.
          </p>
          <p className="mt-2">
            For detailed information, please see our{" "}
            <Link href="/privacy" className="text-[#1C317A] dark:text-blue-400 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-lg font-semibold text-[#0f172a] dark:text-white mb-2">
            8. Consult a Financial Advisor
          </h2>
          <p>
            Investing in IPOs involves risk. Past performance does not guarantee future
            results. Users are strongly advised to consult a SEBI-registered financial
            advisor or investment professional before making any investment decisions.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-lg font-semibold text-[#0f172a] dark:text-white mb-2">
            9. Changes to This Disclaimer
          </h2>
          <p>
            IPOCraft reserves the right to modify this disclaimer at any time. Changes
            will be reflected on this page with an updated date. Continued use of the
            platform after changes constitutes acceptance of the updated disclaimer.
          </p>
        </section>

        <hr className="border-[#e2e8f0] dark:border-[#1e293b]" />

        <p className="text-sm text-[#94a3b8] dark:text-slate-500">
          If you have any questions about this disclaimer, please{" "}
          <Link href="/contact" className="text-[#1C317A] dark:text-blue-400 hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
