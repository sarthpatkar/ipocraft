import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// This route runs very quickly — it just inserts a DB row and returns.
// No PDF processing happens here; the Python worker handles that.
export const maxDuration = 10;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { filePath, fileHash, forceNew } = await req.json();

    if (!filePath || !fileHash) {
      return NextResponse.json(
        { error: "filePath and fileHash are required." },
        { status: 400 }
      );
    }

    // ── Deduplication Check ──────────────────────────────────────────────
    // Return cached result ONLY if:
    //   1. forceNew is NOT set (user didn't click Re-Extract)
    //   2. A completed job exists for this exact file hash
    //   3. The cached result has at least 5 fields (not an old sparse result)
    if (!forceNew) {
      const { data: existingJob } = await supabase
        .from("extraction_jobs")
        .select("id, result, warnings, confidence")
        .eq("file_hash", fileHash)
        .eq("status", "done")
        .order("completed_at", { ascending: false })
        .limit(1)
        .single();

      const parsedResult =
        typeof existingJob?.result === "string"
          ? (() => { try { return JSON.parse(existingJob.result); } catch { return null; } })()
          : (existingJob?.result as Record<string, unknown> | null);

      const cachedResultCount = parsedResult ? Object.keys(parsedResult).length : 0;

      if (parsedResult && cachedResultCount >= 5) {
        return NextResponse.json({
          success: true,
          cached: true,
          jobId: existingJob!.id,
          result: parsedResult,
          warnings: existingJob!.warnings,
          confidence: existingJob!.confidence,
        });
      }
    }

    // ── Reset Any Stuck 'processing' Jobs For This File ─────────────────
    // Prevents the worker from picking up stale jobs that were orphaned.
    await supabase
      .from("extraction_jobs")
      .update({ status: "failed", error: "Timed out — resubmitted by admin" })
      .eq("file_hash", fileHash)
      .eq("status", "processing")
      .lt("started_at", new Date(Date.now() - 5 * 60 * 1000).toISOString());

    // ── Insert New Job ──────────────────────────────────────────────────
    const { data: newJob, error: insertError } = await supabase
      .from("extraction_jobs")
      .insert({
        file_path: filePath,
        file_hash: fileHash,
        status: "pending",
        schema_version: 4,  // Must match SCHEMA_VERSION in main.py
      })
      .select("id")
      .single();

    if (insertError || !newJob) {
      console.error("[submit] Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create extraction job." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cached: false,
      jobId: newJob.id,
    });
  } catch (error) {
    console.error("[submit] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
