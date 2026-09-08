"use client";
import { useState } from "react";
import Link from "next/link";
import { Clock, Film, Globe, MapPin, Subtitles, Users, Heart, BookOpen, Calendar } from "lucide-react";
import type { FilmRecord, EventRecord } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FilmCard } from "@/components/ui/FilmCard";
import { EventCard } from "@/components/ui/EventCard";
import { useToast } from "@/components/providers/ToastProvider";

interface FilmDetailViewProps {
  film: FilmRecord;
  mode: "public" | "aluno";
  backHref: string;
  breadcrumbItems: { label: string; href?: string }[];
  relatedFilms?: FilmRecord[];
  relatedEvents?: EventRecord[];
}

export function FilmDetailView({ film, mode, backHref, breadcrumbItems, relatedFilms = [], relatedEvents = [] }: FilmDetailViewProps) {
  const [avMode, setAvMode] = useState(false);
  const [reserving, setReserving] = useState(false);
  const { toast } = useToast();

  const related = relatedFilms;

  const base = avMode ? "bg-[var(--av-bg)] text-white min-h-[calc(100vh-4rem)]" : "bg-[#F5F7FA]";
  const card = avMode ? "bg-[var(--av-card)] border-[var(--av-muted)]/40 text-white" : "bg-white border-[#E2E8F0] text-[#172033]";

  function handleReserve() {
    if (mode === "public") return;
    setReserving(true);
    window.setTimeout(() => {
      setReserving(false);
      toast({ title: "Reserva solicitada", description: `${film.title} — retire em até 3 dias úteis.`, variant: "success" });
    }, 900);
  }

  return (
    <div className={`rounded-[18px] overflow-hidden transition-colors duration-300 ${base}`}>
      <div className={`px-4 sm:px-6 py-4 border-b ${avMode ? "border-white/10" : "border-[#E2E8F0]"}`}>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
          <Link href={backHref} className={`text-sm font-medium ${avMode ? "text-white/70 hover:text-white" : "text-[#0066B3] hover:underline"}`}>
            ← Voltar ao catálogo
          </Link>
          <button
            type="button"
            onClick={() => setAvMode(!avMode)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              avMode ? "border-white/30 text-white hover:bg-white/10" : "border-[#E2E8F0] text-[#667085] hover:border-[#0066B3]"
            }`}
          >
            Modo audiovisual {avMode ? "ligado" : "opcional"}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div
            className={`relative rounded-[20px] overflow-hidden border shadow-lg ${avMode ? "border-white/10" : "border-[#E2E8F0]"}`}
            style={{ aspectRatio: "2/3" }}
          >
            {film.cover ? (
              <img src={film.cover} alt={`Capa de ${film.title}`} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-[#003A70] to-[#0066B3] flex flex-col items-center justify-center p-6 text-center">
                <Film className="w-16 h-16 text-white/25 mb-3" aria-hidden />
                <p className="text-white font-bold text-lg leading-tight">{film.title}</p>
                <p className="text-white/60 text-sm mt-2">{film.year}</p>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <Badge status={film.status} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div>
            <h1 className={`text-3xl sm:text-4xl font-bold ${avMode ? "text-white" : "text-[#172033]"}`}>{film.title}</h1>
            {film.originalTitle && (
              <p className={`text-sm mt-1 ${avMode ? "text-white/60" : "text-[#667085]"}`}>Título original: {film.originalTitle}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${avMode ? "bg-white/10 text-white" : "bg-[#E8F2FC] text-[#0066B3]"}`}>
                {film.genre}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${avMode ? "border-white/20 text-white/80" : "border-[#E2E8F0] text-[#667085]"}`}>
                {film.duration}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${avMode ? "border-white/20 text-white/80" : "border-[#E2E8F0] text-[#667085]"}`}>
                {film.rating}
              </span>
            </div>
          </div>

          <div className={`rounded-[18px] border p-5 sm:p-6 ${card}`}>
            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${avMode ? "text-white/50" : "text-[#667085]"}`}>Sinopse</h2>
            <p className={`leading-relaxed ${avMode ? "text-white/85" : "text-[#667085]"}`}>{film.synopsis}</p>
          </div>

          <dl className={`grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-[18px] border p-5 ${card}`}>
            <div className="flex gap-2">
              <Users className={`w-4 h-4 mt-0.5 ${avMode ? "text-white/50" : "text-[#667085]"}`} aria-hidden />
              <div>
                <dt className={`text-xs font-medium ${avMode ? "text-white/50" : "text-[#667085]"}`}>Direção</dt>
                <dd className={`text-sm ${avMode ? "text-white" : "text-[#172033]"}`}>{film.director}</dd>
              </div>
            </div>
            <div className="flex gap-2">
              <Users className={`w-4 h-4 mt-0.5 ${avMode ? "text-white/50" : "text-[#667085]"}`} aria-hidden />
              <div>
                <dt className={`text-xs font-medium ${avMode ? "text-white/50" : "text-[#667085]"}`}>Elenco</dt>
                <dd className={`text-sm ${avMode ? "text-white" : "text-[#172033]"}`}>{film.cast}</dd>
              </div>
            </div>
            <div className="flex gap-2">
              <Globe className={`w-4 h-4 mt-0.5 ${avMode ? "text-white/50" : "text-[#667085]"}`} aria-hidden />
              <div>
                <dt className={`text-xs font-medium ${avMode ? "text-white/50" : "text-[#667085]"}`}>País / Idioma</dt>
                <dd className={`text-sm ${avMode ? "text-white" : "text-[#172033]"}`}>
                  {film.country} · {film.language}
                </dd>
              </div>
            </div>
            <div className="flex gap-2">
              <Subtitles className={`w-4 h-4 mt-0.5 ${avMode ? "text-white/50" : "text-[#667085]"}`} aria-hidden />
              <div>
                <dt className={`text-xs font-medium ${avMode ? "text-white/50" : "text-[#667085]"}`}>Legendas</dt>
                <dd className={`text-sm ${avMode ? "text-white" : "text-[#172033]"}`}>{film.subtitles ?? "—"}</dd>
              </div>
            </div>
            <div className="flex gap-2">
              <Film className={`w-4 h-4 mt-0.5 ${avMode ? "text-white/50" : "text-[#667085]"}`} aria-hidden />
              <div>
                <dt className={`text-xs font-medium ${avMode ? "text-white/50" : "text-[#667085]"}`}>Mídia</dt>
                <dd className={`text-sm ${avMode ? "text-white" : "text-[#172033]"}`}>{film.media}</dd>
              </div>
            </div>
            <div className="flex gap-2">
              <MapPin className={`w-4 h-4 mt-0.5 ${avMode ? "text-white/50" : "text-[#667085]"}`} aria-hidden />
              <div>
                <dt className={`text-xs font-medium ${avMode ? "text-white/50" : "text-[#667085]"}`}>Localização no acervo</dt>
                <dd className={`text-sm ${avMode ? "text-white" : "text-[#172033]"}`}>{film.location}</dd>
              </div>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Clock className={`w-4 h-4 mt-0.5 ${avMode ? "text-white/50" : "text-[#667085]"}`} aria-hidden />
              <div>
                <dt className={`text-xs font-medium ${avMode ? "text-white/50" : "text-[#667085]"}`}>Código interno</dt>
                <dd className={`text-sm font-mono ${avMode ? "text-white" : "text-[#172033]"}`}>{film.internalCode}</dd>
              </div>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3">
            {mode === "public" ? (
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  <BookOpen className="w-4 h-4" aria-hidden />
                  Entrar para reservar
                </Button>
              </Link>
            ) : (
              <Button size="lg" loading={reserving} disabled={film.status !== "available"} onClick={handleReserve} className="gap-2">
                <BookOpen className="w-4 h-4" aria-hidden />
                Reservar
              </Button>
            )}
            <Button size="lg" variant="outline" className="gap-2">
              <Heart className="w-4 h-4" aria-hidden />
              Favoritar
            </Button>
          </div>

          {related.length > 0 && (
            <section>
              <h2 className={`text-lg font-semibold mb-4 ${avMode ? "text-white" : "text-[#172033]"}`}>Relacionados</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {related.map((f) => (
                  <FilmCard
                    key={f.id}
                    {...f}
                    detailHref={mode === "aluno" ? `/aluno/catalogo/${f.id}` : `/catalogo/${f.id}`}
                  />
                ))}
              </div>
            </section>
          )}

          {relatedEvents.length > 0 && (
            <section>
              <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${avMode ? "text-white" : "text-[#172033]"}`}>
                <Calendar className="w-5 h-5" aria-hidden />
                Eventos relacionados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedEvents.map((e) => (
                  <Link
                    key={e.id}
                    href={mode === "aluno" ? `/aluno/eventos/${e.id}` : `/eventos/${e.id}`}
                    className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0066B3] rounded-[18px]"
                  >
                    <EventCard {...e} compact hideCta />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
