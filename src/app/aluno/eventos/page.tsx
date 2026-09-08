"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EventCard } from "@/components/ui/EventCard";
import { Drawer } from "@/components/ui/Drawer";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { student as api } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function AlunoEventosPage() {
  const user = getUser();
  const [events, setEvents]   = useState<any[]>([]);
  const [filter, setFilter]   = useState("todos");
  const [drawer, setDrawer]   = useState(false);

  useEffect(() => { api.events().then(d => d && setEvents(d)); }, []);

  const filtered = events.filter(e => filter === "todos" || e.event_type === filter);

  async function toggleEnroll(eventId: number, enrolled: boolean) {
    if (enrolled) {
      await api.unenroll(eventId);
    } else {
      await api.enroll(eventId);
    }
    api.events().then(d => d && setEvents(d));
  }

  return (
    <AppShell role="aluno" title="Eventos e cineclubes" user={{ name: user?.name ?? "", course: user?.course ?? "" }}>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <p className="text-sm text-[#667085]">Destaques da semana e inscrições abertas.</p>
        </div>
        <Button variant="outline" className="sm:hidden" onClick={() => setDrawer(true)}>Filtros</Button>
        <div className="hidden sm:block w-48">
          <Select aria-label="Tipo de evento" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="todos">Todos os tipos</option>
            <option value="Cineclube">Cineclube</option>
            <option value="Mostra">Mostra</option>
            <option value="Sessão">Sessão</option>
            <option value="Debate">Debate</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(e => (
          <EventCard
            key={e.id}
            id={e.id}
            title={e.title}
            type={e.event_type ?? ""}
            date={e.starts_at ?? ""}
            location={e.location ?? ""}
            slots={e.slots}
            enrolled={e.enrolled}
            status={e.status}
            href={`/aluno/eventos/${e.id}`}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center text-[#667085]">
            <p className="text-sm">Nenhum evento disponível</p>
          </div>
        )}
      </div>

      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Filtros">
        <Select label="Tipo" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="Cineclube">Cineclube</option>
          <option value="Mostra">Mostra</option>
          <option value="Sessão">Sessão</option>
          <option value="Debate">Debate</option>
        </Select>
        <Button className="w-full mt-4" onClick={() => setDrawer(false)}>Aplicar</Button>
      </Drawer>
    </AppShell>
  );
}
