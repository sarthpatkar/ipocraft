import { fetchRawFinApiIpos } from "./client";
import { transformFinApiIpo, generateSlug } from "./transformer";
import type { NormalizedIpoData, SyncOptions, SyncTelemetry } from "./types";
import { createClient } from "@supabase/supabase-js";

function getServiceSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}

function cleanStringForMatching(str?: string | null): string {
  if (!str) return "";
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

interface ExistingDbIpo {
  id: number;
  name: string;
  slug: string;
  symbol: string | null;
  status: string | null;
  gmp: number | null;
  sub_total: number | string | null;
  about_company: string | null;
  company_strengths: string | null;
  company_risks: string | null;
  objectives: string | null;
  rhp_link: string | null;
  drhp_link: string | null;
  logo_url: string | null;
}

export async function syncFinApiIpos(
  options?: SyncOptions
): Promise<SyncTelemetry> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();
  const errors: string[] = [];

  let insertedCount = 0;
  let updatedCount = 0;
  let gmpPointsCount = 0;

  const supabase = getServiceSupabaseClient();

  try {
    // 1. Fetch fresh data from FinAPI (or cache)
    const { ipos: rawIpos, rateLimit } = await fetchRawFinApiIpos({
      status: options?.status,
      type: options?.type,
      bypassCache: options?.bypassCache,
    });

    const totalFetched = rawIpos.length;

    // 2. Fetch existing IPOs in DB
    const { data: dbIpos, error: fetchDbError } = await supabase
      .from("ipos")
      .select("id, name, slug, symbol, status, gmp, sub_total, about_company, company_strengths, company_risks, objectives, rhp_link, drhp_link, logo_url");

    if (fetchDbError) {
      throw new Error(`Failed to load existing IPOs from DB: ${fetchDbError.message}`);
    }

    const existingList = (dbIpos || []) as ExistingDbIpo[];

    // 3. Process each IPO from FinAPI
    for (const raw of rawIpos) {
      try {
        const item: NormalizedIpoData = transformFinApiIpo(raw);
        const normApiName = cleanStringForMatching(item.name);
        const normApiSymbol = cleanStringForMatching(item.symbol);
        const normApiSlug = cleanStringForMatching(item.slug);

        // Find existing match
        const matched = existingList.find((db) => {
          const normDbSymbol = cleanStringForMatching(db.symbol);
          if (normApiSymbol && normDbSymbol && normApiSymbol === normDbSymbol) {
            return true;
          }

          const normDbSlug = cleanStringForMatching(db.slug);
          if (normApiSlug && normDbSlug && normApiSlug === normDbSlug) {
            return true;
          }

          const normDbName = cleanStringForMatching(db.name);
          if (
            normDbName === normApiName ||
            (normDbName.length > 5 && normApiName.includes(normDbName)) ||
            (normApiName.length > 5 && normDbName.includes(normApiName))
          ) {
            return true;
          }

          return false;
        });

        const nowIso = new Date().toISOString();

        if (matched) {
          // --- UPDATE EXISTING IPO ---
          const updatePayload: Record<string, any> = {
            updated_at: nowIso,
          };

          // Update dynamic fields
          if (item.status) updatePayload.status = item.status;
          if (item.gmp !== null) updatePayload.gmp = item.gmp;
          if (item.sub_total !== null) updatePayload.sub_total = item.sub_total;
          if (item.sub_qib !== null) updatePayload.sub_qib = item.sub_qib;
          if (item.sub_nii !== null) updatePayload.sub_nii = item.sub_nii;
          if (item.sub_rii !== null) updatePayload.sub_rii = item.sub_rii;
          const hasSubData = item.sub_total !== null || item.sub_rii !== null;
          if (hasSubData) {
            updatePayload.subscription_updated_at = nowIso;
          }

          if (item.open_date) updatePayload.open_date = item.open_date;
          if (item.close_date) updatePayload.close_date = item.close_date;
          if (item.listing_date) updatePayload.listing_date = item.listing_date;
          if (item.allotment_date) updatePayload.allotment_date = item.allotment_date;
          if (item.refund_date) updatePayload.refund_date = item.refund_date;

          if (item.price_min !== null) updatePayload.price_min = item.price_min;
          if (item.price_max !== null) updatePayload.price_max = item.price_max;
          if (item.lot_size !== null) updatePayload.lot_size = item.lot_size;
          if (item.symbol && !matched.symbol) updatePayload.symbol = item.symbol;

          // Fill in empty/missing narrative or structural fields without overwriting existing content
          if (!matched.about_company && item.about_company) updatePayload.about_company = item.about_company;
          if (!matched.company_strengths && item.company_strengths) updatePayload.company_strengths = item.company_strengths;
          if (!matched.company_risks && item.company_risks) updatePayload.company_risks = item.company_risks;
          if (!matched.objectives && item.objectives) updatePayload.objectives = item.objectives;
          if (!matched.rhp_link && item.rhp_link) updatePayload.rhp_link = item.rhp_link;
          if (!matched.drhp_link && item.drhp_link) updatePayload.drhp_link = item.drhp_link;
          if (!matched.logo_url && item.logo_url) updatePayload.logo_url = item.logo_url;

          // Lots calculations if missing
          if (item.retail_min_lots !== null) updatePayload.retail_min_lots = item.retail_min_lots;
          if (item.retail_min_shares !== null) updatePayload.retail_min_shares = item.retail_min_shares;
          if (item.retail_min_amount !== null) updatePayload.retail_min_amount = item.retail_min_amount;
          if (item.retail_max_lots !== null) updatePayload.retail_max_lots = item.retail_max_lots;
          if (item.retail_max_shares !== null) updatePayload.retail_max_shares = item.retail_max_shares;
          if (item.retail_max_amount !== null) updatePayload.retail_max_amount = item.retail_max_amount;
          if (item.shni_min_lots !== null) updatePayload.shni_min_lots = item.shni_min_lots;
          if (item.shni_min_shares !== null) updatePayload.shni_min_shares = item.shni_min_shares;
          if (item.shni_min_amount !== null) updatePayload.shni_min_amount = item.shni_min_amount;
          if (item.shni_max_lots !== null) updatePayload.shni_max_lots = item.shni_max_lots;
          if (item.shni_max_shares !== null) updatePayload.shni_max_shares = item.shni_max_shares;
          if (item.shni_max_amount !== null) updatePayload.shni_max_amount = item.shni_max_amount;
          if (item.bhni_min_lots !== null) updatePayload.bhni_min_lots = item.bhni_min_lots;
          if (item.bhni_min_shares !== null) updatePayload.bhni_min_shares = item.bhni_min_shares;
          if (item.bhni_min_amount !== null) updatePayload.bhni_min_amount = item.bhni_min_amount;

          const { error: updateError } = await supabase
            .from("ipos")
            .update(updatePayload)
            .eq("id", matched.id);

          if (updateError) {
            errors.push(`Error updating ${item.name} (${matched.id}): ${updateError.message}`);
          } else {
            updatedCount++;

            // ── Subscription History Snapshot ──────────────────────────────
            // Write a day-wise snapshot row so the detail page table is populated.
            // Uses upsert on (ipo_id, day) — safe to run multiple times per day.
            if (hasSubData) {
              const today = nowIso.slice(0, 10); // YYYY-MM-DD
              await supabase.from("subscription_history").upsert(
                {
                  ipo_id: matched.id,
                  day: today,
                  qib: item.sub_qib,
                  nii: item.sub_nii,
                  rii: item.sub_rii,
                  total: item.sub_total,
                },
                { onConflict: "ipo_id,day" }
              );
            }

            // ── GMP History ────────────────────────────────────────────────
            // Sync GMP Trends into gmp_history
            if (item.gmpTrends && item.gmpTrends.length > 0) {
              const pointsToInsert = item.gmpTrends.map((t) => ({
                ipo_id: matched.id,
                gmp: t.gmp,
                created_at: t.dateIso,
              }));

              // Check existing history to prevent duplicates
              const { data: existingGmp } = await supabase
                .from("gmp_history")
                .select("created_at")
                .eq("ipo_id", matched.id);

              const existingDates = new Set(
                (existingGmp || []).map((g) => new Date(g.created_at).toISOString().slice(0, 10))
              );

              const newPoints = pointsToInsert.filter(
                (p) => !existingDates.has(new Date(p.created_at).toISOString().slice(0, 10))
              );

              if (newPoints.length > 0) {
                const { error: gmpInsertErr } = await supabase
                  .from("gmp_history")
                  .insert(newPoints);

                if (!gmpInsertErr) {
                  gmpPointsCount += newPoints.length;
                }
              }
            } else if (item.gmp !== null) {
              // Always record current GMP value in history for rich chart data
              // Deduplication: only insert if no record exists for this exact hour
              const currentHour = nowIso.slice(0, 13); // YYYY-MM-DDTHH
              const { data: recentGmp } = await supabase
                .from("gmp_history")
                .select("created_at")
                .eq("ipo_id", matched.id)
                .gte("created_at", `${currentHour}:00:00Z`)
                .limit(1);

              if (!recentGmp || recentGmp.length === 0) {
                await supabase.from("gmp_history").insert({
                  ipo_id: matched.id,
                  gmp: item.gmp,
                  created_at: nowIso,
                });
                gmpPointsCount++;
              }
            }
          }
        } else {
          // --- INSERT NEW IPO ---
          let uniqueSlug = item.slug;
          let counter = 1;
          while (existingList.some((db) => db.slug === uniqueSlug)) {
            uniqueSlug = `${item.slug}-${counter++}`;
          }

          const insertPayload: Record<string, any> = {
            name: item.name,
            slug: uniqueSlug,
            symbol: item.symbol,
            ipo_type: item.ipo_type,
            exchange: item.exchange,
            listing_exchange: item.listing_exchange,
            status: item.status,
            price_min: item.price_min,
            price_max: item.price_max,
            lot_size: item.lot_size,
            issue_size: item.issue_size,
            fresh_issue: item.fresh_issue,
            open_date: item.open_date,
            close_date: item.close_date,
            listing_date: item.listing_date,
            allotment_date: item.allotment_date,
            refund_date: item.refund_date,
            gmp: item.gmp,
            sub_total: item.sub_total,
            sub_qib: item.sub_qib,
            sub_nii: item.sub_nii,
            sub_rii: item.sub_rii,
            subscription_updated_at: item.sub_total !== null ? nowIso : null,
            about_company: item.about_company,
            company_strengths: item.company_strengths,
            company_risks: item.company_risks,
            objectives: item.objectives,
            logo_url: item.logo_url,
            drhp_link: item.drhp_link,
            rhp_link: item.rhp_link,
            retail_min_lots: item.retail_min_lots,
            retail_min_shares: item.retail_min_shares,
            retail_min_amount: item.retail_min_amount,
            retail_max_lots: item.retail_max_lots,
            retail_max_shares: item.retail_max_shares,
            retail_max_amount: item.retail_max_amount,
            shni_min_lots: item.shni_min_lots,
            shni_min_shares: item.shni_min_shares,
            shni_min_amount: item.shni_min_amount,
            shni_max_lots: item.shni_max_lots,
            shni_max_shares: item.shni_max_shares,
            shni_max_amount: item.shni_max_amount,
            bhni_min_lots: item.bhni_min_lots,
            bhni_min_shares: item.bhni_min_shares,
            bhni_min_amount: item.bhni_min_amount,
            created_at: nowIso,
            updated_at: nowIso,
          };

          const { data: insertedIpo, error: insertError } = await supabase
            .from("ipos")
            .insert(insertPayload)
            .select("id, slug, name")
            .single();

          if (insertError) {
            errors.push(`Error inserting ${item.name}: ${insertError.message}`);
          } else if (insertedIpo) {
            insertedCount++;
            existingList.push({
              id: insertedIpo.id,
              name: insertedIpo.name,
              slug: insertedIpo.slug,
              symbol: item.symbol,
              status: item.status,
              gmp: item.gmp,
              sub_total: item.sub_total,
              about_company: item.about_company,
              company_strengths: item.company_strengths,
              company_risks: item.company_risks,
              objectives: item.objectives,
              rhp_link: item.rhp_link,
              drhp_link: item.drhp_link,
              logo_url: item.logo_url,
            });

            // Insert GMP trend points
            if (item.gmpTrends && item.gmpTrends.length > 0) {
              const pointsToInsert = item.gmpTrends.map((t) => ({
                ipo_id: insertedIpo.id,
                gmp: t.gmp,
                created_at: t.dateIso,
              }));

              const { error: gmpInsertErr } = await supabase
                .from("gmp_history")
                .insert(pointsToInsert);

              if (!gmpInsertErr) {
                gmpPointsCount += pointsToInsert.length;
              }
            } else if (item.gmp !== null) {
              await supabase.from("gmp_history").insert({
                ipo_id: insertedIpo.id,
                gmp: item.gmp,
                created_at: nowIso,
              });
              gmpPointsCount++;
            }
          }
        }
      } catch (ipoErr: any) {
        errors.push(`Failed processing IPO ${raw.name}: ${ipoErr?.message}`);
      }
    }

    const completedAt = new Date().toISOString();
    return recordAndReturn(supabase, {
      success: errors.length === 0,
      syncType: options?.syncType || "all",
      totalFetched,
      insertedCount,
      updatedCount,
      gmpPointsCount,
      errors,
      startedAt,
      completedAt,
      durationMs: Date.now() - startTime,
      rateLimitRemaining: rateLimit.remainingEndpoint,
    });
  } catch (err: any) {
    const completedAt = new Date().toISOString();
    errors.push(err?.message || "Unknown synchronization error");
    return recordAndReturn(supabase, {
      success: false,
      syncType: options?.syncType || "all",
      totalFetched: 0,
      insertedCount,
      updatedCount,
      gmpPointsCount,
      errors,
      startedAt,
      completedAt,
      durationMs: Date.now() - startTime,
      rateLimitRemaining: null,
    });
  }
}

// Persist telemetry to sync_runs so the admin panel can show historical
// success/fail rates — this used to be built and then discarded on every
// run. Best-effort: a logging failure must never fail the sync itself.
async function recordAndReturn(
  supabase: ReturnType<typeof getServiceSupabaseClient>,
  telemetry: SyncTelemetry
): Promise<SyncTelemetry> {
  try {
    await supabase.from("sync_runs").insert({
      provider: "finapi",
      sync_type: telemetry.syncType,
      success: telemetry.success,
      total_fetched: telemetry.totalFetched,
      inserted_count: telemetry.insertedCount,
      updated_count: telemetry.updatedCount,
      gmp_points_count: telemetry.gmpPointsCount,
      errors: telemetry.errors,
      rate_limit_remaining: telemetry.rateLimitRemaining,
      started_at: telemetry.startedAt,
      completed_at: telemetry.completedAt,
      duration_ms: telemetry.durationMs,
    });
  } catch {
    // non-critical — never let telemetry logging break the sync response
  }
  return telemetry;
}
