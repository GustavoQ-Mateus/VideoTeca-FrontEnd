"use client";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
const EVENT_CHECKINS: { id: number; name: string; matricula: string; present: boolean }[] = [];
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { QrCode, Download } from "lucide-react";

const STAFF = { name: "Carla Nogueira", course: "Funcionária" };

export default function PresencaEventoPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <AppShell role="funcionario" title={`Presença — evento ${id}`} user={STAFF}>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="outline" className="gap-2">
          <QrCode className="w-4 h-4" aria-hidden />
          Check-in QR
        </Button>
        <Button variant="secondary" className="gap-2">
          <Download className="w-4 h-4" aria-hidden />
          Exportar lista
        </Button>
      </div>
      <div className="bg-white rounded-[18px] border border-[#E2E8F0] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Inscrito</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Matrícula</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Presença</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {EVENT_CHECKINS.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 font-medium text-[#172033]">{row.name}</td>
                <td className="px-4 py-3 text-[#667085]">{row.matricula}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Checkbox label="Presente" defaultChecked={row.present} />
                    <Button size="sm" variant="ghost">
                      Ausente
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-[#667085] mt-4">
        Indicador: <Badge status="approved" label="72% presentes" className="ml-1" /> (mock)
      </p>
    </AppShell>
  );
}
