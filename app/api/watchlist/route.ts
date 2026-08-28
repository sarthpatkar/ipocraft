import { getServiceSupabaseClient } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// watchlists has zero RLS policies for anon/authenticated (see migration
// 20260827140000_watchlist_rls_lockdown.sql) — this route is the ONLY way
// in or out, using the service-role client (server-side only, bypasses RLS
// by design). Do not switch this back to a cookie-scoped anon client.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  const deviceId = req.nextUrl.searchParams.get("deviceId");
  if (!deviceId || !UUID_RE.test(deviceId)) return NextResponse.json({ slugs: [] });

  const supabase = getServiceSupabaseClient();
  const { data } = await supabase
    .from("watchlists")
    .select("slugs")
    .eq("device_id", deviceId)
    .maybeSingle();

  return NextResponse.json({ slugs: data?.slugs ?? [] });
}

export async function POST(req: NextRequest) {
  const { deviceId, slugs } = await req.json();
  if (!deviceId || !UUID_RE.test(deviceId) || !Array.isArray(slugs)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  // Cap payload size — a malicious client could otherwise store an unbounded array.
  const cleanSlugs = slugs.filter((s) => typeof s === "string").slice(0, 500);

  const supabase = getServiceSupabaseClient();
  const { error } = await supabase
    .from("watchlists")
    .upsert({ device_id: deviceId, slugs: cleanSlugs }, { onConflict: "device_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
