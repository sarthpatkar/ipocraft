import type { Metadata } from "next";
import Link from "next/link";
import { sortIposByNewestOpenDate } from "@/lib/ipoSort";
import { canonicalUrl } from "@/lib/site-url";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import IpoCalendarGrid from "@/components/IpoCalendarGrid";

const mrUrl = canonicalUrl("/mr/ipo-calendar");
const enUrl = canonicalUrl("/ipo-calendar");
const hiUrl = canonicalUrl("/hi/ipo-calendar");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `IPO कॅलेंडर भारत ${CURRENT_YEAR} — आगामी, खुले आणि लिस्टेड IPO तारखा | IPOCraft`,
  description:
    "आगामी, खुले आणि नुकतेच सूचीबद्ध केलेले IPO तारखा, सदस्यता विंडो, वाटप वेळापत्रक आणि लिस्टिंग माहितीसह भारताचे IPO कॅलेंडर पहा.",
  alternates: {
    canonical: mrUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
  openGraph: {
    title: `IPO कॅलेंडर भारत ${CURRENT_YEAR} — आगामी, खुले आणि लिस्टेड IPO तारखा | IPOCraft`,
    description:
      "भारतीय IPOमध्ये उघडणे, बंद होणे, वाटप आणि लिस्टिंग वेळापत्रकासह IPO टाइमलाइनचा मागोवा घ्या.",
    url: mrUrl,
    siteName: "IPOCraft",
    type: "website",
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

const STATUS_LABEL_MR: Record<string, string> = {
  Open: "खुले",
  Upcoming: "आगामी",
  Closed: "बंद",
};

export default async function IpoCalendarMarathiPage() {
  const supabase = await createSupabaseServerClient();

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2);
  const formattedDate = threeMonthsAgo.toISOString().split("T")[0];

  const { data: ipos } = await supabase
    .from("ipos")
    .select("*")
    .neq("status", "Listed")
    .or(`open_date.gte.${formattedDate},open_date.is.null`)
    .limit(300);

  const sortedIpos = sortIposByNewestOpenDate((ipos || []) as CalendarIpo[]);

  const upcoming = sortedIpos.filter((ipo) => getStatus(ipo.open_date, ipo.close_date) === "Upcoming");
  const open = sortedIpos.filter((ipo) => getStatus(ipo.open_date, ipo.close_date) === "Open");
  const closed = sortedIpos.filter((ipo) => getStatus(ipo.open_date, ipo.close_date) === "Closed");

  const calendarEvents = [...open, ...upcoming].slice(0, 40);

  return (
    <div
      lang="mr"
      className="min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] overflow-x-hidden"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {calendarEvents.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `IPO कॅलेंडर ${CURRENT_YEAR} — खुले आणि आगामी IPO`,
              itemListElement: calendarEvents.map((ipo, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Event",
                  name: `${ipo.name} IPO`,
                  url: canonicalUrl(`/ipo/${ipo.slug}`),
                  ...(ipo.open_date ? { startDate: ipo.open_date } : {}),
                  ...(ipo.close_date ? { endDate: ipo.close_date } : {}),
                  eventStatus: "https://schema.org/EventScheduled",
                  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
                  location: { "@type": "VirtualLocation", url: canonicalUrl(`/ipo/${ipo.slug}`) },
                },
              })),
            }),
          }}
        />
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-[#252A31]">
          <div>
            <p className="text-[11px] font-semibold uppercase text-blue-600 dark:text-blue-400 mb-1 tracking-wider">
              IPO टाइमलाइन आणि वेळापत्रक
            </p>
            <h1
              className="text-xl sm:text-2xl font-semibold text-[#0f172a] dark:text-[#F1F5F9] tracking-tight"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              IPO कॅलेंडर {CURRENT_YEAR}: आगामी, खुले आणि लिस्टिंग तारखा
            </h1>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-[#9AA1AA] max-w-2xl leading-relaxed">
              IPOCraft च्या IPO कॅलेंडरमध्ये भारतातील सध्या सुरू असलेले, आगामी आणि नुकतेच बंद
              झालेले सर्व IPO सूचीबद्ध आहेत. प्रत्येक नोंदीमध्ये सदस्यता विंडो, वाटप तारीख, लिस्टिंग
              तारीख, किंमत बँड आणि GMP दर्शविले आहे. डेटा मेनबोर्ड आणि SME दोन्ही विभागांसाठी आहे,
              जो दररोज अपडेट केला जातो.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[12.5px]">
            <Link href="/ipo" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              IPO डिरेक्टरी
            </Link>
            <span className="text-gray-300 dark:text-[#252A31]">|</span>
            <Link href="/mr/allotment-status" className="font-medium text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white">
              वाटप स्थिती
            </Link>
            <span className="text-gray-300 dark:text-[#252A31]">|</span>
            <Link href="/ipo-calendar" className="font-medium text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white">
              English मध्ये पाहा
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

        <div className="space-y-6 mb-8">
          <Section title="आगामी IPO" emptyText="सध्या कोणताही आगामी IPO नाही." ipos={upcoming} />
          <Section title="खुले IPO" emptyText="सध्या कोणताही खुला IPO नाही." ipos={open} />
          <Section title="बंद IPO" emptyText="सध्या कोणताही बंद IPO नाही." ipos={closed} />
        </div>

        <div className="border-t border-gray-200 dark:border-[#252A31] pt-6 grid md:grid-cols-2 gap-4 text-[12.5px] text-gray-500 dark:text-[#9AA1AA]">
          <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 shadow-xs">
            <h2 className="text-[13px] font-semibold text-gray-800 dark:text-[#F1F5F9] mb-1">
              IPO कॅलेंडर म्हणजे काय?
            </h2>
            <p>
              IPO दिनदर्शिका सार्वजनिक ऑफरिंगचे टप्पे जसे की उघडण्याची तारीख, बंद होण्याची तारीख,{" "}
              <Link href="/mr/how-ipo-allotment-works" className="text-blue-600 dark:text-blue-400 hover:underline">वाटप वेळापत्रक</Link>, आणि एक्सचेंज लिस्टिंगचा मागोवा घेते.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 shadow-xs">
            <h2 className="text-[13px] font-semibold text-gray-800 dark:text-[#F1F5F9] mb-1">
              तारखा कशा ठरवल्या जातात?
            </h2>
            <p>
              SEBIच्या मंजुरीनंतर तारखा अधिकृतपणे रेड हेरिंग प्रॉस्पेक्टस (RHP) आणि एक्सचेंज
              परिपत्रकांमध्ये जाहीर केल्या जातात.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  emptyText,
  ipos,
}: {
  title: string;
  emptyText: string;
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
          {emptyText}
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
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="min-w-0 flex-1 font-semibold text-[14px] text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">{ipo.name}</h3>

                  <span
                    className={`shrink-0 text-[9.5px] px-2 py-0.5 font-semibold uppercase rounded-md ${getBadge(status)}`}
                  >
                    {STATUS_LABEL_MR[status] ?? status}
                  </span>
                </div>

                <p className="text-[11.5px] font-medium text-[#64748b] dark:text-[#9AA1AA] mb-3 bg-gray-50 dark:bg-[#171B20] px-2.5 py-1 rounded-md inline-block border border-gray-200 dark:border-[#252A31]">
                  {ipo.open_date ?? "-"} ते {ipo.close_date ?? "-"}
                </p>

                <div className="space-y-1 text-[12.5px] text-[#475569] dark:text-[#9AA1AA]">
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-[#6B7280]">किंमत बँड</span>
                    <span className="font-medium text-[#0f172a] dark:text-[#F1F5F9]">₹{ipo.price_min ?? "-"} - ₹{ipo.price_max ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-[#6B7280]">लॉट साइज</span>
                    <span className="font-medium text-[#0f172a] dark:text-[#F1F5F9]">{ipo.lot_size ?? "-"} शेअर्स</span>
                  </div>
                  <div className="flex justify-between pt-1.5 mt-1 border-t border-gray-100 dark:border-[#252A31]">
                    <span className="text-gray-400 dark:text-[#6B7280]">अंदाजे GMP</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">{ipo.gmp ? `₹${ipo.gmp}` : "-"}</span>
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
