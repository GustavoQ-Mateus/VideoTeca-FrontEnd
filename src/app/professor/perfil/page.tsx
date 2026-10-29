"use client";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { PrivacyPanel } from "@/components/privacy/PrivacyPanel";
import { useAuthUser } from "@/lib/use-auth-user";

export default function ProfessorPerfilPage() {
  const user = useAuthUser();
  return (
    <AppShell
      role="professor"
      title="Perfil"
      user={{ name: user?.name ?? "", course: user?.course ?? "" }}
    >
      <div className="max-w-xl space-y-6">
        <div
          key={user?.id ?? "anon"}
          className="bg-white rounded-[18px] border border-[#E2E8F0] p-6 space-y-4"
        >
          <Input label="Nome" defaultValue={user?.name ?? ""} />
          <Input
            label="SIAPE / Matrícula"
            id="siape"
            defaultValue={user?.registration ?? ""}
          />
          <Input label="E-mail" type="email" defaultValue={user?.email ?? ""} />
          <Checkbox
            label="Receber avisos de aprovação de solicitações"
            defaultChecked
          />
          <Button>Salvar</Button>
        </div>
        <PrivacyPanel />
      </div>
    </AppShell>
  );
}
