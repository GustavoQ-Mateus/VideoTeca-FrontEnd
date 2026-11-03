"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Download, CheckCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/providers/ToastProvider";
import { staff } from "@/lib/api";

type Registration = { user_id: string; name: string; matricula: string | null; course: string | null; present: boolean };

export default function PresencaEventoPage() {
  const params = useParams();
  const id = Number(params.id);
  // O QR Code do comprovante do aluno abre esta página com ?inscricao=<matrícula>.
  const scanned = useSearchParams().get("inscricao") ?? "";
  const { toast } = useToast();
  const [rows, setRows] = useState<Registration[] | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    staff.registrations(id).then((d) => setRows(d ?? [])).catch(() => setRows([]));
  }, [id]);

  const mark = useCallback(async (row: Registration, present: boolean) => {
    setSaving(row.user_id);
    try {
      await staff.setPresence(id, row.user_id, present);
      setRows((list) => list?.map((r) => (r.user_id === row.user_id ? { ...r, present } : r)) ?? null);
      toast({ title: present ? "Presença confirmada" : "Marcado como ausente", description: row.name, variant: present ? "success" : "info" });
    } catch (e) {
      toast({ title: "Não foi possível salvar", description: e instanceof Error ? e.message : undefined, variant: "error" });
    } finally {
      setSaving(null);
    }
  }, [id, toast]);

  const exportCsv = () => {
    const lines = ["Nome;Matrícula;Curso;Presença", ...(rows ?? []).map((r) => [r.name, r.matricula ?? "", r.course ?? "", r.present ? "Presente" : "Ausente"].join(";"))];
    const url = URL.createObjectURL(new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `presenca-evento-${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const target = scanned ? rows?.find((r) => r.matricula === scanned || r.user_id === scanned) : undefined;
  const present = rows?.filter((r) => r.present).length ?? 0;

  return (
    <AppShell role="funcionario" title={`Presença — evento ${id}`}>
      {scanned && rows && (
        <div className={`rounded-[4px] border p-4 mb-4 ${target ? "border-[#004AF7] bg-[#EBF0FF]" : "border-[#FECDCA] bg-[#FEF3F2]"}`} role="status">
          {target ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#3D4A66]">QR Code lido</p>
                <p className="font-semibold text-[#0B1B3F]">{target.name}{target.matricula ? ` · ${target.matricula}` : ""}</p>
              </div>
              {target.present ? (
                <p className="flex items-center gap-1.5 text-sm font-medium text-[#067647]"><CheckCircle className="w-4 h-4" aria-hidden />Presença já confirmada</p>
              ) : (
                <Button onClick={() => mark(target, true)} disabled={saving === target.user_id}>Confirmar presença</Button>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#B42318]">A inscrição lida no QR Code ({scanned}) não está na lista deste evento.</p>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button variant="secondary" className="gap-2" onClick={exportCsv} disabled={!rows?.length}>
          <Download className="w-4 h-4" aria-hidden />
          Exportar lista
        </Button>
        <p className="ml-auto text-sm text-[#3D4A66]">
          {rows?.length ? <>{present} de {rows.length} presentes ({Math.round((present / rows.length) * 100)}%)</> : rows ? "Sem inscritos registrados" : "Carregando…"}
        </p>
      </div>
      <div className="bg-white rounded-[4px] border border-[#E2E8F0] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F2F5FB] border-b border-[#E2E8F0]">
            <tr>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Inscrito</th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Matrícula</th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Presença</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {rows?.map((row) => (
              <tr key={row.user_id} className={target?.user_id === row.user_id ? "bg-[#EBF0FF]" : undefined}>
                <td className="px-4 py-3 font-medium text-[#0B1B3F]">{row.name}</td>
                <td className="px-4 py-3 text-[#667085] tabular-nums">{row.matricula ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Badge status={row.present ? "approved" : "expired"} label={row.present ? "Presente" : "Ausente"} />
                    <Button size="sm" variant="ghost" disabled={saving === row.user_id} onClick={() => mark(row, !row.present)}>
                      {row.present ? "Marcar ausente" : "Marcar presente"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
