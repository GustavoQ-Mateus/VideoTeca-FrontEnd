import { Film } from "lucide-react";

/** Assinatura tipográfica da Videoteca (sem ícone). */
export function Wordmark({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={`text-sm font-bold whitespace-nowrap ${className}`}>
      <span className={tone === "light" ? "text-white" : "text-[#0B1B3F]"}>Videoteca</span>
      <span className={tone === "light" ? "text-white" : "text-[#004AF7]"}> Unifor</span>
    </span>
  );
}

export const TMDB_NOTICE =
  "Dados e imagens dos filmes: TMDB. Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.";

/** Capa sem cartaz: bloco chapado claro com ícone de filme. Use dentro de um contêiner `relative`. */
export function PosterFallback({ iconClass = "w-10 h-10" }: { iconClass?: string }) {
  return (
    <div className="absolute inset-0 bg-[#EBF0FF] flex items-center justify-center" aria-hidden>
      <Film className={`${iconClass} text-[#004AF7]`} strokeWidth={1.5} />
    </div>
  );
}
