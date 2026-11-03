"use client";
import { useId, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { request, message } from "@/lib/sprint-api";

type Blocked = { reason: string; rights: boolean; filmId?: number };

// Messages returned by the API (422) when the film lacks a valid authorization
// (T21.2): "Filme sem autorização de exibição válida para esta sessão" and
// "Anexe o comprovante de autorização antes de publicar".
const isRightsError = (text: string) => /autoriza|comprovante/i.test(text);

export function PublishButton({
  id,
  published,
  onChange,
  filmId,
}: {
  id: number;
  published: boolean;
  onChange: () => void;
  /** Film of the session, used to deep-link to the rights form. */
  filmId?: number;
}) {
  const errorId = useId();
  const [busy, setBusy] = useState(false);
  const [blocked, setBlocked] = useState<Blocked | null>(null);

  async function resolveFilmId() {
    if (filmId) return filmId;
    try {
      const sessions = await request<{ id: number; film_id: number }[]>(
        "/staff/sessions",
      );
      return sessions.find((s) => s.id === id)?.film_id;
    } catch {
      return undefined;
    }
  }

  async function toggle() {
    setBusy(true);
    setBlocked(null);
    try {
      await request(`/staff/sessions/${id}/publication`, {
        method: "PUT",
        body: JSON.stringify({ published: !published }),
      });
      onChange();
    } catch (e) {
      const reason = message(e);
      const rights = !published && isRightsError(reason);
      setBlocked({
        reason,
        rights,
        filmId: rights ? await resolveFilmId() : undefined,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Button
        variant="outline"
        onClick={toggle}
        loading={busy}
        aria-describedby={blocked ? errorId : undefined}
      >
        {published ? "Despublicar" : "Publicar"}
      </Button>
      {blocked && (
        <div
          id={errorId}
          role="alert"
          className="mt-2 max-w-md rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          <p className="font-semibold">
            {blocked.rights
              ? "Publicação bloqueada por direitos autorais"
              : "Não foi possível alterar a publicação"}
          </p>
          <p className="mt-1">{blocked.reason}</p>
          {blocked.rights && (
            <p className="mt-2">
              Para regularizar, abra o filme no acervo, marque a autorização
              (titular e validade que cubra a data da sessão) e anexe o
              comprovante.{" "}
              <Link
                className="font-medium text-blue-800 underline"
                href={
                  blocked.filmId
                    ? `/funcionario/acervo?filme=${blocked.filmId}`
                    : "/funcionario/acervo"
                }
              >
                Regularizar no acervo
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
