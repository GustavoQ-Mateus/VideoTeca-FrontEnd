"use client";
import { createContext, useCallback, useContext, useMemo, useState, useId } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toast: (t: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const regionId = useId();

  const toast = useCallback((t: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setItems((prev) => [...prev, { ...t, id }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        id={regionId}
        className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
        aria-live="polite"
        aria-relevant="additions text"
        aria-atomic="true"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto motion-fade rounded-[14px] border px-4 py-3 shadow-lg flex gap-3 items-start bg-white",
              t.variant === "error" && "border-red-200 bg-red-50",
              t.variant === "success" && "border-emerald-200 bg-emerald-50",
              (!t.variant || t.variant === "info") && "border-[#E2E8F0]"
            )}
          >
            {t.variant === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden />
            ) : t.variant === "error" ? (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden />
            ) : null}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#172033]">{t.title}</p>
              {t.description && <p className="text-xs text-[#667085] mt-0.5">{t.description}</p>}
            </div>
            <button
              type="button"
              className="p-1 rounded-[8px] text-[#667085] hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066B3]"
              onClick={() => dismiss(t.id)}
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
