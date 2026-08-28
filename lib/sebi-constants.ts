/**
 * SEBI IPO investor-category investment thresholds (in ₹).
 *
 * These are regulatory brackets set by SEBI, not arbitrary numbers — they
 * were previously duplicated as bare literals (200000, 1000000) across
 * several calculator files with no shared source, which made it easy for a
 * future SEBI threshold change to be applied inconsistently (or missed
 * entirely) across the codebase.
 *
 * - Retail Individual Investor (RII): application value up to and including
 *   this amount.
 * - Small HNI (sHNI / NII-2): application value from just above the retail
 *   limit up to and including SHNI_MAX_INVESTMENT.
 * - Big HNI (bHNI / NII-1): application value above SHNI_MAX_INVESTMENT.
 *   SEBI defines no upper bound for bHNI, so there is intentionally no
 *   corresponding "max" constant for it.
 */
export const SEBI_RETAIL_MAX_INVESTMENT = 200_000; // ₹2,00,000
export const SEBI_SHNI_MAX_INVESTMENT = 1_000_000; // ₹10,00,000
