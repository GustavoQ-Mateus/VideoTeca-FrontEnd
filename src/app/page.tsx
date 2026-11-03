import Link from "next/link";
import {
  Search, Film, BookOpen, Calendar, Users, ChevronRight,
  ArrowRight, MapPin, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PosterFallback, TMDB_NOTICE, Wordmark } from "@/components/catalog/Brand";

const NAV_LINKS = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Eventos", href: "/eventos" },
  { label: "Sobre", href: "/sobre" },
] as const;

const SERVICES = [
  { icon: Film,     label: "Acervo Audiovisual",   desc: "Títulos em DVD, Blu-ray e digital" },
  { icon: BookOpen, label: "Empréstimos",           desc: "Retire filmes para estudo e pesquisa acadêmica" },
  { icon: Calendar, label: "Eventos & Cineclubes",  desc: "Sessões comentadas, debates e mostras culturais" },
  { icon: Users,    label: "Salas de Exibição",     desc: "Salas equipadas para atividades acadêmicas" },
] as const;

type HomeFilm = {
  id: number;
  title: string;
  year: number;
  director: string;
  genre: string;
  cover?: string | null;
  backdrop?: string | null;
  status: string;
};

type HomeEvent = {
  id: number;
  title: string;
  event_type?: string;
  location?: string;
  starts_at: string;
  slots: number;
  enrolled: number;
};

const TZ = "America/Fortaleza";

