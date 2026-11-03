"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { RightsProofPanel } from "@/components/films/RightsProofPanel";
import { request, message, apiBase } from "@/lib/sprint-api";
import { useAuthUser } from "@/lib/use-auth-user";
import {
  LICENSE_TYPE_OPTIONS,
  RIGHTS_STATUS_OPTIONS,
  RIGHTS_STATUS_STYLE,
  licenseLabel,
  rightsLabel,
  validateRights,
  type FilmRights,
  type RightsStatus,
} from "@/lib/rights";
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
} & Partial<FilmRights>;
const text = (value: FormDataEntryValue | null) => String(value ?? "").trim();
function RightsBadge({ status }: { status?: string }) {
  const key = (status ?? "pending") as RightsStatus;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        RIGHTS_STATUS_STYLE[key] ?? RIGHTS_STATUS_STYLE.pending
      }`}
    >
      Direitos: {rightsLabel(key)}
    </span>
  );
}
export default function Page() {
  const user = useAuthUser();
  const [films, setFilms] = useState<Film[]>([]);
  const [editing, setEditing] = useState<Film | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rightsStatus, setRightsStatus] = useState<RightsStatus>("pending");
  const [filter, setFilter] = useState("");
  const startEdit = useCallback((film: Film | null) => {
    setEditing(film);
    setRightsStatus((film?.rights_status ?? "pending") as RightsStatus);
    setOpen(true);
    setError("");
  }, []);
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
      .then((rows) => {
        setFilms(rows);
        // Deep link from the publish error: /funcionario/acervo?filme=<id>
        const id = Number(
          new URLSearchParams(window.location.search).get("filme"),
        );
        const target = id ? rows.find((f) => f.id === id) : undefined;
        if (target) startEdit(target);
      })
      .catch((e) => setError(message(e)))
      .finally(() => setLoading(false));
  }, [startEdit]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    const d = new FormData(e.currentTarget);
    const status = text(d.get("rights_status")) as RightsStatus;
    const rights: FilmRights = {
      rights_status: status,
      rights_holder: text(d.get("rights_holder")),
      license_type: text(d.get("license_type")),
      rights_valid_until:
        status === "public_domain"
          ? null
          : text(d.get("rights_valid_until")) || null,
      rights_notes: text(d.get("rights_notes")),
    };
    const invalid = validateRights(rights);
    if (invalid) {
      setError(invalid);
      setBusy(false);
      return;
    }
    const isNew = !editing;
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
            ...rights,
          }),
        },
      );
      setEditing(film);
      setRightsStatus((film.rights_status ?? status) as RightsStatus);
      const poster = d.get("poster");
      if (poster instanceof File && poster.size) {
        const data = new FormData();
        data.set("file", poster);
        await request(`/staff/films/${film.id}/poster`, {
          method: "POST",
          body: data,
        });
      }
      await load();
      if (isNew && rights.rights_status === "authorized") {
        // Keep the form open so the proof can be attached right away.
        setSuccess(
          "Filme salvo. Anexe o comprovante de autorização abaixo para poder publicar sessões.",
        );
      } else {
        setSuccess("Filme salvo.");
        setOpen(false);
        setEditing(null);
      }
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
  const visible = films.filter(
    (f) => !filter || (f.rights_status ?? "pending") === filter,
  );
  return (
    <AppShell
      role="funcionario"
      title="Acervo de filmes"
      user={{ name: user?.name ?? "", course: "Funcionário" }}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <Button onClick={() => startEdit(null)}>Cadastrar filme</Button>
          <Link className="pb-2 text-blue-700" href="/funcionario/eventos">
            Gerenciar sessões
          </Link>
          <div className="w-56">
            <Select
              id="rights-filter"
              label="Filtrar por direitos"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">Todos</option>
              {RIGHTS_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
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
            <fieldset className="space-y-4 rounded-xl border border-slate-200 p-4">
              <legend className="px-1 font-semibold">
                Direitos autorais e autorização de exibição
              </legend>
              <p className="text-sm text-slate-600">
                Sessões só podem ser publicadas para filmes em domínio público
                ou autorizados (com titular, validade que cubra a sessão e
                comprovante anexado).
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  id="rights_status"
                  name="rights_status"
                  label="Status da autorização"
                  value={rightsStatus}
                  onChange={(e) =>
                    setRightsStatus(e.target.value as RightsStatus)
                  }
                >
                  {RIGHTS_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
                <Input
                  id="rights_holder"
                  name="rights_holder"
                  label="Titular dos direitos"
                  maxLength={200}
                  required={rightsStatus === "authorized"}
                  helper="Distribuidora, produtora ou detentor da licença"
                  defaultValue={editing?.rights_holder ?? ""}
                />
                <Select
                  id="license_type"
                  name="license_type"
                  label="Tipo de licença"
                  defaultValue={editing?.license_type ?? ""}
                >
                  {LICENSE_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                  {editing?.license_type &&
                    !LICENSE_TYPE_OPTIONS.some(
                      (o) => o.value === editing.license_type,
                    ) && (
                      <option value={editing.license_type}>
                        {editing.license_type}
                      </option>
                    )}
                </Select>
                {rightsStatus !== "public_domain" && (
                  <Input
                    id="rights_valid_until"
                    name="rights_valid_until"
                    label="Validade da autorização"
                    type="date"
                    helper="Deixe em branco se não houver prazo"
                    defaultValue={editing?.rights_valid_until ?? ""}
                  />
                )}
              </div>
              <Textarea
                id="rights_notes"
                name="rights_notes"
                label="Observações sobre os direitos"
                maxLength={2000}
                defaultValue={editing?.rights_notes ?? ""}
              />
            </fieldset>
            <div className="flex gap-3">
              <Button type="submit" loading={busy}>
                Salvar filme
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  setOpen(false);
                  setEditing(null);
                }}
              >
                {editing ? "Fechar" : "Cancelar"}
              </Button>
            </div>
          </form>
        )}
        {open && editing && (
          <div className="max-w-3xl">
            <RightsProofPanel
              key={editing.id}
              filmId={editing.id}
              filmTitle={editing.title}
            />
          </div>
        )}
        {loading ? (
          <p role="status">Carregando acervo…</p>
        ) : (
          !visible.length && (
            <p>
              {films.length
                ? "Nenhum filme com esse status de direitos."
                : "Nenhum filme cadastrado."}
            </p>
          )
        )}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((f) => (
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
                <RightsBadge status={f.rights_status} />
                {(f.rights_holder || f.rights_valid_until) && (
                  <p className="text-xs text-slate-600">
                    {[
                      f.rights_holder,
                      f.license_type && licenseLabel(f.license_type),
                      f.rights_valid_until &&
                        `até ${new Date(`${f.rights_valid_until}T12:00:00`).toLocaleDateString("pt-BR")}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() => startEdit(f)}
                    aria-label={`Editar ${f.title}`}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    disabled={busy}
                    onClick={() => remove(f)}
                    aria-label={`Excluir ${f.title}`}
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
