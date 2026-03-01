import type { Metadata } from "next";
import Link from "next/link";
import { Playfair_Display, Inter } from "next/font/google";
import IpoList from "@/components/IpoList";
import { unstable_noStore as noStore } from "next/cache";
import { Suspense } from "react";

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

const STATUS_FILTERS = ["Open", "Upcoming", "Listed", "Closed"] as const;
type StatusFilter = "All" | (typeof STATUS_FILTERS)[number];

function buildTitle(status?: string) {
  if (!status || status.toLowerCase() === "all") {
    return "Latest IPO Listings | IPOCraft";
  }
  return `${status} IPOs | IPOCraft`;
}

function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white border border-[#e2e8f0] rounded-lg p-4 h-[180px]"
        >
          <div className="h-4 bg-[#e2e8f0] rounded w-2/3 mb-3" />
          <div className="h-3 bg-[#e2e8f0] rounded w-1/2 mb-2" />
          <div className="h-3 bg-[#e2e8f0] rounded w-1/3 mb-2" />
          <div className="h-8 bg-[#e2e8f0] rounded w-full mt-4" />
        </div>
      ))}
    </div>
  );
}

function normalizeStatus(input?: string): StatusFilter {
  if (!input) return "All";
  const match = STATUS_FILTERS.find(
    (s) => s.toLowerCase() === input.toLowerCase()
  );
  return match ?? "All";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const status = params.status ?? "All";
  const type = (params.type ?? "").toString();

  return {
    title:
      (type ? `${type.toUpperCase()} ` : "") +
      buildTitle(status),
    description:
      "Track open, upcoming and recently listed IPOs with GMP updates, offer dates, and subscription trends on IPOCraft.",
  };
}

function buildHref(status: StatusFilter, search: string, type?: string) {
  const params = new URLSearchParams();
  if (status !== "All") {
    params.set("status", status.toLowerCase());
  }
  if (search.trim()) {
    params.set("q", search.trim());
  }
  if (type) {
    params.set("type", type);
  }
  const query = params.toString();
  return query ? `/ipo?${query}` : "/ipo";
}


