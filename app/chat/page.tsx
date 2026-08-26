import type { Metadata } from "next";
import ChatPageClient from "./ChatPageClient";
import ChatFAQ from "@/components/chat/ChatFAQ";
import Script from "next/script";

export const metadata: Metadata = {
  title: "IPO AI Assistant — Ask Anything About Indian IPOs | IPOCraft",
  description:
    "Get instant, data-verified answers about IPO GMP, subscription multiples, allotment odds, and listing dates. IPOCraft's free AI assistant covers Mainboard and SME IPOs with live market data.",
  alternates: {
    canonical: "https://www.ipocraft.com/chat",
  },
  openGraph: {
    title: "IPO AI Assistant — Ask Anything About Indian IPOs | IPOCraft",
    description:
      "Live AI assistant for Indian IPOs. Query live GMP, subscription demand, allotment probability, and historical listing track records.",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    name: "What can I ask the IPOCraft AI Assistant?",
    acceptedAnswer: {
      text: "You can ask about live IPO GMP (Grey Market Premium), subscription multiples for QIB, HNI, and Retail categories, allotment dates, listing dates, and historical listing performance for any Mainboard or SME IPO tracked on IPOCraft.",
    },
  },
  {
    name: "Is the IPOCraft AI Assistant data live?",
    acceptedAnswer: {
      text: "Yes. The AI Assistant has real-time access to IPOCraft's live database, which is updated regularly from public exchange and market data. Responses include a 'Market Verified' badge when live data is used.",
    },
  },
  {
    name: "How do I check the GMP of a specific IPO?",
    acceptedAnswer: {
      text: "Simply type the IPO name followed by 'GMP' — for example, 'What is the GMP of Hyundai IPO?' The assistant will fetch the latest Grey Market Premium, issue price, and estimated listing price.",
    },
  },
  {
    name: "Can the AI calculate my IPO allotment probability?",
    acceptedAnswer: {
      text: "Yes. Ask something like 'What are my allotment odds for a 47x subscribed retail IPO?' and the assistant will use the SEBI computerized lottery formula to calculate your exact '1 in X' probability.",
    },
  },
  {
    name: "Does applying for more lots increase my IPO allotment chances?",
    acceptedAnswer: {
      text: "No. In an oversubscribed retail IPO, SEBI uses a computerized lottery where each valid application gets one entry — regardless of how many lots you applied for. Applying for 1 lot gives the same probability as applying for the maximum.",
    },
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.name,
    acceptedAnswer: { "@type": "Answer", text: item.acceptedAnswer.text },
  })),
};

export default function ChatPage() {
  return (
    <>
      <Script
        id="chat-faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Full-screen chat canvas — exact height: 100dvh minus sticky header (56px nav + 28px ticker + 2px progress = 86px) */}
      <div
        className="-mx-4 sm:-mx-6 lg:-mx-12 -mt-6 sm:-mt-8 flex flex-col overflow-hidden bg-[#F8FAFC] dark:bg-[#090B0F]"
        style={{ height: "calc(100dvh - 5.375rem)" }}
      >
        <ChatPageClient />
      </div>

      {/* SEO Content Section — crawlable, below the interactive chat */}
      <section
        aria-label="About IPOCraft AI Assistant"
        className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-16 border-t border-gray-200 dark:border-[#252A31]"
      >
        <h1 className="text-xl font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
          IPOCraft AI Assistant — Ask Anything About Indian IPOs
        </h1>
        <p className="text-[13.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed mb-6">
          Get instant, data-verified answers about live GMP, subscription demand, allotment odds, and
          listing dates — for any Mainboard or SME IPO. The AI pulls directly from IPOCraft&apos;s live
          database, so answers are always current.
        </p>

        <div className="bg-gray-50 dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-4 mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA] mb-3">
            What you can ask
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Live GMP of open IPOs today",
              "Subscription data (QIB, HNI, Retail)",
              "Allotment probability — '1 in X' odds",
              "IPO timeline: open / close / listing dates",
              "Historical listing performance",
              "SME vs Mainboard IPO differences",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-[12.5px] text-[#475569] dark:text-[#9AA1AA]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1C317A] dark:bg-[#93B4FF] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <h2 className="text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
          Frequently Asked Questions
        </h2>
        <ChatFAQ items={FAQ_ITEMS} />

        <p className="text-[11px] text-[#94a3b8] dark:text-[#64748B] mt-6 leading-relaxed">
          IPOCraft AI Assistant is for informational and research purposes only. All GMP data is
          unofficial and indicative. Nothing on this page constitutes investment advice. Always verify
          information through official SEBI, NSE, and BSE disclosures.
        </p>
      </section>
    </>
  );
}
