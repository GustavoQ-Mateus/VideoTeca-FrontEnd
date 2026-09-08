"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const tid = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={tid} className="block text-sm font-medium text-[#172033] mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={tid}
          className={cn(
            "w-full min-h-[100px] px-3 py-2 rounded-[10px] border border-[#E2E8F0] bg-white text-sm text-[#172033]",
            "placeholder:text-[#667085] focus:outline-none focus:border-[#0066B3] focus:ring-2 focus:ring-[#0066B3]/20",
            error && "border-red-400",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
