"use client";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { PrivacyPanel } from "@/components/privacy/PrivacyPanel";
import { COURSES } from "@/lib/constants";
import { useAuthUser } from "@/lib/use-auth-user";

export default function PerfilAlunoPage() {
  const user = useAuthUser();
  const course = user?.course ?? "";
  return (
    <AppShell
      role="aluno"
      title="Meu Perfil"
      user={{ name: user?.name ?? "", course }}
    >
      <div className="max-w-2xl space-y-6">
        <div
          key={user?.id ?? "anon"}
          className="bg-white rounded-[18px] border border-[#E2E8F0] p-6 space-y-4"
        >
          <h2 className="font-semibold text-[#172033]">Dados cadastrais</h2>
          <Input label="Nome completo" defaultValue={user?.name ?? ""} />
          <Input
            label="Matrícula"
            defaultValue={user?.registration ?? ""}
            readOnly
            className="bg-[#F5F7FA]"
          />
          <Select label="Curso" id="curso" defaultValue={course}>
            {course && !COURSES.includes(course) && (
              <option value={course}>{course}</option>
            )}
            {COURSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Input label="E-mail" type="email" defaultValue={user?.email ?? ""} />
          <Input label="Telefone" defaultValue={user?.phone ?? ""} />
        </div>
        <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-6 space-y-3">
          <h2 className="font-semibold text-[#172033]">Notificações</h2>
          <Checkbox label="Reservas e empréstimos" defaultChecked />
          <Checkbox label="Prazos e atrasos" defaultChecked />
          <Checkbox label="Eventos e cineclubes" defaultChecked />
        </div>
        <Button>Salvar alterações</Button>
        <PrivacyPanel />
      </div>
    </AppShell>
  );
}
