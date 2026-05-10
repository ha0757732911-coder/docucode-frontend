import { useEffect, useState } from "react";

//WORKER_URL=docucode-api.ha0757732911.workers.dev
const API = "https://docucode-api.ha0757732911.workers.dev";

export type User = {
  email: string;
  registered: string;
  role?: string;
  isGuest?: boolean;
};

const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem("dc_user") || "null"); }
  catch { return null; }
}

export function getToken(): string | null {
  return localStorage.getItem("dc_token");
}

function saveUser(user: User | null, token: string | null) {
  if (user && token) {
    localStorage.setItem("dc_user", JSON.stringify(user));
    localStorage.setItem("dc_token", token);
  } else {
    localStorage.removeItem("dc_user");
    localStorage.removeItem("dc_token");
  }
  emit();
}

export async function apiRegister(email: string, password: string): Promise<string | null> {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return data.error || "Registration failed";
  saveUser(
    { email: data.email, registered: new Date().toISOString().slice(0, 10), role: data.role },
    data.token
  );
  return null;
}

export async function apiLogin(email: string, password: string): Promise<string | null> {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return data.error || "Login failed";
  saveUser(
    { email: data.email, registered: new Date().toISOString().slice(0, 10), role: data.role },
    data.token
  );
  return null;
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
    loginGuest: () => {
      saveUser(
        { email: "guest@docucode.dev", registered: new Date().toISOString().slice(0, 10), isGuest: true },
        "guest"
      );
    },
    logout: () => saveUser(null, null),
  };
}

export { API };
