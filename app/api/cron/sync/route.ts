import { NextResponse } from "next/server";
import { syncFinApiIpos } from "@/lib/finapi/sync";
import type { SyncOptions } from "@/lib/finapi/types";

export const dynamic = "force-dynamic";

function isAuthorized(req: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true; // If no secret configured, allow

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

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const typeParam = url.searchParams.get("type") as "all" | "subs" | "gmp" | "quick" | null;
  const bypassCache = url.searchParams.get("force") === "true";

  const options: SyncOptions = {
    syncType: typeParam || "all",
    bypassCache: bypassCache || true,
  };

  if (typeParam === "subs") {
    // Only open/live IPOs need fast subscription checks
    options.status = "LIVE";
  }

  const result = await syncFinApiIpos(options);

  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}

export async function POST(req: Request) {
  return GET(req);
}
