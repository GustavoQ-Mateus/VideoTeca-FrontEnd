"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Film, BookMarked, User,
  Package, BookOpen, Building2, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE: Record<"aluno" | "professor" | "funcionario", { href: string; label: string; icon: React.ElementType }[]> = {
  aluno: [
    { href: "/aluno",           label: "Início",   icon: LayoutDashboard },
    { href: "/aluno/catalogo",  label: "Catálogo", icon: Film },
    { href: "/aluno/reservas",  label: "Reservas", icon: BookMarked },
    { href: "/aluno/perfil",    label: "Perfil",   icon: User },
  ],
  professor: [
    { href: "/professor",                  label: "Início", icon: LayoutDashboard },
    { href: "/professor/solicitar-filme",  label: "Filme",  icon: Film },
    { href: "/professor/solicitar-sala",   label: "Sala",   icon: Building2 },
    { href: "/professor/perfil",           label: "Perfil", icon: User },
  ],
  funcionario: [
    { href: "/funcionario",               label: "Início",   icon: LayoutDashboard },
    { href: "/funcionario/acervo",        label: "Acervo",   icon: Package },
    { href: "/funcionario/emprestimos",   label: "Emprést.", icon: BookOpen },
    { href: "/funcionario/configuracoes", label: "Config.",  icon: Settings },
  ],
};

// Nome completo para leitores de tela quando o rótulo visual é abreviado.
const FULL_LABEL: Record<string, string> = {
  "Emprést.": "Empréstimos",
  "Config.": "Configurações",
};

const ROOTS = ["/aluno", "/professor", "/funcionario"];

/** Atalhos inferiores (<1024px). Alvos de toque ≥ 56×44px, respeita safe-area. */
export function MobileBottomNav({ role }: { role: "aluno" | "professor" | "funcionario" }) {
  const pathname = usePathname();
  const items = MOBILE[role];

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-surface border-t border-line px-1 pb-[env(safe-area-inset-bottom)]"
      aria-label="Atalhos"
      style={{ boxShadow: "0 -4px 16px rgba(23,32,51,0.06)" }}
    >
      <ul className="flex justify-around">
        {items.map(item => {
          // Raiz da área só fica ativa na própria página (não em todas as subpáginas).
          const active = ROOTS.includes(item.href)
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const full = FULL_LABEL[item.label];
          return (
            <li key={item.href} className="flex-1 min-w-0 max-w-[6rem]">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-label={full}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 h-16 px-1 rounded-[10px] transition-colors duration-150 motion-reduce:transition-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand",
                  active ? "text-brand" : "text-fg-subtle hover:text-fg"
                )}
              >
                {active && (
                  <span className="absolute top-0 w-8 h-0.5 bg-brand rounded-full" aria-hidden />
                )}
                <item.icon
                  className={cn("w-5 h-5 flex-shrink-0 transition-transform duration-150 motion-reduce:transition-none", active && "scale-110")}
                  aria-hidden
                />
                <span className={cn("text-[11px] truncate w-full text-center leading-none", active ? "font-semibold" : "font-medium")}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
