-- ==============================================================================
-- SQL FIX FOR SPECIFIC 3 IPOS (PNGS Reva, Skyways Air, SBI Funds Management)
-- Run this directly in Supabase Web SQL Editor
-- ==============================================================================

-- 1. PNGS Reva Diamond Jewellery Limited
UPDATE public.ipos SET
  price_min = 370,
  price_max = 386,
  issue_price = 386,
  lot_size = 38,
  retail_min_lots = 1,
  retail_min_shares = 38,
  retail_min_amount = 14668,
  retail_max_lots = 13,
  retail_max_shares = 494,
  retail_max_amount = 190684,
  shni_lots = 14,
  shni_shares = 532,
  shni_amount = 205352,
  shni_max_lots = 68,
  shni_max_shares = 2584,
  shni_max_amount = 997424,
  bhni_lots = 69,
  bhni_shares = 2622,
  bhni_amount = 1012092,
  exchange = 'NSE, BSE',
  listing_exchange = 'NSE, BSE'
WHERE slug = 'pngs-reva-diamond-jewellery-limited-ipo';

-- 2. Skyways Air Services Limited
UPDATE public.ipos SET
  price_min = 250,
  price_max = 260,
  issue_price = 260,
  lot_size = 57,
  retail_min_lots = 1,
  retail_min_shares = 57,
  retail_min_amount = 14820,
  retail_max_lots = 13,
  retail_max_shares = 741,
  retail_max_amount = 192660,
  shni_lots = 14,
  shni_shares = 798,
  shni_amount = 207480,
  shni_max_lots = 67,
  shni_max_shares = 3819,
  shni_max_amount = 992940,
  bhni_lots = 68,
  bhni_shares = 3876,
  bhni_amount = 1007760,
  exchange = 'NSE, BSE',
  listing_exchange = 'NSE, BSE',
  status = 'Listed'
WHERE slug = 'skyways-air-services-limited-ipo';

-- 3. SBI Funds Management Limited
UPDATE public.ipos SET
  ipo_type = 'Mainboard',
  price_min = 750,
  price_max = 800,
  issue_price = 800,
  lot_size = 18,
  open_date = '2026-04-10',
  close_date = '2026-04-15',
  allotment_date = '2026-04-16',
  refund_date = '2026-04-17',
  listing_date = '2026-04-20',
  retail_min_lots = 1,
  retail_min_shares = 18,
  retail_min_amount = 14400,
  retail_max_lots = 13,
  retail_max_shares = 234,
  retail_max_amount = 187200,
  shni_lots = 14,
  shni_shares = 252,
  shni_amount = 201600,
  shni_max_lots = 69,
  shni_max_shares = 1242,
  shni_max_amount = 993600,
  bhni_lots = 70,
  bhni_shares = 1260,
  bhni_amount = 1008000,
  exchange = 'NSE, BSE',
  listing_exchange = 'NSE, BSE',
  status = 'Upcoming'
WHERE slug = 'sbi-funds-management-limited-ipo';
