-- Watchlist table for anonymous server-side sync
-- Run this in the Supabase SQL editor or via CLI migrations

CREATE TABLE IF NOT EXISTS watchlists (
  device_id TEXT PRIMARY KEY,
  slugs TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update timestamp on upsert
CREATE OR REPLACE FUNCTION update_watchlist_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER watchlists_updated_at
  BEFORE UPDATE ON watchlists
  FOR EACH ROW EXECUTE FUNCTION update_watchlist_timestamp();

-- Allow public (anon) read/write — watchlists are keyed by device_id
-- No sensitive data stored
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access by device_id" ON watchlists
  FOR ALL
  USING (true)
  WITH CHECK (true);
