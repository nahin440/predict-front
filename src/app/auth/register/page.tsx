"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth/AuthContext";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg style={{ width: 16, height: 16, animation: "spin 0.8s linear infinite", flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

export default function RegisterPage() {
  const { login } = useAuth();
  const [loading, setLoading]             = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  function doRedirect(role: string) {
    setTimeout(() => { window.location.href = role === "ADMIN" ? "/admin" : "/dashboard"; }, 80);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    if (form.password.length < 8)       return toast.error("Password must be at least 8 characters");
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      login(data.data.user, data.data.accessToken);
      toast.success("Account created! Welcome to GoldPredict.");
      doRedirect(data.data.user.role);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      // Dynamic import — Firebase never runs on SSR/prerender
      const { signInWithGoogle } = await import("@/lib/firebase/client");
      const result = await signInWithGoogle();
      const fb     = result.user;

      const res  = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: fb.uid, email: fb.email, name: fb.displayName, photoURL: fb.photoURL }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google sign-up failed");
      login(data.data.user, data.data.accessToken);
      toast.success(`Welcome, ${data.data.user.name}!`);
      doRedirect(data.data.user.role);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Google sign-up failed";
      if (!msg.includes("popup-closed") && !msg.includes("cancelled")) toast.error(msg);
      setGoogleLoading(false);
    }
  }

  return (
    <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.4s ease both" }}>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

      <div className="card" style={{ padding: 36 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>Create Account</h1>
          <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 13, color: "var(--fog)" }}>Start free. No credit card required.</p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            padding: "12px 16px", borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
            cursor: googleLoading ? "not-allowed" : "pointer",
            opacity: googleLoading ? 0.6 : 1,
            fontFamily: "var(--font-space-grotesk)", fontSize: 14, fontWeight: 500, color: "var(--paper)",
            transition: "all 0.15s ease",
            marginBottom: 20,
          }}
          onMouseEnter={e => { if (!googleLoading) { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; } }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
          {googleLoading ? <Spinner /> : <GoogleIcon />}
          {googleLoading ? "Connecting…" : "Sign up with Google"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--slate)" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label className="label">Full Name</label>
            <input type="text" className="input" placeholder="Your name"
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              required minLength={2} autoComplete="name" />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" className="input" placeholder="you@example.com"
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required autoComplete="email" />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" placeholder="Min 8 chars, uppercase + number"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required autoComplete="new-password" />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input type="password" className="input" placeholder="Repeat password"
              value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
              required autoComplete="new-password" />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
            {loading ? <><Spinner /> Creating…</> : "Create Account"}
          </button>
        </form>

        <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 11, color: "var(--slate)", textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>
          By registering you agree to our{" "}
          <Link href="/terms" style={{ color: "#f59e0b", textDecoration: "none" }}>Terms</Link> and{" "}
          <Link href="/privacy-policy" style={{ color: "#f59e0b", textDecoration: "none" }}>Privacy Policy</Link>
        </p>

        <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 13, color: "var(--fog)" }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "#f59e0b", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
