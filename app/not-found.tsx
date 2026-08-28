import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 bg-[#f8fafc] dark:bg-[#090B0F]">
      <div className="max-w-md w-full text-center">
        <p
          className="text-sm font-semibold tracking-wide uppercase text-[#1C317A] dark:text-[#93b4ff]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Error 404
        </p>
        <h1
          className="mt-2 text-3xl sm:text-4xl font-semibold text-[#0f172a] dark:text-[#F1F5F9]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          This page didn&apos;t list.
        </h1>
        <p
          className="mt-3 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          The page you&apos;re looking for may have been moved, delisted, or never
          existed. Let&apos;s get you back to live IPO data.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-[#1C317A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#16265F] transition-colors"
          >
            Go to Homepage
          </Link>
          <Link
            href="/ipo"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#252A31] px-5 py-2.5 text-sm font-semibold text-[#0f172a] dark:text-[#F1F5F9] hover:bg-gray-50 dark:hover:bg-[#111418] transition-colors"
          >
            Browse IPOs
          </Link>
          <Link
            href="/ipo-history"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#252A31] px-5 py-2.5 text-sm font-semibold text-[#0f172a] dark:text-[#F1F5F9] hover:bg-gray-50 dark:hover:bg-[#111418] transition-colors"
          >
            IPO History
          </Link>
        </div>
      </div>
    </main>
  );
}
