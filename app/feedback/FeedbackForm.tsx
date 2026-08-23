"use client";

import { useState, useTransition } from "react";
import { submitFeedbackAction } from "@/app/actions/feedback";

// ─── Data ──────────────────────────────────────────────────────────────────

const SOURCE_OPTIONS = [
  { value: "booklet", label: "Through a booklet / flyer I received" },
  { value: "friend", label: "A friend or family member told me" },
  { value: "whatsapp_social", label: "WhatsApp or social media" },
  { value: "search", label: "Google / search engine" },
  { value: "already_knew", label: "I already knew about it" },
];

const FIRST_LOOK_OPTIONS = [
  { value: "gmp", label: "GMP — grey market price" },
  { value: "ipo_list", label: "IPO list / upcoming IPOs" },
  { value: "ipo_page", label: "A specific IPO's page" },
  { value: "subscription", label: "Subscription numbers" },
  { value: "allotment", label: "Allotment status checker" },
  { value: "track_record", label: "Track record / past listing gains" },
  { value: "unsure", label: "I wasn't sure where to start" },
];

const DATA_PRIORITY_OPTIONS = [
  { value: "gmp_chart", label: "GMP trend chart (daily)" },
  { value: "subscription", label: "Subscription numbers (QIB/HNI/Retail)" },
  { value: "allotment", label: "Allotment date and status" },
  { value: "listing_gain", label: "Listing price / listing day gain" },
  { value: "financials", label: "Company financials (revenue, profit)" },
  { value: "price_band", label: "Price band and lot size" },
  { value: "company_details", label: "Promoter background / company details" },
  { value: "analyst_rec", label: "Expert / analyst recommendation" },
];

const RETENTION_OPTIONS = [
  { value: "gmp_notifications", label: "Daily GMP update alerts (WhatsApp / email)" },
  { value: "new_ipo_alert", label: "Alert when a new IPO is announced" },
  { value: "allotment_alert", label: "Alert when allotment result is out" },
  { value: "watchlist", label: "A watchlist to track IPOs I'm interested in" },
  { value: "mobile_ux", label: "Better mobile experience" },
  { value: "simpler_layout", label: "Simpler, less cluttered layout" },
  { value: "company_info", label: "More details on company background" },
  { value: "ipo_compare", label: "Comparison between multiple IPOs" },
];

const INVESTOR_TYPE_OPTIONS = [
  { value: "regular", label: "I apply for IPOs regularly (3+ per year)" },
  { value: "occasional", label: "I apply occasionally (1–2 per year)" },
  { value: "learning", label: "I'm just starting to learn about IPOs" },
  { value: "tracking_only", label: "I don't invest but like tracking markets" },
  { value: "other", label: "Other" },
];

// ─── Validation ─────────────────────────────────────────────────────────────

