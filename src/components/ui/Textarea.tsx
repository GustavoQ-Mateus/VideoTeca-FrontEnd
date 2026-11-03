"use client";
import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { FIELD_BASE, FIELD_ERROR, joinIds } from "./Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  /** Texto de ajuda associado via aria-describedby. */
  helper?: string;
  /** Esconde o rótulo visualmente (continua acessível). */
  hideLabel?: boolean;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, error, helper, hideLabel, containerClassName, id, "aria-describedby": describedBy, ...props },
    ref
  ) => {
    const autoId = useId();
    const tid = id ?? props.name ?? autoId;
    const errorId = `${tid}-error`;
    const helperId = `${tid}-helper`;
    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label htmlFor={tid} className={cn("block text-sm font-medium text-fg mb-1.5", hideLabel && "sr-only")}>
            {label}
            {props.required && (
              <>
                <span className="text-danger ml-1" aria-hidden>*</span>
                <span className="sr-only"> (obrigatório)</span>
              </>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={tid}
          className={cn(FIELD_BASE, "min-h-[100px] px-3 py-2", error && FIELD_ERROR, className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={joinIds(error && errorId, helper && helperId, describedBy)}
          {...props}
        />
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
Textarea.displayName = "Textarea";
