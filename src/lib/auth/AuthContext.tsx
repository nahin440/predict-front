"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  subscription?: { plan: string; status: string };
  isVerified: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: async () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: load from localStorage immediately (synchronous-ish)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("xau_user");
      const storedToken = localStorage.getItem("xau_token");
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((newUser: AuthUser, newToken: string) => {
    // Persist to localStorage first
    localStorage.setItem("xau_user", JSON.stringify(newUser));
    localStorage.setItem("xau_token", newToken);
    // Then update state
    setUser(newUser);
    setToken(newToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch { /* ignore */ }
    localStorage.removeItem("xau_user");
    localStorage.removeItem("xau_token");
    setUser(null);
    setToken(null);
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
