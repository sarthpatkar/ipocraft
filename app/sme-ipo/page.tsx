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
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased overflow-x-hidden`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >

      {/* Animated Hero */}
      <section className="relative overflow-hidden border-b border-[#e2e8f0]">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#f3e8ff] via-white to-[#fdf4ff] animate-[gradientShift_12s_ease_infinite]" />
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-fuchsia-200 rounded-full blur-3xl opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-16">
          <p
            className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-purple-700 mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            SME IPO Hub
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.5rem] font-semibold leading-[1.15] tracking-[-0.01em] text-[#0f172a]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Latest SME IPOs in India
          </h1>

          <p
            className="mt-4 text-[14.5px] text-[#475569] leading-[1.78] max-w-3xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Small and Medium Enterprise (SME) IPOs often see massive oversubscription and high listing gains. Track live GMP, live subscriptions, and expert ratings for all active SME issues.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/sme-ipo?status=open"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-purple-700 rounded-lg shadow hover:shadow-md hover:bg-purple-800 transition"
            >
              View Open SME IPOs
            </Link>

            <Link
              href="/gmp?type=sme"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-purple-700 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition"
            >
              SME GMP Tracker
            </Link>
          </div>
        </div>

        <style>{`
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          div[class*="gradient-to"] {
            background-size: 200% 200%;
          }
        `}</style>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 pb-20 flex flex-col lg:flex-row gap-8 sm:gap-10">
        
        {/* Main Feed Content */}
        <div className="w-full lg:w-[70%] xl:w-[72%]">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-200 gap-4">
            <div className="flex bg-[#f1f5f9] p-1 rounded-lg w-full sm:w-auto">
              <Link
                href={buildHref("All", searchQuery)}
                className={`flex-1 sm:flex-none text-center px-4 py-1.5 text-[13px] font-semibold rounded-md transition-all duration-200 ${
                  selectedStatus === "All"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-[#64748b] hover:text-[#0f172a]"
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
                  className={`flex-1 sm:flex-none text-center px-4 py-1.5 text-[13px] font-semibold rounded-md transition-all duration-200 ${
                    selectedStatus === s
                      ? "bg-white text-purple-700 shadow-sm"
                      : "text-[#64748b] hover:text-[#0f172a]"
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
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search SME IPOs..."
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
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
        <aside className="w-full lg:w-[30%] xl:w-[28%] space-y-8 mt-10 lg:mt-0">
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
            <h3
              className="text-[14px] font-semibold text-[#0f172a] mb-4 uppercase tracking-wide"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              What is an SME IPO?
            </h3>
            <div className="prose prose-sm prose-slate text-[13.5px] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              <p>
                SME IPOs allow Small and Medium Enterprises to raise capital from the public and get listed on the SME platforms of BSE (BSE SME) or NSE (NSE Emerge).
              </p>
              <ul className="pl-4 space-y-2 mt-3">
                <li><strong>Lot Size:</strong> SME IPOs are traded in larger lot sizes (e.g., 1000, 2000 shares).</li>
                <li><strong>Investment:</strong> The minimum investment amount is typically above ₹1 Lakh.</li>
                <li><strong>Volatility:</strong> They often see massive listing gains but are highly volatile and illiquid compared to Mainboard IPOs.</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
