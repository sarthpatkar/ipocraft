import { NextResponse } from "next/server"; 
import { extractSection } from "@/lib/rhp-extraction";

export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "No text provided." }, { status: 400 });

    const result = await extractSection(text, "financials");

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
