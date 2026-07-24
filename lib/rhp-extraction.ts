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

export async function startPdfParse(buffer: Buffer): Promise<{ type: "job", jobId: string } | { type: "text", text: string }> {
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
      return { type: "job", jobId: uploadData.id };
    } catch (err) {
      console.warn("LlamaParse upload failed, falling back to pdf-parse:", err);
    }
  }

  // Fallback to basic pdf-parse immediately
  const result = await pdfParse(buffer);
  const maxChars = 120_000;
  const text = result.text.length > maxChars 
    ? result.text.slice(0, maxChars) + "\n\n[... document truncated ...]"
    : result.text;
    
  return { type: "text", text };
}

export async function pollPdfParse(jobId: string): Promise<{ status: "PENDING" | "SUCCESS" | "ERROR", text?: string }> {
  const llamaKey = process.env.LLAMAPARSE_API_KEY;
  if (!llamaKey) throw new Error("Missing LLAMAPARSE_API_KEY");

  const statusRes = await fetch(`https://api.cloud.llamaindex.ai/api/parsing/job/${jobId}`, {
     headers: { Authorization: `Bearer ${llamaKey}` }
  });
  
  if (!statusRes.ok) {
    throw new Error("Failed to check LlamaParse status");
  }
  
  const statusData = await statusRes.json();
  
  if (statusData.status === "SUCCESS") {
     const resultRes = await fetch(`https://api.cloud.llamaindex.ai/api/parsing/job/${jobId}/result/markdown`, {
        headers: { Authorization: `Bearer ${llamaKey}` }
     });
     
     const contentType = resultRes.headers.get("content-type") || "";
     let text = "";
     if (contentType.includes("application/json")) {
       const resultData = await resultRes.json();
       text = resultData.markdown || resultData.markdown_full || "";
     } else {
       text = await resultRes.text();
     }
     
     // Cap the text to prevent 750k+ token payloads from crashing the AI
     const maxChars = 120_000;
     if (text.length > maxChars) {
       text = text.slice(0, maxChars) + "\n\n[... document truncated ...]";
     }
     
     return { status: "SUCCESS", text };
  } else if (statusData.status === "ERROR") {
     return { status: "ERROR" };
  }
  
  return { status: "PENDING" };
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
 * Extract IPO data section from text extracted from an RHP PDF.
 */
export async function extractSection(
  pdfText: string,
  section: "identity" | "financials" | "mechanics"
): Promise<ExtractionResult> {
  if (!pdfText || pdfText.trim() === "") {
    throw new Error(
      "Failed to extract any text from the PDF. It may be encrypted or image-only."
    );
  }

  if (pdfText.length < 50) {
    throw new Error(
      "Extracted text is too short. Make sure the PDF is not image-only (scanned documents are not supported)."
    );
  }

  const userPrompt = `Extract data from this RHP text:\n\n${pdfText}`;
  
  let promptToUse = PROMPT_IDENTITY;
  if (section === "financials") promptToUse = PROMPT_FINANCIALS;
  if (section === "mechanics") promptToUse = PROMPT_MECHANICS;

  let aiResult: AiExtractionResult;
  try {
    aiResult = await extractWithFallback(promptToUse, userPrompt);
  } catch (err) {
    throw new Error(
      `AI extraction failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  const jsonStr = extractJsonFromResponse(aiResult.text);
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    console.warn(`AI block ${section} returned invalid JSON.`);
  }

  const { cleaned, warnings } = validateExtraction(parsed);

  const allFields = Object.entries(cleaned);
  const extractedFields = allFields.filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );

  return {
    fields: cleaned as any,
    provider: aiResult.provider,
    model: aiResult.model,
    warnings,
    extractedFieldCount: extractedFields.length,
    totalFieldCount: allFields.length,
  };
}
