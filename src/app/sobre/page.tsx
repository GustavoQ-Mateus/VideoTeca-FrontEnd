import Link from "next/link";
import { Film, BookOpen, Users, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Eventos", href: "/eventos" },
  { label: "Sobre", href: "/sobre" },
] as const;

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
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
              <Link key={l.href} href={l.href} className="px-3 py-2 text-sm text-[#667085] hover:text-[#172033] rounded-[8px] font-medium">
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/login">
            <Button size="sm">Entrar</Button>
          </Link>
        </div>
      </header>

      <section className="py-16 px-6 bg-[#F5F7FA]">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#172033] mb-4">Sobre a Videoteca</h1>
          <p className="text-[#667085] leading-relaxed text-lg">
            A Videoteca Unifor é um setor da Biblioteca Central dedicado ao acervo audiovisual, salas de exibição e apoio pedagógico à comunidade acadêmica.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        {[
          { icon: BookOpen, title: "Acervo", desc: "Mais de 1.200 títulos em múltiplos formatos para pesquisa e ensino." },
          { icon: Users, title: "Atendimento", desc: "Empréstimos, reservas e orientação para professores e alunos." },
          { icon: Calendar, title: "Cultura", desc: "Cineclubes, mostras e sessões comentadas abertas à comunidade." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-[18px] border border-[#E2E8F0] p-6 bg-white">
            <div className="w-12 h-12 rounded-[14px] bg-[#E8F2FC] flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-[#0066B3]" aria-hidden />
            </div>
            <h2 className="font-semibold text-[#172033] mb-2">{title}</h2>
            <p className="text-sm text-[#667085] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <section className="py-12 bg-[#003A70] text-white px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-white/70 flex-shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">Localização</p>
              <p className="text-white/70 text-sm mt-1">Biblioteca Central — Universidade de Fortaleza · Av. Washington Soares, 1321</p>
            </div>
          </div>
          <Link href="/login">
            <Button variant="secondary" className="bg-white text-[#0066B3] hover:bg-[#E8F2FC]">
              Acessar o sistema
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
