import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-[18px] border border-[#E2E8F0] bg-white p-4 space-y-3">
      <Skeleton className="h-40 w-full rounded-[14px]" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
