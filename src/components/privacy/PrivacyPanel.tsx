"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getToken, clearSession } from "@/lib/auth";
import { apiBase, request, message } from "@/lib/sprint-api";

type PrivacyState = { policy_version: string; accepted_at: string | null };

const CONFIRM_WORD = "EXCLUIR";

async function downloadMyData() {
  const headers = new Headers();
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${apiBase()}/api/v1/me/data`, {
      headers,
      cache: "no-store",
    });
  } catch {
    throw new Error("Não foi possível conectar. Tente novamente.");
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Não foi possível exportar seus dados",
    );
  }
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = "meus-dados.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PrivacyPanel() {
  const uid = useId();
  const [state, setState] = useState<PrivacyState | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"" | "consent" | "export" | "delete">("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    request<PrivacyState>("/me/privacy")
      .then(setState)
      .catch((e) => setError(message(e)))
      .finally(() => setLoading(false));
  }, []);

  async function accept() {
    if (!state) return;
    setBusy("consent");
    setError("");
    setStatus("");
    try {
      await request("/me/privacy/consent", {
        method: "POST",
        body: JSON.stringify({ policy_version: state.policy_version }),
      });
      setState(await request<PrivacyState>("/me/privacy"));
      setStatus("Aceite registrado. Obrigado!");
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy("");
    }
  }

  async function exportData() {
    setBusy("export");
    setError("");
    setStatus("");
    try {
      await downloadMyData();
      setStatus("Download de “meus-dados.json” iniciado.");
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy("");
    }
  }

  async function requestDeletion(e: React.FormEvent) {
    e.preventDefault();
    if (confirmText.trim().toUpperCase() !== CONFIRM_WORD) return;
    setBusy("delete");
    setError("");
    setStatus("");
    try {
      await request("/me/deletion", { method: "POST" });
      clearSession();
      setStatus("Conta excluída. Você será redirecionado…");
      window.setTimeout(() => window.location.assign("/"), 2500);
    } catch (err) {
      // 409: active loans/withdrawals or future reservations block deletion.
      setError(message(err));
    } finally {
      setBusy("");
    }
  }

  const accepted = !!state?.accepted_at;

  return (
    <section
      aria-labelledby={`${uid}-title`}
      className="space-y-5 rounded-[18px] border border-[#E2E8F0] bg-white p-6"
    >
      <div>
        <h2 id={`${uid}-title`} className="font-semibold text-[#172033]">
          Privacidade e dados pessoais
        </h2>
        <p className="mt-1 text-sm text-[#667085]">
          Seus direitos conforme a LGPD. Leia a{" "}
          <Link href="/privacidade" className="text-[#0066B3] underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-[10px] border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </p>
      )}
      <p role="status" aria-live="polite" className="text-sm text-emerald-800">
        {status}
      </p>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Aceite da política</h3>
        {loading ? (
          <p className="text-sm">Carregando…</p>
        ) : state ? (
          accepted ? (
            <p className="text-sm">
              Você aceitou a versão {state.policy_version} em{" "}
              {new Date(state.accepted_at as string).toLocaleString("pt-BR")}.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm">
                Você ainda não aceitou a versão {state.policy_version} da
                política.
              </p>
              <Button
                size="sm"
                onClick={accept}
                loading={busy === "consent"}
                disabled={!!busy}
              >
                Li e aceito a política de privacidade
              </Button>
            </div>
          )
        ) : null}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Baixar meus dados</h3>
        <p className="text-sm text-[#667085]">
          Gera um arquivo JSON com seu cadastro, reservas, empréstimos,
          solicitações e consentimentos.
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={exportData}
          loading={busy === "export"}
          disabled={!!busy}
        >
          Baixar meus dados
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-[#B42318]">
          Excluir minha conta
        </h3>
        <p className="text-sm text-[#667085]">
          Seus dados de identificação serão anonimizados e você perderá o
          acesso. Não é possível excluir enquanto houver empréstimos, retiradas
          de equipamento ou reservas futuras em aberto.
        </p>
        {!confirming ? (
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setConfirming(true);
              setConfirmText("");
            }}
            disabled={!!busy}
          >
            Solicitar exclusão
          </Button>
        ) : (
          <form
            onSubmit={requestDeletion}
            className="space-y-3 rounded-[12px] border border-red-200 bg-red-50 p-4"
          >
            <label htmlFor={`${uid}-confirm`} className="block text-sm">
              Esta ação não pode ser desfeita. Digite{" "}
              <strong>{CONFIRM_WORD}</strong> para confirmar.
            </label>
            <input
              id={`${uid}-confirm`}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoComplete="off"
              className="h-10 w-full max-w-xs rounded-[10px] border border-[#E2E8F0] bg-white px-3 text-sm"
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                variant="danger"
                loading={busy === "delete"}
                disabled={
                  confirmText.trim().toUpperCase() !== CONFIRM_WORD || !!busy
                }
              >
                Confirmar exclusão
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setConfirming(false)}
                disabled={busy === "delete"}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
