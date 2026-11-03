import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Wordmark } from "@/components/catalog/Brand";
import { Button } from "@/components/ui/Button";
import { publishedEvents } from "@/lib/public-events";

export const dynamic = "force-dynamic";
import { EventCard } from "@/components/ui/EventCard";

const NAV_LINKS = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Eventos", href: "/eventos" },
  { label: "Sobre", href: "/sobre" },
] as const;

export default async function PublicEventsPage() {
  const EVENTS = await publishedEvents();
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <Link href="/" aria-label="Videoteca Unifor — início">
            <Wordmark />
          </Link>
          <nav className="hidden md:flex gap-1 flex-1" aria-label="Navegação">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm text-[#667085] hover:text-[#0B1B3F] rounded-[4px] hover:bg-[#F2F5FB] font-medium"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/login">
            <Button size="sm">Entrar</Button>
          </Link>
        </div>
      </header>

      <section className="bg-[#004AF7] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Eventos e cineclubes
          </h1>
          <p className="text-white/80 max-w-xl">
            Mostras, sessões comentadas e debates com identidade acadêmica
            Unifor.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!EVENTS.length && <p className="text-sm text-[#667085]">Nenhuma sessão publicada no momento.</p>}
          {EVENTS.map((e) => (
            <EventCard key={e.id} {...e} href={`/eventos/${e.id}`} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1 text-[#004AF7] font-medium hover:underline"
          >
            Explorar catálogo <ChevronRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
