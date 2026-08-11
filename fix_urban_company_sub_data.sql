-- ============================================================
-- FINAL SUBSCRIPTION DATA CORRECTIONS
-- Research source: mstock.com, finology.in, verified Aug 2026
-- Run in Supabase SQL Editor
-- ============================================================

BEGIN;

-- Urban Company IPO — subscription data was wrong
-- Actual: 103.63x total, QIB 140.20x, NII 74.04x, RII 39.25x
UPDATE public.ipos
SET
    sub_total = 103.63,
    sub_qib   = 140.20,
    sub_nii   = 74.04,
    sub_rii   = 39.25
WHERE slug = 'urban-company-ipo';

COMMIT;

-- Verify Urban Company
SELECT slug, name, open_date, listing_date, price_min, price_max,
       listing_price, listing_gain_percent, fresh_issue,
       sub_total, sub_qib, sub_nii, sub_rii,
       promoter_holding_pre, promoter_holding_post
FROM public.ipos
WHERE slug = 'urban-company-ipo';
