import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client for tables with RLS restricted to service_role
// (sync_runs, feedback, chat_feedback, chat_logs, api_quota_tracking, ...).
// The cookie-scoped client from lib/supabaseServer.ts runs as the logged-in
// user and RLS blocks it from reading these tables.
export function getServiceSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
