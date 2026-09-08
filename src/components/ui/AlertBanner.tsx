import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertVariant = "info" | "warning" | "success";

const styles: Record<AlertVariant, string> = {
  info: "bg-[#E8F2FC] border-[#0066B3]/25 text-[#0066B3]",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  success: "bg-emerald-50 border-emerald-200 text-emerald-900",
};

const icons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
};

export function AlertBanner({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = icons[variant];
  return (
    <div className={cn("flex gap-3 rounded-[12px] border px-4 py-3 text-sm", styles[variant], className)} role="status">
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? "mt-0.5 opacity-90" : ""}>{children}</div>
      </div>
    </div>
  );
}
