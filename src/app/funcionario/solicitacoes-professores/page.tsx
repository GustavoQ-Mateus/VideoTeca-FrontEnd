"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/providers/ToastProvider";
import { staff } from "@/lib/api";

type Request = {
  id: number;
  request_type: string;
  status: string;
  staff_notes: string | null;
  created_at: string;
  professor_name: string;
  payload: Record<string, unknown> | null;
};

const TYPE: Record<string, string> = { room: "Reserva de sala", film: "Solicitação de filme", sala: "Reserva de sala", filme: "Solicitação de filme" };
const text = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");

export default function SolicitacoesProfessoresPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[] | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState<number | null>(null);

  useEffect(() => {
    staff.requests().then((d) => setRequests(d ?? [])).catch(() => setRequests([]));
  }, []);

  const decide = async (req: Request, status: "approved" | "refused" | "analysis") => {
    setBusy(req.id);
    try {
      await staff.updateRequest(req.id, { status, staff_notes: notes[req.id] ?? req.staff_notes ?? null });
      setRequests((list) => list?.map((r) => (r.id === req.id ? { ...r, status, staff_notes: notes[req.id] ?? r.staff_notes } : r)) ?? null);
      toast({ title: status === "approved" ? "Solicitação aprovada" : status === "refused" ? "Solicitação recusada" : "Solicitação em análise", variant: status === "refused" ? "info" : "success" });
    } catch (e) {
      toast({ title: "Não foi possível atualizar", description: e instanceof Error ? e.message : undefined, variant: "error" });
    } finally {
      setBusy(null);
    }
  };

  return (
    <AppShell role="funcionario" title="Solicitações de professores">
      {!requests && <p className="text-sm text-[#667085]">Carregando solicitações…</p>}
      {requests?.length === 0 && <p className="text-sm text-[#667085]">Nenhuma solicitação de professor no momento.</p>}
      <div className="space-y-4">
        {requests?.map((req) => {
          const p = req.payload ?? {};
          const title = text(p.title) || text(p.film_title) || text(p.titulo) || TYPE[req.request_type] || req.request_type;
          const detail = [text(p.course) || text(p.discipline), text(p.class) || text(p.turma), p.student_count ? `${text(p.student_count)} alunos` : ""].filter(Boolean).join(" · ");
          const when = text(p.date) || text(p.starts_at) || req.created_at;
          return (
            <div key={req.id} className="bg-white rounded-[4px] border border-[#E2E8F0] p-5">
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <div>
                  <p className="font-semibold text-[#0B1B3F]">{title}</p>
                  <p className="text-sm text-[#3D4A66]">{TYPE[req.request_type] ?? req.request_type} · {req.professor_name}{detail ? ` · ${detail}` : ""}</p>
                </div>
                <Badge status={req.status} />
              </div>
              <p className="text-sm text-[#667085] mb-3">Data: {new Date(when).toLocaleDateString("pt-BR", { timeZone: "America/Fortaleza" })}</p>
              <Textarea
                label="Observação interna"
                rows={2}
                placeholder="Mensagem ao professor"
                value={notes[req.id] ?? req.staff_notes ?? ""}
                onChange={(e) => setNotes((n) => ({ ...n, [req.id]: e.target.value }))}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                <Button size="sm" disabled={busy === req.id || req.status === "approved"} onClick={() => decide(req, "approved")}>Aprovar</Button>
                <Button size="sm" variant="danger" disabled={busy === req.id || req.status === "refused"} onClick={() => decide(req, "refused")}>Recusar</Button>
                <Button size="sm" variant="outline" disabled={busy === req.id || req.status === "analysis"} onClick={() => decide(req, "analysis")}>Solicitar ajuste</Button>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
