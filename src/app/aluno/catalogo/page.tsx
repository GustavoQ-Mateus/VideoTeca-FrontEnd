"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fetchCatalogFilms, student } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";
import { useAuthUser } from "@/lib/use-auth-user";
import { Poster } from "../_components/Poster";
import type { FilmRecord } from "@/lib/types";
import {
  Search, SlidersHorizontal, ChevronDown, Film,
  X, Play,
} from "lucide-react";

const GENRES   = ["Todos", "Drama", "Comédia", "Thriller", "Documentário", "Animação"];
const STATUSES = ["Todos", "Disponível", "Emprestado", "Reservado"];
const MEDIAS   = ["Todos", "DVD", "Blu-ray", "Digital"];

function FilmPreview({ film, onClose }: { film: FilmRecord; onClose: () => void }) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const reserve = async () => {
    setBusy(true);
    try {
      await student.reserve(film.id);
      toast({ title: "Reserva registrada", description: `${film.title}: retire no balcão da Videoteca.`, variant: "success" });
    } catch (e) {
      toast({ title: "Não foi possível reservar", description: e instanceof Error ? e.message : undefined, variant: "error" });
    } finally {
      setBusy(false);
    }
  };
  return (
    <aside
      className="split-panel h-full flex flex-col motion-right"
      aria-label="Detalhes do filme"
    >
      <div className="relative bg-[#EBF0FF] h-40 flex-shrink-0">
        {film.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={film.cover}
            alt={`Cartaz de ${film.title}`}
            width={500}
            height={750}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="w-12 h-12 text-[#004AF7]" aria-hidden />
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-[4px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0B1B3F] hover:bg-[#F2F5FB] transition-colors focus-visible:outline-2 focus-visible:outline-[#004AF7]"
          aria-label="Fechar painel"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div>
          <Badge status={film.status} />
          <h2 className="text-lg font-bold text-[#0B1B3F] mt-2 leading-snug">{film.title}</h2>
          {film.originalTitle && (
            <p className="text-xs text-[#667085] mt-0.5 italic">{film.originalTitle}</p>
          )}
        </div>

        <dl className="space-y-2 text-sm">
          {[
            { label: "Diretor",       value: film.director },
            { label: "Ano",           value: film.year },
            { label: "Gênero",        value: film.genre },
            { label: "Duração",       value: film.duration },
            { label: "Idioma",        value: film.language },
            { label: "Legenda",       value: film.subtitles ?? "—" },
            { label: "Mídia",         value: film.media },
            { label: "Localização",   value: film.location },
            { label: "Classificação", value: film.rating },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-baseline gap-4">
              <dt className="text-xs text-[#667085] flex-shrink-0">{label}</dt>
              <dd className="text-xs font-medium text-[#0B1B3F] text-right">{String(value)}</dd>
            </div>
          ))}
        </dl>

        {film.synopsis && (
          <div>
            <h3 className="text-xs font-semibold text-[#0B1B3F] mb-1.5">Sinopse</h3>
            <p className="text-xs text-[#667085] leading-relaxed">{film.synopsis}</p>
          </div>
        )}

        {film.cast && (
          <div>
            <h3 className="text-xs font-semibold text-[#0B1B3F] mb-1.5">Elenco</h3>
            <p className="text-xs text-[#667085]">{film.cast}</p>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 mt-auto bg-white border-t border-[#E2E8F0] p-4 flex gap-2">
        <Button className="flex-1 gap-2" disabled={film.status !== "available" || busy} onClick={reserve}>
          <Play className="w-3.5 h-3.5" aria-hidden />
          {busy ? "Reservando…" : "Reservar"}
        </Button>
        <Link href={`/aluno/catalogo/${film.id}`}>
          <Button variant="ghost" className="gap-1 text-xs">Ver tudo</Button>
        </Link>
      </div>
    </aside>
  );
}

export default function StudentCatalog() {
  const user = useAuthUser();
  const [films,          setFilms]          = useState<FilmRecord[]>([]);
  const [query,          setQuery]          = useState("");
  const [selectedGenre,  setSelectedGenre]  = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [selectedMedia,  setSelectedMedia]  = useState("Todos");
  const [sort,           setSort]           = useState("recentes");
  const [preview,        setPreview]        = useState<FilmRecord | null>(null);

  useEffect(() => {
    fetchCatalogFilms().then(setFilms);
  }, []);

  const filtered = films.filter(f => {
    const q = query.toLowerCase();
    const matchQuery  = !q || f.title.toLowerCase().includes(q) || f.director.toLowerCase().includes(q);
    const matchGenre  = selectedGenre  === "Todos" || f.genre === selectedGenre;
    const matchStatus = selectedStatus === "Todos" ||
      (selectedStatus === "Disponível" && f.status === "available") ||
      (selectedStatus === "Emprestado" && f.status === "borrowed")  ||
      (selectedStatus === "Reservado"  && f.status === "reserved");
    const matchMedia  = selectedMedia  === "Todos" || f.media === selectedMedia;
    return matchQuery && matchGenre && matchStatus && matchMedia;
  });

  function clearFilters() {
    setQuery(""); setSelectedGenre("Todos");
    setSelectedStatus("Todos"); setSelectedMedia("Todos");
  }

  return (
    <AppShell role="aluno" title="Catálogo de Filmes" user={{ name: user?.name ?? "", course: user?.course ?? "" }}>

      <div className="mb-5 motion-up">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar por título, diretor ou gênero..."
              className="w-full h-10 pl-9 pr-3 rounded-[4px] border border-[#E2E8F0] bg-white text-sm text-[#0B1B3F] placeholder:text-[#667085] focus:outline-none focus:border-[#004AF7] transition-colors"
              aria-label="Buscar filmes no acervo"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5 motion-up stagger-1">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por gênero">
          {GENRES.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              aria-pressed={selectedGenre === g}
              className={`px-2.5 py-1 rounded-[4px] text-xs font-medium transition-colors ${
                selectedGenre === g
                  ? "bg-[#004AF7] text-white"
                  : "bg-white border border-[#E2E8F0] text-[#667085] hover:border-[#004AF7] hover:text-[#004AF7]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="flex gap-2 ml-auto items-center">
          {[
            { value: selectedStatus, setter: setSelectedStatus, opts: STATUSES, label: "Disponibilidade" },
            { value: selectedMedia,  setter: setSelectedMedia,  opts: MEDIAS,   label: "Mídia" },
          ].map(({ value, setter, opts, label }) => (
            <div key={label} className="relative">
              <select
                value={value}
                onChange={e => setter(e.target.value)}
                className="appearance-none h-8 pl-2.5 pr-7 rounded-[4px] border border-[#E2E8F0] bg-white text-xs text-[#667085] focus:outline-none focus:border-[#004AF7] cursor-pointer"
                aria-label={label}
              >
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#667085] pointer-events-none" aria-hidden />
            </div>
          ))}
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none h-8 pl-2.5 pr-7 rounded-[4px] border border-[#E2E8F0] bg-white text-xs text-[#667085] focus:outline-none focus:border-[#004AF7] cursor-pointer"
              aria-label="Ordenar por"
            >
              <option value="recentes">Mais recentes</option>
              <option value="procurados">Mais procurados</option>
              <option value="alfa">A–Z</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#667085] pointer-events-none" aria-hidden />
          </div>
        </div>
      </div>

      <p className="text-xs text-[#667085] mb-4">
        <span className="font-semibold text-[#0B1B3F]">{filtered.length}</span> título{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
      </p>

      <div className="split-layout -mx-4 sm:-mx-6 lg:mx-0 border-t border-[#E2E8F0]">
        <div className="split-main px-4 sm:px-6 lg:px-0 lg:pr-6 py-4">
          {filtered.length > 0 ? (
            <ul
              className={`grid gap-x-4 gap-y-6 grid-cols-2 sm:grid-cols-3 ${
                preview ? "md:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-4 xl:grid-cols-5"
              }`}
              role="list"
            >
              {filtered.map(film => {
                const selected = preview?.id === film.id;
                return (
                  <li key={film.id}>
                    <button
                      onClick={() => setPreview(prev => prev?.id === film.id ? null : film)}
                      className="group w-full text-left rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004AF7]"
                      aria-pressed={selected}
                      aria-label={`Ver detalhes de ${film.title}`}
                    >
                      <Poster
                        src={film.cover}
                        alt={`Cartaz de ${film.title}`}
                        className={`w-full aspect-[2/3] border transition-colors ${
                          selected
                            ? "border-[#004AF7] outline-2 outline-[#004AF7]"
                            : "border-[#E2E8F0] group-hover:border-[#004AF7]"
                        }`}
                        iconClassName="w-8 h-8"
                        width={300}
                        height={450}
                      />
                      <p className={`mt-2 text-sm font-medium leading-snug line-clamp-2 transition-colors ${
                        selected ? "text-[#004AF7]" : "text-[#0B1B3F] group-hover:text-[#004AF7]"
                      }`}>
                        {film.title}
                      </p>
                      <p className="text-xs text-[#667085] mt-0.5">
                        {film.year}{film.media ? ` · ${film.media}` : ""}
                      </p>
                      <div className="mt-1.5"><Badge status={film.status} /></div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <SlidersHorizontal className="w-8 h-8 text-[#004AF7]/40 mb-3" aria-hidden />
              <p className="font-medium text-[#0B1B3F] text-sm">Nenhum resultado encontrado</p>
              <p className="text-xs text-[#667085] mt-1">Tente ajustar os filtros ou buscar outro termo.</p>
              <Button variant="outline" className="mt-4 text-xs h-8" onClick={clearFilters}>
                Limpar filtros
              </Button>
            </div>
          )}
        </div>

        {preview && (
          <FilmPreview film={preview} onClose={() => setPreview(null)} />
        )}

        {!preview && (
          <div className="split-panel hidden lg:flex flex-col items-center justify-center text-center p-8 gap-3">
            <Film className="w-10 h-10 text-[#E2E8F0]" aria-hidden />
            <p className="text-sm font-medium text-[#667085]">Selecione um título</p>
            <p className="text-xs text-[#98A2B3]">Clique em um filme para ver os detalhes e opções de reserva</p>
          </div>
        )}
      </div>

    </AppShell>
  );
}
