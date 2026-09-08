"use client";
import { useState } from "react";
import Link from "next/link";
import { Clapperboard, Eye, EyeOff, ArrowLeft, Film, Calendar, Users, BookOpen } from "lucide-react";
import { apiLogin } from "@/lib/api";
import { setSession, roleHome } from "@/lib/auth";

const ROLES = [
  { id: "aluno",       label: "Aluno",       desc: "Reservas, catálogo e eventos" },
  { id: "professor",   label: "Professor",   desc: "Solicitações e salas" },
  { id: "funcionario", label: "Funcionário", desc: "Gestão e operações" },
] as const;

type RoleId = typeof ROLES[number]["id"];

const STATS = [
  { icon: Film,     value: "1.248", label: "títulos no acervo" },
  { icon: Calendar, value: "12+",   label: "eventos por mês" },
  { icon: Users,    value: "3k+",   label: "atendimentos/ano" },
  { icon: BookOpen, value: "5",     label: "salas de exibição" },
];

export default function LoginPage() {
  const [role,         setRole]         = useState<RoleId>("aluno");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const selected = ROLES.find(r => r.id === role)!;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const login    = (form.get("matricula") as string).trim();
    const password = form.get("senha") as string;

    try {
      const data = await apiLogin(login, password, role);
      if (!data) throw new Error("Credenciais inválidas");
      setSession(data.token, data.user);
      window.location.href = roleHome(data.user.role);
    } catch (err: any) {
      setError(err.message ?? "Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  }

  const fieldLabel = role === "professor"
    ? "Matrícula ou SIAPE"
    : role === "funcionario" ? "Login" : "Matrícula";

  const fieldPlaceholder = role === "aluno"
    ? "Ex: 2024001234"
    : role === "professor" ? "Ex: 202400123" : "Ex: func.videoteca";

  return (
    <div className="min-h-screen flex">

      {/* ── Left — branding ── */}
      <div className="hidden lg:flex flex-col w-[480px] xl:w-[520px] flex-shrink-0 bg-[#003A70] relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#0066B3]/40 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-0 w-64 h-64 bg-[#E7472E]/10 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 bottom-0 w-16 flex flex-col gap-1 opacity-[0.04] pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="h-10 bg-white flex-shrink-0 mx-3 rounded-sm" />
            ))}
          </div>
        </div>

        <div className="relative flex flex-col h-full p-10">
          <div className="flex items-center gap-2.5 mb-auto">
            <div className="w-8 h-8 bg-white/15 rounded-[10px] flex items-center justify-center">
              <Clapperboard className="w-4 h-4 text-white" aria-hidden />
            </div>
            <span className="text-sm font-bold text-white">Videoteca</span>
            <span className="text-sm text-white/40">Unifor</span>
          </div>

          <div className="mb-auto">
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
              Cinema, cultura e<br />
              <span className="text-[#F6C343]">conhecimento</span><br />
              na palma da mão.
            </h1>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs">
              O sistema de gestão da Videoteca da Universidade de Fortaleza — acervo audiovisual, reservas, eventos e mais.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-white/60" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">{value}</p>
                  <p className="text-[10px] text-white/35 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-white/20 mt-8">
            Biblioteca Central · Universidade de Fortaleza<br />
            Av. Washington Soares, 1321 — Fortaleza/CE
          </p>
        </div>
      </div>

      {/* ── Right — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#F5F7FA]">
        <div className="w-full max-w-sm">

          <Link href="/"
            className="inline-flex items-center gap-1.5 text-[#667085] hover:text-[#172033] text-sm mb-8 transition-colors focus-visible:outline-none focus-visible:underline">
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Início
          </Link>

          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-[#003A70] rounded-[10px] flex items-center justify-center">
              <Clapperboard className="w-4 h-4 text-white" aria-hidden />
            </div>
            <span className="text-sm font-bold text-[#003A70]">Videoteca</span>
            <span className="text-sm text-[#667085]">Unifor</span>
          </div>

          <h2 className="text-2xl font-bold text-[#172033] mb-1">Entrar</h2>
          <p className="text-sm text-[#667085] mb-8">
            Selecione seu perfil e acesse o sistema.
          </p>

          <fieldset className="mb-6">
            <legend className="section-label mb-2">Perfil de acesso</legend>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  aria-pressed={role === r.id}
                  className={`py-3 px-2 rounded-[10px] border text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066B3] ${
                    role === r.id
                      ? "border-[#0066B3] bg-[#E8F2FC] text-[#0066B3]"
                      : "border-[#E2E8F0] bg-white text-[#667085] hover:border-[#0066B3]/40"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#667085] mt-2">{selected.desc}</p>
          </fieldset>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="matricula" className="block text-sm font-medium text-[#172033] mb-1.5">
                {fieldLabel}
              </label>
              <input
                id="matricula"
                name="matricula"
                type="text"
                required
                autoComplete="username"
                placeholder={fieldPlaceholder}
                className="w-full h-11 bg-white border border-[#E2E8F0] rounded-[10px] px-3 text-sm text-[#172033] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0066B3] focus:ring-1 focus:ring-[#0066B3] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="senha" className="text-sm font-medium text-[#172033]">Senha</label>
                <Link href="#" className="text-xs text-[#0066B3] hover:underline">Esqueci a senha</Link>
              </div>
              <div className="relative">
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full h-11 bg-white border border-[#E2E8F0] rounded-[10px] px-3 pr-10 text-sm text-[#172033] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0066B3] focus:ring-1 focus:ring-[#0066B3] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#667085] transition-colors focus-visible:outline-none"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-[#E7472E] bg-[#E7472E]/8 border border-[#E7472E]/20 rounded-[8px] px-3 py-2" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#0066B3] text-white font-semibold text-sm rounded-[10px] hover:bg-[#005599] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066B3] focus-visible:ring-offset-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Entrando...
                </>
              ) : "Entrar"}
            </button>
          </form>

          <p className="text-center text-xs text-[#98A2B3] mt-8">
            © 2026 Universidade de Fortaleza
          </p>
        </div>
      </div>

    </div>
  );
}
