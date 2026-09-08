"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Film, Building2, ClipboardList, ChevronRight, Clock } from "lucide-react";
import { professor as api } from "@/lib/api";
import { getUser } from "@/lib/auth";

const TYPE_LABEL: Record<string, string> = { film: "Filme", room: "Sala" };

export default function ProfessorDashboard() {
  const user = getUser();
  const [stats,    setStats]    = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    api.stats().then(d => d && setStats(d));
    api.requests().then(d => d && setRequests(d.slice(0, 5)));
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "Professor";

  return (
    <AppShell role="professor" title="Área do Professor" user={{ name: user?.name ?? "", course: user?.course ?? "" }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#172033]">Olá, Prof. {firstName}!</h2>
        <p className="text-[#667085] text-sm mt-1">{user?.course ? `Curso de ${user.course}` : ""}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Solicitações Ativas"   value={stats?.active_requests   ?? 0} icon={ClipboardList} accent="blue" />
        <StatCard label="Aprovadas"             value={stats?.approved_requests ?? 0} icon={Building2}     accent="green" />
        <StatCard label="Total de Solicitações" value={stats?.total_requests    ?? 0} icon={Film}          accent="purple" />
      </div>

      <div className="split-layout -mx-4 sm:-mx-6 lg:mx-0">
        <div className="split-main px-4 sm:px-6 lg:px-0 lg:pr-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#172033]">Últimas Solicitações</h3>
            <Link href="/professor/solicitacoes" className="text-xs text-[#0066B3] hover:underline flex items-center gap-1">
              Ver todas <ChevronRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
          </div>

          <div className="bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden">
            {requests.map(r => (
              <div key={r.id} className="list-row">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#172033] text-sm">
                    {TYPE_LABEL[r.request_type] ?? r.request_type} — {r.payload?.film_title ?? r.payload?.room_name ?? ""}
                  </p>
                  <p className="text-xs text-[#667085] mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden />
                    {new Date(r.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Badge status={r.status} />
              </div>
            ))}
            {requests.length === 0 && (
              <div className="py-10 text-center text-[#667085]">
                <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-25" aria-hidden />
                <p className="text-sm">Nenhuma solicitação ainda</p>
              </div>
            )}
          </div>
        </div>

        <aside className="split-panel px-4 sm:px-6 py-6 space-y-4" aria-label="Ações rápidas">
          <p className="section-label">Ações rápidas</p>
          {[
            { label: "Solicitar Filme",  href: "/professor/solicitar-filme", icon: Film },
            { label: "Solicitar Sala",   href: "/professor/solicitar-sala",  icon: Building2 },
            { label: "Minhas Solicitações", href: "/professor/solicitacoes", icon: ClipboardList },
          ].map(({ label, href, icon: Icon }) => (
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
