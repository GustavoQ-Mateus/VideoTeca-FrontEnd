"use client";
import { useMemo, useSyncExternalStore } from "react";
import type { AuthUser } from "./auth";
const subscribe = (listener: () => void) => {
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
};
const snapshot = () => window.localStorage.getItem("vt_user");
const serverSnapshot = () => null;
export function useAuthUser(): AuthUser | null {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }, [raw]);
}
