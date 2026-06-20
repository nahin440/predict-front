"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setSent(true);
      toast.success("Reset link sent if email exists");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.4s ease both" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}`}</style>
      <div className="card" style={{ padding: 36 }}>
        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(0,230,118,0.1)", border:"1px solid rgba(0,230,118,0.2)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:28 }}>✉️</div>
            <h2 style={{ fontFamily:"var(--font-syne)", fontSize:22, fontWeight:800, letterSpacing:"-0.03em", marginBottom:10 }}>Check Your Email</h2>
            <p style={{ fontFamily:"var(--font-space-grotesk)", fontSize:13, color:"var(--fog)", lineHeight:1.6, marginBottom:24 }}>
              If an account exists for <strong style={{ color:"var(--paper)" }}>{email}</strong>, a reset link has been sent.
            </p>
            <Link href="/auth/login" className="btn btn-secondary" style={{ textDecoration:"none", width:"100%", justifyContent:"center" }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <h1 style={{ fontFamily:"var(--font-syne)", fontSize:26, fontWeight:800, letterSpacing:"-0.03em", marginBottom:6 }}>Reset Password</h1>
              <p style={{ fontFamily:"var(--font-space-grotesk)", fontSize:13, color:"var(--fog)" }}>Enter your email to receive a reset link.</p>
            </div>
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  required autoComplete="email" />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width:"100%", justifyContent:"center" }}>
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
            <div style={{ marginTop:20, textAlign:"center" }}>
              <Link href="/auth/login" style={{ fontFamily:"var(--font-space-grotesk)", fontSize:13, color:"var(--slate)", textDecoration:"none" }}>
                ← Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
