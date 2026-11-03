"use client";
import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { joinIds } from "./Input";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Texto auxiliar abaixo do rótulo (associado via aria-describedby). */
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, disabled, "aria-describedby": describedBy, ...props }, ref) => {
    const autoId = useId();
    const cid = id ?? props.name ?? autoId;
    const descId = `${cid}-desc`;
    const errorId = `${cid}-error`;
    return (
      <div className="inline-flex flex-col">
        <label
          htmlFor={cid}
          className={cn(
            "inline-flex items-start gap-2.5 min-h-11 py-2.5 group",
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          )}
        >
          <input
            ref={ref}
            type="checkbox"
            id={cid}
            disabled={disabled}
            className={cn(
              "mt-0.5 w-[18px] h-[18px] flex-shrink-0 rounded-chip accent-brand cursor-[inherit]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              className
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={joinIds(description && descId, error && errorId, describedBy)}
            {...props}
          />
          <span className="flex flex-col">
            <span className={cn("text-sm text-fg transition-colors", !disabled && "group-hover:text-brand")}>
              {label}
            </span>
            {description && (
              <span id={descId} className="text-xs text-fg-subtle mt-0.5">
                {description}
              </span>
            )}
          </span>
        </label>
        {error && (
          <p id={errorId} className="text-xs text-danger ml-7" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
