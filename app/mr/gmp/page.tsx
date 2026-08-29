import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import GmpTableClient from "@/components/GmpTableClient";
import DataFreshnessBar from "@/components/DataFreshnessBar";
import { sortIposByNewestOpenDate } from "@/lib/ipoSort";
import { canonicalUrl } from "@/lib/site-url";

const mrUrl = canonicalUrl("/mr/gmp");
const enUrl = canonicalUrl("/gmp");
const hiUrl = canonicalUrl("/hi/gmp");

export const metadata: Metadata = {
  title: "IPO GMP आज — Grey Market Premium, सबस्क्रिप्शन आणि लिस्टिंग तारीख | IPOCraft",
  description:
    "आजचा लाइव्ह IPO Grey Market Premium (GMP) पाहा, सबस्क्रिप्शन डेटा, किंमत बँड, वाटप तारीख आणि लिस्टिंग गेनसह — मेनबोर्ड आणि SME IPO साठी.",
  alternates: {
    canonical: mrUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default async function GMPMarathiPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; sort?: string; active?: string; type?: string }>;
}) {
  const params = (await searchParams) || {};
  const supabase = await createSupabaseServerClient();

  const [{ data: iposData, error: iposError }, { data: freshRecord, error: freshError }] =
    await Promise.all([
      supabase
        .from("ipos")
        .select(
          `id, name, slug, gmp, sub_total, price_min, price_max, lot_size, issue_size,
           open_date, close_date, allotment_date, listing_date, created_at, ipo_type`
        ),
      supabase
        .from("ipos")
        .select("updated_at")
        .not("updated_at", "is", null)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  if (iposError) console.error("[mr/gmp] IPOS QUERY ERROR:", iposError);
  if (freshError) console.error("[mr/gmp] last-updated query failed:", freshError.message);

  const ipos = sortIposByNewestOpenDate(iposData || []);
  const lastUpdatedAt = freshRecord?.updated_at ?? null;

  const gmpMap: Record<string, { latest?: number; prev?: number }> = {};
  if (ipos?.length) {
    const ids = ipos.map((i) => Number(i.id));
    const { data: history } = await supabase
      .from("gmp_history")
      .select("ipo_id, gmp, created_at")
      .in("ipo_id", ids)
      .order("created_at", { ascending: false });
    history?.forEach((row) => {
      const key = String(row.ipo_id);
      if (!gmpMap[key]) gmpMap[key] = { latest: row.gmp };
      else if (gmpMap[key].prev === undefined) gmpMap[key].prev = row.gmp;
    });
  }

  return (
    <div
      lang="mr"
      className="min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9] overflow-x-hidden"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "IPO GMP म्हणजे काय?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "IPO GMP म्हणजेच Grey Market Premium, IPO शेअर्सचा लिस्टिंगपूर्वी अनधिकृत ग्रे मार्केटमध्ये ठरणारा प्रीमियम आहे. हे गुंतवणूकदारांची भावना दर्शवते, हमखास लिस्टिंग किंमत नाही.",
                },
              },
              {
                "@type": "Question",
                name: "आजचा GMP डेटा लाइव्ह आहे का?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "होय, IPOCraft सर्व खुल्या, आगामी आणि नुकत्याच लिस्ट झालेल्या मेनबोर्ड आणि SME IPO चे GMP आकडे दिवसातून अनेकदा अद्ययावत करते.",
                },
              },
            ],
          }),
        }}
      />
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-4">
        <DataFreshnessBar lastUpdatedAt={lastUpdatedAt} syncIntervalMinutes={30} label="IPO GMP डेटा" />
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-[#252A31]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              ग्रे मार्केट माहिती
            </p>
            <h1
              className="text-xl sm:text-2xl font-semibold text-[#0f172a] dark:text-[#F1F5F9] tracking-tight"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              IPO GMP आज: Grey Market Premium आणि लिस्टिंग माहिती
            </h1>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-[#9AA1AA] max-w-2xl leading-relaxed">
              IPOCraft भारतातील सर्व सक्रिय मेनबोर्ड आणि SME IPO चा लाइव्ह Grey Market Premium
              (GMP) ट्रॅक करते. GMP म्हणजे लिस्टिंगपूर्वी शेअर्सचा अनधिकृत प्रीमियम — तो बाजाराची
              भावना दर्शवतो, हमखास लिस्टिंग किंमत नाही. खाली सर्व खुल्या, आगामी आणि नुकत्याच लिस्ट
              झालेल्या IPO चा डेटा आहे.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-[12.5px]">
            <Link href="/ipo" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              IPO डिरेक्टरी
            </Link>
            <span className="text-gray-300 dark:text-[#252A31]">|</span>
            <Link href="/gmp" className="font-medium text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white">
              English मध्ये पाहा
            </Link>
          </div>
        </div>

        <div className="w-full">
          <GmpTableClient data={ipos} gmpMap={gmpMap} filterStatus={params?.status} sort={params?.sort} activeOnly={params?.active === "1"} typeFilter={params?.type} />
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-[#252A31] pt-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 shadow-xs">
              <h2 className="font-semibold text-xs text-[#0f172a] dark:text-[#F1F5F9] uppercase tracking-wider mb-1">
                IPO GMP समजून घ्या
              </h2>
              <p className="text-[12.5px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed">
                IPO GMP हे अनधिकृत, लिस्टिंगपूर्व बाजार भावना दर्शवते. सविस्तर माहिती{" "}
                <Link href="/mr/ipo-grey-market-guide" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ग्रे मार्केट मार्गदर्शक
                </Link>{" "}
                किंवा{" "}
                <Link href="/mr/what-is-ipo-gmp" className="text-blue-600 dark:text-blue-400 hover:underline">
                  GMP म्हणजे काय
                </Link>{" "}
                यात वाचा.
              </p>
            </div>
            <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 shadow-xs">
              <h2 className="font-semibold text-xs text-[#0f172a] dark:text-[#F1F5F9] uppercase tracking-wider mb-1">
                GMP विश्वासार्ह आहे का?
              </h2>
              <p className="text-[12.5px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed">
                GMP हे एक अनधिकृत भावना निर्देशक आहे, त्याला निश्चित किंमत मानू नये. प्रत्यक्ष
                लिस्टिंग किंमत बाजाराच्या स्थितीवर अवलंबून असते.
              </p>
            </div>
          </div>
          <p className="text-[11.5px] text-gray-500 dark:text-[#9AA1AA] leading-relaxed">
            डिस्क्लेमर: IPOCraft वर दाखवलेला Grey Market Premium (GMP) डेटा अनधिकृत आणि
            सार्वजनिक स्रोतांमधून घेतला आहे. तो अधिकृत किंवा एक्स्चेंज-प्रमाणित नाही. IPOCraft
            SEBI कडे नोंदणीकृत गुंतवणूक सल्लागार नाही.
          </p>
        </div>
      </main>
    </div>
  );
}
