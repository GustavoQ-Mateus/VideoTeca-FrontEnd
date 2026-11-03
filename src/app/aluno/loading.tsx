import { AppShell } from "@/components/layout/AppShell";
import { PageSkeleton } from "@/components/ui/Skeleton";

/** Estado de carregamento da área do aluno (streaming do App Router). */
export default function AlunoLoading() {
  return (
    <AppShell role="aluno" title="Carregando…">
      <PageSkeleton variant="dashboard" />
    </AppShell>
  );
}
