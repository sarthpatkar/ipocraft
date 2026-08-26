-- Chat query logging (non-PII)
CREATE TABLE IF NOT EXISTS chat_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  intent text,
  query_snippet text,        -- first 100 chars of user message, no PII
  provider_used text,
  had_ipo_match boolean,
  latency_ms integer,
  created_at timestamptz DEFAULT now()
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_chat_logs_intent ON chat_logs(intent);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON chat_logs(created_at DESC);

-- Row-level security (insert only, no reads from client)
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON chat_logs
  USING (auth.role() = 'service_role');
