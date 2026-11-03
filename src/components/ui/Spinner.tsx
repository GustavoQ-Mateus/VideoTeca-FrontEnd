import { cn } from "@/lib/utils";

const SIZES = {
  xs: "w-3.5 h-3.5",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-8 h-8",
} as const;

export interface SpinnerProps {
  size?: keyof typeof SIZES;
  /** Texto lido por leitores de tela. Ignorado quando `decorative`. */
  label?: string;
  /** Quando o contexto já anuncia o carregamento (ex.: botão com aria-busy). */
  decorative?: boolean;
  className?: string;
}

/**
 * Indicador de carregamento. Por padrão é uma região `role="status"` com rótulo
 * acessível; use `decorative` para escondê-lo de tecnologias assistivas.
 * A rotação é desligada pelo `prefers-reduced-motion` global.
 */
export function Spinner({ size = "sm", label = "Carregando…", decorative = false, className }: SpinnerProps) {
  const svg = (
    <svg
      className={cn("animate-spin flex-shrink-0", SIZES[size], className)}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );

  if (decorative) return svg;

  return (
    <span role="status" className="inline-flex items-center">
      {svg}
      <span className="sr-only">{label}</span>
    </span>
  );
}
