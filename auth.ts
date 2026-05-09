import { useEffect, useState } from "react";

export type User = { email: string; registered: string; isGuest?: boolean };
const KEY = "docucode_user";

const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setUser(u: User | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
  emit();
}

export function useAuth() {
  const [user, setU] = useState<User | null>(() => getUser());
  useEffect(() => {
    const fn = () => setU(getUser());
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return {
    user,
    login: (email: string) => setUser({ email, registered: new Date().toISOString().slice(0, 10) }),
    loginGuest: () => setUser({ email: "guest@docucode.dev", registered: new Date().toISOString().slice(0, 10), isGuest: true }),
    logout: () => setUser(null),
  };
}
