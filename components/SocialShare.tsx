"use client";

import { useState } from "react";
import { LinkIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function SocialShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: `Check out this article on IPOCraft: ${title}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-8 pt-8 border-t border-gray-200">
      <span className="text-sm font-medium text-gray-500">Share this article:</span>
      <button 
        onClick={handleShare}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors"
      >
        {copied ? <CheckIcon className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
        {copied ? "Copied Link!" : "Share Link"}
      </button>
    </div>
  );
}
