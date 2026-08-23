import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import GmpTableClient from "@/components/GmpTableClient";
import { sortIposByNewestOpenDate } from "@/lib/ipoSort";
import { canonicalUrl } from "@/lib/site-url";

import { Outfit, Inter } from "next/font/google";

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

const gmpUrl = canonicalUrl("/gmp");

export const metadata: Metadata = {
  title: "IPO GMP Today — Grey Market Premium, Subscription & Listing Dates India | IPOCraft",
  description:
    "Check latest IPO Grey Market Premium (GMP) today with subscription data, price bands, allotment dates, and expected listing gains for Mainboard and SME IPOs. Updated regularly by IPOCraft.",
  keywords: [
    "IPO GMP today",
    "Grey Market Premium India",
    "IPO listing gain",
    "SME IPO GMP",
    "Mainboard IPO GMP",
    "IPO subscription status",
    "IPO allotment date",
    "IPO listing date",
  ],
  alternates: {
    canonical: gmpUrl,
  },
  openGraph: {
    title:
      "IPO GMP Today — Grey Market Premium & Listing Insights India | IPOCraft",
    description:
      "Track IPO GMP today with subscription demand, price bands, and listing timelines across Mainboard and SME IPOs.",
    url: gmpUrl,
    siteName: "IPOCraft",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "IPO GMP Today — Grey Market Premium & Listing Insights India | IPOCraft",
    description:
      "Latest IPO GMP today with subscription data and listing insights — IPOCraft.",
  },
};

