import Link from "next/link";
import type { Metadata } from "next";
import WatchlistFilterWrapper from "@/components/WatchlistFilterWrapper";
import BrokerList from "@/components/BrokerList";
import DataFreshnessBar from "@/components/DataFreshnessBar";
import HypeLeaderboard from "@/components/HypeLeaderboard";
import AnimatedCount from "@/components/AnimatedCount";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getIpoFeedPage } from "@/lib/ipoFeed";
import { canonicalUrl } from "@/lib/site-url";
import { calculateHypeScore } from "@/lib/hypeScore";

const hiHomeUrl = canonicalUrl("/hi");
const enHomeUrl = canonicalUrl("/");
const mrHomeUrl = canonicalUrl("/mr");

export const metadata: Metadata = {
  title: "IPOCraft — IPO GMP, सब्सक्रिप्शन और लिस्टिंग जानकारी",
  description:
    "IPOCraft के साथ IPO GMP, सब्सक्रिप्शन स्टेटस, अलॉटमेंट डेट और लिस्टिंग परफॉर्मेंस ट्रैक करें — बेहतर निवेश फ़ैसलों के लिए डेटा-आधारित IPO जानकारी।",
  keywords: [
    "IPO GMP",
    "IPO सब्सक्रिप्शन",
    "IPO अलॉटमेंट स्टेटस",
    "IPO लिस्टिंग गेन",
    "SME IPO",
    "मेनबोर्ड IPO",
  ],
  alternates: {
    canonical: hiHomeUrl,
    languages: { en: enHomeUrl, hi: hiHomeUrl, mr: mrHomeUrl, "x-default": enHomeUrl },
  },
};

function buildHomeShowMoreHref(params: { status?: string; search?: string; type?: string }) {
  const query = new URLSearchParams();
  const status = params.status?.trim();
  const type = params.type?.trim();
  const search = params.search?.trim();
  if (status && status.toLowerCase() !== "all") query.set("status", status);
  if (type && type.toLowerCase() !== "all") query.set("type", type);
  if (search) query.set("q", search);
  const queryString = query.toString();
  return queryString ? `/ipo?${queryString}` : "/ipo";
}

