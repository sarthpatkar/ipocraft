import { NextResponse } from "next/server"; 
import { extractFromRhp } from "@/lib/rhp-extraction";
import { createClient } from "@supabase/supabase-js";

/**
 * Vercel configuration for RHP extraction.
 * - maxDuration: 60s to allow AI processing time
 */
export const maxDuration = 60;

// Initialize Supabase with service role for backend operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  let filePathToCleanup: string | null = null;

  try {
    const { filePath } = await req.json();

    if (!filePath) {
      return NextResponse.json(
        { error: "No filePath provided. The PDF must be uploaded to storage first." },
        { status: 400 }
      );
    }
    
    filePathToCleanup = filePath;

    // Check if at least one AI provider is configured
    const hasProvider =
      !!process.env.OPENROUTER_API_KEY ||
      !!process.env.GROQ_API_KEY ||
      !!process.env.GEMINI_API_KEY ||
      !!process.env.OPENAI_API_KEY;

    if (!hasProvider) {
      return NextResponse.json(
        {
          error:
            "No AI provider configured. Please set OPENROUTER_API_KEY or GROQ_API_KEY in environment variables.",
        },
        { status: 503 }
      );
    }

    // Download the file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("rhp-uploads")
      .download(filePath);

    if (downloadError || !fileData) {
      console.error("Supabase download error:", downloadError);
      return NextResponse.json(
        { error: "Failed to retrieve the uploaded PDF from storage." },
        { status: 404 }
      );
    }

    // Convert to buffer
    const bytes = await fileData.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract
    const result = await extractFromRhp(buffer);

    return NextResponse.json({
      success: true,
      fields: result.fields,
      metadata: {
        provider: result.provider,
        model: result.model,
        extractedFieldCount: result.extractedFieldCount,
        totalFieldCount: result.totalFieldCount,
        warnings: result.warnings,
      },
    });
  } catch (error) {
    console.error("[extract-rhp] Error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error during extraction";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  } finally {
    // Cleanup: Always delete the uploaded PDF after processing
    if (filePathToCleanup) {
      const { error: removeError } = await supabase.storage
        .from("rhp-uploads")
        .remove([filePathToCleanup]);
        
      if (removeError) {
        console.error(`Failed to cleanup ${filePathToCleanup} from storage:`, removeError);
      }
    }
  }
}
