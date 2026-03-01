import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import GmpTableClient from "@/components/GmpTableClient";

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
  title: "IPO GMP Today — Grey Market Premium & Listing Insights | IPOCraft",
  description:
    "Track IPO Grey Market Premium (GMP), subscription demand, price bands, allotment dates, and listing schedules. IPOCraft provides structured IPO data for research and informational purposes.",
  keywords: [
    "IPO GMP today",
    "Grey Market Premium",
    "IPO listing gain",
    "SME IPO GMP",
    "Mainboard IPO",
    "IPO subscription data",
    "IPO allotment date",
  ],
};

function getStatus(open?: string | null, close?: string | null) {
  const today = new Date();

  if (close) {
    const closeDate = new Date(close);
    if (closeDate < today) return "Closed";
  }

  if (open) {
    const openDate = new Date(open);
    if (openDate > today) return "Upcoming";
    return "Open";
  }

  return "Upcoming";
}

function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case "open":
      return "bg-green-100 text-green-700";
    case "upcoming":
      return "bg-blue-100 text-blue-700";
    case "closed":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

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
    )
    .order("created_at", { ascending: false });

  if (iposError) {
    console.error("IPOS QUERY ERROR:", iposError);
  }

  const ipos = iposData || [];

  let gmpMap: Record<string, { latest?: number; prev?: number }> = {};

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

  function getLatestGmp(ipoId: string, fallback?: number | null) {
    const map = gmpMap[String(ipoId)] || {};
    return fallback ?? map.latest ?? null;
  }

  return (
    <div
      className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] overflow-x-hidden`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#e2e8f0] bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.4),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
            <div className="max-w-2xl">
              <h1
                className="text-xl sm:text-2xl lg:text-[2rem] font-semibold leading-[1.2]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                IPO GMP Today — Grey Market Premium & Listing Insights
              </h1>
              <p className="mt-3 text-[13.5px] sm:text-[14px] text-gray-300 leading-[1.6] max-w-xl">
                Track latest Grey Market Premium (GMP), subscription demand,
                price bands, allotment timelines, and IPO listing schedules across
                Mainboard and SME offerings. IPOCraft presents structured IPO data
                for research and informational purposes only.
              </p>

              <div className="hidden sm:flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20">
                  Data Sources: Public Market Sources
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20">
                  SEBI Filings Cross‑Check
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20">
                  Real‑Time Updates
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
                className="bg-white/10 hover:bg-white/20 transition px-5 py-2.5 rounded-lg text-sm font-medium text-center border border-white/20"
              >
                Compare Brokers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Info Row (moved from hero to reduce height) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-white border border-[#e2e8f0] shadow-sm">
            Data Sources: Public Market Sources
          </span>
          <span className="px-3 py-1 rounded-full bg-white border border-[#e2e8f0] shadow-sm">
            SEBI Filings Cross‑Check
          </span>
          <span className="px-3 py-1 rounded-full bg-white border border-[#e2e8f0] shadow-sm">
            Real‑Time Updates
          </span>
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
          <p className="text-sm text-[#475569] max-w-3xl">
            Grey Market Premium (GMP) reflects unofficial demand for IPO shares before listing.
            It is often used to estimate potential listing performance, but it is not an official
            or guaranteed indicator. Investors should always verify IPO details through SEBI filings,
            exchange disclosures, and company prospectuses before making financial decisions.
          </p>
        </div>
        {/* LEFT — TABLE */}
        <div className="lg:col-span-3 w-full min-w-0">
          {/* Filters */}
          <div className="sticky top-[70px] z-30 flex flex-wrap gap-2 mb-4 px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
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
              className="px-3 py-1.5 text-xs bg-purple-600 text-white rounded"
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
            <div className="bg-white border border-[#e2e8f0] rounded-lg p-4">
              <h3
                className="font-semibold mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Understanding IPO Grey Market Premium
              </h3>
              <p className="text-xs text-[#64748b]">
                IPO GMP reflects unofficial demand before listing and is often used to estimate potential listing gains.
              </p>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-lg p-4">
              <h3
                className="font-semibold mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                How Reliable is GMP?
              </h3>
              <p className="text-xs text-[#64748b]">
                GMP is market sentiment only. Actual listing price depends on institutional demand and market conditions.
              </p>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-lg p-4">
              <h3
                className="font-semibold mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Data Sources & Transparency
              </h3>
              <p className="text-xs text-[#64748b]">
                Data is compiled from market sources and publicly available filings for informational purposes.
              </p>
            </div>
          </div>

          <p className="mt-6 text-[12px] text-[#64748b] leading-relaxed max-w-3xl">
            Disclaimer: Grey Market Premium (GMP) figures are unofficial estimates shared for informational purposes only.
            IPOCraft is not a SEBI‑registered investment advisor or broker and does not provide investment recommendations.
            Users should verify IPO data through official filings such as SEBI, stock exchanges, and company prospectuses
            before making investment decisions. IPOCraft assumes no responsibility for financial outcomes based on this data.
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
            <p className="text-sm text-[#475569] mb-3">
              Open a demat account with trusted brokers and apply for IPOs easily.
            </p>
            <Link
              href="/brokers"
              className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded"
            >
              Compare Brokers
            </Link>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-[#e2e8f0] rounded-lg p-4">
            <h3 className="font-semibold mb-3">What is GMP?</h3>
            <p className="text-sm text-[#475569]">
              GMP (Grey Market Premium) indicates the estimated listing gain
              based on unofficial market demand before IPO listing.
            </p>
          </div>

          {/* Ad Placeholder */}
          <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center text-sm text-gray-500">
            Ad Space
          </div>
        </aside>
      </section>
    </div>
  );
}