import { NextResponse } from "next/server"; 
import { startPdfParse } from "@/lib/rhp-extraction";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60; // Needs some time to download and upload to LlamaParse

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { filePath } = await req.json();

    if (!filePath) {
      return NextResponse.json(
        { error: "No filePath provided." },
        { status: 400 }
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

    // Start parsing
    const result = await startPdfParse(buffer);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[step1-parse] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
