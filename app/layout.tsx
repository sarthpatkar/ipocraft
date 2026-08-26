import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import ThemeProvider from "@/components/ThemeProvider";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { CANONICAL_ORIGIN, canonicalUrl } from "@/lib/site-url";
import ChatBubbleLoader from "@/components/chat/ChatBubbleLoader";


const siteUrl = CANONICAL_ORIGIN;

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IPOCraft - IPO GMP & SME IPO Updates",
  description:
    "Latest IPO GMP, SME IPO insights, subscription data, and upcoming IPO alerts.",
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-FOUC: run synchronously before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try {
    var t = localStorage.getItem('ipocraft-theme');
    var isDark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    }
  } catch(e){}
})();`,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
      <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      {/* PWA */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#1C317A" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="IPOCraft" />
      <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body
        className="bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] antialiased"
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
        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4829097668877345"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          id="google-adsense"
        />
        {/* Service Worker registration (PWA) */}
        <Script id="register-sw" strategy="lazyOnload">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').catch(function(err) {
                  console.warn('SW registration failed:', err);
                });
              });
            }
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
              "IPOCraft (ipocraft.com) is an Indian IPO tracking platform providing live GMP, subscription data, allotment probability calculators, and listing performance analytics for Mainboard and SME IPOs.",
          })}
        </Script>
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="lazyOnload"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            name: "IPOCraft",
            url: siteUrl,
            description: "Indian IPO tracking platform with live GMP, subscription data, allotment calculators, and listing analytics.",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteUrl}/ipo?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          })}
        </Script>
        <ThemeProvider>
        <Navbar />

        <main 
          className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-6 sm:pt-8 pb-20 md:pb-8"
        >
          {children}
        </main>

        <footer className="mt-14 pb-20 md:pb-0 border-t border-[#e2e8f0] dark:border-[#252A31] bg-white dark:bg-[#090B0F]">
          {/* Telegram CTA Banner */}
          <a
            href="https://t.me/ipocraft"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2 px-4 text-[12px] font-medium transition-opacity hover:opacity-95 bg-[#0088cc] text-white"
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.04 15.35 8.9 19.5c.33 0 .47-.14.64-.31l3.07-2.92 6.36 4.65c1.17.64 2 .31 2.29-1.08l4.15-19.46.01-.01c.36-1.67-.6-2.32-1.74-1.9L1.4 8.74C-.2 9.38-.18 10.3 1.13 10.7l5.5 1.72L19.9 4.3c.63-.38 1.2-.17.73.21" />
            </svg>
            <span className="sm:hidden">Join <strong className="font-semibold">@ipocraft</strong> on Telegram for daily IPO alerts</span>
            <span className="hidden sm:inline">Get daily IPO GMP alerts and exchange updates · Join our Telegram channel <strong className="font-semibold ml-1">@ipocraft</strong></span>
          </a>
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8">

            <div className="flex flex-col md:flex-row md:justify-between gap-6">

              {/* Brand */}
              <div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/logo-light.png"
                    alt="IPOCraft Logo"
                    width={130}
                    height={36}
                    className="h-8 w-auto block dark:hidden object-contain"
                  />
                  <Image
                    src="/logo-dark.png"
                    alt="IPOCraft Logo"
                    width={130}
                    height={36}
                    className="h-8 w-auto hidden dark:block object-contain"
                  />
                </div>
                <p className="mt-2 text-xs sm:text-[13px] text-[#64748b] dark:text-[#9AA1AA] max-w-sm leading-relaxed">
                  Structured Indian IPO intelligence, subscription tracker, and grey market trend analytics.
                </p>
              </div>

              {/* Footer Navigation */}
              <div className="grid grid-cols-2 gap-8 text-[13px] text-[#475569] dark:text-[#9AA1AA]">

                {/* Quick Links */}
                <div>
                  <h4 className="font-semibold text-[#0f172a] dark:text-[#F1F3F5] mb-2.5 text-[12px] uppercase tracking-wider">Quick Links</h4>
                  <ul className="space-y-1.5">
                    <li><Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link></li>
                    <li><Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link></li>
                    <li><Link href="/methodology" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Data Methodology</Link></li>
                    <li><Link href="/compare" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Compare IPOs</Link></li>
                    <li><Link href="/alerts" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Daily IPO Alerts</Link></li>
                    <li><Link href="/disclaimer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Disclaimer</Link></li>
                    <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Use</Link></li>
                    <li><Link href="/sitemap.xml" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sitemap</Link></li>
                    <li>
                      <Link href="/feedback" className="inline-flex items-center gap-1.5 text-[#1C317A] dark:text-[#93B4FF] font-medium hover:opacity-80 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6m-6 4h10M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                        </svg>
                        Share Feedback
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Learning Guides */}
                <div>
                  <h4 className="font-semibold text-[#0f172a] dark:text-[#F1F3F5] mb-2.5 text-[12px] uppercase tracking-wider">Research Guides</h4>
                  <ul className="space-y-1.5">
                    <li><Link href="/what-is-ipo-gmp" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">What is IPO GMP?</Link></li>
                    <li><Link href="/how-ipo-allotment-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How IPO Allotment Works</Link></li>
                    <li><Link href="/qib-hni-retail-explained" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">QIB vs HNI vs Retail</Link></li>
                    <li><Link href="/ipo-grey-market-guide" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Grey Market Guide</Link></li>
                    <li><Link href="/ipo-subscription-meaning" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">IPO Subscription Meaning</Link></li>
                  </ul>
                </div>

              </div>

              {/* Social */}
              <div className="flex items-center gap-2.5 flex-wrap self-start">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/1HTZpLmZux/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#e2e8f0] dark:border-[#252A31] bg-white dark:bg-[#111418] text-blue-600 dark:text-[#9AA1AA] hover:text-blue-600 dark:hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/ipocraft_official?igsh=MTgzOXJ6ZTlrdzdwNg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#e2e8f0] dark:border-[#252A31] bg-white dark:bg-[#111418] text-pink-600 dark:text-[#9AA1AA] hover:text-pink-600 dark:hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.25-2.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z" />
                  </svg>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/ipocraft"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#e2e8f0] dark:border-[#252A31] bg-white dark:bg-[#111418] text-sky-500 dark:text-[#9AA1AA] hover:text-sky-500 dark:hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.04 15.35 8.9 19.5c.33 0 .47-.14.64-.31l3.07-2.92 6.36 4.65c1.17.64 2 .31 2.29-1.08l4.15-19.46.01-.01c.36-1.67-.6-2.32-1.74-1.9L1.4 8.74C-.2 9.38-.18 10.3 1.13 10.7l5.5 1.72L19.9 4.3c.63-.38 1.2-.17.73.21" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/ipo-craft-a9259a3b4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#e2e8f0] dark:border-[#252A31] bg-white dark:bg-[#111418] text-[#0A66C2] dark:text-[#9AA1AA] hover:text-[#0A66C2] dark:hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7 0h3.83v2.05h.05c.53-1 1.84-2.05 3.79-2.05C19.36 8 21 10.1 21 13.36V23h-4v-8.4c0-2-.04-4.57-2.78-4.57-2.78 0-3.2 2.17-3.2 4.43V23h-4V8z"/>
                  </svg>
                </a>

                {/* X */}
                <a
                  href="https://x.com/ipocraft_in"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#e2e8f0] dark:border-[#252A31] bg-white dark:bg-[#111418] text-black dark:text-[#9AA1AA] hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2H21l-6.5 7.43L22 22h-6.828l-5.35-6.993L3.5 22H1l6.95-7.95L2 2h6.914l4.86 6.34L18.244 2zm-2.394 18h1.89L8.01 4H6.06l9.79 16z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@ipocraft-q5o"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#e2e8f0] dark:border-[#22304A] bg-white dark:bg-[#11182D] text-red-600 dark:text-[#94A3B8] hover:text-red-600 dark:hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a2.997 2.997 0 0 0-2.115-2.116C19.72 3.5 12 3.5 12 3.5s-7.72 0-9.383.57a2.997 2.997 0 0 0-2.115 2.116A29.96 29.96 0 0 0 0 12a29.96 29.96 0 0 0 .502 5.814 2.997 2.997 0 0 0 2.115 2.116C4.28 20.5 12 20.5 12 20.5s7.72 0 9.383-.57a2.997 2.997 0 0 0 2.115-2.116A29.96 29.96 0 0 0 24 12a29.96 29.96 0 0 0-.502-5.814zM9.75 15.02v-6.04L15.5 12l-5.75 3.02z" />
                  </svg>
                </a>
              </div>

            </div>

            {/* Divider */}
            <div className="border-t border-[#e2e8f0] dark:border-[#252A31] my-5" />

            {/* Legal Disclaimer */}
            <p className="text-[11.5px] text-[#64748b] dark:text-[#94A3B8] leading-relaxed">
              <strong>Disclaimer:</strong> IPOCraft is an informational research platform and is not registered with SEBI as an investment advisor or research analyst. All data including IPO timelines, GMP indications, subscription demand, and financial summaries are referenced from official regulatory filings (DRHP/RHP) and exchange disclosures. Information is provided solely for education and research.{" "}
              <Link href="/disclaimer" className="text-blue-600 dark:text-blue-400 hover:underline">
                Read full disclaimer
              </Link>
            </p>

            {/* Copyright */}
            <p className="text-[11.5px] text-[#94a3b8] dark:text-[#64748B] mt-2">
              © {new Date().getFullYear()} IPOCraft. All rights reserved.
            </p>

          </div>
        </footer>
        <ChatBubbleLoader />
        <CookieConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
