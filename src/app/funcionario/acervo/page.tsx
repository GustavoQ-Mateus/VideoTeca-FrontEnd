"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search, Film } from "lucide-react";
import { staff as api } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function AcervoPage() {
  const user = getUser();
  const [films,  setFilms]  = useState<any[]>([]);
  const [query,  setQuery]  = useState("");

  useEffect(() => { api.inventory().then(d => d && setFilms(d)); }, []);

  const filtered = films.filter(f =>
    !query || f.title.toLowerCase().includes(query.toLowerCase()) ||
    (f.director ?? "").toLowerCase().includes(query.toLowerCase())
  );

  const total      = films.length;
  const available  = films.reduce((acc, f) => acc + Number(f.available_copies ?? 0), 0);
  const borrowed   = films.reduce((acc, f) => acc + (Number(f.total_copies ?? 0) - Number(f.available_copies ?? 0)), 0);

  return (
    <AppShell role="funcionario" title="Gestão do Acervo" user={{ name: user?.name ?? "", course: "Funcionário" }}>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: total },
          { label: "Disponíveis", value: available },
          { label: "Emprestados", value: borrowed },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-[14px] border border-[#E2E8F0] p-4 text-center">
            <p className="text-2xl font-bold text-[#172033]">{value}</p>
            <p className="text-xs text-[#667085] mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por título ou diretor…"
            className="w-full h-10 pl-9 pr-4 border border-[#E2E8F0] rounded-[10px] text-sm bg-white focus:outline-none focus:border-[#0066B3]"
          />
        </div>
      </div>

      <div className="bg-white rounded-[18px] border border-[#E2E8F0] overflow-hidden">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Título</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Diretor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Mídia</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Cópias</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map(f => (
              <tr key={f.id} className="hover:bg-[#F5F7FA] transition-colors">
                <td className="px-4 py-3 font-medium text-[#172033]">{f.title}</td>
                <td className="px-4 py-3 text-[#667085]">{f.director ?? "—"}</td>
                <td className="px-4 py-3 text-[#667085]">{f.media ?? "—"}</td>
                <td className="px-4 py-3 text-[#667085]">{f.available_copies}/{f.total_copies}</td>
                <td className="px-4 py-3"><Badge status={f.status} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center px-4 py-12 text-[#667085] text-sm">
                <Film className="w-8 h-8 mx-auto mb-2 opacity-20" aria-hidden />
                {query ? "Nenhum resultado" : "Carregando acervo..."}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
