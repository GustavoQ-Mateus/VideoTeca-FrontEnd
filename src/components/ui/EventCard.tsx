import Link from "next/link";
import { Film, MapPin, Users } from "lucide-react";

const TYPE_STYLES: Record<string, string> = {
  Cineclube: "from-amber-500/90 to-orange-600/90",
  Mostra: "from-violet-500/90 to-purple-700/90",
  Debate: "from-emerald-500/90 to-teal-700/90",
  Sessão: "from-sky-500/90 to-blue-700/90",
};

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  film: string;
  type: string;
  slots: number;
  enrolled: number;
  href?: string;
  compact?: boolean;
  hideCta?: boolean;
}

export function EventCard({ id, title, date, time, location, film, type, slots, enrolled, href, compact, hideCta }: EventCardProps) {
  const grad = TYPE_STYLES[type] ?? "from-[#003A70] to-[#0066B3]";
  const spots = slots - enrolled;
  const inner = (
    <div
      className={`relative overflow-hidden rounded-[18px] p-5 bg-gradient-to-br ${grad} text-white shadow-md hover:shadow-lg transition-shadow duration-200 h-full flex flex-col`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-full">{type}</span>
        <div className="text-right text-xs text-white/80">
          <p>{new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</p>
          <p className="font-semibold text-white">{time}</p>
        </div>
      </div>
      <h3 className={`font-semibold text-white leading-snug mb-3 ${compact ? "text-sm line-clamp-2" : "text-base"}`}>{title}</h3>
      <div className="space-y-1.5 text-xs text-white/75 flex-1">
        <div className="flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
          <span className="line-clamp-1">{film}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
          <span>{spots > 0 ? `${spots} vagas` : "Lotado"}</span>
        </div>
      </div>
      {!hideCta && href && (
        <span className="inline-flex items-center justify-center w-full mt-4 h-8 px-3 rounded-[10px] text-xs font-medium bg-white/20 text-white border border-white/30">
          Ver detalhes
        </span>
      )}
    </div>
  );

  if (href && !compact) {
    return (
      <Link href={href} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0066B3] rounded-[18px]">
        {inner}
      </Link>
    );
  }
  return inner;
}
