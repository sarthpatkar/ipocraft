import { createSupabaseServerClient } from "@/lib/supabaseServer";

/**
 * Server-side admin check for API routes. proxy.ts only gates /admin/*
 * pages (and even there, fails open — full access — when ADMIN_EMAILS is
 * unset, so the site doesn't lock out its one admin during setup). A
 * standalone route explicitly meant to be admin-only, like the DRHP
 * analyzer, needs its own check and should fail CLOSED instead: if
 * ADMIN_EMAILS isn't configured, nobody gets in via this route.
 */
export async function isAdminRequest(): Promise<boolean> {
  const adminEmails = process.env.ADMIN_EMAILS;
  if (!adminEmails) return false;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return false;

  const allowlist = adminEmails.split(",").map((e) => e.trim().toLowerCase());
  return allowlist.includes(user.email.toLowerCase());
}
