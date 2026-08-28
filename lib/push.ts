import webpush from "web-push";
import { getServiceSupabaseClient } from "@/lib/supabaseAdmin";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:contact@ipocraft.com";
  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys are not configured — set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY.");
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export type PushSendResult = {
  sent: number;
  failed: number;
  removed: number;
};

/**
 * Sends a notification to every stored subscription, pruning any that the
 * push service reports as gone (404/410 — the browser unsubscribed or the
 * endpoint expired) so push_subscriptions doesn't accumulate dead rows.
 */
export async function sendPushToAll(payload: PushPayload): Promise<PushSendResult> {
  ensureConfigured();
  const db = getServiceSupabaseClient();

  const { data: subs, error } = await db
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth");

  if (error) throw new Error(`Failed to load push subscriptions: ${error.message}`);
  if (!subs || subs.length === 0) return { sent: 0, failed: 0, removed: 0 };

  const body = JSON.stringify(payload);
  let sent = 0;
  let failed = 0;
  const deadIds: string[] = [];

  await Promise.all(
    subs.map(async (sub) => {
      if (!sub.p256dh || !sub.auth) {
        deadIds.push(sub.id);
        return;
      }
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          body
        );
        sent++;
      } catch (err: any) {
        failed++;
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          deadIds.push(sub.id);
        }
      }
    })
  );

  if (deadIds.length > 0) {
    await db.from("push_subscriptions").delete().in("id", deadIds);
  }

  return { sent, failed, removed: deadIds.length };
}
