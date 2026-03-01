import { Playfair_Display, Inter } from "next/font/google";

export const metadata = {
  title: "Terms & Conditions | IPOCraft",
  description:
    "Terms and conditions for using IPOCraft — an informational IPO data platform covering IPO timelines, GMP insights, subscription data, and public issue research in India.",
  keywords: [
    "IPOCraft terms",
    "IPO website terms India",
    "IPO GMP disclaimer",
    "financial data disclaimer India",
    "IPO information platform terms",
    "IPO data platform India",
  ],
};

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export default function TermsPage() {
  return (
    <main
      className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a]`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#e2e8f0] bg-gradient-to-br from-white via-[#f8fafc] to-[#eef2ff]">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-200 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#2563eb] mb-3">
            Legal & Platform Terms
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.4rem] font-semibold leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Terms & Conditions — IPOCraft
          </h1>

          <p className="mt-4 max-w-2xl text-sm sm:text-[15px] text-[#475569] leading-relaxed">
            These terms govern the use of IPOCraft, an informational platform
            providing IPO‑related data including Grey Market Premium (GMP)
            trends, subscription statistics, IPO timelines, and public issue
            insights sourced from publicly available information.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mt-6 text-xs">
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              Public Data Sources
            </span>
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              Transparency First
            </span>
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              Informational Platform
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 space-y-8">
        <p className="text-[#475569] leading-relaxed text-sm sm:text-base">
          By accessing and using IPOCraft ("we", "our", "platform"), you agree
          to comply with and be bound by the following terms and conditions. If
          you do not agree with any part of these terms, you should discontinue
          use of the website.
        </p>

        <Section
          title="1. Informational Purpose Only"
          text="All content provided on IPOCraft is strictly for informational purposes only. Nothing on this platform constitutes financial advice, investment recommendation, or solicitation to invest in securities."
        />

        <Section
          title="2. Not a SEBI Registered Entity"
          text="IPOCraft is not registered with the Securities and Exchange Board of India (SEBI) as an investment advisor, research analyst, or broker. Users should conduct their own research or consult a qualified professional before making investment decisions."
        />

        <Section
          title="3. Accuracy of Information"
          text="We strive to provide accurate and timely information sourced from public filings, exchange data, and other publicly available information. However, we do not guarantee completeness, reliability, or accuracy."
        />

        <div className="space-y-3">
          <h2
            className="font-semibold text-lg"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Grey Market Premium Disclaimer
          </h2>
          <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
            Grey Market Premium (GMP) data displayed on IPOCraft represents
            informal market sentiment gathered from publicly discussed sources
            and should not be interpreted as an indicator of listing performance
            or investment outcome.
          </p>
        </div>

        <Section
          title="4. Limitation of Liability"
          text="IPOCraft shall not be liable for any direct, indirect, incidental, or consequential losses arising from the use of information presented on this website."
        />

        <Section
          title="5. Third‑Party Links"
          text="Our platform may contain links to third‑party websites including broker platforms or registrar sites. We are not responsible for the content, accuracy, or policies of those websites."
        />

        <Section
          title="6. Affiliate Disclosure"
          text="IPOCraft may participate in affiliate programs with brokerage platforms and may earn commissions through referral links. This does not influence how information is presented on the platform."
        />

        <Section
          title="7. Intellectual Property"
          text="All branding, logos, content, and platform design belong to IPOCraft unless otherwise stated. Unauthorized reproduction or redistribution is prohibited."
        />

        <Section
          title="8. Modifications"
          text="We reserve the right to modify these terms at any time without prior notice. Continued use of the website constitutes acceptance of the updated terms."
        />

        {/* Compliance section for SEO + GEO */}
        <div className="space-y-3">
          <h2
            className="font-semibold text-lg"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Compliance & Data Transparency
          </h2>
          <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
            IPOCraft aims to follow applicable data protection principles
            including transparency, minimal data collection, and responsible use
            of publicly available financial information. We do not sell personal
            user data to third parties.
          </p>
        </div>

        {/* Disclaimer box */}
        <div className="bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg p-4 text-xs text-[#64748b] leading-relaxed">
          IPOCraft is an informational platform and is not registered with SEBI
          or any financial regulatory authority. This content does not
          constitute investment advice, recommendations, or solicitation. Users
          must conduct independent research and verify details with official
          sources before making financial decisions.
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <h2
            className="font-semibold text-lg"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Contact
          </h2>
          <p className="text-[#475569] text-sm sm:text-base">
            For legal or policy related questions regarding these terms:
          </p>
          <p className="font-medium">support@ipocraft.in</p>
        </div>

        <p className="text-xs sm:text-sm text-[#64748b] pt-6 border-t">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </section>
    </main>
  );
}

function Section({ title, text }) {
  return (
    <section className="space-y-3">
      <h2
        className="font-semibold text-lg"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h2>
      <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
        {text}
      </p>
    </section>
  );
}