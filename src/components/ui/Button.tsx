"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
      primary:   "bg-[#0066B3] text-white hover:bg-[#005599] focus-visible:ring-[#0066B3] active:scale-[0.98]",
      secondary: "bg-[#E8F2FC] text-[#0066B3] hover:bg-[#D0E6F8] focus-visible:ring-[#0066B3]",
      ghost:     "bg-transparent text-[#667085] hover:bg-[#F5F7FA] focus-visible:ring-[#0066B3]",
      danger:    "bg-[#E7472E] text-white hover:bg-[#CC3D26] focus-visible:ring-[#E7472E] active:scale-[0.98]",
      outline:   "border border-[#E2E8F0] bg-white text-[#172033] hover:border-[#0066B3] hover:text-[#0066B3] focus-visible:ring-[#0066B3]",
    };
    const sizes = {
      sm: "text-sm px-3 py-1.5 rounded-[10px]",
      md: "text-sm px-4 py-2.5 rounded-[10px]",
      lg: "text-base px-6 py-3 rounded-[14px]",
    };
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
