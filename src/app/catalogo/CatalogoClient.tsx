"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { FilmRecord } from "@/lib/types";
import { PosterFallback, TMDB_NOTICE, Wordmark } from "@/components/catalog/Brand";

const BASE_GENRES = ["Drama", "Comédia", "Thriller", "Documentário", "Animação"];

export function PublicCatalogClient({ initialFilms }: { initialFilms: FilmRecord[] }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Todos");
  // Gêneros fixos + os que existem de fato no acervo carregado.
  const GENRES = ["Todos", ...Array.from(new Set([...BASE_GENRES, ...initialFilms.map((f) => f.genre).filter(Boolean)]))];

  const filtered = initialFilms.filter((f) => {
    const q = query.toLowerCase();
    return (
      (!q || f.title.toLowerCase().includes(q) || f.director.toLowerCase().includes(q)) &&
      (genre === "Todos" || f.genre === genre)
    );
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/" aria-label="Videoteca Unifor — início">
            <Wordmark />
          </Link>
          <span className="text-[#E2E8F0]">/</span>
          <span className="text-sm text-[#667085]">Catálogo Público</span>
          <div className="ml-auto">
            <Link href="/login">
              <Button size="sm">Entrar para reservar</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-[#004AF7] py-10">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-white mb-2">Catálogo do Acervo</h1>
          <p className="text-white/80 mb-6">
            Explore os {initialFilms.length} títulos disponíveis. Faça login para reservar.
          </p>
          <div className="bg-white rounded-[4px] p-1.5 flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por título, diretor..."
                className="w-full h-10 pl-9 pr-3 text-sm text-[#0B1B3F] placeholder:text-[#667085] outline-none rounded-[4px]"
                aria-label="Buscar no catálogo"
              />
            </div>
            <Button size="sm">Buscar</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 py-8 flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por gênero">
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGenre(g)}
                aria-pressed={genre === g}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-medium transition-colors ${
                  genre === g ? "bg-[#004AF7] text-white" : "bg-white border border-[#E2E8F0] text-[#667085] hover:border-[#004AF7]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#667085]" aria-hidden />
            <span className="text-sm text-[#667085]">
              {filtered.length} título{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#EBF0FF] border border-[#004AF7]/20 rounded-[4px] px-4 py-2.5 mb-6 text-sm text-[#004AF7]">
          <Info className="w-4 h-4 flex-shrink-0" aria-hidden />
          <span>
            Para reservar um título,{" "}
            <Link href="/login" className="font-semibold underline">
              faça login com sua matrícula Unifor
            </Link>
            .
          </span>
        </div>

        {filtered.length === 0 && (
          <p className="text-sm text-[#667085] py-8">Nenhum título encontrado para esta busca.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6">
          {filtered.map((film) => (
            <div
              key={film.id}
              className="group flex flex-col"
            >
              <Link
                href={`/catalogo/${film.id}`}
                className="block rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004AF7] focus-visible:ring-offset-2"
              >
                <div
                  className="relative rounded-[4px] overflow-hidden bg-[#EBF0FF] border border-[#E2E8F0] group-hover:border-[#004AF7] transition-colors"
                  style={{ aspectRatio: "2/3" }}
                >
                  {film.cover ? (
                    <img
                      src={film.cover}
                      alt={`Cartaz de ${film.title}`}
                      width={500}
                      height={750}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <PosterFallback />
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="bg-[#0B1B3F] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px]">{film.media}</span>
                  </div>
                </div>
                <div className="pt-2.5">
                  <p className="font-semibold text-[#0B1B3F] text-sm leading-tight line-clamp-2 group-hover:text-[#004AF7]">{film.title}</p>
                  <p className="text-xs text-[#667085] mt-0.5 line-clamp-1">
                    {film.year} · {film.director}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <Badge status={film.status} size="sm" />
                    <span className="text-[11px] text-[#667085]">{film.genre}</span>
                  </div>
                </div>
              </Link>
              <div className="pt-2.5 mt-auto">
                <Link href="/login" className="block w-full">
                  <Button
                    size="sm"
                    variant={film.status === "available" ? "primary" : "ghost"}
                    className="w-full text-xs h-8"
                    disabled={film.status !== "available"}
                  >
                    {film.status === "available" ? "Reservar (login)" : "Indisponível"}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-[#E2E8F0] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-xs text-[#667085]">{TMDB_NOTICE}</p>
        </div>
      </footer>
    </div>
  );
}
