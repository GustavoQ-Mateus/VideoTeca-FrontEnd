"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import type { FilmRecord } from "@/lib/types";

function getFilmById(_id: number): FilmRecord | undefined { return undefined; }
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable, Column } from "@/components/ui/DataTable";

const STAFF = { name: "Carla Nogueira", course: "Funcionária" };

const COPIES = [
  { id: "DVD-001", patrimonio: "PAT-8821", state: "Bom", status: "borrowed" },
  { id: "DVD-002", patrimonio: "PAT-8822", state: "Bom", status: "available" },
  { id: "DVD-003", patrimonio: "PAT-8823", state: "Marcas leves", status: "maintenance" },
];

type Row = (typeof COPIES)[0];

export default function CopiasMaterialPage() {
  const params = useParams();
  const filmId = Number(params.id);
  const film = getFilmById(filmId);

  const columns: Column<Row>[] = [
    { key: "c", header: "Código", render: (r) => r.id },
    { key: "p", header: "Patrimônio", render: (r) => r.patrimonio },
    { key: "e", header: "Conservação", render: (r) => r.state },
    { key: "s", header: "Status", render: (r) => <Badge status={r.status} /> },
    {
      key: "a",
      header: "Ações",
      render: () => (
        <Button size="sm" variant="outline">
          Editar
        </Button>
      ),
    },
  ];

  return (
    <AppShell role="funcionario" title={film ? `Cópias — ${film.title}` : "Cópias"} user={STAFF}>
      <div className="mb-4">
        <Link href="/funcionario/acervo">
          <Button variant="ghost" size="sm">
            ← Acervo
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={COPIES} rowKey={(r) => r.id} />
    </AppShell>
  );
}
