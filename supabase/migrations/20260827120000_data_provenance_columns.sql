-- Data provenance tracking for the historical IPO data pipeline
-- (ipocraft-data-pipeline). Records where each row came from, how confident
-- the merge was, and whether some fields are known to be incomplete.
-- listing_gain_percent already exists (see 20260228143000_content_depth_and_brokers.sql)
-- so it is intentionally not re-added here.

alter table if exists public.ipos
  add column if not exists data_source text,
  add column if not exists data_confidence text,
  add column if not exists data_incomplete boolean default false;

create index if not exists idx_ipos_listing_date_status
  on public.ipos (listing_date desc, status);
