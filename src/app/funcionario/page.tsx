"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { staff as api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import {
  Package, BookOpen, BookMarked, AlertTriangle,
  Building2, Calendar, Users, Clock, Film, ChevronRight,
} from "lucide-react";

export default function AdminDashboard() {
  const user = getUser();
  const [stats,    setStats]    = useState<any>(null);
  const [loans,    setLoans]    = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    api.stats().then(d => d && setStats(d));
    api.loans().then(d => d && setLoans(d?.slice(0, 5) ?? []));
    api.requests().then(d => d && setRequests(d?.filter((r: any) => r.status === "analysis").slice(0, 3) ?? []));
  }, []);

  return (
    <AppShell role="funcionario" title="Dashboard Administrativo" user={{ name: user?.name ?? "", course: "Funcionário" }}>

      {stats?.late_items > 0 && (
        <div className="bg-[#E7472E]/10 border border-[#E7472E]/30 rounded-[14px] p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#E7472E] flex-shrink-0" aria-hidden />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#E7472E]">Atenção: {stats.late_items} itens com devolução atrasada</p>
            <p className="text-xs text-[#E7472E]/70 mt-0.5">Verifique os empréstimos vencidos e entre em contato com os usuários.</p>
          </div>
          <Link href="/funcionario/emprestimos">
            <Button size="sm" variant="danger" className="flex-shrink-0 text-xs">Ver atrasos</Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total do Acervo"       value={(stats?.total_films ?? 0).toLocaleString()} icon={Package}    accent="blue" />
        <StatCard label="Empréstimos Ativos"    value={stats?.active_loans          ?? 0}           icon={BookOpen}   accent="green" />
        <StatCard label="Reservas Pendentes"    value={stats?.pending_reservations  ?? 0}           icon={BookMarked} accent="yellow" />
        <StatCard label="Itens em Atraso"       value={stats?.late_items            ?? 0}           icon={AlertTriangle} accent="red" />
        <StatCard label="Solicitações Pendentes" value={stats?.pending_requests     ?? 0}           icon={Users}      accent="purple" />
        <StatCard label="Próximos Eventos"      value={stats?.upcoming_events       ?? 0}           icon={Calendar}   accent="blue" />
      </div>

      <div className="split-layout -mx-4 sm:-mx-6 lg:mx-0">
        <div className="split-main px-4 sm:px-6 lg:px-0 lg:pr-6 pb-6 space-y-6">

          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#172033]">Últimos Empréstimos</h3>
              <Link href="/funcionario/emprestimos" className="text-xs text-[#0066B3] hover:underline flex items-center gap-1">
                Ver todos <ChevronRight className="w-3.5 h-3.5" aria-hidden />
              </Link>
            </div>
            <div className="bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden">
              {loans.map(l => (
                <div key={l.id} className="list-row">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#172033] text-sm">{l.film}</p>
                    <p className="text-xs text-[#667085] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" aria-hidden />{l.user_name} · {l.registration}
                    </p>
                  </div>
                  <Badge status={l.status} />
                </div>
              ))}
              {loans.length === 0 && (
                <div className="py-8 text-center text-[#667085] text-sm">Nenhum empréstimo</div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#172033]">Solicitações de Professores</h3>
              <Link href="/funcionario/solicitacoes" className="text-xs text-[#0066B3] hover:underline flex items-center gap-1">
                Ver todas <ChevronRight className="w-3.5 h-3.5" aria-hidden />
              </Link>
            </div>
            <div className="bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden">
              {requests.map(r => (
                <div key={r.id} className="list-row">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#172033] text-sm">{r.professor_name}</p>
                    <p className="text-xs text-[#667085] mt-0.5">
                      {r.request_type === "film" ? "Filme" : "Sala"} — {r.payload?.film_title ?? r.payload?.room_name ?? ""}
                    </p>
                  </div>
                  <Badge status={r.status} />
                </div>
              ))}
              {requests.length === 0 && (
                <div className="py-8 text-center text-[#667085] text-sm">Nenhuma solicitação pendente</div>
              )}
            </div>
          </section>
        </div>

        <aside className="split-panel px-4 sm:px-6 py-6 space-y-4" aria-label="Acesso rápido">
          <p className="section-label">Acesso rápido</p>
          {[
            { icon: BookOpen,   label: "Registrar Empréstimo", href: "/funcionario/emprestimos" },
            { icon: BookMarked, label: "Reservas",             href: "/funcionario/reservas" },
            { icon: Package,    label: "Acervo",               href: "/funcionario/acervo" },
            { icon: Users,      label: "Usuários",             href: "/funcionario/usuarios" },
            { icon: Calendar,   label: "Eventos",              href: "/funcionario/eventos" },
            { icon: Building2,  label: "Salas",                href: "/funcionario/salas" },
          ].map(({ icon: Icon, label, href }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-3 rounded-[10px] border border-[#E2E8F0] bg-white hover:border-[#0066B3]/40 transition-colors group">
              <Icon className="w-4 h-4 text-[#667085] group-hover:text-[#0066B3] transition-colors" aria-hidden />
              <span className="text-sm text-[#172033]">{label}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#98A2B3]" aria-hidden />
            </Link>
          ))}
        </aside>
      </div>
    </AppShell>
  );
}
