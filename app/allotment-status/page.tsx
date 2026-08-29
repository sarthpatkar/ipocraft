import { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import AllotmentClient, { AllotmentIpo } from "@/components/AllotmentClient";
import DataFreshnessBar from "@/components/DataFreshnessBar";
import { canonicalUrl } from "@/lib/site-url";

const allotmentUrl = canonicalUrl("/allotment-status");

export const metadata: Metadata = {
  title: "IPO Allotment Status Tracker (Live) | IPOCraft",
  description:
    "Check IPO allotment status live for recent Mainboard and SME IPOs. Find direct registrar links for Link Intime, KFintech, Bigshare, and BSE/NSE verification.",
  alternates: {
    canonical: allotmentUrl,
    languages: {
      en: allotmentUrl,
      hi: canonicalUrl("/hi/allotment-status"),
      mr: canonicalUrl("/mr/allotment-status"),
      "x-default": allotmentUrl,
    },
  },
};

export default async function AllotmentStatusPage() {
  const supabase = await createSupabaseServerClient();

  // Fetch IPOs that are closed, in allotment, or recently listed
  const [{ data: ipos }, { data: freshRecord, error: freshError }] = await Promise.all([
    supabase
      .from("ipos")
      .select("id, name, slug, status, ipo_type, registrar, allotment_date, listing_date, price_max, price_min, allotment_out")
      .in("status", ["Closed", "closed", "Allotment", "allotment", "Listed", "listed", "Open", "open"])
      .order("allotment_date", { ascending: false, nullsFirst: false })
      .limit(60),
    // Freshness signal for the "IPO allotment status" head term.
    supabase
      .from("ipos")
      .select("updated_at")
      .not("updated_at", "is", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (freshError) console.error("[allotment-status] last-updated query failed:", freshError.message);
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
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] py-5 sm:py-7">
      {/* FAQPage schema — targets "ipo allotment status check online" and
          registrar-name queries directly from this page. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How do I check my IPO allotment status?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Use the registrar link for that IPO (Link Intime, KFintech, or Bigshare) or the BSE/NSE verification tool on this page, and enter your PAN, application number, or Demat client ID.",
                },
              },
              {
                "@type": "Question",
                name: "When is IPO allotment status usually announced?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Allotment status is typically finalized and published 1 to 3 working days after an IPO's subscription period closes, ahead of the listing date.",
                },
              },
              {
                "@type": "Question",
                name: "What does 'Allotment Awaited' vs 'Allotment Out' mean on this page?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "'Allotment Awaited' means the allotment date has arrived but the registrar hasn't finalized results yet. 'Allotment Out' means the registrar has published results and you can check your status directly.",
                },
              },
              {
                "@type": "Question",
                name: "What if I'm not allotted any shares?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "If you aren't allotted shares, the blocked amount is released back to your bank account (ASBA) or Demat-linked account, usually within a day or two of the allotment finalization.",
                },
              },
            ],
          }),
        }}
      />
      {/* Dataset schema — freshness signal for allotment-status queries */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "IPO Allotment Status Tracker — India",
            description:
              "Live allotment status tracking, registrar links, and BSE/NSE verification for recent Mainboard and SME IPOs in India.",
            url: allotmentUrl,
            creator: { "@type": "Organization", name: "IPOCraft", url: "https://ipocraft.com" },
            dateModified: (lastUpdatedAt ? new Date(lastUpdatedAt) : new Date()).toISOString(),
            license: "https://creativecommons.org/licenses/by-nc/4.0/",
            spatialCoverage: { "@type": "Place", name: "India" },
            keywords: ["IPO allotment status", "IPO allotment check", "registrar allotment", "BSE NSE allotment"],
          }),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-4">
          <DataFreshnessBar lastUpdatedAt={lastUpdatedAt} syncIntervalMinutes={30} label="Allotment status" />
        </div>
        <AllotmentClient ipos={safeIpos} />
      </div>
    </main>
  );
}
