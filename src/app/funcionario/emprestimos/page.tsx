"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/providers/ToastProvider";
import { Film, Clock } from "lucide-react";
import { staff as api } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function EmprestimosBalcaoPage() {
  const user = getUser();
  const { toast } = useToast();
  const [loans,      setLoans]      = useState<any[]>([]);
  const [matricula,  setMatricula]  = useState("");
  const [copyCode,   setCopyCode]   = useState("");
  const [foundUser,  setFoundUser]  = useState<any>(null);
  const [searching,  setSearching]  = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => { api.loans().then(d => d && setLoans(d)); }, []);

  async function searchUser() {
    if (!matricula.trim()) return;
    setSearching(true);
    try {
      const u = await api.userByReg(matricula.trim());
      setFoundUser(u);
    } catch {
      toast({ title: "Usuário não encontrado", variant: "error" });
      setFoundUser(null);
    } finally { setSearching(false); }
  }

  async function registerLoan() {
    if (!foundUser || !copyCode.trim()) return;
    setRegistering(true);
    try {
      await api.createLoan({ user_registration: foundUser.registration, copy_code: copyCode.trim(), days: 7 });
      toast({ title: "Empréstimo registrado!", variant: "success" });
      setFoundUser(null); setMatricula(""); setCopyCode("");
      api.loans().then(d => d && setLoans(d));
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "error" });
    } finally { setRegistering(false); }
  }

  async function returnLoan(id: number) {
    await api.returnLoan(id);
    toast({ title: "Devolução registrada", variant: "success" });
    api.loans().then(d => d && setLoans(d));
  }

  const active = loans.filter(l => l.status === "borrowed");

  return (
    <AppShell role="funcionario" title="Empréstimos (balcão)" user={{ name: user?.name ?? "", course: "Funcionário" }}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Registro */}
        <div className="space-y-4">
          <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-5">
            <h2 className="font-semibold text-[#172033] mb-3">Registrar empréstimo</h2>
            <Input label="Matrícula do aluno" value={matricula} onChange={e => setMatricula(e.target.value)} placeholder="Ex: 2024001234" />
            <Button className="w-full mt-3" onClick={searchUser} disabled={searching}>
              {searching ? "Buscando..." : "Buscar aluno"}
            </Button>

            {foundUser && (
              <div className="mt-4 p-3 rounded-[12px] bg-[#F5F7FA] text-sm">
                <p className="font-medium text-[#172033]">{foundUser.full_name}</p>
                <p className="text-xs text-[#667085]">{foundUser.course} · {foundUser.registration}</p>
              </div>
            )}

            <div className="mt-4">
              <Input label="Código do exemplar" value={copyCode} onChange={e => setCopyCode(e.target.value)} placeholder="Ex: DVD-001" />
            </div>
            <Button className="w-full mt-3" onClick={registerLoan} disabled={!foundUser || !copyCode || registering}>
              {registering ? "Registrando..." : "Confirmar empréstimo"}
            </Button>
          </div>
        </div>

        {/* Lista de empréstimos ativos */}
        <div className="xl:col-span-2">
          <h3 className="font-semibold text-[#172033] mb-3">Empréstimos em aberto</h3>
          <div className="bg-white rounded-[18px] border border-[#E2E8F0] overflow-hidden">
            <table className="w-full min-w-[500px] text-sm">
              <thead className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Título</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Aluno</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Devolução</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#667085]">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {active.map(l => (
                  <tr key={l.id}>
                    <td className="px-4 py-3 font-medium text-[#172033]">{l.film}</td>
                    <td className="px-4 py-3 text-[#667085]">{l.user_name}</td>
                    <td className="px-4 py-3 text-[#667085]">
                      {l.due_at ? new Date(l.due_at).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="px-4 py-3"><Badge status={l.status} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => returnLoan(l.id)} className="text-xs text-[#0066B3] hover:underline">Devolver</button>
                    </td>
                  </tr>
                ))}
                {active.length === 0 && (
                  <tr><td colSpan={5} className="text-center px-4 py-10 text-[#667085] text-sm">Nenhum empréstimo ativo</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
