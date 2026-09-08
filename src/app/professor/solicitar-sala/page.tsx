"use client";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import { professor as api, staff } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function SolicitarSalaPage() {
  const user = getUser();
  const { toast } = useToast();
  const [rooms,   setRooms]   = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { staff.rooms().then(d => d && setRooms(d)); }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form     = new FormData(e.currentTarget);
    const room_id  = Number(form.get("room_id"));
    const starts_at = form.get("starts_at") as string;
    const ends_at   = form.get("ends_at") as string;
    const title     = form.get("title") as string;
    const notes     = form.get("notes") as string;

    if (!room_id || !starts_at || !ends_at || !title) return;
    setLoading(true);
    try {
      await api.requestRoom({ room_id, starts_at, ends_at, title, notes });
      toast({ title: "Solicitação enviada", description: "A Videoteca analisará e responderá.", variant: "success" });
      formRef.current?.reset();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell role="professor" title="Solicitar sala de exibição" user={{ name: user?.name ?? "", course: user?.course ?? "" }}>
      <form ref={formRef} onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-[18px] border border-[#E2E8F0] p-6 space-y-4">
        <Select name="room_id" label="Sala" required defaultValue="">
          <option value="" disabled>Selecione…</option>
          {rooms.map(r => (
            <option key={r.id} value={r.id}>{r.name} — capacidade {r.capacity}</option>
          ))}
        </Select>
        <Input name="title" label="Título / Finalidade" required placeholder="Ex.: Exibição para Jornalismo Investigativo" />
        <div className="grid grid-cols-2 gap-4">
          <Input name="starts_at" label="Início" type="datetime-local" required />
          <Input name="ends_at"   label="Fim"    type="datetime-local" required />
        </div>
        <Textarea name="notes" label="Observações" rows={3} placeholder="Opcional" />
        <Button type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar solicitação"}</Button>
      </form>
    </AppShell>
  );
}
