"use client";
import { RefObject, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDialogA11y } from "./Modal";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  side?: "left" | "right";
  /** Rodapé fixo (ex.: botões Aplicar/Limpar). */
  footer?: React.ReactNode;
  /** Texto descritivo associado via aria-describedby. */
  description?: string;
  /** Elemento que recebe o foco ao abrir. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  className?: string;
}

/** Painel lateral modal (mesmo contrato de acessibilidade do Modal). */
export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  footer,
  description,
  initialFocusRef,
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  useDialogA11y(open, onClose, panelRef, initialFocusRef);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[85] flex">
      <div className="absolute inset-0 bg-[#101828]/40 motion-fade" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "absolute top-0 bottom-0 w-[min(100%,28rem)] bg-surface shadow-2xl border-line flex flex-col focus:outline-none",
          side === "right" ? "right-0 border-l motion-right" : "left-0 border-r motion-left",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-line">
          <div className="min-w-0 pt-2">
            <h2 id={titleId} className="text-base font-semibold text-fg">
              {title}
            </h2>
            {description && (
              <p id={descId} className="text-sm text-fg-subtle mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-control text-fg-subtle hover:bg-canvas hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4">{children}</div>
        {footer && (
          <div className="px-4 py-3 border-t border-line flex flex-wrap justify-end gap-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
