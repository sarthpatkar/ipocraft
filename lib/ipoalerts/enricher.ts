// =============================================================================
// IPOAlerts — Enrichment Orchestrator
// Enriches open/upcoming IPOs in DB with fields FinAPI doesn't provide.
// Run as: type=enrich via cron endpoint
// =============================================================================

import { fetchOpenIpos, getQuotaStatus } from "./client";
import { transformIpoAlertsEnrichment } from "./transformer";
import { createClient } from "@supabase/supabase-js";

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export interface EnrichmentTelemetry {
  success: boolean;
  enrichedCount: number;
  skippedCount: number;
  errors: string[];
  quotaUsed: number;
  quotaRemaining: number;
  startedAt: string;
  completedAt: string;
  durationMs: number;
}

/**
 * Main enrichment function. Called from cron route with type=enrich.
 * Fetches open IPOs from IPOAlerts, writes enrichment fields to DB.
 * Safe to run multiple times — uses fill-if-empty logic for most fields.
 */
export async function enrichIposWithIpoAlerts(): Promise<EnrichmentTelemetry> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();
  const errors: string[] = [];
  let enrichedCount = 0;
  let skippedCount = 0;

  // Check quota before starting
  const quotaBefore = await getQuotaStatus();
  if (quotaBefore.remaining <= 2) {
    return {
      success: true,
      enrichedCount: 0,
      skippedCount: 0,
      errors: ["Daily quota exhausted — skipping enrichment."],
      quotaUsed: 0,
      quotaRemaining: quotaBefore.remaining,
      startedAt,
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
    };
  }

  const supabase = getServiceSupabase();

  try {
    // 1. Fetch open IPOs from IPOAlerts (paginated, 1 per request)
    const { ipos: openIpos, requestsUsed: openReqs } = await fetchOpenIpos("open");

    // 2. Also enrich upcoming if quota allows
    const quotaAfterOpen = await getQuotaStatus();
    let upcomingIpos: typeof openIpos = [];
    let upcomingReqs = 0;

    if (quotaAfterOpen.remaining >= 3) {
      const result = await fetchOpenIpos("upcoming");
      upcomingIpos = result.ipos;
      upcomingReqs = result.requestsUsed;
    }

    const allIpos = [...openIpos, ...upcomingIpos];
    const totalApiRequests = openReqs + upcomingReqs;

    if (allIpos.length === 0) {
      const quotaFinal = await getQuotaStatus();
      return {
        success: true,
        enrichedCount: 0,
        skippedCount: 0,
        errors: ["No open/upcoming IPOs returned from IPOAlerts."],
        quotaUsed: totalApiRequests,
        quotaRemaining: quotaFinal.remaining,
        startedAt,
        completedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
      };
    }

    // 3. For each IPO returned, build enrichment payload and upsert to DB
    for (const alertsIpo of allIpos) {
      try {
        const enrichment = transformIpoAlertsEnrichment(alertsIpo);

        if (!enrichment.symbol) {
          skippedCount++;
          continue;
        }

        // Find the matching IPO in DB by symbol or name
        const { data: dbMatches } = await supabase
          .from("ipos")
          .select("id, symbol, name, nse_info_url, listing_gain, media_links, rhp_link")
          .or(
            `symbol.ilike.${enrichment.symbol},name.ilike.%${alertsIpo.name.replace(/'/g, "")}%`
          )
          .limit(1);

        const dbIpo = dbMatches?.[0];
        if (!dbIpo) {
          skippedCount++;
          continue;
        }

        // Build update payload — only write what IPOAlerts has and DB is missing
        const updatePayload: Record<string, any> = {};

        // Always update listing_gain (it changes after listing day)
        if (enrichment.listing_gain !== null) {
          updatePayload.listing_gain = enrichment.listing_gain;
        }

        // Fill-if-empty for reference fields
        if (!dbIpo.nse_info_url && enrichment.nse_info_url) {
          updatePayload.nse_info_url = enrichment.nse_info_url;
        }
        if (!dbIpo.media_links && enrichment.media_links) {
          updatePayload.media_links = enrichment.media_links;
        }
        if (!dbIpo.rhp_link && enrichment.prospectus_url) {
          updatePayload.rhp_link = enrichment.prospectus_url;
        }

        // Cross-verify schedule dates — only fill in missing dates
        if (enrichment.allotment_date) {
          updatePayload.allotment_date = enrichment.allotment_date;
        }
        if (enrichment.refund_date) {
          updatePayload.refund_date = enrichment.refund_date;
        }

        // Skip empty updates
        if (Object.keys(updatePayload).length === 0) {
          skippedCount++;
          continue;
        }

        updatePayload.updated_at = new Date().toISOString();

        const { error: updateErr } = await supabase
          .from("ipos")
          .update(updatePayload)
          .eq("id", dbIpo.id);

        if (updateErr) {
          errors.push(`Failed enriching ${alertsIpo.name}: ${updateErr.message}`);
        } else {
          enrichedCount++;
        }
      } catch (ipoErr: any) {
        errors.push(`Error processing ${alertsIpo.name}: ${ipoErr?.message}`);
      }
    }

    const quotaFinal = await getQuotaStatus();
    return {
      success: errors.length === 0,
      enrichedCount,
      skippedCount,
      errors,
      quotaUsed: totalApiRequests,
      quotaRemaining: quotaFinal.remaining,
      startedAt,
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
    };
  } catch (err: any) {
    errors.push(err?.message || "Unknown enrichment error");
    const quotaFinal = await getQuotaStatus();
    return {
      success: false,
      enrichedCount,
      skippedCount,
      errors,
      quotaUsed: 0,
      quotaRemaining: quotaFinal.remaining,
      startedAt,
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
    };
  }
}
