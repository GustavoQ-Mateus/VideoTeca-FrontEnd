"use client";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { COURSES } from "@/lib/constants";

const STUDENT = { name: "Ana Clara Mendes", course: "Cinema e Audiovisual" };

export default function PerfilAlunoPage() {
  return (
    <AppShell role="aluno" title="Meu Perfil" user={STUDENT}>
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-6 space-y-4">
          <h2 className="font-semibold text-[#172033]">Dados cadastrais</h2>
          <Input label="Nome completo" defaultValue={STUDENT.name} />
          <Input label="Matrícula" defaultValue="2022001847" readOnly className="bg-[#F5F7FA]" />
          <Select label="Curso" defaultValue={STUDENT.course}>
            {COURSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Input label="E-mail" type="email" defaultValue="ana.mendes@aluno.unifor.br" />
          <Input label="Telefone" defaultValue="(85) 99999-0000" />
        </div>
        <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-6 space-y-3">
          <h2 className="font-semibold text-[#172033]">Notificações</h2>
          <Checkbox label="Reservas e empréstimos" defaultChecked />
          <Checkbox label="Prazos e atrasos" defaultChecked />
          <Checkbox label="Eventos e cineclubes" defaultChecked />
        </div>
        <Button>Salvar alterações</Button>
      </div>
    </AppShell>
  );
}
