"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import type { EventRecord } from "@/lib/types";

function getEventById(_id: number): EventRecord | undefined { return undefined; }
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/providers/ToastProvider";
import { Film, MapPin, Users, Calendar, Award, QrCode } from "lucide-react";

const STUDENT = { name: "Ana Clara Mendes", course: "Cinema e Audiovisual" };

export default function AlunoEventoDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const event = getEventById(id);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"confirm" | "done">("confirm");
  const { toast } = useToast();

  if (!event) {
    return (
      <AppShell role="aluno" title="Evento" user={STUDENT}>
        <p className="text-[#667085]">
          Evento não encontrado.{" "}
          <Link href="/aluno/eventos" className="text-[#0066B3] font-medium underline">
            Voltar à lista
          </Link>
        </p>
      </AppShell>
    );
  }

  const spots = event.slots - event.enrolled;

  function confirm() {
    if (!event) return;
    setStep("done");
    toast({ title: "Inscrição confirmada", description: event.title, variant: "success" });
  }

  return (
    <AppShell role="aluno" title="Evento" user={STUDENT}>
      <div className="max-w-3xl mx-auto">
        <div className="rounded-[20px] overflow-hidden border border-[#E2E8F0] bg-white shadow-sm">
          <div className="h-40 bg-gradient-to-br from-violet-600 to-[#0066B3] p-6 flex flex-col justify-end text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 w-fit px-2 py-1 rounded-full mb-2">{event.type}</span>
            <h1 className="text-xl font-bold leading-tight">{event.title}</h1>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-4 text-[#667085]">
              <div className="flex gap-2">
                <Film className="w-4 h-4 flex-shrink-0" aria-hidden />
                <div>
                  <p className="text-xs uppercase font-semibold">Filme</p>
                  <p className="text-[#172033] font-medium">{event.film}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" aria-hidden />
                <div>
                  <p className="text-xs uppercase font-semibold">Data</p>
                  <p className="text-[#172033] font-medium">
                    {new Date(event.date).toLocaleDateString("pt-BR")} · {event.time}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden />
                <div>
                  <p className="text-xs uppercase font-semibold">Local</p>
                  <p className="text-[#172033] font-medium">{event.location}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Users className="w-4 h-4 flex-shrink-0" aria-hidden />
                <div>
                  <p className="text-xs uppercase font-semibold">Vagas</p>
                  <p className="text-[#172033] font-medium">{spots > 0 ? `${spots} disponíveis` : "Lotado"}</p>
                </div>
              </div>
            </div>
            <p className="text-[#667085] leading-relaxed">{event.description}</p>
            {event.certificate && (
              <div className="flex gap-2 text-[#0066B3] bg-[#E8F2FC] rounded-[12px] px-3 py-2 text-xs">
                <Award className="w-4 h-4 flex-shrink-0" aria-hidden />
                Certificado mediante presença e check-in no local.
              </div>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" disabled={spots <= 0} onClick={() => { setStep("confirm"); setOpen(true); }}>
                Inscrever-se
              </Button>
              <Link href="/aluno/eventos">
                <Button size="lg" variant="outline">
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => { setOpen(false); setStep("confirm"); }}
        title={step === "confirm" ? "Confirmar inscrição" : "Comprovante"}
        footer={
          step === "confirm" ? (
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={confirm}>Confirmar</Button>
            </>
          ) : (
            <Button onClick={() => { setOpen(false); setStep("confirm"); }}>Fechar</Button>
          )
        }
      >
        {step === "confirm" ? (
          <p className="text-sm text-[#667085]">Confirma inscrição em <strong className="text-[#172033]">{event.title}</strong>?</p>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-40 h-40 mx-auto rounded-[16px] border-2 border-dashed border-[#0066B3] flex flex-col items-center justify-center gap-2 bg-[#F5F7FA]">
              <QrCode className="w-16 h-16 text-[#0066B3]" aria-hidden />
              <span className="text-[10px] text-[#667085] font-mono">EVT-{event.id}-2026</span>
            </div>
            <p className="text-sm text-[#667085]">Apresente este QR Code no check-in do evento.</p>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
