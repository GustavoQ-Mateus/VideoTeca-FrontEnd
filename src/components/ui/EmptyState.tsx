import { LucideIcon } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center rounded-[18px] border border-dashed border-[#E2E8F0] bg-white">
      <div className="w-14 h-14 rounded-full bg-[#E8F2FC] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-[#0066B3]" aria-hidden />
      </div>
      <p className="font-semibold text-[#172033]">{title}</p>
      {description && <p className="text-sm text-[#667085] mt-1 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
