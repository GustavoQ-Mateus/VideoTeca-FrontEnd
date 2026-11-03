"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { staff } from "@/lib/api";
import type { LoanRecord } from "@/lib/types";
import { Search, QrCode, CheckCircle, AlertCircle, Wrench, Clock, User, Film } from "lucide-react";

type ApiLoan = { id: number; status: string; borrowed_at: string; due_at: string; returned_at: string | null; film: string; copy: string; user_name: string; registration: string | null; course: string | null };

// Empréstimos em aberto vindos da API, no formato que a tela já usa.
const toRecord = (l: ApiLoan): LoanRecord & { registration: string } => ({
  id: l.id,
  film: l.film,
  copy: l.copy,
  student: l.user_name,
  course: l.course ?? "",
  registration: l.registration ?? "",
  borrowed: l.borrowed_at,
  due: l.due_at,
  status: l.status !== "returned" && l.due_at && new Date(l.due_at).getTime() < Date.now() ? "late" : l.status,
});

export default function DevolucoesPage() {
  const [loans, setLoans] = useState<ReturnType<typeof toRecord>[]>([]);
  const [code, setCode] = useState("");
  const [found, setFound] = useState<ReturnType<typeof toRecord> | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [damage, setDamage] = useState(false);
  const [obs, setObs] = useState("");

  useEffect(() => {
    staff.loans().then((d) => setLoans(((d ?? []) as ApiLoan[]).filter((l) => !l.returned_at && l.status !== "returned").map(toRecord)));
  }, []);

  function handleSearch() {
    const q = code.trim().toLowerCase();
    const loan = q ? loans.find(l => l.copy.toLowerCase() === q || l.registration.toLowerCase() === q || l.film.toLowerCase().includes(q)) : undefined;
    setFound(loan ?? null);
    setNotFound(Boolean(q) && !loan);
    setConfirmed(false);
    setError("");
  }

  async function handleConfirm() {
    if (!found) return;
    setLoading(true);
    setError("");
    try {
      await staff.returnLoan(found.id);
      setLoans((list) => list.filter((l) => l.id !== found.id));
      setConfirmed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível registrar a devolução");
    } finally {
      setLoading(false);
    }
  }

  const isLate = found?.status === "late";

  return (
    <AppShell role="funcionario" title="Registro de Devolução">
      <div className="max-w-2xl mx-auto">
        <p className="text-[#667085] mb-6 text-sm">Informe o código do item ou escaneie o QR Code para registrar a devolução.</p>

        {/* Search */}
        <div className="bg-white rounded-[4px] border border-[#E2E8F0] p-6 mb-4">
          <h3 className="font-semibold text-[#0B1B3F] mb-4">Localizar Item</h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" aria-hidden />
              <input
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Código do item (ex: DVD-001) ou título"
                className="w-full h-11 pl-9 pr-3 rounded-[4px] border border-[#E2E8F0] text-sm text-[#0B1B3F] placeholder:text-[#667085] focus:outline-none focus:border-[#004AF7] focus:ring-2 focus:ring-[#004AF7]/20"
                aria-label="Código do item"
              />
            </div>
            <Button onClick={handleSearch} className="h-11">Buscar</Button>
            <Button variant="outline" className="h-11 gap-1.5">
              <QrCode className="w-4 h-4" aria-hidden />
              QR
            </Button>
          </div>
        </div>

        {notFound && (
          <p className="text-sm text-[#B42318] mb-4" role="status">Nenhum empréstimo em aberto para “{code}”. Confira o código da cópia, a matrícula ou o título.</p>
        )}

        {/* Result */}
        {found && !confirmed && (
          <div className={`bg-white rounded-[4px] border-2 ${isLate ? "border-[#B42318]" : "border-[#E2E8F0]"} p-6 mb-4`}>
            {isLate && (
              <div className="flex items-center gap-2 mb-4 p-3 rounded-[4px] bg-[#FEF3F2] text-[#B42318]">
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden />
                <p className="text-sm font-medium">Devolução com atraso — item venceu em {new Date(found.due).toLocaleDateString("pt-BR")}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Item */}
              <div className="p-4 rounded-[4px] bg-[#F2F5FB] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-2 text-[#667085] text-xs font-medium">
                  <Film className="w-3.5 h-3.5" aria-hidden />
                  MATERIAL
                </div>
                <p className="font-semibold text-[#0B1B3F]">{found.film}</p>
                <p className="text-sm text-[#667085] mt-0.5">{found.copy}</p>
                <Badge status={found.status} className="mt-2" />
              </div>
              {/* User */}
              <div className="p-4 rounded-[4px] bg-[#F2F5FB] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-2 text-[#667085] text-xs font-medium">
                  <User className="w-3.5 h-3.5" aria-hidden />
                  USUÁRIO
                </div>
                <p className="font-semibold text-[#0B1B3F]">{found.student}</p>
                <p className="text-sm text-[#667085] mt-0.5">{found.course}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-[#667085]">
                  <Clock className="w-3 h-3" aria-hidden />
                  Prazo: {new Date(found.due).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={damage}
                  onChange={e => setDamage(e.target.checked)}
                  className="w-4 h-4 rounded-[4px] accent-[#B42318]"
                />
                <div className="flex items-center gap-2 text-sm text-[#0B1B3F]">
                  <Wrench className="w-4 h-4 text-[#93370D]" aria-hidden />
                  Registrar dano no material
                </div>
              </label>
              <div>
                <label htmlFor="obs" className="text-sm font-medium text-[#0B1B3F] block mb-1.5">Observações</label>
                <textarea
                  id="obs"
                  value={obs}
                  onChange={e => setObs(e.target.value)}
                  rows={2}
                  placeholder="Observações sobre a devolução (opcional)..."
                  className="w-full rounded-[4px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0B1B3F] placeholder:text-[#667085] resize-none focus:outline-none focus:border-[#004AF7] focus:ring-2 focus:ring-[#004AF7]/20"
                />
              </div>
            </div>

            {error && <p className="text-sm text-[#B42318] mb-3" role="alert">{error}</p>}
            <Button onClick={handleConfirm} loading={loading} size="lg" className="w-full gap-2">
              <CheckCircle className="w-4 h-4" aria-hidden />
              Confirmar Devolução
            </Button>
          </div>
        )}

        {/* Success */}
        {confirmed && found && (
          <div className="bg-[#ECFDF3] border-2 border-[#ABEFC6] rounded-[4px] p-8 text-center">
            <div className="w-16 h-16 bg-[#ECFDF3] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#067647]" />
            </div>
            <h3 className="text-lg font-bold text-[#067647] mb-1">Devolução Registrada!</h3>
            <p className="text-sm text-[#067647]">
              <span className="font-semibold">{found.film}</span> ({found.copy}) devolvido por {found.student}.
            </p>
            {damage && <p className="text-sm text-[#93370D] mt-2 font-medium">Dano registrado — item encaminhado para avaliação.</p>}
            <Button
              variant="ghost"
              className="mt-4 border border-[#ABEFC6]"
              onClick={() => { setCode(""); setFound(null); setConfirmed(false); setDamage(false); setObs(""); }}
            >
              Nova Devolução
            </Button>
          </div>
        )}

        {/* Not found */}
        {!found && code && !confirmed && (
          <div className="bg-white rounded-[4px] border border-[#E2E8F0] p-8 text-center text-[#667085]">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-30" aria-hidden />
            <p className="font-medium text-[#0B1B3F]">Item não encontrado</p>
            <p className="text-sm mt-1">Verifique o código e tente novamente.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
