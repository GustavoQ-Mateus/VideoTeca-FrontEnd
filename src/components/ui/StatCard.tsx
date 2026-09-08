import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  accent?: "blue" | "green" | "red" | "yellow" | "purple";
  className?: string;
}

const ACCENT_STYLES = {
  blue:   { icon: "bg-[#E8F2FC] text-[#0066B3]", border: "border-l-[#0066B3]" },
  green:  { icon: "bg-emerald-50 text-emerald-600", border: "border-l-emerald-500" },
  red:    { icon: "bg-red-50 text-red-600", border: "border-l-red-500" },
  yellow: { icon: "bg-amber-50 text-amber-600", border: "border-l-amber-500" },
  purple: { icon: "bg-violet-50 text-violet-600", border: "border-l-violet-500" },
};

export function StatCard({ label, value, icon: Icon, trend, trendUp, accent = "blue", className }: StatCardProps) {
  const styles = ACCENT_STYLES[accent];
  return (
    <div className={cn("bg-white rounded-[18px] border border-[#E2E8F0] border-l-4 p-5 flex items-center gap-4", styles.border, className)}>
      <div className={cn("w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0", styles.icon)}>
        <Icon className="w-5 h-5" aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-[#172033] leading-none">{value}</p>
        <p className="text-sm text-[#667085] mt-1">{label}</p>
        {trend && (
          <p className={cn("text-xs font-medium mt-0.5", trendUp ? "text-emerald-600" : "text-red-500")}>
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
      </div>
    </div>
  );
}
