import type { Metadata } from "next";
import Link from "next/link";
import { Clapperboard, Film, House } from "lucide-react";

export const metadata: Metadata = {
  title: "Página não encontrada · Videoteca Unifor",
};

/** 404 amigável (App Router). */
export default function NotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 flex items-center justify-center px-4 py-16 bg-canvas focus:outline-none"
    >
      <div className="w-full max-w-md text-center">
        <div
          className="mx-auto mb-6 w-16 h-16 rounded-panel bg-brand-navy flex items-center justify-center shadow-raised"
          aria-hidden="true"
        >
          <Clapperboard className="w-8 h-8 text-white" aria-hidden="true" focusable="false" />
        </div>
        <p className="text-sm font-semibold text-brand tracking-wide uppercase">Erro 404</p>
        <h1 className="mt-2 text-title-lg sm:text-display font-display font-semibold text-fg">
          Esta cena não está no roteiro
        </h1>
        <p className="mt-3 text-body-sm text-fg-subtle">
          A página que você procura não existe, mudou de endereço ou foi removida. Confira o link ou volte para
          um lugar conhecido.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 min-h-11 px-5 rounded-control bg-brand text-fg-inverse text-sm font-medium hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <House className="w-4 h-4" aria-hidden="true" />
            Ir para o início
          </Link>
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center gap-2 min-h-11 px-5 rounded-control border border-line-strong bg-surface text-fg text-sm font-medium hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <Film className="w-4 h-4" aria-hidden="true" />
            Ver o catálogo
          </Link>
        </div>
      </div>
    </main>
  );
}
