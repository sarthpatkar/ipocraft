"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function BackButton({ fallbackHref = "/ipo" }: { fallbackHref?: string }) {
  const router = useRouter();

  function handleBack() {
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors hover:underline"
      style={{ color: "var(--text-muted)" }}
    >
      <ArrowLeftIcon className="w-3.5 h-3.5" />
      All IPOs
    </button>
  );
}
