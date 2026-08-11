-- ============================================================
-- COMPREHENSIVE DATA CORRECTIONS — ALL 105 VERIFIED IPOs
-- Source: NSE/BSE listing records, SEBI filings, Chittorgarh,
--         Groww, Finology, InvestorGain (Aug 2026 research)
-- Run this in Supabase SQL Editor
-- ============================================================

BEGIN;

-- ============================================================
-- SECTION 1: Fix fresh_issue for pure OFS IPOs (= 0, not NULL)
-- These are OFS-only IPOs where the company received no proceeds
-- ============================================================

UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'tata-technologies';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'inox-india';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'cello-world';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'protean-egov-technologies';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'medi-assist-healthcare';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'juniper-hotels';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'gopal-snacks';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'krystal-integrated-services';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'bharti-hexacom';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'kronox-lab-sciences';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'unicommerce-esolutions';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'gala-precision-engineering';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'hyundai-motor-india';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'sagility-india';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'tenneco-clean-air-ipo';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'sbi-funds-management-limited-ipo';
UPDATE public.ipos SET fresh_issue = 0.0 WHERE slug = 'lg-electronics-india-ipo';

-- ============================================================
-- SECTION 2: Fix listing price and listing gain %
-- ============================================================

-- Ola Electric: listed at par ₹76 = 0% gain
UPDATE public.ipos
SET listing_price = 76.0, listing_gain_percent = 0.0
WHERE slug = 'ola-electric-mobility';

-- Kross Limited: listed at par ₹240 = 0% gain
UPDATE public.ipos
SET listing_price = 240.0, listing_gain_percent = 0.0
WHERE slug = 'kross-limited';

-- ============================================================
-- SECTION 3: Fix promoter holdings (research verified)
-- ============================================================

-- Medi Assist: PE-backed, Bessemer + Investcorp combined pre-IPO holding
UPDATE public.ipos
SET promoter_holding_pre = 57.57, promoter_holding_post = 39.67
WHERE slug = 'medi-assist-healthcare';

-- Swiggy: No identifiable promoters per SEBI (professionally managed)
UPDATE public.ipos
SET promoter_holding_pre = 0.0, promoter_holding_post = 0.0
WHERE slug = 'swiggy-limited';

-- Meesho: Founders Vidit Aatrey + Sanjeev Kumar are promoters
UPDATE public.ipos
SET promoter_holding_pre = 18.51, promoter_holding_post = 14.60
WHERE slug = 'meesho-ipo';

-- ============================================================
-- SECTION 4: Fix sub_qib for SME IPOs (no QIB portion = 0)
-- SME IPOs on NSE Emerge / BSE SME don't have mandatory QIB reservation
-- ============================================================

UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'gng-electronics-ipo';
UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'highway-infrastructure-ipo';
UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'regaal-resources-ipo';
UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'shringar-house-of-mangalsutra-ipo';
UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'vms-tmt-ipo';
UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'corona-remedies-limited-ipo';
UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'shree-ram-twistex-ipo';
UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'pngs-reva-diamond-jewellery-limited-ipo';
UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'skyways-air-services-limited-ipo';
UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'tac-infosec-ipo';
UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'kay-cee-energy-and-infra-ipo';
UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'creative-graphics-solutions-ipo';
UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'indian-phosphate-ipo';
UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'resourceful-automobile-ipo';
UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'max-exposure-ipo';
UPDATE public.ipos SET sub_qib = 0.0 WHERE slug = 'macobs-technologies-ipo';

-- ============================================================
-- SECTION 5: MAJOR DATE & PRICE CORRECTIONS for 2025/2026 IPOs
-- Research confirmed actual dates differ from initial estimates
-- ============================================================

-- Meesho IPO: Actually listed December 2025 (not August 2025)
-- Price band: ₹105–₹111, issue price ₹111, listing ₹162.50
-- Open Dec 3 2025, Close Dec 5 2025, Allotment Dec 8 2025, Listing Dec 10 2025
-- Issue: ₹5,421.20 crore (fresh ₹4,250 cr + OFS ₹1,171.20 cr)
-- Subscription: 79.02x total, QIB 120.18x, NII 38.15x, RII 19.04x
-- Lot size: 135 shares, face value ₹1
UPDATE public.ipos
SET
    open_date = '2025-12-03',
    close_date = '2025-12-05',
    allotment_date = '2025-12-08',
    listing_date = '2025-12-10',
    price_min = 105,
    price_max = 111,
    face_value = 1,
    lot_size = 135,
    issue_size = 5421.20,
    fresh_issue = 4250.0,
    listing_price = 162.50,
    listing_gain_percent = 46.40,
    sub_total = 79.02,
    sub_qib = 120.18,
    sub_nii = 38.15,
    sub_rii = 19.04,
    promoter_holding_pre = 18.51,
    promoter_holding_post = 14.60
