"use client";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";
import { Search } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  isSearch?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, isSearch, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#172033]">
            {label}
            {props.required && <span className="text-[#E7472E] ml-1" aria-hidden>*</span>}
          </label>
        )}
        <div className="relative">
          {isSearch && (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" aria-hidden />
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-11 border border-[#E2E8F0] bg-white rounded-[10px] px-3 text-sm text-[#172033] placeholder:text-[#667085]",
              "transition-colors duration-150",
              "focus:outline-none focus:border-[#0066B3] focus:ring-2 focus:ring-[#0066B3]/20",
              error ? "border-[#E7472E] focus:border-[#E7472E] focus:ring-[#E7472E]/20" : "",
              isSearch ? "pl-9" : "",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
            {...props}
          />
        </div>
        {error && <p id={`${inputId}-error`} className="text-xs text-[#E7472E]" role="alert">{error}</p>}
        {helper && !error && <p id={`${inputId}-helper`} className="text-xs text-[#667085]">{helper}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
