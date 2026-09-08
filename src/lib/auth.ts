export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "aluno" | "professor" | "funcionario" | "admin";
  registration?: string;
  course?: string;
  phone?: string;
}

const TOKEN_KEY = "vt_token";
const USER_KEY  = "vt_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setSession(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // Cookie para o middleware (server-side route protection)
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function roleHome(role: string): string {
  switch (role) {
    case "professor":   return "/professor";
    case "funcionario":
    case "admin":       return "/funcionario";
    default:            return "/aluno";
  }
}
