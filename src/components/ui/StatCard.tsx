import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  accent?: "blue" | "green" | "red" | "yellow" | "purple";
  className?: string;
  /** Mostra placeholder de carregamento no lugar do valor. */
  loading?: boolean;
}

const ACCENT_STYLES = {
  blue:   { icon: "bg-brand-subtle text-brand", border: "border-l-brand" },
  green:  { icon: "bg-emerald-50 text-emerald-700", border: "border-l-emerald-500" },
  red:    { icon: "bg-red-50 text-red-700", border: "border-l-red-500" },
  yellow: { icon: "bg-amber-50 text-amber-700", border: "border-l-amber-500" },
  purple: { icon: "bg-violet-50 text-violet-700", border: "border-l-violet-500" },
};

export function StatCard({ label, value, icon: Icon, trend, trendUp, accent = "blue", className, loading }: StatCardProps) {
  const styles = ACCENT_STYLES[accent];
  return (
    <div
      className={cn(
        "bg-surface rounded-card border border-line border-l-4 p-4 sm:p-5 flex items-center gap-4 min-w-0",
        styles.border,
        className
      )}
      aria-busy={loading || undefined}
    >
      <div className={cn("w-12 h-12 rounded-panel flex items-center justify-center flex-shrink-0", styles.icon)}>
        <Icon className="w-5 h-5" aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        {/* Rótulo antes do valor na leitura; visualmente o valor fica em cima. */}
        <div className="flex flex-col-reverse">
          <p className="text-sm text-fg-subtle mt-1 truncate">{label}</p>
          {loading ? (
            <span className="skeleton block h-6 w-16" aria-hidden />
          ) : (
            <p className="text-2xl font-bold text-fg leading-none tabular-nums">{value}</p>
          )}
        </div>
        {loading && <span className="sr-only">Carregando</span>}
        {trend && !loading && (
          <p className={cn("text-xs font-medium mt-0.5", trendUp ? "text-success" : "text-danger")}>
            <span aria-hidden>{trendUp ? "↑" : "↓"} </span>
            <span className="sr-only">{trendUp ? "Alta: " : "Queda: "}</span>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
