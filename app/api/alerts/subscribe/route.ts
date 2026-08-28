import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail } from "@/lib/email";
import { buildWelcomeEmail } from "@/lib/emailWelcome";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const db = getSupabase();

    // Only a brand-new row or a reactivation deserves the welcome email —
    // an already-active subscriber re-submitting the form shouldn't get it again.
    const { data: existing } = await db
      .from("email_subscribers")
      .select("is_active")
      .eq("email", normalizedEmail)
      .maybeSingle();
    const isNewOrReactivated = !existing || existing.is_active === false;

    const { error } = await db.from("email_subscribers").upsert(
      { email: normalizedEmail, is_active: true, subscribed_at: new Date().toISOString() },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Email subscribe error:", error);
      return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
    }

    if (isNewOrReactivated) {
      // Best-effort — a welcome-email failure must never fail the subscribe response.
      sendMail({ to: normalizedEmail, ...buildWelcomeEmail(normalizedEmail) }).catch((err) => {
        console.error("Welcome email failed:", err);
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
