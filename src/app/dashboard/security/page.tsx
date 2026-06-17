"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth/AuthContext";

export default function SecurityPage() {
  const { token } = useAuth();
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) return toast.error("Passwords do not match");
    if (pwForm.next.length < 8) return toast.error("Min 8 characters required");
    setLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Password updated. Please sign in again.");
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Security Settings</h1>
        <p className="text-sm text-[#62626f] mt-1">Manage password and session security</p>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f] mb-5">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input type="password" className="input" placeholder="••••••••"
              value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} required />
          </div>
          <div>
            <label className="label">New Password</label>
            <input type="password" className="input" placeholder="Min 8 chars, uppercase + number"
              value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" className="input" placeholder="Repeat new password"
              value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f] mb-5">Active Sessions</h2>
        <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-400/5 border border-emerald-400/10">
          <div>
            <p className="text-sm font-semibold">Current Session</p>
            <p className="text-xs text-[#62626f]">This device · Active now</p>
          </div>
          <span className="text-xs text-emerald-400 font-mono">ACTIVE</span>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f] mb-3">API Access</h2>
        <p className="text-sm text-[#a0a0ab] mb-4">Generate an API key to integrate with external tools (Premium feature).</p>
        <button className="btn btn-secondary btn-sm">Generate API Key</button>
      </div>
    </div>
  );
}
