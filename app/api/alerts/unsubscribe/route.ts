import { NextResponse } from "next/server";
import { getServiceSupabaseClient } from "@/lib/supabaseAdmin";
import { verifyUnsubscribeToken } from "@/lib/unsubscribeToken";

export const dynamic = "force-dynamic";

function htmlPage(message: string, ok: boolean) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>IPOCraft Alerts</title>
  <style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#F8FAFC;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}
  .card{background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:32px;max-width:420px;text-align:center;}
  h1{font-size:16px;color:${ok ? "#0F172A" : "#B91C1C"};margin:0 0 8px;} p{color:#64748B;font-size:13.5px;line-height:1.6;margin:0;}
  a{color:#1C317A;}</style></head>
  <body><div class="card"><h1>${ok ? "Unsubscribed" : "Something went wrong"}</h1><p>${message}</p>
  <p style="margin-top:16px;"><a href="/">Back to IPOCraft</a></p></div></body></html>`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email")?.toLowerCase().trim();
  const token = url.searchParams.get("token") || "";

  if (!email || !verifyUnsubscribeToken(email, token)) {
    return new NextResponse(htmlPage("This unsubscribe link is invalid or expired.", false), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const db = getServiceSupabaseClient();
  const { error } = await db
    .from("email_subscribers")
    .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
    .eq("email", email);

  if (error) {
    return new NextResponse(htmlPage("We couldn't process this right now. Please try again later.", false), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }

  return new NextResponse(htmlPage(`${email} has been unsubscribed from IPO GMP alerts.`, true), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}
