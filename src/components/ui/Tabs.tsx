"use client";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div role="tablist" className={cn("flex gap-1 p-1 bg-[#F5F7FA] rounded-[12px] w-fit flex-wrap", className)}>
      {tabs.map((t) => {
        const selected = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(t.id)}
            className={cn(
              "px-4 py-2 rounded-[10px] text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066B3]",
              selected ? "bg-white text-[#0066B3] shadow-sm" : "text-[#667085] hover:text-[#172033]"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
