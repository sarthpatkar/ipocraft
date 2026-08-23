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
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] overflow-x-hidden`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Hero */}
      <section className="bg-white dark:bg-[#111418] border-b border-[#e2e8f0] dark:border-[#252A31]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-7 sm:py-9">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1.5">
                Grey Market Intelligence
              </p>
              <h1
                className="text-xl sm:text-2xl lg:text-[2rem] font-semibold text-[#0f172a] dark:text-[#F1F3F5] leading-tight"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                IPO GMP Today: Grey Market Premium &amp; Listing Insights
              </h1>
              <p className="mt-2 text-[13.5px] sm:text-[14px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed max-w-xl">
                Track verified IPO Grey Market Premium (GMP), subscription momentum, price bands, allotment timelines, and listing schedules across Mainboard and SME IPOs in India.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded-md bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-[#475569] dark:text-[#9AA1AA] font-medium">
                  Live IPO Tracking
                </span>
                <span className="px-2.5 py-1 rounded-md bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-[#475569] dark:text-[#9AA1AA] font-medium">
                  Mainboard &amp; SME Coverage
                </span>
                <span className="px-2.5 py-1 rounded-md bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] text-[#475569] dark:text-[#9AA1AA] font-medium">
                  Subscription &amp; Listing Insights
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2">
              <Link
                href="/ipo"
                className="bg-[#1e3a8a] dark:bg-blue-600 hover:bg-[#1a327a] dark:hover:bg-blue-500 text-white transition px-4.5 py-2 rounded-md text-[13px] font-semibold text-center"
              >
                View All IPOs
              </Link>
              <Link
                href="/brokers"
                className="bg-white dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F3F5] hover:bg-gray-50 dark:hover:bg-[#1F242B] transition px-4.5 py-2 rounded-md text-[13px] font-semibold text-center border border-gray-200 dark:border-[#252A31]"
              >
                Compare Brokers
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Main Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
        {/* SEO Content */}
        <div className="lg:col-span-4 mb-4">
          <h2
            className="text-[1.35rem] sm:text-[1.5rem] font-semibold mb-1 text-[#0f172a] dark:text-[#F1F3F5]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Latest IPO Grey Market Premium (GMP)
          </h2>
          <p className="text-sm text-[#475569] dark:text-[#9AA1AA] max-w-3xl leading-relaxed">
            GMP is frequently referenced to gauge demand dynamics prior to listing, but it remains unofficial and unregulated. For deeper understanding, read our <Link href="/ipo-grey-market-guide" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">IPO Grey Market Guide</Link> and <Link href="/what-is-ipo-gmp" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">IPO GMP explanation</Link>. Always verify IPO details through official exchange filings.
          </p>
        </div>
        {/* LEFT — TABLE */}
        <div className="lg:col-span-3 w-full min-w-0">
          {/* Filters */}
          <div className="sticky top-[70px] z-30 flex flex-wrap gap-1.5 mb-4 px-3 py-2 rounded-lg border border-gray-200 dark:border-[#252A31] bg-white/95 dark:bg-[#111418]/95 backdrop-blur shadow-xs">
            <Link
              href="/gmp"
              className="px-2.5 py-1 text-[12px] font-medium bg-[#1e3a8a] dark:bg-[#171B20] text-white dark:text-[#F1F3F5] border border-transparent dark:border-[#252A31] rounded-md font-semibold"
            >
              All
            </Link>
            <Link
              href="/gmp?status=open"
              className="px-2.5 py-1 text-[12px] font-medium bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-emerald-500/50 rounded-md"
            >
              Open
            </Link>
            <Link
              href="/gmp?status=upcoming"
              className="px-2.5 py-1 text-[12px] font-medium bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-blue-500/50 rounded-md"
            >
              Upcoming
            </Link>
            <Link
              href="/gmp?status=closed"
              className="px-2.5 py-1 text-[12px] font-medium bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-rose-500/50 rounded-md"
            >
              Closed
            </Link>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2 mb-4 items-center">
            <Link
              href="/gmp?sort=gmp"
              className="px-2.5 py-1 text-[12px] bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-gray-300 dark:hover:border-gray-500 rounded-md"
            >
              Highest GMP
            </Link>
            <Link
              href="/gmp?sort=sub"
              className="px-2.5 py-1 text-[12px] bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-gray-300 dark:hover:border-gray-500 rounded-md"
            >
              Most Subscribed
            </Link>
            <Link
              href="/gmp?sort=closing"
              className="px-2.5 py-1 text-[12px] bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-gray-300 dark:hover:border-gray-500 rounded-md"
            >
              Closing Soon
            </Link>
            <Link
              href="/gmp?active=1"
              className="px-2.5 py-1 text-[12px] bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-gray-300 dark:hover:border-gray-500 rounded-md"
            >
              Only Active
            </Link>
            <Link
              href="/gmp?type=mainboard"
              className="px-2.5 py-1 text-[12px] bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-gray-300 dark:hover:border-gray-500 rounded-md"
            >
              Mainboard
            </Link>
            <Link
              href="/gmp?type=sme"
              className="px-2.5 py-1 text-[12px] bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-gray-300 dark:hover:border-gray-500 rounded-md"
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
            <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4">
              <h3
                className="font-semibold mb-1 text-[#0f172a] dark:text-[#F1F3F5]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Understanding IPO Grey Market Premium
              </h3>
              <p className="text-xs text-[#64748b] dark:text-[#9AA1AA] leading-relaxed">
                IPO GMP reflects unofficial pre‑listing market sentiment. For a detailed conceptual breakdown of how grey market premiums form and how they should be interpreted responsibly, read our <Link href="/ipo-grey-market-guide" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">IPO Grey Market Guide</Link>. If you are new to the concept, you may also review our foundational explanation on <Link href="/what-is-ipo-gmp" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">what IPO GMP means</Link>.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4">
              <h3
                className="font-semibold mb-1 text-[#0f172a] dark:text-[#F1F3F5]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                How Reliable is GMP?
              </h3>
              <p className="text-xs text-[#64748b] dark:text-[#9AA1AA] leading-relaxed">
                GMP is an informal sentiment indicator and should not be treated as a pricing forecast. Actual listing outcomes depend on multiple regulated market factors beyond unofficial premium discussions.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4">
              <h3
                className="font-semibold mb-1 text-[#0f172a] dark:text-[#F1F3F5]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Data Sources &amp; Transparency
              </h3>
              <p className="text-xs text-[#64748b] dark:text-[#9AA1AA] leading-relaxed">
                Data is compiled from market sources and publicly available filings for informational purposes.
              </p>
            </div>
          </div>

          <p className="mt-6 text-[12px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed max-w-3xl">
            Disclaimer: Grey Market Premium (GMP) data shown on IPOCraft is derived from informal market discussions and publicly available sources. It is not official, not exchange‑verified, and not regulated. IPOCraft is not a SEBI‑registered investment advisor, broker, or intermediary. The platform does not provide investment advice, recommendations, or portfolio guidance. Users must conduct independent research and consult qualified financial professionals before making investment decisions. IPOCraft assumes no liability for financial losses or outcomes arising from reliance on this information.
          </p>
        </div>

        {/* RIGHT — SIDEBAR */}
        <aside className="space-y-4 lg:col-span-1 w-full min-w-0">
          {/* Apply IPO Banner */}
          <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4">
            <h3
              className="font-semibold mb-1 text-[#0f172a] dark:text-[#F1F3F5]"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Apply for IPO
            </h3>
            <p className="text-[12.5px] text-[#475569] dark:text-[#9AA1AA] mb-3 leading-relaxed">
              Open a demat account with trusted brokers and apply for IPOs easily. Review the <Link href="/how-ipo-allotment-works" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">allotment process</Link> to understand allocation rules.
            </p>
            <Link
              href="/brokers"
              className="inline-block bg-[#1e3a8a] dark:bg-blue-600 hover:bg-[#1a327a] dark:hover:bg-blue-500 text-white text-[12.5px] font-semibold px-3.5 py-1.5 rounded-md transition-colors"
            >
              Compare Brokers
            </Link>
          </div>

          {/* FAQ */}
          <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4">
            <h3 className="font-semibold mb-1.5 text-[#0f172a] dark:text-[#F1F3F5]">What is GMP?</h3>
            <p className="text-[12.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
              GMP (Grey Market Premium) indicates unofficial market sentiment before IPO listing. It is not exchange‑verified pricing. For structured learning, refer to our <Link href="/what-is-ipo-gmp" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">IPO GMP explanation guide</Link>.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
