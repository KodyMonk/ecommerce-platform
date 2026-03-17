import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: Props) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <ChevronRight className="h-4 w-4" /> : null}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-foreground" : ""}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}