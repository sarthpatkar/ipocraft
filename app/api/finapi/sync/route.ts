import { NextResponse } from "next/server";
import { syncFinApiIpos } from "@/lib/finapi/sync";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Check if body contains options
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // ignore
    }

    const result = await syncFinApiIpos({
      syncType: body.syncType || "all",
      bypassCache: body.bypassCache ?? true,
      status: body.status,
      type: body.type,
    });

    return NextResponse.json(result, {
      status: result.success ? 200 : 207,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Sync failed" },
      { status: 500 }
    );
  }
}
