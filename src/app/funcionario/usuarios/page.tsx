"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Search } from "lucide-react";
import { staff as api } from "@/lib/api";
import { getUser } from "@/lib/auth";

const ROLE_LABEL: Record<string, string> = { aluno: "Aluno", professor: "Professor", funcionario: "Funcionário", admin: "Admin" };

export default function UsuariosPage() {
  const user = getUser();
  const [users, setUsers]   = useState<any[]>([]);
  const [query, setQuery]   = useState("");

  useEffect(() => { api.users().then(d => d && setUsers(d)); }, []);

  const filtered = users.filter(u =>
    !query || (u.full_name ?? "").toLowerCase().includes(query.toLowerCase()) ||
    (u.registration ?? "").includes(query) ||
    (u.email ?? "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell role="funcionario" title="Usuários" user={{ name: user?.name ?? "", course: "Funcionário" }}>
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por nome, matrícula ou email…"
          className="w-full h-10 pl-9 pr-4 border border-[#E2E8F0] rounded-[10px] text-sm bg-white focus:outline-none focus:border-[#0066B3]"
        />
      </div>

      <div className="bg-white rounded-[18px] border border-[#E2E8F0] overflow-hidden">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Nome</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Matrícula</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Perfil</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Curso</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Empréstimos ativos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-[#F5F7FA]">
                <td className="px-4 py-3 font-medium text-[#172033]">{u.full_name}</td>
                <td className="px-4 py-3 text-[#667085]">{u.registration ?? "—"}</td>
                <td className="px-4 py-3 text-[#667085]">{ROLE_LABEL[u.role] ?? u.role}</td>
                <td className="px-4 py-3 text-[#667085]">{u.course ?? "—"}</td>
                <td className="px-4 py-3 text-[#667085]">{u.active_loans}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center px-4 py-10 text-[#667085] text-sm">Nenhum usuário encontrado</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
