import type { Metadata } from "next";
import Link from "next/link";
import { sortIposByNewestOpenDate } from "@/lib/ipoSort";
import { canonicalUrl } from "@/lib/site-url";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import IpoCalendarGrid from "@/components/IpoCalendarGrid";

const ipoCalendarUrl = canonicalUrl("/ipo-calendar");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title:
    `IPO Calendar India ${CURRENT_YEAR} — Upcoming, Open & Listed IPO Dates | IPOCraft`,
  description:
    "View the IPO calendar for India with upcoming, open, and recently listed IPO dates, subscription timelines, allotment schedules, and listing information across Mainboard and SME segments.",
  keywords: [
    "IPO calendar India",
    `Upcoming IPO ${CURRENT_YEAR}`,
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
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2);
  const formattedDate = threeMonthsAgo.toISOString().split("T")[0];

  // Calendar is for upcoming/open/recently-closed IPOs, not the full
  // historical archive (see /ipo-history for that). The old
  // `.or(open_date.is.null)` clause pulled in every row with a null
  // open_date regardless of age — harmless when the table was ~25 rows,
  // but with a 600+-row historical backfill this became an effectively
  // unbounded query. Scope to status so historical "Listed" rows (which
  // won't legitimately have a null open_date going forward, but old/
  // incomplete ones might) can't leak in here.
  const { data: ipos } = await supabase
    .from("ipos")
    .select("*")
    .neq("status", "Listed")
    .or(`open_date.gte.${formattedDate},open_date.is.null`)
    .limit(300);

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
      className="min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] overflow-x-hidden"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-[#252A31]">
          <div>
            <p className="text-[11px] font-semibold uppercase text-blue-600 dark:text-blue-400 mb-1 tracking-wider">
              IPO Timelines &amp; Schedules
            </p>
            <h1
              className="text-xl sm:text-2xl font-semibold text-[#0f172a] dark:text-[#F1F5F9] tracking-tight"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              IPO Calendar {CURRENT_YEAR}: Upcoming, Open &amp; Listing Dates
            </h1>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-[#9AA1AA] max-w-2xl leading-relaxed">
              IPOCraft&apos;s IPO Calendar lists all currently open, upcoming, and recently closed IPOs in India. Each entry shows subscription window, allotment date, listing date, price band, and GMP. Data covers both Mainboard and SME segments, updated daily.
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
              href="/allotment-status"
              className="font-medium text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white"
            >
              Allotment Status
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-2xl p-4 sm:p-6 shadow-xs mb-8">
          <IpoCalendarGrid ipos={(ipos || []).map((ipo: any) => ({
            slug: ipo.slug,
            name: ipo.name,
            open_date: ipo.open_date,
            close_date: ipo.close_date,
            listing_date: ipo.listing_date,
            allotment_date: ipo.allotment_date,
            gmp: ipo.gmp,
            price_min: ipo.price_min,
            price_max: ipo.price_max,
            ipo_type: ipo.ipo_type,
          }))} />
        </div>

        {/* LIST SECTIONS */}
        <div className="space-y-6 mb-8">
          <Section title="Upcoming IPOs" ipos={upcoming} />
          <Section title="Open IPOs" ipos={open} />
          <Section title="Closed IPOs" ipos={closed} />
        </div>

        {/* SUBORDINATED FOOTNOTE */}
        <div className="border-t border-gray-200 dark:border-[#252A31] pt-6 grid md:grid-cols-2 gap-4 text-[12.5px] text-gray-500 dark:text-[#9AA1AA]">
          <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 shadow-xs">
            <h2 className="text-[13px] font-semibold text-gray-800 dark:text-[#F1F5F9] mb-1">
              What is an IPO Calendar?
            </h2>
            <p>
              An IPO calendar tracks public offering milestones including opening dates, closing dates, <Link href="/how-ipo-allotment-works" className="text-blue-600 dark:text-blue-400 hover:underline">allotment schedules</Link>, and exchange listings.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 shadow-xs">
            <h2 className="text-[13px] font-semibold text-gray-800 dark:text-[#F1F5F9] mb-1">
              How are Dates Determined?
            </h2>
            <p>
              Dates are officially announced in the Red Herring Prospectus (RHP) and exchange circulars upon SEBI approval.
            </p>
          </div>
        </div>
      </main>
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
        className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-4"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {title}
      </h2>

      {!ipos || ipos.length === 0 ? (
        <div className="bg-white dark:bg-[#111418] border border-dashed border-gray-300 dark:border-[#252A31] rounded-lg p-6 text-center text-[#64748b] dark:text-[#9AA1AA] text-sm">
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
                className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 hover:border-gray-400 dark:hover:border-gray-500 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[14px] text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">{ipo.name}</h3>

                  <span
                    className={`text-[9.5px] px-2 py-0.5 font-semibold uppercase rounded-md ${getBadge(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>

                <p className="text-[11.5px] font-medium text-[#64748b] dark:text-[#9AA1AA] mb-3 bg-gray-50 dark:bg-[#171B20] px-2.5 py-1 rounded-md inline-block border border-gray-200 dark:border-[#252A31]">
                  {ipo.open_date ?? "-"} to {ipo.close_date ?? "-"}
                </p>

                <div className="space-y-1 text-[12.5px] text-[#475569] dark:text-[#9AA1AA]">
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-[#6B7280]">Price Band</span>
                    <span className="font-medium text-[#0f172a] dark:text-[#F1F5F9]">₹{ipo.price_min ?? "-"} - ₹{ipo.price_max ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-[#6B7280]">Lot Size</span>
                    <span className="font-medium text-[#0f172a] dark:text-[#F1F5F9]">{ipo.lot_size ?? "-"} shares</span>
                  </div>
                  <div className="flex justify-between pt-1.5 mt-1 border-t border-gray-100 dark:border-[#252A31]">
                    <span className="text-gray-400 dark:text-[#6B7280]">Indicative GMP</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{ipo.gmp ? `₹${ipo.gmp}` : "-"}</span>
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
