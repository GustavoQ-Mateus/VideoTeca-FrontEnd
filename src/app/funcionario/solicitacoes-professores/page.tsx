"use client";
import { AppShell } from "@/components/layout/AppShell";
const PROFESSOR_REQUESTS: { id: number; type: string; title: string; discipline: string; class: string; date: string; status: string; notes: string }[] = [];
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

const STAFF = { name: "Carla Nogueira", course: "Funcionária" };

export default function SolicitacoesProfessoresPage() {
  return (
    <AppShell role="funcionario" title="Solicitações de professores" user={STAFF}>
      <div className="space-y-4">
        {PROFESSOR_REQUESTS.map((req) => (
          <div key={req.id} className="bg-white rounded-[18px] border border-[#E2E8F0] p-5">
            <div className="flex flex-wrap justify-between gap-2 mb-2">
              <div>
                <p className="font-semibold text-[#172033]">{req.title}</p>
                <p className="text-sm text-[#667085]">
                  {req.discipline} · {req.class}
                </p>
              </div>
              <Badge status={req.status} />
            </div>
            <p className="text-xs text-[#667085] mb-3">Data solicitada: {new Date(req.date).toLocaleDateString("pt-BR")}</p>
            <Textarea label="Observação interna" rows={2} placeholder="Mensagem ao professor" />
            <div className="flex flex-wrap gap-2 mt-3">
              <Button size="sm">Aprovar</Button>
              <Button size="sm" variant="danger">
                Recusar
              </Button>
              <Button size="sm" variant="outline">
                Solicitar ajuste
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
