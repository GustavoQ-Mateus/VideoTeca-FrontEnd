import type { EventRecord } from "@/lib/types";
type ApiEvent = {
  id: number;
  title: string;
  starts_at: string;
  location: string;
  film_title: string;
  slots: number;
  enrolled: number;
  event_type: string;
  description: string;
  certificate: boolean;
};
function mapEvent(e: ApiEvent): EventRecord {
  return {
    id: e.id,
    title: e.title,
    date: e.starts_at,
    time: e.starts_at
      ? new Date(e.starts_at).toLocaleTimeString("pt-BR", {
          timeZone: "America/Fortaleza",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    location: e.location ?? "",
    film: e.film_title ?? "",
    slots: e.slots,
    enrolled: e.enrolled,
    type: e.event_type === "session" ? "Sessão" : (e.event_type ?? "Evento"),
    banner: "",
    description: e.description ?? "",
    certificate: e.certificate,
  };
}
export async function publishedEvents(): Promise<EventRecord[]> {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!base) return [];
  const res = await fetch(`${base}/api/v1/events`, {
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error("Programação temporariamente indisponível");
  return ((await res.json()) as ApiEvent[]).map(mapEvent);
}
export async function publishedEvent(id: number): Promise<EventRecord | null> {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!base) return null;
  const res = await fetch(`${base}/api/v1/events/${id}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Não foi possível consultar a sessão");
  return mapEvent(await res.json());
}
