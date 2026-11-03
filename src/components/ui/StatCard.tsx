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

// Sem ícone em quadrado tintado e sem borda lateral colorida (regras do usuário):
// cor só quando o número é um estado (ex.: atraso em vermelho).
const VALUE_COLOR: Record<NonNullable<StatCardProps["accent"]>, string> = {
  blue: "text-fg",
  green: "text-fg",
  yellow: "text-fg",
  purple: "text-fg",
  red: "text-danger",
};

export function StatCard({ label, value, icon: Icon, trend, trendUp, accent = "blue", className, loading }: StatCardProps) {
  return (
    <div
      className={cn("bg-surface rounded-[4px] border border-line p-4 sm:p-5 min-w-0", className)}
      aria-busy={loading || undefined}
    >
      <div className="flex flex-col-reverse gap-2">
        {loading ? (
          <span className="skeleton block h-8 w-16" aria-hidden />
        ) : (
          <p className={cn("text-3xl font-semibold leading-none tabular-nums tracking-tight", VALUE_COLOR[accent])}>{value}</p>
        )}
        <p className="flex items-center gap-1.5 text-sm text-fg-muted truncate">
          <Icon className="w-4 h-4 text-brand flex-shrink-0" aria-hidden />
          {label}
        </p>
      </div>
      {loading && <span className="sr-only">Carregando</span>}
      {trend && !loading && (
        <p className={cn("text-xs font-medium mt-2", trendUp ? "text-success" : "text-danger")}>
          <span aria-hidden>{trendUp ? "↑" : "↓"} </span>
          <span className="sr-only">{trendUp ? "Alta: " : "Queda: "}</span>
          {trend}
        </p>
      )}
    </div>
  );
}
