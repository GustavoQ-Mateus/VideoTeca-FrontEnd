"use client";
import Link from "next/link";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { BookOpen, Film, Heart } from "lucide-react";

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

export function FilmCard({ id, title, director, year, genre, duration, media, status, cover, compact, detailHref, onReserve, onDetails }: FilmCardProps) {
  const canReserve = status === "available";

  return (
    <div className="bg-white rounded-[4px] border border-[#E2E8F0] hover:border-[#004AF7] transition-colors overflow-hidden group">
      {/* Cover */}
      <div className="relative overflow-hidden bg-[#EBF0FF]" style={{ aspectRatio: "2/3" }}>
        {cover ? (
          <img
            src={cover}
            alt={`Cartaz de ${title}`}
            width={500}
            height={750}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" aria-hidden>
            <Film className="w-10 h-10 text-[#004AF7]" strokeWidth={1.5} />
          </div>
        )}
        {/* Media badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-[#0B1B3F] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px]">
            {media}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="p-4 flex flex-col gap-2">
        <div>
          <h3 className="font-semibold text-[#0B1B3F] text-sm leading-tight line-clamp-2">{title}</h3>
          <p className="text-xs text-[#667085] mt-0.5">{director} · {year}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge status={status} size="sm" />
          <span className="text-[11px] text-[#667085]">{genre} · {duration}</span>
        </div>
        {/* Actions (sem sobreposição na imagem) */}
        <div className="flex items-center gap-2">
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
            type="button"
            className="w-8 h-8 rounded-[4px] border border-[#E2E8F0] flex items-center justify-center text-[#667085] hover:border-[#004AF7] hover:text-[#004AF7] transition-colors"
            aria-label={`Favoritar ${title}`}
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
        {detailHref ? (
          <Link
            href={detailHref}
            className="inline-flex w-full items-center justify-center gap-2 font-medium transition-colors duration-200 text-sm px-4 py-2.5 rounded-[4px] border border-[#E2E8F0] bg-transparent text-[#667085] hover:border-[#004AF7] hover:text-[#004AF7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#004AF7] text-xs"
          >
            Ver detalhes
          </Link>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="w-full text-xs border border-[#E2E8F0] hover:border-[#004AF7]"
            onClick={() => onDetails?.(id)}
          >
            Ver detalhes
          </Button>
        )}
      </div>
    </div>
  );
}
