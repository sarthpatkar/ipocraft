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

    // ── Deduplication Check ─────────────────────────────────────────────────
    // Return cache ONLY if forceNew is not set AND cached result has at least 15 extracted fields.
    // If previous result was sparse (<15 fields), bypass cache and re-process with latest worker code.
    const { data: existingJob } = await supabase
      .from("extraction_jobs")
      .select("id, result, partial_result, warnings, confidence")
      .eq("file_hash", fileHash)
      .eq("status", "done")
      .order("completed_at", { ascending: false })
      .limit(1)
      .single();

    const parsedResult = typeof existingJob?.result === "string" 
      ? JSON.parse(existingJob.result) 
      : (existingJob?.result as Record<string, unknown> | null);

    const cachedResultCount = parsedResult ? Object.keys(parsedResult).length : 0;

    if (!forceNew && parsedResult && cachedResultCount >= 5) {
      return NextResponse.json({
        success: true,
        cached: true,
        jobId: existingJob.id,
        result: parsedResult,
        warnings: existingJob.warnings,
        confidence: existingJob.confidence,
      });
    }

    // ── Reset Any Stuck Jobs For This File ──────────────────────────────────
    // If a previous job for this file is stuck in 'processing' for >5 minutes,
    // reset it so the worker can pick it up again.
    await supabase
      .from("extraction_jobs")
      .update({ status: "failed", error: "Timed out — resubmitted by admin" })
      .eq("file_hash", fileHash)
      .eq("status", "processing")
      .lt("started_at", new Date(Date.now() - 5 * 60 * 1000).toISOString());

    // ── Insert New Job ──────────────────────────────────────────────────────
    const { data: newJob, error: insertError } = await supabase
      .from("extraction_jobs")
      .insert({
        file_path: filePath,
        file_hash: fileHash,
        status: "pending",
        schema_version: 1,
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
