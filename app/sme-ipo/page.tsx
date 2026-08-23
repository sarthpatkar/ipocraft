import type { Metadata } from "next";
import Link from "next/link";
import { Outfit, Inter } from "next/font/google";
import IpoLoadMoreClient from "@/components/IpoLoadMoreClient";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getIpoFeedPage } from "@/lib/ipoFeed";
import { unstable_noStore as noStore } from "next/cache";
import { canonicalUrl } from "@/lib/site-url";

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

const smeIpoUrl = canonicalUrl("/sme-ipo");

const STATUS_FILTERS = ["Open", "Upcoming", "Listed", "Closed"] as const;
type StatusFilter = "All" | (typeof STATUS_FILTERS)[number];

function buildTitle(status?: string) {
  if (!status || status.toLowerCase() === "all") {
    return "SME IPO List | Latest SME IPOs in India";
  }
  return `${status} SME IPOs in India`;
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
  searchParams: Promise<{ status?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const status = params.status ?? "All";

  const baseTitle = buildTitle(status);

  return {
    title: `${baseTitle} — Live GMP, Subscriptions & Dates | IPOCraft`,
    description:
      "Track the latest SME IPOs in India. View live Grey Market Premium (GMP), daily subscription demand, price bands, and listing dates for all upcoming and current SME IPOs.",
    alternates: {
      canonical: smeIpoUrl,
    },
    openGraph: {
      title: `${baseTitle} — Live GMP & Dates | IPOCraft`,
      description:
        "The ultimate dashboard for SME IPOs. Track live GMP, exact subscription data, and key timelines.",
      url: smeIpoUrl,
      siteName: "IPOCraft",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${baseTitle} — Live GMP & Dates | IPOCraft`,
      description:
        "SME IPO dashboard with live GMP, subscription demand, and dates — IPOCraft.",
    },
  };
}

function buildHref(status: StatusFilter, search: string) {
  const params = new URLSearchParams();
  if (status !== "All") {
    params.set("status", status.toLowerCase());
  }
  if (search.trim()) {
    params.set("q", search.trim());
  }
  const query = params.toString();
  return query ? `/sme-ipo?${query}` : "/sme-ipo";
}

export default async function SMEIPOPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  noStore();
  const params = await searchParams;
  const rawStatus = (params.status ?? "").toString();
  const selectedStatus = normalizeStatus(rawStatus);
  const selectedStatusParam = selectedStatus.toLowerCase();
  const searchQuery = (params.q ?? "").toString().trim();
  const statusFilter = selectedStatus === "All" ? undefined : selectedStatus;
  const queryFilter = searchQuery || undefined;
  
  const supabase = await createSupabaseServerClient();
  const initialFeed = await getIpoFeedPage({
    supabase,
    limit: 12,
    status: statusFilter,
    type: "sme", // HARDCODED TO ONLY SME
    q: queryFilter,
  });

  return (
    <div
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] dark:bg-[#080D18] text-[#0f172a] dark:text-[#F1F5F9] antialiased overflow-x-hidden`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Hero */}
      <section className="border-b border-[#e2e8f0] dark:border-[#22304A] bg-white dark:bg-[#0D1525]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p
            className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 mb-2"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            SME IPO Segment
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.25rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Latest SME IPOs in India
          </h1>

          <p
            className="mt-2 text-sm sm:text-[14.5px] text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-2xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Small and Medium Enterprise (SME) IPOs listed on BSE SME and NSE Emerge. Track price bands, lot sizes, subscription multipliers, and indicative GMPs.
          </p>

          {/* CTA Buttons */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href="/sme-ipo?status=open"
              className="inline-flex items-center justify-center px-4 py-2 text-[13px] font-semibold text-white bg-[#1e3a8a] hover:bg-[#1a327a] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] rounded-lg shadow-xs transition-colors"
            >
              View Open SME IPOs
            </Link>

            <Link
              href="/gmp?type=sme"
              className="inline-flex items-center justify-center px-4 py-2 text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] bg-white dark:bg-[#162238] border border-gray-200 dark:border-[#22304A] rounded-lg hover:bg-gray-50 dark:hover:bg-[#1c2b47] transition-colors"
            >
              SME GMP Tracker
            </Link>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "SME IPO Hub India",
            description: "Track all SME IPOs in India with live GMP, dates, and subscription data.",
            publisher: {
              "@type": "Organization",
              name: "IPOCraft",
              url: "https://ipocraft.com",
            }
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-6">
        
        {/* Main Feed Content */}
        <div className="w-full lg:w-[70%] xl:w-[72%]">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-3.5 border-b border-gray-200 dark:border-[#22304A] gap-3">
            <div className="flex bg-[#f1f5f9] dark:bg-[#0D1525] p-1 rounded-lg border border-[#e2e8f0] dark:border-[#22304A] w-full sm:w-auto">
              <Link
                href={buildHref("All", searchQuery)}
                className={`flex-1 sm:flex-none text-center px-3 py-1.5 text-[12.5px] font-semibold rounded-md transition-colors ${
                  selectedStatus === "All"
                    ? "bg-white dark:bg-[#162238] text-[#0f172a] dark:text-[#F1F5F9] shadow-xs"
                    : "text-[#64748b] dark:text-[#94A3B8] hover:text-[#0f172a] dark:hover:text-[#F1F5F9]"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
                scroll={false}
              >
                All
              </Link>
              {STATUS_FILTERS.map((s) => (
                <Link
                  key={s}
                  href={buildHref(s, searchQuery)}
                  className={`flex-1 sm:flex-none text-center px-3 py-1.5 text-[12.5px] font-semibold rounded-md transition-colors ${
                    selectedStatus === s
                      ? "bg-white dark:bg-[#162238] text-[#0f172a] dark:text-[#F1F5F9] shadow-xs"
                      : "text-[#64748b] dark:text-[#94A3B8] hover:text-[#0f172a] dark:hover:text-[#F1F5F9]"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                  scroll={false}
                >
                  {s}
                </Link>
              ))}
            </div>
            
            <form action="/sme-ipo" method="get" className="relative w-full sm:w-[220px]">
              {selectedStatus !== "All" && (
                <input type="hidden" name="status" value={selectedStatusParam} />
              )}
              <svg className="w-4 h-4 text-gray-400 dark:text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search SME IPOs…"
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#162238] border border-gray-200 dark:border-[#22304A] text-gray-900 dark:text-[#F1F5F9] placeholder-gray-400 dark:placeholder-[#64748B] rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              />
            </form>
          </div>

          <IpoLoadMoreClient
            initialItems={initialFeed.items}
            initialHasMore={initialFeed.hasMore}
            initialNextCursor={initialFeed.nextCursor}
            snapshot={initialFeed.snapshot}
            status={statusFilter}
            type="sme"
            q={queryFilter}
            limit={12}
          />
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[30%] xl:w-[28%] space-y-4">
          <div className="bg-white dark:bg-[#11182D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 shadow-xs">
            <h3
              className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-3 uppercase tracking-wide"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              What is an SME IPO?
            </h3>
            <div className="text-[13px] text-[#475569] dark:text-[#94A3B8] leading-relaxed space-y-2.5" style={{ fontFamily: "var(--font-inter)" }}>
              <p>
                SME IPOs allow Small and Medium Enterprises to raise public capital on BSE SME or NSE Emerge platforms.
              </p>
              <ul className="pl-3.5 list-disc space-y-1.5">
                <li><strong>Lot Size:</strong> Traded in standardized large lot sizes (e.g. 1,000–3,000 shares).</li>
                <li><strong>Investment:</strong> Minimum bidding ticket size is typically ≥ ₹1 Lakh.</li>
                <li><strong>Liquidity:</strong> Appointed market makers provide two-way bid-ask quotes post listing.</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

