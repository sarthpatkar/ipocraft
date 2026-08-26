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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message_id, rating, intent_type, message_snippet } = body;

    if (!message_id || (rating !== 1 && rating !== -1)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const db = getSupabase();
    await db.from("chat_feedback").insert({
      message_id,
      rating,
      intent_type: intent_type ?? null,
      message_snippet: message_snippet?.slice(0, 80) ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Non-critical endpoint — always return 200 to not interrupt UX
    return NextResponse.json({ ok: true });
  }
}