export default async function IPOPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; type?: string }>;
}) {
  noStore();
  const params = await searchParams;
  const rawStatus = (params.status ?? "").toString();
  const selectedStatus = normalizeStatus(rawStatus);
  const selectedStatusParam = selectedStatus.toLowerCase();
  const searchQuery = (params.q ?? "").toString().trim();
  const selectedType = (params.type ?? "").toString();

  return (
    <div
      className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased overflow-x-hidden will-change-transform`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >

      {/* Animated Hero */}
      <section className="relative overflow-hidden border-b border-[#e2e8f0]">
        {/* Gradient Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#e0e7ff] via-white to-[#f1f5f9] animate-[gradientShift_12s_ease_infinite]" />

        {/* Subtle Glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-16">
          <p
            className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-[#2563eb] mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            IPO Listings
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.5rem] font-semibold leading-[1.15] tracking-[-0.01em] text-[#0f172a]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Latest IPO Listings in India
          </h1>

          <p
            className="mt-4 text-[14.5px] text-[#475569] leading-[1.78] max-w-3xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Track open, upcoming, and recently listed IPOs with offer dates, price bands, subscription demand, and GMP insights in one place.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/gmp"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#1e3a8a] rounded-lg shadow hover:shadow-md hover:bg-[#1a327a] transition"
            >
              View GMP Tracker
            </Link>

            <Link
              href="/ipo?status=open"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#1e3a8a] bg-white border border-[#c7d2fe] rounded-lg hover:bg-[#eef2ff] transition"
            >
              Open IPOs
            </Link>
          </div>
        </div>

        {/* Gradient Animation Keyframes */}
        <style>{`
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          div[class*="gradient-to"] {
            background-size: 200% 200%;
          }
          @media (prefers-reduced-motion: reduce) {
            div[class*="animate-"] { animation: none !important; }
          }
        `}</style>
      </section>

      {/* Structured Data for SEO + GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            name: "IPO Listings India",
            provider: {
              "@type": "Organization",
              name: "IPOCraft",
              url: "https://ipocraft.in",
            },
            description:
              "Latest IPO listings in India including open, upcoming, and listed IPOs with price bands, dates, and subscription insights.",
          }),
        }}
      />

      {/* Trust + Info Badges */}
      <section className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 flex flex-wrap gap-3 text-[12px] text-[#475569]">
          <div className="px-3 py-1.5 rounded-full bg-[#f1f5f9] border border-[#e2e8f0]">
            Data sourced from public filings & exchange disclosures
          </div>
          <div className="px-3 py-1.5 rounded-full bg-[#f1f5f9] border border-[#e2e8f0]">
            Informational platform — not investment advice
          </div>
          <div className="px-3 py-1.5 rounded-full bg-[#f1f5f9] border border-[#e2e8f0]">
            Updated regularly for accuracy
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-8 sm:py-12 w-full overflow-x-hidden relative md:pt-10">
          <div className="md:sticky md:top-[88px] z-30 relative bg-white/80 backdrop-blur-xl border border-[#e2e8f0]/70 rounded-lg p-4 sm:p-5 mb-8 md:mb-10 shadow-sm supports-[backdrop-filter]:bg-white/70">
            <form id="searchForm" method="GET" className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="searchInput"
                  type="search"
                  name="q"
                  placeholder="Search IPO by company name…"
                  defaultValue={searchQuery}
                  autoComplete="off"
                  spellCheck={false}
                  inputMode="search"
                  aria-label="Search IPO"
                  className="border border-[#dbe4f0] rounded pl-9 pr-3 py-2 text-[13px] w-full focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                />
              </div>

              <input type="hidden" name="status" value={selectedStatusParam} />
              <input type="hidden" name="type" value={selectedType} />
            </form>

            <script
              dangerouslySetInnerHTML={{
                __html: `
        (function() {
          const input = document.getElementById('searchInput');
          if (!input) return;

          input.addEventListener('input', function() {
            const value = input.value.toLowerCase();
            const cards = document.querySelectorAll('a[href^="/ipo/"]');

            cards.forEach(card => {
              const text = card.textContent.toLowerCase();
              if (text.includes(value)) {
                card.style.display = '';
              } else {
                card.style.display = 'none';
              }
            });
          });
        })();
      `,
              }}
            />
            <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
              <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 animate-[pulse_2s_ease-in-out_1]">
                Open IPOs
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 animate-[pulse_2s_ease-in-out_1]">
                Upcoming IPOs
              </span>
              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                Listed / Closed
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Link
                href={buildHref(selectedStatus, searchQuery, "mainboard")}
                className={`px-3 py-1.5 text-[12px] rounded border transition ${
                  selectedType === "mainboard"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-[#475569] border-[#e2e8f0]"
                }`}
              >
                Mainboard
              </Link>

              <Link
                href={buildHref(selectedStatus, searchQuery, "sme")}
                className={`px-3 py-1.5 text-[12px] rounded border transition ${
                  selectedType === "sme"
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-[#475569] border-[#e2e8f0]"
                }`}
              >
                SME
              </Link>

              <Link
                href={buildHref(selectedStatus, searchQuery, "")}
                className={`px-3 py-1.5 text-[12px] rounded border transition ${
                  !selectedType
                    ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                    : "bg-white text-[#475569] border-[#e2e8f0]"
                }`}
              >
                All
              </Link>

              {STATUS_FILTERS.map((status) => (
                <Link
                  key={status}
                  href={buildHref(status, searchQuery, selectedType)}
                  className={`px-3 py-1.5 text-[12px] rounded border transition ${
                    selectedStatus === status
                      ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                      : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#94a3b8]"
                  }`}
                >
                  {status}
                </Link>
              ))}
            </div>
          </div>
          {/* Spacer to prevent sticky overlap on larger screens */}
          <div className="hidden md:block h-28 lg:h-32" />

          <div className="mt-6 md:mt-8">
            <Suspense fallback={<CardsSkeleton />}>
              <IpoList
                status={selectedStatus === "All" ? undefined : selectedStatus}
                search={searchQuery}
                type={selectedType || undefined}
              />
            </Suspense>
          </div>
          {/* SEO Content Section */}
          <div className="mt-10 bg-white border border-[#e2e8f0] rounded-lg p-5 sm:p-6 text-[14px] text-[#475569] leading-relaxed">
            <h2 className="text-[16px] font-semibold text-[#0f172a] mb-3">
              About IPO Listings in India
            </h2>
            <p className="mb-3">
              Initial Public Offerings (IPOs) allow companies to raise capital by offering shares to the public. Investors track IPO open dates, price bands, allotment timelines, and listing performance to make informed decisions.
            </p>
            <p className="mb-3">
              IPOCraft provides structured information about ongoing, upcoming, and recently listed IPOs in India. Data is compiled from publicly available company disclosures, exchange filings, and market updates.
            </p>
            <p>
              Investors should independently verify details from official sources such as exchange filings and prospectus documents before making financial decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
