"use client";
import Link from "next/link";
import { Bell, Menu, Search, ChevronRight } from "lucide-react";

interface TopBarProps {
  title: string;
  user?: { name: string; course?: string };
  showSearch?: boolean;
  onMenuClick?: () => void;
  profileHref?: string;
  notificationsHref?: string;
}

export function TopBar({
  title,
  user,
  showSearch,
  onMenuClick,
  profileHref   = "/aluno/perfil",
  notificationsHref,
}: TopBarProps) {
  const initials = user?.name.split(" ").map(n => n[0]).slice(0, 2).join("") ?? "U";

  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center px-4 sm:px-6 gap-3 flex-shrink-0">

      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 rounded-[8px] text-[#667085] hover:bg-[#F5F7FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066B3] transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <h1 className="text-sm font-semibold text-[#172033] truncate">{title}</h1>

      {/* Breadcrumb chevron (visual) */}
      <ChevronRight className="w-3.5 h-3.5 text-[#E2E8F0] hidden sm:block flex-shrink-0" aria-hidden />

      {/* Search */}
      {showSearch && (
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs ml-1">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#98A2B3]" aria-hidden />
            <input
              type="search"
              placeholder="Buscar no catálogo..."
              className="w-full h-8 pl-8 pr-3 text-xs rounded-[8px] border border-[#E2E8F0] bg-[#F5F7FA] text-[#172033] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0066B3] focus:bg-white transition-colors"
              aria-label="Buscar"
            />
          </div>
        </div>
      )}

      <div className="ml-auto flex items-center gap-1">
        {/* Notifications */}
        {notificationsHref ? (
          <Link
            href={notificationsHref}
            className="relative w-8 h-8 rounded-[8px] flex items-center justify-center text-[#667085] hover:bg-[#F5F7FA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066B3]"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#E7472E] rounded-full" aria-hidden />
          </Link>
        ) : (
          <button
            type="button"
            className="relative w-8 h-8 rounded-[8px] flex items-center justify-center text-[#667085] hover:bg-[#F5F7FA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066B3]"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4" />
          </button>
        )}

        {/* User */}
        {user && (
          <Link
            href={profileHref}
            className="flex items-center gap-2 pl-3 border-l border-[#E2E8F0] ml-1 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:opacity-80 min-w-0"
          >
            <div className="w-7 h-7 rounded-full bg-[#0066B3] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <p className="text-xs font-medium text-[#172033] leading-none truncate">
                {user.name.split(" ")[0]}
              </p>
              {user.course && (
                <p className="text-[10px] text-[#667085] mt-0.5 truncate">{user.course}</p>
              )}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
