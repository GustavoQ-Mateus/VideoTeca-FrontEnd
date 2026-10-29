"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Tempo em ms até sumir (padrão: 4200; erros 8000). 0 = só fecha manualmente. */
  duration?: number;
}

interface ToastContextValue {
  /** Exibe um toast e devolve seu id. */
  toast: (t: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

let counter = 0;
function newId() {
  // crypto.randomUUID só existe em contexto seguro (HTTPS/localhost).
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  counter += 1;
  return `toast-${Date.now()}-${counter}`;
}

const STYLES: Record<ToastVariant, { box: string; icon: React.ElementType; iconClass: string; sr: string }> = {
  success: { box: "border-emerald-200 bg-emerald-50", icon: CheckCircle2, iconClass: "text-success", sr: "Sucesso" },
  error:   { box: "border-red-200 bg-danger-subtle", icon: AlertCircle, iconClass: "text-danger", sr: "Erro" },
  warning: { box: "border-amber-200 bg-amber-50", icon: AlertTriangle, iconClass: "text-warning", sr: "Atenção" },
  info:    { box: "border-line bg-surface", icon: Info, iconClass: "text-brand", sr: "Informação" },
};

function ToastCard({ t, onDismiss }: { t: ToastItem; onDismiss: (id: string) => void }) {
  const variant = t.variant ?? "info";
  const s = STYLES[variant];
  const Icon = s.icon;
  return (
    <div
      className={cn(
        "pointer-events-auto motion-fade rounded-panel border px-4 py-3 shadow-lg flex gap-3 items-start",
        s.box
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", s.iconClass)} aria-hidden />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-fg">
          <span className="sr-only">{s.sr}: </span>
          {t.title}
        </p>
        {t.description && <p className="text-xs text-fg-muted mt-0.5">{t.description}</p>}
      </div>
      <button
        type="button"
        className="-m-2 w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-control text-fg-subtle hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        onClick={() => onDismiss(t.id)}
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" aria-hidden />
      </button>
    </div>
  );
}

/**
 * Toasts com duas regiões vivas sempre montadas (requisito para leitores de tela):
 * - aria-live=polite: success/info
 * - aria-live=assertive: error/warning
 * Sem role=status/alert nos contêineres vazios, para não poluir a árvore de acessibilidade
 * (nem colidir com getByRole("alert"|"status") das páginas).
 * O temporizador pausa com o mouse sobre ou foco dentro da pilha.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, number>());
  const paused = useRef(false);

  const dismiss = useCallback((id: string) => {
    const handle = timers.current.get(id);
    if (handle) window.clearTimeout(handle);
    timers.current.delete(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const schedule = useCallback(
    (item: ToastItem) => {
      const duration = item.duration ?? (item.variant === "error" ? 8000 : 4200);
      if (duration <= 0) return;
      const handle = window.setTimeout(function tick() {
        if (paused.current) {
          timers.current.set(item.id, window.setTimeout(tick, 1000));
          return;
        }
        dismiss(item.id);
      }, duration);
      timers.current.set(item.id, handle);
    },
    [dismiss]
  );

  const toast = useCallback(
    (t: Omit<ToastItem, "id">) => {
      const item = { ...t, id: newId() };
      setItems((prev) => [...prev, item]);
      schedule(item);
      return item.id;
    },
    [schedule]
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((h) => window.clearTimeout(h));
      map.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  const polite = items.filter((t) => t.variant !== "error" && t.variant !== "warning");
  const assertive = items.filter((t) => t.variant === "error" || t.variant === "warning");

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onFocus={() => (paused.current = true)}
        onBlur={() => (paused.current = false)}
      >
        <div aria-live="assertive" aria-atomic="false" aria-relevant="additions" className="flex flex-col gap-2">
          {assertive.map((t) => (
            <ToastCard key={t.id} t={t} onDismiss={dismiss} />
          ))}
        </div>
        <div aria-live="polite" aria-atomic="false" aria-relevant="additions" className="flex flex-col gap-2">
          {polite.map((t) => (
            <ToastCard key={t.id} t={t} onDismiss={dismiss} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
