import Link from "next/link";
import { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import AllotmentClient, { AllotmentIpo } from "@/components/AllotmentClient";
import DataFreshnessBar from "@/components/DataFreshnessBar";
import { canonicalUrl } from "@/lib/site-url";

const hiUrl = canonicalUrl("/hi/allotment-status");
const enUrl = canonicalUrl("/allotment-status");
const mrUrl = canonicalUrl("/mr/allotment-status");

export const metadata: Metadata = {
  title: "IPO अलॉटमेंट स्टेटस लाइव चेक करें | IPOCraft",
  description:
    "हाल के मेनबोर्ड और SME IPO का अलॉटमेंट स्टेटस लाइव चेक करें। Link Intime, KFintech, Bigshare और BSE/NSE वेरिफिकेशन के सीधे लिंक।",
  alternates: {
    canonical: hiUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default async function AllotmentStatusHindiPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: ipos }, { data: freshRecord, error: freshError }] = await Promise.all([
    supabase
      .from("ipos")
      .select("id, name, slug, status, ipo_type, registrar, allotment_date, listing_date, price_max, price_min, allotment_out")
      .in("status", ["Closed", "closed", "Allotment", "allotment", "Listed", "listed", "Open", "open"])
      .order("allotment_date", { ascending: false, nullsFirst: false })
      .limit(60),
    supabase
      .from("ipos")
      .select("updated_at")
      .not("updated_at", "is", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (freshError) console.error("[hi/allotment-status] last-updated query failed:", freshError.message);
  const lastUpdatedAt = freshRecord?.updated_at ?? null;

  const safeIpos: AllotmentIpo[] = (ipos ?? []).map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    slug: String(row.slug),
    status: row.status ? String(row.status) : null,
    ipo_type: row.ipo_type ? String(row.ipo_type) : null,
    registrar: row.registrar ? String(row.registrar) : null,
    allotment_date: row.allotment_date ? String(row.allotment_date) : null,
    listing_date: row.listing_date ? String(row.listing_date) : null,
    price_max: row.price_max ? Number(row.price_max) : null,
    price_min: row.price_min ? Number(row.price_min) : null,
    allotment_out: row.allotment_out ?? null,
  }));

  return (
    <main lang="hi" className="min-h-screen bg-[#F8FAFC] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] py-5 sm:py-7">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "IPO अलॉटमेंट स्टेटस कैसे चेक करें?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "उस IPO के रजिस्ट्रार लिंक (Link Intime, KFintech, या Bigshare) या इस पेज पर दिए गए BSE/NSE वेरिफिकेशन टूल का इस्तेमाल करें, और अपना PAN, आवेदन नंबर या डीमैट क्लाइंट ID डालें।",
                },
              },
              {
                "@type": "Question",
                name: "IPO अलॉटमेंट स्टेटस आमतौर पर कब आता है?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "अलॉटमेंट आमतौर पर सब्सक्रिप्शन बंद होने के 1 से 3 कार्य दिवसों के भीतर फ़ाइनल होता है, लिस्टिंग से ठीक पहले।",
                },
              },
            ],
          }),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-4">
          <DataFreshnessBar lastUpdatedAt={lastUpdatedAt} syncIntervalMinutes={30} label="अलॉटमेंट स्टेटस" />
        </div>
        <div className="flex items-center justify-end mb-2 text-[12.5px]">
          <Link href="/allotment-status" className="font-medium text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white">
            English में देखें
          </Link>
        </div>
        <AllotmentClient
          ipos={safeIpos}
          eyebrow="अलॉटमेंट स्टेटस"
          title="IPO अलॉटमेंट स्टेटस: लाइव चेक करें"
          subtitle="हाल के मेनबोर्ड और SME IPO के लिए सीधे रजिस्ट्रार लिंक और BSE/NSE आवेदन वेरिफिकेशन।"
        />
      </div>
    </main>
  );
}
