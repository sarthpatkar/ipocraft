import { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import AllotmentClient, { AllotmentIpo } from "@/components/AllotmentClient";

export const metadata: Metadata = {
  title: "IPO Allotment Status Tracker (Live) | IPOCraft",
  description:
    "Check IPO allotment status live for recent Mainboard and SME IPOs. Find direct registrar links for Link Intime, KFintech, Bigshare, and BSE/NSE verification.",
};

export default async function AllotmentStatusPage() {
  const supabase = await createSupabaseServerClient();

  // Fetch IPOs that are closed, in allotment, or recently listed
  const { data: ipos } = await supabase
    .from("ipos")
    .select("id, name, slug, status, ipo_type, registrar, allotment_date, listing_date, price_max, price_min, allotment_out")
    .in("status", ["Closed", "closed", "Allotment", "allotment", "Listed", "listed", "Open", "open"])
    .order("allotment_date", { ascending: false, nullsFirst: false })
    .limit(60);

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
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#080D18] pt-[72px] md:pt-[84px] pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <AllotmentClient ipos={safeIpos} />
      </div>
    </main>
  );
}
