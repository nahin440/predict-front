"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { auth, googleProvider, signInWithPopup } from "@/lib/firebase/client";

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

export default function RegisterPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  function doRedirect(role: string) {
    setTimeout(() => { window.location.href = role === "ADMIN" ? "/admin" : "/dashboard"; }, 80);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    if (form.password.length < 8) return toast.error("Password must be at least 8 characters");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
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
      const result = await signInWithPopup(auth, googleProvider);
      const fb = result.user;
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: fb.uid, email: fb.email, name: fb.displayName, photoURL: fb.photoURL })
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
    <div className="w-full max-w-md animate-slide-up">
      <div className="card p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tight mb-2">Create Account</h1>
          <p className="text-sm text-[#62626f]">Start free. Upgrade anytime.</p>
        </div>

        {/* Google */}
        <button onClick={handleGoogle} disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.2] transition-all mb-5 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          {googleLoading
            ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            : <GoogleIcon />}
          {googleLoading ? "Connecting…" : "Sign up with Google"}
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-xs text-[#62626f] font-mono">OR</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input type="text" className="input" placeholder="Your name" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required minLength={2} autoComplete="name" />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" className="input" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required autoComplete="email" />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" placeholder="Min 8 chars, uppercase + number"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required autoComplete="new-password" />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input type="password" className="input" placeholder="Repeat password" value={form.confirm}
              onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} required autoComplete="new-password" />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center mt-2">
            {loading
              ? <span className="flex items-center gap-2"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating…</span>
              : "Create Account"}
          </button>
        </form>

        <p className="text-xs text-[#62626f] text-center mt-4">
          By registering you agree to our{" "}
          <Link href="/terms" className="text-amber-400/70 hover:text-amber-400">Terms</Link> and{" "}
          <Link href="/privacy-policy" className="text-amber-400/70 hover:text-amber-400">Privacy Policy</Link>.
        </p>
        <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-sm text-[#62626f]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
