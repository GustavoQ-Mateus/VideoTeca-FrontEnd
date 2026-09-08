import Link from "next/link";
import {
  Search, Film, BookOpen, Calendar, Users, ChevronRight,
  Play, ArrowRight, MapPin, Clock, Clapperboard,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { FilmRecord, EventRecord } from "@/lib/types";

const NAV_LINKS = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Eventos", href: "/eventos" },
  { label: "Sobre", href: "/sobre" },
] as const;

const SERVICES = [
  { icon: Film,     label: "Acervo Audiovisual",   desc: "Mais de 1.200 títulos em DVD, Blu-ray e digital" },
  { icon: BookOpen, label: "Empréstimos",           desc: "Retire filmes para estudo e pesquisa acadêmica" },
  { icon: Calendar, label: "Eventos & Cineclubes",  desc: "Sessões comentadas, debates e mostras culturais" },
  { icon: Users,    label: "Salas de Exibição",     desc: "5 salas equipadas para atividades acadêmicas" },
] as const;

const STATS = [
  { value: "1.248", label: "Títulos" },
  { value: "5",     label: "Salas" },
  { value: "12+",   label: "Eventos/mês" },
  { value: "3k+",   label: "Atendimentos/ano" },
] as const;

const EVENT_COLORS: Record<string, string> = {
  Cineclube: "bg-[#F6C343]/15 text-[#B8922A] border-[#F6C343]/40",
  Mostra:    "bg-violet-50 text-violet-700 border-violet-200",
  Debate:    "bg-[#2EAD68]/10 text-[#1F7E4C] border-[#2EAD68]/30",
};

