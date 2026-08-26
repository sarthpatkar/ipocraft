import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import SubscriptionTableClient from "@/components/SubscriptionTableClient";
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

const subsUrl = canonicalUrl("/subscriptions");

export const metadata: Metadata = {
  title: "Live IPO Subscriptions - Real-Time QIB, NII, and Retail Demand | IPOCraft",
  description:
    "Track live IPO subscriptions today. See exact oversubscription multiples for QIB, NII, and Retail categories to predict allotment chances and listing gains.",
  keywords: [
    "IPO subscriptions",
    "Live IPO subscription status",
    "IPO QIB demand",
    "IPO NII status",
    "IPO Retail subscription",
    "IPO allotment prediction",
  ],
  alternates: {
    canonical: subsUrl,
  },
};

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    status?: string;
    type?: string;
  }>;
}) {
  const params = (await searchParams) || {};
  const filterStatus = params?.status;
  const typeFilter = params?.type;
  const supabase = await createSupabaseServerClient();

  // Fetch IPOs specifically for the subscription table
  const { data: iposData, error: iposError } = await supabase
    .from("ipos")
    .select(
      `
      id,
      name,
      slug,
      sub_qib,
      sub_nii,
      sub_shni,
      sub_bhni,
      sub_rii,
      sub_total,
      open_date,
      close_date,
      listing_date,
      ipo_type
    `
    )
    .order("close_date", { ascending: false })
    .limit(50); // Get latest 50

  if (iposError) {
    console.error("IPOS QUERY ERROR:", iposError);
  }

  const data = iposData || [];

  return (
    <div
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] antialiased`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-[#252A31]">
          <div>
            <p className="text-[11px] font-semibold uppercase text-blue-600 dark:text-blue-400 mb-1 tracking-wider">
              Subscription Demand
            </p>
            <h1
              className="text-xl sm:text-2xl font-semibold text-[#0f172a] dark:text-[#F1F5F9] tracking-tight"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Live IPO Subscription Tracker
            </h1>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-[#9AA1AA]">
              Verified bidding multiples across QIB, NII, and Retail investor categories.
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
              href="/gmp"
              className="font-medium text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white"
            >
              GMP Tracker
            </Link>
          </div>
        </div>

        {/* Educational Allotment Odds Banner */}
        <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="text-[13px] text-[#0f172a] dark:text-[#F1F5F9]">
            <span className="font-semibold text-blue-600 dark:text-blue-400">Allotment Rule:</span> In oversubscribed retail categories, allotment occurs via a computerised draw where each valid application receives 1 lottery entry.
          </div>
          <Link
            href="/ipo-allotment-probability-calculator"
            className="inline-flex items-center text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            Calculate Allotment Odds
          </Link>
        </div>

        {/* Table Section */}
        <div>
          <SubscriptionTableClient
            data={data}
            filterStatus={filterStatus}
            typeFilter={typeFilter}
          />
        </div>

        {/* SEO Subordinated Content */}
        <article className="mt-8 bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 sm:p-5 shadow-xs">
          <h2
            className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-2"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            How to Interpret IPO Subscriptions
          </h2>
          <div
            className="text-[12.5px] text-gray-500 dark:text-[#9AA1AA] leading-relaxed space-y-2"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <p>
              Subscription data reflects official demand submitted on stock exchange order books (BSE/NSE).
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <strong className="text-gray-700 dark:text-gray-300">QIB (Qualified Institutional Buyers):</strong> Mutual funds, banks, and FPIs. Heavy QIB subscription reflects institutional conviction.
              </li>
              <li>
                <strong className="text-gray-700 dark:text-gray-300">NII / HNI (Non-Institutional Investors):</strong> High net-worth individuals and corporate investors bidding above ₹2 Lakhs.
              </li>
              <li>
                <strong className="text-gray-700 dark:text-gray-300">RII (Retail Individual Investors):</strong> Bids below ₹2 Lakhs. High retail demand indicates retail market participation.
              </li>
            </ul>
          </div>
        </article>
      </main>
    </div>
  );
}
