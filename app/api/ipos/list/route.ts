import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  const db = getSupabase();
  const { data } = await db
    .from("ipos")
    .select("id, slug, name, status, ipo_type")
    .order("open_date", { ascending: false })
    .limit(200);
  return NextResponse.json(data ?? []);
}
