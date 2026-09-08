"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Film, BookOpen, Calendar, Star, Bell,
  User, Settings, LogOut, BookMarked, Users,
  Building2, ClipboardList, BarChart2, Package, Inbox,
  Clapperboard,
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

export function Sidebar({ role, onNavigate, user }: SidebarProps) {
  const pathname = usePathname();
  const sections = NAV[role];

  function isActive(href: string) {
    const roots = ["/aluno", "/professor", "/funcionario"];
    return roots.includes(href)
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="w-64 min-h-screen h-full bg-[#003A70] flex flex-col text-white flex-shrink-0">

      {/* ── Logo ── */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-white/12 rounded-[10px] flex items-center justify-center flex-shrink-0">
          <Clapperboard className="w-4 h-4 text-white" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">Videoteca</p>
          <p className="text-[10px] text-white/40 mt-0.5">Unifor · {ROLE_LABELS[role]}</p>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto py-3" aria-label="Menu principal">
        {sections.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-1" : ""}>
            {group.section && (
              <p className="px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30">
                {group.section}
              </p>
            )}
            <ul>
              {group.items.map(item => {
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="relative">
                    {active && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-[#F6C343]"
                        aria-hidden
                      />
                    )}
                    <Link
                      href={item.href}
                      onClick={() => onNavigate?.()}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 mx-2 px-3 py-2 rounded-[8px] text-sm font-medium transition-colors duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                        active
                          ? "bg-white/15 text-white"
                          : "text-white/55 hover:bg-white/8 hover:text-white"
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" aria-hidden />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && item.badge > 0 ? (
                        <span className="w-4 h-4 bg-[#E7472E] text-white text-[9px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                          {item.badge}
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
      <div className="border-t border-white/10 p-3 space-y-0.5">
        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1">
            <div className="w-7 h-7 rounded-full bg-[#0066B3] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
              {user.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white/85 truncate leading-none">
                {user.name.split(" ").slice(0, 2).join(" ")}
              </p>
              {user.id && (
                <p className="text-[10px] text-white/35 mt-0.5">{user.id}</p>
              )}
            </div>
          </div>
        )}
        <Link
          href="/login"
          className="flex items-center gap-3 mx-0 px-3 py-2 rounded-[8px] text-sm text-white/45 hover:bg-white/8 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <LogOut className="w-4 h-4" aria-hidden />
          Sair
        </Link>
      </div>
    </aside>
  );
}
