"use client";
import { useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AvailabilityCalendar } from "@/components/rooms/AvailabilityCalendar";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { request, message, asISO } from "@/lib/sprint-api";
import { useAuthUser } from "@/lib/use-auth-user";
function local(value: string) {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
export default function Page() {
  const user = useAuthUser();
  const form = useRef<HTMLFormElement>(null);
  const [room, setRoom] = useState<{
    id: number;
    name: string;
    capacity: number;
  } | null>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!room || loading) return;
    setError("");
    setSuccess("");
    if (new Date(end) <= new Date(start)) {
      setError("O fim deve ser posterior ao início.");
      return;
    }
    if (new Date(start) <= new Date()) {
      setError("Escolha um horário futuro.");
      return;
    }
    setLoading(true);
    try {
      const data = new FormData(event.currentTarget);
      const saved = await request<{ id: number }>("/reservas", {
        method: "POST",
        body: JSON.stringify({
          room_id: room.id,
          title: data.get("title"),
          course: data.get("course"),
          registration: data.get("registration"),
          student_count: Number(data.get("student_count")),
          starts_at: asISO(start),
          ends_at: asISO(end),
          notes: data.get("notes"),
        }),
      });
      setSuccess(
        `Solicitação #${saved.id} registrada. O horário está reservado enquanto aguarda análise.`,
      );
      setRoom(null);
      form.current?.reset();
    } catch (e) {
      setError(message(e));
    } finally {
      setLoading(false);
    }
  }
  return (
    <AppShell
      role="professor"
      title="Solicitar sala"
      user={{ name: user?.name ?? "", course: user?.course ?? "" }}
    >
      <div className="max-w-5xl space-y-6">
        <AvailabilityCalendar
          onSelect={(r, s) => {
            setRoom(r);
            setStart(local(s.starts_at));
            setEnd(local(s.ends_at));
            setSuccess("");
          }}
        />
        {success && (
          <p
            role="status"
            className="rounded-xl bg-emerald-50 p-4 text-emerald-800"
          >
            {success}
          </p>
        )}
        {room && (
          <form
            ref={form}
            onSubmit={submit}
            className="space-y-4 rounded-[18px] border border-slate-200 bg-white p-6"
            aria-busy={loading}
          >
            <h2 className="text-lg font-semibold">{room.name}</h2>
            <Input
              name="title"
              label="Título / finalidade"
              required
              minLength={3}
              maxLength={200}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="course"
                label="Curso"
                required
                defaultValue={user?.course ?? ""}
                maxLength={120}
              />
              <Input
                name="registration"
                label="Matrícula"
                required
                defaultValue={user?.registration ?? ""}
                readOnly={!!user?.registration}
                maxLength={40}
              />
              <Input
                name="student_count"
                label="Número de alunos"
                type="number"
                required
                min={1}
                max={room.capacity}
              />
              <Input
                label="Início"
                type="datetime-local"
                required
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
              <Input
                label="Fim"
                type="datetime-local"
                required
                value={end}
                min={start}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
            <Textarea name="notes" label="Observações" maxLength={2000} />
            {error && (
              <p role="alert" className="text-red-700">
                {error}
              </p>
            )}
            <Button loading={loading} type="submit">
              {loading ? "Enviando solicitação…" : "Solicitar reserva"}
            </Button>
          </form>
        )}
      </div>
    </AppShell>
  );
}
