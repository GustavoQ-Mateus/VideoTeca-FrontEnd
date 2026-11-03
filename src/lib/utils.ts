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

// Status como texto na cor semântica (sem pílula/fundo): ver components/ui/Badge.
export const STATUS_COLORS: Record<string, string> = {
  available:   "text-success",
  reserved:    "text-brand",
  borrowed:    "text-warning",
  late:        "text-danger",
  returned:    "text-fg-muted",
  cancelled:   "text-fg-muted",
  expired:     "text-fg-muted",
  analysis:    "text-brand",
  approved:    "text-success",
  refused:     "text-danger",
  damaged:     "text-warning",
  maintenance: "text-fg-muted",
  occupied:    "text-warning",
  waiting:     "text-brand",
  confirmed:   "text-success",
};
