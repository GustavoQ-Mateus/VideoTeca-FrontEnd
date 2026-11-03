"use client";
import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FIELD_BASE, FIELD_ERROR, joinIds } from "./Input";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  /** Texto de ajuda associado via aria-describedby. */
  helper?: string;
  /** Esconde o rótulo visualmente (continua acessível). */
  hideLabel?: boolean;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, helper, hideLabel, containerClassName, id, children, "aria-describedby": describedBy, ...props },
    ref
  ) => {
    const autoId = useId();
    const selectId = id ?? props.name ?? autoId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;
    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label htmlFor={selectId} className={cn("block text-sm font-medium text-fg mb-1.5", hideLabel && "sr-only")}>
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
          <select
            ref={ref}
            id={selectId}
            className={cn(FIELD_BASE, "appearance-none h-11 pl-3 pr-9 cursor-pointer", error && FIELD_ERROR, className)}
            aria-invalid={error ? true : undefined}
            aria-describedby={joinIds(error && errorId, helper && helperId, describedBy)}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle pointer-events-none"
            aria-hidden
          />
        </div>
        {error && (
          <p id={errorId} className="text-xs text-danger mt-1" role="alert">
            {error}
          </p>
        )}
        {helper && (
          <p id={helperId} className={cn("text-xs text-fg-subtle mt-1", error && "sr-only")}>
            {helper}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
