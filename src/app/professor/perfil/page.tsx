"use client";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";

const PROFESSOR = { name: "Carlos Melo", course: "Jornalismo" };

export default function ProfessorPerfilPage() {
  return (
    <AppShell role="professor" title="Perfil" user={PROFESSOR}>
      <div className="max-w-xl bg-white rounded-[18px] border border-[#E2E8F0] p-6 space-y-4">
        <Input label="Nome" defaultValue={PROFESSOR.name} />
        <Input label="SIAPE / Matrícula" defaultValue="1234567" />
        <Input label="E-mail" type="email" defaultValue="carlos.melo@unifor.br" />
        <Checkbox label="Receber avisos de aprovação de solicitações" defaultChecked />
        <Button>Salvar</Button>
      </div>
    </AppShell>
  );
}
