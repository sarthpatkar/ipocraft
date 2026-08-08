"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function LegalBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("legal-banner-dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md text-white text-xs sm:text-sm px-4 py-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4">
      <div className="flex-1 max-w-7xl mx-auto">
        <span className="font-semibold text-blue-300">Disclaimer:</span> IPOCraft is for educational purposes only. Unofficial GMP data does not guarantee listing performance. Not SEBI-registered financial advice.
      </div>
      <button 
        onClick={() => {
          setIsVisible(false);
          localStorage.setItem("legal-banner-dismissed", "true");
        }}
        className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        aria-label="Dismiss banner"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
