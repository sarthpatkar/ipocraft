"use client";

import { useState } from "react";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function CopyButton({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : `Copy ${value}`}
      aria-label={copied ? "Copied to clipboard" : "Copy value to clipboard"}
      className="group inline-flex items-center gap-1.5 cursor-pointer rounded-lg px-2 py-0.5 transition-colors hover:bg-gray-100 dark:hover:bg-[#1e293b]"
      style={{ backgroundColor: "transparent" }}
    >
      <span>{children}</span>
      <span className={copied ? "opacity-100 transition-opacity flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400" : "opacity-0 group-hover:opacity-100 transition-opacity"}>
        {copied ? (
          <>
            <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />
            <span>Copied!</span>
          </>
        ) : (
          <ClipboardIcon className="w-3.5 h-3.5" style={{ color: "var(--text-faint)" }} />
        )}
      </span>
    </button>
  );
}
