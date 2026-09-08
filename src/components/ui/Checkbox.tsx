"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const cid = id ?? props.name;
    return (
      <label htmlFor={cid} className="inline-flex items-start gap-2.5 cursor-pointer group">
        <input
          ref={ref}
          type="checkbox"
          id={cid}
          className={cn(
            "mt-0.5 w-4 h-4 rounded-[6px] border-[#E2E8F0] text-[#0066B3] focus:ring-[#0066B3]/30",
            className
          )}
          {...props}
        />
        <span className="text-sm text-[#172033] group-hover:text-[#0066B3] transition-colors">{label}</span>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
