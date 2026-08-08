import type { Metadata } from "next";
import Link from "next/link";
import { sortIposByNewestOpenDate } from "@/lib/ipoSort";
import { canonicalUrl } from "@/lib/site-url";

const ipoCalendarUrl = canonicalUrl("/ipo-calendar");

export const metadata: Metadata = {
  title:
    "IPO Calendar India 2026 — Upcoming, Open & Listed IPO Dates | IPOCraft",
  description:
    "View the IPO calendar for India with upcoming, open, and recently listed IPO dates, subscription timelines, allotment schedules, and listing information across Mainboard and SME segments.",
  keywords: [
    "IPO calendar India",
    "Upcoming IPO 2026",
    "Open IPO list",
    "IPO dates India",
    "IPO allotment date",
    "IPO listing date",
    "SME IPO calendar",
    "Mainboard IPO calendar",
  ],
  alternates: {
    canonical: ipoCalendarUrl,
  },
  openGraph: {
    title:
      "IPO Calendar India — Upcoming, Open & Listed IPO Dates | IPOCraft",
    description:
      "Track IPO timelines including opening, closing, allotment, and listing schedules across Indian IPOs.",
    url: ipoCalendarUrl,
    siteName: "IPOCraft",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "IPO Calendar India — Upcoming, Open & Listed IPO Dates | IPOCraft",
    description:
      "Latest IPO calendar with key dates and timelines across India — IPOCraft.",
  },
};

import { createSupabaseServerClient } from "@/lib/supabaseServer";
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

type CalendarIpo = {
  id: number | string;
  slug: string;
  name: string;
  open_date: string | null;
  close_date: string | null;
  price_min: number | string | null;
  price_max: number | string | null;
  lot_size: number | string | null;
  gmp: number | string | null;
};

function getStatus(openDate?: string | null, closeDate?: string | null) {
  if (!openDate || !closeDate) return "Upcoming";

  const today = new Date();
  const open = new Date(openDate);
  const close = new Date(closeDate);

  if (today < open) return "Upcoming";
  if (today >= open && today <= close) return "Open";
  if (today > close) return "Closed";

  return "Upcoming";
}

function getBadge(status: string) {
  if (status === "Open")
    return "bg-green-100 text-green-700 border border-green-200";
  if (status === "Upcoming")
    return "bg-blue-100 text-blue-700 border border-blue-200";
  return "bg-gray-100 text-gray-700 border border-gray-200";
}

