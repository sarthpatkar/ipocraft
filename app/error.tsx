"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the console/monitoring; no PII, safe to log.
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 bg-[#f8fafc] dark:bg-[#090B0F]">
      <div className="max-w-md w-full text-center">
        <p
          className="text-sm font-semibold tracking-wide uppercase text-[#1C317A] dark:text-[#93b4ff]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Something went wrong
        </p>
        <h1
          className="mt-2 text-3xl sm:text-4xl font-semibold text-[#0f172a] dark:text-[#F1F5F9]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          We hit a snag loading this page.
        </h1>
        <p
          className="mt-3 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Our team has been notified. You can try again, or head back to
          live IPO data in the meantime.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-lg bg-[#1C317A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#16265F] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#252A31] px-5 py-2.5 text-sm font-semibold text-[#0f172a] dark:text-[#F1F5F9] hover:bg-gray-50 dark:hover:bg-[#111418] transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
