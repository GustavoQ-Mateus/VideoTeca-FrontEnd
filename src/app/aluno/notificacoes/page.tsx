"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Bell, Check } from "lucide-react";
import { student as api } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function NotificacoesPage() {
  const user = getUser();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => { api.notifications().then(d => d && setNotifications(d)); }, []);

  async function markRead(id: number) {
    await api.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <AppShell role="aluno" title="Notificações" user={{ name: user?.name ?? "", course: user?.course ?? "" }}>
      <div className="space-y-2">
        {notifications.map(n => (
          <div key={n.id} className={`flex gap-4 p-4 rounded-[14px] border ${n.read ? "bg-white border-[#E2E8F0]" : "bg-[#E8F2FC]/60 border-[#0066B3]/20"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${n.read ? "bg-[#F5F7FA]" : "bg-[#0066B3]/10"}`}>
              <Bell className={`w-4 h-4 ${n.read ? "text-[#98A2B3]" : "text-[#0066B3]"}`} aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${n.read ? "text-[#667085]" : "text-[#172033]"}`}>{n.title}</p>
              {n.body && <p className="text-xs text-[#667085] mt-0.5">{n.body}</p>}
              <p className="text-[10px] text-[#98A2B3] mt-1">{new Date(n.created_at).toLocaleDateString("pt-BR")}</p>
            </div>
            {!n.read && (
              <button onClick={() => markRead(n.id)} className="text-xs text-[#0066B3] hover:underline flex items-center gap-1 self-start mt-1 flex-shrink-0">
                <Check className="w-3.5 h-3.5" aria-hidden />Lida
              </button>
            )}
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="py-16 text-center text-[#667085]">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" aria-hidden />
            <p className="text-sm">Nenhuma notificação</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
