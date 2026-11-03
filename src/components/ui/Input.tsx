"use client";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef, useId } from "react";
import { Search } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Mensagem de erro: aplica aria-invalid e é associada via aria-describedby. */
  error?: string;
  /** Texto de ajuda associado via aria-describedby. */
  helper?: string;
  isSearch?: boolean;
  /** Esconde o rótulo visualmente (continua acessível). */
  hideLabel?: boolean;
  /** Classe do contêiner externo (label + campo + mensagens). */
  containerClassName?: string;
}

/** Junta ids de aria-describedby ignorando vazios. */
export function joinIds(...ids: (string | undefined | false)[]) {
  const v = ids.filter(Boolean).join(" ");
  return v || undefined;
}

/** Id estável: `id` explícito > slug do rótulo (compatibilidade) > useId. */
export function slugId(label?: string) {
  return label
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const FIELD_BASE =
  "w-full bg-surface border border-input rounded-control text-sm text-fg placeholder:text-fg-subtle " +
  "transition-colors duration-150 motion-reduce:transition-none " +
  "hover:border-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/25 " +
  "disabled:bg-canvas disabled:text-fg-disabled disabled:border-line disabled:cursor-not-allowed " +
  "read-only:bg-canvas";

export const FIELD_ERROR = "border-danger hover:border-danger focus:border-danger focus:ring-danger/20";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helper,
      isSearch,
      hideLabel,
      containerClassName,
      id,
      "aria-describedby": describedBy,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? (label ? `${slugId(label)}${autoId}` : autoId);
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label htmlFor={inputId} className={cn("text-sm font-medium text-fg", hideLabel && "sr-only")}>
            {label}
            {props.required && (
              <>
                <span className="text-danger ml-1" aria-hidden>*</span>
                <span className="sr-only"> (obrigatório)</span>
              </>
            )}
          </label>
        )}
        <div className="relative">
          {isSearch && (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle pointer-events-none" aria-hidden />
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(FIELD_BASE, "h-11 px-3", error && FIELD_ERROR, isSearch && "pl-9", className)}
            aria-invalid={error ? true : undefined}
            aria-describedby={joinIds(error && errorId, helper && helperId, describedBy)}
            {...props}
          />
        </div>
        {error && (
          <p id={errorId} className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
        {helper && (
          <p id={helperId} className={cn("text-xs text-fg-subtle", error && "sr-only")}>
            {helper}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
