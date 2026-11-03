"use client";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileBottomNav } from "./MobileBottomNav";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";

interface AppShellProps {
  role: "aluno" | "professor" | "funcionario";
  title: string;
  showSearch?: boolean;
  user?: { name: string; course?: string };
  children: React.ReactNode;
  /** Trilha exibida no topo do conteúdo. */
  breadcrumbs?: Crumb[];
  /** Classe extra para o <main>. */
  mainClassName?: string;
}

/* ── Preferências externas (sem setState em efeito) ─────────────── */

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeDesktop(cb: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getDesktop = () => window.matchMedia(DESKTOP_QUERY).matches;
const getDesktopServer = () => false;

const COLLAPSE_KEY = "vt:sidebar-collapsed";
const COLLAPSE_EVENT = "vt:sidebar-collapsed-change";

function subscribeCollapsed(cb: () => void) {
  window.addEventListener(COLLAPSE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(COLLAPSE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
function getCollapsed() {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}
const getCollapsedServer = () => false;

function setCollapsedPref(value: boolean) {
  try {
    window.localStorage.setItem(COLLAPSE_KEY, value ? "1" : "0");
  } catch {
    /* armazenamento indisponível: preferência só vale na sessão */
  }
  window.dispatchEvent(new Event(COLLAPSE_EVENT));
}

/**
 * Casca das áreas autenticadas.
 * - Desktop (≥1024px): sidebar fixa, recolhível (preferência salva no navegador).
 * - Mobile/tablet (<1024px): sidebar vira gaveta modal (foco preso, Esc fecha)
 *   + barra inferior com atalhos (alvos ≥44px).
 * - `<main id="main-content">` é o alvo do link "Pular para o conteúdo".
 */
export function AppShell({ role, title, showSearch, user, children, breadcrumbs, mainClassName }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useSyncExternalStore(subscribeDesktop, getDesktop, getDesktopServer);
  const collapsed = useSyncExternalStore(subscribeCollapsed, getCollapsed, getCollapsedServer);
  const pathname = usePathname();
  const sidebarId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const drawerOpen = mobileOpen && !isDesktop;

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  // Fecha a gaveta ao trocar de rota (ex.: navegação pelo histórico).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  const onDrawerClose = useCallback(() => {
    setMobileOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  // Gaveta mobile: foco inicial, Tab preso, Esc fecha, devolve foco, trava rolagem.
  useEffect(() => {
    if (!drawerOpen) return;
    const panel = drawerRef.current;
    if (!panel) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panel.querySelector<HTMLElement>("a[href], button:not([disabled])");
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (!panel) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onDrawerClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")).filter(
        (el) => el.getClientRects().length > 0
      );
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [drawerOpen, onDrawerClose]);

  const desktopCollapsed = isDesktop && collapsed;

  return (
    <div className="flex min-h-screen bg-canvas">
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#101828]/50 backdrop-blur-[1px] lg:hidden motion-fade"
          aria-hidden="true"
          onClick={closeMobile}
        />
      )}
      <div
        ref={drawerRef}
        id={sidebarId}
        role={drawerOpen ? "dialog" : undefined}
        aria-modal={drawerOpen ? true : undefined}
        aria-label={drawerOpen ? "Menu" : undefined}
        // Fora da tela no mobile: inerte para não receber foco nem leitura.
        inert={!isDesktop && !mobileOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex-shrink-0 w-[min(16rem,85vw)]",
          "transition-[transform,width] duration-200 ease-out motion-reduce:transition-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          desktopCollapsed ? "lg:w-[72px]" : "lg:w-64"
        )}
      >
        <Sidebar
          role={role}
          onNavigate={closeMobile}
          collapsed={desktopCollapsed}
          onToggleCollapse={isDesktop ? () => setCollapsedPref(!collapsed) : undefined}
          onClose={drawerOpen ? onDrawerClose : undefined}
        />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={title}
          user={user}
          showSearch={showSearch}
          onMenuClick={() => setMobileOpen(true)}
          menuButtonRef={menuButtonRef}
          menuExpanded={drawerOpen}
          menuControls={sidebarId}
          profileHref={
            role === "aluno" ? "/aluno/perfil" : role === "professor" ? "/professor/perfil" : "/funcionario/configuracoes"
          }
          notificationsHref={role === "aluno" ? "/aluno/notificacoes" : undefined}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className={cn(
            "flex-1 min-w-0 p-4 sm:p-6 overflow-x-hidden focus:outline-none",
            "pb-[calc(var(--bottom-nav-h)+1.5rem+env(safe-area-inset-bottom))] lg:pb-6",
            mainClassName
          )}
        >
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="mb-4">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}
          {children}
        </main>
        <MobileBottomNav role={role} />
      </div>
    </div>
  );
}
