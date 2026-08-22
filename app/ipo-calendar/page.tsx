import type { Metadata } from "next";
import Link from "next/link";
import { sortIposByNewestOpenDate } from "@/lib/ipoSort";
import { canonicalUrl } from "@/lib/site-url";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import IpoCalendarGrid from "@/components/IpoCalendarGrid";

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
  return "bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700";
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
      className="min-h-screen bg-[#f8fafc] dark:bg-[#080D18] text-[#0f172a] dark:text-[#F1F5F9] overflow-x-hidden"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* HERO */}
      <section className="border-b border-[#e2e8f0] dark:border-[#22304A] bg-white dark:bg-[#0D1525]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-[10.5px] font-semibold uppercase text-blue-600 dark:text-[#3B82F6] mb-2 tracking-wide">
            IPO Timelines &amp; Schedules
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.25rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            IPO Calendar 2026 — Upcoming, Open &amp; Listing Dates
          </h1>

          <p className="mt-2 text-sm sm:text-[14.5px] text-[#475569] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
            Explore upcoming IPO issue dates, bidding windows, <Link href="/how-ipo-allotment-works" className="text-[#2563eb] dark:text-[#3B82F6] hover:underline font-medium">allotment timelines</Link>, and stock exchange listing dates across Mainboard and SME segments.
          </p>

          {/* TRUST BADGES */}
          <div className="flex flex-wrap gap-2 mt-4 text-[11px]">
            <span className="bg-[#f1f5f9] dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] text-gray-700 dark:text-[#94A3B8] px-2.5 py-1 rounded-md">
              SEBI Disclosures Referenced
            </span>
            <span className="bg-[#f1f5f9] dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] text-gray-700 dark:text-[#94A3B8] px-2.5 py-1 rounded-md">
              Timeline Calendar
            </span>
          </div>
        </div>
      </section>

      {/* CALENDAR GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-4 sm:p-6 shadow-xs">
          <IpoCalendarGrid ipos={(ipos || []).map((ipo: any) => ({
            slug: ipo.slug,
            name: ipo.name,
            open_date: ipo.open_date,
            close_date: ipo.close_date,
            listing_date: ipo.listing_date,
            allotment_date: ipo.allotment_date,
            gmp: ipo.gmp,
          }))} />
        </div>
      </section>

      {/* LIST SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-8">
        <Section title="Upcoming IPOs" ipos={upcoming} />
        <Section title="Open IPOs" ipos={open} />
        <Section title="Closed IPOs" ipos={closed} />
      </section>

      {/* INFO + SEO CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5">
            <h2
              className="text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-2"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              What is an IPO Calendar?
            </h2>
            <p className="text-[13px] text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              An IPO calendar tracks public offering milestones including opening dates, closing dates, <Link href="/how-ipo-allotment-works" className="text-[#2563eb] dark:text-[#3B82F6] hover:underline font-medium">allotment schedules</Link>, and exchange listings.
            </p>
          </div>

          <div className="bg-white dark:bg-[#11182D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5">
            <h2
              className="text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-2"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Data Transparency
            </h2>
            <p className="text-[13px] text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              IPOCraft aggregates offer information from publicly available filings and exchange disclosures. Review official DRHP/RHP filings before making financial decisions.
            </p>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="mt-4 text-[12px] text-[#64748b] dark:text-[#94A3B8] leading-relaxed bg-[#f1f5f9] dark:bg-[#0D1525] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-4">
          IPOCraft is an informational research platform and is not registered with SEBI. Content does not constitute financial or investment advice.
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
        className="text-[1.25rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-4"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {title}
      </h2>

      {!ipos || ipos.length === 0 ? (
        <div className="bg-white dark:bg-[#11182D] border border-dashed border-[#cbd5e1] dark:border-[#22304A] rounded-xl p-6 text-center text-[#64748b] dark:text-[#94A3B8] text-sm">
          No {title.toLowerCase()} right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ipos.map((ipo) => {
            const status = getStatus(ipo.open_date, ipo.close_date);

            return (
              <Link
                key={ipo.id}
                href={`/ipo/${ipo.slug}`}
                className="bg-white dark:bg-[#11182D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-4.5 hover:border-[#3B82F6]/50 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[14px] text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-[#3B82F6] transition-colors">{ipo.name}</h3>

                  <span
                    className={`text-[9.5px] px-2 py-0.5 font-semibold uppercase rounded ${getBadge(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>

                <p className="text-[11.5px] font-medium text-[#64748b] dark:text-[#94A3B8] mb-3 bg-[#f8fafc] dark:bg-[#162238] px-2.5 py-1 rounded inline-block border border-[#f1f5f9] dark:border-[#22304A]">
                  {ipo.open_date ?? "-"} → {ipo.close_date ?? "-"}
                </p>

                <div className="space-y-1 text-[12.5px] text-[#475569] dark:text-[#94A3B8]">
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8] dark:text-[#64748B]">Price Band</span>
                    <span className="font-medium text-[#0f172a] dark:text-[#F1F5F9]">₹{ipo.price_min ?? "-"} — ₹{ipo.price_max ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8] dark:text-[#64748B]">Lot Size</span>
                    <span className="font-medium text-[#0f172a] dark:text-[#F1F5F9]">{ipo.lot_size ?? "-"} shares</span>
                  </div>
                  <div className="flex justify-between pt-1.5 mt-1 border-t border-[#f1f5f9] dark:border-[#22304A]">
                    <span className="text-[#94a3b8] dark:text-[#64748B]">Indicative GMP</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{ipo.gmp ? `₹${ipo.gmp}` : "—"}</span>
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

