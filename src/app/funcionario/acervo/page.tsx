"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { request, message, apiBase } from "@/lib/sprint-api";
import { useAuthUser } from "@/lib/use-auth-user";
type Film = {
  id: number;
  title: string;
  year: number | null;
  director: string;
  genre: string;
  duration: string;
  rating: string;
  synopsis: string;
  cover: string | null;
};
export default function Page() {
  const user = useAuthUser();
  const [films, setFilms] = useState<Film[]>([]);
  const [editing, setEditing] = useState<Film | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const load = useCallback(async () => {
    try {
      setFilms(await request<Film[]>("/staff/films"));
    } catch (e) {
      setError(message(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    request<Film[]>("/staff/films")
      .then(setFilms)
      .catch((e) => setError(message(e)))
      .finally(() => setLoading(false));
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    const d = new FormData(e.currentTarget);
    try {
      const film = await request<Film>(
        editing ? `/staff/films/${editing.id}` : "/staff/films",
        {
          method: editing ? "PUT" : "POST",
          body: JSON.stringify({
            title: d.get("title"),
            year: d.get("year") ? Number(d.get("year")) : null,
            director: d.get("director"),
            genre: d.get("genre"),
            duration: d.get("duration"),
            rating: d.get("rating"),
            synopsis: d.get("synopsis"),
          }),
        },
      );
      setEditing(film);
      const poster = d.get("poster");
      if (poster instanceof File && poster.size) {
        const data = new FormData();
        data.set("file", poster);
        await request(`/staff/films/${film.id}/poster`, {
          method: "POST",
          body: data,
        });
      }
      setSuccess("Filme salvo.");
      setOpen(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(message(err));
    } finally {
      setBusy(false);
    }
  }
  async function remove(film: Film) {
    if (!window.confirm(`Excluir “${film.title}” do acervo?`)) return;
    setBusy(true);
    setError("");
    try {
      await request(`/staff/films/${film.id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <AppShell
      role="funcionario"
      title="Acervo de filmes"
      user={{ name: user?.name ?? "", course: "Funcionário" }}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
              setError("");
            }}
          >
            Cadastrar filme
          </Button>
          <Link className="text-blue-700" href="/funcionario/eventos">
            Gerenciar sessões
          </Link>
        </div>
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
            <h2 className="text-lg font-semibold">
              {editing ? "Editar filme" : "Novo filme"}
            </h2>
            <Input
              name="title"
              label="Título"
              required
              maxLength={200}
              defaultValue={editing?.title ?? ""}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="year"
                label="Ano"
                type="number"
                min={1888}
                max={2100}
                defaultValue={editing?.year ?? ""}
              />
              <Input
                name="director"
                label="Diretor"
                maxLength={200}
                defaultValue={editing?.director ?? ""}
              />
              <Input
                name="genre"
                label="Gênero"
                maxLength={80}
                defaultValue={editing?.genre ?? ""}
              />
              <Input
                name="duration"
                label="Duração"
                maxLength={40}
                defaultValue={editing?.duration ?? ""}
              />
              <Input
                name="rating"
                label="Classificação indicativa"
                maxLength={20}
                defaultValue={editing?.rating ?? "Livre"}
              />
              <Input
                name="poster"
                label="Cartaz"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                helper="PNG, JPEG ou WebP; até 5 MB"
              />
            </div>
            <Textarea
              name="synopsis"
              label="Sinopse"
              maxLength={10000}
              defaultValue={editing?.synopsis ?? ""}
            />
            <div className="flex gap-3">
              <Button type="submit" loading={busy}>
                Salvar filme
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
        {loading ? (
          <p role="status">Carregando acervo…</p>
        ) : (
          !films.length && <p>Nenhum filme cadastrado.</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {films.map((f) => (
            <article
              key={f.id}
              className="flex gap-4 rounded-2xl border bg-white p-4"
            >
              {f.cover && (
                <Image
                  unoptimized
                  className="h-32 w-24 rounded-lg object-cover"
                  src={
                    f.cover.startsWith("/api/") ? apiBase() + f.cover : f.cover
                  }
                  alt={`Cartaz de ${f.title}`}
                  width={96}
                  height={128}
                />
              )}
              <div className="min-w-0 space-y-2">
                <h2 className="font-semibold">{f.title}</h2>
                <p className="text-sm text-slate-600">
                  {f.year} · {f.genre}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() => {
                      setEditing(f);
                      setOpen(true);
                      setError("");
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    disabled={busy}
                    onClick={() => remove(f)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
