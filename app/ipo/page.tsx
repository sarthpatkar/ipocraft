import type { Metadata } from "next";
import Link from "next/link";
import { Outfit, Inter } from "next/font/google";
import IpoLoadMoreClient from "@/components/IpoLoadMoreClient";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getIpoFeedPage } from "@/lib/ipoFeed";
import { unstable_noStore as noStore } from "next/cache";
import { CANONICAL_ORIGIN, canonicalUrl } from "@/lib/site-url";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const ipoListingsUrl = canonicalUrl("/ipo");

const STATUS_FILTERS = ["Open", "Upcoming", "Listed", "Closed"] as const;
type StatusFilter = "All" | (typeof STATUS_FILTERS)[number];

function buildTitle(status?: string) {
  if (!status || status.toLowerCase() === "all") {
    return "Latest IPO Listings | IPOCraft";
  }
  return `${status} IPOs | IPOCraft`;
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

  const baseTitle =
    (type ? `${type.toUpperCase()} ` : "") +
    buildTitle(status);

  return {
    title: `${baseTitle} — IPO GMP, Upcoming & Current IPO List India | IPOCraft`,
    description:
      "Explore the latest IPO listings in India including open, upcoming, and listed IPOs with GMP, price bands, subscription data, and key dates. Updated regularly by IPOCraft.",
    alternates: {
      canonical: ipoListingsUrl,
    },
    openGraph: {
      title: `${baseTitle} — IPO Listings India | IPOCraft`,
      description:
        "Track open, upcoming, and listed IPOs with GMP insights, subscription trends, and offer details in one place.",
      url: ipoListingsUrl,
      siteName: "IPOCraft",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${baseTitle} — IPO Listings India | IPOCraft`,
      description:
        "Latest IPO list with GMP, subscription data, and timelines — IPOCraft.",
    },
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
  const statusFilter = selectedStatus === "All" ? undefined : selectedStatus;
  const typeFilter = selectedType || undefined;
  const queryFilter = searchQuery || undefined;
  const supabase = await createSupabaseServerClient();
  const initialFeed = await getIpoFeedPage({
    supabase,
    limit: 6,
    status: statusFilter,
    type: typeFilter,
    q: queryFilter,
  });

  return (
    <div
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] dark:bg-[#080D18] text-[#0f172a] dark:text-[#F1F5F9] antialiased`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Hero */}
      <section className="border-b border-[#e2e8f0] dark:border-[#22304A] bg-white dark:bg-[#0D1525]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p
            className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-[#2563eb] dark:text-[#3B82F6] mb-2"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            IPO Directory
          </p>

          <h1
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0f172a] dark:text-[#F1F5F9]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Latest IPO Listings in India
          </h1>

          <p
            className="mt-2 text-[14px] text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-2xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Track open, upcoming, and recently listed IPOs with offer dates, price bands, subscription demand, and GMP insights.
          </p>

          {/* CTA Buttons */}
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link
              href="/gmp"
              className="inline-flex items-center justify-center px-4 py-2 text-[13px] font-semibold text-white bg-[#1e3a8a] dark:bg-[#3B82F6] hover:bg-[#1a327a] dark:hover:bg-[#2563EB] rounded-lg shadow-xs transition-colors"
            >
              View GMP Tracker
            </Link>

            <Link
              href="/ipo?status=open"
              className="inline-flex items-center justify-center px-4 py-2 text-[13px] font-semibold text-[#1e3a8a] dark:text-[#F1F5F9] bg-white dark:bg-[#162238] border border-[#c7d2fe] dark:border-[#22304A] rounded-lg hover:bg-[#eef2ff] dark:hover:bg-[#1c2b47] transition-colors"
            >
              Open IPOs
            </Link>
          </div>
        </div>
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
              url: CANONICAL_ORIGIN,
            },
            description:
              "Latest IPO listings in India including open, upcoming, and listed IPOs with price bands, dates, and subscription insights.",
          }),
        }}
      />

      {/* Trust Badges */}
      <section className="bg-white dark:bg-[#0D1525] border-b border-[#e2e8f0] dark:border-[#22304A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-2 text-[11.5px] text-[#475569] dark:text-[#94A3B8]">
          <span className="px-2.5 py-1 rounded-md bg-[#f1f5f9] dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A]">
            Exchange disclosures &amp; filings referenced
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[#f1f5f9] dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A]">
            Research &amp; informational platform
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[#f1f5f9] dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A]">
            Updated regularly for accuracy
          </span>
        </div>
      </section>

      <section className="bg-[#f8fafc] dark:bg-[#080D18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
          {/* Filters & Search Box */}
          <div className="bg-white dark:bg-[#0D1525] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-4 sm:p-5 mb-6 shadow-xs">
            <form id="searchForm" method="GET" className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] dark:text-[#64748B]"
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
                  className="bg-white dark:bg-[#162238] border border-[#dbe4f0] dark:border-[#22304A] text-gray-900 dark:text-[#F1F5F9] placeholder-gray-400 dark:placeholder-[#64748B] rounded-lg pl-9 pr-3 py-2 text-[13px] w-full focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
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
            <div className="flex flex-wrap items-center gap-1.5 mt-3.5 pt-3 border-t border-gray-100 dark:border-[#22304A]">
              <Link
                href={buildHref(selectedStatus, searchQuery, "mainboard")}
                className={`px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-colors ${
                  selectedType === "mainboard"
                    ? "bg-[#3B82F6] text-white border-[#3B82F6] shadow-xs font-semibold"
                    : "bg-white dark:bg-[#162238] text-[#475569] dark:text-[#94A3B8] border-[#e2e8f0] dark:border-[#22304A] hover:border-[#3B82F6]/50 hover:text-[#0f172a] dark:hover:text-[#F1F5F9]"
                }`}
              >
                Mainboard
              </Link>
              <Link
                href={buildHref(selectedStatus, searchQuery, "sme")}
                className={`px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-colors ${
                  selectedType === "sme"
                    ? "bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-xs font-semibold"
                    : "bg-white dark:bg-[#162238] text-[#475569] dark:text-[#94A3B8] border-[#e2e8f0] dark:border-[#22304A] hover:border-[#8B5CF6]/50 hover:text-[#0f172a] dark:hover:text-[#F1F5F9]"
                }`}
              >
                SME
              </Link>
              {selectedType && selectedType !== "all" && (
                <Link
                  href={buildHref(selectedStatus, searchQuery, "")}
                  className={`px-3 py-1.5 text-[12px] font-medium rounded-lg border border-red-200 dark:border-rose-900/50 bg-red-50 dark:bg-rose-950/40 text-red-600 dark:text-rose-300 hover:bg-red-100`}
                >
                  All Segments
                </Link>
              )}

              <span className="hidden sm:inline-block w-px h-4 bg-gray-200 dark:bg-[#22304A] mx-1" />

              {STATUS_FILTERS.map((status) => (
                <Link
                  key={status}
                  href={buildHref(status, searchQuery, selectedType)}
                  className={`px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-colors ${
                    selectedStatus === status
                      ? "bg-[#1e3a8a] dark:bg-[#3B82F6] text-white border-[#1e3a8a] dark:border-[#3B82F6] shadow-xs font-semibold"
                      : "bg-white dark:bg-[#162238] text-[#475569] dark:text-[#94A3B8] border-[#e2e8f0] dark:border-[#22304A] hover:border-[#3B82F6]/50 hover:text-[#0f172a] dark:hover:text-[#F1F5F9]"
                  }`}
                >
                  {status}
                </Link>
              ))}
            </div>
          </div>

          {/* Cards Stream */}
          <div>
            <IpoLoadMoreClient
              initialItems={initialFeed.items}
              initialHasMore={initialFeed.hasMore}
              initialNextCursor={initialFeed.nextCursor}
              snapshot={initialFeed.snapshot}
              status={statusFilter}
              type={typeFilter}
              q={queryFilter}
              limit={6}
            />
          </div>

          {/* Educational Content Section */}
          <div className="mt-8 bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 text-[13.5px] text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            <h2 className="text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-2.5">
              About IPO Listings in India
            </h2>
            <p className="mb-2.5">
              Initial Public Offerings (IPOs) allow companies to raise capital by offering shares to the public. Investors track open dates, price bands, <Link href="/how-ipo-allotment-works" className="text-[#2563eb] dark:text-[#3B82F6] hover:underline font-medium">allotment timelines</Link>, and listing performance to analyze market participation.
            </p>
            <p className="mb-2.5">
              IPOCraft aggregates publicly available offer data across Mainboard and SME segments. You can view indicative pricing through the <Link href="/gmp" className="text-[#2563eb] dark:text-[#3B82F6] hover:underline font-medium">IPO GMP tracker</Link> and learn about category allocation in our guide on <Link href="/qib-hni-retail-explained" className="text-[#2563eb] dark:text-[#3B82F6] hover:underline font-medium">QIB, HNI, and Retail quotas</Link>.
            </p>
            <p>
              Always review official RHP / DRHP offer documents submitted to SEBI and stock exchanges before making financial decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

