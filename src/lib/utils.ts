import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const STATUS_LABELS: Record<string, string> = {
  available:   "Disponível",
  reserved:    "Reservado",
  borrowed:    "Emprestado",
  late:        "Atrasado",
  returned:    "Devolvido",
  cancelled:   "Cancelado",
  expired:     "Expirado",
  analysis:    "Em Análise",
  approved:    "Aprovado",
  refused:     "Recusado",
  damaged:     "Danificado",
  maintenance: "Manutenção",
  occupied:    "Ocupada",
  waiting:     "Ag. Retirada",
  confirmed:   "Confirmado",
};

export const STATUS_COLORS: Record<string, string> = {
  available:   "bg-emerald-100 text-emerald-700",
  reserved:    "bg-blue-100 text-blue-700",
  borrowed:    "bg-amber-100 text-amber-700",
  late:        "bg-red-100 text-red-700",
  returned:    "bg-slate-100 text-slate-600",
  cancelled:   "bg-slate-100 text-slate-500",
  expired:     "bg-slate-100 text-slate-500",
  analysis:    "bg-purple-100 text-purple-700",
  approved:    "bg-emerald-100 text-emerald-700",
  refused:     "bg-red-100 text-red-700",
  damaged:     "bg-amber-100 text-amber-700",
  maintenance: "bg-slate-200 text-slate-700",
  occupied:    "bg-amber-100 text-amber-800",
  waiting:     "bg-sky-100 text-sky-700",
  confirmed:   "bg-emerald-100 text-emerald-700",
};
