import { API_URL, USERS, apiLogin, saveSessions, type Role, type Session } from "./support";

/** Checks the API is up and logs each seed profile in once. */
export default async function globalSetup() {
  const health = await fetch(`${API_URL}/health`).catch(() => null);
  if (!health?.ok)
    throw new Error(`API indisponível em ${API_URL} (defina E2E_API_URL e suba o backend).`);
  const sessions = {} as Record<Role, Session>;
  for (const role of Object.keys(USERS) as Role[]) {
    sessions[role] = await apiLogin(USERS[role].email, role);
  }
  saveSessions(sessions);
}
