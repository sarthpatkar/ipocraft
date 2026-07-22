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

// ─── PDF Text Extraction ────────────────────────────────────────────────────────

/**
 * Extracts raw text from a PDF buffer using pdf-parse.
 * Truncates to ~120K characters to fit within model context limits.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  // Dynamic import to avoid issues when pdf-parse is not installed
  const pdfParse = ((await import("pdf-parse")) as any).default || (await import("pdf-parse"));
  const result = await pdfParse(buffer);

  // Truncate to ~120K chars to stay within most model context limits
  const maxChars = 120_000;
  if (result.text.length > maxChars) {
    return result.text.slice(0, maxChars) + "\n\n[... document truncated ...]";
  }
  return result.text;
}

// ─── Extraction Prompt ──────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a financial document data extractor specialized in Indian IPO Red Herring Prospectus (RHP) documents. Your task is to extract structured data from the provided RHP text.

CRITICAL RULES:
1. Extract ONLY information that is EXPLICITLY stated in the document.
2. If a field is not found or unclear, return null — NEVER guess, estimate, or hallucinate.
3. Return numbers as plain numbers without currency symbols or commas (e.g., 85 not "Rs. 85" or "₹85").
4. Return dates in YYYY-MM-DD format (e.g., 2026-03-15).
5. For percentage fields, return the number only (e.g., 47.07 not "47.07%").
6. For text fields (about_company, objectives, strengths, risks), provide concise summaries from the document.
7. For company_strengths and company_risks, format as a numbered list with each point on a new line.
8. Do NOT add any information not present in the source document.
9. Return VALID JSON only — no markdown code blocks, no comments, no trailing commas.

Return a JSON object with these exact fields (use null for any field not found in the document):

{
  "name": "Full company name exactly as stated in the RHP",
  "exchange": "BSE and/or NSE where the IPO will list",
  "sector": "Industry/sector from the business overview section",
  "ipo_type": "mainboard or sme — based on the issue size and exchange segment",
  "open_date": "Issue opening date in YYYY-MM-DD format",
  "close_date": "Issue closing date in YYYY-MM-DD format",
  "listing_date": "Proposed listing date if mentioned, otherwise null",
  "price_min": "Lower end of price band as a number",
  "price_max": "Upper end of price band as a number",
  "lot_size": "Minimum bid lot size as a number",
  "face_value": "Face value per equity share as a number",
  "issue_size": "Total issue size (e.g., '110.24 Cr' — keep the unit)",
  "fresh_issue": "Fresh issue component if mentioned (e.g., '110.24 Cr')",
  "about_company": "2-4 sentence summary of the company's business from the RHP",
  "objectives": "Objects of the issue — summarize the fund utilization plan as a numbered list",
  "company_strengths": "Key competitive strengths — numbered list, one point per line",
  "company_risks": "Key risk factors — numbered list, one point per line (top 5-7 risks)",
  "promoter_holding_pre": "Pre-issue promoter holding percentage as a number",
  "promoter_holding_post": "Post-issue promoter holding percentage as a number",
  "reservation_qib": "QIB reservation percentage or description",
  "reservation_nii": "NII/HNI reservation percentage or description",
  "reservation_rii": "Retail reservation percentage or description",
  "reservation_employee": "Employee reservation details if any",
  "lead_managers": "Book Running Lead Manager(s) — comma separated names",
  "registrar": "Registrar to the Issue — full name",
  "listing_exchange": "Exchange(s) where shares will be listed (e.g., 'NSE, BSE')",
  "anchor_investors": "Anchor investor allocation details if mentioned",
  "retail_min_lots": "Minimum lots for retail application as a number",
  "retail_min_shares": "Minimum shares for retail application as a number",
  "retail_min_amount": "Minimum application amount for retail as a number",
  "retail_max_lots": "Maximum lots for retail application as a number",
  "retail_max_shares": "Maximum shares for retail application as a number",
  "retail_max_amount": "Maximum application amount for retail as a number",
  "shni_min_lots": "Minimum lots for sHNI category as a number",
  "shni_min_shares": "Minimum shares for sHNI category as a number",
  "shni_min_amount": "Minimum amount for sHNI category as a number",
  "shni_max_lots": "Maximum lots for sHNI category as a number",
  "shni_max_shares": "Maximum shares for sHNI category as a number",
  "shni_max_amount": "Maximum amount for sHNI category as a number",
  "bhni_min_lots": "Minimum lots for bHNI category as a number",
  "bhni_min_shares": "Minimum shares for bHNI category as a number",
  "bhni_min_amount": "Minimum amount for bHNI category as a number",
  "bhni_max_lots": "Maximum lots for bHNI category as a number",
  "bhni_max_shares": "Maximum shares for bHNI category as a number",
  "bhni_max_amount": "Maximum amount for bHNI category as a number",
  "eps_pre": "Pre-issue EPS as a number",
  "eps_post": "Post-issue EPS (diluted) as a number",
  "pe_pre": "Pre-issue P/E ratio as a number",
  "pe_post": "Post-issue P/E ratio as a number",
  "roce": "Return on Capital Employed as a number (percentage)",
  "debt_equity": "Debt-to-Equity ratio as a number",
  "pat_margin": "PAT margin percentage as a number",
  "market_cap": "Estimated market cap post-issue if mentioned",
  "company_address": "Registered office address",
  "company_phone": "Company contact phone",
  "company_email": "Company contact email",
  "company_website": "Company website URL",
  "registrar_phone": "Registrar phone number",
  "registrar_email": "Registrar email address",
  "registrar_website": "Registrar website URL",
  "market_maker_shares_offered": "Market maker shares offered as a number (SME IPOs)",
  "reserved_market_maker": "Reserved market maker percentage as a number (SME IPOs)"
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
  const retailMinShares = parseFloat(cleaned.retail_min_shares || "");
  if (
    !isNaN(lotSize) &&
    !isNaN(retailMinShares) &&
    retailMinShares > 0 &&
    retailMinShares !== lotSize
  ) {
    warnings.push(
      `Lot size (${lotSize}) doesn't match retail min shares (${retailMinShares}). Please verify.`
    );
  }

  const retailMinAmount = parseFloat(cleaned.retail_min_amount || "");
  if (
    !isNaN(priceMax) &&
    !isNaN(lotSize) &&
    !isNaN(retailMinAmount) &&
    retailMinAmount > 0
  ) {
    const expected = priceMax * lotSize;
    if (Math.abs(expected - retailMinAmount) > 1) {
      warnings.push(
        `Retail min amount (${retailMinAmount}) doesn't match price_max × lot_size (${expected}). Please verify.`
      );
    }
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

  // Step 2: Call AI with fallback
  const userPrompt = `Extract IPO data from this Red Herring Prospectus (RHP) document:\n\n${pdfText}`;

  let aiResult: AiExtractionResult;
  try {
    aiResult = await extractWithFallback(SYSTEM_PROMPT, userPrompt);
  } catch (err) {
    throw new Error(
      `AI extraction failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // Step 3: Parse JSON
  const jsonStr = extractJsonFromResponse(aiResult.text);
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error(
      `AI returned invalid JSON. Provider: ${aiResult.provider}/${aiResult.model}. ` +
        `Raw response (first 500 chars): ${aiResult.text.slice(0, 500)}`
    );
  }

  // Step 4: Validate
  const { cleaned, warnings } = validateExtraction(parsed);

  // Count extracted fields
  const allFields = Object.entries(cleaned);
  const extractedFields = allFields.filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );

  return {
    fields: cleaned,
    provider: aiResult.provider,
    model: aiResult.model,
    warnings,
    extractedFieldCount: extractedFields.length,
    totalFieldCount: allFields.length,
  };
}
