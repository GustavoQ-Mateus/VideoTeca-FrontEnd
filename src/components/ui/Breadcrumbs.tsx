import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-[#667085] flex-wrap">
      {items.map((c, i) => (
        <span key={`${c.label}-${i}`} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 opacity-50 flex-shrink-0" aria-hidden />}
          {c.href && i < items.length - 1 ? (
            <Link href={c.href} className="hover:text-[#0066B3] transition-colors">
              {c.label}
            </Link>
          ) : (
            <span className={i === items.length - 1 ? "text-[#172033] font-medium" : undefined}>{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
