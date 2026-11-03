"use client";
import { RefObject, useEffect, useEffectEvent, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), ' +
  'textarea:not([disabled]), iframe, audio[controls], video[controls], [contenteditable]:not([contenteditable="false"]), ' +
  '[tabindex]:not([tabindex="-1"])';

function getFocusable(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("inert") && el.getClientRects().length > 0
  );
}

// Pilha de diálogos abertos: só o do topo reage a Esc/Tab.
const dialogStack: symbol[] = [];
let scrollLocks = 0;
let savedOverflow = "";
let savedPaddingRight = "";

function lockScroll() {
  if (scrollLocks++ > 0) return;
  const body = document.body;
  savedOverflow = body.style.overflow;
  savedPaddingRight = body.style.paddingRight;
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  body.style.overflow = "hidden";
  if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
}

function unlockScroll() {
  if (--scrollLocks > 0) return;
  scrollLocks = 0;
  document.body.style.overflow = savedOverflow;
  document.body.style.paddingRight = savedPaddingRight;
}

/**
 * Comportamento acessível de diálogo modal: foco inicial, armadilha de foco (Tab/Shift+Tab),
 * Esc fecha, retorno do foco ao elemento que abriu e bloqueio de rolagem do body.
 * Foco inicial: `initialFocusRef` > elemento com `data-autofocus` > o próprio painel.
 */
export function useDialogA11y(
  open: boolean,
  onClose: () => void,
  panelRef: RefObject<HTMLElement | null>,
  initialFocusRef?: RefObject<HTMLElement | null>
) {
  const close = useEffectEvent(() => onClose());

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const token = Symbol("dialog");
    dialogStack.push(token);
    const returnTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lockScroll();

    const initial =
      initialFocusRef?.current ?? panel.querySelector<HTMLElement>("[data-autofocus]") ?? panel;
    initial.focus({ preventScroll: true });

    function onKeyDown(e: KeyboardEvent) {
      if (dialogStack[dialogStack.length - 1] !== token || !panel) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable(panel);
      if (items.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && panel.contains(active);
      if (e.shiftKey && (active === first || active === panel || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const idx = dialogStack.indexOf(token);
      if (idx >= 0) dialogStack.splice(idx, 1);
      unlockScroll();
      if (returnTo && returnTo.isConnected) returnTo.focus({ preventScroll: true });
    };
  }, [open, panelRef, initialFocusRef]);
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  /** Texto descritivo associado via aria-describedby. */
  description?: string;
  /** Elemento que recebe o foco ao abrir. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Fechar ao clicar no fundo (padrão: true). */
  closeOnBackdrop?: boolean;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  description,
  initialFocusRef,
  closeOnBackdrop = true,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  useDialogA11y(open, onClose, panelRef, initialFocusRef);

  if (!open || typeof document === "undefined") return null;

  const maxW = size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : "max-w-lg";

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div
        className="absolute inset-0 bg-[#101828]/50 backdrop-blur-[2px] motion-fade"
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "relative w-full flex flex-col bg-surface border border-line shadow-xl motion-slide-up z-[91]",
          "rounded-t-sheet sm:rounded-card max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-3rem)]",
          "focus:outline-none pb-[env(safe-area-inset-bottom)] sm:pb-0",
          maxW,
          className
        )}
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-line">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-semibold text-fg">
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
            className="-mr-2 -mt-1 w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-control text-fg-subtle hover:bg-canvas hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        </div>
        <div className="px-5 py-4 flex-1 min-h-0 overflow-y-auto overscroll-contain">{children}</div>
        {footer && (
          <div className="px-5 py-4 border-t border-line flex flex-wrap justify-end gap-2">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  );
}
