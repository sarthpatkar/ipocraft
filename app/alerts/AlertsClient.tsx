"use client";

import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function AlertsClient() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Email Card */}
      <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#1C317A]/10 dark:bg-[#1C317A]/20 flex items-center justify-center text-[18px]">
            ✉️
          </div>
          <div>
            <h2 className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
              Email Alerts
            </h2>
            <p className="text-[11.5px] text-gray-400 dark:text-[#9AA1AA]">Daily morning digest</p>
          </div>
        </div>

        {submitted ? (
          <div className="flex items-center gap-2 py-3 text-emerald-600 dark:text-emerald-400">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="text-[13.5px] font-medium">You're subscribed! Check your inbox.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#171B20] text-[13px] text-[#0f172a] dark:text-[#F1F5F9] placeholder:text-gray-400 outline-none focus:border-[#1C317A] dark:focus:border-[#3D5BA9] transition-colors"
            />
            {error && <p className="text-[12px] text-rose-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#1C317A] hover:bg-[#2D4DB5] text-white text-[13px] font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? "Subscribing..." : "Get Daily GMP Email"}
            </button>
            <p className="text-[11px] text-gray-400 dark:text-[#6B7280] text-center">
              No account required · One-click unsubscribe
            </p>
          </form>
        )}
      </div>

      {/* Telegram Card */}
      <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-[18px]">
            ✈️
          </div>
          <div>
            <h2 className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
              Telegram Channel
            </h2>
            <p className="text-[11.5px] text-gray-400 dark:text-[#9AA1AA]">Live alerts from our team</p>
          </div>
        </div>

        <p className="text-[13px] text-[#475569] dark:text-[#9AA1AA] mb-4 leading-relaxed">
          Join the IPOCraft Telegram channel for live GMP updates, allotment results, and listing day alerts — posted by our team in real time.
        </p>

        <a
          href="https://t.me/ipocraft"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#0088CC] hover:bg-[#0077B5] text-white text-[13px] font-semibold rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/>
          </svg>
          Join @ipocraft on Telegram
        </a>
        <p className="text-[11px] text-gray-400 dark:text-[#6B7280] text-center mt-2">
          Free · No signup · Leave anytime
        </p>
      </div>
    </div>
  );
}