export default function LandingPage() {
  const featuredFilms:  FilmRecord[]  = [];
  const upcomingEvents: EventRecord[] = [];

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-6">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 bg-[#0066B3] rounded-[8px] flex items-center justify-center">
              <Clapperboard className="w-3.5 h-3.5 text-white" aria-hidden />
            </div>
            <span className="text-sm font-bold text-[#003A70]">Videoteca</span>
            <span className="text-xs text-[#667085] font-medium hidden sm:inline">— Unifor</span>
          </div>

          <nav className="hidden md:flex items-center gap-0.5 flex-1" aria-label="Navegação principal">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href}
                className="px-3 py-1.5 text-sm text-[#667085] hover:text-[#172033] rounded-[8px] hover:bg-[#F5F7FA] transition-colors font-medium nav-link">
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
        className="relative overflow-hidden bg-[#003A70]"
        aria-label="Apresentação da Videoteca"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[580px]">

            {/* Left — content */}
            <div className="flex flex-col justify-center py-16 lg:pr-12">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-6 w-fit motion-fade">
                <span className="w-1.5 h-1.5 bg-[#2EAD68] rounded-full pulse-dot" aria-hidden />
                <span className="text-xs text-white/70 font-medium">1.248 títulos disponíveis no acervo</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.15] mb-4 motion-up stagger-1">
                Cinema, cultura e<br />
                <span className="text-[#F6C343]">conhecimento</span>{" "}
                <span className="text-white/80">na Unifor</span>
              </h1>

              <p className="text-base text-white/60 mb-8 leading-relaxed max-w-md motion-up stagger-2">
                A Videoteca Unifor conecta alunos, professores e pesquisadores ao maior acervo audiovisual acadêmico do Ceará.
              </p>

              {/* Search */}
              <div className="flex gap-2 max-w-md mb-10 motion-up stagger-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" aria-hidden />
                  <input
                    type="search"
                    placeholder="Buscar filmes, documentários..."
                    className="w-full h-11 pl-9 pr-3 text-sm rounded-[10px] bg-white border-0 outline-none text-[#172033] placeholder:text-[#667085] focus:ring-2 focus:ring-white/30"
                    aria-label="Buscar no acervo"
                  />
                </div>
                <Link href="/catalogo">
                  <Button size="sm" className="h-11 px-4">Buscar</Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex gap-6 motion-up stagger-4">
                {STATS.map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-xl font-bold text-white">{value}</p>
                    <p className="text-xs text-white/45 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual film grid */}
            <div className="hidden lg:flex items-center justify-center py-10 pl-8 border-l border-white/10 motion-right">
              <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                {featuredFilms.map((film, i) => (
                  <Link
                    key={film.id}
                    href={`/catalogo/${film.id}`}
                    className={`group relative rounded-[10px] overflow-hidden film-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      i === 0 ? "col-span-2 row-span-2" : ""
                    }`}
                    style={{ aspectRatio: i === 0 ? "4/5" : "2/3" }}
                    aria-label={`Ver detalhes de ${film.title}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      i % 3 === 0 ? "from-[#003A70] to-[#0066B3]" :
                      i % 3 === 1 ? "from-[#101828] to-[#1D2939]" :
                      "from-[#1a0a2e] to-[#2d1257]"
                    }`} />
                    <div className="absolute inset-0 p-3 flex flex-col justify-end film-cover">
                      <p className="text-[10px] font-semibold text-white/80 leading-tight line-clamp-2">{film.title}</p>
                      <p className="text-[9px] text-white/40 mt-0.5">{film.year}</p>
                    </div>
                    <div className="film-actions absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 text-white ml-0.5" aria-hidden />
                      </div>
                    </div>
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
              <p className="section-label mb-3">O que oferecemos</p>
              <h2 id="services-heading" className="text-2xl font-bold text-[#172033] leading-tight">
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
                  <div className="w-9 h-9 rounded-[10px] bg-[#E8F2FC] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[#0066B3]" aria-hidden />
                  </div>
                  <div>
                    <p className="font-semibold text-[#172033] text-sm">{label}</p>
                    <p className="text-xs text-[#667085] mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Featured Films — split with side detail ── */}
      <section className="py-14 bg-[#F5F7FA]" aria-labelledby="films-heading">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="section-label mb-2">Acervo em destaque</p>
              <h2 id="films-heading" className="text-2xl font-bold text-[#172033]">Títulos Disponíveis</h2>
            </div>
            <Link href="/catalogo" className="flex items-center gap-1 text-[#0066B3] text-sm font-medium hover:underline">
              Ver catálogo <ChevronRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {featuredFilms.map((film, i) => (
              <Link
                key={film.id}
                href={`/catalogo/${film.id}`}
                className={`film-card group rounded-[14px] overflow-hidden bg-white border border-[#E2E8F0] block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066B3] motion-up stagger-${Math.min(i + 1, 6)}`}
                aria-label={`Ver detalhes de ${film.title}`}
              >
                <div
                  className="relative bg-gradient-to-br from-[#003A70] to-[#0066B3] film-cover"
                  style={{ aspectRatio: "2/3" }}
                >
                  <div className="absolute inset-0 flex flex-col justify-end p-2.5">
                    <p className="text-[9px] font-semibold text-white/60 uppercase tracking-wide">{film.genre}</p>
                  </div>
                  <div className="film-actions absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" aria-hidden />
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="font-semibold text-[#172033] text-xs leading-snug line-clamp-1">{film.title}</p>
                  <p className="text-[10px] text-[#667085] mt-0.5">{film.director} · {film.year}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Events — split layout ── */}
      <section className="py-14 bg-[#003A70]" aria-labelledby="events-heading">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Left — header + CTA */}
            <div className="flex flex-col justify-between gap-8">
              <div>
                <p className="section-label text-white/40 mb-3">Agenda cultural</p>
                <h2 id="events-heading" className="text-2xl font-bold text-white">Próximos Eventos</h2>
                <p className="text-white/50 text-sm mt-2 leading-relaxed max-w-sm">
                  Cineclubes, sessões comentadas, debates acadêmicos e mostras culturais.
                </p>
              </div>
              <Link href="/eventos">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 w-fit gap-2">
                  Ver agenda completa <ArrowRight className="w-4 h-4" aria-hidden />
                </Button>
              </Link>
            </div>

            {/* Right — event list */}
            <div className="divide-y divide-white/10">
              {upcomingEvents.map(event => (
                <Link
                  key={event.id}
                  href={`/eventos/${event.id}`}
                  className="flex gap-4 py-5 group hover:bg-white/5 -mx-4 px-4 rounded-[8px] transition-colors"
                >
                  {/* Date block */}
                  <div className="flex-shrink-0 w-10 text-center">
                    <p className="text-lg font-bold text-white leading-none">
                      {new Date(event.date).getDate().toString().padStart(2, "0")}
                    </p>
                    <p className="text-[10px] text-white/40 uppercase mt-0.5">
                      {new Date(event.date).toLocaleDateString("pt-BR", { month: "short" })}
                    </p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        EVENT_COLORS[event.type] ?? "bg-white/10 text-white/60 border-white/20"
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    <p className="font-semibold text-white text-sm leading-snug group-hover:text-[#F6C343] transition-colors">
                      {event.title}
                    </p>
                    <div className="flex flex-wrap gap-x-3 mt-2 text-[11px] text-white/40">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden />{event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" aria-hidden />{event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" aria-hidden />
                        {event.slots - event.enrolled} vagas
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 flex-shrink-0 self-center transition-colors" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── About — split ── */}
      <section className="py-14 bg-white" aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label mb-3">Sobre</p>
              <h2 id="about-heading" className="text-2xl font-bold text-[#172033] mb-4">
                A Videoteca Unifor
              </h2>
              <p className="text-[#667085] leading-relaxed mb-6 text-sm max-w-lg">
                Vinculada à Biblioteca Central da Universidade de Fortaleza, a Videoteca mantém um acervo com mais de 1.200 títulos audiovisuais e apoia atividades de ensino, pesquisa e extensão.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                {STATS.map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-2xl font-bold text-[#0066B3]">{value}</p>
                    <p className="text-xs text-[#667085] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Acessar o sistema <ArrowRight className="w-4 h-4" aria-hidden />
                </Button>
              </Link>
            </div>

            {/* Visual column */}
            <div className="relative h-64 lg:h-full min-h-[240px]">
              <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-[#003A70] to-[#0066B3] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clapperboard className="w-24 h-24 text-white/10" aria-hidden />
                </div>
                {/* Accent strips */}
                <div className="absolute top-0 right-0 w-1 h-full bg-[#F6C343]/30" aria-hidden />
                <div className="absolute bottom-0 left-0 h-1 w-full bg-[#2EAD68]/30" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#172033] py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#0066B3] rounded-[6px] flex items-center justify-center">
                  <Clapperboard className="w-3 h-3 text-white" aria-hidden />
                </div>
                <span className="text-sm font-bold text-white">Videoteca Unifor</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                Biblioteca Central · Universidade de Fortaleza<br />
                Av. Washington Soares, 1321 — Fortaleza/CE
              </p>
            </div>
            <div>
              <p className="section-label text-white/30 mb-3">Links</p>
              {[
                { label: "Catálogo", href: "/catalogo" },
                { label: "Eventos", href: "/eventos" },
                { label: "Sobre", href: "/sobre" },
                { label: "Contato", href: "mailto:videoteca@unifor.br" },
              ].map(({ label, href }) => (
                <Link key={label} href={href}
                  className="block text-sm text-white/50 hover:text-white py-1 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
            <div>
              <p className="section-label text-white/30 mb-3">Horário</p>
              <p className="text-sm text-white/50">Segunda a Sexta: 7h30 – 21h30</p>
              <p className="text-sm text-white/50">Sábado: 8h00 – 12h00</p>
              <p className="text-xs text-white/30 mt-2">videoteca@unifor.br</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/25">© 2026 Universidade de Fortaleza. Todos os direitos reservados.</p>
            <p className="text-xs text-white/25">Sistema Videoteca Unifor v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
