
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export default function Breadcrumbs({
  items,
  className = "",
}: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`w-full ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em]">
        <li>
          <Link
            href="/"
            className="text-[#9A8C7D] transition-colors hover:text-[#40372F]"
          >
            Home
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              <ChevronRight
                size={12}
                className="text-[#B9AA99]"
                aria-hidden="true"
              />

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-[#9A8C7D] transition-colors hover:text-[#40372F]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={
                    isLast
                      ? "font-semibold text-[#40372F]"
                      : "text-[#9A8C7D]"
                  }
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

