"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AccountPage() {
  const { user, token, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "" });
  const [loading, setLoading] = useState(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name })
      });
      if (res.ok) {
        if (user && token) {
          login({ ...user, name: form.name }, token);
        }
        toast.success("Profile updated");
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Account Settings</h1>
        <p className="text-sm text-[#62626f] mt-1">Manage your profile and preferences</p>
      </div>

      {/* Avatar / Role */}
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-black text-amber-400">{user?.name?.[0]?.toUpperCase() || "?"}</span>
          )}
        </div>
        <div>
          <p className="font-bold text-lg">{user?.name}</p>
          <p className="text-sm text-[#62626f]">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 font-mono">
              {user?.role}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[#a0a0ab] font-mono capitalize">
              {user?.subscription?.plan || "free"}
            </span>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <div className="card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f] mb-5">Profile Information</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input type="text" className="input" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" className="input" value={user?.email || ""} disabled
              style={{ opacity: 0.5, cursor: "not-allowed" }} />
            <p className="text-xs text-[#62626f] mt-1">Email cannot be changed. Contact support if needed.</p>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="card p-6 border-red-500/20">
        <h2 className="text-sm font-bold uppercase tracking-wider text-red-400/70 mb-4">Danger Zone</h2>
        <p className="text-sm text-[#62626f] mb-4">
          Permanently delete your account. This action cannot be undone.
        </p>
        <button className="btn btn-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
