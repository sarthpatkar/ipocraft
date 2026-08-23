import { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import PerformanceClient, { PerformanceIpo } from "@/components/PerformanceClient";

export const metadata: Metadata = {
  title: "IPO Performance Tracker & Returns (Live) | IPOCraft",
  description:
    "Track historical post-listing performance and returns for Indian Mainboard and SME IPOs. Compare issue price vs listing price gains.",
};

export default async function PerformancePage() {
  const supabase = await createSupabaseServerClient();

  const { data: ipos } = await supabase
    .from("ipos")
    .select("id, name, slug, ipo_type, price_min, price_max, issue_price, listing_price, listing_date, listing_gain")
    .in("status", ["Listed", "listed"])
    .order("listing_date", { ascending: false, nullsFirst: false })
    .limit(100);

  const safeIpos: PerformanceIpo[] = (ipos ?? []).map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    slug: String(row.slug),
    ipo_type: row.ipo_type ? String(row.ipo_type) : null,
    price_min: row.price_min ? Number(row.price_min) : null,
    price_max: row.price_max ? Number(row.price_max) : null,
    issue_price: row.issue_price ? Number(row.issue_price) : null,
    listing_price: row.listing_price ? Number(row.listing_price) : null,
    listing_date: row.listing_date ? String(row.listing_date) : null,
    listing_gain: row.listing_gain ? String(row.listing_gain) : null,
  }));

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F3F5] py-5 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PerformanceClient ipos={safeIpos} />
      </div>
    </main>
  );
}
