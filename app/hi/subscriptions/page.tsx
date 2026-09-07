import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import SubscriptionTableClient from "@/components/SubscriptionTableClient";
import { canonicalUrl } from "@/lib/site-url";

const hiUrl = canonicalUrl("/hi/subscriptions");
const enUrl = canonicalUrl("/subscriptions");
const mrUrl = canonicalUrl("/mr/subscriptions");

export const metadata: Metadata = {
  title: "लाइव IPO सब्सक्रिप्शन — QIB, NII और Retail डिमांड | IPOCraft",
  description:
    "आज का लाइव IPO सब्सक्रिप्शन ट्रैक करें। QIB, NII और Retail कैटेगरी में सटीक ओवरसब्सक्रिप्शन आँकड़े देखें, अलॉटमेंट और लिस्टिंग गेन का अंदाज़ा लगाएं।",
  alternates: {
    canonical: hiUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default async function SubscriptionsHindiPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; type?: string }>;
}) {
  const params = (await searchParams) || {};
  const supabase = await createSupabaseServerClient();

  const { data: iposData, error: iposError } = await supabase
    .from("ipos")
    .select(
      `id, name, slug, sub_qib, sub_nii, sub_shni, sub_bhni, sub_rii, sub_total,
       open_date, close_date, listing_date, ipo_type`
    )
    .order("close_date", { ascending: false })
    .limit(50);

  if (iposError) console.error("[hi/subscriptions] IPOS QUERY ERROR:", iposError);

  const data = iposData || [];

  return (
    <div
      lang="hi"
      className="min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] antialiased"
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
                name: "IPO सब्सक्रिप्शन डेटा कहाँ से आता है?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "सब्सक्रिप्शन डेटा BSE/NSE के ऑर्डर बुक पर दर्ज आधिकारिक डिमांड दर्शाता है — QIB, NII और Retail कैटेगरी में अलग-अलग।",
                },
              },
            ],
          }),
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-[#252A31]">
          <div>
            <p className="text-[11px] font-semibold uppercase text-blue-600 dark:text-blue-400 mb-1 tracking-wider">
              सब्सक्रिप्शन डिमांड
            </p>
            <h1
              className="text-xl sm:text-2xl font-semibold text-[#0f172a] dark:text-[#F1F5F9] tracking-tight"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              लाइव IPO सब्सक्रिप्शन ट्रैकर
            </h1>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-[#9AA1AA]">
              QIB, NII और Retail निवेशक कैटेगरी में सत्यापित बिडिंग मल्टीपल।
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-[12.5px]">
            <Link href="/ipo" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              IPO डायरेक्टरी
            </Link>
            <span className="text-gray-300 dark:text-[#252A31]">|</span>
            <Link href="/subscriptions" className="font-medium text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white">
              English में देखें
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="text-[13px] text-[#0f172a] dark:text-[#F1F5F9]">
            <span className="font-semibold text-blue-600 dark:text-blue-400">अलॉटमेंट नियम:</span>{" "}
            ओवरसब्सक्राइब्ड रिटेल कैटेगरी में, अलॉटमेंट एक कंप्यूटराइज़्ड ड्रॉ से होता है जहाँ हर
            वैध PAN को 1 लॉट के लिए बराबर मौका मिलता है।
          </div>
          <Link
            href="/ipo-allotment-probability-calculator"
            className="inline-flex items-center text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            अलॉटमेंट संभावना कैलकुलेट करें
          </Link>
        </div>

        <div>
          <SubscriptionTableClient data={data} filterStatus={params?.status} typeFilter={params?.type} />
        </div>

        <article className="mt-8 bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 sm:p-5 shadow-xs">
          <h2
            className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-2"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            IPO सब्सक्रिप्शन को कैसे समझें
          </h2>
          <div className="text-[12.5px] text-gray-500 dark:text-[#9AA1AA] leading-relaxed space-y-2">
            <p>सब्सक्रिप्शन डेटा स्टॉक एक्सचेंज ऑर्डर बुक (BSE/NSE) पर दर्ज आधिकारिक डिमांड दर्शाता है।</p>
            <ul className="list-disc pr-4 pl-4 space-y-1">
              <li><strong className="text-gray-700 dark:text-gray-300">QIB:</strong> म्यूचुअल फंड, बैंक और FPI। ज़्यादा QIB सब्सक्रिप्शन संस्थागत भरोसे को दर्शाता है।</li>
              <li><strong className="text-gray-700 dark:text-gray-300">NII / HNI:</strong> ₹2 लाख से ज़्यादा बोली लगाने वाले हाई नेट-वर्थ और कॉर्पोरेट निवेशक।</li>
              <li><strong className="text-gray-700 dark:text-gray-300">RII (Retail):</strong> ₹2 लाख से कम की बोली। ज़्यादा रिटेल डिमांड आम निवेशकों की भागीदारी दर्शाती है।</li>
            </ul>
          </div>
        </article>
      </main>
    </div>
  );
}
