import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
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

  const { data: ipos } = await supabase
    .from("ipos")
    .select("*")
    .order("open_date", { ascending: true });

  const upcoming = ipos?.filter(
    (ipo) => getStatus(ipo.open_date, ipo.close_date) === "Upcoming"
  );

  const open = ipos?.filter(
    (ipo) => getStatus(ipo.open_date, ipo.close_date) === "Open"
  );

  const closed = ipos?.filter(
    (ipo) => getStatus(ipo.open_date, ipo.close_date) === "Closed"
  );

  return (
    <div
      className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a]`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#e2e8f0] bg-gradient-to-br from-white via-[#f8fafc] to-[#eef2ff]">
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-200 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-14 lg:py-16">
          <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-[#2563eb] mb-3">
            IPO Timeline India
          </p>

          <h1
            className="text-2xl sm:text-3xl lg:text-[2.4rem] font-semibold leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            IPO Calendar 2026 — Upcoming, Open & Listed IPO Dates
          </h1>

          <p className="mt-4 text-sm sm:text-[15px] text-[#475569] max-w-2xl leading-relaxed">
            Explore upcoming IPOs, ongoing IPO subscriptions, allotment timelines,
            and listing schedules across Mainboard and SME segments in India.
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
              opening dates, closing dates, allotment timelines, and listing schedules.
              Investors use IPO calendars to monitor opportunities and plan participation
              across Mainboard and SME IPOs.
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
              exchange disclosures, and registrar announcements. Users should always
              verify details with official sources before making financial decisions.
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

function Section({ title, ipos }: any) {
  if (!ipos || ipos.length === 0) return null;

  return (
    <div>
      <h2
        className="text-xl font-semibold mb-5"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {ipos.map((ipo: any) => {
          const status = getStatus(ipo.open_date, ipo.close_date);

          return (
            <Link
              key={ipo.id}
              href={`/ipo/${ipo.slug}`}
              className="bg-white border border-[#e2e8f0] rounded-lg p-4 sm:p-5 hover:shadow-md transition hover:-translate-y-[1px] active:scale-[0.99]"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-[15px]">{ipo.name}</h3>

                <span
                  className={`text-[10px] px-2 py-1 rounded ${getBadge(
                    status
                  )}`}
                >
                  {status}
                </span>
              </div>

              <p className="text-xs text-[#64748b]">
                {ipo.open_date ?? "-"} → {ipo.close_date ?? "-"}
              </p>

              <div className="mt-3 space-y-1 text-sm">
                <p>
                  Price: ₹{ipo.price_min ?? "-"} — ₹{ipo.price_max ?? "-"}
                </p>

                <p>Lot: {ipo.lot_size ?? "-"}</p>

                <p>GMP: {ipo.gmp ? `₹${ipo.gmp}` : "-"}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}