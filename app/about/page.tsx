import { Playfair_Display, Inter } from "next/font/google";

export const metadata = {
  title: "About IPOCraft — IPO GMP, Subscription & IPO Research Platform India",
  description:
    "IPOCraft is an independent IPO information platform providing IPO GMP trends, subscription data, allotment timelines, and IPO insights sourced from publicly available filings for informational purposes.",
  keywords: [
    "IPO GMP India",
    "IPO calendar India",
    "Grey market premium",
    "SME IPO",
    "Mainboard IPO",
    "IPO subscription data",
    "IPO listing gain",
    "IPO research platform",
  ],
  openGraph: {
    title: "About IPOCraft",
    description:
      "Learn about IPOCraft — an IPO research platform providing structured IPO data and GMP tracking.",
    type: "website",
  },
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

export default function AboutPage() {
  return (
    <div
      className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] overflow-x-hidden`}
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
            About IPOCraft
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.4rem] font-semibold leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            IPO Research Platform for Structured Market Insights
          </h1>

          <p className="mt-4 text-sm sm:text-[15px] text-[#475569] max-w-2xl leading-relaxed">
            IPOCraft helps users track IPO timelines, GMP movements, subscription demand,
            and listing outcomes in a clean and structured interface designed for clarity
            and research‑focused learning.
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

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 space-y-12">

        {/* ABOUT TEXT */}
        <div className="max-w-3xl space-y-4">
          <h2
            className="text-xl sm:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            About IPOCraft
          </h2>

          <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
            IPOCraft is an independent informational platform designed to help users
            monitor Initial Public Offerings (IPOs), Grey Market Premium trends,
            subscription updates, and listing performance across Indian equity markets.
          </p>

          <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
            Our objective is to simplify publicly available financial information and
            present it in a structured format so users can stay informed and conduct
            their own independent research.
          </p>
        </div>

        {/* SEO CONTENT */}
        <div className="max-w-3xl space-y-4">
          <h2
            className="text-xl sm:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            What IPOCraft Provides
          </h2>

          <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
            IPOCraft provides structured IPO data including Grey Market Premium (GMP),
            subscription demand statistics, price bands, IPO sizes, allotment timelines,
            and listing outcomes across Mainboard and SME IPO segments in India.
          </p>

          <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
            The platform aggregates publicly available information from regulatory filings
            and exchange disclosures to help users monitor IPO activity in one place.
            IPOCraft does not provide investment advice or recommendations.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Mission */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6 shadow-sm">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Our Mission
            </h3>

            <p className="text-sm text-[#475569] leading-relaxed">
              We aim to improve accessibility and transparency in IPO market data by
              aggregating information from publicly available sources and presenting
              it in a user‑friendly interface for research purposes.
            </p>
          </div>

          {/* Data Sources */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6 shadow-sm">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Data Sources
            </h3>

            <ul className="text-sm text-[#475569] leading-relaxed space-y-1 list-disc pl-5">
              <li>Stock exchange filings (NSE, BSE)</li>
              <li>Company prospectuses and regulatory documents</li>
              <li>Registrar announcements</li>
              <li>Public disclosures and market data sources</li>
            </ul>
          </div>

        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: "IPO Timeline Tracking",
              desc: "Monitor open, close, allotment, and listing dates in one structured view.",
            },
            {
              title: "GMP Trend Analysis",
              desc: "Track premium movements with historical context.",
            },
            {
              title: "Subscription Insights",
              desc: "Understand demand across investor categories.",
            },
            {
              title: "Listing Performance",
              desc: "Analyze listing gains and performance outcomes.",
            },
            {
              title: "Mainboard & SME Coverage",
              desc: "Coverage across both IPO segments.",
            },
            {
              title: "Clean Interface",
              desc: "Minimal design focused on clarity and usability.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <h4 className="font-semibold text-[#0f172a] mb-1">{item.title}</h4>
              <p className="text-sm text-[#475569]">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* LEGAL */}
        <div className="text-xs text-[#64748b] leading-relaxed bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg p-4">
          IPOCraft is an informational platform and is not registered with SEBI or
          any financial regulatory authority. Content is provided for informational
          purposes only and does not constitute investment advice or recommendations.
          Users should verify details with official sources before making financial decisions.
        </div>

      </section>

      {/* GEO + TRUST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Data Transparency
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              IPOCraft compiles IPO information from publicly available filings,
              exchange announcements, and registrar disclosures. Users should verify
              information with official sources before making financial decisions.
            </p>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Frequently Asked Questions
            </h3>

            <div className="space-y-3 text-sm text-[#475569]">
              <p>
                <strong>Is IPOCraft SEBI registered?</strong><br />
                No. IPOCraft is an independent informational platform and is not
                registered with SEBI or any financial authority.
              </p>

              <p>
                <strong>Does IPOCraft provide investment advice?</strong><br />
                No. All content is for informational and research purposes only.
              </p>

              <p>
                <strong>Where does IPO data come from?</strong><br />
                Data is sourced from publicly available regulatory filings and disclosures.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}