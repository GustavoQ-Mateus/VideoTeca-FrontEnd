import Link from "next/link";
import { Film, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { EventRecord } from "@/lib/types";

const EVENTS: EventRecord[] = [];
import { EventCard } from "@/components/ui/EventCard";

const NAV_LINKS = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Eventos", href: "/eventos" },
  { label: "Sobre", href: "/sobre" },
] as const;

export default function PublicEventsPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0066B3] rounded-[10px] flex items-center justify-center">
              <Film className="w-4 h-4 text-white" aria-hidden />
            </div>
            <span className="text-sm font-bold text-[#003A70]">Videoteca Unifor</span>
          </Link>
          <nav className="hidden md:flex gap-1 flex-1" aria-label="Navegação">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="px-3 py-2 text-sm text-[#667085] hover:text-[#172033] rounded-[8px] hover:bg-[#F5F7FA] font-medium">
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/login">
            <Button size="sm">Entrar</Button>
          </Link>
        </div>
      </header>

      <section className="bg-gradient-to-br from-violet-600 via-[#0066B3] to-[#003A70] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/70 text-sm font-medium uppercase tracking-wider mb-2">Programação cultural</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Eventos e cineclubes</h1>
          <p className="text-white/75 max-w-xl">Mostras, sessões comentadas e debates com identidade acadêmica Unifor.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENTS.map((e) => (
            <EventCard key={e.id} {...e} href={`/eventos/${e.id}`} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/catalogo" className="inline-flex items-center gap-1 text-[#0066B3] font-medium hover:underline">
            Explorar catálogo <ChevronRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
