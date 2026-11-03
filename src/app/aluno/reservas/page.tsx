"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { BookMarked, Clock, X } from "lucide-react";
import { student as api } from "@/lib/api";
import { useAuthUser } from "@/lib/use-auth-user";
import { Poster } from "../_components/Poster";

export default function ReservasPage() {
  const user = useAuthUser();
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => { api.reservations().then(d => d && setReservations(d)); }, []);

  const active = reservations.filter(r => r.status === "confirmed" || r.status === "waiting" || r.status === "ready");
  const past   = reservations.filter(r => r.status === "expired"   || r.status === "cancelled");

  async function cancel(id: number) {
    await api.cancelReserve(id);
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "cancelled" } : r));
  }

  return (
    <AppShell role="aluno" title="Minhas Reservas" user={{ name: user?.name ?? "", course: user?.course ?? "" }}>
      <div className="space-y-8">
        <section>
          <h3 className="font-semibold text-[#0B1B3F] mb-4">Reservas Ativas</h3>
          <div className="space-y-3">
            {active.map(r => (
              <div key={r.id} className="bg-white rounded-[4px] border border-[#E2E8F0] p-4 flex gap-4 items-start">
                <Poster
                  src={r.cover}
                  alt={`Cartaz de ${r.film}`}
                  className="w-10 h-14"
                  iconClassName="w-5 h-5"
                  width={80}
                  height={112}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0B1B3F] text-sm">{r.film}</p>
                  <p className="text-xs text-[#667085]">{r.media}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#667085]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden />
                      Solicitado: {r.requested_at ? new Date(r.requested_at).toLocaleDateString("pt-BR") : "—"}
                    </span>
                    {r.pickup_until && (
                      <span className="flex items-center gap-1 text-[#004AF7] font-medium">
                        Retirar até: {new Date(r.pickup_until).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge status={r.status} />
                  {r.status === "waiting" && (
                    <button onClick={() => cancel(r.id)} className="text-xs text-[#B42318] hover:underline flex items-center gap-1">
                      <X className="w-3 h-3" aria-hidden />Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
            {active.length === 0 && (
              <div className="py-10 text-center text-[#667085]">
                <BookMarked className="w-8 h-8 mx-auto mb-2 opacity-25" aria-hidden />
                <p className="text-sm">Nenhuma reserva ativa</p>
              </div>
            )}
          </div>
        </section>

        {past.length > 0 && (
          <section>
            <h3 className="font-semibold text-[#0B1B3F] mb-4">Histórico</h3>
            <div className="space-y-2">
              {past.map(r => (
                <div key={r.id} className="bg-white rounded-[4px] border border-[#E2E8F0] p-4 flex gap-3 items-center opacity-60">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#0B1B3F] text-sm">{r.film}</p>
                    <p className="text-xs text-[#667085]">{r.media}</p>
                  </div>
                  <Badge status={r.status} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
