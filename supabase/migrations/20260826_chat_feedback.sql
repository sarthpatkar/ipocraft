-- Chat response feedback (thumbs up/down)
CREATE TABLE IF NOT EXISTS chat_feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id text NOT NULL,
  rating integer NOT NULL CHECK (rating IN (1, -1)),
  intent_type text,
  message_snippet text,      -- first 80 chars of AI response
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_feedback_rating ON chat_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_chat_feedback_intent ON chat_feedback(intent_type);
CREATE INDEX IF NOT EXISTS idx_chat_feedback_created_at ON chat_feedback(created_at DESC);

ALTER TABLE chat_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON chat_feedback
  USING (auth.role() = 'service_role');
