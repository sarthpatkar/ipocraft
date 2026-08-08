"use client";

import { useState } from "react";

const GLOSSARY: Record<string, string> = {
  GMP: "Grey Market Premium. The unofficial price at which IPO shares trade before they are listed on the stock exchange.",
  QIB: "Qualified Institutional Buyer. Large institutions like mutual funds, banks, and insurance companies.",
  NII: "Non-Institutional Investor. Also known as High Net-worth Individuals (HNIs) who apply for > ₹2 Lakhs.",
  Retail: "Retail Individual Investor. Normal investors who apply for shares worth less than ₹2 Lakhs.",
  Kostak: "The premium amount paid by buyers to sellers for an entire IPO application, regardless of allotment.",
  "Subject to Sauda": "A deal made in the grey market where the premium is paid only if the seller gets an allotment.",
  ASBA: "Application Supported by Blocked Amount. A process that blocks the application money in your bank account until allotment.",
  RHP: "Red Herring Prospectus. The final document filed with SEBI before an IPO opens, containing all crucial details.",
};

export default function GlossaryTooltip({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const definition = GLOSSARY[term];

  if (!definition) return <>{children}</>;

  return (
    <span 
      className="relative inline-block cursor-help group"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={(e) => {
        // For mobile tap
        e.preventDefault();
        e.stopPropagation();
        setShow(!show);
      }}
    >
      <span className="border-b border-dashed border-gray-400 pb-[1px] text-inherit group-hover:text-blue-600 group-hover:border-blue-600 transition-colors">
        {children}
      </span>
      {show && (
        <span className="absolute z-50 w-48 sm:w-64 p-3 bg-gray-900 text-white text-xs leading-relaxed rounded-lg shadow-xl -top-2 left-1/2 -translate-x-1/2 -translate-y-full before:content-[''] before:absolute before:-bottom-1 before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-900 pointer-events-none">
          <strong className="block text-blue-300 mb-1">{term}</strong>
          {definition}
        </span>
      )}
    </span>
  );
}