export default async function IpoCalendarPage() {
  const supabase = await createSupabaseServerClient();

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const formattedDate = threeMonthsAgo.toISOString().split("T")[0];

  const { data: ipos } = await supabase
    .from("ipos")
    .select("*")
    .or(`open_date.gte.${formattedDate},open_date.is.null`);

  const sortedIpos = sortIposByNewestOpenDate((ipos || []) as CalendarIpo[]);

  const upcoming = sortedIpos.filter(
    (ipo) => getStatus(ipo.open_date, ipo.close_date) === "Upcoming"
  );

  const open = sortedIpos.filter(
    (ipo) => getStatus(ipo.open_date, ipo.close_date) === "Open"
  );

  const closed = sortedIpos.filter(
    (ipo) => getStatus(ipo.open_date, ipo.close_date) === "Closed"
  );

  return (
    <div
      className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] overflow-x-hidden`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#e2e8f0] bg-gradient-to-br from-white via-[#f8fafc] to-[#eef2ff]">
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-200 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-14 lg:py-16">
          <p className="text-sm font-semibold uppercase text-blue-600 mb-3">
            IPO Timeline India
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.4rem] font-semibold leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            IPO Calendar 2026 — Upcoming, Open & Listed IPO Dates
          </h1>

          <p className="mt-4 text-sm sm:text-[15px] text-[#475569] max-w-2xl leading-relaxed">
            Explore upcoming IPOs, ongoing IPO subscriptions, <Link href="/how-ipo-allotment-works" className="text-[#2563eb] hover:underline font-medium">allotment timelines</Link>,
            and listing schedules across Mainboard and SME segments. You can also track indicative demand sentiment using the <Link href="/gmp" className="text-[#2563eb] hover:underline font-medium">IPO GMP tracker</Link>.
            IPOCraft provides structured IPO data for research and informational purposes only.
          </p>

          {/* TRUST BADGES */}
          <div className="flex flex-wrap gap-3 mt-6 text-xs">
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              SEBI Filings Referenced
            </span>
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              Structured IPO Data
            </span>
            <span className="bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
              Research‑Focused Platform
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 space-y-12">
        <Section title="Upcoming IPOs" ipos={upcoming} />
        <Section title="Open IPOs" ipos={open} />
        <Section title="Closed IPOs" ipos={closed} />
      </section>

      {/* INFO + SEO CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6">
            <h2
              className="text-lg font-semibold mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              What is an IPO Calendar?
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              An IPO calendar tracks key public offering milestones including
              opening dates, closing dates, <Link href="/how-ipo-allotment-works" className="text-[#2563eb] hover:underline font-medium">allotment timelines</Link>, and listing schedules.
              Investors use IPO calendars alongside <Link href="/ipo-subscription-meaning" className="text-[#2563eb] hover:underline font-medium">subscription demand data</Link>
              and <Link href="/ipo-grey-market-guide" className="text-[#2563eb] hover:underline font-medium">grey market premium analysis</Link>
              to monitor opportunities in both Mainboard and SME IPOs.
            </p>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6">
            <h2
              className="text-lg font-semibold mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Data Transparency
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              IPOCraft aggregates IPO information from publicly available filings,
              exchange disclosures, and registrar announcements. For structured explanations of
              category allocation, see our <Link href="/qib-hni-retail-explained" className="text-[#2563eb] hover:underline font-medium">QIB, HNI and Retail IPO guide</Link>.
              Users should always verify details with official sources before making financial decisions.
            </p>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="mt-6 text-xs text-[#64748b] leading-relaxed bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg p-4">
          IPOCraft is an informational platform and is not registered with SEBI or any
          financial regulatory authority. This content does not constitute investment
          advice, recommendations, or solicitation. Users must conduct independent
          research and consult qualified financial advisors before investing.
        </div>
      </section>
    </div>
  );
}

function Section({
  title,
  ipos,
}: {
  title: string;
  ipos: CalendarIpo[];
}) {
  return (
    <div>
      <h2
        className="text-xl font-semibold mb-5"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h2>

      {!ipos || ipos.length === 0 ? (
        <div className="bg-white border border-dashed border-[#cbd5e1] rounded-2xl p-8 text-center text-[#64748b] text-sm shadow-sm flex flex-col items-center justify-center gap-2">
          <svg className="w-8 h-8 text-[#cbd5e1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          No {title.toLowerCase()} right now. Check back later!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {ipos.map((ipo) => {
            const status = getStatus(ipo.open_date, ipo.close_date);

            return (
              <Link
                key={ipo.id}
                href={`/ipo/${ipo.slug}`}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] group"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[15px] group-hover:text-blue-700 transition-colors">{ipo.name}</h3>

                  <span
                    className={`text-[10px] px-2.5 py-1 font-medium tracking-wide uppercase rounded-full ${getBadge(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>

                <p className="text-xs font-medium text-[#64748b] mb-4 bg-[#f8fafc] px-3 py-1.5 rounded inline-block border border-[#f1f5f9]">
                  {ipo.open_date ?? "-"} → {ipo.close_date ?? "-"}
                </p>

                <div className="space-y-1.5 text-[13px] text-[#475569]">
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Price Band</span>
                    <span className="font-medium text-[#0f172a]">₹{ipo.price_min ?? "-"} — ₹{ipo.price_max ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Lot Size</span>
                    <span className="font-medium text-[#0f172a]">{ipo.lot_size ?? "-"} shares</span>
                  </div>
                  <div className="flex justify-between pt-1.5 mt-1.5 border-t border-[#f1f5f9]">
                    <span className="text-[#94a3b8]">Indicative GMP</span>
                    <span className="font-semibold text-emerald-600">{ipo.gmp ? `₹${ipo.gmp}` : "—"}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
