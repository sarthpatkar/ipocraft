import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Script from "next/script";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { CANONICAL_ORIGIN, canonicalUrl } from "@/lib/site-url";

const siteUrl = CANONICAL_ORIGIN;

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IPOCraft — IPO GMP & SME IPO Updates",
  description:
    "Latest IPO GMP, SME IPO insights, subscription data, and upcoming IPO alerts.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: canonicalUrl("/"),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} bg-[#f8fafc]`}
      style={{ colorScheme: "light" }}
    >
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="google-site-verification" content="abcdef123456" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body
        className="bg-[#f8fafc] text-[#0f172a] antialiased"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-V2DGFHC1DY"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V2DGFHC1DY');
          `}
        </Script>
        <Script
          id="org-schema"
          type="application/ld+json"
          strategy="lazyOnload"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "IPOCraft",
            url: siteUrl,
            logo: `${siteUrl}/logo2.png`,
            sameAs: [
              "https://www.instagram.com/ipocraft_official",
              "https://t.me/ipocraft",
              "https://www.linkedin.com/in/ipo-craft-a9259a3b4/",
              "https://x.com/ipocraft_in",
              "https://youtube.com/@ipocraft-q5o"
            ],
            description:
              "IPOCraft provides structured IPO data, GMP trends, and subscription insights for Indian investors.",
          })}
        </Script>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
          {children}
        </main>

        <footer className="bg-white border-t border-[#e2e8f0] mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">

            <div className="flex flex-col md:flex-row md:justify-between gap-8">

              {/* Brand */}
              <div>
                <Image
                  src="/logo2.png"
                  alt="IPOCraft Logo"
                  width={140}
                  height={40}
                  priority
                  className="h-auto w-auto"
                />
                <p className="mt-2 text-sm text-[#64748b] max-w-md">
                  IPOCraft provides structured IPO data, GMP trends, and subscription insights
                  for educational and research purposes.
                </p>
              </div>

              {/* Footer Navigation */}
              <div className="grid grid-cols-2 gap-8 text-sm text-[#475569]">

                {/* Quick Links */}
                <div>
                  <h4 className="font-semibold text-[#0f172a] mb-3">Quick Links</h4>
                  <ul className="space-y-2">
                    <li><Link href="/about" className="hover:text-[#1e3a8a]">About</Link></li>
                    <li><Link href="/contact" className="hover:text-[#1e3a8a]">Contact</Link></li>
                    <li><Link href="/privacy" className="hover:text-[#1e3a8a]">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="hover:text-[#1e3a8a]">Terms</Link></li>
                  </ul>
                </div>

                {/* Learning Guides */}
                <div>
                  <h4 className="font-semibold text-[#0f172a] mb-3">Learning Guides</h4>
                  <ul className="space-y-2">
                    <li><Link href="/what-is-ipo-gmp" className="hover:text-[#2563eb]">What is IPO GMP?</Link></li>
                    <li><Link href="/how-ipo-allotment-works" className="hover:text-[#2563eb]">How IPO Allotment Works</Link></li>
                    <li><Link href="/qib-hni-retail-explained" className="hover:text-[#2563eb]">QIB vs HNI vs Retail</Link></li>
                    <li><Link href="/ipo-grey-market-guide" className="hover:text-[#2563eb]">Grey Market Guide</Link></li>
                    <li><Link href="/ipo-subscription-meaning" className="hover:text-[#2563eb]">IPO Subscription Meaning</Link></li>
                  </ul>
                </div>

              </div>

              {/* Social */}
              <div className="flex items-center gap-4">
  {/* Instagram */}
  <a
    href="https://www.instagram.com/ipocraft_official?igsh=MTgzOXJ6ZTlrdzdwNg=="
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#e2e8f0] bg-white shadow-sm text-pink-600 hover:text-pink-700 transition transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-105"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.25-2.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z" />
    </svg>
  </a>

  {/* Telegram */}
  <a
    href="https://t.me/ipocraft"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Telegram"
    className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#e2e8f0] bg-white shadow-sm text-sky-500 hover:text-sky-600 transition transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-105"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9.04 15.35 8.9 19.5c.33 0 .47-.14.64-.31l3.07-2.92 6.36 4.65c1.17.64 2 .31 2.29-1.08l4.15-19.46.01-.01c.36-1.67-.6-2.32-1.74-1.9L1.4 8.74C-.2 9.38-.18 10.3 1.13 10.7l5.5 1.72L19.9 4.3c.63-.38 1.2-.17.73.21" />
    </svg>
  </a>

  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/in/ipo-craft-a9259a3b4/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#e2e8f0] bg-white shadow-sm text-[#0A66C2] hover:text-[#004182] transition transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-105"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7 0h3.83v2.05h.05c.53-1 1.84-2.05 3.79-2.05C19.36 8 21 10.1 21 13.36V23h-4v-8.4c0-2-.04-4.57-2.78-4.57-2.78 0-3.2 2.17-3.2 4.43V23h-4V8z"/>
    </svg>
  </a>

  {/* X */}
  <a
    href="https://x.com/ipocraft_in"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="X"
    className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#e2e8f0] bg-white shadow-sm text-black hover:text-gray-700 transition transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-105"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2H21l-6.5 7.43L22 22h-6.828l-5.35-6.993L3.5 22H1l6.95-7.95L2 2h6.914l4.86 6.34L18.244 2zm-2.394 18h1.89L8.01 4H6.06l9.79 16z"/>
    </svg>
  </a>

  {/* YouTube */}
  <a
    href="https://youtube.com/@ipocraft-q5o"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="YouTube"
    className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#e2e8f0] bg-white shadow-sm text-red-600 hover:text-red-700 transition transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-105"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a2.997 2.997 0 0 0-2.115-2.116C19.72 3.5 12 3.5 12 3.5s-7.72 0-9.383.57a2.997 2.997 0 0 0-2.115 2.116A29.96 29.96 0 0 0 0 12a29.96 29.96 0 0 0 .502 5.814 2.997 2.997 0 0 0 2.115 2.116C4.28 20.5 12 20.5 12 20.5s7.72 0 9.383-.57a2.997 2.997 0 0 0 2.115-2.116A29.96 29.96 0 0 0 24 12a29.96 29.96 0 0 0-.502-5.814zM9.75 15.02v-6.04L15.5 12l-5.75 3.02z" />
    </svg>
  </a>
</div>

            </div>

            {/* Divider */}
            <div className="border-t border-[#e2e8f0] my-6" />

            {/* Legal Disclaimer */}
            <p className="text-xs text-[#64748b] leading-relaxed">
              IPOCraft is an independent informational platform and is not a SEBI-registered
              investment advisor or broker. All information including IPO data, Grey Market
              Premium (GMP), subscription figures, and financial metrics is collected from
              publicly available sources and market intelligence. This content is provided
              strictly for educational and research purposes and should not be considered
              financial advice, investment recommendation, or solicitation to buy or sell
              securities. Users are advised to consult a qualified financial advisor before
              making any investment decisions.
            </p>

            {/* Copyright */}
            <p className="text-xs text-[#94a3b8] mt-4">
              © {new Date().getFullYear()} IPOCraft. All rights reserved.
            </p>

          </div>
        </footer>
      </body>
    </html>
  );
}
