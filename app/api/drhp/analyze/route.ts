import { NextRequest, NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/rateLimit";
import { extractWithFallback } from "@/lib/ai-providers";

// Bypassing pdf-parse's root index.js, which contains a debug block that
// synchronously reads a test PDF and crashes Next.js on import. Same
// workaround already used in lib/rhp-extraction.ts.
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 5 analyses per hour per IP — Upstash-backed in production, in-memory in local dev.
const checkDRHPLimit = createRateLimiter("drhp", 5, 60 * 60 * 1000);

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

const SYSTEM_PROMPT = `You are a financial analyst specializing in IPO analysis for the Indian market.
You will receive text extracted from a DRHP (Draft Red Herring Prospectus).
Extract and return ONLY a valid JSON object with this structure (no markdown, no explanation):
{
  "company_name": "string",
  "summary": "2 sentence plain-language overview of what the company does",
  "risks": ["risk 1", "risk 2", "risk 3", "risk 4", "risk 5"],
  "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3", "opportunity 4", "opportunity 5"],
  "financials": {
    "revenue": "₹X Cr (FY24)",
    "profit": "₹X Cr (FY24)",
    "eps": "₹X",
    "pe": "Xp/e",
    "roce": "X%"
  }
}
Focus on the most investor-relevant information. Use "—" for any field you cannot find.`;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed } = await checkDRHPLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded. You can analyze 5 DRHPs per hour." }, { status: 429 });
  }

  const { url } = await req.json().catch(() => ({ url: null }));
  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return NextResponse.json({ error: "Please provide a valid DRHP PDF URL." }, { status: 400 });
  }

  // Fetch and parse the actual PDF text (not a raw byte-to-string decode —
  // PDF is a binary/compressed container, not plain text).
  let pdfText = "";
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/pdf,*/*", "User-Agent": "IPOCraft-DRHPAnalyzer/1.0" },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const j = await res.json();
      pdfText = JSON.stringify(j).slice(0, 30000);
    } else {
      const buf = Buffer.from(await res.arrayBuffer());
      const parsed = await pdfParse(buf, { max: 60 }); // first ~60 pages is plenty for key sections
      pdfText = (parsed.text || "").replace(/\s+/g, " ").trim().slice(0, 40000);
      if (!pdfText) throw new Error("PDF parsed but contained no extractable text (likely scanned/image-only)");
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to read the DRHP PDF. Please check the URL and try a text-based (non-scanned) PDF." },
      { status: 422 }
    );
  }

  try {
    const { text } = await extractWithFallback(SYSTEM_PROMPT, `Analyze this DRHP text:\n\n${pdfText}`);
    const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```\s*$/, "");
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "AI analysis failed. Please try again shortly." }, { status: 500 });
  }
}
