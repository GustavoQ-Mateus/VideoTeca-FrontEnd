import { getToken } from "@/lib/auth";
import type { FilmRecord } from "@/lib/types";

const base = () => process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(`${base()}${path}`, { ...init, headers, cache: "no-store" });
}

async function get<T>(path: string): Promise<T | null> {
  const res = await apiFetch(path);
  if (!res.ok) return null;
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T | null> {
  const res = await apiFetch(path, { method: "POST", body: JSON.stringify(body) });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Erro na requisição");
  }
  return res.json();
}

async function put<T>(path: string, body: unknown): Promise<T | null> {
  const res = await apiFetch(path, { method: "PUT", body: JSON.stringify(body) });
  if (!res.ok) return null;
  return res.json();
}

async function del(path: string): Promise<boolean> {
  const res = await apiFetch(path, { method: "DELETE" });
  return res.ok;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function apiLogin(login: string, password: string, role: string) {
  return post<{ token: string; user: any }>("/api/v1/auth/login", { login, password, role });
}

export async function apiMe() {
  return get<any>("/api/v1/auth/me");
}

// ── Catalog (public) ─────────────────────────────────────────────────────────

export async function fetchCatalogFilms(): Promise<FilmRecord[]> {
  const b = base();
  if (!b) return [];
  const res = await fetch(`${b}/api/v1/catalog/films`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchFilmById(id: number): Promise<FilmRecord | null> {
  const b = base();
  if (!b) return null;
  const res = await fetch(`${b}/api/v1/catalog/films/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

// ── Events (public) ──────────────────────────────────────────────────────────

export async function fetchEvents() {
  return get<any[]>("/api/v1/events") ?? [];
}

// ── Student ──────────────────────────────────────────────────────────────────

export const student = {
  profile:       () => get<any>("/api/v1/student/profile"),
  stats:         () => get<any>("/api/v1/student/stats"),
  loans:         () => get<any[]>("/api/v1/student/loans"),
  reservations:  () => get<any[]>("/api/v1/student/reservations"),
  reserve:       (film_id: number) => post("/api/v1/student/reservations", { film_id }),
  cancelReserve: (id: number) => del(`/api/v1/student/reservations/${id}`),
  events:        () => get<any[]>("/api/v1/student/events"),
  enroll:        (id: number) => post(`/api/v1/student/events/${id}/enroll`, {}),
  unenroll:      (id: number) => del(`/api/v1/student/events/${id}/enroll`),
  favorites:     () => get<any[]>("/api/v1/student/favorites"),
  notifications: () => get<any[]>("/api/v1/student/notifications"),
  markRead:      (id: number) => put(`/api/v1/student/notifications/${id}/read`, {}),
};

// ── Professor ────────────────────────────────────────────────────────────────

export const professor = {
  profile:     () => get<any>("/api/v1/professor/profile"),
  stats:       () => get<any>("/api/v1/professor/stats"),
  requests:    () => get<any[]>("/api/v1/professor/requests"),
  requestFilm: (body: any) => post("/api/v1/professor/requests/film", body),
  requestRoom: (body: any) => post("/api/v1/professor/requests/room", body),
};

// ── Staff ────────────────────────────────────────────────────────────────────

export const staff = {
  stats:              () => get<any>("/api/v1/staff/stats"),
  inventory:          () => get<any[]>("/api/v1/staff/inventory"),
  createFilm:         (body: any) => post("/api/v1/staff/inventory", body),
  updateFilm:         (id: number, body: any) => put(`/api/v1/staff/inventory/${id}`, body),
  deleteFilm:         (id: number) => del(`/api/v1/staff/inventory/${id}`),
  loans:              () => get<any[]>("/api/v1/staff/loans"),
  createLoan:         (body: any) => post("/api/v1/staff/loans", body),
  returnLoan:         (id: number) => post(`/api/v1/staff/loans/${id}/return`, {}),
  reservations:       () => get<any[]>("/api/v1/staff/reservations"),
  confirmReservation: (id: number) => put(`/api/v1/staff/reservations/${id}/confirm`, {}),
  users:              () => get<any[]>("/api/v1/staff/users"),
  userByReg:          (reg: string) => get<any>(`/api/v1/staff/users/by-registration/${reg}`),
  rooms:              () => get<any[]>("/api/v1/staff/rooms"),
  events:             () => get<any[]>("/api/v1/staff/events"),
  createEvent:        (body: any) => post("/api/v1/staff/events", body),
  updateEvent:        (id: number, body: any) => put(`/api/v1/staff/events/${id}`, body),
  requests:           () => get<any[]>("/api/v1/staff/requests"),
  updateRequest:      (id: number, body: any) => put(`/api/v1/staff/requests/${id}`, body),
};
