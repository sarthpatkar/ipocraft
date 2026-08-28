import { NextResponse } from "next/server";
import { getServiceSupabaseClient } from "@/lib/supabaseAdmin";
import { sendMailBatch } from "@/lib/email";
import { fetchDigestIpos, digestIsEmpty, buildDigestEmail } from "@/lib/emailDigest";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Same fail-closed auth pattern as app/api/cron/sync and app/api/push/send.
function isAuthorized(req: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.replace(/^Bearer\s+/i, "").trim() === cronSecret) {
    return true;
  }

  const url = new URL(req.url);
  const secretParam = url.searchParams.get("secret");
  if (secretParam && secretParam.trim() === cronSecret) {
    return true;
  }

  return false;
}

/** Daily GMP digest — meant to be hit once/day by the GitHub Actions cron. */
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const digest = await fetchDigestIpos();
  if (digestIsEmpty(digest)) {
    return NextResponse.json({ sent: 0, failed: 0, skipped: "no open IPOs today" });
  }

  const db = getServiceSupabaseClient();
  const { data: subs, error } = await db
    .from("email_subscribers")
    .select("email")
    .eq("is_active", true);

  if (error) {
    return NextResponse.json({ error: `Failed to load subscribers: ${error.message}` }, { status: 500 });
  }

  const emails = (subs || []).map((s) => s.email as string);
  if (emails.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, skipped: "no active subscribers" });
  }

  const result = await sendMailBatch(emails, (to) => buildDigestEmail(digest, to));

  return NextResponse.json({
    sent: result.sent.length,
    failed: result.failed.length,
    failures: result.failed,
  });
}

export async function POST(req: Request) {
  return GET(req);
}
