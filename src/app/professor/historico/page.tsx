import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { Film } from "lucide-react";

const PROFESSOR = { name: "Carlos Melo", course: "Jornalismo" };

const ROWS = [
  { film: "Central do Brasil", room: "Sala de Exibição 1", date: "2026-04-12", students: 42 },
  { film: "Ilha das Flores", room: "Videoteca A", date: "2026-03-28", students: 18 },
];

export default function ProfessorHistoricoPage() {
  return (
    <AppShell role="professor" title="Histórico acadêmico" user={PROFESSOR}>
      <div className="bg-white rounded-[18px] border border-[#E2E8F0] overflow-hidden">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Filme / sessão</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Sala</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Data</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Alunos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {ROWS.map((r, i) => (
              <tr key={i}>
                <td className="px-4 py-3 font-medium text-[#172033]">{r.film}</td>
                <td className="px-4 py-3 text-[#667085]">{r.room}</td>
                <td className="px-4 py-3 text-[#667085]">{new Date(r.date).toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-3 text-[#667085]">{r.students}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <EmptyState icon={Film} title="Exportar relatório" description="Em breve: exportação PDF para coordenação." />
      </div>
    </AppShell>
  );
}
