"use client";
import { cn } from "@/lib/utils";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  className?: string;
}

export function PaginationBar({ page, totalPages, onPageChange, className }: PaginationBarProps) {
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    return start + i;
  }).filter((p) => p >= 1 && p <= totalPages);

  return (
    <div className={cn("flex items-center justify-between gap-3 flex-wrap", className)}>
      <p className="text-sm text-[#667085]">
        Página <span className="font-semibold text-[#172033]">{page}</span> de {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 rounded-[10px] text-sm font-medium text-[#667085] border border-[#E2E8F0] hover:bg-[#F5F7FA] disabled:opacity-40"
        >
          Anterior
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "w-9 h-9 rounded-[10px] text-sm font-medium transition-colors",
              p === page ? "bg-[#0066B3] text-white" : "text-[#667085] hover:bg-[#F5F7FA]"
            )}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 rounded-[10px] text-sm font-medium text-[#667085] border border-[#E2E8F0] hover:bg-[#F5F7FA] disabled:opacity-40"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
