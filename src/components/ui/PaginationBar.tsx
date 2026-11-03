"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  className?: string;
  /** Rótulo do landmark de navegação (padrão: "Paginação"). */
  ariaLabel?: string;
}

const BTN =
  "inline-flex items-center justify-center min-h-11 min-w-11 sm:min-h-9 sm:min-w-9 rounded-[10px] text-sm font-medium " +
  "transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

/** Paginação acessível: <nav>, rótulos por página, aria-current e anúncio da página atual. */
export function PaginationBar({ page, totalPages, onPageChange, className, ariaLabel = "Paginação" }: PaginationBarProps) {
  const total = Math.max(1, totalPages);
  const pages = Array.from({ length: Math.min(5, total) }, (_, i) => {
    const start = Math.max(1, Math.min(page - 2, total - 4));
    return start + i;
  }).filter((p) => p >= 1 && p <= total);

  return (
    <nav aria-label={ariaLabel} className={cn("flex items-center justify-between gap-3 flex-wrap", className)}>
      <p className="text-sm text-fg-subtle" aria-live="polite" aria-atomic="true">
        Página <span className="font-semibold text-fg">{page}</span> de {total}
      </p>
      <ul className="flex items-center gap-1">
        <li>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Página anterior"
            className={cn(BTN, "px-2 sm:px-3 text-fg-muted border border-line-strong hover:bg-canvas disabled:opacity-40 disabled:cursor-not-allowed")}
          >
            <ChevronLeft className="w-4 h-4 sm:hidden" aria-hidden />
            <span className="hidden sm:inline" aria-hidden>Anterior</span>
          </button>
        </li>
        {pages.map((p) => (
          <li key={p}>
            <button
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Página ${p}`}
              className={cn(BTN, p === page ? "bg-brand text-fg-inverse" : "text-fg-muted hover:bg-canvas")}
            >
              {p}
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            disabled={page >= total}
            onClick={() => onPageChange(page + 1)}
            aria-label="Próxima página"
            className={cn(BTN, "px-2 sm:px-3 text-fg-muted border border-line-strong hover:bg-canvas disabled:opacity-40 disabled:cursor-not-allowed")}
          >
            <span className="hidden sm:inline" aria-hidden>Próxima</span>
            <ChevronRight className="w-4 h-4 sm:hidden" aria-hidden />
          </button>
        </li>
      </ul>
    </nav>
  );
}
