import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function extractJsonFromResponse(text) {
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0].trim();
  return text.trim();
}

async function callOpenRouter(model, prompt, contentText) {
  console.log(`[${model}] Making API call...`);
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://ipocraft.com",
      "X-Title": "IPOCraft Model Eval"
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: contentText.slice(0, 100000) } // Cap to avoid 413
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
    console.error(`[${model}] Failed to parse JSON:`, rawText.substring(0, 100));
    return {};
  }
}

async function extractLlamaParse(pdfPath) {
  const cacheFile = "rhp-markdown.md";
  if (fs.existsSync(cacheFile)) {
    console.log("Using cached LlamaParse markdown...");
    return fs.readFileSync(cacheFile, "utf8");
  }

  console.log("Uploading PDF to LlamaParse (this will take a few minutes)...");
  const buffer = fs.readFileSync(pdfPath);
  const blob = new Blob([new Uint8Array(buffer)], { type: "application/pdf" });
  const formData = new FormData();
  formData.append("file", blob, "document.pdf");
  // Don't append tier agentic to avoid free tier error

  const uploadRes = await fetch("https://api.cloud.llamaindex.ai/api/parsing/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LLAMAPARSE_API_KEY}`
    },
    body: formData
  });

  if (!uploadRes.ok) {
    throw new Error("LlamaParse upload failed: " + await uploadRes.text());
  }

  const uploadData = await uploadRes.json();
  const jobId = uploadData.id;
  console.log(`Job ID: ${jobId}`);

  let maxAttempts = 150;
  while (maxAttempts > 0) {
    await new Promise(r => setTimeout(r, 3000));
    const statusRes = await fetch(`https://api.cloud.llamaindex.ai/api/parsing/job/${jobId}`, {
      headers: { Authorization: `Bearer ${process.env.LLAMAPARSE_API_KEY}` }
    });
    const statusData = await statusRes.json();
    console.log(`Status: ${statusData.status} (${150 - maxAttempts} attempts)`);

    if (statusData.status === "SUCCESS") {
      const resultRes = await fetch(`https://api.cloud.llamaindex.ai/api/parsing/job/${jobId}/result/markdown`, {
        headers: { Authorization: `Bearer ${process.env.LLAMAPARSE_API_KEY}` }
      });
      const resultData = await resultRes.json();
      const markdown = resultData.markdown || resultData.markdown_full || "";
      fs.writeFileSync(cacheFile, markdown);
      return markdown;
    } else if (statusData.status === "ERROR") {
      throw new Error("LlamaParse failed.");
    }
    maxAttempts--;
  }
  throw new Error("LlamaParse timed out");
}

async function main() {
  const pdfPath = path.join(__dirname, "../docs/rhp-document.pdf");
  
  if (!fs.existsSync(pdfPath)) {
    console.error("Could not find", pdfPath);
    return;
  }

  let text;
  try {
    text = await extractLlamaParse(pdfPath);
    console.log(`Got markdown text: ${text.length} characters`);
  } catch (e) {
    console.error("Error with LlamaParse:", e);
    return;
  }

  const resultsSummary = {};

  for (const model of OPENROUTER_MODELS) {
    console.log(`\n============================================`);
    console.log(`EVALUATING MODEL: ${model}`);
    console.log(`============================================`);
    try {
      const [idData, finData, mechData] = await Promise.all([
        callOpenRouter(model, PROMPT_IDENTITY, text),
        callOpenRouter(model, PROMPT_FINANCIALS, text),
        callOpenRouter(model, PROMPT_MECHANICS, text)
      ]);

      const merged = { ...idData, ...finData, ...mechData };
      const allKeys = Object.keys(merged);
      const extractedCount = allKeys.filter(k => merged[k] !== null && merged[k] !== "" && merged[k] !== undefined).length;
      
      console.log(`[RESULT] ${model} extracted ${extractedCount} / ${allKeys.length} fields`);
      resultsSummary[model] = {
        status: "SUCCESS",
        extracted: extractedCount,
        total: allKeys.length,
        data: merged
      };
    } catch (e) {
      console.error(`[RESULT] ${model} FAILED:`, e.message);
      resultsSummary[model] = {
        status: "FAILED",
        error: e.message
      };
    }
  }

  fs.writeFileSync("model-eval-results.json", JSON.stringify(resultsSummary, null, 2));
  console.log("\nDone! Saved to model-eval-results.json");
  
  console.log("\n--- RANKING SUMMARY ---");
  Object.entries(resultsSummary)
    .filter(([_, res]) => res.status === "SUCCESS")
    .sort((a, b) => b[1].extracted - a[1].extracted)
    .forEach(([mod, res], i) => {
      console.log(`#${i+1}: ${mod} -> ${res.extracted} fields`);
    });
}

main();
