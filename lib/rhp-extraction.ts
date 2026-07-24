/**
 * RHP (Red Herring Prospectus) extraction module.
 *
 * Extracts text from an RHP PDF, sends it to the AI provider chain
 * with a structured prompt, validates the result, and returns
 * form-ready field values.
 *
 * @module rhp-extraction
 */

import { extractWithFallback, type AiExtractionResult } from "./ai-providers";
// Bypassing pdf-parse's root index.js which contains a buggy testing block
// that crashes Next.js by attempting to read a test PDF synchronously.
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

// ─── Types ─────────────────────────────────────────────────────────────────────

/** Fields that can be extracted from an RHP document. */
export interface RhpExtractedFields {
  name?: string | null;
  exchange?: string | null;
  sector?: string | null;
  ipo_type?: string | null;
  open_date?: string | null;
  close_date?: string | null;
  listing_date?: string | null;
  price_min?: string | null;
  price_max?: string | null;
  lot_size?: string | null;
  face_value?: string | null;
  issue_size?: string | null;
  fresh_issue?: string | null;
  about_company?: string | null;
  objectives?: string | null;
  company_strengths?: string | null;
  company_risks?: string | null;
  promoter_holding_pre?: string | null;
  promoter_holding_post?: string | null;
  reservation_qib?: string | null;
  reservation_nii?: string | null;
  reservation_rii?: string | null;
  reservation_employee?: string | null;
  lead_managers?: string | null;
  registrar?: string | null;
  drhp_link?: string | null;
  rhp_link?: string | null;
  listing_exchange?: string | null;
  anchor_investors?: string | null;
  retail_min_lots?: string | null;
  retail_min_shares?: string | null;
  retail_min_amount?: string | null;
  retail_max_lots?: string | null;
  retail_max_shares?: string | null;
  retail_max_amount?: string | null;
  shni_min_lots?: string | null;
  shni_min_shares?: string | null;
  shni_min_amount?: string | null;
  shni_max_lots?: string | null;
  shni_max_shares?: string | null;
  shni_max_amount?: string | null;
  bhni_min_lots?: string | null;
  bhni_min_shares?: string | null;
  bhni_min_amount?: string | null;
  bhni_max_lots?: string | null;
  bhni_max_shares?: string | null;
  bhni_max_amount?: string | null;
  eps_pre?: string | null;
  eps_post?: string | null;
  pe_pre?: string | null;
  pe_post?: string | null;
  roce?: string | null;
  debt_equity?: string | null;
  pat_margin?: string | null;
  market_cap?: string | null;
  company_address?: string | null;
  company_phone?: string | null;
  company_email?: string | null;
  company_website?: string | null;
  registrar_phone?: string | null;
  registrar_email?: string | null;
  registrar_website?: string | null;
  market_maker_shares_offered?: string | null;
  reserved_market_maker?: string | null;
}

export interface ExtractionResult {
  fields: RhpExtractedFields;
  provider: string;
  model: string;
  warnings: string[];
  extractedFieldCount: number;
  totalFieldCount: number;
}

