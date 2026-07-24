import { NextResponse } from "next/server"; 
import { extractFieldsFromText } from "@/lib/rhp-extraction";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60; // AI Extraction takes ~15-20s

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  let filePathToCleanup: string | null = null;

  try {
    const { text, filePath } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "No text provided for extraction." },
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

    // Extract
    const result = await extractFieldsFromText(text);

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
    console.error("[step3-extract] Error:", error);

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
    // Cleanup: Always delete the uploaded PDF after processing is completely done
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
