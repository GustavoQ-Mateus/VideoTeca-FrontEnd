"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { staff as api } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function FuncionarioEventosPage() {
  const user = getUser();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => { api.events().then(d => d && setEvents(d)); }, []);

  return (
    <AppShell role="funcionario" title="Gestão de eventos" user={{ name: user?.name ?? "", course: "Funcionário" }}>
      <div className="bg-white rounded-[18px] border border-[#E2E8F0] overflow-hidden">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Evento</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Tipo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Data</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Vagas</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {events.map(e => (
              <tr key={e.id} className="hover:bg-[#F5F7FA]">
                <td className="px-4 py-3 font-medium text-[#172033]">{e.title}</td>
                <td className="px-4 py-3 text-[#667085]">{e.event_type ?? "—"}</td>
                <td className="px-4 py-3 text-[#667085]">{e.starts_at ? new Date(e.starts_at).toLocaleDateString("pt-BR") : "—"}</td>
                <td className="px-4 py-3 text-[#667085]">{e.enrolled}/{e.slots}</td>
                <td className="px-4 py-3"><Badge status={e.status} /></td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr><td colSpan={5} className="text-center px-4 py-10 text-[#667085] text-sm">Nenhum evento cadastrado</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
