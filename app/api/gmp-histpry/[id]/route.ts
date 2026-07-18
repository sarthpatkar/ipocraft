import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("gmp_history")
    .select("*")
    .eq("ipo_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const sanitizedData = (data ?? []).map((row: any) => ({
    ...row,
    gmp: row.gmp != null ? Number(row.gmp) : 0.0,
    ipo_id: row.ipo_id != null ? Number(row.ipo_id) : 0,
  }));

  return NextResponse.json(sanitizedData);
}
