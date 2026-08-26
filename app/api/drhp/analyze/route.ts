import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple in-memory rate limit (5/hour per IP)
const rlStore = new Map<string, { count: number; resetAt: number }>();
function checkDRHPLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rlStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rlStore.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

function getGroq(): OpenAI | null {
  if (!process.env.GROQ_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" });
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
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkDRHPLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded. You can analyze 5 DRHPs per hour." }, { status: 429 });
  }

  const { url } = await req.json().catch(() => ({ url: null }));
  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return NextResponse.json({ error: "Please provide a valid DRHP PDF URL." }, { status: 400 });
  }

  // Fetch PDF text (first 50KB is usually enough for key sections)
  let pdfText = "";
  try {
    const res = await fetch(url, {
      headers: { "Accept": "application/pdf,*/*", "User-Agent": "IPOCraft-DRHPAnalyzer/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const j = await res.json();
      pdfText = JSON.stringify(j).slice(0, 30000);
    } else {
      const buf = await res.arrayBuffer();
      // Basic PDF text extraction — look for text between stream markers
      const bytes = new Uint8Array(buf);
      const decoder = new TextDecoder("utf-8", { fatal: false });
      const raw = decoder.decode(bytes.slice(0, 200000));
      pdfText = raw.replace(/[\x00-\x08\x0b-\x0c\x0e-\x1f]/g, " ").slice(0, 40000);
    }
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch the DRHP PDF. Please check the URL and try again." }, { status: 422 });
  }

  const client = getGroq();
  if (!client) {
    return NextResponse.json({ error: "AI service not configured." }, { status: 503 });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze this DRHP text:\n\n${pdfText}` },
      ],
      temperature: 0.2,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "AI analysis failed. Please try again shortly." }, { status: 500 });
  }
}
