import fs from "node:fs";
import path from "node:path";
import type { BrowserContext, Page } from "@playwright/test";

export const API_URL = (process.env.E2E_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
export const PASSWORD = process.env.E2E_PASSWORD ?? "videoteca123";

/** Seed users (VideoTeca-BackEnd/db/seed/seed_dev.sql). */
export const USERS = {
  aluno: { email: "aluno@edu.unifor.br", registration: "2020001", home: "/aluno" },
  professor: { email: "professor@unifor.br", registration: "SIAPE1001", home: "/professor" },
  funcionario: { email: "funcionario@unifor.br", registration: "FUNC001", home: "/funcionario" },
} as const;
export type Role = keyof typeof USERS;

export type Session = { token: string; user: Record<string, unknown> };

const SESSIONS_FILE = path.join(__dirname, ".auth", "sessions.json");

export async function apiLogin(login: string, role: string, password = PASSWORD): Promise<Session> {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password, role }),
  });
  if (!res.ok) throw new Error(`Login ${login}/${role} falhou: ${res.status} ${await res.text()}`);
  return res.json();
}

export function saveSessions(sessions: Record<Role, Session>) {
  fs.mkdirSync(path.dirname(SESSIONS_FILE), { recursive: true });
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
}

/** Sessions created once in global-setup (avoids the login rate limit). */
export function session(role: Role): Session {
  const all = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf8")) as Record<Role, Session>;
  return all[role];
}

export async function api<T = unknown>(
  auth: Role | Session,
  method: string,
  route: string,
  body?: unknown,
): Promise<T> {
  const token = typeof auth === "string" ? session(auth).token : auth.token;
  const res = await fetch(`${API_URL}/api/v1${route}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${route} → ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

/** Signs the browser in exactly as the login page does (localStorage + cookie). */
export async function signIn(context: BrowserContext, auth: Role | Session) {
  const s = typeof auth === "string" ? session(auth) : auth;
  const url = new URL(process.env.E2E_BASE_URL ?? "http://localhost:3000");
  await context.addCookies([
    { name: "vt_token", value: s.token, domain: url.hostname, path: "/", sameSite: "Lax" },
  ]);
  await context.addInitScript(
    ([token, user]) => {
      window.localStorage.setItem("vt_token", token);
      window.localStorage.setItem("vt_user", user);
    },
    [s.token, JSON.stringify(s.user)] as const,
  );
}

/** Unsigned JWT-shaped token: enough for the middleware (which does not verify). */
export function fakeJwt(payload: Record<string, unknown>) {
  const enc = (v: unknown) => Buffer.from(JSON.stringify(v)).toString("base64url");
  return `${enc({ alg: "HS256", typ: "JWT" })}.${enc(payload)}.assinatura-invalida`;
}

export const unique = (prefix: string) =>
  `${prefix} ${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Random future slot far from seed data, to avoid room conflicts between runs. */
export function futureSlot(hours = 2) {
  const start = new Date();
  start.setDate(start.getDate() + 60 + Math.floor(Math.random() * 600));
  start.setHours(8 + Math.floor(Math.random() * 10), 0, 0, 0);
  const end = new Date(start.getTime() + hours * 3600_000);
  return { start, end };
}

/** yyyy-mm-dd / yyyy-mm-ddThh:mm in local time (for date inputs). */
export const localDate = (d: Date) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
export const localDateTime = (d: Date) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

type Film = { id: number; title: string };
type SessionRow = { id: number; title: string };

export async function createFilm(fields: Record<string, unknown>): Promise<Film> {
  return api<Film>("funcionario", "POST", "/staff/films", {
    title: unique("E2E Filme"),
    year: 2001,
    genre: "Drama",
    ...fields,
  });
}

/** Creates a draft session, retrying on room conflicts with another random slot. */
export async function createSession(filmId: number, title = unique("E2E Sessão")): Promise<SessionRow> {
  let last: unknown;
  for (let i = 0; i < 5; i++) {
    const { start, end } = futureSlot();
    try {
      return await api<SessionRow>("funcionario", "POST", "/staff/sessions", {
        title,
        film_id: filmId,
        room_id: 1,
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
        slots: 10,
        description: "Criada pelos testes de aceitação",
      });
    } catch (e) {
      last = e;
    }
  }
  throw last;
}

/** Minimal valid PDF (magic bytes %PDF-) for the proof upload. */
export const PDF_PROOF = {
  name: "autorizacao-e2e.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.from(
    "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n",
  ),
};

export async function expectPath(page: Page, pathname: string) {
  await page.waitForURL((u) => u.pathname === pathname);
}
