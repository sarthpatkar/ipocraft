import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/site-url";
import FeedbackForm from "./FeedbackForm";

const feedbackUrl = canonicalUrl("/feedback");



export const metadata: Metadata = {
  title: "Share Your Feedback — IPOCraft",
  description:
    "Got a booklet or heard about IPOCraft? Tell us your first impression and help us build a better IPO research platform for Indian investors.",
  keywords: [
    "IPOCraft feedback",
    "IPO platform review",
    "IPO GMP India",
    "IPOCraft user feedback",
  ],
  alternates: { canonical: feedbackUrl },
  openGraph: {
    title: "Share Your Feedback — IPOCraft",
    description:
      "Tell us your first impression of IPOCraft and help us improve India's IPO research platform.",
    url: feedbackUrl,
    siteName: "IPOCraft",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Share Your Feedback — IPOCraft",
    description:
      "Tell us your first impression of IPOCraft and help us improve India's IPO research platform.",
  },
};

export default function FeedbackPage() {
  return (
    <main
      className={`min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9]`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* HERO */}
      <section className="bg-white dark:bg-[#111418] border-b border-gray-200 dark:border-[#252A31]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <p className="text-[11px] font-semibold tracking-wider uppercase mb-2 text-[#1C317A] dark:text-[#93B4FF]">
            IPOCraft
          </p>
          <h1
            className="text-2xl sm:text-[2rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Share your feedback
          </h1>
          <p className="mt-3 text-[14px] sm:text-[15px] text-gray-600 dark:text-[#9AA1AA] leading-relaxed max-w-xl">
            Your answers take under 2 minutes and directly influence what we build next.
            No account needed.
          </p>
        </div>
      </section>

      {/* BOOKLET CONTEXT BANNER */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-5">
        <div className="flex gap-3 items-start bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg px-4 py-3 shadow-xs">
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">
              Got here via a booklet or from someone you know?
            </p>
            <p className="text-[12.5px] text-gray-500 dark:text-[#9AA1AA] mt-0.5">
              Select &ldquo;Through a booklet / flyer I received&rdquo; in the first question — it helps us understand how people discover IPOCraft.
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-16">
        <FeedbackForm />
      </div>

      {/* FOOTER NOTE */}
      <div className="border-t border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
          <p className="text-[12px] text-gray-400 dark:text-[#6B7280] leading-relaxed">
            IPOCraft is an independent informational platform for IPO GMP, subscription data, and listing insights.
            Feedback is used solely to improve the product. We do not share your contact details with third parties.
          </p>
        </div>
      </div>
    </main>
  );
}
