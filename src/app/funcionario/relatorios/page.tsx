"use client";
import { AppShell } from "@/components/layout/AppShell";
const REPORT_CHARTS = {
  topBorrowed: [] as { name: string; value: number }[],
  byGenre:     [] as { name: string; value: number }[],
  roomUsage:   [] as { name: string; value: number }[],
};
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const STAFF = { name: "Carla Nogueira", course: "Funcionária" };

const COLORS = ["#0066B3", "#003A70", "#E7472E", "#2EAD68", "#9B51E0"];

export default function RelatoriosPage() {
  return (
    <AppShell role="funcionario" title="Relatórios" user={STAFF}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-5">
          <h2 className="font-semibold text-[#172033] mb-4">Filmes mais emprestados</h2>
          <div className="h-64 min-h-[220px] min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REPORT_CHARTS.topBorrowed} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#0066B3" radius={[6, 6, 0, 0]} name="Empréstimos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-5">
          <h2 className="font-semibold text-[#172033] mb-4">Acervo por gênero</h2>
          <div className="h-64 min-h-[220px] min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={REPORT_CHARTS.byGenre} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {REPORT_CHARTS.byGenre.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 lg:col-span-2">
          <h2 className="font-semibold text-[#172033] mb-4">Uso de salas</h2>
          <div className="h-56 min-h-[200px] min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REPORT_CHARTS.roomUsage}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#003A70" radius={[6, 6, 0, 0]} name="Reservas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
