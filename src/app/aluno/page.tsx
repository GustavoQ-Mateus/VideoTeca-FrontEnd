"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { student as api } from "@/lib/api";
import { useAuthUser } from "@/lib/use-auth-user";
import { Poster } from "./_components/Poster";
import {
  BookOpen,
  BookMarked,
  Star,
  Calendar,
  Bell,
  Clock,
  ChevronRight,
  MapPin,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function StudentDashboard() {
  const user = useAuthUser();
  const [stats, setStats] = useState<any>(null);
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const [recommendations, setRecs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [notifications, setNotifs] = useState<any[]>([]);

  useEffect(() => {
    api.stats().then((d) => d && setStats(d));
    api
      .loans()
      .then(
        (d) =>
          d && setActiveLoans(d.filter((l: any) => l.status === "borrowed")),
      );
    api.events().then((d) => d && setEvents(d.slice(0, 3)));
    api.notifications().then((d) => d && setNotifs(d.slice(0, 3)));
    // Recomendações = filmes do catálogo (primeiros 3)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/catalog/films?limit=3`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setRecs(d.slice(0, 3)));
  }, []);

  const userName = user?.name?.split(" ").slice(0, 2).join(" ") ?? "Usuário";

  return (
    <AppShell
      role="aluno"
      title="Dashboard"
      showSearch
      user={{ name: user?.name ?? "", course: user?.course ?? "" }}
    >
      <div className="mb-8 motion-up">
        <h2 className="text-2xl font-bold text-[#0B1B3F]">{userName}</h2>
        <p className="text-[#667085] text-sm mt-0.5">
          {user?.registration ? `Matrícula ${user.registration} · ` : ""}
          {user?.course ?? ""}
        </p>
      </div>

      <div className="split-layout -mx-4 sm:-mx-6 lg:mx-0 min-h-[calc(100vh-220px)]">
        <div className="split-main px-4 sm:px-6 lg:px-0 lg:pr-6 pb-6 space-y-8">
          <div className="flex flex-wrap gap-6 motion-up stagger-1">
            {[
              {
                icon: BookOpen,
                label: "Empréstimos ativos",
                value: stats?.active_loans ?? 0,
                accent: "text-[#004AF7]",
              },
              {
                icon: BookMarked,
                label: "Reservas",
                value: stats?.reservations ?? 0,
                accent: "text-[#004AF7]",
              },
              {
                icon: Star,
                label: "Eventos inscritos",
                value: stats?.enrolled_events ?? 0,
                accent: "text-[#004AF7]",
              },
              {
                icon: Bell,
                label: "Notificações",
                value: stats?.notifications ?? 0,
                accent: "text-[#004AF7]",
              },
            ].map(({ icon: Icon, label, value, accent }) => (
              <div key={label} className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${accent} flex-shrink-0`}
                  aria-hidden
                />
                <div>
                  <p className="text-xs text-[#667085]">{label}</p>
                  <p
                    className="text-lg font-bold leading-none mt-0.5 text-[#0B1B3F]"
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <section
            aria-labelledby="loans-heading"
            className="motion-up stagger-2"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 id="loans-heading" className="font-semibold text-[#0B1B3F]">
                Empréstimos Ativos
              </h3>
              <Link
                href="/aluno/emprestimos"
                className="text-xs text-[#004AF7] hover:underline flex items-center gap-1"
              >
                Ver histórico{" "}
                <ChevronRight className="w-3.5 h-3.5" aria-hidden />
              </Link>
            </div>
            <div className="bg-white rounded-[4px] border border-[#E2E8F0] overflow-hidden">
              {activeLoans.map((loan) => (
                <div key={loan.id} className="list-row">
                  <Poster
                    src={loan.cover}
                    alt={`Cartaz de ${loan.film}`}
                    className="w-8 h-11"
                    iconClassName="w-3.5 h-3.5"
                    width={64}
                    height={88}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#0B1B3F] text-sm truncate">
                      {loan.film}
                    </p>
                    <p className="text-xs text-[#667085] mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden />
                      Devolução:{" "}
                      {loan.due_at
                        ? new Date(loan.due_at).toLocaleDateString("pt-BR")
                        : "—"}
                      <span className="text-[#E2E8F0] mx-1">·</span>
                      {loan.copy}
                    </p>
                  </div>
                  <Badge status={loan.status} />
                </div>
              ))}
              {activeLoans.length === 0 && (
                <div className="py-10 text-center text-[#667085]">
                  <BookOpen
                    className="w-8 h-8 mx-auto mb-2 opacity-25"
                    aria-hidden
                  />
                  <p className="text-sm">Nenhum empréstimo ativo</p>
                </div>
              )}
            </div>
          </section>

          <section
            aria-labelledby="rec-heading"
            className="motion-up stagger-3"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 id="rec-heading" className="font-semibold text-[#0B1B3F]">
                Recomendados para Você
              </h3>
              <Link
                href="/aluno/catalogo"
                className="text-xs text-[#004AF7] hover:underline flex items-center gap-1"
              >
                Explorar catálogo{" "}
                <ChevronRight className="w-3.5 h-3.5" aria-hidden />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {recommendations.map((film, i) => (
                <div
                  key={film.id}
                  className={`group rounded-[4px] overflow-hidden bg-white border border-[#E2E8F0] hover:border-[#004AF7] transition-colors motion-up stagger-${i + 4}`}
                >
                  <Link
                    href={`/aluno/catalogo/${film.id}`}
                    className="block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#004AF7]"
                    aria-label={`Ver ${film.title}`}
                  >
                    <Poster
                      src={film.cover}
                      alt={`Cartaz de ${film.title}`}
                      className="w-full aspect-[2/3] rounded-none"
                      iconClassName="w-6 h-6"
                      width={300}
                      height={450}
                    />
                    <div className="p-2">
                      <p className="text-[10px] font-semibold text-[#0B1B3F] group-hover:text-[#004AF7] transition-colors leading-snug line-clamp-1">
                        {film.title}
                      </p>
                      <p className="text-[9px] text-[#667085]">
                        {film.director}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside
          className="split-panel px-4 sm:px-6 py-6 space-y-8 motion-right"
          aria-label="Painel de contexto"
        >
          {activeLoans[0] && (
            <section aria-labelledby="next-due-heading">
              <h3 className="text-sm font-semibold text-[#0B1B3F] mb-3" id="next-due-heading">
                Próxima devolução
              </h3>
              <div>
                <p className="font-semibold text-[#0B1B3F] text-sm">
                  {activeLoans[0]?.film}
                </p>
                <p className="text-xs text-[#667085] mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" aria-hidden />
                  {activeLoans[0]?.due_at
                    ? new Date(activeLoans[0].due_at).toLocaleDateString(
                        "pt-BR",
                        { weekday: "long", day: "2-digit", month: "long" },
                      )
                    : "—"}
                </p>
                <Link href="/aluno/emprestimos">
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 text-xs h-8 gap-1"
                  >
                    Renovar <ArrowRight className="w-3 h-3" aria-hidden />
                  </Button>
                </Link>
              </div>
            </section>
          )}

          <section aria-labelledby="events-aside-heading">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#0B1B3F]" id="events-aside-heading">
                Eventos da semana
              </h3>
              <Link
                href="/aluno/eventos"
                className="text-xs text-[#004AF7] hover:underline"
              >
                Ver todos
              </Link>
            </div>
            <div className="space-y-0 divide-y divide-[#E2E8F0]">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/aluno/eventos/${event.id}`}
                  className="flex gap-3 py-3.5 group hover:bg-[#F2F5FB] -mx-2 px-2 rounded-[4px] transition-colors"
                >
                  <div className="flex-shrink-0 w-9 text-center">
                    <p className="text-sm font-bold text-[#0B1B3F] leading-none">
                      {event.starts_at
                        ? new Date(event.starts_at).getDate()
                        : "—"}
                    </p>
                    <p className="text-[9px] text-[#667085] mt-0.5">
                      {event.starts_at
                        ? new Date(event.starts_at).toLocaleDateString(
                            "pt-BR",
                            { month: "short" },
                          )
                        : ""}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0B1B3F] leading-snug group-hover:text-[#004AF7] transition-colors line-clamp-2">
                      {event.title}
                    </p>
                    <p className="text-[10px] text-[#667085] mt-1 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" aria-hidden />
                      {event.location}
                    </p>
                    <p className="text-[10px] text-[#667085] mt-0.5 flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" aria-hidden />
                      {event.slots - event.enrolled} vagas
                    </p>
                  </div>
                </Link>
              ))}
              {events.length === 0 && (
                <p className="text-xs text-[#667085] py-3">
                  Nenhum evento próximo
                </p>
              )}
            </div>
          </section>

          <section aria-labelledby="notif-heading">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#0B1B3F]" id="notif-heading">
                Notificações
              </h3>
              {notifications.length > 0 && (
                <span className="text-[10px] font-bold text-[#004AF7] bg-[#EBF0FF] rounded-[4px] min-w-4 h-4 px-1 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>
            <ul className="space-y-0 divide-y divide-[#E2E8F0]">
              {notifications.map((n) => (
                <li key={n.id} className="flex gap-2.5 py-3">
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${n.read ? "bg-[#CBD5E1]" : "bg-[#004AF7]"}`}
                    aria-hidden
                  />
                  <div>
                    <p className="text-xs text-[#0B1B3F] leading-relaxed">
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="text-[10px] text-[#667085]">{n.body}</p>
                    )}
                    <p className="text-[10px] text-[#667085] mt-0.5">
                      {new Date(n.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </li>
              ))}
              {notifications.length === 0 && (
                <li className="py-3 text-xs text-[#667085]">
                  Nenhuma notificação
                </li>
              )}
            </ul>
            <Link
              href="/aluno/notificacoes"
              className="text-xs text-[#004AF7] hover:underline mt-3 inline-block"
            >
              Ver todas
            </Link>
          </section>

          <section aria-label="Ações rápidas">
            <h3 className="text-sm font-semibold text-[#0B1B3F] mb-3">Ações rápidas</h3>
            <div className="space-y-1">
              {[
                {
                  icon: BookMarked,
                  label: "Minhas Reservas",
                  href: "/aluno/reservas",
                },
                { icon: Star, label: "Favoritos", href: "/aluno/favoritos" },
                {
                  icon: Calendar,
                  label: "Meus Eventos",
                  href: "/aluno/eventos",
                },
                {
                  icon: TrendingUp,
                  label: "Explorar Catálogo",
                  href: "/aluno/catalogo",
                },
              ].map(({ icon: Icon, label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-[4px] text-sm text-[#667085] hover:text-[#0B1B3F] hover:bg-[#F2F5FB] transition-colors group"
                >
                  <Icon
                    className="w-4 h-4 group-hover:text-[#004AF7] transition-colors"
                    aria-hidden
                  />
                  {label}
                  <ChevronRight
                    className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
