"use client";
import Link from "next/link";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { BookOpen, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilmCardProps {
  id: number;
  title: string;
  director: string;
  year: number;
  genre: string;
  duration: string;
  media: string;
  status: string;
  cover?: string;
  compact?: boolean;
  detailHref?: string;
  onReserve?: (id: number) => void;
  onDetails?: (id: number) => void;
}

const GENRE_COLORS: Record<string, string> = {
  Drama:        "bg-violet-100 text-violet-700",
  Comédia:      "bg-amber-100 text-amber-700",
  Thriller:     "bg-red-100 text-red-700",
  Documentário: "bg-teal-100 text-teal-700",
  Animação:     "bg-sky-100 text-sky-700",
};

export function FilmCard({ id, title, director, year, genre, duration, media, status, cover, compact, detailHref, onReserve, onDetails }: FilmCardProps) {
  const canReserve = status === "available";
  const genreColor = GENRE_COLORS[genre] ?? "bg-slate-100 text-slate-600";

  return (
    <div className="film-card bg-white rounded-[18px] border border-[#E2E8F0] overflow-hidden group">
      {/* Cover */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#E8F2FC] to-[#D0E6F8]" style={{ aspectRatio: "2/3" }}>
        {cover ? (
          <img
            src={cover}
            alt={`Capa do filme ${title}`}
            className="film-cover w-full h-full object-cover"
          />
        ) : (
          <div className="film-cover w-full h-full flex flex-col items-center justify-center gap-3 p-4">
            <div className="w-16 h-16 rounded-full bg-[#0066B3]/10 flex items-center justify-center">
              <Star className="w-8 h-8 text-[#0066B3]" />
            </div>
            <p className="text-xs font-medium text-[#0066B3]/70 text-center leading-tight">{title}</p>
          </div>
        )}
        {/* Overlay actions */}
        <div className="film-actions absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3 gap-2">
          <Button
            size="sm"
            variant={canReserve ? "primary" : "ghost"}
            disabled={!canReserve}
            className="flex-1 text-xs"
            onClick={() => canReserve && onReserve?.(id)}
            aria-label={canReserve ? `Reservar ${title}` : `${title} indisponível`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {canReserve ? "Reservar" : "Indisponível"}
          </Button>
          <button
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label={`Favoritar ${title}`}
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <Badge status={status} />
        </div>
        {/* Media badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
            {media}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="p-4 flex flex-col gap-2">
        <div>
          <h3 className="font-semibold text-[#172033] text-sm leading-tight line-clamp-2">{title}</h3>
          <p className="text-xs text-[#667085] mt-0.5">{director} · {year}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md", genreColor)}>{genre}</span>
          <span className="text-[10px] text-[#667085]">{duration}</span>
        </div>
        {detailHref ? (
          <Link
            href={detailHref}
            className="inline-flex w-full items-center justify-center gap-2 font-medium transition-all duration-200 text-sm px-4 py-2.5 rounded-[10px] border border-[#E2E8F0] bg-transparent text-[#667085] hover:border-[#0066B3] hover:text-[#0066B3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0066B3] text-xs"
          >
            Ver detalhes
          </Link>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="w-full text-xs border border-[#E2E8F0] hover:border-[#0066B3]"
            onClick={() => onDetails?.(id)}
          >
            Ver detalhes
          </Button>
        )}
      </div>
    </div>
  );
}
