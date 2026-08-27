-- Sync run telemetry (previously computed by syncFinApiIpos() but discarded —
-- never persisted, so no historical success/fail rate or "last N runs" view
-- was possible anywhere in the admin panel).
create table if not exists public.sync_runs (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'finapi',
  sync_type text,
  success boolean not null,
  total_fetched integer default 0,
  inserted_count integer default 0,
  updated_count integer default 0,
  gmp_points_count integer default 0,
  errors jsonb,
  rate_limit_remaining integer,
  started_at timestamptz not null,
  completed_at timestamptz not null,
  duration_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists idx_sync_runs_created_at on public.sync_runs (created_at desc);
create index if not exists idx_sync_runs_provider on public.sync_runs (provider, created_at desc);

alter table public.sync_runs enable row level security;

drop policy if exists "Service role only" on public.sync_runs;
create policy "Service role only" on public.sync_runs
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- feedback and api_quota_tracking already exist in production (referenced by
-- app/actions/feedback.ts and lib/ipoalerts/client.ts respectively) but had
-- no tracked migration anywhere — documenting them here so schema stays
-- reproducible. IF NOT EXISTS makes this a no-op against the live tables.
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  source text,
  rating integer not null check (rating between 1 and 5),
  first_look text,
  found_what_looking text,
  data_priorities text[],
  retention_features text[],
  confusion text,
  investor_type text,
  missing_features text,
  name text,
  contact text,
  created_at timestamptz not null default now()
);

create index if not exists idx_feedback_created_at on public.feedback (created_at desc);

create table if not exists public.api_quota_tracking (
  id text primary key,
  date date not null,
  requests_used integer not null default 0,
  last_updated timestamptz not null default now()
);
