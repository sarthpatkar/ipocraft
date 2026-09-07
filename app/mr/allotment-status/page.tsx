import Link from "next/link";
import { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import AllotmentClient, { AllotmentIpo } from "@/components/AllotmentClient";
import DataFreshnessBar from "@/components/DataFreshnessBar";
import { canonicalUrl } from "@/lib/site-url";

const mrUrl = canonicalUrl("/mr/allotment-status");
const enUrl = canonicalUrl("/allotment-status");
const hiUrl = canonicalUrl("/hi/allotment-status");

export const metadata: Metadata = {
  title: "IPO वाटप स्थिती लाइव्ह तपासा | IPOCraft",
  description:
    "अलीकडील मेनबोर्ड आणि SME IPO ची वाटप स्थिती लाइव्ह तपासा. Link Intime, KFintech, Bigshare आणि BSE/NSE पडताळणीसाठी थेट लिंक.",
  alternates: {
    canonical: mrUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default async function AllotmentStatusMarathiPage() {
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

  if (freshError) console.error("[mr/allotment-status] last-updated query failed:", freshError.message);
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
    <main lang="mr" className="min-h-screen bg-[#F8FAFC] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] py-5 sm:py-7">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "IPO वाटप स्थिती कशी तपासावी?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "त्या IPO च्या रजिस्ट्रार लिंकचा (Link Intime, KFintech, किंवा Bigshare) किंवा या पानावरील BSE/NSE पडताळणी साधनाचा वापर करा, आणि तुमचा PAN, अर्ज क्रमांक किंवा डिमॅट क्लायंट ID टाका.",
                },
              },
              {
                "@type": "Question",
                name: "IPO वाटप स्थिती साधारणतः कधी येते?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "वाटप साधारणतः सबस्क्रिप्शन बंद झाल्यानंतर 1 ते 3 कार्यदिवसांत अंतिम होते, लिस्टिंगच्या अगदी आधी.",
                },
              },
            ],
          }),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-4">
          <DataFreshnessBar lastUpdatedAt={lastUpdatedAt} syncIntervalMinutes={30} label="वाटप स्थिती" />
        </div>
        <div className="flex items-center justify-end mb-2 text-[12.5px]">
          <Link href="/allotment-status" className="font-medium text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-white">
            English मध्ये पाहा
          </Link>
        </div>
        <AllotmentClient
          ipos={safeIpos}
          eyebrow="वाटप स्थिती"
          title="IPO वाटप स्थिती: लाइव्ह तपासा"
          subtitle="अलीकडील मेनबोर्ड आणि SME IPO साठी थेट रजिस्ट्रार लिंक आणि BSE/NSE अर्ज पडताळणी."
        />
      </div>
    </main>
  );
}
