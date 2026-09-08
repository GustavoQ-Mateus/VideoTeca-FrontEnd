"use client";
import { cn, STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";

interface BadgeProps {
  status?: string;
  label?: string;
  className?: string;
}

export function Badge({ status, label, className }: BadgeProps) {
  const colorClass = status ? STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600" : "";
  const text = label ?? (status ? STATUS_LABELS[status] : "");
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium", colorClass, className)}>
      {status ? <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" /> : null}
      {text}
    </span>
  );
}
