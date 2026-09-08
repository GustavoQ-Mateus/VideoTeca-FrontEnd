"use client";
import { AppShell } from "@/components/layout/AppShell";
import type { RoomRecord } from "@/lib/types";

const ROOMS: RoomRecord[] = [];
import { Button } from "@/components/ui/Button";

const STAFF = { name: "Carla Nogueira", course: "Funcionária" };
const HOURS = ["08:00", "10:00", "14:00", "16:00", "19:00"];

export default function AgendaSalasPage() {
  return (
    <AppShell role="funcionario" title="Agenda de salas" user={STAFF}>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button size="sm" variant="secondary">
          Dia
        </Button>
        <Button size="sm" variant="ghost">
          Semana
        </Button>
        <Button size="sm" variant="ghost">
          Mês
        </Button>
        <Button className="ml-auto">Nova reserva</Button>
      </div>
      <div className="bg-white rounded-[18px] border border-[#E2E8F0] overflow-x-auto">
        <table className="w-full min-w-[720px] text-xs">
          <thead>
            <tr className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
              <th className="px-3 py-2 text-left text-[#667085] font-semibold w-20">Hora</th>
              {ROOMS.map((r) => (
                <th key={r.id} className="px-2 py-2 text-left text-[#667085] font-semibold min-w-[100px]">
                  {r.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((h) => (
              <tr key={h} className="border-b border-[#E2E8F0]">
                <td className="px-3 py-3 font-medium text-[#172033] whitespace-nowrap">{h}</td>
                {ROOMS.map((r) => (
                  <td key={r.id} className="px-2 py-2 align-top">
                    {h === "14:00" && r.id === 1 ? (
                      <div className="rounded-[8px] bg-[#0066B3] text-white px-2 py-1.5 text-[10px] leading-tight">Mostra — Videoteca</div>
                    ) : (
                      <span className="text-[#E2E8F0]">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
