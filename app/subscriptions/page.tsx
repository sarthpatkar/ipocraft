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
  title: "Live IPO Subscriptions — Real-Time QIB, NII, and Retail Demand | IPOCraft",
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
      {/* ── Breadcrumb ── */}
      <div className="bg-white dark:bg-[#111418] border-b border-[#e2e8f0] dark:border-[#252A31]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center gap-2">
          <Link
            href="/"
            className="text-[11.5px] text-[#94a3b8] dark:text-[#9AA1AA] hover:text-[#0f172a] dark:hover:text-[#F1F5F9] transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Home
          </Link>
          <svg
            className="w-3 h-3 text-[#cbd5e1] dark:text-[#6B7280]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span
            className="text-[11.5px] text-[#0f172a] dark:text-[#F1F3F5] font-medium"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Live Subscriptions
          </span>
        </div>
      </div>

      {/* ── Header ── */}
      <section className="bg-white dark:bg-[#111418] border-b border-[#e2e8f0] dark:border-[#252A31]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 text-center">
          <p className="text-[11px] font-semibold uppercase text-blue-600 dark:text-blue-400 mb-1.5 tracking-wider">
            Subscription Analytics
          </p>
          <h1
            className="text-2xl sm:text-3xl md:text-[2.2rem] font-semibold text-[#0f172a] dark:text-[#F1F3F5] tracking-tight mb-2"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Live IPO Subscription Tracker
          </h1>
          <p className="text-sm sm:text-[14.5px] text-[#475569] dark:text-[#9AA1AA] max-w-xl mx-auto leading-relaxed">
            Monitor verified exchange bidding across institutional (QIB), non-institutional (NII), and retail investor categories.
          </p>
        </div>
      </section>

      {/* ── Table Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-16">
        <SubscriptionTableClient
          data={data}
          filterStatus={filterStatus}
          typeFilter={typeFilter}
        />

        {/* SEO Content */}
        <article className="mt-8 bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-5 sm:p-6 shadow-xs">
          <h2
            className="text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-3"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            How to Interpret IPO Subscriptions
          </h2>
          <div
            className="prose prose-sm prose-slate dark:prose-invert max-w-none text-[13px]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <p className="mb-3 text-[#475569] dark:text-[#9AA1AA]">
              Subscription data reflects official demand submitted on stock exchange order books (BSE/NSE).
            </p>
            <ul className="list-disc pl-4 space-y-1.5 text-[#475569] dark:text-[#9AA1AA]">
              <li>
                <strong>QIB (Qualified Institutional Buyers):</strong> Mutual funds, banks, and FPIs. Heavy QIB subscription (&gt;30x) typically reflects institutional conviction.
              </li>
              <li>
                <strong>NII / HNI (Non-Institutional Investors):</strong> High net-worth individuals and corporate investors bidding above ₹2 Lakhs.
              </li>
              <li>
                <strong>RII (Retail Individual Investors):</strong> Bids below ₹2 Lakhs. High retail demand indicates retail market enthusiasm.
              </li>
            </ul>
          </div>
        </article>
      </section>
    </div>
  );
}
