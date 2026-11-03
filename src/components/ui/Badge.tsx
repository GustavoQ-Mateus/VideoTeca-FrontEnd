"use client";
import { cn, STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";

export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  /** Chave de status (ver STATUS_LABELS/STATUS_COLORS em lib/utils). */
  status?: string;
  label?: string;
  className?: string;
  /** Cor semântica quando não há `status`. */
  tone?: BadgeTone;
  size?: "sm" | "md";
}

// Pares texto/fundo com contraste ≥ 4.5:1.
const TONES: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  brand:   "bg-brand-subtle text-brand",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  danger:  "bg-danger-subtle text-danger",
  info:    "bg-info-subtle text-info",
};

export function Badge({ status, label, className, tone, size = "md" }: BadgeProps) {
  const colorClass = status
    ? STATUS_COLORS[status] ?? TONES.neutral
    : tone
      ? TONES[tone]
      : "";
  const text = label ?? (status ? STATUS_LABELS[status] ?? status : "");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill font-medium whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-0.5 text-xs",
        colorClass,
        className
      )}
    >
      {status ? <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" aria-hidden /> : null}
      {text}
    </span>
  );
}
