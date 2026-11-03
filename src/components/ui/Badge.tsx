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

// Status como texto na cor semântica, sem pílula nem fundo (regras do usuário).
const TONES: Record<BadgeTone, string> = {
  neutral: "text-fg-muted",
  brand:   "text-brand",
  success: "text-success",
  warning: "text-warning",
  danger:  "text-danger",
  info:    "text-info",
};

// STATUS_COLORS traz pares fundo/texto; aqui só a cor do texto é usada.
const textOnly = (classes: string) => classes.split(/\s+/).filter((c) => c.startsWith("text-")).join(" ");

export function Badge({ status, label, className, tone, size = "md" }: BadgeProps) {
  const colorClass = status
    ? textOnly(STATUS_COLORS[status] ?? "") || TONES.neutral
    : tone
      ? TONES[tone]
      : TONES.neutral;
  const text = label ?? (status ? STATUS_LABELS[status] ?? status : "");
  return (
    <span className={cn("inline-flex items-center font-medium whitespace-nowrap", size === "sm" ? "text-xs" : "text-sm", colorClass, className)}>
      {text}
    </span>
  );
}