/**
 * Extracts raw text from a PDF buffer using LlamaParse API,
 * falling back to pdf-parse if the API key is missing.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  const llamaKey = process.env.LLAMAPARSE_API_KEY;

  if (llamaKey) {
    try {
      const formData = new FormData();
      const blob = new Blob([new Uint8Array(buffer)], { type: 'application/pdf' });
      formData.append("file", blob, "document.pdf");
      
      const uploadRes = await fetch("https://api.cloud.llamaindex.ai/api/parsing/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${llamaKey}`,
          Accept: "application/json"
        },
        body: formData
      });

      if (!uploadRes.ok) {
        throw new Error("LlamaParse upload failed: " + await uploadRes.text());
      }
      const uploadData = await uploadRes.json();
      const jobId = uploadData.id;

      let maxAttempts = 150; // 5 minutes max
      while (maxAttempts > 0) {
        await new Promise(r => setTimeout(r, 2000));
        const statusRes = await fetch(`https://api.cloud.llamaindex.ai/api/parsing/job/${jobId}`, {
           headers: { Authorization: `Bearer ${llamaKey}` }
        });
        const statusData = await statusRes.json();
        
        if (statusData.status === "SUCCESS") {
           const resultRes = await fetch(`https://api.cloud.llamaindex.ai/api/parsing/job/${jobId}/result/markdown`, {
              headers: { Authorization: `Bearer ${llamaKey}` }
           });
           
           const contentType = resultRes.headers.get("content-type") || "";
           if (contentType.includes("application/json")) {
             const resultData = await resultRes.json();
             return resultData.markdown || resultData.markdown_full || "";
           } else {
             return await resultRes.text();
           }
        } else if (statusData.status === "ERROR") {
           throw new Error("LlamaParse processing failed");
        }
        maxAttempts--;
      }
      throw new Error("LlamaParse timed out");
    } catch (err) {
      console.warn("LlamaParse failed, falling back to pdf-parse:", err);
    }
  }

  // Fallback to basic pdf-parse
  const result = await pdfParse(buffer);
  const maxChars = 120_000;
  if (result.text.length > maxChars) {
    return result.text.slice(0, maxChars) + "\n\n[... document truncated ...]";
  }
  return result.text;
}

// ─── Extraction Prompts (Multi-Stage Pipeline) ────────────────────────────────

const COMMON_RULES = `
CRITICAL RULES:
1. Extract ONLY information that is EXPLICITLY stated in the document.
2. If a field is not found or unclear, return null — NEVER guess, estimate, or hallucinate.
3. Return numbers as plain numbers without currency symbols or commas (e.g., 85 not "Rs. 85").
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
  "issue_size": "Total issue size (e.g., '110.24 Cr')",
  "fresh_issue": "Fresh issue component (e.g., '110.24 Cr')",
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

// ─── Response Parsing ───────────────────────────────────────────────────────────

/**
 * Extract JSON from a model response that may contain markdown code blocks
 * or other wrapping text.
 */
function extractJsonFromResponse(text: string): string {
  // Try to find JSON in code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();

  // Try to find raw JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0].trim();

  return text.trim();
}

// ─── Validation ─────────────────────────────────────────────────────────────────

/**
 * Validate and clean the extracted fields. Returns warnings for
 * inconsistencies but does NOT reject the data — the admin reviews everything.
 */
