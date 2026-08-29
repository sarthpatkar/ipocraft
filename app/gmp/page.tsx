import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import GmpTableClient from "@/components/GmpTableClient";
import PushOptIn from "@/components/PushOptIn";
import DataFreshnessBar from "@/components/DataFreshnessBar";
import { sortIposByNewestOpenDate } from "@/lib/ipoSort";
import { canonicalUrl } from "@/lib/site-url";




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
    languages: {
      en: gmpUrl,
      hi: canonicalUrl("/hi/gmp"),
      mr: canonicalUrl("/mr/gmp"),
      "x-default": gmpUrl,
    },
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
      lot_size,
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

  // Freshness signal for the "IPO GMP today" head term — same pattern as
  // the homepage's DataFreshnessBar, scoped to whichever row moved last.
  const { data: freshRecord, error: freshError } = await supabase
    .from("ipos")
    .select("updated_at")
    .not("updated_at", "is", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (freshError) console.error("[gmp] last-updated query failed:", freshError.message);
  const lastUpdatedAt = freshRecord?.updated_at ?? null;

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

  const renderTimestamp = new Date().toISOString();

  return (
    <div
      className={`min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] overflow-x-hidden`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Dataset schema — freshness signal for "IPO GMP today" queries */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "IPO Grey Market Premium (GMP) Today — India",
            description:
              "Live Grey Market Premium (GMP) data for all active Mainboard and SME IPOs in India. Includes subscription status, price band, allotment date, and expected listing gain. Updated multiple times daily.",
            url: "https://ipocraft.com/gmp",
            creator: {
              "@type": "Organization",
              name: "IPOCraft",
              url: "https://ipocraft.com",
            },
            dateModified: renderTimestamp,
            license: "https://creativecommons.org/licenses/by-nc/4.0/",
            temporalCoverage: "2024/..",
            spatialCoverage: { "@type": "Place", name: "India" },
            keywords: [
              "IPO GMP",
              "Grey Market Premium",
              "IPO subscription",
              "IPO listing gain",
              "SME IPO",
              "Mainboard IPO",
            ],
          }),
        }}
      />
      {/* FAQPage schema — targets the "GMP full form", "is GMP reliable"
          class of queries directly from the /gmp page itself. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is IPO GMP?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "IPO GMP stands for Grey Market Premium — the unofficial premium at which IPO shares trade before listing on the exchange. It reflects investor sentiment, not a guaranteed listing price.",
                },
              },
              {
                "@type": "Question",
                name: "Is today's IPO GMP data live?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. IPOCraft updates GMP figures for all open, upcoming, and recently listed Mainboard and SME IPOs multiple times daily as new market data comes in.",
                },
              },
              {
                "@type": "Question",
                name: "How is IPO GMP different from the subscription figure?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Subscription data is official demand reported by BSE/NSE from Retail, NII, and QIB investors. GMP is an unofficial, unregulated grey-market indicator tracked separately and shown alongside subscription data on this page.",
                },
              },
              {
                "@type": "Question",
                name: "Can I rely on GMP to decide whether to apply for an IPO?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. GMP is speculative and not SEBI-regulated. Use it as one sentiment signal alongside subscription trends, company fundamentals, and official filings — not as a standalone investment decision.",
                },
              },
            ],
          }),
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Compact Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-[#252A31]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              Grey Market Intelligence
            </p>
            <h1
              className="text-xl sm:text-2xl font-semibold text-[#0f172a] dark:text-[#F1F5F9] tracking-tight"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              IPO GMP Today: Grey Market Premium &amp; Listing Insights
            </h1>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-[#9AA1AA] max-w-2xl leading-relaxed">
              IPOCraft tracks live Grey Market Premium (GMP) for all active Mainboard and SME IPOs in India. GMP is the unofficial premium at which IPO shares trade before official listing — it reflects market sentiment but is not a guaranteed listing price. Updated multiple times daily. Data below covers all open, upcoming, and recently listed IPOs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[12.5px]">
            <Link
              href="/ipo"
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              IPO Directory
            </Link>
            <span className="text-gray-300 dark:text-[#252A31]">|</span>
            <Link
              href="/brokers"
              className="font-medium text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white"
            >
              Compare Brokers
            </Link>
          </div>
        </div>

        <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-4">
          <DataFreshnessBar lastUpdatedAt={lastUpdatedAt} syncIntervalMinutes={30} label="IPO GMP data" />
        </div>

        <div className="mb-4">
          <PushOptIn />
        </div>

        {/* Primary GMP Table with 2-Level Filter Ribbon */}
        <div className="w-full">
          <GmpTableClient
            data={ipos}
            gmpMap={gmpMap}
            filterStatus={filterStatus}
            sort={sort}
            activeOnly={activeOnly}
            typeFilter={typeFilter}
          />
        </div>

        {/* Subordinated Educational Footers */}
        <div className="mt-12 border-t border-gray-200 dark:border-[#252A31] pt-6 space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 shadow-xs">
              <h2
                className="font-semibold text-xs text-[#0f172a] dark:text-[#F1F5F9] uppercase tracking-wider mb-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Understanding IPO GMP
              </h2>
              <p className="text-[12.5px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed">
                IPO GMP reflects unofficial pre‑listing market sentiment. Read our <Link href="/ipo-grey-market-guide" className="text-blue-600 dark:text-blue-400 hover:underline">IPO Grey Market Guide</Link> or foundational <Link href="/what-is-ipo-gmp" className="text-blue-600 dark:text-blue-400 hover:underline">GMP explanation</Link>.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 shadow-xs">
              <h2
                className="font-semibold text-xs text-[#0f172a] dark:text-[#F1F5F9] uppercase tracking-wider mb-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                How Reliable is GMP?
              </h2>
              <p className="text-[12.5px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed">
                GMP is an informal sentiment indicator and should not be treated as a definitive pricing forecast. Actual listing outcomes depend on market conditions.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 shadow-xs">
              <h2
                className="font-semibold text-xs text-[#0f172a] dark:text-[#F1F5F9] uppercase tracking-wider mb-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Data Verification
              </h2>
              <p className="text-[12.5px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed">
                Compiled from market sources for informational analysis. Cross-reference with SEBI offer documents before financial commitments.
              </p>
            </div>
          </div>

          <p className="text-[11.5px] text-gray-500 dark:text-[#9AA1AA] leading-relaxed">
            Disclaimer: Grey Market Premium (GMP) data shown on IPOCraft is derived from informal market discussions and publicly available sources. It is not official, not exchange‑verified, and not regulated. IPOCraft is not a SEBI‑registered investment advisor.
          </p>
        </div>
      </main>
    </div>
  );
}