WHERE slug = 'meesho-ipo';

-- Urban Company IPO: Actually Sept 2025 (not April/May 2025)
-- Price band ₹98–₹103, listing ₹162.25 = +57.52% gain
-- Open Sep 10, Close Sep 12, Allotment Sep 15, Listing Sep 17 2025
-- Issue: ₹1,900 crore (fresh ₹472 cr + OFS ₹1,428 cr)
-- Lot size: 145 shares
UPDATE public.ipos
SET
    open_date = '2025-09-10',
    close_date = '2025-09-12',
    allotment_date = '2025-09-15',
    listing_date = '2025-09-17',
    price_min = 98,
    price_max = 103,
    face_value = 1,
    lot_size = 145,
    issue_size = 1900.0,
    fresh_issue = 472.0,
    listing_price = 162.25,
    listing_gain_percent = 57.52
WHERE slug = 'urban-company-ipo';

-- HDB Financial Services IPO: Confirmed June 2025 dates, listing July 2 2025
-- All core data confirmed: ₹740 issue price, ₹835 listing = 12.84% gain
-- Sub: overall ~17x, QIB ~57x, NII ~10.5x, RII ~1.45x
-- Allotment: June 30 2025 (not July 1)
UPDATE public.ipos
SET
    allotment_date = '2025-06-30',
    sub_total = 17.0,
    sub_qib = 57.0,
    sub_nii = 10.5,
    sub_rii = 1.45
WHERE slug = 'hdb-financial-services-ipo';

-- Tata Capital IPO: Confirmed October 2025
-- Fresh issue: ₹6,846 crore (not ₹1,500 crore as previously estimated)
-- Lot size: 46 shares (not 45)
-- Sub: 1.87x total, QIB 3.42x, NII 1.98x, RII 1.10x
UPDATE public.ipos
SET
    fresh_issue = 6846.0,
    lot_size = 46,
    sub_total = 1.87,
    sub_qib = 3.42,
    sub_nii = 1.98,
    sub_rii = 1.10
WHERE slug = 'tata-capital-ipo';

-- LG Electronics India IPO: Confirmed October 2025
-- Sub: 54.02x total, QIB 166.51x, NII 22.44x, RII 3.55x
-- Issue: Pure OFS ₹11,607 crore, fresh issue = 0
UPDATE public.ipos
SET
    sub_total = 54.02,
    sub_qib = 166.51,
    sub_nii = 22.44,
    sub_rii = 3.55,
    fresh_issue = 0.0
WHERE slug = 'lg-electronics-india-ipo';

-- SBI Funds Management IPO: Actually July 2026 (not April 2025!)
-- Price band: ₹545–₹574, listing ₹613.30 = +6.85%
-- Open Jul 14, Close Jul 16, Listing Jul 21 2026
-- Issue size: ₹9,812.91 crore (pure OFS), lot size 26 shares
-- Sub: 41.66x total, QIB 140.11x, NII 21.34x, RII 3.31x
UPDATE public.ipos
SET
    open_date = '2026-07-14',
    close_date = '2026-07-16',
    allotment_date = '2026-07-18',
    listing_date = '2026-07-21',
    price_min = 545,
    price_max = 574,
    face_value = 10,
    lot_size = 26,
    issue_size = 9812.91,
    fresh_issue = 0.0,
    listing_price = 613.30,
    listing_gain_percent = 6.85,
    sub_total = 41.66,
    sub_qib = 140.11,
    sub_nii = 21.34,
    sub_rii = 3.31,
    promoter_holding_pre = 100.0,
    promoter_holding_post = 75.0
WHERE slug = 'sbi-funds-management-limited-ipo';

-- Central Mine Planning (CMPDIL) IPO: Actually March 2026 (not April 2025!)
-- Open Mar 20, Close Mar 24, Allotment Mar 25, Listing Mar 30 2026
-- Price band: ₹163–₹172, pure OFS ₹1,842 crore, lot size 80 shares
-- Sub: 1.05x total, QIB 3.48x, NII 0.35x, RII 0.33x
UPDATE public.ipos
SET
    open_date = '2026-03-20',
    close_date = '2026-03-24',
    allotment_date = '2026-03-25',
    listing_date = '2026-03-30',
    price_min = 163,
    price_max = 172,
    face_value = 10,
    lot_size = 80,
    issue_size = 1842.0,
    fresh_issue = 0.0,
    sub_total = 1.05,
    sub_qib = 3.48,
    sub_nii = 0.35,
    sub_rii = 0.33
WHERE slug = 'central-mine-planning-ipo';

COMMIT;

-- Verify all corrections
SELECT 
    slug, name, 
    open_date, listing_date,
    price_min, price_max, lot_size,
    listing_price, listing_gain_percent,
    fresh_issue, sub_total, sub_qib,
    promoter_holding_pre, promoter_holding_post
FROM public.ipos
ORDER BY listing_date;
