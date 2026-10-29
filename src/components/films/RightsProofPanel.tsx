"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { message } from "@/lib/sprint-api";
import {
  PROOF_ACCEPT,
  deleteProof,
  downloadProof,
  formatBytes,
  listProofs,
  uploadProof,
  validateProofFile,
  type RightsProof,
} from "@/lib/rights";

export function RightsProofPanel({
  filmId,
  filmTitle,
  onChange,
}: {
  filmId: number;
  filmTitle: string;
  onChange?: (count: number) => void;
}) {
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [proofs, setProofs] = useState<RightsProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const apply = useCallback(
    (rows: RightsProof[]) => {
      setProofs(rows);
      onChange?.(rows.length);
    },
    [onChange],
  );

  useEffect(() => {
    let active = true;
    listProofs(filmId)
      .then((rows) => active && apply(rows))
      .catch((e) => active && setError(message(e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [filmId, apply]);

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const file = input.current?.files?.[0];
    setError("");
    setStatus("");
    if (!file) {
      setError("Selecione um arquivo para enviar.");
      return;
    }
    const invalid = await validateProofFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setBusy(true);
    try {
      await uploadProof(filmId, file);
      apply(await listProofs(filmId));
      setStatus(`Comprovante “${file.name}” anexado.`);
      form.reset();
    } catch (err) {
      setError(message(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove(proof: RightsProof) {
    if (!window.confirm(`Remover o comprovante “${proof.filename}”?`)) return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      await deleteProof(filmId, proof.id);
      apply(await listProofs(filmId));
      setStatus("Comprovante removido.");
    } catch (err) {
      setError(message(err));
    } finally {
      setBusy(false);
    }
  }

  async function download(proof: RightsProof) {
    setError("");
    try {
      await downloadProof(filmId, proof);
    } catch (err) {
      setError(message(err));
    }
  }

  return (
    <section
      aria-labelledby={`${inputId}-title`}
      className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
    >
      <div>
        <h3 id={`${inputId}-title`} className="font-semibold">
          Comprovantes de autorização
        </h3>
        <p className="text-sm text-slate-600">
          Contrato, licença ou cessão de direitos de “{filmTitle}”. Filmes
          autorizados só podem ser publicados com ao menos um comprovante.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <p role="status" aria-live="polite" className="text-sm text-emerald-800">
        {status}
      </p>
      {loading ? (
        <p className="text-sm">Carregando comprovantes…</p>
      ) : proofs.length ? (
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {proofs.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 p-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{p.filename}</p>
                <p className="text-xs text-slate-600">
                  {formatBytes(p.size)} · enviado em{" "}
                  {new Date(p.uploaded_at).toLocaleString("pt-BR")}
                  {p.uploaded_by_name ? ` por ${p.uploaded_by_name}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => download(p)}
                  aria-label={`Baixar ${p.filename}`}
                >
                  Baixar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  disabled={busy}
                  onClick={() => remove(p)}
                  aria-label={`Remover ${p.filename}`}
                >
                  Remover
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm">Nenhum comprovante anexado.</p>
      )}
      <form onSubmit={upload} className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={inputId} className="text-sm font-medium">
            Anexar comprovante
          </label>
          <input
            ref={input}
            id={inputId}
            name="file"
            type="file"
            accept={PROOF_ACCEPT}
            aria-describedby={`${inputId}-help`}
            className="text-sm"
          />
          <p id={`${inputId}-help`} className="text-xs text-slate-600">
            PDF, PNG ou JPEG; até 10 MB.
          </p>
        </div>
        <Button type="submit" size="sm" loading={busy}>
          Enviar comprovante
        </Button>
      </form>
    </section>
  );
}
