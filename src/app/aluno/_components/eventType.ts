const LABELS: Record<string, string> = {
  session: "Sessão",
  sessao: "Sessão",
  exibicao: "Exibição",
  oficina: "Oficina",
  cineclube: "Cineclube",
  mostra: "Mostra",
  debate: "Debate",
  palestra: "Palestra",
  workshop: "Workshop",
};

/** Converte o tipo cru da API ("EXIBICAO", "session"...) em texto legível. */
export function eventTypeLabel(raw?: string | null): string {
  if (!raw) return "Evento";
  const key = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  if (LABELS[key]) return LABELS[key];
  const lower = raw.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}
