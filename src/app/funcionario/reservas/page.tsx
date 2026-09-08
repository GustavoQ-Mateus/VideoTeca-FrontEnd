"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import { staff as api } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function ReservasStaffPage() {
  const user = getUser();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => { api.reservations().then(d => d && setReservations(d)); }, []);

  async function confirm(id: number) {
    await api.confirmReservation(id);
    toast({ title: "Reserva confirmada", variant: "success" });
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "confirmed" } : r));
  }

  return (
    <AppShell role="funcionario" title="Reservas" user={{ name: user?.name ?? "", course: "Funcionário" }}>
      <div className="bg-white rounded-[18px] border border-[#E2E8F0] overflow-hidden">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Aluno</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Matrícula</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Filme</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Solicitado</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {reservations.map(r => (
              <tr key={r.id} className="hover:bg-[#F5F7FA]">
                <td className="px-4 py-3 font-medium text-[#172033]">{r.user_name}</td>
                <td className="px-4 py-3 text-[#667085]">{r.registration}</td>
                <td className="px-4 py-3 text-[#667085]">{r.film}</td>
                <td className="px-4 py-3 text-[#667085]">{r.requested_at ? new Date(r.requested_at).toLocaleDateString("pt-BR") : "—"}</td>
                <td className="px-4 py-3"><Badge status={r.status} /></td>
                <td className="px-4 py-3">
                  {r.status === "waiting" && (
                    <Button size="sm" variant="secondary" onClick={() => confirm(r.id)}>Confirmar</Button>
                  )}
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr><td colSpan={6} className="text-center px-4 py-10 text-[#667085] text-sm">Nenhuma reserva</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
