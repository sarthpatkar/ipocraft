// =============================================================================
// IPOAlerts API — Server-side Client
// IMPORTANT: Server-side only. Never import from client components.
// Free tier limits: 6 req/min, 25 req/day, 1 IPO per request (limit=1)
// =============================================================================

import type {
  IpoAlertsListResponse,
  IpoAlertsDetailResponse,
  IpoAlertsIpo,
  IpoAlertsGmpSeriesResponse,
  QuotaStatus,
} from "./types";
import { createClient } from "@supabase/supabase-js";

const IPOALERTS_BASE_URL = "https://api.ipoalerts.in";
// Leave some buffer — stop at 23 to never risk hitting 25 hard cap
const DAILY_QUOTA_SAFE_LIMIT = 23;
// 10s between requests = max 6/min (exactly at the free tier limit)
const REQUEST_DELAY_MS = 10_000;
const QUOTA_TABLE_ROW_ID = "ipoalerts";

function getApiKey(): string {
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY ERROR: IPOAlerts client can only be called from server-side code."
    );
  }
  const key = process.env.IPOALERTS_API_KEY;
  if (!key) {
    throw new Error(
      "Missing IPOALERTS_API_KEY environment variable. Set it in .env.local"
    );
  }
  return key.trim();
}

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function makeRequest<T>(endpoint: string): Promise<T> {
  const apiKey = getApiKey();
  const url = `${IPOALERTS_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (res.status === 429) {
      throw new Error("IPOAlerts rate limit exceeded (429). Stop and retry later.");
    }
    if (res.status === 401) {
      throw new Error("IPOAlerts API key invalid or missing (401).");
    }
    if (!res.ok) {
      throw new Error(`IPOAlerts request failed: HTTP ${res.status} for ${url}`);
    }

    return res.json() as Promise<T>;
  } catch (err: any) {
    clearTimeout(timeout);
    if (err?.name === "AbortError") {
      throw new Error(`IPOAlerts request timed out after 15s: ${url}`);
    }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Quota Management — tracks daily usage in Supabase api_quota_tracking table
// ---------------------------------------------------------------------------

export async function getQuotaStatus(): Promise<QuotaStatus> {
  const supabase = getServiceSupabase();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD IST

  const { data } = await supabase
    .from("api_quota_tracking")
    .select("*")
    .eq("id", QUOTA_TABLE_ROW_ID)
    .maybeSingle();

  if (!data || data.date !== today) {
    // New day — reset counter
    return { requestsUsedToday: 0, remaining: DAILY_QUOTA_SAFE_LIMIT, date: today };
  }

  const used = data.requests_used ?? 0;
  return {
    requestsUsedToday: used,
    remaining: Math.max(0, DAILY_QUOTA_SAFE_LIMIT - used),
    date: today,
  };
}

async function incrementQuota(count: number = 1): Promise<void> {
  const supabase = getServiceSupabase();
  const today = new Date().toISOString().slice(0, 10);
  const { data: existing } = await supabase
    .from("api_quota_tracking")
    .select("*")
    .eq("id", QUOTA_TABLE_ROW_ID)
    .maybeSingle();

  const currentUsed = existing?.date === today ? (existing.requests_used ?? 0) : 0;

  await supabase.from("api_quota_tracking").upsert({
    id: QUOTA_TABLE_ROW_ID,
    date: today,
    requests_used: currentUsed + count,
    last_updated: new Date().toISOString(),
  });
}

// ---------------------------------------------------------------------------
// Public API Methods
// ---------------------------------------------------------------------------

/**
 * Fetch ALL currently open IPOs by paginating with limit=1 per request.
 * Uses the daily quota budget — stops if budget is exhausted.
 */
export async function fetchOpenIpos(
  status: "open" | "upcoming" = "open"
): Promise<{ ipos: IpoAlertsIpo[]; requestsUsed: number }> {
  const quota = await getQuotaStatus();
  if (quota.remaining <= 0) {
    console.warn("[IPOAlerts] Daily quota exhausted, skipping fetchOpenIpos.");
    return { ipos: [], requestsUsed: 0 };
  }

  const allIpos: IpoAlertsIpo[] = [];
  let page = 1;
  let totalPages = 1;
  let requestsUsed = 0;
  let remainingBudget = quota.remaining;

  do {
    if (remainingBudget <= 0) break;

    const data = await makeRequest<IpoAlertsListResponse>(
      `/ipos?status=${status}&limit=1&page=${page}`
    );
    requestsUsed++;
    remainingBudget--;

    if (data.ipos && data.ipos.length > 0) {
      allIpos.push(...data.ipos);
    }

    totalPages = data.meta.totalPages;
    page++;

    // Throttle — 10s delay between pages to stay under 6/min
    if (page <= totalPages && remainingBudget > 0) {
      await sleep(REQUEST_DELAY_MS);
    }
  } while (page <= totalPages);

  await incrementQuota(requestsUsed);
  console.log(`[IPOAlerts] fetchOpenIpos: ${allIpos.length} IPOs fetched in ${requestsUsed} requests.`);
  return { ipos: allIpos, requestsUsed };
}

/**
 * Fetch a single IPO by symbol, slug, or ID.
 * Costs 1 request from quota.
 */
export async function fetchIpoByIdentifier(
  identifier: string
): Promise<IpoAlertsIpo | null> {
  const quota = await getQuotaStatus();
  if (quota.remaining <= 0) {
    console.warn("[IPOAlerts] Daily quota exhausted, skipping fetchIpoByIdentifier.");
    return null;
  }

  try {
    const data = await makeRequest<IpoAlertsDetailResponse>(`/ipos/${encodeURIComponent(identifier)}`);
    await incrementQuota(1);
    return data.ipo ?? null;
  } catch (err: any) {
    if (err?.message?.includes("404")) return null;
    throw err;
  }
}

/**
 * Fetch GMP timeseries data for a single IPO.
 * Free preview until Sept 2026. Uses quota.
 */
export async function fetchGmpTrends(
  identifier: string,
  interval: "5m" | "hourly" | "daily" | "weekly" = "daily",
  fromDate?: string,
  toDate?: string
): Promise<IpoAlertsGmpSeriesResponse | null> {
  const quota = await getQuotaStatus();
  if (quota.remaining <= 0) {
    console.warn("[IPOAlerts] Daily quota exhausted, skipping fetchGmpTrends.");
    return null;
  }

  const params = new URLSearchParams({ interval });
  if (fromDate) params.set("from", fromDate);
  if (toDate) params.set("to", toDate);

  try {
    const data = await makeRequest<IpoAlertsGmpSeriesResponse>(
      `/ipos/${encodeURIComponent(identifier)}/gmp?${params}`
    );
    await incrementQuota(1);
    return data;
  } catch (err: any) {
    if (err?.message?.includes("404")) return null;
    throw err;
  }
}
