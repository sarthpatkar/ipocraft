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
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-11 flex items-center gap-2">
          <Link
            href="/"
            className="text-[11.5px] text-[#94a3b8] hover:text-[#0f172a] transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Home
          </Link>
          <svg
            className="w-3 h-3 text-[#cbd5e1]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span
            className="text-[11.5px] text-[#0f172a] font-medium"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Live Subscriptions
          </span>
        </div>
      </div>

      {/* ── Header ── */}
      <section className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 text-center">
          <h1
            className="text-2xl sm:text-[2rem] font-semibold text-[#0f172a] tracking-tight mb-3"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Live Subscription Tracker
          </h1>
          <p className="text-[14.5px] sm:text-[15.5px] text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Monitor real-time demand across institutional, high-net-worth, and retail categories. 
            Smart money flows (QIB) are often the strongest indicator of a successful listing.
          </p>
        </div>
      </section>

      {/* ── Table Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 pb-24">
        <SubscriptionTableClient
          data={data}
          filterStatus={filterStatus}
          typeFilter={typeFilter}
        />

        {/* SEO Content */}
        <article className="mt-16 bg-white border border-[#e2e8f0] rounded-xl p-8 shadow-sm">
          <h2
            className="text-[1.3rem] font-semibold text-[#0f172a] mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            How to Interpret IPO Subscriptions
          </h2>
          <div
            className="prose prose-sm prose-slate max-w-none text-[14px]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <p className="mb-4">
              Subscription data reveals the exact market demand for an IPO. Unlike Grey Market Premium (GMP) which is unofficial and subject to manipulation, subscription numbers are verified by the exchanges (BSE/NSE).
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6 text-[#475569]">
              <li>
                <strong>QIB (Qualified Institutional Buyers):</strong> Banks, mutual funds, and FIIs. They usually bid on the final day. High QIB demand (&gt;50x) indicates smart money is highly confident in the company&apos;s valuation.
              </li>
              <li>
                <strong>NII (Non-Institutional Investors):</strong> High Net-Worth Individuals (HNIs). This category is often split into sNII (bids below ₹10L) and bNII (bids above ₹10L). HNIs use leverage to apply for IPOs, meaning high demand here usually aligns with high listing gains.
              </li>
              <li>
                <strong>Retail:</strong> Retail investors applying up to ₹2 Lakhs. Overwhelming retail demand often indicates massive public hype, but does not always guarantee a successful listing if institutions do not support the issue.
              </li>
            </ul>
          </div>
        </article>
      </section>
    </div>
  );
}
