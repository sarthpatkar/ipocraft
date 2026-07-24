import { NextResponse } from "next/server"; 
import { extractFromRhp } from "@/lib/rhp-extraction";

/**
 * Vercel configuration for RHP extraction.
 * - maxDuration: 60s to allow AI processing time
 * - bodyParser sizeLimit: 20MB for large RHP PDFs
 */
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No PDF file provided. Please upload an RHP PDF document." },
        { status: 400 }
      );
    }

    // Validate file type
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF document." },
        { status: 400 }
      );
    }

    // Validate file size (max 20MB)
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 20MB.`,
        },
        { status: 400 }
      );
    }

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

    // Convert to buffer
    const bytes = await file.arrayBuffer();
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
  }
}