export default async function HomeHindiPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; type?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();

  const [ipoFeedResult, freshRecordResult, openCountResult, upcomingCountResult, topGmpResult] =
    await Promise.all([
      getIpoFeedPage({ supabase, limit: 6, status: params?.status, type: params?.type, q: params?.search }),
      supabase.from("ipos").select("updated_at").not("updated_at", "is", null).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("ipos").select("id", { count: "exact", head: true }).lte("open_date", new Date().toISOString().slice(0, 10)).gte("close_date", new Date().toISOString().slice(0, 10)),
      supabase.from("ipos").select("id", { count: "exact", head: true }).gt("open_date", new Date().toISOString().slice(0, 10)),
      supabase.from("ipos").select("name, slug, gmp, price_max, price_min").not("gmp", "is", null).gt("gmp", 0).gte("close_date", new Date().toISOString().slice(0, 10)).limit(20),
    ]);

  if (freshRecordResult.error) console.error("[hi/home] last-updated query failed:", freshRecordResult.error.message);
  if (openCountResult.error) console.error("[hi/home] open-count query failed:", openCountResult.error.message);
  if (upcomingCountResult.error) console.error("[hi/home] upcoming-count query failed:", upcomingCountResult.error.message);
  if (topGmpResult.error) console.error("[hi/home] top-GMP query failed:", topGmpResult.error.message);

  const ipoFeed = ipoFeedResult;
  const lastUpdatedAt = freshRecordResult.data?.updated_at ?? null;
  const openCount = openCountResult.count ?? 0;
  const upcomingCount = upcomingCountResult.count ?? 0;
  const activeGmpIpos = (topGmpResult.data ?? []).filter((ipo) => {
    const price = ipo.price_max ?? ipo.price_min;
    return ipo.gmp != null && price != null && Number(price) > 0;
  });

  const topGmpIpo = activeGmpIpos.sort((a, b) => {
    const priceA = Number(a.price_max ?? a.price_min);
    const priceB = Number(b.price_max ?? b.price_min);
    const pctA = (Number(a.gmp) / priceA) * 100;
    const pctB = (Number(b.gmp) / priceB) * 100;
    return pctB - pctA;
  })[0] ?? null;

  const showMoreHref = buildHomeShowMoreHref({ status: params?.status, type: params?.type, search: params?.search });
  const feedItems = ipoFeed.items;

  const topHypeItem = [...feedItems]
    .map((ipo) => ({
      ipo,
      score: calculateHypeScore({
        gmp: ipo.gmp != null ? Number(ipo.gmp) : null,
        issuePrice: ipo.price_max != null ? Number(ipo.price_max) : null,
        qibSub: ipo.sub_qib != null ? Number(ipo.sub_qib) : null,
        retailSub: ipo.sub_rii != null ? Number(ipo.sub_rii) : null,
        issueSize: ipo.issue_size != null ? Number(ipo.issue_size) : null,
      }),
    }))
    .filter((x) => x.score != null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0] ?? null;

  const topSubItem = [...feedItems].filter((ipo) => ipo.sub_total != null).sort((a, b) => parseFloat(String(b.sub_total) || "0") - parseFloat(String(a.sub_total) || "0"))[0] ?? null;
  const closingSoonItem = [...feedItems].filter((ipo) => ipo.close_date != null).sort((a, b) => (a.close_date ?? "").localeCompare(b.close_date ?? ""))[0] ?? null;

  return (
    <div lang="hi" className="min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] antialiased" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "IPOCraft",
            url: hiHomeUrl,
            inLanguage: "hi",
            description: "IPOCraft भारत में IPO GMP ट्रेंड, सब्सक्रिप्शन डेटा, अलॉटमेंट टाइमलाइन और लिस्टिंग जानकारी देने वाला रिसर्च-केंद्रित प्लेटफ़ॉर्म है।",
          }),
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-[#252A31]">
          <div>
            <p className="text-[11px] font-semibold uppercase text-blue-600 dark:text-blue-400 mb-1 tracking-wider">
              IPO रिसर्च और एनालिटिक्स
            </p>
            <h1 className="text-xl sm:text-2xl lg:text-[1.85rem] font-semibold leading-tight tracking-tight text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
              IPOCraft: IPO GMP, सब्सक्रिप्शन और टाइमलाइन ट्रैकर
            </h1>
            <p className="mt-1 text-[13.5px] text-gray-500 dark:text-[#9AA1AA]">
              मेनबोर्ड और SME इश्यू के लिए Grey Market Premium, लाइव बिडिंग मल्टीपल और अलॉटमेंट डेट ट्रैक करें।
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-[12.5px]">
            <Link href="/ipo" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">IPO डायरेक्टरी</Link>
            <span className="text-gray-300 dark:text-[#252A31]">|</span>
            <Link href="/hi/gmp" className="font-medium text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white">GMP ट्रैकर</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <Link href="/hi?status=open" className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 hover:border-gray-300 dark:hover:border-[#374151] transition-colors shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA]">लाइव इश्यू</span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                अभी खुला
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-[#F1F5F9] tabular-nums"><AnimatedCount value={openCount} /></span>
              <span className="text-[12.5px] text-gray-500 dark:text-[#9AA1AA]">{openCount === 1 ? "इश्यू बिडिंग के लिए खुला" : "इश्यू बिडिंग के लिए खुले"}</span>
            </div>
          </Link>

          <Link href="/hi?status=upcoming" className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 hover:border-gray-300 dark:hover:border-[#374151] transition-colors shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA]">पाइपलाइन</span>
              <span className="text-[11px] font-medium text-gray-500 dark:text-[#9AA1AA]">अगले 14 दिन</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-[#F1F5F9] tabular-nums"><AnimatedCount value={upcomingCount} /></span>
              <span className="text-[12.5px] text-gray-500 dark:text-[#9AA1AA]">{upcomingCount === 1 ? "आने वाला इश्यू" : "आने वाले इश्यू"}</span>
            </div>
          </Link>

          {topGmpIpo?.gmp != null && (topGmpIpo.price_max != null || topGmpIpo.price_min != null) ? (
            <Link href={`/ipo/${topGmpIpo.slug}`} className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 hover:border-gray-300 dark:hover:border-[#374151] transition-colors shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA]">सबसे ऊँचा GMP</span>
                <span className="text-[11.5px] font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">+{((Number(topGmpIpo.gmp) / Number(topGmpIpo.price_max ?? topGmpIpo.price_min)) * 100).toFixed(1)}% अनु.</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-2 min-w-0">
                <span className="text-sm font-semibold text-[#0f172a] dark:text-[#F1F5F9] truncate">{topGmpIpo.name}</span>
                <span className="text-[12px] font-medium text-gray-500 dark:text-[#9AA1AA] shrink-0 tabular-nums">GMP ₹{topGmpIpo.gmp}</span>
              </div>
            </Link>
          ) : (
            <Link href="/hi/gmp" className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 hover:border-gray-300 dark:hover:border-[#374151] transition-colors shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA]">GMP ट्रैकर</span>
                <span className="text-[11px] font-medium text-gray-500 dark:text-[#9AA1AA]">लाइव रेट</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-sm font-semibold text-[#0f172a] dark:text-[#F1F5F9]">सभी सक्रिय प्रीमियम देखें</span>
              </div>
            </Link>
          )}
        </div>

        <DataFreshnessBar lastUpdatedAt={lastUpdatedAt} syncIntervalMinutes={30} label="GMP और सब्सक्रिप्शन" />

        <div className="mt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <h2 className="text-[1.35rem] sm:text-[1.5rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F3F5]" style={{ fontFamily: "var(--font-outfit)" }}>
                नवीनतम IPO लिस्टिंग
              </h2>
              <p className="mt-1 text-[13px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed max-w-2xl">
                ऑफर डेट, प्राइस बैंड, लॉट साइज़, सब्सक्रिप्शन ट्रेंड और GMP स्नैपशॉट ट्रैक करें।
              </p>
            </div>
            <Link href="/ipo" className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-[12.5px] font-semibold px-3.5 py-1.5 rounded-md border border-gray-900 dark:border-white transition-colors shrink-0 shadow-xs">
              सभी IPO देखें
            </Link>
          </div>

          <form id="homeSearchFormHi" action="/hi" method="get" className="flex flex-col sm:flex-row gap-3 mb-4 w-full">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400 dark:text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="homeSearchInputHi"
                type="search"
                name="search"
                defaultValue={params?.search || ""}
                placeholder="कंपनी के नाम से IPO खोजें…"
                className="w-full border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#171B20] text-gray-900 dark:text-[#F1F3F5] placeholder-gray-400 dark:placeholder-[#6B7280] rounded-md pl-9 pr-3.5 py-2 text-[13px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-1 dark:focus:ring-white shadow-xs transition-colors"
              />
            </div>
          </form>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){var i=document.getElementById('homeSearchInputHi'),f=document.getElementById('homeSearchFormHi');if(!i||!f)return;var t;i.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){f.submit();},400);});})();`,
            }}
          />

          <div className="flex overflow-x-auto whitespace-nowrap gap-1.5 mb-6 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <Link href="/hi?type=mainboard" className="px-3 py-1.5 text-[12px] font-medium bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-gray-400 dark:hover:border-gray-500 rounded-md transition-colors">मेनबोर्ड</Link>
            <Link href="/hi?type=sme" className="px-3 py-1.5 text-[12px] font-medium bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-gray-400 dark:hover:border-gray-500 rounded-md transition-colors">SME</Link>
            <span className="hidden sm:inline-block w-px h-4 bg-gray-200 dark:bg-[#252A31] mx-1 self-center" />
            <Link href="/hi?status=open" className="px-3 py-1.5 text-[12px] font-medium bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-emerald-500/50 rounded-md transition-colors">खुला</Link>
            <Link href="/hi?status=upcoming" className="px-3 py-1.5 text-[12px] font-medium bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-blue-500/50 rounded-md transition-colors">आने वाला</Link>
            <Link href="/hi?status=closed" className="px-3 py-1.5 text-[12px] font-medium bg-white dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border border-gray-200 dark:border-[#252A31] hover:border-rose-500/50 rounded-md transition-colors">बंद</Link>
            <Link href="/hi" className="px-3 py-1.5 text-[12px] font-medium bg-gray-900 dark:bg-white text-white dark:text-black border border-gray-900 dark:border-white rounded-md transition-colors font-semibold shadow-xs">सभी</Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <HypeLeaderboard ipos={ipoFeed.items} />
              <WatchlistFilterWrapper initialIpos={ipoFeed.items} />
              {ipoFeed.hasMore && (
                <div className="mt-6 flex justify-center lg:justify-start">
                  <Link href={showMoreHref} className="inline-flex items-center justify-center rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 border border-gray-900 dark:border-white px-5 py-2 text-[13px] font-semibold text-white dark:text-black transition-colors shadow-xs">
                    और IPO देखें
                  </Link>
                </div>
              )}
            </div>

            <aside className="hidden lg:block space-y-3">
              {topHypeItem && (
                <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#9AA1AA] mb-2.5">सबसे ज़्यादा हाइप स्कोर</p>
                  <Link href={`/ipo/${topHypeItem.ipo.slug}`} className="group block">
                    <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2">{topHypeItem.ipo.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-[#252A31] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${topHypeItem.score}%` }} />
                      </div>
                      <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{topHypeItem.score}/100</span>
                    </div>
                  </Link>
                </div>
              )}
              {topSubItem && (
                <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#9AA1AA] mb-2.5">सबसे ज़्यादा सब्सक्राइब</p>
                  <Link href={`/ipo/${topSubItem.slug}`} className="group block">
                    <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">{topSubItem.name}</p>
                    <p className="text-[22px] font-bold text-[#1C317A] dark:text-[#F1F3F5] tabular-nums mt-1">{parseFloat(String(topSubItem.sub_total)).toFixed(1)}×</p>
                    <p className="text-[11px] text-[#64748B] dark:text-[#9AA1AA]">कुल सब्सक्रिप्शन</p>
                  </Link>
                </div>
              )}
              {closingSoonItem && (
                <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#9AA1AA] mb-2.5">जल्द बंद हो रहा</p>
                  <Link href={`/ipo/${closingSoonItem.slug}`} className="group block">
                    <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">{closingSoonItem.name}</p>
                    <p className="text-[12px] text-[#475569] dark:text-[#9AA1AA] mt-1">बंद होगा <span className="font-semibold text-rose-600 dark:text-rose-400">{closingSoonItem.close_date}</span></p>
                  </Link>
                </div>
              )}
              <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#9AA1AA] mb-3">रिसर्च गाइड</p>
                <ul className="space-y-2">
                  <li><Link href="/hi/what-is-ipo-gmp" className="text-[12.5px] text-blue-600 dark:text-blue-400 hover:underline font-medium">IPO GMP क्या है</Link></li>
                  <li><Link href="/hi/how-ipo-allotment-works" className="text-[12.5px] text-blue-600 dark:text-blue-400 hover:underline font-medium">अलॉटमेंट कैसे होता है</Link></li>
                  <li><Link href="/hi/qib-hni-retail-explained" className="text-[12.5px] text-blue-600 dark:text-blue-400 hover:underline font-medium">QIB बनाम HNI बनाम Retail</Link></li>
                </ul>
              </div>
            </aside>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-[#252A31]">
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase text-blue-600 dark:text-blue-400 tracking-wider mb-1">निर्णय टूल</p>
              <h2 className="text-[1.25rem] sm:text-[1.4rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>IPO निवेशकों के लिए टूल</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              <Link href="/ipo-allotment-probability-calculator" className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] hover:border-gray-400 dark:hover:border-gray-600 rounded-xl p-4 flex flex-col justify-between transition-colors shadow-xs group">
                <div>
                  <h4 className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">अलॉटमेंट संभावना कैलकुलेटर</h4>
                  <p className="text-[12px] text-gray-500 dark:text-[#9AA1AA] mt-1 leading-relaxed">सब्सक्रिप्शन आँकड़े डालें और अपनी रिटेल व NII अलॉटमेंट संभावना का अंदाज़ा लगाएं।</p>
                </div>
                <span className="text-[12px] font-semibold text-blue-600 dark:text-blue-400 mt-3 inline-flex items-center">संभावना कैलकुलेट करें</span>
              </Link>
              <Link href="/ipo-profit-calculator" className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] hover:border-gray-400 dark:hover:border-gray-600 rounded-xl p-4 flex flex-col justify-between transition-colors shadow-xs group">
                <div>
                  <h4 className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">लिस्टिंग प्रॉफिट एस्टिमेटर</h4>
                  <p className="text-[12px] text-gray-500 dark:text-[#9AA1AA] mt-1 leading-relaxed">प्राइस बैंड और लाइव GMP के आधार पर प्रति लॉट अनुमानित मुनाफ़ा कैलकुलेट करें।</p>
                </div>
                <span className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 mt-3 inline-flex items-center">मुनाफ़ा अनुमानित करें</span>
              </Link>
              <Link href="/compare" className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] hover:border-gray-400 dark:hover:border-gray-600 rounded-xl p-4 flex flex-col justify-between transition-colors shadow-xs group">
                <div>
                  <h4 className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">सक्रिय IPO की तुलना करें</h4>
                  <p className="text-[12px] text-gray-500 dark:text-[#9AA1AA] mt-1 leading-relaxed">3 इश्यू तक प्राइस बैंड, लॉट साइज़, सब्सक्रिप्शन डिमांड और टाइमलाइन की तुलना करें।</p>
                </div>
                <span className="text-[12px] font-semibold text-amber-600 dark:text-amber-400 mt-3 inline-flex items-center">तुलना खोलें</span>
              </Link>
            </div>
          </div>

          <div className="mt-6 bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="max-w-xl">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">मॉर्निंग मार्केट ब्रीफ</span>
              <h4 className="text-[1.1rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>सुबह 8:30 बजे रोज़ाना IPO और GMP अपडेट</h4>
              <p className="text-[13px] text-gray-500 dark:text-[#9AA1AA] mt-1">ईमेल या टेलीग्राम पर सुबह का ग्रे मार्केट डाइजेस्ट और सब्सक्रिप्शन बंद होने की सूचना पाएं।</p>
            </div>
            <Link href="/alerts" className="inline-flex items-center justify-center px-4 py-2 bg-[#1C317A] hover:bg-[#28439E] text-white text-[13px] font-semibold rounded-lg transition-colors shrink-0 shadow-xs">अलर्ट सब्सक्राइब करें</Link>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Link href="/hi/what-is-ipo-gmp" className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] hover:border-gray-400 dark:hover:border-gray-500 rounded-lg p-5 block transition-colors">
              <h3 className="text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] mb-2" style={{ fontFamily: "var(--font-outfit)" }}>IPO GMP क्या है?</h3>
              <p className="text-[13px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">Grey Market Premium (GMP) लिस्टिंग से पहले देखे गए अनौपचारिक भाव संकेत को दर्शाता है। IPOCraft यह डेटा सिर्फ़ संरचित मार्केट रिसर्च के लिए देता है।</p>
            </Link>
            <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-5">
              <h3 className="text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] mb-2" style={{ fontFamily: "var(--font-outfit)" }}>डेटा पारदर्शिता</h3>
              <p className="text-[13px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">IPOCraft सार्वजनिक फाइलिंग और आधिकारिक खुलासों से ऑफर जानकारी इकट्ठा करता है। हमेशा SEBI और स्टॉक एक्सचेंज में दाख़िल आधिकारिक ऑफर दस्तावेज़ों से पुष्टि करें।</p>
            </div>
          </div>

          <div className="mt-6 text-[12px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed bg-[#f1f5f9] dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
            IPOCraft एक फाइनेंशियल डेटा और रिसर्च प्लेटफ़ॉर्म है और SEBI के पास निवेश सलाहकार के रूप में रजिस्टर्ड नहीं है। यह कंटेंट सिर्फ़ शैक्षणिक उद्देश्य के लिए है और निवेश सलाह नहीं है।
          </div>
        </div>

        <div className="border-t border-[#e2e8f0] dark:border-[#252A31] pt-8 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <h2 className="text-[1.35rem] sm:text-[1.5rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>टॉप ब्रोकर्स</h2>
              <p className="mt-1 text-[13px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed">मुख्य ब्रोकर चार्ज की तुलना करें और वेरिफाइड अकाउंट ओपनिंग लिंक तक तुरंत पहुँचें।</p>
            </div>
            <Link href="/brokers" className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-[12.5px] font-semibold px-3.5 py-1.5 rounded-md border border-gray-900 dark:border-white transition-colors shrink-0 shadow-xs">सभी ब्रोकर देखें</Link>
          </div>
          <BrokerList limit={4} />
        </div>
      </main>
    </div>
  );
}
