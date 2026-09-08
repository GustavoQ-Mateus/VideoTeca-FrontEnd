import { notFound } from "next/navigation";
import Link from "next/link";
import { Film } from "lucide-react";
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
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0066B3] rounded-[8px] flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-white" aria-hidden />
            </div>
            <span className="text-sm font-bold text-[#003A70]">Videoteca Unifor</span>
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
      </div>
    </div>
  );
}
