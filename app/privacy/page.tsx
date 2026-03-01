export const metadata = {
  title: "Privacy Policy | IPOCraft",
  description:
    "Learn how IPOCraft collects, uses, and protects user information, including analytics data, cookies, and third‑party services.",
};

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

export default function PrivacyPage() {
  return (
    <main
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
            Privacy & Data Transparency
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.4rem] font-semibold leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Privacy Policy — IPOCraft
          </h1>

          <p className="mt-4 text-sm sm:text-[15px] text-[#475569] max-w-2xl leading-relaxed">
            This Privacy Policy explains how IPOCraft collects, uses, and protects
            limited information when you use our platform. We prioritize transparency,
            minimal data collection, and user privacy.
          </p>

          <p className="mt-2 text-xs sm:text-sm text-[#64748b]">
            Last updated: March 1, 2026
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mt-6 text-xs">
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              Minimal Data Collection
            </span>
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              No Sensitive Financial Data
            </span>
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              Transparency Focused
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="pb-14 sm:pb-20">
        <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 space-y-8">

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              Information We Collect
            </h2>
            <ul className="list-disc ml-5 sm:ml-6 text-[#475569] space-y-1 text-sm sm:text-base">
              <li>Basic usage data such as pages visited and time spent</li>
              <li>Device, browser, and technical information</li>
              <li>Information voluntarily provided through contact forms</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              How We Use Information
            </h2>
            <p className="text-[#475569] leading-relaxed text-sm sm:text-base">
              Information collected is used to improve user experience, maintain
              website functionality, analyze traffic trends, and communicate with
              users when necessary. IPOCraft does not sell personal data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              Cookies and Tracking
            </h2>
            <p className="text-[#475569] leading-relaxed text-sm sm:text-base">
              IPOCraft may use cookies or similar technologies to enhance browsing
              experience, remember preferences, and analyze website usage.
              Users can control cookies through their browser settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              Third‑Party Services
            </h2>
            <p className="text-[#475569] leading-relaxed text-sm sm:text-base">
              We may use third‑party tools such as analytics providers,
              infrastructure services, or affiliate partners. These services may
              collect information according to their own privacy policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              Data Security
            </h2>
            <p className="text-[#475569] leading-relaxed text-sm sm:text-base">
              We implement reasonable security measures to protect information,
              but no method of transmission over the internet is completely secure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              User Rights
            </h2>
            <p className="text-[#475569] leading-relaxed text-sm sm:text-base">
              Users may request clarification about their data or request removal
              of voluntarily submitted information by contacting us through the
              official contact page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              GDPR & India DPDP Compliance
            </h2>
            <p className="text-[#475569] leading-relaxed text-sm sm:text-base">
              Depending on your location, you may have rights under applicable data
              protection laws, including the General Data Protection Regulation (GDPR)
              and the Indian Digital Personal Data Protection Act (DPDP). These rights
              may include requesting access to, correction of, or deletion of personal
              information associated with you. IPOCraft collects minimal personal data
              primarily for website functionality and analytics.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              Contact for Privacy Requests
            </h2>
            <p className="text-[#475569] leading-relaxed text-sm sm:text-base">
              For privacy-related questions or data requests, you may contact us at:
              <br />
              <a
                href="mailto:privacy@ipocraft.com"
                className="text-indigo-600 hover:underline font-medium"
              >
                privacy@ipocraft.com
              </a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              Changes to This Policy
            </h2>
            <p className="text-[#475569] leading-relaxed text-sm sm:text-base">
              We may update this Privacy Policy from time to time. Continued use
              of the website constitutes acceptance of any updates.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              Data Retention Policy
            </h2>
            <p className="text-[#475569] leading-relaxed text-sm sm:text-base">
              IPOCraft retains minimal personal information only for as long as
              necessary to fulfill the purposes described in this policy,
              including maintaining website functionality, responding to user
              inquiries, and complying with legal obligations. Analytics data may
              be retained in aggregated or anonymized form for performance
              monitoring and improvement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              Affiliate Disclosure
            </h2>
            <p className="text-[#475569] leading-relaxed text-sm sm:text-base">
              IPOCraft may participate in affiliate marketing programs with
              brokerage platforms or financial service providers. This means we
              may earn a commission if users choose to open accounts or use
              services through referral links on our website. These partnerships
              do not influence the objectivity of the information presented.
              Users are encouraged to independently evaluate any financial
              decisions before acting.
            </p>
          </section>

          {/* Legal clarity for zero‑risk goal */}
          <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
            <h3 className="font-semibold text-sm sm:text-base">
              Important Disclosure
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#64748b] leading-relaxed">
              IPOCraft is an independent informational platform and is not a SEBI
              registered investment advisor. Content is provided for educational
              and informational purposes only and should not be considered
              financial or investment advice. Users should verify information from
              official filings and consult qualified professionals before making
              financial decisions.
            </p>
          </section>

          {/* GEO / SEO content block */}
          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              About IPOCraft Data Transparency
            </h2>
            <p className="text-[#475569] leading-relaxed text-sm sm:text-base">
              IPOCraft provides structured IPO information including Grey Market Premium
              (GMP) trends, subscription data, IPO timelines, and listing insights sourced
              from publicly available filings, exchange disclosures, and registrar updates.
              Our goal is to present financial information in a clear and accessible format
              for research purposes. Users should always verify details with official
              sources before making financial decisions.
            </p>
          </section>

        </div>
      </section>
      {/* Cookie Consent + Preferences */}
      <div className="fixed bottom-0 inset-x-0 z-50">
        <input id="cookie-consent" type="checkbox" className="hidden peer" />

        <div className="peer-checked:hidden bg-white border-t border-slate-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              IPOCraft uses cookies and similar technologies to enhance user
              experience and analyze traffic. You can manage your preferences at
              any time.
            </p>

            <div className="flex gap-2">
              <label
                htmlFor="cookie-modal"
                className="cursor-pointer px-4 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium hover:bg-slate-50 transition"
              >
                Preferences
              </label>

              <label
                htmlFor="cookie-consent"
                className="cursor-pointer px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs sm:text-sm font-medium hover:bg-indigo-700 transition"
              >
                Accept
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Preferences Modal */}
      <input id="cookie-modal" type="checkbox" className="hidden peer/modal" />
      <div className="peer-checked/modal:flex hidden fixed inset-0 z-50 items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4">
          <h3 className="font-semibold text-lg">
            Cookie Preferences
          </h3>

          <p className="text-sm text-[#475569] leading-relaxed">
            Manage how cookies are used on IPOCraft. Essential cookies are always
            enabled for proper website functionality.
          </p>

          <div className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <p className="text-sm font-medium">Analytics Cookies</p>
              <p className="text-xs text-[#64748b]">
                Help us understand usage and improve performance.
              </p>
            </div>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <label
              htmlFor="cookie-modal"
              className="cursor-pointer px-4 py-2 rounded-lg border border-slate-300 text-sm hover:bg-slate-50 transition"
            >
              Close
            </label>

            <label
              htmlFor="cookie-consent"
              className="cursor-pointer px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
            >
              Save Preferences
            </label>
          </div>
        </div>
      </div>
    </main>
  );
}