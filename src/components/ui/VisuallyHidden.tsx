"use client";
import type { ElementType, HTMLAttributes, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Torna o conteúdo visível quando recebe foco (ex.: links de atalho). */
  focusable?: boolean;
}

/** Conteúdo disponível apenas para leitores de tela. */
export function VisuallyHidden({ as: Tag = "span", focusable = false, className, ...props }: VisuallyHiddenProps) {
  return <Tag className={cn(focusable ? "sr-only focus:not-sr-only" : "sr-only", className)} {...props} />;
}

const MAIN_TARGET_ID = "main-content";

/**
 * Link "Pular para o conteúdo" (WCAG 2.4.1). Aponta para `#main-content`
 * (o `<main>` do AppShell); em páginas sem esse id, faz fallback para o
 * primeiro `<main>` ou `<h1>` e move o foco para ele.
 */
export function SkipLink({ targetId = MAIN_TARGET_ID, children = "Pular para o conteúdo" }: { targetId?: string; children?: React.ReactNode }) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    const target =
      document.getElementById(targetId) ??
      document.querySelector<HTMLElement>("main") ??
      document.querySelector<HTMLElement>("h1");
    if (!target) return;
    e.preventDefault();
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus();
    target.scrollIntoView({ block: "start" });
  }

  return (
    <a href={`#${targetId}`} className="skip-link" onClick={onClick}>
      {children}
    </a>
  );
}
