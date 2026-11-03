import { AlertTriangle, Info, CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertVariant = "info" | "warning" | "success" | "error";

const styles: Record<AlertVariant, string> = {
  info: "bg-info-subtle border-brand/25 text-brand",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  success: "bg-emerald-50 border-emerald-200 text-emerald-900",
  error: "bg-danger-subtle border-red-200 text-danger",
};

const icons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  error: AlertCircle,
};

const srPrefix: Record<AlertVariant, string> = {
  info: "Informação: ",
  warning: "Atenção: ",
  success: "Sucesso: ",
  error: "Erro: ",
};

export function AlertBanner({
  variant = "info",
  title,
  children,
  className,
  action,
  onDismiss,
  live,
}: {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** Ação opcional (ex.: botão/link) exibida à direita. */
  action?: React.ReactNode;
  /** Mostra botão "Fechar" quando informado. */
  onDismiss?: () => void;
  /**
   * Como anunciar a leitores de tela: "polite" (role=status, padrão),
   * "assertive" (role=alert, padrão para `error`) ou "off" (sem região viva).
   */
  live?: "polite" | "assertive" | "off";
}) {
  const Icon = icons[variant];
  const mode = live ?? (variant === "error" ? "assertive" : "polite");
  const role = mode === "assertive" ? "alert" : mode === "polite" ? "status" : undefined;
  return (
    <div
      className={cn("flex flex-wrap sm:flex-nowrap gap-3 rounded-[12px] border px-4 py-3 text-sm", styles[variant], className)}
      role={role}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold">
            <span className="sr-only">{srPrefix[variant]}</span>
            {title}
          </p>
        )}
        <div className={title ? "mt-0.5 opacity-90" : ""}>
          {!title && <span className="sr-only">{srPrefix[variant]}</span>}
          {children}
        </div>
      </div>
      {action && <div className="flex items-center gap-2 flex-shrink-0">{action}</div>}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar aviso"
          className="-m-2 ml-auto w-11 h-11 flex items-center justify-center rounded-control hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current flex-shrink-0"
        >
          <X className="w-4 h-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
