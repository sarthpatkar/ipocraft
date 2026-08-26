-- GMP alert email subscribers
CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_email_subscribers_active ON email_subscribers(is_active) WHERE is_active = true;

ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON email_subscribers
  USING (auth.role() = 'service_role');
