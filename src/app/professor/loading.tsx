import { AppShell } from "@/components/layout/AppShell";
import { PageSkeleton } from "@/components/ui/Skeleton";

/** Estado de carregamento da área do professor (streaming do App Router). */
export default function ProfessorLoading() {
  return (
    <AppShell role="professor" title="Carregando…">
      <PageSkeleton variant="dashboard" />
    </AppShell>
  );
}
