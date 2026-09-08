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
    { href: "/funcionario",             label: "Início",   icon: LayoutDashboard },
    { href: "/funcionario/acervo",      label: "Acervo",   icon: Package },
    { href: "/funcionario/emprestimos", label: "Emprést.", icon: BookOpen },
    { href: "/funcionario/configuracoes", label: "Config.", icon: Settings },
  ],
};

export function MobileBottomNav({ role }: { role: "aluno" | "professor" | "funcionario" }) {
  const pathname = usePathname();
  const items = MOBILE[role];

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#E2E8F0] flex justify-around px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      aria-label="Navegação principal"
      style={{ boxShadow: "0 -4px 16px rgba(23,32,51,0.06)" }}
    >
      {items.map(item => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-[10px] flex-1 max-w-[5rem] min-w-0 transition-colors duration-150",
              active ? "text-[#0066B3]" : "text-[#98A2B3] hover:text-[#667085]"
            )}
          >
            <item.icon
              className={cn("w-5 h-5 flex-shrink-0 transition-transform duration-150", active && "scale-110")}
              aria-hidden
            />
            <span className="text-[9px] font-medium truncate w-full text-center leading-none">
              {item.label}
            </span>
            {active && (
              <span className="absolute bottom-0 w-4 h-0.5 bg-[#0066B3] rounded-full" aria-hidden />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
