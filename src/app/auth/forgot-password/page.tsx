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
      // In production, call /api/auth/forgot-password
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
    <div className="w-full max-w-md animate-slide-up">
      <div className="card p-8">
        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✉️</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
            <p className="text-sm text-[#a0a0ab] mb-6">
              If an account exists for <strong className="text-white">{email}</strong>, a reset link has been sent.
            </p>
            <Link href="/auth/login" className="btn btn-secondary w-full justify-center">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black tracking-tight mb-2">Reset Password</h1>
              <p className="text-sm text-[#62626f]">Enter your email to receive a reset link.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-sm text-[#62626f] hover:text-white transition-colors">
                ← Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
