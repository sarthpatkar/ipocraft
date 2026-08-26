import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(req: NextRequest) {
  const slugs = req.nextUrl.searchParams.get("slugs")?.split(",").filter(Boolean).slice(0, 3) ?? [];
  if (slugs.length === 0) return NextResponse.json([]);

  const db = getSupabase();
  const { data, error } = await db
    .from("ipos")
    .select("id, slug, name, status, gmp, price_min, price_max, lot_size, issue_size, sub_total, sub_rii, sub_nii, sub_shni, sub_bhni, sub_qib, open_date, close_date, allotment_date, listing_date, ipo_type, listing_gain_percent")
    .in("slug", slugs);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const enriched = (data ?? []).map((ipo) => {
    const price = ipo.price_max || ipo.price_min || 0;
    const gmpPct = ipo.gmp != null && price > 0 ? (Number(ipo.gmp) / price) * 100 : null;
    return { ...ipo, gmp_percent: gmpPct };
  });

  return NextResponse.json(enriched);

}