function validateExtraction(
  fields: Record<string, unknown>
): { cleaned: RhpExtractedFields; warnings: string[] } {
  const warnings: string[] = [];
  const cleaned: Record<string, string | null> = {};

  // Convert all values to strings or null
  for (const [key, value] of Object.entries(fields)) {
    if (value === null || value === undefined || value === "") {
      cleaned[key] = null;
    } else {
      cleaned[key] = String(value);
    }
  }

  // Cross-consistency checks
  const priceMin = parseFloat(cleaned.price_min || "");
  const priceMax = parseFloat(cleaned.price_max || "");
  if (!isNaN(priceMin) && !isNaN(priceMax) && priceMin > priceMax) {
    warnings.push(
      `Price band inconsistency: min (${priceMin}) > max (${priceMax}). Please verify.`
    );
  }
  
  const lotSize = parseFloat(cleaned.lot_size || "");
  // ─── Mathematical Determinism (SEBI Rules) ─────────────────────────
  if (!isNaN(priceMax) && !isNaN(lotSize) && priceMax > 0 && lotSize > 0) {
    const lotPrice = priceMax * lotSize;
    
    // RETAIL: Max investment < ₹2,00,000
    const retailMaxLots = Math.floor(199999 / lotPrice);
    cleaned.retail_min_lots = "1";
    cleaned.retail_min_shares = String(lotSize);
    cleaned.retail_min_amount = String(lotPrice);
    
    if (retailMaxLots >= 1) {
      cleaned.retail_max_lots = String(retailMaxLots);
      cleaned.retail_max_shares = String(retailMaxLots * lotSize);
      cleaned.retail_max_amount = String(retailMaxLots * lotPrice);
    } else {
      cleaned.retail_max_lots = "1";
      cleaned.retail_max_shares = String(lotSize);
      cleaned.retail_max_amount = String(lotPrice);
    }

    // sHNI: Investment > ₹2,00,000 and <= ₹10,00,000
    const shniMinLots = retailMaxLots + 1;
    const shniMaxLots = Math.floor(1000000 / lotPrice);
    
    cleaned.shni_min_lots = String(shniMinLots);
    cleaned.shni_min_shares = String(shniMinLots * lotSize);
    cleaned.shni_min_amount = String(shniMinLots * lotPrice);
    
    if (shniMaxLots >= shniMinLots) {
      cleaned.shni_max_lots = String(shniMaxLots);
      cleaned.shni_max_shares = String(shniMaxLots * lotSize);
      cleaned.shni_max_amount = String(shniMaxLots * lotPrice);
    }

    // bHNI: Investment > ₹10,00,000
    const bhniMinLots = shniMaxLots > 0 ? shniMaxLots + 1 : shniMinLots + 1;
    cleaned.bhni_min_lots = String(bhniMinLots);
    cleaned.bhni_min_shares = String(bhniMinLots * lotSize);
    cleaned.bhni_min_amount = String(bhniMinLots * lotPrice);
  }

  const promoterPre = parseFloat(cleaned.promoter_holding_pre || "");
  const promoterPost = parseFloat(cleaned.promoter_holding_post || "");
  if (
    !isNaN(promoterPre) &&
    !isNaN(promoterPost) &&
    promoterPost > promoterPre
  ) {
    warnings.push(
      `Promoter holding post-issue (${promoterPost}%) > pre-issue (${promoterPre}%). This is unusual. Please verify.`
    );
  }

  // Date logical order
  const openDate = cleaned.open_date
    ? new Date(cleaned.open_date)
    : null;
  const closeDate = cleaned.close_date
    ? new Date(cleaned.close_date)
    : null;
  if (
    openDate &&
    closeDate &&
    !isNaN(openDate.getTime()) &&
    !isNaN(closeDate.getTime()) &&
    openDate > closeDate
  ) {
    warnings.push(
      `Open date (${cleaned.open_date}) is after close date (${cleaned.close_date}). Please verify.`
    );
  }

  return { cleaned: cleaned as RhpExtractedFields, warnings };
}

// ─── Main Extraction Function ───────────────────────────────────────────────────

/**
 * Extract IPO data from an RHP PDF buffer.
 *
 * 1. Extracts text from the PDF using pdf-parse
 * 2. Sends text to the AI provider fallback chain
 * 3. Parses and validates the JSON response
 * 4. Returns form-ready field values with metadata
 */
export async function extractFromRhp(
  pdfBuffer: Buffer
): Promise<ExtractionResult> {
  // Step 1: Extract text
  const pdfText = await extractPdfText(pdfBuffer);

  if (!pdfText.trim() || pdfText.trim().length < 100) {
    throw new Error(
      "PDF appears to be empty or contains too little text. " +
        "Make sure the PDF is not image-only (scanned documents are not supported)."
    );
  }

  // Step 2: Call AI pipeline in parallel
  const userPrompt = `Extract data from this RHP text:\n\n${pdfText}`;
  let aiResults: AiExtractionResult[];
  try {
    aiResults = await Promise.all([
      extractWithFallback(PROMPT_IDENTITY, userPrompt),
      extractWithFallback(PROMPT_FINANCIALS, userPrompt),
      extractWithFallback(PROMPT_MECHANICS, userPrompt)
    ]);
  } catch (err) {
    throw new Error(
      `AI extraction failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // Step 3: Parse and Merge JSONs
  let merged: Record<string, unknown> = {};
  for (let i = 0; i < aiResults.length; i++) {
    const jsonStr = extractJsonFromResponse(aiResults[i].text);
    try {
      const parsed = JSON.parse(jsonStr);
      merged = { ...merged, ...parsed };
    } catch {
      console.warn(`AI block ${i} returned invalid JSON.`);
    }
  }

  // Step 4: Validate
  const { cleaned, warnings } = validateExtraction(merged);

  // Count extracted fields
  const allFields = Object.entries(cleaned);
  const extractedFields = allFields.filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );

  return {
    fields: cleaned,
    provider: aiResults[0].provider,
    model: aiResults[0].model,
    warnings,
    extractedFieldCount: extractedFields.length,
    totalFieldCount: allFields.length,
  };
}
