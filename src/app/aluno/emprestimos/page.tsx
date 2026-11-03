"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Film, Clock, AlertTriangle } from "lucide-react";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { student as api } from "@/lib/api";
import { useAuthUser } from "@/lib/use-auth-user";
import { Poster } from "../_components/Poster";

export default function EmprestimosAlunoPage() {
  const user = useAuthUser();
  const [tab,   setTab]   = useState("ativos");
  const [loans, setLoans] = useState<any[]>([]);

  useEffect(() => { api.loans().then(d => d && setLoans(d)); }, []);

  const active  = loans.filter(l => l.status === "borrowed");
  const history = loans.filter(l => l.status === "returned");
  const late    = loans.filter(l => l.status === "late");

  return (
    <AppShell role="aluno" title="Meus Empréstimos" user={{ name: user?.name ?? "", course: user?.course ?? "" }}>
      {late.length > 0 && (
        <AlertBanner variant="warning" title="Pendência de devolução" className="mb-6">
          Você possui material em atraso. Regularize para novos empréstimos.
        </AlertBanner>
      )}
      <Tabs
        tabs={[{ id: "ativos", label: "Em aberto" }, { id: "historico", label: "Histórico" }]}
        value={tab}
        onChange={setTab}
        className="mb-6"
      />

      {tab === "ativos" && (
        <div className="space-y-4">
          {active.map(l => (
            <div key={l.id} className={`rounded-[4px] border p-5 flex flex-col sm:flex-row gap-4 ${l.status === "late" ? "border-[#FECDCA] bg-[#FEF3F2]" : "border-[#E2E8F0] bg-white"}`}>
              <Poster
                src={l.cover}
                alt={`Cartaz de ${l.film}`}
                className="w-12 h-16"
                iconClassName="w-6 h-6"
                width={96}
                height={128}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#0B1B3F]">{l.film}</p>
                <p className="text-sm text-[#667085]">{l.copy}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-[#667085]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" aria-hidden />
                    Retirada: {l.borrowed_at ? new Date(l.borrowed_at).toLocaleDateString("pt-BR") : "—"}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-[#0B1B3F]">
                    Devolução: {l.due_at ? new Date(l.due_at).toLocaleDateString("pt-BR") : "—"}
                  </span>
                </div>
                {l.status === "late" && (
                  <p className="text-xs text-[#B42318] mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" aria-hidden />
                    Atraso — diárias podem ser aplicadas conforme regulamento.
                  </p>
                )}
              </div>
              <div className="flex flex-col items-stretch sm:items-end gap-2">
                <Badge status={l.status} />
              </div>
            </div>
          ))}
          {active.length === 0 && (
            <div className="py-16 text-center text-[#667085]">
              <Film className="w-10 h-10 mx-auto mb-3 opacity-20" aria-hidden />
              <p className="text-sm">Nenhum empréstimo ativo</p>
            </div>
          )}
        </div>
      )}

      {tab === "historico" && (
        <div className="bg-white rounded-[4px] border border-[#E2E8F0] overflow-hidden">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="bg-[#F2F5FB] border-b border-[#E2E8F0]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Título</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Devolvido</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {history.map(h => (
                <tr key={h.id}>
                  <td className="px-4 py-3 font-medium text-[#0B1B3F]">{h.film}</td>
                  <td className="px-4 py-3 text-[#667085]">{h.returned_at ? new Date(h.returned_at).toLocaleDateString("pt-BR") : "—"}</td>
                  <td className="px-4 py-3"><Badge status="returned" /></td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr><td colSpan={3} className="text-center px-4 py-10 text-[#667085] text-sm">Nenhum histórico</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
