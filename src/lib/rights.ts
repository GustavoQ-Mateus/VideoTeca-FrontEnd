import { getToken } from "@/lib/auth";
import { apiBase, request } from "@/lib/sprint-api";

export type RightsStatus = "pending" | "authorized" | "denied" | "public_domain";

export const RIGHTS_STATUS_OPTIONS: { value: RightsStatus; label: string }[] = [
  { value: "pending", label: "Pendente" },
  { value: "authorized", label: "Autorizado" },
  { value: "denied", label: "Negado" },
  { value: "public_domain", label: "Domínio público" },
];

export const LICENSE_TYPE_OPTIONS = [
  { value: "", label: "Não informado" },
  { value: "exibicao_publica", label: "Exibição pública" },
  { value: "educacional", label: "Uso educacional" },
  { value: "cessao_gratuita", label: "Cessão gratuita" },
  { value: "outro", label: "Outro" },
];

export const RIGHTS_STATUS_STYLE: Record<RightsStatus, string> = {
  pending: "text-warning",
  authorized: "text-success",
  denied: "text-danger",
  public_domain: "text-brand",
};

export const rightsLabel = (status?: string | null) =>
  RIGHTS_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? "Pendente";

export const licenseLabel = (value?: string | null) =>
  LICENSE_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value ?? "";

export type FilmRights = {
  rights_status: RightsStatus;
  rights_holder: string;
  license_type: string;
  rights_valid_until: string | null;
  rights_notes: string;
};

/** Client-side mirror of the API rules (the server remains authoritative). */
export function validateRights(r: FilmRights): string | null {
  if (r.rights_holder.length > 200) return "Titular deve ter até 200 caracteres.";
  if (r.license_type.length > 80) return "Tipo de licença deve ter até 80 caracteres.";
  if (r.rights_notes.length > 2000) return "Observações devem ter até 2000 caracteres.";
  if (r.rights_status === "authorized") {
    if (!r.rights_holder.trim())
      return "Informe o titular dos direitos para marcar o filme como autorizado.";
    if (r.rights_valid_until) {
      const today = new Date();
      const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
      if (r.rights_valid_until < iso)
        return "A validade da autorização já expirou. Atualize a data ou o status.";
    }
  }
  return null;
}

/** Whether the film can be shown in a session ending at `endsAt` (UX hint only). */
export function rightsAllowShowing(r: Partial<FilmRights>, endsAt?: Date): boolean {
  if (r.rights_status === "public_domain") return true;
  if (r.rights_status !== "authorized") return false;
  if (!r.rights_valid_until) return true;
  const limit = new Date(`${r.rights_valid_until}T23:59:59`);
  return !endsAt || limit >= endsAt;
}

// ── Comprovantes (T21.3) ─────────────────────────────────────────────────────

export type RightsProof = {
  id: number;
  filename: string;
  media_type: string;
  size: number;
  sha256: string;
  uploaded_at: string;
  uploaded_by_name: string | null;
};

export const PROOF_MAX_BYTES = 10 * 1024 * 1024;
export const PROOF_ACCEPT = "application/pdf,image/png,image/jpeg";
const PROOF_TYPES = ["application/pdf", "image/png", "image/jpeg"];

async function sniff(file: File): Promise<string | null> {
  const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const starts = (sig: number[]) => sig.every((b, i) => head[i] === b);
  if (starts([0x25, 0x50, 0x44, 0x46, 0x2d])) return "application/pdf";
  if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (starts([0xff, 0xd8, 0xff])) return "image/jpeg";
  return null;
}

/** Validates type (by content signature) and size before uploading. */
export async function validateProofFile(file: File): Promise<string | null> {
  if (!file.size) return "O arquivo está vazio.";
  if (file.size > PROOF_MAX_BYTES) return "O comprovante deve ter no máximo 10 MB.";
  const kind = await sniff(file);
  if (!kind || (file.type && !PROOF_TYPES.includes(file.type)))
    return "Envie um arquivo PDF, PNG ou JPEG válido.";
  return null;
}

const proofsPath = (filmId: number) => `/staff/films/${filmId}/rights-proofs`;

export const listProofs = (filmId: number) =>
  request<RightsProof[]>(proofsPath(filmId));

export function uploadProof(filmId: number, file: File) {
  const data = new FormData();
  data.set("file", file);
  return request<RightsProof>(proofsPath(filmId), { method: "POST", body: data });
}

export const deleteProof = (filmId: number, proofId: number) =>
  request<{ ok: boolean }>(`${proofsPath(filmId)}/${proofId}`, {
    method: "DELETE",
  });

/** Downloads with the bearer token (a plain link would not authenticate). */
export async function downloadProof(filmId: number, proof: RightsProof) {
  const headers = new Headers();
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(
    `${apiBase()}/api/v1${proofsPath(filmId)}/${proof.id}`,
    { headers, cache: "no-store" },
  ).catch(() => {
    throw new Error("Não foi possível conectar. Tente novamente.");
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      typeof data.detail === "string" ? data.detail : "Não foi possível baixar o comprovante",
    );
  }
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = proof.filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const formatBytes = (n: number) =>
  n < 1024
    ? `${n} B`
    : n < 1024 * 1024
      ? `${(n / 1024).toFixed(0)} KB`
      : `${(n / 1024 / 1024).toFixed(1)} MB`;
