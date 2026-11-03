import Link from "next/link";
import { Film, MapPin, Users } from "lucide-react";

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
  const spots = slots - enrolled;
  const inner = (
    <div
      className="relative overflow-hidden rounded-[4px] p-5 bg-white border border-[#E2E8F0] text-[#0B1B3F] transition-colors duration-200 hover:border-[#004AF7] h-full flex flex-col"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-sm font-medium text-[#004AF7]">{type}</span>
        <div className="text-right text-xs text-[#667085]">
          <p>{new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "America/Fortaleza" })}</p>
          <p className="font-semibold text-[#0B1B3F]">{time}</p>
        </div>
      </div>
      <h3 className={`font-semibold text-[#0B1B3F] leading-snug mb-3 ${compact ? "text-sm line-clamp-2" : "text-base"}`}>{title}</h3>
      <div className="space-y-1.5 text-xs text-[#3D4A66] flex-1">
        <div className="flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 flex-shrink-0 text-[#667085]" aria-hidden />
          <span className="line-clamp-1">{film}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#667085]" aria-hidden />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 flex-shrink-0 text-[#667085]" aria-hidden />
          <span className={spots > 0 ? undefined : "font-semibold text-[#B42318]"}>{spots > 0 ? `${spots} vagas` : "Lotado"}</span>
        </div>
      </div>
      {!hideCta && href && (
        <span className="inline-flex items-center justify-center w-full mt-4 h-8 px-3 rounded-[4px] text-xs font-medium bg-white text-[#004AF7] border border-[#E2E8F0]">
          Ver detalhes
        </span>
      )}
    </div>
  );

  if (href && !compact) {
    return (
      <Link href={href} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#004AF7] rounded-[4px]">
        {inner}
      </Link>
    );
  }
  return inner;
}
