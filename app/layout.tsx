import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
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

export const metadata: Metadata = {
  title: "IPOCraft — IPO GMP & SME IPO Updates",
  description:
    "Latest IPO GMP, SME IPO insights, subscription data, and upcoming IPO alerts for Indian investors.",
  metadataBase: new URL("https://ipocraft.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} bg-[#f8fafc]`}
      style={{ colorScheme: "light" }}
    >
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body
        className="bg-[#f8fafc] text-[#0f172a] antialiased"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
          {children}
        </main>

        <footer className="bg-white border-t border-[#e2e8f0] mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">

            <div className="flex flex-col md:flex-row md:justify-between gap-8">

              {/* Brand */}
              <div>
                <h3 className="text-lg font-semibold text-[#0f172a]">
                  IPOCraft
                </h3>
                <p className="mt-2 text-sm text-[#64748b] max-w-md">
                  IPOCraft provides structured IPO data, GMP trends, and subscription insights
                  for educational and research purposes.
                </p>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-6 text-sm text-[#475569]">
                <a href="/about" className="hover:text-[#1e3a8a]">About</a>
                <a href="/contact" className="hover:text-[#1e3a8a]">Contact</a>
                <a href="/privacy" className="hover:text-[#1e3a8a]">Privacy Policy</a>
                <a href="/terms" className="hover:text-[#1e3a8a]">Terms</a>
              </div>

              {/* Social */}
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/ipocraft_official?igsh=MTgzOXJ6ZTlrdzdwNg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 transition"
                  aria-label="Instagram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.25-2.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z" />
                  </svg>
                </a>

                <a
                  href="https://t.me/ipocraft"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-500 hover:text-sky-600 transition"
                  aria-label="Telegram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9.04 15.35 8.9 19.5c.33 0 .47-.14.64-.31l3.07-2.92 6.36 4.65c1.17.64 2 .31 2.29-1.08l4.15-19.46.01-.01c.36-1.67-.6-2.32-1.74-1.9L1.4 8.74C-.2 9.38-.18 10.3 1.13 10.7l5.5 1.72L19.9 4.3c.63-.38 1.2-.17.73.21" />
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