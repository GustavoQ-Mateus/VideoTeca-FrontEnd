"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Film, BookOpen, Calendar, Star, Bell,
  User, Settings, LogOut, BookMarked, Users,
  Building2, ClipboardList, BarChart2, Package, Inbox,
  Clapperboard, PanelLeftClose, PanelLeftOpen, X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface SidebarProps {
  role: "aluno" | "professor" | "funcionario";
  onNavigate?: () => void;
  user?: { name: string; id?: string };
  /** Modo recolhido (somente ícones) no desktop. */
  collapsed?: boolean;
  /** Quando informado, mostra o botão Recolher/Expandir (desktop). */
  onToggleCollapse?: () => void;
  /** Quando informado (gaveta mobile), mostra o botão Fechar menu. */
  onClose?: () => void;
}

const NAV: Record<string, { section?: string; items: NavItem[] }[]> = {
  aluno: [
    {
      items: [
        { label: "Dashboard",       href: "/aluno",              icon: LayoutDashboard },
        { label: "Catálogo",        href: "/aluno/catalogo",     icon: Film },
        { label: "Minhas Reservas", href: "/aluno/reservas",     icon: BookMarked, badge: 2 },
        { label: "Empréstimos",     href: "/aluno/emprestimos",  icon: BookOpen },
      ],
    },
    {
      section: "Cultura",
      items: [
        { label: "Eventos",         href: "/aluno/eventos",      icon: Calendar },
        { label: "Favoritos",       href: "/aluno/favoritos",    icon: Star },
      ],
    },
    {
      section: "Conta",
      items: [
        { label: "Notificações",    href: "/aluno/notificacoes", icon: Bell, badge: 3 },
        { label: "Perfil",          href: "/aluno/perfil",       icon: User },
      ],
    },
  ],
  professor: [
    {
      items: [
        { label: "Dashboard",       href: "/professor",                 icon: LayoutDashboard },
        { label: "Solicitar Filme", href: "/professor/solicitar-filme", icon: Film },
        { label: "Solicitar Sala",  href: "/professor/solicitar-sala",  icon: Building2 },
        { label: "Solicitações",    href: "/professor/solicitacoes",    icon: ClipboardList, badge: 1 },
        { label: "Histórico",       href: "/professor/historico",       icon: BookOpen },
      ],
    },
    {
      section: "Conta",
      items: [
        { label: "Perfil",          href: "/professor/perfil",          icon: User },
      ],
    },
  ],
  funcionario: [
    {
      items: [
        { label: "Dashboard",    href: "/funcionario",          icon: LayoutDashboard },
      ],
    },
    {
      section: "Acervo & Circulação",
      items: [
        { label: "Equipamentos", href: "/funcionario/equipamentos", icon: Package },
        { label: "Acervo",       href: "/funcionario/acervo",            icon: Package },
        { label: "Empréstimos",  href: "/funcionario/emprestimos",       icon: BookOpen },
        { label: "Devoluções",   href: "/funcionario/devolucoes",        icon: BookMarked },
        { label: "Reservas",     href: "/funcionario/reservas",          icon: Film, badge: 5 },
      ],
    },
    {
      section: "Gestão",
      items: [
        { label: "Solicitações", href: "/funcionario/solicitacoes-professores", icon: Inbox },
        { label: "Usuários",     href: "/funcionario/usuarios",          icon: Users },
        { label: "Salas",        href: "/funcionario/salas",             icon: Building2 },
        { label: "Eventos",      href: "/funcionario/eventos",           icon: Calendar },
      ],
    },
    {
      section: "Sistema",
      items: [
        { label: "Relatórios",   href: "/funcionario/relatorios",        icon: BarChart2 },
        { label: "Configurações",href: "/funcionario/configuracoes",     icon: Settings },
      ],
    },
  ],
};

const ROLE_LABELS = {
  aluno:       "Aluno",
  professor:   "Professor",
  funcionario: "Funcionário",
};

// Anel de foco amarelo: contraste ≥3:1 sobre o azul-marinho.
const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6C343]";

