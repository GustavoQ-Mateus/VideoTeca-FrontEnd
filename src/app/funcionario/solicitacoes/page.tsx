"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import { staff as api } from "@/lib/api";
import { getUser } from "@/lib/auth";

const TYPE_LABEL: Record<string, string> = { film: "Filme", room: "Sala" };

export default function SolicitacoesStaffPage() {
  const user = getUser();
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => { api.requests().then(d => d && setRequests(d)); }, []);

  async function updateStatus(id: number, status: string) {
    await api.updateRequest(id, { status });
    toast({ title: `Solicitação ${status === "approved" ? "aprovada" : "recusada"}`, variant: status === "approved" ? "success" : "error" });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  return (
    <AppShell role="funcionario" title="Solicitações de Professores" user={{ name: user?.name ?? "", course: "Funcionário" }}>
      <div className="bg-white rounded-[18px] border border-[#E2E8F0] overflow-hidden">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Professor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Tipo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Item</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Data</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {requests.map(r => (
              <tr key={r.id} className="hover:bg-[#F5F7FA]">
                <td className="px-4 py-3 font-medium text-[#172033]">{r.professor_name}</td>
                <td className="px-4 py-3 text-[#667085]">{TYPE_LABEL[r.request_type] ?? r.request_type}</td>
                <td className="px-4 py-3 text-[#667085]">{r.payload?.film_title ?? r.payload?.room_name ?? "—"}</td>
                <td className="px-4 py-3 text-[#667085]">{new Date(r.created_at).toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-3"><Badge status={r.status} /></td>
                <td className="px-4 py-3">
                  {r.status === "analysis" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => updateStatus(r.id, "approved")}>Aprovar</Button>
                      <Button size="sm" variant="danger" onClick={() => updateStatus(r.id, "refused")}>Recusar</Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan={6} className="text-center px-4 py-10 text-[#667085] text-sm">Nenhuma solicitação</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
