"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { syncFinApiIpos } from "@/lib/finapi/sync";
import { getRateLimitStatus } from "@/lib/finapi/client";
import { getQuotaStatus } from "@/lib/ipoalerts/client";
import { getServiceSupabaseClient } from "@/lib/supabaseAdmin";
import type { SyncOptions, SyncTelemetry } from "@/lib/finapi/types";

export async function deleteIpoAction(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("ipos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function deleteBrokerAction(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("brokers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function duplicateIpoAction(ipo: any) {
  const supabase = await createSupabaseServerClient();
  const { id, created_at, updated_at, ...rest } = ipo;
  const payload = {
    ...rest,
    name: `${ipo.name} (Copy)`,
    slug: `${ipo.slug}-copy-${Date.now()}`,
  };

  const { error } = await supabase.from("ipos").insert(payload);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function updateGmpAction(ipoId: string, gmp: number) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("ipos").update({ gmp, updated_at: new Date().toISOString() }).eq("id", ipoId);
  
  if (error) throw new Error(error.message);

  // Attempt to insert history
  const { error: historyError } = await supabase.from("gmp_history").insert({
    ipo_id: ipoId,
    gmp,
  });

  return { success: true, historyError: historyError?.message };
}

export async function saveBrokerAction(broker: any) {
  const supabase = await createSupabaseServerClient();
  
  if (broker.id) {
    const { error } = await supabase.from("brokers").update(broker).eq("id", broker.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("brokers").insert(broker);
    if (error) throw new Error(error.message);
  }
  return { success: true };
}

export async function saveIpoAction(payload: any, isUpdate: boolean, ipoId?: string) {
  const supabase = await createSupabaseServerClient();
  
  if (isUpdate && ipoId) {
    const { data, error } = await supabase.from("ipos").update(payload).eq("id", ipoId).select().single();
    if (error) throw new Error(error.message);
    return { success: true, data };
  } else {
    const { data, error } = await supabase.from("ipos").insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return { success: true, data };
  }
}

export async function triggerFinapiSyncAction(options?: SyncOptions): Promise<SyncTelemetry> {
  return await syncFinApiIpos(options);
}

export async function getFinapiStatusAction() {
  const rateLimit = getRateLimitStatus();
  const supabase = await createSupabaseServerClient();
  const { data: latest } = await supabase
    .from("ipos")
    .select("updated_at, subscription_updated_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    rateLimit,
    lastSyncAt: latest?.updated_at || null,
    lastSubscriptionSyncAt: latest?.subscription_updated_at || null,
  };
}

// ── Automation / sync history (sync_runs, api_quota_tracking) ──────────────
// RLS on these tables is service_role-only, so the cookie-scoped client
// can't read them — use the service-role client, same as syncFinApiIpos().

export async function getSyncRunsAction(limit = 20) {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from("sync_runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getSyncStatsAction() {
  const supabase = getServiceSupabaseClient();
  const now = Date.now();
  const since = (days: number) => new Date(now - days * 86_400_000).toISOString();

  const [day1, day7, day30, day365] = await Promise.all(
    [1, 7, 30, 365].map((days) =>
      supabase
        .from("sync_runs")
        .select("provider, success, inserted_count, updated_count")
        .gte("created_at", since(days))
    )
  );

  function summarize(rows: { provider: string; success: boolean; inserted_count: number | null; updated_count: number | null }[] | null) {
    const list = rows || [];
    return {
      total: list.length,
      succeeded: list.filter((r) => r.success).length,
      failed: list.filter((r) => !r.success).length,
      inserted: list.reduce((sum, r) => sum + (r.inserted_count || 0), 0),
      updated: list.reduce((sum, r) => sum + (r.updated_count || 0), 0),
      byProvider: list.reduce<Record<string, number>>((acc, r) => {
        acc[r.provider] = (acc[r.provider] || 0) + 1;
        return acc;
      }, {}),
    };
  }

  return {
    today: summarize(day1.data),
    last7Days: summarize(day7.data),
    last30Days: summarize(day30.data),
    lastYear: summarize(day365.data),
  };
}

export async function getIpoAlertsQuotaAction() {
  return await getQuotaStatus();
}

// ── Feedback (feedback, chat_feedback) ──────────────────────────────────────

export async function getFeedbackListAction(limit = 50) {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getFeedbackStatsAction() {
  const supabase = getServiceSupabaseClient();
  const now = Date.now();
  const since = (days: number) => new Date(now - days * 86_400_000).toISOString();

  const { data, error } = await supabase
    .from("feedback")
    .select("rating, missing_features, confusion, investor_type, created_at");
  if (error) throw new Error(error.message);

  const rows = data || [];
  const inWindow = (days: number) => rows.filter((r) => r.created_at >= since(days));

  const avgRating = rows.length
    ? Math.round((rows.reduce((sum, r) => sum + (r.rating || 0), 0) / rows.length) * 100) / 100
    : null;

  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of rows) {
    if (r.rating >= 1 && r.rating <= 5) ratingCounts[r.rating]++;
  }

  return {
    total: rows.length,
    thisWeek: inWindow(7).length,
    thisMonth: inWindow(30).length,
    thisYear: inWindow(365).length,
    avgRating,
    ratingCounts,
  };
}

export async function getChatFeedbackStatsAction() {
  const supabase = getServiceSupabaseClient();
  const now = Date.now();
  const since = (days: number) => new Date(now - days * 86_400_000).toISOString();

  const { data, error } = await supabase
    .from("chat_feedback")
    .select("rating, created_at")
    .gte("created_at", since(30));
  if (error) throw new Error(error.message);

  const rows = data || [];
  return {
    total: rows.length,
    thumbsUp: rows.filter((r) => r.rating === 1).length,
    thumbsDown: rows.filter((r) => r.rating === -1).length,
  };
}
