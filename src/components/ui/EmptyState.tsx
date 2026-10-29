import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface EmptyStateProps {
  /** Ícone lucide — decorativo (aria-hidden). */
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Alternativa a onAction: ação como link. */
  actionHref?: string;
  /** Conteúdo de ação livre (substitui actionLabel). */
  action?: React.ReactNode;
  /** Nível semântico do título (padrão h2). */
  titleAs?: "h2" | "h3" | "p";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  action,
  titleAs: Title = "h2",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 sm:py-14 px-6 text-center rounded-card border border-dashed border-line-strong bg-surface",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-brand-subtle flex items-center justify-center mb-4" aria-hidden="true">
        <Icon className="w-7 h-7 text-brand" aria-hidden="true" focusable="false" />
      </div>
      <Title className="font-semibold text-base text-fg font-sans">{title}</Title>
      {description && <p className="text-sm text-fg-subtle mt-1 max-w-sm">{description}</p>}
      {action ? (
        <div className="mt-4">{action}</div>
      ) : actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-4 inline-flex items-center justify-center min-h-11 px-4 rounded-control bg-brand text-fg-inverse text-sm font-medium hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          {actionLabel}
        </Link>
      ) : actionLabel && onAction ? (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
