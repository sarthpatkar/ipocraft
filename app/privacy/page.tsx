import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/site-url";

const privacyUrl = canonicalUrl("/privacy");

export const metadata: Metadata = {
  title:
    "Privacy Policy — Data Protection, Cookies & User Rights | IPOCraft",
  description:
    "Read IPOCraft’s privacy policy covering data collection, cookies, analytics usage, user rights, and compliance with GDPR and India DPDP regulations.",
  keywords: [
    "IPOCraft privacy policy",
    "IPO website privacy India",
    "data protection IPOCraft",
    "cookies policy India",
    "GDPR compliance India",
    "DPDP Act privacy",
  ],
  alternates: {
    canonical: privacyUrl,
  },
  openGraph: {
    title:
      "Privacy Policy — Data Protection & User Rights | IPOCraft",
    description:
      "Understand how IPOCraft handles data, cookies, analytics, and user privacy rights.",
    url: privacyUrl,
    siteName: "IPOCraft",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Privacy Policy — Data Protection & User Rights | IPOCraft",
    description:
      "Learn how IPOCraft collects, uses, and protects user data.",
  },
};




export default function PrivacyPage() {
  return (
    <main
      className={`min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9] overflow-x-hidden`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* HERO */}
      <section className="bg-white dark:bg-[#111418] border-b border-gray-200 dark:border-[#252A31]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-14">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-2">
            Privacy &amp; Data Transparency
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.4rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Privacy Policy - IPOCraft
          </h1>

          <p className="mt-4 text-sm sm:text-[15px] text-gray-600 dark:text-[#9AA1AA] max-w-2xl leading-relaxed">
            This Privacy Policy explains how IPOCraft collects, uses, and protects
            limited information when you use our platform. We prioritize transparency,
            minimal data collection, and user privacy.
          </p>

          <p className="mt-2 text-xs sm:text-sm text-gray-400 dark:text-[#6B7280]">
            Last updated: August 2026
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mt-6 text-xs">
            <span className="bg-white dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-gray-700 dark:text-[#9AA1AA] px-3 py-1.5 rounded-md shadow-xs">
              Minimal Data Collection
            </span>
            <span className="bg-white dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-gray-700 dark:text-[#9AA1AA] px-3 py-1.5 rounded-md shadow-xs">
              No Third-Party Sale
            </span>
            <span className="bg-white dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-gray-700 dark:text-[#9AA1AA] px-3 py-1.5 rounded-md shadow-xs">
              Transparent Operations
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="pb-14 sm:pb-20 animate-fade-in-up">
        <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 space-y-8">

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              Information We Collect
            </h2>
            <ul className="list-disc ml-5 sm:ml-6 text-[#475569] dark:text-slate-400 space-y-1 text-sm sm:text-base">
              <li>Basic usage data such as pages visited and time spent</li>
              <li>Device, browser, and technical information</li>
              <li>Information voluntarily provided through contact forms</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              How We Use Information
            </h2>
            <p className="text-[#475569] dark:text-slate-400 leading-loose text-sm sm:text-base">
              Information collected is used to improve user experience, maintain
              website functionality, analyze traffic trends, and communicate with
              users when necessary. IPOCraft does not sell personal data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              Cookies and Tracking
            </h2>
            <p className="text-[#475569] dark:text-slate-400 leading-loose text-sm sm:text-base">
              IPOCraft may use cookies or similar technologies to enhance browsing
              experience, remember preferences, and analyze website usage.
              Users can control cookies through their browser settings.
            </p>
            <p className="text-[#475569] dark:text-slate-400 leading-loose text-sm sm:text-base">
              IPOCraft uses Google AdSense to display advertisements. Google
              AdSense uses cookies, including the DoubleClick cookie, to serve
              ads based on a user&apos;s prior visits to this website and other
              sites on the internet. These cookies enable Google and its partners
              to serve ads to users based on their visit to IPOCraft and/or other
              sites on the internet. Users may opt out of personalised advertising
              by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1C317A] dark:text-blue-400 hover:underline font-medium"
              >
                Google Ad Settings
              </a>
              {" "}or{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1C317A] dark:text-blue-400 hover:underline font-medium"
              >
                www.aboutads.info/choices
              </a>
              . You can also disable cookies in your browser settings; however,
              doing so may affect the functionality of this and other websites.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              Third&#8209;Party Services
            </h2>
            <p className="text-[#475569] dark:text-slate-400 leading-loose text-sm sm:text-base">
              We use third&#8209;party tools such as analytics providers,
              infrastructure services, or affiliate partners. These services may
              collect information according to their own privacy policies.
            </p>
            <p className="text-[#475569] dark:text-slate-400 leading-loose text-sm sm:text-base">
              We use Google AdSense, a third&#8209;party advertising service
              provided by Google LLC, to display advertisements on this website.
              Google AdSense may use information about your visits to this and
              other websites to provide relevant advertisements. Google&apos;s
              use of advertising cookies is governed by{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1C317A] dark:text-blue-400 hover:underline font-medium"
              >
                Google&apos;s Privacy Policy
              </a>
              . For more information on how Google uses data when you use
              our partners&apos; sites or apps, see{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1C317A] dark:text-blue-400 hover:underline font-medium"
              >
                How Google uses data from sites that use Google services
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              Data Security
            </h2>
            <p className="text-[#475569] dark:text-slate-400 leading-loose text-sm sm:text-base">
              We implement reasonable security measures to protect information,
              but no method of transmission over the internet is completely secure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              User Rights
            </h2>
            <p className="text-[#475569] dark:text-slate-400 leading-loose text-sm sm:text-base">
              Users may request clarification about their data or request removal
              of voluntarily submitted information by contacting us through the
              official contact page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              GDPR & India DPDP Compliance
            </h2>
            <p className="text-[#475569] dark:text-slate-400 leading-loose text-sm sm:text-base">
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
            <p className="text-[#475569] dark:text-[#9AA1AA] leading-loose text-sm sm:text-base">
              For privacy-related questions or data requests, you may contact us at:
              <br />
              <a
                href="mailto:contact@ipocraft.com"
                className="text-[#1C317A] dark:text-blue-400 hover:underline font-medium"
              >
                contact@ipocraft.com
              </a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              Changes to This Policy
            </h2>
            <p className="text-[#475569] dark:text-slate-400 leading-loose text-sm sm:text-base">
              We may update this Privacy Policy from time to time. Continued use
              of the website constitutes acceptance of any updates.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl">
              Data Retention Policy
            </h2>
            <p className="text-[#475569] dark:text-slate-400 leading-loose text-sm sm:text-base">
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
            <p className="text-[#475569] dark:text-slate-400 leading-loose text-sm sm:text-base">
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
          <section className="bg-white dark:bg-[#111418] border border-slate-200 dark:border-[#252A31] rounded-xl p-4 sm:p-5">
            <h3 className="font-semibold text-sm sm:text-base">
              Important Disclosure
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#64748b] dark:text-[#9AA1AA] leading-loose">
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
            <p className="text-[#475569] dark:text-slate-400 leading-loose text-sm sm:text-base">
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
    </main>
  );
}
