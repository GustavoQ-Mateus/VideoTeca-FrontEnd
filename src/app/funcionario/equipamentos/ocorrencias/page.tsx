"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { request, message } from "@/lib/sprint-api";
import { useAuthUser } from "@/lib/use-auth-user";
type Incident = {
  id: number;
  name: string;
  full_name: string;
  late: boolean;
  damaged_quantity: number;
  notes: string;
  returned_at: string | null;
};
export default function Page() {
  const user = useAuthUser();
  const [rows, setRows] = useState<Incident[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    request<Incident[]>("/staff/equipment/incidents")
      .then(setRows)
      .catch((e) => setError(message(e)))
      .finally(() => setLoading(false));
  }, []);
  return (
    <AppShell
      role="funcionario"
      title="Atrasos e avarias"
      user={{ name: user?.name ?? "", course: "Funcionário" }}
    >
      <div className="space-y-4">
        <Link className="text-blue-700" href="/funcionario/equipamentos">
          Voltar aos equipamentos
        </Link>
        {error && <p role="alert">{error}</p>}
        {loading ? (
          <p role="status">Carregando ocorrências…</p>
        ) : (
          !rows.length && <p>Nenhuma ocorrência.</p>
        )}
        {rows.map((r) => (
          <article key={r.id} className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold">
              #{r.id} · {r.name}
            </h2>
            <p>{r.full_name}</p>
            {r.late && (
              <p className="text-red-700">
                {r.returned_at ? "Devolvido com atraso" : "Em atraso"}
              </p>
            )}
            {r.damaged_quantity > 0 && (
              <p className="text-amber-800">
                {r.damaged_quantity} unidade(s) avariada(s), indisponíveis para
                retirada.
              </p>
            )}
            <p>{r.notes}</p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
