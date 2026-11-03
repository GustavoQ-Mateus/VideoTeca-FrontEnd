"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { staff } from "@/lib/api";
import type { RoomRecord } from "@/lib/types";

type Booking = { id: number; room_id: number; title: string; starts_at: string; ends_at: string; status: string; kind: "booking" | "session"; professor_name?: string | null };

const TZ = "America/Fortaleza";
const HOURS = Array.from({ length: 15 }, (_, i) => 8 + i); // 08h às 22h
const pad = (n: number) => String(n).padStart(2, "0");
const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const localHour = (iso: string) => Number(new Date(iso).toLocaleString("en-US", { timeZone: TZ, hour: "numeric", hour12: false }));
const time = (iso: string) => new Date(iso).toLocaleTimeString("pt-BR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });

export default function AgendaSalasPage() {
  const [day, setDay] = useState(() => new Date());
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  useEffect(() => { staff.rooms().then((d) => d && setRooms(d)); }, []);
  useEffect(() => {
    // Dia inteiro no fuso de Fortaleza (UTC-3).
    const from = `${isoDay(day)}T00:00:00-03:00`;
    const to = `${isoDay(day)}T23:59:59-03:00`;
    staff.roomBookings(from, to).then((d) => setBookings(d ?? [])).catch(() => setBookings([]));
  }, [day]);

  const cell = useMemo(() => {
    const map = new Map<string, Booking>();
    for (const b of bookings ?? []) {
      const start = localHour(b.starts_at);
      const end = Math.max(start + 1, Math.ceil(localHour(b.ends_at) + (new Date(b.ends_at).getMinutes() > 0 ? 1 : 0)));
      for (let h = start; h < end; h++) map.set(`${b.room_id}-${h}`, b);
    }
    return map;
  }, [bookings]);

  const shift = (n: number) => setDay((d) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; });
  const label = day.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });

  return (
    <AppShell role="funcionario" title="Agenda de salas">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button size="sm" variant="outline" onClick={() => shift(-1)} aria-label="Dia anterior"><ChevronLeft className="w-4 h-4" aria-hidden /></Button>
        <Button size="sm" variant="secondary" onClick={() => setDay(new Date())}>Hoje</Button>
        <Button size="sm" variant="outline" onClick={() => shift(1)} aria-label="Próximo dia"><ChevronRight className="w-4 h-4" aria-hidden /></Button>
        <p className="ml-2 font-semibold text-[#0B1B3F] first-letter:uppercase">{label}</p>
        <p className="ml-auto text-sm text-[#667085]">{bookings ? `${bookings.length} ocupação(ões) no dia` : "Carregando…"}</p>
      </div>
      <div className="bg-white rounded-[4px] border border-[#E2E8F0] overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <caption className="sr-only">Ocupação das salas por horário</caption>
          <thead>
            <tr className="bg-[#F2F5FB] border-b border-[#E2E8F0]">
              <th scope="col" className="px-3 py-2 text-left text-[#667085] font-semibold w-20">Hora</th>
              {rooms.map((r) => (
                <th key={r.id} scope="col" className="px-2 py-2 text-left text-[#667085] font-semibold min-w-[140px]">{r.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((h) => (
              <tr key={h} className="border-b border-[#E2E8F0] last:border-0">
                <th scope="row" className="px-3 py-2 font-medium text-[#0B1B3F] whitespace-nowrap text-left tabular-nums">{pad(h)}:00</th>
                {rooms.map((r) => {
                  const b = cell.get(`${r.id}-${h}`);
                  const first = b && localHour(b.starts_at) === h;
                  return (
                    <td key={r.id} className="px-2 py-1.5 align-top">
                      {b ? (
                        <div className={`rounded-[4px] px-2 py-1 ${b.kind === "session" ? "bg-[#EBF0FF] text-[#004AF7]" : b.status === "pending" ? "bg-[#FFFAEB] text-[#93370D]" : "bg-[#F2F5FB] text-[#0B1B3F]"}`}>
                          {first ? (
                            <>
                              <p className="font-medium leading-tight line-clamp-2">{b.title}</p>
                              <p className="text-xs mt-0.5 tabular-nums">{time(b.starts_at)}–{time(b.ends_at)} · {b.kind === "session" ? "Sessão" : b.status === "pending" ? "Reserva pendente" : "Reserva"}</p>
                            </>
                          ) : <p className="text-xs">continua</p>}
                        </div>
                      ) : <span className="text-[#C4CDD8]" aria-label="Livre">—</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
