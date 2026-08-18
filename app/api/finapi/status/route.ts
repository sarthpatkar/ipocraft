import { NextResponse } from "next/server";
import { getRateLimitStatus } from "@/lib/finapi/client";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { count: ipoCount } = await supabase
      .from("ipos")
      .select("*", { count: "exact", head: true });

    const { data: latestUpdated } = await supabase
      .from("ipos")
      .select("updated_at, subscription_updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const rateLimit = getRateLimitStatus();

    return NextResponse.json({
      status: "active",
      rateLimit,
      totalIpos: ipoCount ?? 0,
      lastSyncAt: latestUpdated?.updated_at || null,
      lastSubscriptionSyncAt: latestUpdated?.subscription_updated_at || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch status" },
      { status: 500 }
    );
  }
}
