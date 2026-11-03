"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { request, message, asISO } from "@/lib/sprint-api";
import { useAuthUser } from "@/lib/use-auth-user";
type Equipment = {
  id: number;
  name: string;
  category: string;
  available: number;
};
export default function Page() {
  const user = useAuthUser();
  const [items, setItems] = useState<Equipment[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const load = useCallback(async () => {
    try {
      setItems(await request<Equipment[]>("/staff/equipment"));
    } catch (e) {
      setError(message(e));
    }
  }, []);
  useEffect(() => {
    request<Equipment[]>("/staff/equipment")
      .then(setItems)
      .catch((e) => setError(message(e)));
  }, []);
  async function submit(
    event: React.FormEvent<HTMLFormElement>,
    create = false,
  ) {
    event.preventDefault();
    const form = event.currentTarget;
    const d = new FormData(form);
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await request(create ? "/staff/equipment" : "/staff/equipment/loans", {
        method: "POST",
        body: JSON.stringify(
          create
            ? {
                name: d.get("name"),
                category: d.get("category"),
                quantity: Number(d.get("quantity")),
              }
            : {
                equipment_id: Number(d.get("equipment_id")),
                registration: d.get("registration"),
                quantity: Number(d.get("quantity")),
                due_at: asISO(d.get("due_at")),
              },
        ),
      });
      setSuccess(create ? "Equipamento cadastrado." : "Retirada registrada.");
      form.reset();
      await load();
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <AppShell
      role="funcionario"
      title="Retirada de equipamentos"
      user={{ name: user?.name ?? "", course: "Funcionário" }}
    >
      <div className="max-w-3xl space-y-6">
        <nav className="flex gap-4 text-blue-700">
          <Link href="/funcionario/equipamentos/devolucoes">Devoluções</Link>
          <Link href="/funcionario/equipamentos/ocorrencias">
            Atrasos e avarias
          </Link>
        </nav>
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
        <form
          onSubmit={(e) => submit(e)}
          className="space-y-4 rounded-2xl border bg-white p-6"
        >
          <h2 className="font-semibold">Registrar retirada</h2>
          <Select
            name="equipment_id"
            label="Equipamento"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Selecione
            </option>
            {items.map((i) => (
              <option key={i.id} value={i.id} disabled={!i.available}>
                {i.name} · {i.available} disponíveis
              </option>
            ))}
          </Select>
          <Input
            name="registration"
            label="Matrícula do solicitante"
            required
          />
          <Input
            name="quantity"
            label="Quantidade"
            type="number"
            min={1}
            required
          />
          <Input
            name="due_at"
            label="Prazo de devolução"
            type="datetime-local"
            required
          />
          <Button type="submit" loading={busy}>
            Confirmar retirada
          </Button>
        </form>
        <details className="rounded-2xl border bg-white p-6">
          <summary className="cursor-pointer font-semibold">
            Cadastrar equipamento
          </summary>
          <form onSubmit={(e) => submit(e, true)} className="mt-4 space-y-4">
            <Input name="name" label="Nome" required minLength={2} />
            <Input name="category" label="Categoria" required minLength={2} />
            <Input
              name="quantity"
              label="Quantidade total"
              type="number"
              min={1}
              max={10000}
              required
            />
            <Button type="submit" loading={busy}>
              Cadastrar
            </Button>
          </form>
        </details>
      </div>
    </AppShell>
  );
}
