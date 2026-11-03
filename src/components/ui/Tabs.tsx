"use client";
import { KeyboardEvent, useId, useRef } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  /** Rótulo acessível do conjunto de abas. */
  ariaLabel?: string;
  /** Prefixo dos ids; use o mesmo em <TabPanel idPrefix>. Padrão: gerado. */
  idPrefix?: string;
  /** Se true, cada aba aponta (aria-controls) para o TabPanel correspondente. */
  withPanels?: boolean;
}

export const tabId = (prefix: string, id: string) => `${prefix}-tab-${id}`;
export const tabPanelId = (prefix: string, id: string) => `${prefix}-panel-${id}`;

/**
 * Abas WAI-ARIA: foco itinerante (roving tabindex), setas ←/→, Home/End.
 * Ativação automática (a seta já seleciona a aba).
 */
export function Tabs({ tabs, value, onChange, className, ariaLabel, idPrefix, withPanels }: TabsProps) {
  const autoId = useId();
  const prefix = idPrefix ?? autoId;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const enabled = tabs.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0);
    if (enabled.length === 0) return;
    const current = tabs.findIndex((t) => t.id === value);
    const pos = Math.max(0, enabled.indexOf(current));
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = enabled[(pos + 1) % enabled.length];
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = enabled[(pos - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") next = enabled[0];
    else if (e.key === "End") next = enabled[enabled.length - 1];
    if (next === null) return;
    e.preventDefault();
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn("flex gap-1 p-1 bg-canvas rounded-[12px] w-fit max-w-full flex-wrap", className)}
    >
      {tabs.map((t, i) => {
        const selected = value === t.id;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={tabId(prefix, t.id)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={withPanels ? tabPanelId(prefix, t.id) : undefined}
            tabIndex={selected ? 0 : -1}
            disabled={t.disabled}
            onClick={() => onChange(t.id)}
            className={cn(
              "min-h-10 px-4 py-2 rounded-control text-sm font-medium transition-colors duration-200 motion-reduce:transition-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50 disabled:cursor-not-allowed",
              selected ? "bg-surface text-brand shadow-sm" : "text-fg-subtle hover:text-fg"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/** Painel associado a uma aba (use com `<Tabs withPanels idPrefix=...>`). */
export function TabPanel({
  idPrefix,
  tab,
  children,
  className,
}: {
  idPrefix: string;
  tab: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="tabpanel"
      id={tabPanelId(idPrefix, tab)}
      aria-labelledby={tabId(idPrefix, tab)}
      tabIndex={0}
      className={cn("focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-control", className)}
    >
      {children}
    </div>
  );
}