function validateContact(value: string): string | null {
  if (!value.trim()) return null; // optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Indian mobile: optional +91/0, then 10 digits starting with 6-9
  const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/;
  const cleaned = value.replace(/\s/g, "");
  if (emailRegex.test(cleaned) || phoneRegex.test(cleaned)) return null;
  return "Enter a valid email address or 10-digit mobile number.";
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function SectionHeading({
  number,
  title,
  subtitle,
}: {
  number: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1C317A] dark:text-[#6B8CCF] tabular-nums">
          {String(number).padStart(2, "0")}
        </span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-[#2D333D]" />
      </div>
      <h2
        className="text-[16px] sm:text-[18px] font-semibold text-[#0f172a] dark:text-[#E8ECF0]"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-[13px] text-[#64748b] dark:text-[#8A919E] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <label
            key={opt.value}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md border cursor-pointer transition-colors text-[13.5px] select-none ${
              active
                ? "border-[#1C317A] bg-[#eef2ff] dark:bg-[#1C317A]/20 dark:border-[#3D5BA9] text-[#1C317A] dark:text-[#93B4FF] font-medium"
                : "border-gray-200 dark:border-[#2D333D] bg-white dark:bg-[#181C23] text-[#374151] dark:text-[#C4CDD8] hover:border-gray-400 dark:hover:border-[#4A5568] hover:bg-gray-50 dark:hover:bg-[#1E2330]"
            }`}
          >
            {/* Custom radio dot */}
            <div
              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                active
                  ? "border-[#1C317A] dark:border-[#3D5BA9]"
                  : "border-gray-300 dark:border-[#3D4452]"
              }`}
            >
              {active && (
                <div className="w-2 h-2 rounded-full bg-[#1C317A] dark:bg-[#93B4FF]" />
              )}
            </div>
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={active}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}

function PillCheckboxGroup({
  options,
  selected,
  onChange,
  max,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (v: string[]) => void;
  max?: number;
}) {
  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((s) => s !== val));
    } else if (!max || selected.length < max) {
      onChange([...selected, val]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        const maxed = !active && !!max && selected.length >= max;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => !maxed && toggle(opt.value)}
            aria-pressed={active}
            className={`px-3 py-1.5 rounded-md border text-[12.5px] font-medium transition-colors ${
              active
                ? "border-[#1C317A] dark:border-[#3D5BA9] bg-[#eef2ff] dark:bg-[#1C317A]/25 text-[#1C317A] dark:text-[#93B4FF]"
                : maxed
                ? "border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#13161C] text-gray-300 dark:text-[#3D4452] cursor-not-allowed"
                : "border-gray-200 dark:border-[#2D333D] bg-white dark:bg-[#181C23] text-[#374151] dark:text-[#C4CDD8] hover:border-gray-400 dark:hover:border-[#4A5568] hover:bg-gray-50 dark:hover:bg-[#1E2330] cursor-pointer"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
  const display = hovered || value;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display;
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`Rate ${star} out of 5`}
            className="text-[30px] sm:text-[34px] transition-transform hover:scale-110 focus:outline-none leading-none"
          >
            <span
              className={
                filled
                  ? "text-amber-400"
                  : "text-gray-300 dark:text-[#2D333D]"
              }
            >
              ★
            </span>
          </button>
        );
      })}
      {display > 0 && (
        <span className="ml-2 text-[13px] font-medium text-[#475569] dark:text-[#8A919E]">
          {labels[display]}
        </span>
      )}
    </div>
  );
}

function ThreeWayPicker({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2.5 rounded-md border text-[13px] font-medium transition-colors ${
              active
                ? "border-[#1C317A] dark:border-[#3D5BA9] bg-[#eef2ff] dark:bg-[#1C317A]/20 text-[#1C317A] dark:text-[#93B4FF]"
                : "border-gray-200 dark:border-[#2D333D] bg-white dark:bg-[#181C23] text-[#374151] dark:text-[#C4CDD8] hover:border-gray-400 dark:hover:border-[#4A5568] hover:bg-gray-50 dark:hover:bg-[#1E2330]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#E8ECF0] mb-3 leading-snug">
      {children}
    </p>
  );
}

function InputLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[11.5px] font-semibold text-[#64748b] dark:text-[#8A919E] uppercase tracking-wider mb-1.5"
    >
      {children}
    </label>
  );
}

function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#13161C] border border-gray-200 dark:border-[#252A31] rounded-lg p-5 sm:p-6">
      {children}
    </div>
  );
}

const INPUT_CLASS =
  "w-full border border-gray-200 dark:border-[#2D333D] bg-white dark:bg-[#181C23] text-[#0f172a] dark:text-[#E8ECF0] placeholder-gray-400 dark:placeholder-[#4A5568] rounded-md px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:border-[#6B8CCF] dark:focus:ring-1 dark:focus:ring-[#6B8CCF] transition-colors";

const TEXTAREA_CLASS =
  "w-full border border-gray-200 dark:border-[#2D333D] bg-white dark:bg-[#181C23] text-[#0f172a] dark:text-[#E8ECF0] placeholder-gray-400 dark:placeholder-[#4A5568] rounded-md px-3.5 py-2.5 text-[13.5px] resize-y focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:border-[#6B8CCF] dark:focus:ring-1 dark:focus:ring-[#6B8CCF] transition-colors";

// ─── Main Form ───────────────────────────────────────────────────────────────

export default function FeedbackForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form state
  const [source, setSource] = useState("");
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState(false);
  const [firstLook, setFirstLook] = useState("");
  const [foundWhat, setFoundWhat] = useState("");
  const [dataPriorities, setDataPriorities] = useState<string[]>([]);
  const [retentionFeatures, setRetentionFeatures] = useState<string[]>([]);
  const [confusion, setConfusion] = useState("");
  const [investorType, setInvestorType] = useState("");
  const [missingFeatures, setMissingFeatures] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [contactError, setContactError] = useState<string | null>(null);

  // Validate contact on blur
  const handleContactBlur = () => {
    setContactError(validateContact(contact));
  };

  const handleContactChange = (v: string) => {
    setContact(v);
    // Clear error on typing if it was previously shown
    if (contactError) setContactError(validateContact(v));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate rating
    if (!rating) {
      setRatingError(true);
      document.getElementById("rating-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setRatingError(false);

    // Validate contact if filled
    const contactErr = validateContact(contact);
    if (contactErr) {
      setContactError(contactErr);
      document.getElementById("feedback-contact")?.focus();
      return;
    }

    startTransition(async () => {
      try {
        await submitFeedbackAction({
          source: source || undefined,
          rating,
          first_look: firstLook || undefined,
          found_what_looking: foundWhat || undefined,
          data_priorities: dataPriorities,
          retention_features: retentionFeatures,
          confusion: confusion || undefined,
          investor_type: investorType || undefined,
          missing_features: missingFeatures || undefined,
          name: name || undefined,
          contact: contact || undefined,
        });
        setSubmitted(true);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        );
      }
    });
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bg-white dark:bg-[#13161C] border border-gray-200 dark:border-[#252A31] rounded-lg p-8 sm:p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mx-auto mb-5">
          <span className="text-xl text-emerald-600 dark:text-emerald-400 font-bold leading-none">✓</span>
        </div>
        <h2
          className="text-[19px] font-semibold text-[#0f172a] dark:text-[#E8ECF0] mb-2"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Thank you for the feedback
        </h2>
        <p className="text-[14px] text-[#64748b] dark:text-[#8A919E] max-w-sm mx-auto leading-relaxed">
          We read every response. Your thoughts help us decide what to build and fix on IPOCraft.
        </p>
        <div className="mt-7 pt-6 border-t border-gray-100 dark:border-[#252A31]">
          <p className="text-[12.5px] text-gray-400 dark:text-[#4A5568] mb-3">
            Want to explore IPOCraft?
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { href: "/ipo", label: "IPO Directory" },
              { href: "/gmp", label: "GMP Table" },
              { href: "/ipo-calendar", label: "IPO Calendar" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 bg-[#f8fafc] dark:bg-[#181C23] border border-gray-200 dark:border-[#2D333D] rounded-md text-[13px] font-medium text-[#0f172a] dark:text-[#C4CDD8] hover:border-gray-400 dark:hover:border-[#4A5568] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      {/* Section 1 — How did you find us */}
      <FormCard>
        <SectionHeading number={1} title="How did you find us?" />
        <FieldLabel>How did you hear about IPOCraft?</FieldLabel>
        <RadioGroup
          name="source"
          options={SOURCE_OPTIONS}
          value={source}
          onChange={setSource}
        />
      </FormCard>

      {/* Section 2 — First Impression */}
      <FormCard>
        <SectionHeading number={2} title="Your first impression" />

        {/* Star rating */}
        <div className="mb-6" id="rating-section">
          <FieldLabel>
            Overall, how would you rate IPOCraft so far?{" "}
            <span className="text-rose-500 ml-0.5">*</span>
          </FieldLabel>
          <StarRating
            value={rating}
            onChange={(v) => {
              setRating(v);
              setRatingError(false);
            }}
          />
          {ratingError && (
            <p className="mt-2 text-[12.5px] text-rose-600 dark:text-rose-400 font-medium">
              Please select a star rating before submitting.
            </p>
          )}
        </div>

        {/* First look */}
        <div className="mb-6">
          <FieldLabel>On your first visit, what did you look at first?</FieldLabel>
          <RadioGroup
            name="first_look"
            options={FIRST_LOOK_OPTIONS}
            value={firstLook}
            onChange={setFirstLook}
          />
        </div>

        {/* Found what looking for */}
        <div>
          <FieldLabel>Did you find what you were looking for?</FieldLabel>
          <ThreeWayPicker
            options={[
              { value: "yes", label: "Yes" },
              { value: "almost", label: "Almost" },
              { value: "no", label: "No" },
            ]}
            value={foundWhat}
            onChange={setFoundWhat}
          />
        </div>
      </FormCard>

      {/* Section 3 — Help us improve */}
      <FormCard>
        <SectionHeading
          number={3}
          title="Help us improve"
          subtitle="A few quick picks about what matters to you — this shapes what we build next."
        />

        <div className="mb-6">
          <FieldLabel>
            What information do you check most often for an IPO?{" "}
            <span className="font-normal text-[#94a3b8] dark:text-[#4A5568]">(pick up to 3)</span>
          </FieldLabel>
          <PillCheckboxGroup
            options={DATA_PRIORITY_OPTIONS}
            selected={dataPriorities}
            onChange={setDataPriorities}
            max={3}
          />
        </div>

        <div className="mb-6">
          <FieldLabel>
            What would make you visit IPOCraft more often?{" "}
            <span className="font-normal text-[#94a3b8] dark:text-[#4A5568]">(pick up to 2)</span>
          </FieldLabel>
          <PillCheckboxGroup
            options={RETENTION_OPTIONS}
            selected={retentionFeatures}
            onChange={setRetentionFeatures}
            max={2}
          />
        </div>

        <div className="mb-6">
          <FieldLabel>What type of investor are you?</FieldLabel>
          <RadioGroup
            name="investor_type"
            options={INVESTOR_TYPE_OPTIONS}
            value={investorType}
            onChange={setInvestorType}
          />
        </div>

        <div className="mb-6">
          <FieldLabel>
            Is there anything that confused you or felt hard to understand?{" "}
            <span className="font-normal text-[#94a3b8] dark:text-[#4A5568]">(optional)</span>
          </FieldLabel>
          <textarea
            id="feedback-confusion"
            rows={3}
            value={confusion}
            onChange={(e) => setConfusion(e.target.value)}
            placeholder="e.g. I didn't understand what GMP meant, or the subscription numbers were hard to read..."
            className={TEXTAREA_CLASS}
          />
        </div>

        <div>
          <FieldLabel>
            Is there data or a feature you expected but didn't find?{" "}
            <span className="font-normal text-[#94a3b8] dark:text-[#4A5568]">(optional)</span>
          </FieldLabel>
          <textarea
            id="feedback-missing"
            rows={3}
            value={missingFeatures}
            onChange={(e) => setMissingFeatures(e.target.value)}
            placeholder="e.g. I wanted to see DRHP documents, or broker-specific allotment rates..."
            className={TEXTAREA_CLASS}
          />
        </div>
      </FormCard>

      {/* Section 4 — Optional contact */}
      <FormCard>
        <SectionHeading
          number={4}
          title="Optional — if you'd like a reply"
          subtitle="We don't send marketing. Only if you want us to follow up on your feedback."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <InputLabel htmlFor="feedback-name">Your name</InputLabel>
            <input
              id="feedback-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={INPUT_CLASS}
            />
          </div>

          {/* Contact — email or phone */}
          <div>
            <InputLabel htmlFor="feedback-contact">Email or WhatsApp number</InputLabel>
            <input
              id="feedback-contact"
              type="text"
              value={contact}
              onChange={(e) => handleContactChange(e.target.value)}
              onBlur={handleContactBlur}
              placeholder="you@email.com or +91 98765 43210"
              className={`${INPUT_CLASS} ${
                contactError
                  ? "border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500 dark:focus:border-rose-400 dark:focus:ring-rose-400"
                  : ""
              }`}
            />
            {contactError && (
              <p className="mt-1.5 text-[12px] text-rose-600 dark:text-rose-400 font-medium">
                {contactError}
              </p>
            )}
          </div>
        </div>
      </FormCard>

      {/* Submit error */}
      {submitError && (
        <p className="text-[13px] text-rose-600 dark:text-rose-400 font-medium px-1">
          {submitError}
        </p>
      )}

      {/* Submit row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-[12.5px] text-[#94a3b8] dark:text-[#4A5568]">
          <span className="text-rose-500">*</span> Star rating is required. All other fields are optional.
        </p>
        <button
          id="feedback-submit"
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-[#0f172a] dark:bg-white text-white dark:text-black font-semibold text-[13.5px] rounded-md border border-[#0f172a] dark:border-white transition-colors hover:bg-[#1e293b] dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Submitting..." : "Submit feedback"}
        </button>
      </div>
    </form>
  );
}