async function loadFilms(): Promise<HomeFilm[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/catalog/films?limit=12`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as HomeFilm[];
    return Array.isArray(data) ? data.slice(0, 12) : [];
  } catch {
    return [];
  }
}

async function loadEvents(): Promise<HomeEvent[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/events`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as HomeEvent[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function eventTypeLabel(t?: string) {
  return t === "session" ? "Sessão" : (t ?? "Evento");
}

export default async function LandingPage() {
  const [featuredFilms, events] = await Promise.all([loadFilms(), loadEvents()]);
  const upcomingEvents = events.slice(0, 4);
  const heroFilms = featuredFilms.filter((f) => f.cover).slice(0, 6);
  const aboutFilm = featuredFilms.find((f) => f.backdrop);

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-6">
          <Link href="/" className="flex-shrink-0" aria-label="Videoteca Unifor — início">
            <Wordmark />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 flex-1" aria-label="Navegação principal">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href}
                className="px-3 py-1.5 text-sm text-[#667085] hover:text-[#0B1B3F] rounded-[4px] hover:bg-[#F2F5FB] transition-colors font-medium nav-link">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Acessar sistema</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero — Split layout ── */}
      <section
        className="relative overflow-hidden bg-[#004AF7]"
        aria-label="Apresentação da Videoteca"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[580px]">

            {/* Left — content */}
            <div className="flex flex-col justify-center py-16 lg:pr-12">
              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.15] mb-4 motion-up stagger-1">
                Cinema, cultura e<br />
                conhecimento na Unifor
              </h1>

              <p className="text-base text-white/80 mb-8 leading-relaxed max-w-md motion-up stagger-2">
                A Videoteca Unifor conecta alunos, professores e pesquisadores ao acervo audiovisual da universidade.
              </p>

              {/* Search */}
              <div className="flex gap-2 max-w-md motion-up stagger-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" aria-hidden />
                  <input
                    type="search"
                    placeholder="Buscar filmes, documentários..."
                    className="w-full h-11 pl-9 pr-3 text-sm rounded-[4px] bg-white border-0 outline-none text-[#0B1B3F] placeholder:text-[#667085] focus:ring-2 focus:ring-white/30"
                    aria-label="Buscar no acervo"
                  />
                </div>
                <Link href="/catalogo">
                  <Button size="sm" className="h-11 px-4">Buscar</Button>
                </Link>
              </div>
            </div>

            {/* Right — posters reais */}
            <div className="hidden lg:flex items-center justify-center py-10 pl-8 border-l border-white/10 motion-right">
              <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                {heroFilms.map((film, i) => (
                  <Link
                    key={film.id}
                    href={`/catalogo/${film.id}`}
                    className={`relative rounded-[4px] overflow-hidden bg-[#EBF0FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      i === 0 ? "col-span-2 row-span-2" : ""
                    }`}
                    style={{ aspectRatio: i === 0 ? "4/5" : "2/3" }}
                    aria-label={`Ver detalhes de ${film.title}`}
                  >
                    <img
                      src={film.cover ?? ""}
                      alt={`Cartaz de ${film.title}`}
                      width={500}
                      height={750}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Services — typographic list, no cards ── */}
      <section className="py-14 bg-white border-b border-[#E2E8F0]" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 id="services-heading" className="text-2xl font-bold text-[#0B1B3F] leading-tight">
                Serviços da Videoteca
              </h2>
              <p className="text-[#667085] mt-3 max-w-md text-sm leading-relaxed">
                Tudo que você precisa para pesquisa acadêmica, estudo e atividades culturais em um só lugar.
              </p>
            </div>
            <ul className="divide-y divide-[#E2E8F0]">
              {SERVICES.map(({ icon: Icon, label, desc }, i) => (
                <li
                  key={label}
                  className={`flex items-start gap-4 py-4 motion-up stagger-${i + 1}`}
                >
                  <Icon className="w-5 h-5 text-[#004AF7] flex-shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <p className="font-semibold text-[#0B1B3F] text-sm">{label}</p>
                    <p className="text-xs text-[#667085] mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Featured Films ── */}
      <section className="py-14 bg-[#F2F5FB]" aria-labelledby="films-heading">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <h2 id="films-heading" className="text-2xl font-bold text-[#0B1B3F]">Títulos Disponíveis</h2>
            <Link href="/catalogo" className="flex items-center gap-1 text-[#004AF7] text-sm font-medium hover:underline">
              Ver catálogo <ChevronRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>

          {featuredFilms.length === 0 ? (
            <p className="text-sm text-[#667085]">Catálogo temporariamente indisponível.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {featuredFilms.map((film, i) => (
                <Link
                  key={film.id}
                  href={`/catalogo/${film.id}`}
                  className={`group rounded-[4px] overflow-hidden bg-white border border-[#E2E8F0] hover:border-[#004AF7] transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004AF7] motion-up stagger-${Math.min(i + 1, 6)}`}
                  aria-label={`Ver detalhes de ${film.title}`}
                >
                  <div className="relative bg-[#EBF0FF]" style={{ aspectRatio: "2/3" }}>
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
                  </div>
                  <div className="p-2.5">
                    <p className="font-semibold text-[#0B1B3F] text-xs leading-snug line-clamp-1 group-hover:text-[#004AF7]">{film.title}</p>
                    <p className="text-[11px] text-[#667085] mt-0.5 line-clamp-1">{film.director} · {film.year}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Events — split layout ── */}
      <section className="py-14 bg-[#004AF7]" aria-labelledby="events-heading">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Left — header + CTA */}
            <div className="flex flex-col justify-between gap-8">
              <div>
                <h2 id="events-heading" className="text-2xl font-bold text-white">Próximos Eventos</h2>
                <p className="text-white/80 text-sm mt-2 leading-relaxed max-w-sm">
                  Cineclubes, sessões comentadas, debates acadêmicos e mostras culturais.
                </p>
              </div>
              <Link href="/eventos">
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 w-fit gap-2">
                  Ver agenda completa <ArrowRight className="w-4 h-4" aria-hidden />
                </Button>
              </Link>
            </div>

            {/* Right — event list */}
            <div className="divide-y divide-white/15">
              {upcomingEvents.length === 0 && (
                <p className="py-5 text-sm text-white/80">Nenhuma sessão publicada no momento.</p>
              )}
              {upcomingEvents.map(event => {
                const d = new Date(event.starts_at);
                const spots = event.slots - event.enrolled;
                return (
                  <Link
                    key={event.id}
                    href={`/eventos/${event.id}`}
                    className="flex gap-4 py-5 group hover:bg-white/5 -mx-4 px-4 rounded-[4px] transition-colors"
                  >
                    {/* Date block */}
                    <div className="flex-shrink-0 w-10 text-center">
                      <p className="text-lg font-bold text-white leading-none">
                        {d.toLocaleDateString("pt-BR", { day: "2-digit", timeZone: TZ })}
                      </p>
                      <p className="text-[11px] text-white/70 mt-0.5">
                        {d.toLocaleDateString("pt-BR", { month: "short", timeZone: TZ })}
                      </p>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[4px] border bg-white/10 text-white border-white/25">
                          {eventTypeLabel(event.event_type)}
                        </span>
                      </div>
                      <p className="font-semibold text-white text-sm leading-snug group-hover:underline">
                        {event.title}
                      </p>
                      <div className="flex flex-wrap gap-x-3 mt-2 text-[11px] text-white/70">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" aria-hidden />
                          {d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: TZ })}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" aria-hidden />{event.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" aria-hidden />
                          {spots > 0 ? `${spots} vagas` : "Lotado"}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white flex-shrink-0 self-center transition-colors" aria-hidden />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── About — split ── */}
      <section className="py-14 bg-white" aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="about-heading" className="text-2xl font-bold text-[#0B1B3F] mb-4">
                A Videoteca Unifor
              </h2>
              <p className="text-[#667085] leading-relaxed mb-8 text-sm max-w-lg">
                Vinculada à Biblioteca Central da Universidade de Fortaleza, a Videoteca mantém um acervo audiovisual e apoia atividades de ensino, pesquisa e extensão.
              </p>
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Acessar o sistema <ArrowRight className="w-4 h-4" aria-hidden />
                </Button>
              </Link>
            </div>

            {/* Visual column — cena real de um título do acervo */}
            {aboutFilm?.backdrop ? (
              <figure>
                <div className="relative rounded-[4px] overflow-hidden bg-[#EBF0FF]" style={{ aspectRatio: "16/9" }}>
                  <img
                    src={aboutFilm.backdrop}
                    alt={`Cena de ${aboutFilm.title}`}
                    width={1280}
                    height={720}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-xs text-[#667085]">
                  {aboutFilm.title} ({aboutFilm.year}), do acervo da Videoteca
                </figcaption>
              </figure>
            ) : (
              <div className="relative rounded-[4px] overflow-hidden min-h-[240px]">
                <PosterFallback iconClass="w-16 h-16" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0B1B3F] py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <Wordmark tone="light" className="block mb-3" />
              <p className="text-xs text-white/60 leading-relaxed">
                Universidade de Fortaleza<br />
                Av. Washington Soares, 1321 — Fortaleza/CE
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-3">Links</p>
              {[
                { label: "Catálogo", href: "/catalogo" },
                { label: "Eventos", href: "/eventos" },
                { label: "Sobre", href: "/sobre" },
                { label: "Contato", href: "mailto:videoteca@unifor.br" },
              ].map(({ label, href }) => (
                <Link key={label} href={href}
                  className="block text-sm text-white/70 hover:text-white py-1 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col gap-3">
            <p className="text-xs text-white/60">{TMDB_NOTICE}</p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-white/50">© 2026 Universidade de Fortaleza. Todos os direitos reservados.</p>
              <p className="text-xs text-white/50">Sistema Videoteca Unifor v1.0</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