export default async function GMPPage({
  searchParams,
}: {
  searchParams?: Promise<{
    status?: string;
    sort?: string;
    active?: string;
    type?: string;
  }>;
}) {
  const params = (await searchParams) || {};
  const filterStatus = params?.status;
  const sort = params?.sort;
  const activeOnly = params?.active === "1";
  const typeFilter = params?.type;
  const supabase = await createSupabaseServerClient();

  const { data: iposData, error: iposError } = await supabase
    .from("ipos")
    .select(
      `
      id,
      name,
      slug,
      gmp,
      sub_total,
      price_min,
      price_max,
      issue_size,
      open_date,
      close_date,
      allotment_date,
      listing_date,
      created_at,
      ipo_type
    `
    );

  if (iposError) {
    console.error("IPOS QUERY ERROR:", iposError);
  }

  const ipos = sortIposByNewestOpenDate(iposData || []);

  const gmpMap: Record<string, { latest?: number; prev?: number }> = {};

  if (ipos?.length) {
    const ids = ipos.map((i) => Number(i.id)); // FIX: bigint FK expects numeric ids

    const { data: history, error: historyError } = await supabase
      .from("gmp_history")
      .select("ipo_id, gmp, created_at")
      .in("ipo_id", ids)
      .order("created_at", { ascending: false });

    if (historyError) {
      console.error("GMP HISTORY ERROR:", historyError);
    }

    history?.forEach((row) => {
      const key = String(row.ipo_id);
      if (!gmpMap[key]) {
        gmpMap[key] = { latest: row.gmp };
      } else if (gmpMap[key] && gmpMap[key].prev === undefined) {
        gmpMap[key].prev = row.gmp;
      }
    });
  }

  return (
    <div
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-[#0f172a] dark:text-slate-100 overflow-x-hidden`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Hero */}
      <section className="bg-white dark:bg-[#0D1525] border-b border-[#e2e8f0] dark:border-[#22304A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
            <div className="max-w-2xl">
              <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-blue-600 dark:text-[#3B82F6] mb-2">
                Grey Market Intelligence
              </p>
              <h1
                className="text-xl sm:text-2xl lg:text-[2rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-tight"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                IPO GMP Today — Grey Market Premium &amp; Listing Insights
              </h1>
              <p className="mt-3 text-[13.5px] sm:text-[14px] text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-xl">
                Track verified IPO Grey Market Premium (GMP), subscription momentum, price bands, allotment timelines, and listing schedules across Mainboard and SME IPOs in India.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded-md bg-gray-50 dark:bg-[#162238] border border-gray-200 dark:border-[#22304A] text-[#475569] dark:text-[#94A3B8] font-medium">
                  Live IPO Tracking
                </span>
                <span className="px-2.5 py-1 rounded-md bg-gray-50 dark:bg-[#162238] border border-gray-200 dark:border-[#22304A] text-[#475569] dark:text-[#94A3B8] font-medium">
                  Mainboard &amp; SME Coverage
                </span>
                <span className="px-2.5 py-1 rounded-md bg-gray-50 dark:bg-[#162238] border border-gray-200 dark:border-[#22304A] text-[#475569] dark:text-[#94A3B8] font-medium">
                  Subscription &amp; Listing Insights
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2">
              <Link
                href="/ipo"
                className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2.5 rounded-lg text-sm font-medium text-center"
              >
                View All IPOs
              </Link>
              <Link
                href="/brokers"
                className="bg-white dark:bg-[#111827]/10 hover:bg-white dark:bg-[#111827]/20 transition px-5 py-2.5 rounded-lg text-sm font-medium text-center border border-white/20"
              >
                Compare Brokers
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Main Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
        {/* SEO Content */}
        <div className="lg:col-span-4 mb-6">
          <h2
            className="text-[1.35rem] sm:text-[1.5rem] font-semibold mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Latest IPO Grey Market Premium (GMP)
          </h2>
          <p className="text-sm text-[#475569] dark:text-slate-400 max-w-3xl">
            GMP is frequently referenced to gauge demand dynamics prior to listing, but it remains unofficial and unregulated. For deeper understanding, read our <Link href="/ipo-grey-market-guide" className="text-blue-600 hover:underline font-medium">IPO Grey Market Guide</Link> and <Link href="/what-is-ipo-gmp" className="text-blue-600 hover:underline font-medium">IPO GMP explanation</Link>. Always verify IPO details through official exchange filings.
          </p>
        </div>
        {/* LEFT — TABLE */}
        <div className="lg:col-span-3 w-full min-w-0">
          {/* Filters */}
          <div className="sticky top-[70px] z-30 flex flex-wrap gap-2 mb-4 px-3 py-2 rounded-lg border border-[#e2e8f0] dark:border-[#1e293b] bg-white dark:bg-[#111827]/80 backdrop-blur supports-[backdrop-filter]:bg-white dark:bg-[#111827]/60 shadow-sm">
            <Link
              href="/gmp"
              className="px-3 py-1.5 text-xs font-medium bg-black text-white rounded"
            >
              All
            </Link>
            <Link
              href="/gmp?status=open"
              className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded"
            >
              Open
            </Link>
            <Link
              href="/gmp?status=upcoming"
              className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded"
            >
              Upcoming
            </Link>
            <Link
              href="/gmp?status=closed"
              className="px-3 py-1.5 text-xs font-medium bg-gray-600 text-white rounded"
            >
              Closed
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mt-3 mb-4 items-center">
            <Link
              href="/gmp?sort=gmp"
              className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded"
            >
              Highest GMP
            </Link>
            <Link
              href="/gmp?sort=sub"
              className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded"
            >
              Most Subscribed
            </Link>
            <Link
              href="/gmp?sort=closing"
              className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded"
            >
              Closing Soon
            </Link>
            <Link
              href="/gmp?active=1"
              className="px-3 py-1.5 text-xs bg-orange-600 text-white rounded"
            >
              Only Active
            </Link>
            <Link
              href="/gmp?type=mainboard"
              className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded"
            >
              Mainboard
            </Link>
            <Link
              href="/gmp?type=sme"
              className="px-3 py-1.5 text-xs bg-amber-600 dark:bg-amber-700 text-white rounded"
            >
              SME
            </Link>
          </div>

          {/* GMP Table (Client Component for instant filtering & performance) */}
          <GmpTableClient
            data={ipos}
            gmpMap={gmpMap}
            filterStatus={filterStatus}
            sort={sort}
            activeOnly={activeOnly}
            typeFilter={typeFilter}
          />

          {/* Info Section */}
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg p-4">
              <h3
                className="font-semibold mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Understanding IPO Grey Market Premium
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400">
                IPO GMP reflects unofficial pre‑listing market sentiment. For a detailed conceptual breakdown of how grey market premiums form and how they should be interpreted responsibly, read our <Link href="/ipo-grey-market-guide" className="text-blue-600 hover:underline font-medium">IPO Grey Market Guide</Link>. If you are new to the concept, you may also review our foundational explanation on <Link href="/what-is-ipo-gmp" className="text-blue-600 hover:underline font-medium">what IPO GMP means</Link>.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg p-4">
              <h3
                className="font-semibold mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                How Reliable is GMP?
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400">
                GMP is an informal sentiment indicator and should not be treated as a pricing forecast. Actual listing outcomes depend on multiple regulated market factors beyond unofficial premium discussions.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg p-4">
              <h3
                className="font-semibold mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Data Sources & Transparency
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400">
                Data is compiled from market sources and publicly available filings for informational purposes.
              </p>
            </div>
          </div>

          <p className="mt-6 text-[12px] text-[#64748b] dark:text-slate-400 leading-relaxed max-w-3xl">
            Disclaimer: Grey Market Premium (GMP) data shown on IPOCraft is derived from informal market discussions and publicly available sources. It is not official, not exchange‑verified, and not regulated. IPOCraft is not a SEBI‑registered investment advisor, broker, or intermediary. The platform does not provide investment advice, recommendations, or portfolio guidance. Users must conduct independent research and consult qualified financial professionals before making investment decisions. IPOCraft assumes no liability for financial losses or outcomes arising from reliance on this information.
          </p>
        </div>

        {/* RIGHT — SIDEBAR */}
        <aside className="space-y-6 lg:col-span-1 w-full min-w-0">
          {/* Apply IPO Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3
              className="font-semibold mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Apply for IPO
            </h3>
            <p className="text-sm text-[#475569] dark:text-slate-400 mb-3">
              Open a demat account with trusted brokers and apply for IPOs easily. Before applying, you may review the <Link href="/how-ipo-allotment-works" className="text-blue-700 hover:underline font-medium">IPO allotment process</Link> to understand how share allocation works.
            </p>
            <Link
              href="/brokers"
              className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded"
            >
              Compare Brokers
            </Link>
          </div>

          {/* FAQ */}
          <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg p-4">
            <h3 className="font-semibold mb-3">What is GMP?</h3>
            <p className="text-sm text-[#475569] dark:text-slate-400">
              GMP (Grey Market Premium) indicates unofficial market sentiment before IPO listing. It is not exchange‑verified pricing. For structured learning, refer to our <Link href="/what-is-ipo-gmp" className="text-blue-600 hover:underline font-medium">IPO GMP explanation guide</Link> and the more advanced <Link href="/ipo-grey-market-guide" className="text-blue-600 hover:underline font-medium">Grey Market analysis article</Link>.
            </p>
          </div>

          {/* Ad Placeholder */}
          <div className="bg-gray-100 dark:bg-[#1e293b] border border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center text-sm text-gray-500 dark:text-slate-400">
            Ad Space
          </div>
        </aside>
      </section>
    </div>
  );
}
