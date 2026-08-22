import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1 text-[12px] flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRightIcon className="w-3 h-3" style={{ color: "var(--text-faint)" }} />}
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className="transition-colors hover:underline"
              style={{ color: "var(--text-muted)" }}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className="font-medium"
              style={{ color: "var(--text-primary)" }}
              aria-current={i === items.length - 1 ? "page" : undefined}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
