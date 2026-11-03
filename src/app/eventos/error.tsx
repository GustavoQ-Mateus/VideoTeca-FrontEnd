"use client";
import { Button } from "@/components/ui/Button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl space-y-4 p-8">
      <h1 className="text-xl font-semibold">
        Programação temporariamente indisponível
      </h1>
      <p>Não foi possível carregar as sessões. Tente novamente em instantes.</p>
      <Button onClick={reset}>Tentar novamente</Button>
    </main>
  );
}
