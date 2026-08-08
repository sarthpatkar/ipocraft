/**
 * Calculates a proprietary "Hype Score" out of 100 for an IPO based on live GMP and subscription momentum.
 * This function uses a robust heuristic that degrades gracefully if data is missing.
 */
export function calculateHypeScore({
  gmp,
  issuePrice,
  qibSub,
  retailSub,
  issueSize, // Issue size in crores
}: {
  gmp: number | null | undefined;
  issuePrice: number | null | undefined;
  qibSub: number | null | undefined;
  retailSub: number | null | undefined;
  issueSize: number | null | undefined;
}): number | null {
  // If we don't have enough data to make any reasonable prediction, return null.
  if ((gmp == null || issuePrice == null || issuePrice <= 0) && (qibSub == null && retailSub == null)) {
    return null;
  }

  let totalScore = 0;
  let maxPossibleScore = 0;

  // 1. GMP Component (Max 55 points)
  if (gmp != null && issuePrice != null && issuePrice > 0) {
    const gmpPercent = (gmp / issuePrice) * 100;
    
    // We cap GMP contribution at 100% premium to prevent ridiculous scores for 500% SME GMPs.
    const cappedGmpPercent = Math.max(0, Math.min(100, gmpPercent));
    
    // Score scales linearly up to 100% GMP
    const gmpScore = (cappedGmpPercent / 100) * 55;
    
    totalScore += gmpScore;
    maxPossibleScore += 55;
  }

  // 2. QIB Subscription Component (Max 25 points - Institutional money is smart money)
  if (qibSub != null) {
    // QIBs usually bid on the last day. A 50x+ QIB sub is massive.
    const cappedQib = Math.max(0, Math.min(100, qibSub));
    
    // Non-linear scaling: getting to 10x gets you 10 points, getting to 50x gets you 20, 100x gets 25
    let qibScore = 0;
    if (cappedQib < 10) qibScore = (cappedQib / 10) * 10;
    else if (cappedQib < 50) qibScore = 10 + ((cappedQib - 10) / 40) * 10;
    else qibScore = 20 + ((cappedQib - 50) / 50) * 5;

    totalScore += qibScore;
    maxPossibleScore += 25;
  }

  // 3. Retail Subscription Component (Max 20 points)
  if (retailSub != null) {
    // Retail caps out faster. A 30x+ retail sub is very high.
    const cappedRetail = Math.max(0, Math.min(50, retailSub));
    
    let retailScore = 0;
    if (cappedRetail < 10) retailScore = (cappedRetail / 10) * 10;
    else retailScore = 10 + ((cappedRetail - 10) / 40) * 10;

    totalScore += retailScore;
    maxPossibleScore += 20;
  }

  // Normalize the score out of 100 based on the data points we actually had available.
  // This prevents the score from being a 50/100 just because the IPO hasn't opened yet (and thus has 0 sub score).
  if (maxPossibleScore === 0) return null;

  let normalizedScore = (totalScore / maxPossibleScore) * 100;

  // 4. SME Volatility Penalty
  // If this is a very small SME IPO (< 50 Cr) and the score relies HEAVILY on GMP, we dial it back slightly (10%)
  // because SME GMPs are highly volatile and easily manipulated.
  if (issueSize != null && issueSize < 50 && maxPossibleScore < 100) {
      normalizedScore = normalizedScore * 0.90;
  }

  return Math.max(0, Math.min(100, Math.round(normalizedScore)));
}

/**
 * Returns a color class based on the hype score.
 */
export function getHypeScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500"; // Exceptional
  if (score >= 60) return "text-green-500";   // Good
  if (score >= 40) return "text-yellow-500";  // Average
  if (score >= 20) return "text-orange-500";  // Poor
  return "text-red-500";                      // Avoid
}

/**
 * Returns a descriptive label for the hype score without giving direct financial advice.
 */
export function getHypeScoreLabel(score: number): string {
  if (score >= 80) return "Exceptional Momentum";
  if (score >= 60) return "Strong Momentum";
  if (score >= 40) return "Moderate Interest";
  if (score >= 20) return "Low Interest";
  return "Very Weak";
}
