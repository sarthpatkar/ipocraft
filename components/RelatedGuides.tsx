import Link from "next/link";

export type GuideKey =
  | "what-is-ipo-gmp"
  | "ipo-grey-market-guide"
  | "ipo-subscription-meaning"
  | "how-ipo-allotment-works"
  | "qib-hni-retail-explained"
  | "ipo-profit-calculator"
  | "ipo-allotment-probability-calculator"
  | "blog";

const CATALOG: Record<GuideKey, { href: string; label: string }> = {
  "what-is-ipo-gmp": { href: "/what-is-ipo-gmp", label: "What is IPO GMP?" },
  "ipo-grey-market-guide": { href: "/ipo-grey-market-guide", label: "IPO Grey Market Guide" },
  "ipo-subscription-meaning": { href: "/ipo-subscription-meaning", label: "IPO Subscription Meaning" },
  "how-ipo-allotment-works": { href: "/how-ipo-allotment-works", label: "How IPO Allotment Works" },
  "qib-hni-retail-explained": { href: "/qib-hni-retail-explained", label: "QIB vs HNI vs Retail Explained" },
  "ipo-profit-calculator": { href: "/ipo-profit-calculator", label: "IPO Listing Profit Calculator" },
  "ipo-allotment-probability-calculator": {
    href: "/ipo-allotment-probability-calculator",
    label: "IPO Allotment Probability Calculator",
  },
  blog: { href: "/blog", label: "IPOCraft Blog" },
};

/**
 * Consistent "Related IPO Learning Resources" list for the guide/calculator
 * pages — pass the current page's own key in `exclude` so it never links to
 * itself, and optionally `only` to pick a specific subset/order.
 */
export default function RelatedGuides({
  exclude,
  only,
}: {
  exclude: GuideKey;
  only?: GuideKey[];
}) {
  const keys = (only ?? (Object.keys(CATALOG) as GuideKey[])).filter((k) => k !== exclude);

  return (
    <ul className="list-disc pl-6 space-y-2">
      {keys.map((key) => (
        <li key={key}>
          <Link href={CATALOG[key].href} className="text-[#1C317A] dark:text-blue-400 underline">
            {CATALOG[key].label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
