"use client";
import { useState } from "react";
import { AvailabilityFilters, Filters } from "./AvailabilityFilters";
import { request, message } from "@/lib/sprint-api";
import { Button } from "@/components/ui/Button";
export type Slot = { starts_at: string; ends_at: string };
type Room = {
  id: number;
  name: string;
  capacity: number;
  equipment: string[];
  free_slots: Slot[];
};
const time = (value: string) =>
  new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
export function AvailabilityCalendar({
  onSelect,
}: {
  onSelect: (room: Room, slot: Slot) => void;
}) {
  const [filters, setFilters] = useState<Filters>({
    date: "",
    capacity: 1,
    resources: "",
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  async function search() {
    setLoading(true);
    setError("");
    setRooms([]);
    try {
      const start = new Date(`${filters.date}T00:00:00`);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const params = new URLSearchParams({
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
        capacity: String(filters.capacity),
      });
      filters.resources
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .forEach((x) => params.append("resources", x));
      setRooms(await request<Room[]>(`/salas/disponibilidade?${params}`));
      setSearched(true);
    } catch (e) {
      setError(message(e));
    } finally {
      setLoading(false);
    }
  }
  return (
    <section
      className="space-y-4 rounded-[18px] border border-slate-200 bg-white p-6"
      aria-label="Disponibilidade de salas"
    >
      <h2 className="text-lg font-semibold">Encontre um horário livre</h2>
      <AvailabilityFilters
        value={filters}
        loading={loading}
        onSearch={search}
        onChange={(v) => {
          setFilters(v);
          setRooms([]);
          setSearched(false);
        }}
      />
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      <div aria-live="polite">
        {loading
          ? "Consultando disponibilidade…"
          : searched && !rooms.length
            ? "Nenhuma sala atende aos filtros."
            : ""}
      </div>
      {rooms.map((room) => (
        <article key={room.id} className="border-t border-slate-200 pt-4">
          <h3 className="font-semibold">
            {room.name} · {room.capacity} lugares
          </h3>
          <p className="text-sm text-slate-600">
            {room.equipment?.join(", ") || "Sem recursos cadastrados"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {room.free_slots.length ? (
              room.free_slots.map((slot) => (
                <Button
                  key={slot.starts_at}
                  type="button"
                  variant="outline"
                  onClick={() => onSelect(room, slot)}
                >
                  Livre: {time(slot.starts_at)}–{time(slot.ends_at)}
                </Button>
              ))
            ) : (
              <p>Sem horários livres nesta data.</p>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
