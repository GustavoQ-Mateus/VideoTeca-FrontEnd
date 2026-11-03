"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EventCard } from "@/components/ui/EventCard";
import { Select } from "@/components/ui/Select";
import { student as api } from "@/lib/api";
import { useAuthUser } from "@/lib/use-auth-user";
import { eventTypeLabel } from "../_components/eventType";

export default function AlunoEventosPage() {
  const user = useAuthUser();
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    api.events().then((d) => d && setEvents(d));
  }, []);

  const filtered = events.filter(
    (e) => filter === "todos" || eventTypeLabel(e.event_type) === filter,
  );

  async function toggleEnroll(eventId: number, enrolled: boolean) {
    if (enrolled) {
      await api.unenroll(eventId);
    } else {
      await api.enroll(eventId);
    }
    api.events().then((d) => d && setEvents(d));
  }

  return (
    <AppShell
      role="aluno"
      title="Eventos e cineclubes"
      user={{ name: user?.name ?? "", course: user?.course ?? "" }}
    >
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <p className="text-sm text-[#667085]">
            Destaques da semana e inscrições abertas.
          </p>
        </div>
        <div className="w-full sm:w-48">
          <Select
            aria-label="Tipo de evento"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="todos">Todos os tipos</option>
            <option value="Cineclube">Cineclube</option>
            <option value="Mostra">Mostra</option>
            <option value="Sessão">Sessão</option>
            <option value="Debate">Debate</option>
            <option value="Exibição">Exibição</option>
            <option value="Oficina">Oficina</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((e) => (
          <EventCard
            key={e.id}
            id={e.id}
            title={e.title}
            type={eventTypeLabel(e.event_type)}
            date={e.starts_at ?? ""}
            location={e.location ?? ""}
            slots={e.slots}
            enrolled={e.enrolled}
            time={
              e.starts_at
                ? new Date(e.starts_at).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""
            }
            film={e.film_title ?? ""}
            href={`/aluno/eventos/${e.id}`}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center text-[#667085]">
            <p className="text-sm">Nenhum evento disponível</p>
          </div>
        )}
      </div>

    </AppShell>
  );
}
