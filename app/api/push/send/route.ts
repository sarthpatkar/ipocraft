import { NextResponse } from "next/server";
import { sendPushToAll } from "@/lib/push";

export const dynamic = "force-dynamic";

// Same fail-closed auth pattern as app/api/cron/sync/route.ts — never
// open-access, and CRON_SECRET must be explicitly configured to run.
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

/**
 * Admin/cron-triggered push send — not (yet) wired to an automatic
 * "GMP changed by X%" trigger. That needs a product decision on thresholds
 * and frequency to avoid over-notifying users; this endpoint gives a safe,
 * authenticated way to send one now (manually, or from a future cron step
 * once those thresholds are decided).
 */
export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: { title?: string; body?: string; url?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!payload.title || !payload.body) {
    return NextResponse.json({ error: "title and body are required" }, { status: 400 });
  }

  try {
    const result = await sendPushToAll({
      title: payload.title,
      body: payload.body,
      url: payload.url,
    });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to send push" }, { status: 500 });
  }
}
