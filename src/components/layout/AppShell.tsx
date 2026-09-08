"use client";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileBottomNav } from "./MobileBottomNav";

interface AppShellProps {
  role: "aluno" | "professor" | "funcionario";
  title: string;
  showSearch?: boolean;
  user?: { name: string; course?: string };
  children: React.ReactNode;
}

export function AppShell({ role, title, showSearch, user, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#101828]/50 backdrop-blur-[1px] lg:hidden motion-fade"
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-out lg:transform-none flex-shrink-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar role={role} onNavigate={() => setMobileOpen(false)} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <TopBar
          title={title}
          user={user}
          showSearch={showSearch}
          onMenuClick={() => setMobileOpen(true)}
          profileHref={
            role === "aluno" ? "/aluno/perfil" : role === "professor" ? "/professor/perfil" : "/funcionario/configuracoes"
          }
          notificationsHref={role === "aluno" ? "/aluno/notificacoes" : undefined}
        />
        <main className="flex-1 p-4 sm:p-6 overflow-auto pb-24 lg:pb-6" id="main-content">
          {children}
        </main>
        <MobileBottomNav role={role} />
      </div>
    </div>
  );
}
