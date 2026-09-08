"use client";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";

const STAFF = { name: "Carla Nogueira", course: "Funcionária" };

export default function ConfiguracoesPage() {
  return (
    <AppShell role="funcionario" title="Configurações" user={STAFF}>
      <div className="max-w-2xl space-y-6">
        <section className="bg-white rounded-[18px] border border-[#E2E8F0] p-6 space-y-4">
          <h2 className="font-semibold text-[#172033]">Regras de empréstimo</h2>
          <Input label="Prazo padrão (dias)" type="number" defaultValue={7} />
          <Input label="Limite de itens por aluno" type="number" defaultValue={3} />
          <Input label="Limite de reservas ativas" type="number" defaultValue={2} />
          <Input label="Prazo para retirada de reserva (dias)" type="number" defaultValue={3} />
        </section>
        <section className="bg-white rounded-[18px] border border-[#E2E8F0] p-6 space-y-3">
          <h2 className="font-semibold text-[#172033]">Notificações automáticas</h2>
          <Checkbox label="Lembrete de devolução (3 dias antes)" defaultChecked />
          <Checkbox label="Aviso de atraso" defaultChecked />
          <Checkbox label="Confirmação de reserva" defaultChecked />
        </section>
        <Button>Salvar parâmetros</Button>
      </div>
    </AppShell>
  );
}
