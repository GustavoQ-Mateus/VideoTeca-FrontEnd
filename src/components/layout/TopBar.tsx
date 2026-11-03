"use client";
import Link from "next/link";
import type { Ref } from "react";
import { Bell, Menu, Search } from "lucide-react";

interface TopBarProps {
  title: string;
  user?: { name: string; course?: string };
  showSearch?: boolean;
  onMenuClick?: () => void;
  profileHref?: string;
  notificationsHref?: string;
  /** Ref do botão de menu (para devolver o foco ao fechar a gaveta). */
  menuButtonRef?: Ref<HTMLButtonElement>;
  /** Estado da gaveta mobile (aria-expanded). */
  menuExpanded?: boolean;
  /** Id do elemento controlado pelo botão de menu (aria-controls). */
  menuControls?: string;
}

const ICON_BTN =
  "relative w-11 h-11 rounded-[10px] flex items-center justify-center text-fg-subtle hover:bg-canvas hover:text-fg " +
  "transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand flex-shrink-0";

export function TopBar({
  title,
  user,
  showSearch,
  onMenuClick,
  profileHref   = "/aluno/perfil",
  notificationsHref,
  menuButtonRef,
  menuExpanded,
  menuControls,
}: TopBarProps) {
  const initials = user?.name.split(" ").map(n => n[0]).slice(0, 2).join("") ?? "U";

  return (
    <header className="sticky top-0 z-30 h-14 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85 border-b border-line flex items-center px-2 sm:px-6 gap-1 sm:gap-3 flex-shrink-0">

      {/* Mobile menu toggle */}
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onMenuClick}
        className={`lg:hidden ${ICON_BTN}`}
        aria-label="Abrir menu"
        aria-expanded={menuExpanded}
        aria-controls={menuControls}
        aria-haspopup="dialog"
      >
        <Menu className="w-5 h-5" aria-hidden />
      </button>

      {/* Title */}
      <h1 className="text-sm sm:text-base font-semibold text-fg truncate min-w-0 flex-1 md:flex-none">{title}</h1>

      {/* Search */}
      {showSearch && (
        <form role="search" className="hidden md:flex items-center flex-1 max-w-xs ml-2" onSubmit={(e) => e.preventDefault()}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle pointer-events-none" aria-hidden />
            <input
              type="search"
              placeholder="Buscar no catálogo..."
              className="w-full h-10 pl-9 pr-3 text-sm rounded-[10px] border border-line-strong bg-canvas text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/25 focus:bg-surface transition-colors"
              aria-label="Buscar no catálogo"
            />
          </div>
        </form>
      )}

      <div className="ml-auto flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
        {/* Notifications */}
        {notificationsHref ? (
          <Link href={notificationsHref} className={ICON_BTN} aria-label="Notificações (há novas)">
            <Bell className="w-5 h-5" aria-hidden />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#C4321C] rounded-full ring-2 ring-surface" aria-hidden />
          </Link>
        ) : (
          <button type="button" className={ICON_BTN} aria-label="Notificações">
            <Bell className="w-5 h-5" aria-hidden />
          </button>
        )}

        {/* User */}
        {user && (
          <Link
            href={profileHref}
            aria-label={`Meu perfil — ${user.name}`}
            className="flex items-center gap-2 min-h-11 pl-2 sm:pl-3 pr-1 sm:border-l border-line sm:ml-1 rounded-[10px] hover:bg-canvas transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand min-w-0"
          >
            <div
              className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
              aria-hidden
            >
              {initials}
            </div>
            <div className="hidden sm:block text-left min-w-0 max-w-[10rem]" aria-hidden>
              <p className="text-xs font-medium text-fg leading-none truncate">
                {user.name.split(" ")[0]}
              </p>
              {user.course && (
                <p className="text-[11px] text-fg-subtle mt-0.5 truncate">{user.course}</p>
              )}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
