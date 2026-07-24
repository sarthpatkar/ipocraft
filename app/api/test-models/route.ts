import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { extractPdfText } from "@/lib/rhp-extraction";

const COMMON_RULES = `CRITICAL EXTRACTION RULES:
1. ONLY extract information directly stated in the text.
2. DO NOT hallucinate, infer, or calculate values. If a field is missing, return null.
3. For money amounts, return ONLY the raw number in Crores (e.g. '110.24' not '110.24 Cr').
4. Return dates in YYYY-MM-DD format.
5. For percentage fields, return the number only (e.g., 47.07).
6. Return VALID JSON only — no markdown code blocks, no comments, no trailing commas.
`;

const PROMPT_IDENTITY = `You are a financial data extractor. Extract core identity and narrative fields from this RHP document.
${COMMON_RULES}
Return a JSON object with EXACTLY these fields (use null if not found):
{
  "name": "Full company name exactly as stated",
  "exchange": "BSE and/or NSE",
  "sector": "Industry/sector",
  "ipo_type": "mainboard or sme",
  "open_date": "Issue opening date in YYYY-MM-DD",
  "close_date": "Issue closing date in YYYY-MM-DD",
  "listing_date": "Proposed listing date in YYYY-MM-DD",
  "about_company": "2-4 sentence summary of the business",
  "objectives": "Numbered list of fund utilization plans",
  "company_strengths": "Numbered list of strengths (one per line)",
  "company_risks": "Numbered list of top 5-7 risks (one per line)",
  "lead_managers": "Book Running Lead Manager(s) — comma separated",
  "registrar": "Registrar to the Issue — full name",
  "listing_exchange": "e.g., 'NSE, BSE'",
  "company_address": "Registered office address",
  "company_phone": "Company contact phone",
  "company_email": "Company contact email",
  "company_website": "Company website URL",
  "registrar_phone": "Registrar phone number",
  "registrar_email": "Registrar email address",
  "registrar_website": "Registrar website URL"
}`;

const PROMPT_FINANCIALS = `You are a financial data extractor. Extract valuation and issue metrics from this RHP document.
${COMMON_RULES}
Return a JSON object with EXACTLY these fields (use null if not found):
{
  "issue_size": "Total issue size (e.g., '110.24')",
  "fresh_issue": "Fresh issue component (e.g., '110.24')",
  "promoter_holding_pre": "Pre-issue promoter holding percentage as number",
  "promoter_holding_post": "Post-issue promoter holding percentage as number",
  "reservation_qib": "QIB reservation percentage",
  "reservation_nii": "NII/HNI reservation percentage",
  "reservation_rii": "Retail reservation percentage",
  "reservation_employee": "Employee reservation details",
  "eps_pre": "Pre-issue EPS as number",
  "eps_post": "Post-issue EPS (diluted) as number",
  "pe_pre": "Pre-issue P/E ratio as number",
  "pe_post": "Post-issue P/E ratio as number",
  "roce": "Return on Capital Employed as number (percentage)",
  "debt_equity": "Debt-to-Equity ratio as number",
  "pat_margin": "PAT margin percentage as number",
  "market_cap": "Estimated market cap post-issue if mentioned"
}`;

const PROMPT_MECHANICS = `You are a financial data extractor. Extract lot and mechanic details from this RHP document.
${COMMON_RULES}
Return a JSON object with EXACTLY these fields (use null if not found):
{
  "price_min": "Lower end of price band as a number",
  "price_max": "Upper end of price band as a number",
  "lot_size": "Minimum bid lot size as a number",
  "face_value": "Face value per equity share as a number",
  "anchor_investors": "Anchor investor allocation details",
  "market_maker_shares_offered": "Market maker shares offered as a number (SME IPOs only)",
  "reserved_market_maker": "Reserved market maker percentage as a number (SME IPOs only)"
}`;

const OPENROUTER_MODELS = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "openai/gpt-oss-20b:free"
];

function extractJsonFromResponse(text: string) {
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0].trim();
  return text.trim();
}

async function callOpenRouter(model: string, prompt: string, contentText: string) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: contentText.slice(0, 100000) }
      ],
      temperature: 0.1,
      max_tokens: 4000
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${res.status} ${err.substring(0, 200)}`);
  }
  const data = await res.json();
  const rawText = data?.choices?.[0]?.message?.content || "{}";
  
  try {
    const jsonStr = extractJsonFromResponse(rawText);
    return JSON.parse(jsonStr);
  } catch (e) {
    return {};
  }
}

async function runEvaluation() {
  try {
    const pdfPath = path.join(process.cwd(), "../docs/rhp-document.pdf");
    if (!fs.existsSync(pdfPath)) {
      console.error("PDF not found");
      return;
    }

    const cacheFile = path.join(process.cwd(), "rhp-markdown.md");
    let text = "";
    
    if (fs.existsSync(cacheFile)) {
      text = fs.readFileSync(cacheFile, "utf8");
    } else {
      const buffer = fs.readFileSync(pdfPath);
      text = await extractPdfText(buffer);
      fs.writeFileSync(cacheFile, text);
    }

    const resultsSummary: Record<string, any> = {};

    for (const model of OPENROUTER_MODELS) {
      try {
        const [idData, finData, mechData] = await Promise.all([
          callOpenRouter(model, PROMPT_IDENTITY, text),
          callOpenRouter(model, PROMPT_FINANCIALS, text),
          callOpenRouter(model, PROMPT_MECHANICS, text)
        ]);

        const merged = { ...idData, ...finData, ...mechData };
        const allKeys = Object.keys(merged);
        const extractedCount = allKeys.filter(k => merged[k] !== null && merged[k] !== "" && merged[k] !== undefined).length;
        
        resultsSummary[model] = {
          status: "SUCCESS",
          extracted: extractedCount,
          total: allKeys.length,
          data: merged
        };
      } catch (e: any) {
        resultsSummary[model] = {
          status: "FAILED",
          error: e.message
        };
      }
    }

    fs.writeFileSync(path.join(process.cwd(), "model-eval-results.json"), JSON.stringify(resultsSummary, null, 2));
    console.log("Evaluation completed and saved to model-eval-results.json");
  } catch (err: any) {
    console.error("Evaluation failed", err.message);
  }
}

export async function GET() {
  // Fire and forget
  runEvaluation();
  return NextResponse.json({ success: true, message: "Evaluation started in background. Check model-eval-results.json in a few minutes." });
}
