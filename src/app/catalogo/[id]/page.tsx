import { notFound } from "next/navigation";
import Link from "next/link";
import { TMDB_NOTICE, Wordmark } from "@/components/catalog/Brand";
import { fetchFilmById } from "@/lib/api";
import { FilmDetailView } from "@/components/catalog/FilmDetailView";
import { Button } from "@/components/ui/Button";

export default async function PublicFilmDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const num = Number(id);
  if (Number.isNaN(num)) notFound();
  const film = await fetchFilmById(num);
  if (!film) notFound();

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <Link href="/" aria-label="Videoteca Unifor — início">
            <Wordmark />
          </Link>
          <div className="ml-auto flex gap-2">
            <Link href="/catalogo">
              <Button variant="ghost" size="sm">Catálogo</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Entrar</Button>
            </Link>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <FilmDetailView
          film={film}
          mode="public"
          backHref="/catalogo"
          breadcrumbItems={[
            { label: "Início", href: "/" },
            { label: "Catálogo", href: "/catalogo" },
            { label: film.title },
          ]}
        />
        <p className="mt-6 text-xs text-[#667085]">{TMDB_NOTICE}</p>
      </div>
    </div>
  );
}
