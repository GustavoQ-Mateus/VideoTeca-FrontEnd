"use client";
import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { PublishButton } from "@/components/sessions/PublishButton";
import { request, message, asISO } from "@/lib/sprint-api";
import { useAuthUser } from "@/lib/use-auth-user";
type Session = {
  id: number;
  title: string;
  film_id: number;
  room_id: number;
  starts_at: string;
  ends_at: string;
  slots: number;
  description: string;
  status: string;
  film_title: string;
  room_name: string;
};
type Choice = { id: number; title?: string; name?: string };
const local = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};
export default function Page() {
  const user = useAuthUser();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [films, setFilms] = useState<Choice[]>([]);
  const [rooms, setRooms] = useState<Choice[]>([]);
  const [editing, setEditing] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const load = useCallback(async () => {
    try {
      const [s, f, r] = await Promise.all([
        request<Session[]>("/staff/sessions"),
        request<Choice[]>("/staff/films"),
        request<Choice[]>("/staff/rooms"),
      ]);
      setSessions(s);
      setFilms(f);
      setRooms(r);
    } catch (e) {
      setError(message(e));
    }
  }, []);
  useEffect(() => {
    Promise.all([
      request<Session[]>("/staff/sessions"),
      request<Choice[]>("/staff/films"),
      request<Choice[]>("/staff/rooms"),
    ])
      .then(([s, f, r]) => {
        setSessions(s);
        setFilms(f);
        setRooms(r);
      })
      .catch((e) => setError(message(e)));
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await request(
        editing ? `/staff/sessions/${editing.id}` : "/staff/sessions",
        {
          method: editing ? "PUT" : "POST",
          body: JSON.stringify({
            title: d.get("title"),
            film_id: Number(d.get("film_id")),
            room_id: Number(d.get("room_id")),
            starts_at: asISO(d.get("starts_at")),
            ends_at: asISO(d.get("ends_at")),
            slots: Number(d.get("slots")),
            description: d.get("description"),
          }),
        },
      );
      setOpen(false);
      setSuccess(
        "Sessão salva. Publique para exibir na programação e reservar o horário.",
      );
      await load();
    } catch (err) {
      setError(message(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <AppShell
      role="funcionario"
      title="Filmes e sessões"
      user={{ name: user?.name ?? "", course: "Funcionário" }}
    >
      <div className="space-y-6">
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          Criar sessão
        </Button>
        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="text-emerald-800">
            {success}
          </p>
        )}
        {open && (
          <form
            key={editing?.id ?? "new"}
            onSubmit={submit}
            className="max-w-3xl space-y-4 rounded-2xl border bg-white p-6"
          >
            <Input
              name="title"
              label="Título da sessão"
              required
              defaultValue={editing?.title}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                name="film_id"
                label="Filme"
                required
                defaultValue={editing?.film_id ?? ""}
              >
                <option value="" disabled>
                  Selecione
                </option>
                {films.map((f) => (
                  <option value={f.id} key={f.id}>
                    {f.title}
                  </option>
                ))}
              </Select>
              <Select
                name="room_id"
                label="Sala"
                required
                defaultValue={editing?.room_id ?? ""}
              >
                <option value="" disabled>
                  Selecione
                </option>
                {rooms.map((r) => (
                  <option value={r.id} key={r.id}>
                    {r.name}
                  </option>
                ))}
              </Select>
              <Input
                name="starts_at"
                label="Início"
                type="datetime-local"
                required
                defaultValue={local(editing?.starts_at)}
              />
              <Input
                name="ends_at"
                label="Fim"
                type="datetime-local"
                required
                defaultValue={local(editing?.ends_at)}
              />
              <Input
                name="slots"
                label="Vagas"
                type="number"
                required
                min={1}
                defaultValue={editing?.slots}
              />
            </div>
            <Textarea
              name="description"
              label="Descrição"
              defaultValue={editing?.description}
              maxLength={4000}
            />
            <div className="flex gap-3">
              <Button type="submit" loading={busy}>
                Salvar sessão
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={busy}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
        {sessions.map((s) => (
          <article
            key={s.id}
            className="space-y-3 rounded-2xl border bg-white p-5"
          >
            <h2 className="text-lg font-semibold">{s.title}</h2>
            <p>
              {s.film_title} · {s.room_name}
            </p>
            <p>
              {new Date(s.starts_at).toLocaleString("pt-BR")} –{" "}
              {new Date(s.ends_at).toLocaleTimeString("pt-BR")} · {s.slots}{" "}
              vagas
            </p>
            <p>{s.status === "published" ? "Publicado" : "Rascunho"}</p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(s);
                  setOpen(true);
                }}
              >
                Editar sessão
              </Button>
              <PublishButton
                id={s.id}
                published={s.status === "published"}
                onChange={load}
              />
            </div>
          </article>
        ))}
        {!sessions.length && <p>Nenhuma sessão cadastrada.</p>}
      </div>
    </AppShell>
  );
}
