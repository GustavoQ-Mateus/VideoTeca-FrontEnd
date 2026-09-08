import Link from "next/link";
import { notFound } from "next/navigation";
import { Film, MapPin, Users, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { EventRecord } from "@/lib/types";

function getEventById(_id: number): EventRecord | undefined { return undefined; }

const NAV_LINKS = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Eventos", href: "/eventos" },
  { label: "Sobre", href: "/sobre" },
] as const;

export default async function PublicEventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const num = Number(id);
  if (Number.isNaN(num)) notFound();
  const event = getEventById(num);
  if (!event) notFound();

  const spots = event.slots - event.enrolled;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0066B3] rounded-[8px] flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-white" aria-hidden />
            </div>
            <span className="text-sm font-bold text-[#003A70]">Videoteca Unifor</span>
          </Link>
          <nav className="hidden md:flex gap-1 ml-6" aria-label="Navegação">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="px-3 py-2 text-sm text-[#667085] hover:text-[#172033] rounded-[8px] font-medium">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto">
            <Link href="/login">
              <Button size="sm">Entrar para se inscrever</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative h-48 sm:h-64 bg-gradient-to-br from-[#003A70] to-violet-700">
        <div className="absolute inset-0 flex items-end p-6 sm:p-10 max-w-7xl mx-auto w-full">
          <div>
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full">
              {event.type}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white max-w-3xl leading-tight">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-8 relative z-10 pb-16">
        <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-lg p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex gap-2 text-[#667085]">
              <Film className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="text-xs font-semibold uppercase">Filme</p>
                <p className="text-[#172033] font-medium">{event.film}</p>
              </div>
            </div>
            <div className="flex gap-2 text-[#667085]">
              <Calendar className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="text-xs font-semibold uppercase">Data e horário</p>
                <p className="text-[#172033] font-medium">
                  {new Date(event.date).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} · {event.time}
                </p>
              </div>
            </div>
            <div className="flex gap-2 text-[#667085]">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="text-xs font-semibold uppercase">Local</p>
                <p className="text-[#172033] font-medium">{event.location}</p>
              </div>
            </div>
            <div className="flex gap-2 text-[#667085]">
              <Users className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="text-xs font-semibold uppercase">Vagas</p>
                <p className="text-[#172033] font-medium">{spots > 0 ? `${spots} disponíveis` : "Lotado"}</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#172033] mb-2">Sobre o evento</h2>
            <p className="text-[#667085] leading-relaxed">{event.description}</p>
          </div>
          {event.certificate && (
            <div className="flex gap-2 rounded-[12px] bg-[#E8F2FC] border border-[#0066B3]/20 px-4 py-3 text-sm text-[#0066B3]">
              <Award className="w-5 h-5 flex-shrink-0" aria-hidden />
              <span>Certificado de participação disponível mediante presença e check-in.</span>
            </div>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/login">
              <Button size="lg" disabled={spots <= 0}>
                {spots <= 0 ? "Inscrições encerradas" : "Inscrever-se (login)"}
              </Button>
            </Link>
            <Link href="/eventos">
              <Button size="lg" variant="outline">
                Voltar aos eventos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
