"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { Film } from "lucide-react";
import { professor as api } from "@/lib/api";
import { useAuthUser } from "@/lib/use-auth-user";

type HistoryRow = {
  id: number;
  request_type: string;
  status: string;
  created_at: string;
  payload?: {
    film_title?: string;
    room_name?: string;
    student_count?: number;
    date?: string;
  };
};

export default function ProfessorHistoricoPage() {
  const user = useAuthUser();
  const [rows, setRows] = useState<HistoryRow[]>([]);

  useEffect(() => {
    api.requests().then((d) => d && setRows(d.filter((r: HistoryRow) => r.status === "approved")));
  }, []);

  return (
    <AppShell
      role="professor"
      title="Histórico acadêmico"
      user={{ name: user?.name ?? "", course: user?.course ?? "" }}
    >
      <div className="bg-white rounded-[4px] border border-[#E2E8F0] overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-[#F2F5FB] border-b border-[#E2E8F0]">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Filme / sessão</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Sala</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Data</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Alunos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-medium text-[#0B1B3F]">{r.payload?.film_title ?? "—"}</td>
                <td className="px-4 py-3 text-[#667085]">{r.payload?.room_name ?? "—"}</td>
                <td className="px-4 py-3 text-[#667085]">
                  {new Date(r.payload?.date ?? r.created_at).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-[#667085]">{r.payload?.student_count ?? "—"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-[#667085]">
                  Nenhuma sessão aprovada ainda
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <EmptyState icon={Film} title="Exportar relatório" description="Em breve: exportação PDF para coordenação." />
      </div>
    </AppShell>
  );
}
