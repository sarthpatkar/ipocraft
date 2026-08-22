import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const deviceId = req.nextUrl.searchParams.get("deviceId");
  if (!deviceId) return NextResponse.json({ slugs: [] });

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("watchlists")
    .select("slugs")
    .eq("device_id", deviceId)
    .maybeSingle();

  return NextResponse.json({ slugs: data?.slugs ?? [] });
}

export async function POST(req: NextRequest) {
  const { deviceId, slugs } = await req.json();
  if (!deviceId || !Array.isArray(slugs)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("watchlists")
    .upsert({ device_id: deviceId, slugs }, { onConflict: "device_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
