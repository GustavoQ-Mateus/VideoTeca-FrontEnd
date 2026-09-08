"use client";
import { useEffect, useState, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import { professor as api, fetchCatalogFilms } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function SolicitarFilmePage() {
  const user = getUser();
  const { toast } = useToast();
  const [films,   setFilms]   = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { fetchCatalogFilms().then(setFilms); }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const film_id = Number(form.get("film_id"));
    const date    = form.get("date") as string;
    const notes   = form.get("notes") as string;

    if (!film_id || !date) return;
    setLoading(true);
    try {
      await api.requestFilm({ film_id, date, notes });
      toast({ title: "Solicitação enviada", description: "A Videoteca analisará e responderá pelo sistema.", variant: "success" });
      formRef.current?.reset();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell role="professor" title="Solicitar filme para aula" user={{ name: user?.name ?? "", course: user?.course ?? "" }}>
      <form ref={formRef} onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-[18px] border border-[#E2E8F0] p-6 space-y-4">
        <Select name="film_id" label="Filme" required defaultValue="">
          <option value="" disabled>Selecione…</option>
          {films.map(f => (
            <option key={f.id} value={f.id}>{f.title} {f.year ? `(${f.year})` : ""}</option>
          ))}
        </Select>
        <Input name="date" label="Data de uso" type="date" required />
        <Textarea name="notes" label="Observações / Objetivo pedagógico" rows={4} placeholder="Descreva como o filme se integra ao plano de aula." />
        <Button type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar solicitação"}</Button>
      </form>
    </AppShell>
  );
}
