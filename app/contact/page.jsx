import { Playfair_Display, Inter } from "next/font/google";

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

export const metadata = {
  title: "Contact IPOCraft | Platform Support & Business Communication",
  description:
    "Contact IPOCraft for platform issues, data corrections, partnerships, or business communication. IPO GMP and IPO data platform in India.",
  keywords: [
    "IPOCraft contact",
    "IPO GMP support",
    "IPO data India",
    "SME IPO information",
    "IPO platform contact",
  ],
  openGraph: {
    title: "Contact IPOCraft",
    description:
      "Reach IPOCraft for platform support, corrections, partnerships, or business communication.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main
      className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a]`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#e2e8f0] bg-gradient-to-br from-white via-[#f8fafc] to-[#eef2ff]">
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-200 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-14 lg:py-16">
          <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-[#2563eb] mb-3">
            Get in Touch
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.4rem] font-semibold leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Contact IPOCraft
          </h1>

          <p className="mt-4 text-sm sm:text-[15px] text-[#475569] max-w-2xl leading-relaxed">
            For platform‑related matters such as technical issues, data corrections,
            partnerships, or business communication, please contact us using the
            details below. IPOCraft does not provide personalized advisory,
            consultation, or investment assistance.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mt-6 text-xs">
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              Public Data Sources
            </span>
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              SEBI Filings Referenced
            </span>
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              Informational Platform
            </span>
          </div>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* Support */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-7 lg:p-8 hover:shadow-[0_6px_28px_rgba(0,0,0,0.07)] transition-all duration-200">
            <p className="text-sm text-[#64748b] mb-1">Platform Support</p>
            <p className="font-semibold text-[15px]">
              support@ipocraft.com
            </p>

            <p className="mt-3 text-sm text-[#64748b] leading-[1.7]">
              For reporting technical issues or requesting corrections to publicly displayed data.
            </p>
          </div>

          {/* Business */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-7 lg:p-8 hover:shadow-[0_6px_28px_rgba(0,0,0,0.07)] transition-all duration-200">
            <p className="text-sm text-[#64748b] mb-1">
              Partnerships & Business
            </p>
            <p className="font-semibold text-[15px]">
              info@ipocraft.com
            </p>

            <p className="mt-3 text-sm text-[#64748b] leading-[1.7]">
              For partnerships, advertising opportunities, or business communication related to the platform.
            </p>
          </div>
        </div>

        {/* LEGAL */}
        <div className="mt-8 bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-7 lg:p-8">
          <h2
            className="font-semibold mb-3 text-[16px]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Important Legal Disclaimer
          </h2>

          <p className="text-sm text-[#64748b] leading-[1.75]">
            IPOCraft is an independent informational platform that provides
            publicly available IPO‑related data such as Grey Market Premium (GMP),
            subscription statistics, and issue details. We are not registered with
            SEBI as an investment advisor, research analyst, or financial intermediary.
          </p>

          <p className="text-sm text-[#64748b] leading-[1.75] mt-3">
            Nothing on this website constitutes investment advice, recommendation,
            or solicitation to buy or sell securities. Users should perform their
            own research and consult licensed financial professionals before making
            investment decisions.
          </p>

          <p className="text-sm text-[#64748b] leading-[1.75] mt-3">
            IPOCraft does not guarantee the accuracy, completeness, or reliability
            of any information presented. Market data may change without notice.
          </p>

          <div className="mt-6 pt-6 border-t border-[#f1f5f9]">
            <h3 className="font-semibold text-[14.5px] mb-2">
              Transparency & Compliance
            </h3>
            <p className="text-sm text-[#64748b] leading-[1.7]">
              IPOCraft operates as an informational financial data platform and is
              not affiliated with stock exchanges, regulators, or issuing companies.
              Users should verify IPO details through official filings such as SEBI,
              company prospectuses, and exchange announcements before making financial
              decisions.
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-white border-t border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
          <h2
            className="text-[1.5rem] sm:text-[1.75rem] font-semibold leading-[1.2] text-[#0f172a] mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            About IPOCraft
          </h2>
          <p className="text-[14px] sm:text-[14.5px] text-[#64748b] leading-[1.78] max-w-4xl">
            IPOCraft is a modern IPO information platform focused on Grey Market
            Premium (GMP), subscription trends, and IPO tracking tools across
            Mainboard and SME segments in India. Our goal is to provide structured,
            easy‑to‑understand IPO data for informational purposes while maintaining
            transparency and user trust.
          </p>
        </div>
      </section>
    </main>
  );
}