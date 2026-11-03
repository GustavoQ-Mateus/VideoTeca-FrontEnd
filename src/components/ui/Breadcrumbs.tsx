import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

/** Trilha de navegação (WAI-ARIA breadcrumb): lista ordenada + aria-current no item atual. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Trilha de navegação" className={cn("min-w-0", className)}>
      <ol className="flex items-center gap-1 text-sm text-fg-subtle flex-wrap">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1 min-w-0">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0" aria-hidden />}
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className="py-1 rounded-sm hover:text-brand hover:underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand truncate max-w-[12rem]"
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  className={cn("truncate max-w-[16rem]", last && "text-fg font-medium")}
                  aria-current={last ? "page" : undefined}
                >
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
