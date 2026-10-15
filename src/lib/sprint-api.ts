import { getToken } from "@/lib/auth";

export const apiBase = () =>
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
export async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData))
    headers.set("Content-Type", "application/json");
  let response: Response;
  try {
    response = await fetch(`${apiBase()}/api/v1${path}`, {
      ...init,
      headers,
      cache: "no-store",
      signal: init.signal ?? AbortSignal.timeout(55000),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    )
      throw new Error(
        "Tempo de resposta excedido. Consulte suas solicitações antes de reenviar.",
      );
    throw new Error(
      "Não foi possível conectar. Verifique sua conexão e tente novamente.",
    );
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const detail = data.detail;
    throw new Error(
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail
              .map(
                (e: { loc?: string[]; msg: string }) =>
                  `${e.loc?.slice(1).join(".") ?? ""}: ${e.msg}`,
              )
              .join("; ")
          : "Não foi possível concluir a operação",
    );
  }
  return response.json();
}
export const message = (error: unknown) =>
  error instanceof Error ? error.message : "Erro inesperado";
export const asISO = (value: FormDataEntryValue | null) =>
  new Date(String(value)).toISOString();
