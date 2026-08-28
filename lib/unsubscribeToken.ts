import crypto from "crypto";

/**
 * Signs an unsubscribe link so anyone with the link can unsubscribe that one
 * email without auth, but can't unsubscribe an address they don't control
 * (the token is an HMAC over the email, keyed by a server-only secret).
 */
function getSecret(): string {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("CRON_SECRET is not configured (also used to sign unsubscribe links).");
  return secret;
}

export function signUnsubscribeToken(email: string): string {
  return crypto.createHmac("sha256", getSecret()).update(email.toLowerCase().trim()).digest("hex");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = signUnsubscribeToken(email);
  const a = Buffer.from(expected);
  const b = Buffer.from(token || "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
