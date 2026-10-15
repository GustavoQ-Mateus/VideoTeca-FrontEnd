"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { request, message } from "@/lib/sprint-api";
import { useAuthUser } from "@/lib/use-auth-user";
type Loan = {
  id: number;
  name: string;
  full_name: string;
  quantity: number;
  due_at: string;
  returned_at: string | null;
  late: boolean;
};
export default function Page() {
  const user = useAuthUser();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selected, setSelected] = useState<Loan | null>(null);
  const [condition, setCondition] = useState("good");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const load = useCallback(async () => {
    try {
      setLoans(
        (await request<Loan[]>("/staff/equipment/loans")).filter(
          (l) => !l.returned_at,
        ),
      );
    } catch (e) {
      setError(message(e));
    }
  }, []);
  useEffect(() => {
    request<Loan[]>("/staff/equipment/loans")
      .then((rows) => setLoans(rows.filter((l) => !l.returned_at)))
      .catch((e) => setError(message(e)));
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await request(`/staff/equipment/loans/${selected.id}/return`, {
        method: "POST",
        body: JSON.stringify({
          condition,
          damaged_quantity:
            condition === "damaged" ? Number(data.get("damaged_quantity")) : 0,
          notes: data.get("notes"),
        }),
      });
      setSuccess("Devolução registrada e estoque atualizado.");
      setSelected(null);
      await load();
    } catch (err) {
      setError(message(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <AppShell
      role="funcionario"
      title="Devolução de equipamentos"
      user={{ name: user?.name ?? "", course: "Funcionário" }}
    >
      <div className="max-w-3xl space-y-5">
        <Link className="text-blue-700" href="/funcionario/equipamentos">
          Voltar aos equipamentos
        </Link>
        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="text-emerald-800">
            {success}
          </p>
        )}
        <div className="space-y-3">
          {loans.map((l) => (
            <article key={l.id} className="rounded-xl border bg-white p-4">
              <h2 className="font-semibold">
                {l.name} · {l.quantity} unidade(s)
              </h2>
              <p>
                {l.full_name} · prazo{" "}
                {new Date(l.due_at).toLocaleString("pt-BR")}
              </p>
              {l.late && <p className="text-red-700">Em atraso</p>}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelected(l);
                  setCondition("good");
                }}
              >
                Registrar devolução #{l.id}
              </Button>
            </article>
          ))}
          {!loans.length && <p>Nenhuma retirada pendente.</p>}
        </div>
        {selected && (
          <form
            onSubmit={submit}
            className="space-y-4 rounded-2xl border bg-white p-6"
          >
            <h2 className="font-semibold">
              Devolução #{selected.id}: {selected.name}
            </h2>
            <Select
              name="condition"
              label="Estado do equipamento"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="good">Bom estado</option>
              <option value="damaged">Com avaria</option>
            </Select>
            {condition === "damaged" && (
              <Input
                name="damaged_quantity"
                label="Unidades avariadas"
                type="number"
                min={1}
                max={selected.quantity}
                required
              />
            )}
            <Textarea
              name="notes"
              label="Observações"
              maxLength={2000}
              required={condition === "damaged"}
            />
            <Button type="submit" loading={busy}>
              Confirmar devolução
            </Button>
          </form>
        )}
      </div>
    </AppShell>
  );
}
