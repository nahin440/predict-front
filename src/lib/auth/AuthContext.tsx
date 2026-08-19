"use client";
import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";

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

// Access tokens are short-lived (15m — see JWT_EXPIRES_IN) so that a leaked
// token has a small blast radius, but the refresh token cookie lasts 7
// days. Without this, the person would be silently logged out the moment
// the 15-minute access token expires, even though their session is still
// valid — that's the "have to log in every 5-10 minutes" bug. This module
// schedules a silent call to /api/auth/refresh shortly before the access
// token expires, so a session started in a browser stays alive for up to
// the full 7-day refresh window without ever showing a login prompt,
// while each individual access token in flight still only lives 15
// minutes.
const REFRESH_MARGIN_MS = 60_000; // refresh 60s before actual expiry

// Reads the standard `exp` claim (seconds since epoch) out of a JWT without
// verifying its signature — safe here because the token only ever comes
// from our own login/refresh responses, never from user input. Decode-only,
// client-side, just to know when to proactively refresh.
function getTokenExpiryMs(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const decoded = JSON.parse(json) as { exp?: number };
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const applyToken = useCallback((newToken: string) => {
    localStorage.setItem("xau_token", newToken);
    setToken(newToken);
  }, []);

  // Forward-declared via ref so scheduleRefresh and doRefresh can call each
  // other without a circular useCallback dependency.
  const scheduleRefreshRef = useRef<(token: string) => void>(() => {});

  const doRefresh = useCallback(async (currentToken: string) => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (!res.ok) throw new Error("refresh failed");
      const data = await res.json();
      const newToken: string | undefined = data?.data?.accessToken;
      if (!newToken) throw new Error("no accessToken in refresh response");
      applyToken(newToken);
      scheduleRefreshRef.current(newToken);
    } catch {
      // Refresh token itself is expired/revoked (past the 7-day window,
      // or reuse-detected) — there's no session left to silently extend,
      // so fall back to a real logout instead of leaving the UI in a
      // broken state with a stale, now-unusable access token.
      clearRefreshTimer();
      localStorage.removeItem("xau_user");
      localStorage.removeItem("xau_token");
      setUser(null);
      setToken(null);
    }
  }, [applyToken, clearRefreshTimer]);

  const scheduleRefresh = useCallback((currentToken: string) => {
    clearRefreshTimer();
    const expiryMs = getTokenExpiryMs(currentToken);
    if (!expiryMs) return;
    const delay = Math.max(expiryMs - Date.now() - REFRESH_MARGIN_MS, 0);
    refreshTimerRef.current = setTimeout(() => doRefresh(currentToken), delay);
  }, [clearRefreshTimer, doRefresh]);

  useEffect(() => { scheduleRefreshRef.current = scheduleRefresh; }, [scheduleRefresh]);

  // Cross-tab sync: if another tab in the same browser refreshes the token
  // (e.g. dashboard open in two tabs), localStorage's native `storage`
  // event fires here so this tab adopts the new token and reschedules its
  // own timer against it, instead of racing to refresh the now-stale token
  // itself and tripping the refresh endpoint's reuse-detection logic.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "xau_token") {
        if (e.newValue) {
          setToken(e.newValue);
          scheduleRefreshRef.current(e.newValue);
        } else {
          // Another tab logged out — mirror that here too.
          clearRefreshTimer();
          setUser(null);
          setToken(null);
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [clearRefreshTimer]);

  // On mount: load from localStorage immediately (synchronous-ish)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("xau_user");
      const storedToken = localStorage.getItem("xau_token");
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        // The stored access token may already be expired (e.g. the tab was
        // closed for a while) — refresh immediately if so, otherwise
        // schedule the next silent refresh normally.
        const expiryMs = getTokenExpiryMs(storedToken);
        if (expiryMs && expiryMs - REFRESH_MARGIN_MS <= Date.now()) {
          doRefresh(storedToken);
        } else {
          scheduleRefresh(storedToken);
        }
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
    return () => clearRefreshTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback((newUser: AuthUser, newToken: string) => {
    // Persist to localStorage first
    localStorage.setItem("xau_user", JSON.stringify(newUser));
    localStorage.setItem("xau_token", newToken);
    // Then update state
    setUser(newUser);
    setToken(newToken);
    scheduleRefresh(newToken);
  }, [scheduleRefresh]);

  const logout = useCallback(async () => {
    clearRefreshTimer();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch { /* ignore */ }
    localStorage.removeItem("xau_user");
    localStorage.removeItem("xau_token");
    setUser(null);
    setToken(null);
    window.location.href = "/";
  }, [clearRefreshTimer]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
