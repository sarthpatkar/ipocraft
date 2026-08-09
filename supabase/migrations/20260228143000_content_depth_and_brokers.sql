create extension if not exists pgcrypto;

-- --------------------------------------------------------------------------
-- IPO columns reconciliation (idempotent)
-- --------------------------------------------------------------------------
alter table if exists public.ipos
  add column if not exists about_company text,
  add column if not exists company_strengths text,
  add column if not exists company_risks text,
  add column if not exists objectives text,
  add column if not exists promoter_holding_pre numeric,
  add column if not exists promoter_holding_post numeric,
  add column if not exists reservation_qib numeric,
  add column if not exists reservation_nii numeric,
  add column if not exists reservation_rii numeric,
  add column if not exists reservation_employee numeric,
  add column if not exists lead_managers text,
  add column if not exists registrar text,
  add column if not exists drhp_link text,
  add column if not exists rhp_link text,
  add column if not exists allotment_link text,
  add column if not exists listing_exchange text,
  add column if not exists listing_price numeric,
  add column if not exists listing_gain_percent numeric,
  add column if not exists allotment_date date,
  add column if not exists refund_date date,
  add column if not exists open_date date,
  add column if not exists close_date date,
  add column if not exists sub_total numeric,
  add column if not exists sub_qib numeric,
  add column if not exists sub_nii numeric,
  add column if not exists sub_rii numeric,
  add column if not exists sub_shni numeric,
  add column if not exists sub_bhni numeric,
  -- Financial metrics
  add column if not exists eps_pre numeric,
  add column if not exists eps_post numeric,
  add column if not exists pe_pre numeric,
  add column if not exists pe_post numeric,
  add column if not exists roce numeric,
  add column if not exists ronw numeric,
  add column if not exists debt_equity numeric,
  add column if not exists pat_margin numeric,
  add column if not exists market_cap numeric,
  add column if not exists issue_price numeric,
  add column if not exists fresh_issue numeric,
  add column if not exists listing_price_open numeric,
  -- Market lot details
  add column if not exists retail_min_lots int,
  add column if not exists retail_min_shares int,
  add column if not exists retail_min_amount int,
  add column if not exists retail_max_lots int,
  add column if not exists retail_max_shares int,
  add column if not exists retail_max_amount int,
  add column if not exists shni_lots int,
  add column if not exists shni_shares int,
  add column if not exists shni_amount int,
  add column if not exists shni_max_lots int,
  add column if not exists shni_max_shares int,
  add column if not exists shni_max_amount int,
  add column if not exists bhni_lots int,
  add column if not exists bhni_shares int,
  add column if not exists bhni_amount int,
  add column if not exists bhni_max_lots int,
  add column if not exists bhni_max_shares int,
  add column if not exists bhni_max_amount int,
  -- Company contacts
  add column if not exists company_address text,
  add column if not exists company_phone text,
  add column if not exists company_email text,
  add column if not exists company_website text,
  -- Registrar contacts
  add column if not exists registrar_phone text,
  add column if not exists registrar_email text,
  add column if not exists registrar_website text,
  -- Admin
  add column if not exists allotment_out boolean default false,
  add column if not exists allotment_status text,
  add column if not exists anchor_investors text,
  add column if not exists market_maker_shares int,
  add column if not exists market_maker_reservation text,
  add column if not exists updated_at timestamptz default now(),
  -- Timestamps
  add column if not exists created_at timestamptz default now();

-- --------------------------------------------------------------------------
-- Brokers table
-- --------------------------------------------------------------------------
create table if not exists public.brokers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  logo_url text,
  account_opening text,
  account_maintenance text,
  equity_delivery text,
  equity_intraday text,
  futures text,
  options text,
  cta_url text,
  notes text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint brokers_slug_unique unique (slug)
);

create index if not exists idx_brokers_active_order
  on public.brokers (is_active, sort_order, name);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_brokers_set_updated_at on public.brokers;
create trigger trg_brokers_set_updated_at
before update on public.brokers
for each row
execute function public.set_updated_at();
