import { NextResponse } from "next/server";
import { syncFinApiIpos } from "@/lib/finapi/sync";
import { enrichIposWithIpoAlerts } from "@/lib/ipoalerts/enricher";
import { getQuotaStatus } from "@/lib/ipoalerts/client";
import type { SyncOptions } from "@/lib/finapi/types";

export const dynamic = "force-dynamic";
// Allow up to 120s for enrichment runs (IPOAlerts has 10s delay per request)
export const maxDuration = 120;

function isAuthorized(req: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  // Require secret to be configured — never open-access in production
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

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const typeParam = url.searchParams.get("type") as
    | "all"
    | "subs"
    | "gmp"
    | "quick"
    | "enrich"
    | null;
  const bypassCache = url.searchParams.get("force") === "true";

  // ── IPOAlerts Enrichment Only ─────────────────────────────────────────────
  if (typeParam === "enrich") {
    try {
      const result = await enrichIposWithIpoAlerts();
      return NextResponse.json(result, { status: result.success ? 200 : 500 });
    } catch (err: any) {
      return NextResponse.json(
        { error: err?.message || "Enrichment failed" },
        { status: 500 }
      );
    }
  }

  // ── FinAPI Sync ───────────────────────────────────────────────────────────
  const options: SyncOptions = {
    syncType: typeParam || "all",
    bypassCache: bypassCache || true,
  };

  if (typeParam === "subs") {
    // Only open/live IPOs need fast subscription checks
    options.status = "LIVE";
  }

  const result = await syncFinApiIpos(options);

  // After a full sync, append IPOAlerts quota status to the response
  const quotaStatus = await getQuotaStatus();

  return NextResponse.json(
    { ...result, ipoAlertsQuota: quotaStatus },
    { status: result.success ? 200 : 500 }
  );
}

export async function POST(req: Request) {
  return GET(req);
}
