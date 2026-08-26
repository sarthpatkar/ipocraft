"use client";

import { useState } from "react";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/outline";

interface FeedbackButtonProps {
  messageId: string;
  intentType?: string;
  snippet?: string;
}

export default function FeedbackButton({ messageId, intentType, snippet }: FeedbackButtonProps) {
  const [voted, setVoted] = useState<1 | -1 | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const vote = async (rating: 1 | -1) => {
    if (voted !== null || submitting) return;
    setSubmitting(true);
    setVoted(rating);
    try {
      await fetch("/api/chat/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message_id: messageId,
          rating,
          intent_type: intentType,
          message_snippet: snippet,
        }),
      });
    } catch {
      /* non-critical, fail silently */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
      <button
        onClick={() => vote(1)}
        disabled={voted !== null}
        title="Helpful response"
        aria-label="Mark response as helpful"
        className={`p-1 rounded-md transition-colors ${
          voted === 1
            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
            : "text-gray-400 dark:text-[#9AA1AA] hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-[#1E242C]"
        } disabled:cursor-default`}
      >
        <HandThumbUpIcon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => vote(-1)}
        disabled={voted !== null}
        title="Not helpful"
        aria-label="Mark response as not helpful"
        className={`p-1 rounded-md transition-colors ${
          voted === -1
            ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40"
            : "text-gray-400 dark:text-[#9AA1AA] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-[#1E242C]"
        } disabled:cursor-default`}
      >
        <HandThumbDownIcon className="w-3.5 h-3.5" />
      </button>
      {voted !== null && (
        <span className="text-[11px] text-gray-400 dark:text-[#9AA1AA] ml-1 font-medium">
          {voted === 1 ? "Thank you" : "Feedback noted"}
        </span>
      )}
    </div>
  );
}
