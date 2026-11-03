"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import type { EventRecord } from "@/lib/types";
import { publishedEvent } from "@/lib/public-events";
import { student as api } from "@/lib/api";
import { useAuthUser } from "@/lib/use-auth-user";
import { eventTypeLabel } from "../../_components/eventType";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import { Film, MapPin, Users, Calendar, Award } from "lucide-react";
import { QrCodeImage } from "@/components/ui/QrCodeImage";

export default function AlunoEventoDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const user = useAuthUser();
  const shellUser = { name: user?.name ?? "", course: user?.course ?? "" };
  const [loaded, setLoaded] = useState<EventRecord | null | undefined>(undefined);
  const [step, setStep] = useState<"idle" | "confirm" | "done">("idle");
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const event = Number.isNaN(id) ? null : loaded;

  useEffect(() => {
    if (Number.isNaN(id)) return;
    publishedEvent(id)
      .then(setLoaded)
      .catch(() => setLoaded(null));
  }, [id]);

  if (event === undefined) {
    return (
      <AppShell role="aluno" title="Evento" user={shellUser}>
        <p className="text-sm text-[#667085]">Carregando evento…</p>
      </AppShell>
    );
  }

  if (!event) {
    return (
      <AppShell role="aluno" title="Evento" user={shellUser}>
        <p className="text-[#667085]">
          Evento não encontrado.{" "}
          <Link href="/aluno/eventos" className="text-[#004AF7] font-medium underline">
            Voltar à lista
          </Link>
        </p>
      </AppShell>
    );
  }

  const spots = event.slots - event.enrolled;

  async function confirm() {
    if (!event) return;
    setBusy(true);
    try {
      await api.enroll(event.id);
      setStep("done");
      toast({ title: "Inscrição confirmada", description: event.title, variant: "success" });
    } catch (e) {
      toast({
        title: "Não foi possível concluir a inscrição",
        description: e instanceof Error ? e.message : undefined,
        variant: "error",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell role="aluno" title="Evento" user={shellUser}>
      <div className="max-w-3xl mx-auto">
        <div className="rounded-[4px] overflow-hidden border border-[#E2E8F0] bg-white">
          <div className="p-6 border-b border-[#E2E8F0]">
            <p className="text-sm text-[#667085] mb-1">{eventTypeLabel(event.type)}</p>
            <h1 className="text-xl font-bold leading-tight text-[#0B1B3F]">{event.title}</h1>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-4 text-[#667085]">
              <div className="flex gap-2">
                <Film className="w-4 h-4 flex-shrink-0 text-[#004AF7]" aria-hidden />
                <div>
                  <p className="text-xs font-semibold">Filme</p>
                  <p className="text-[#0B1B3F] font-medium">{event.film || "—"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0 text-[#004AF7]" aria-hidden />
                <div>
                  <p className="text-xs font-semibold">Data</p>
                  <p className="text-[#0B1B3F] font-medium">
                    {event.date ? new Date(event.date).toLocaleDateString("pt-BR") : "—"}
                    {event.time ? ` · ${event.time}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 text-[#004AF7]" aria-hidden />
                <div>
                  <p className="text-xs font-semibold">Local</p>
                  <p className="text-[#0B1B3F] font-medium">{event.location}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Users className="w-4 h-4 flex-shrink-0 text-[#004AF7]" aria-hidden />
                <div>
                  <p className="text-xs font-semibold">Vagas</p>
                  <p className="text-[#0B1B3F] font-medium">{spots > 0 ? `${spots} disponíveis` : "Lotado"}</p>
                </div>
              </div>
            </div>
            {event.description && (
              <p className="text-[#667085] leading-relaxed">{event.description?.replace(" [demo]", "")}</p>
            )}
            {event.certificate && (
              <div className="flex gap-2 text-[#004AF7] bg-[#EBF0FF] rounded-[4px] px-3 py-2 text-xs">
                <Award className="w-4 h-4 flex-shrink-0" aria-hidden />
                Certificado mediante presença e check-in no local.
              </div>
            )}

            {step === "confirm" && (
              <div className="border border-[#E2E8F0] bg-[#F2F5FB] rounded-[4px] p-4" role="region" aria-label="Confirmar inscrição">
                <p className="text-sm text-[#3D4A66]">
                  Confirma inscrição em <strong className="text-[#0B1B3F]">{event.title}</strong>?
                </p>
                <div className="flex gap-2 mt-3">
                  <Button onClick={confirm} disabled={busy}>Confirmar</Button>
                  <Button variant="ghost" onClick={() => setStep("idle")} disabled={busy}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {step === "done" && (
              <div className="border border-[#E2E8F0] rounded-[4px] p-4 flex flex-col sm:flex-row items-center gap-4" role="status">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <QrCodeImage
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/funcionario/eventos/${event.id}/presenca?inscricao=${encodeURIComponent(user?.registration || user?.id || "")}`}
                    size={128}
                    label={`QR Code de check-in da inscrição no evento ${event.title}`}
                  />
                  <span className="text-xs text-[#667085] tabular-nums">EVT-{event.id}{user?.registration ? ` · ${user.registration}` : ""}</span>
                </div>
                <div>
                  <p className="font-semibold text-[#0B1B3F]">Comprovante de inscrição</p>
                  <p className="text-sm text-[#667085] mt-1">Apresente este QR Code no check-in do evento.</p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {step === "idle" && (
                <Button size="lg" disabled={spots <= 0} onClick={() => setStep("confirm")}>
                  Inscrever-se
                </Button>
              )}
              <Link href="/aluno/eventos">
                <Button size="lg" variant="outline">
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
