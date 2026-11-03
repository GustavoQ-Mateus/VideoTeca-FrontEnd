"use client";
import type { ComponentProps } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuthUser } from "@/lib/use-auth-user";

/** AppShell do aluno com o usuário logado (leitura de sessão segura para hidratação). */
export function AlunoShell(props: Omit<ComponentProps<typeof AppShell>, "role" | "user">) {
  const user = useAuthUser();
  return (
    <AppShell
      {...props}
      role="aluno"
      user={{ name: user?.name ?? "", course: user?.course ?? "" }}
    />
  );
}
