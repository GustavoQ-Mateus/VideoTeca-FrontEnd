"use client";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { LoanRecord } from "@/lib/types";

const LOANS: LoanRecord[] = [];
import { Search, QrCode, CheckCircle, AlertCircle, Wrench, Clock, User, Film } from "lucide-react";

const STAFF = { name: "Carla Nogueira", course: "Funcionária" };

export default function DevolucoesPage() {
  const [code, setCode] = useState("");
  const [found, setFound] = useState<typeof LOANS[0] | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [damage, setDamage] = useState(false);
  const [obs, setObs] = useState("");

  function handleSearch() {
    const loan = LOANS.find(l => l.copy.toLowerCase() === code.toLowerCase() || l.film.toLowerCase().includes(code.toLowerCase()));
    setFound(loan ?? null);
    setConfirmed(false);
  }

  async function handleConfirm() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setConfirmed(true);
  }

  const isLate = found?.status === "late";

  return (
    <AppShell role="funcionario" title="Registro de Devolução" user={STAFF}>
      <div className="max-w-2xl mx-auto">
        <p className="text-[#667085] mb-6 text-sm">Informe o código do item ou escaneie o QR Code para registrar a devolução.</p>

        {/* Search */}
        <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-6 mb-4">
          <h3 className="font-semibold text-[#172033] mb-4">Localizar Item</h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" aria-hidden />
              <input
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Código do item (ex: DVD-001) ou título"
                className="w-full h-11 pl-9 pr-3 rounded-[10px] border border-[#E2E8F0] text-sm text-[#172033] placeholder:text-[#667085] focus:outline-none focus:border-[#0066B3] focus:ring-2 focus:ring-[#0066B3]/20"
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

        {/* Result */}
        {found && !confirmed && (
          <div className={`bg-white rounded-[18px] border-2 ${isLate ? "border-[#E7472E]" : "border-[#E2E8F0]"} p-6 mb-4`}>
            {isLate && (
              <div className="flex items-center gap-2 mb-4 p-3 rounded-[10px] bg-[#E7472E]/10 text-[#E7472E]">
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden />
                <p className="text-sm font-medium">Devolução com atraso — item venceu em {new Date(found.due).toLocaleDateString("pt-BR")}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Item */}
              <div className="p-4 rounded-[14px] bg-[#F5F7FA] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-2 text-[#667085] text-xs font-medium">
                  <Film className="w-3.5 h-3.5" aria-hidden />
                  MATERIAL
                </div>
                <p className="font-semibold text-[#172033]">{found.film}</p>
                <p className="text-sm text-[#667085] mt-0.5">{found.copy}</p>
                <Badge status={found.status} className="mt-2" />
              </div>
              {/* User */}
              <div className="p-4 rounded-[14px] bg-[#F5F7FA] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-2 text-[#667085] text-xs font-medium">
                  <User className="w-3.5 h-3.5" aria-hidden />
                  USUÁRIO
                </div>
                <p className="font-semibold text-[#172033]">{found.student}</p>
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
                  className="w-4 h-4 rounded accent-[#E7472E]"
                />
                <div className="flex items-center gap-2 text-sm text-[#172033]">
                  <Wrench className="w-4 h-4 text-amber-500" aria-hidden />
                  Registrar dano no material
                </div>
              </label>
              <div>
                <label htmlFor="obs" className="text-sm font-medium text-[#172033] block mb-1.5">Observações</label>
                <textarea
                  id="obs"
                  value={obs}
                  onChange={e => setObs(e.target.value)}
                  rows={2}
                  placeholder="Observações sobre a devolução (opcional)..."
                  className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#172033] placeholder:text-[#667085] resize-none focus:outline-none focus:border-[#0066B3] focus:ring-2 focus:ring-[#0066B3]/20"
                />
              </div>
            </div>

            <Button onClick={handleConfirm} loading={loading} size="lg" className="w-full gap-2">
              <CheckCircle className="w-4 h-4" aria-hidden />
              Confirmar Devolução
            </Button>
          </div>
        )}

        {/* Success */}
        {confirmed && found && (
          <div className="bg-emerald-50 border-2 border-emerald-400 rounded-[18px] p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-emerald-700 mb-1">Devolução Registrada!</h3>
            <p className="text-sm text-emerald-600">
              <span className="font-semibold">{found.film}</span> ({found.copy}) devolvido por {found.student}.
            </p>
            {damage && <p className="text-sm text-amber-600 mt-2 font-medium">⚠ Dano registrado — item encaminhado para avaliação.</p>}
            <Button
              variant="ghost"
              className="mt-4 border border-emerald-300"
              onClick={() => { setCode(""); setFound(null); setConfirmed(false); setDamage(false); setObs(""); }}
            >
              Nova Devolução
            </Button>
          </div>
        )}

        {/* Not found */}
        {!found && code && !confirmed && (
          <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-8 text-center text-[#667085]">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-30" aria-hidden />
            <p className="font-medium text-[#172033]">Item não encontrado</p>
            <p className="text-sm mt-1">Verifique o código e tente novamente.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
