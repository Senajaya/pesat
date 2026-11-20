import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch, setAccessToken } from "../api/client";

export interface UserProfile {
  id: string;
  nama: string;
  email: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nama: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/auth/refresh`,
        { method: "POST", credentials: "include" }
      );
      if (!res.ok) {
        setAccessToken(null);
        setUser(null);
        return;
      }
      const data = await res.json();
      setAccessToken(data.accessToken);
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (email: string, password: string) => {
    const data = await apiFetch<{ user: UserProfile; accessToken: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const register = async (nama: string, email: string, password: string) => {
    const data = await apiFetch<{ user: UserProfile; accessToken: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ nama, email, password }),
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return ctx;
}