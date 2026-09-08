"use client";
import { AppShell } from "@/components/layout/AppShell";
import type { RoomRecord } from "@/lib/types";

const ROOMS: RoomRecord[] = [];
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const STAFF = { name: "Carla Nogueira", course: "Funcionária" };

export default function SalasPage() {
  return (
    <AppShell role="funcionario" title="Gestão de salas" user={STAFF}>
      <div className="flex justify-end mb-4">
        <Link href="/funcionario/salas/agenda">
          <Button variant="secondary">Abrir agenda</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROOMS.map((r) => (
          <div key={r.id} className="bg-white rounded-[18px] border border-[#E2E8F0] p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-[#172033]">{r.name}</h3>
              <Badge status={r.status === "maintenance" ? "maintenance" : r.status === "occupied" ? "occupied" : "available"} />
            </div>
            <p className="text-sm text-[#667085]">Capacidade: {r.capacity}</p>
            <p className="text-xs text-[#667085] mt-2">{r.equipment.join(" · ")}</p>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline">
                Editar
              </Button>
              <Button size="sm" variant="ghost">
                Bloquear horário
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