export function Sidebar({ role, onNavigate, user, collapsed = false, onToggleCollapse, onClose }: SidebarProps) {
  const pathname = usePathname();
  const sections = NAV[role];

  function isActive(href: string) {
    const roots = ["/aluno", "/professor", "/funcionario"];
    return roots.includes(href)
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="w-full h-full min-h-screen lg:min-h-0 bg-brand-navy flex flex-col text-white overflow-hidden">

      {/* ── Logo + controles ── */}
      <div
        className={cn(
          "h-14 border-b border-white/10 flex items-center gap-2.5 flex-shrink-0",
          collapsed ? "px-3 justify-center" : "pl-4 pr-2"
        )}
      >
        {!collapsed && (
          <>
            <div className="w-8 h-8 bg-white/12 rounded-[10px] flex items-center justify-center flex-shrink-0">
              <Clapperboard className="w-4 h-4 text-white" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white leading-none">Videoteca</p>
              <p className="text-[11px] text-white/70 mt-0.5 truncate">Unifor · {ROLE_LABELS[role]}</p>
            </div>
          </>
        )}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
            className={cn(
              "hidden lg:flex w-11 h-11 items-center justify-center rounded-[10px] text-white/80 hover:bg-white/10 hover:text-white flex-shrink-0",
              FOCUS_RING
            )}
          >
            {collapsed ? <PanelLeftOpen className="w-5 h-5" aria-hidden /> : <PanelLeftClose className="w-5 h-5" aria-hidden />}
          </button>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className={cn(
              "lg:hidden w-11 h-11 flex items-center justify-center rounded-[10px] text-white/80 hover:bg-white/10 hover:text-white flex-shrink-0",
              FOCUS_RING
            )}
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3" aria-label="Menu principal">
        {sections.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-1" : ""}>
            {group.section &&
              (collapsed ? (
                <hr className="mx-4 my-2 border-white/15" aria-hidden />
              ) : (
                <p className="px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/60" aria-hidden>
                  {group.section}
                </p>
              ))}
            <ul aria-label={group.section}>
              {group.items.map(item => {
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="relative">
                    {active && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r bg-[#F6C343]"
                        aria-hidden
                      />
                    )}
                    <Link
                      href={item.href}
                      onClick={() => onNavigate?.()}
                      aria-current={active ? "page" : undefined}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "relative flex items-center gap-3 mx-2 min-h-11 rounded-[8px] text-sm font-medium transition-colors duration-150 motion-reduce:transition-none",
                        collapsed ? "justify-center" : "px-3",
                        FOCUS_RING,
                        active ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} aria-hidden />
                      <span className={collapsed ? "sr-only" : "flex-1 truncate"}>{item.label}</span>
                      {item.badge && item.badge > 0 ? (
                        <span
                          className={cn(
                            "min-w-4 h-4 px-1 bg-[#C4321C] text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0",
                            collapsed && "absolute top-1.5 right-2.5"
                          )}
                        >
                          <span aria-hidden>{item.badge}</span>
                          <span className="sr-only">
                            , {item.badge} pendente{item.badge > 1 ? "s" : ""}
                          </span>
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── User + Logout ── */}
      <div className="border-t border-white/10 p-2 space-y-0.5 flex-shrink-0">
        {user && !collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1">
            <div
              className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
              aria-hidden
            >
              {user.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white/90 truncate leading-none">
                {user.name.split(" ").slice(0, 2).join(" ")}
              </p>
              {user.id && <p className="text-[11px] text-white/70 mt-0.5">{user.id}</p>}
            </div>
          </div>
        )}
        <Link
          href="/login"
          title={collapsed ? "Sair" : undefined}
          className={cn(
            "flex items-center gap-3 min-h-11 rounded-[8px] text-sm text-white/75 hover:bg-white/10 hover:text-white transition-colors duration-150 motion-reduce:transition-none",
            collapsed ? "justify-center" : "px-3",
            FOCUS_RING
          )}
        >
          <LogOut className={collapsed ? "w-5 h-5" : "w-4 h-4"} aria-hidden />
          <span className={collapsed ? "sr-only" : undefined}>Sair</span>
        </Link>
      </div>
    </aside>
  );
}
