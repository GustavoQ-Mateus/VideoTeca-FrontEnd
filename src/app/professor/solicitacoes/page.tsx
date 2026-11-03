"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { DataTable, Column } from "@/components/ui/DataTable";
import { professor as api } from "@/lib/api";
import { useAuthUser } from "@/lib/use-auth-user";

type Row = {
  id: number;
  request_type: string;
  payload?: { film_title?: string; room_name?: string };
  status: string;
  staff_notes: string;
  created_at: string;
};

const columns: Column<Row>[] = [
  {
    key: "t",
    header: "Tipo",
    render: (r) => (r.request_type === "film" ? "Filme" : "Sala"),
  },
  {
    key: "item",
    header: "Item",
    render: (r) => r.payload?.film_title ?? r.payload?.room_name ?? "—",
  },
  {
    key: "date",
    header: "Data",
    render: (r) => new Date(r.created_at).toLocaleDateString("pt-BR"),
  },
  { key: "note", header: "Obs.", render: (r) => r.staff_notes ?? "—" },
  { key: "s", header: "Status", render: (r) => <Badge status={r.status} /> },
];

export default function ProfessorSolicitacoesPage() {
  const user = useAuthUser();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    api.requests().then((d) => d && setRows(d));
  }, []);

  return (
    <AppShell
      role="professor"
      title="Minhas Solicitações"
      user={{ name: user?.name ?? "", course: user?.course ?? "" }}
    >
      <DataTable<Row>
        columns={columns}
        data={rows}
        rowKey={(row) => row.id}
        empty={<p>Nenhuma solicitação ainda</p>}
      />
    </AppShell>
  );
}
