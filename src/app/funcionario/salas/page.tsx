"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { staff } from "@/lib/api";
import type { RoomRecord } from "@/lib/types";

export default function SalasPage() {
  const [rooms, setRooms] = useState<RoomRecord[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    staff.rooms().then((d) => (d ? setRooms(d) : setError(true))).catch(() => setError(true));
  }, []);

  return (
    <AppShell role="funcionario" title="Gestão de salas">
      <div className="flex justify-end mb-4">
        <Link href="/funcionario/salas/agenda">
          <Button variant="secondary">Abrir agenda</Button>
        </Link>
      </div>
      {error && <p className="text-sm text-[#B42318]">Não foi possível carregar as salas.</p>}
      {!rooms && !error && <p className="text-sm text-[#667085]">Carregando salas…</p>}
      {rooms && rooms.length === 0 && <p className="text-sm text-[#667085]">Nenhuma sala cadastrada.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rooms?.map((r) => (
          <div key={r.id} className="bg-white rounded-[4px] border border-[#E2E8F0] p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-[#0B1B3F]">{r.name}</h3>
              <Badge status={r.status === "maintenance" ? "maintenance" : r.status === "occupied" ? "occupied" : "available"} />
            </div>
            <p className="text-sm text-[#3D4A66]">Capacidade: {r.capacity} pessoas</p>
            {r.equipment?.length > 0 && <p className="text-sm text-[#667085] mt-2">{r.equipment.join(" · ")}</p>}
            <div className="mt-4">
              <Link href="/funcionario/salas/agenda" className="text-sm font-medium text-[#004AF7] hover:underline underline-offset-4">
                Ver ocupação na agenda
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
