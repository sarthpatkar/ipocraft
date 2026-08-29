import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import SubscriptionTableClient from "@/components/SubscriptionTableClient";
import { canonicalUrl } from "@/lib/site-url";

const mrUrl = canonicalUrl("/mr/subscriptions");
const enUrl = canonicalUrl("/subscriptions");
const hiUrl = canonicalUrl("/hi/subscriptions");

export const metadata: Metadata = {
  title: "लाइव्ह IPO सबस्क्रिप्शन — QIB, NII आणि Retail मागणी | IPOCraft",
  description:
    "आजचे लाइव्ह IPO सबस्क्रिप्शन ट्रॅक करा. QIB, NII आणि Retail श्रेणींमध्ये अचूक ओव्हरसबस्क्रिप्शन आकडेवारी पाहा, वाटप आणि लिस्टिंग गेनचा अंदाज घ्या.",
  alternates: {
    canonical: mrUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default async function SubscriptionsMarathiPage({
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

  if (iposError) console.error("[mr/subscriptions] IPOS QUERY ERROR:", iposError);

  const data = iposData || [];

  return (
    <div
      lang="mr"
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
                name: "IPO सबस्क्रिप्शन डेटा कुठून येतो?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "सबस्क्रिप्शन डेटा BSE/NSE च्या ऑर्डर बुकवर नोंदलेली अधिकृत मागणी दर्शवतो — QIB, NII आणि Retail श्रेणींमध्ये स्वतंत्रपणे.",
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
              सबस्क्रिप्शन मागणी
            </p>
            <h1
              className="text-xl sm:text-2xl font-semibold text-[#0f172a] dark:text-[#F1F5F9] tracking-tight"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              लाइव्ह IPO सबस्क्रिप्शन ट्रॅकर
            </h1>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-[#9AA1AA]">
              QIB, NII आणि Retail गुंतवणूकदार श्रेणींमधील पडताळणी केलेले बिडिंग गुणोत्तर.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-[12.5px]">
            <Link href="/ipo" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              IPO डिरेक्टरी
            </Link>
            <span className="text-gray-300 dark:text-[#252A31]">|</span>
            <Link href="/subscriptions" className="font-medium text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white">
              English मध्ये पाहा
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-3 sm:p-3.5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="text-[13px] text-[#0f172a] dark:text-[#F1F5F9]">
            <span className="font-semibold text-blue-600 dark:text-blue-400">वाटप नियम:</span>{" "}
            ओव्हरसबस्क्राइब्ड रिटेल श्रेणीत, वाटप संगणकीकृत ड्रॉ पद्धतीने होते, जिथे प्रत्येक वैध
            PAN ला 1 लॉटसाठी समान संधी मिळते.
          </div>
          <Link
            href="/ipo-allotment-probability-calculator"
            className="inline-flex items-center text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            वाटप शक्यता मोजा
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
            IPO सबस्क्रिप्शन कसे समजून घ्यावे
          </h2>
          <div className="text-[12.5px] text-gray-500 dark:text-[#9AA1AA] leading-relaxed space-y-2">
            <p>सबस्क्रिप्शन डेटा स्टॉक एक्स्चेंज ऑर्डर बुकवर (BSE/NSE) नोंदलेली अधिकृत मागणी दर्शवतो.</p>
            <ul className="list-disc pr-4 pl-4 space-y-1">
              <li><strong className="text-gray-700 dark:text-gray-300">QIB:</strong> म्युच्युअल फंड, बँका आणि FPI. जास्त QIB सबस्क्रिप्शन संस्थात्मक विश्वास दर्शवते.</li>
              <li><strong className="text-gray-700 dark:text-gray-300">NII / HNI:</strong> ₹2 लाखांपेक्षा जास्त बोली लावणारे उच्च उत्पन्न गट व कॉर्पोरेट गुंतवणूकदार.</li>
              <li><strong className="text-gray-700 dark:text-gray-300">RII (Retail):</strong> ₹2 लाखांपेक्षा कमी बोली. जास्त रिटेल मागणी सर्वसामान्य गुंतवणूकदारांचा सहभाग दर्शवते.</li>
            </ul>
          </div>
        </article>
      </main>
    </div>
  );
}
