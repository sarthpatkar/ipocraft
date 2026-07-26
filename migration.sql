-- ============================================================
-- IPOCraft: Path B Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Table 1: Extraction Jobs (Async Queue)
CREATE TABLE IF NOT EXISTS extraction_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT NOT NULL,
  file_hash TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'done', 'failed')),
  schema_version INTEGER DEFAULT 1,
  partial_result JSONB DEFAULT '{}',
  result JSONB,
  error TEXT,
  warnings JSONB DEFAULT '[]',
  confidence JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Indexes for worker polling performance
CREATE INDEX IF NOT EXISTS idx_extraction_jobs_status_created 
  ON extraction_jobs (status, created_at);

-- Index for deduplication lookups
CREATE INDEX IF NOT EXISTS idx_extraction_jobs_hash_done 
  ON extraction_jobs (file_hash) WHERE status = 'done';

-- Table 2: Registrars Reference (Verification Oracle — admin-editable)
CREATE TABLE IF NOT EXISTS registrars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_aliases TEXT[] DEFAULT '{}',
  phone TEXT,
  email TEXT,
  website TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed with known registrars (used for VERIFICATION only, not as hardcoded source of truth)
INSERT INTO registrars (name, name_aliases, phone, email, website) VALUES
  ('Link Intime India Pvt Ltd', ARRAY['Link Intime', 'LIIPL', 'Link In-Time India'], '+91-810-811-4949', 'rnt.helpdesk@linkintime.co.in', 'https://linkintime.co.in'),
  ('KFin Technologies Ltd', ARRAY['KFin', 'Kfintech', 'Karvy Fintech', 'KFintech Private Limited'], '+91-40-6716-2222', 'einward.ris@kfintech.com', 'https://kfintech.com'),
  ('Bigshare Services Pvt Ltd', ARRAY['Bigshare', 'Big Share'], '+91-22-6263-8200', 'ipo@bigshareonline.com', 'https://bigshareonline.com'),
  ('Cameo Corporate Services Ltd', ARRAY['Cameo Corporate', 'Cameo'], '+91-44-2846-0390', 'investor@cameoindia.com', 'https://cameoindia.com'),
  ('MAS Services Ltd', ARRAY['MAS Services', 'MAS'], '+91-11-2323-8281', 'info@masserv.com', 'https://masserv.com'),
  ('Purva Sharegistry India Pvt Ltd', ARRAY['Purva Sharegistry', 'Purva', 'Purvashare'], '+91-22-2261-0852', 'busicomp@vsnl.com', 'https://purvashare.com'),
  ('Beetal Financial & Computer Services', ARRAY['Beetal', 'Beetal Financial'], '+91-11-2996-2481', 'beetal@beetalfinancial.com', 'https://beetalfinancial.com'),
  ('Skyline Financial Services Pvt Ltd', ARRAY['Skyline Financial', 'Skyline'], '+91-11-6447-6600', 'ipo@skylinefinancials.in', 'https://skylinefinancials.in'),
  ('Integrated Registry Management Services', ARRAY['Integrated Registry', 'IRMS'], '+91-44-2814-0801', 'helpdesk@integratedindia.in', 'https://integratedindia.in'),
  ('Alankit Assignments Ltd', ARRAY['Alankit', 'Alankit Assignments'], '+91-11-4254-1234', 'info@alankit.com', 'https://alankit.com')
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE extraction_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access to extraction_jobs"
  ON extraction_jobs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin read registrars"
  ON registrars FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin write registrars"
  ON registrars FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Enable Realtime on extraction_jobs
ALTER PUBLICATION supabase_realtime ADD TABLE extraction_jobs;
