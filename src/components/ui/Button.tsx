"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Mostra spinner, define aria-busy e bloqueia cliques. */
  loading?: boolean;
  /** Texto exibido enquanto `loading` (padrão: mantém o rótulo). */
  loadingText?: string;
  /** Ícone antes do rótulo (oculto quando `loading`). */
  leftIcon?: ReactNode;
  /** Ícone depois do rótulo. */
  rightIcon?: ReactNode;
  /** Ocupa toda a largura do contêiner. */
  fullWidth?: boolean;
}

const BASE =
  "inline-flex items-center justify-center gap-2 font-medium select-none whitespace-nowrap " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 motion-reduce:transition-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "disabled:opacity-50 disabled:cursor-not-allowed aria-busy:cursor-progress";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:   "bg-brand text-fg-inverse hover:bg-brand-hover focus-visible:ring-brand enabled:active:scale-[0.98]",
  secondary: "bg-brand-subtle text-brand hover:bg-[#D0E6F8] focus-visible:ring-brand",
  ghost:     "bg-transparent text-fg-muted hover:bg-canvas hover:text-fg focus-visible:ring-brand",
  danger:    "bg-danger-strong text-fg-inverse hover:bg-danger-hover focus-visible:ring-danger enabled:active:scale-[0.98]",
  outline:   "border border-line-strong bg-surface text-fg hover:border-brand hover:text-brand focus-visible:ring-brand",
};

const SIZES: Record<ButtonSize, string> = {
  sm:   "text-sm min-h-9 px-3 py-1.5 rounded-control",
  md:   "text-sm min-h-11 px-4 py-2.5 rounded-control",
  lg:   "text-base min-h-12 px-6 py-3 rounded-panel",
  icon: "min-h-11 min-w-11 p-2.5 rounded-control",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full", className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? <Spinner size="sm" decorative /> : leftIcon}
        {loading && loadingText ? loadingText : children}
        {!loading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";
