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
  const { data, error } = await db
    .from("ipos")
    .select("id, slug, name, status, ipo_type")
    .order("open_date", { ascending: false })
    .limit(200);

  if (error) {
    console.error("[api/ipos/list] Supabase query failed:", error.message);
    // A distinguishable error shape — an empty array here would look
    // identical to "no IPOs exist" to any caller and hide a real outage.
    return NextResponse.json({ error: "Failed to load IPOs." }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
