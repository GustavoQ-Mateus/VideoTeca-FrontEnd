"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { apiLogin } from "@/lib/api";
import { setSession, roleHome } from "@/lib/auth";
import { Wordmark } from "@/components/catalog/Brand";

const ROLES = [
  { id: "aluno",       label: "Aluno",       desc: "Reservas, catálogo e eventos" },
  { id: "professor",   label: "Professor",   desc: "Solicitações e salas" },
  { id: "funcionario", label: "Funcionário", desc: "Gestão e operações" },
] as const;

type RoleId = typeof ROLES[number]["id"];

// Volta para a página pedida (?next=) só se for caminho interno da área do próprio perfil.
function safeNext(home: string): string {
  const next = new URLSearchParams(window.location.search).get("next") ?? "";
  const internal = next.startsWith("/") && !next.startsWith("//") && !next.includes("\\");
  return internal && (next === home || next.startsWith(home + "/")) ? next : home;
}

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
      window.location.href = safeNext(roleHome(data.user.role));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Credenciais inválidas");
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
      <div className="hidden lg:flex flex-col w-[480px] xl:w-[520px] flex-shrink-0 bg-[#004AF7] relative overflow-hidden">
        <div className="relative flex flex-col h-full p-10">
          <div className="mb-auto">
            <Wordmark tone="light" />
          </div>

          <div className="mb-auto">
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
              Cinema, cultura e<br />
              conhecimento<br />
              na palma da mão.
            </h1>
            <p className="text-white/80 text-sm leading-relaxed max-w-xs">
              O sistema de gestão da Videoteca da Universidade de Fortaleza — acervo audiovisual, reservas, eventos e mais.
            </p>
          </div>

          <p className="text-xs text-white/70 mt-8">
            Universidade de Fortaleza
          </p>
        </div>
      </div>

      {/* ── Right — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">

          <div className="flex items-center gap-5 mb-8 text-sm">
            <Link href="/"
              className="inline-flex items-center gap-1.5 text-[#667085] hover:text-[#0B1B3F] transition-colors focus-visible:outline-none focus-visible:underline">
              <ArrowLeft className="w-4 h-4" aria-hidden />
              Início
            </Link>
            <Link href="/catalogo"
              className="text-[#004AF7] font-medium hover:underline underline-offset-4 focus-visible:outline-none focus-visible:underline">
              Ver catálogo
            </Link>
          </div>

          <div className="mb-8 lg:hidden">
            <Wordmark />
          </div>

          <h2 className="text-2xl font-bold text-[#0B1B3F] mb-1">Entrar</h2>
          <p className="text-sm text-[#667085] mb-8">
            Selecione seu perfil e acesse o sistema.
          </p>

          <fieldset className="mb-6">
            <legend className="text-sm font-medium text-[#0B1B3F] mb-2">Perfil de acesso</legend>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  aria-pressed={role === r.id}
                  className={`py-3 px-2 rounded-[4px] border text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004AF7] ${
                    role === r.id
                      ? "border-[#004AF7] bg-[#EBF0FF] text-[#004AF7]"
                      : "border-[#E2E8F0] bg-white text-[#667085] hover:border-[#004AF7]/40"
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
              <label htmlFor="matricula" className="block text-sm font-medium text-[#0B1B3F] mb-1.5">
                {fieldLabel}
              </label>
              <input
                id="matricula"
                name="matricula"
                type="text"
                required
                autoComplete="username"
                placeholder={fieldPlaceholder}
                className="w-full h-11 bg-white border border-[#E2E8F0] rounded-[4px] px-3 text-sm text-[#0B1B3F] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#004AF7] focus:ring-1 focus:ring-[#004AF7] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="senha" className="text-sm font-medium text-[#0B1B3F]">Senha</label>
                <Link href="#" className="text-xs text-[#004AF7] hover:underline">Esqueci a senha</Link>
              </div>
              <div className="relative">
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full h-11 bg-white border border-[#E2E8F0] rounded-[4px] px-3 pr-10 text-sm text-[#0B1B3F] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#004AF7] focus:ring-1 focus:ring-[#004AF7] transition-colors"
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
              <p className="text-xs text-[#B42318] bg-[#FEF3F2] border border-[#B42318]/20 rounded-[4px] px-3 py-2" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#004AF7] text-white font-semibold text-sm rounded-[4px] hover:bg-[#003BC6] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004AF7] focus-visible:ring-offset-2"
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
