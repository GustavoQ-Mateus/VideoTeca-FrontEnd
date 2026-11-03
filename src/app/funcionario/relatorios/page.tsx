"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { staff } from "@/lib/api";

type Point = { name: string; value: number };

const COLORS = ["#004AF7", "#3D74F9", "#7A9FFB", "#B8CCFD", "#0B1B3F", "#667085", "#C4CDD8"];

function count<T>(items: T[], key: (item: T) => string | null | undefined): Point[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    if (k) map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

function Empty({ text }: { text: string }) {
  return <div className="h-full grid place-items-center text-sm text-[#667085]">{text}</div>;
}

export default function RelatoriosPage() {
  const [top, setTop] = useState<Point[] | null>(null);
  const [genres, setGenres] = useState<Point[] | null>(null);
  const [rooms, setRooms] = useState<Point[] | null>(null);

  useEffect(() => {
    staff.loans().then((d) => setTop(count(d ?? [], (l: { film?: string }) => l.film).slice(0, 8))).catch(() => setTop([]));
    staff.inventory().then((d) => {
      const all = count(d ?? [], (f: { genre?: string }) => f.genre);
      const rest = all.slice(6).reduce((sum, p) => sum + p.value, 0);
      setGenres(rest ? [...all.slice(0, 6), { name: "Outros", value: rest }] : all);
    }).catch(() => setGenres([]));
    const now = Date.now();
    const from = new Date(now - 30 * 86400000).toISOString();
    const to = new Date(now + 30 * 86400000).toISOString();
    staff.roomBookings(from, to).then((d) => setRooms(count(d ?? [], (b: { room_name?: string }) => b.room_name))).catch(() => setRooms([]));
  }, []);

  return (
    <AppShell role="funcionario" title="Relatórios">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[4px] border border-[#E2E8F0] p-5">
          <h2 className="font-semibold text-[#0B1B3F]">Filmes mais emprestados</h2>
          <p className="text-sm text-[#667085] mb-4">Empréstimos registrados por título</p>
          <div className="h-64 min-h-[220px] min-w-0 w-full">
            {!top ? <Empty text="Carregando…" /> : top.length === 0 ? <Empty text="Sem empréstimos registrados ainda" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#3D4A66" }} angle={-25} textAnchor="end" height={60} interval={0} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#667085" }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#004AF7" radius={[4, 4, 0, 0]} name="Empréstimos" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="bg-white rounded-[4px] border border-[#E2E8F0] p-5">
          <h2 className="font-semibold text-[#0B1B3F]">Acervo por gênero</h2>
          <p className="text-sm text-[#667085] mb-4">Títulos ativos no acervo</p>
          <div className="h-64 min-h-[220px] min-w-0 w-full">
            {!genres ? <Empty text="Carregando…" /> : genres.length === 0 ? <Empty text="Acervo sem títulos cadastrados" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genres} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {genres.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="bg-white rounded-[4px] border border-[#E2E8F0] p-5 lg:col-span-2">
          <h2 className="font-semibold text-[#0B1B3F]">Uso de salas</h2>
          <p className="text-sm text-[#667085] mb-4">Sessões e reservas nos últimos e próximos 30 dias</p>
          <div className="h-56 min-h-[200px] min-w-0 w-full">
            {!rooms ? <Empty text="Carregando…" /> : rooms.length === 0 ? <Empty text="Nenhuma ocupação de sala no período" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rooms}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#3D4A66" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#667085" }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#004AF7" radius={[4, 4, 0, 0]} name="Ocupações" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
