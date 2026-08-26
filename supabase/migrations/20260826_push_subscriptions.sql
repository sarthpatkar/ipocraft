-- PWA push notification subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint text UNIQUE NOT NULL,
  p256dh text,
  auth text,
  created_at timestamptz DEFAULT now(),
  last_notified_at timestamptz
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON push_subscriptions
  USING (auth.role() = 'service_role');
