import { AppShell } from "@/components/layout/AppShell";
import { PageSkeleton } from "@/components/ui/Skeleton";

/** Estado de carregamento da área do funcionário (streaming do App Router). */
export default function FuncionarioLoading() {
  return (
    <AppShell role="funcionario" title="Carregando…">
      <PageSkeleton variant="list" />
    </AppShell>
  );
}
