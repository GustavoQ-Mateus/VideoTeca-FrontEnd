import { cn } from "@/lib/utils";

/** Bloco de placeholder. Sempre `aria-hidden`: anuncie o carregamento com <LoadingRegion>. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-card border border-line bg-surface p-4 space-y-3" aria-hidden="true">
      <Skeleton className="h-40 w-full rounded-panel" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

/** Linhas de texto simuladas. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

/** Lista/tabela simulada. */
export function SkeletonRows({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("rounded-card border border-line bg-surface divide-y divide-line", className)} aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-6 w-16 rounded-pill hidden sm:block" />
        </div>
      ))}
    </div>
  );
}

/**
 * Região de carregamento acessível: `aria-busy` + texto para leitores de tela.
 * Os skeletons internos ficam ocultos para tecnologias assistivas.
 */
export function LoadingRegion({
  label = "Carregando conteúdo…",
  busy = true,
  className,
  children,
}: {
  label?: string;
  busy?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={className} aria-busy={busy}>
      {busy && (
        <span role="status" className="sr-only">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

/** Esqueleto padrão de página (usado pelos loading.tsx das áreas). */
export function PageSkeleton({ variant = "dashboard" }: { variant?: "dashboard" | "list" | "grid" }) {
  return (
    <LoadingRegion label="Carregando página…" className="space-y-6">
      <div className="space-y-2" aria-hidden="true">
        <Skeleton className="h-7 w-56 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      {variant === "dashboard" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" aria-hidden="true">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="rounded-card border border-line bg-surface p-5 flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-panel flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          ))}
        </div>
      )}
      {variant === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <SkeletonRows rows={variant === "list" ? 6 : 4} />
      )}
    </LoadingRegion>
  );
}
