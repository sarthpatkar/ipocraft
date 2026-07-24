import { NextResponse } from "next/server"; 
import { pollPdfParse } from "@/lib/rhp-extraction";

export const maxDuration = 10; // Very fast polling

export async function POST(req: Request) {
  try {
    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "No jobId provided." },
        { status: 400 }
      );
    }
    
    const result = await pollPdfParse(jobId);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[step2-poll] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
