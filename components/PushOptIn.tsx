"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "ipocraft_push_dismissed";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

/**
 * Small inline opt-in card for GMP push alerts. Only renders when the
 * browser actually supports Push (skips Safari <16, non-HTTPS, etc.),
 * permission hasn't already been decided, and the user hasn't dismissed it.
 */
export default function PushOptIn() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "requesting" | "subscribed" | "error">("idle");

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!supported) return;
    if (Notification.permission !== "default") return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    setVisible(true);
  }, []);

  async function handleEnable() {
    setStatus("requesting");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("idle");
        setVisible(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      setStatus("subscribed");
      setTimeout(() => setVisible(false), 2000);
    } catch {
      setStatus("error");
    }
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="bg-blue-50/60 dark:bg-[#151E2E] border border-[#1C317A]/20 dark:border-blue-900/40 rounded-lg px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-4 flex-wrap">
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">
          {status === "subscribed" ? "You're subscribed to GMP alerts." : "Get notified on big GMP moves"}
        </p>
        {status !== "subscribed" && (
          <p className="text-[12px] text-gray-600 dark:text-[#9AA1AA] mt-0.5">
            Turn on browser notifications for grey market premium updates.
          </p>
        )}
      </div>
      {status !== "subscribed" && (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleEnable}
            disabled={status === "requesting"}
            className="inline-flex items-center justify-center bg-[#1C317A] hover:bg-[#162860] text-white text-[12px] font-semibold px-3.5 py-1.5 rounded-md transition-colors disabled:opacity-60"
          >
            {status === "requesting" ? "Enabling…" : "Enable Alerts"}
          </button>
          <button
            onClick={handleDismiss}
            className="text-[12px] font-medium text-gray-500 dark:text-[#9AA1AA] hover:text-gray-700 dark:hover:text-[#F1F5F9] px-2 py-1.5"
          >
            Not now
          </button>
        </div>
      )}
    </div>
  );
}
