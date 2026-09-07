import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import GmpTableClient from "@/components/GmpTableClient";
import DataFreshnessBar from "@/components/DataFreshnessBar";
import { sortIposByNewestOpenDate } from "@/lib/ipoSort";
import { canonicalUrl } from "@/lib/site-url";

const hiUrl = canonicalUrl("/hi/gmp");
const enUrl = canonicalUrl("/gmp");
const mrUrl = canonicalUrl("/mr/gmp");

export const metadata: Metadata = {
  title: "IPO GMP आज — Grey Market Premium, सब्सक्रिप्शन और लिस्टिंग डेट | IPOCraft",
  description:
    "आज का लाइव IPO Grey Market Premium (GMP) देखें, सब्सक्रिप्शन डेटा, प्राइस बैंड, अलॉटमेंट डेट और लिस्टिंग गेन के साथ — मेनबोर्ड और SME IPO के लिए।",
  alternates: {
    canonical: hiUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default async function GMPHindiPage({
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

  if (iposError) console.error("[hi/gmp] IPOS QUERY ERROR:", iposError);
  if (freshError) console.error("[hi/gmp] last-updated query failed:", freshError.message);

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
      lang="hi"
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
                name: "IPO GMP क्या है?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "IPO GMP यानी Grey Market Premium, IPO शेयरों का लिस्टिंग से पहले अनौपचारिक ग्रे मार्केट में तय होने वाला प्रीमियम है। यह निवेशक की भावना दर्शाता है, गारंटीशुदा लिस्टिंग भाव नहीं।",
                },
              },
              {
                "@type": "Question",
                name: "क्या आज का GMP डेटा लाइव है?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "हाँ, IPOCraft सभी खुले, आने वाले और हाल ही में लिस्ट हुए मेनबोर्ड और SME IPO के GMP आँकड़े दिन में कई बार अपडेट करता है।",
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
              ग्रे मार्केट इंटेलिजेंस
            </p>
            <h1
              className="text-xl sm:text-2xl font-semibold text-[#0f172a] dark:text-[#F1F5F9] tracking-tight"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              IPO GMP आज: Grey Market Premium और लिस्टिंग जानकारी
            </h1>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-[#9AA1AA] max-w-2xl leading-relaxed">
              IPOCraft भारत के सभी सक्रिय मेनबोर्ड और SME IPO का लाइव Grey Market Premium (GMP)
              ट्रैक करता है। GMP लिस्टिंग से पहले शेयरों का अनौपचारिक प्रीमियम है — यह मार्केट
              सेंटिमेंट दर्शाता है, गारंटीशुदा लिस्टिंग भाव नहीं। नीचे सभी खुले, आने वाले और हाल
              में लिस्ट हुए IPO का डेटा है।
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-[12.5px]">
            <Link href="/ipo" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              IPO डायरेक्टरी
            </Link>
            <span className="text-gray-300 dark:text-[#252A31]">|</span>
            <Link href="/gmp" className="font-medium text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white">
              English में देखें
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
                IPO GMP को समझें
              </h2>
              <p className="text-[12.5px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed">
                IPO GMP अनौपचारिक, लिस्टिंग-पूर्व मार्केट सेंटिमेंट दर्शाता है। पूरी जानकारी{" "}
                <Link href="/hi/ipo-grey-market-guide" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ग्रे मार्केट गाइड
                </Link>{" "}
                या{" "}
                <Link href="/hi/what-is-ipo-gmp" className="text-blue-600 dark:text-blue-400 hover:underline">
                  GMP क्या है
                </Link>{" "}
                में पढ़ें।
              </p>
            </div>
            <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 shadow-xs">
              <h2 className="font-semibold text-xs text-[#0f172a] dark:text-[#F1F5F9] uppercase tracking-wider mb-1">
                क्या GMP भरोसेमंद है?
              </h2>
              <p className="text-[12.5px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed">
                GMP एक अनौपचारिक सेंटिमेंट इंडिकेटर है, इसे तय भाव नहीं मानना चाहिए। असली लिस्टिंग
                भाव बाज़ार की स्थिति पर निर्भर करता है।
              </p>
            </div>
          </div>
          <p className="text-[11.5px] text-gray-500 dark:text-[#9AA1AA] leading-relaxed">
            डिस्क्लेमर: IPOCraft पर दिखाया गया Grey Market Premium (GMP) डेटा अनौपचारिक और
            सार्वजनिक स्रोतों से लिया गया है। यह आधिकारिक या एक्सचेंज-सत्यापित नहीं है। IPOCraft
            SEBI के पास रजिस्टर्ड निवेश सलाहकार नहीं है।
          </p>
        </div>
      </main>
    </div>
  );
}
