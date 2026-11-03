import { notFound } from "next/navigation";
import { AlunoShell } from "../../_components/AlunoShell";
import { fetchFilmById } from "@/lib/api";
import { FilmDetailView } from "@/components/catalog/FilmDetailView";

export default async function StudentFilmDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const num = Number(id);
  if (Number.isNaN(num)) notFound();
  const film = await fetchFilmById(num);
  if (!film) notFound();

  return (
    <AlunoShell title={film.title} showSearch>
      <FilmDetailView
        film={film}
        mode="aluno"
        backHref="/aluno/catalogo"
        breadcrumbItems={[
          { label: "Dashboard", href: "/aluno" },
          { label: "Catálogo", href: "/aluno/catalogo" },
          { label: film.title },
        ]}
      />
    </AlunoShell>
  );
}
