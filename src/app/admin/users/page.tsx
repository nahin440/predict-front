"use client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useEffect, useState } from "react";
import { IUser } from "@/types";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

const ROLES = ["USER", "PREMIUM_USER", "MODERATOR", "SEO_MANAGER", "DEVELOPER", "ADMIN"];

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [editing, setEditing] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");

  async function fetchUsers() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);
    try {
      const res = await fetch(`/api/admin/users?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) { setUsers(data.data); setPagination(data.pagination); }
    } catch { /* silent */ } finally { setLoading(false); }
  }

  useEffect(() => { fetchUsers(); }, [page, roleFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function updateUser(userId: string, updates: Record<string, unknown>) {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, ...updates })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("User updated");
      setEditing(null);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  const roleColor: Record<string, string> = {
    ADMIN: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    DEVELOPER: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    SEO_MANAGER: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    MODERATOR: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    PREMIUM_USER: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    USER: "text-[#a0a0ab] bg-white/[0.04] border-white/[0.08]"
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">User Management</h1>
          <p className="text-sm text-[#62626f] mt-1">{pagination.total} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text" placeholder="Search by name or email…" className="input max-w-xs"
          value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && fetchUsers()}
        />
        <select className="input max-w-xs" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button onClick={fetchUsers} className="btn btn-secondary">Search</button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="table-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["User", "Role", "Plan", "Verified", "Created", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-mono text-[#62626f] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-8 shimmer rounded" /></td></tr>
                ))
              ) : users.map(u => (
                <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-400 font-bold text-xs">{u.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-xs">{u.name}</p>
                        <p className="text-xs text-[#62626f]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {editing === u._id ? (
                      <select className="input text-xs py-1 px-2" value={editRole} onChange={e => setEditRole(e.target.value)}>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    ) : (
                      <span className={`text-xs px-2 py-0.5 rounded border font-mono ${roleColor[u.role] || ""}`}>{u.role}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-amber-400/80 capitalize">{u.subscription?.plan || "free"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-mono ${u.isVerified ? "text-emerald-400" : "text-red-400"}`}>
                      {u.isVerified ? "✓" : "✗"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-[#62626f] whitespace-nowrap">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {editing === u._id ? (
                      <div className="flex gap-1.5">
                        <button onClick={() => updateUser(u._id, { role: editRole })} className="btn btn-primary btn-sm text-xs py-1 px-2">Save</button>
                        <button onClick={() => setEditing(null)} className="btn btn-ghost btn-sm text-xs py-1 px-2">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex gap-1.5">
                        <button onClick={() => { setEditing(u._id); setEditRole(u.role); }}
                          className="btn btn-secondary btn-sm text-xs py-1 px-2">Edit</button>
                        <button onClick={() => updateUser(u._id, { isActive: !u.isActive })}
                          className={`btn btn-sm text-xs py-1 px-2 ${u.isActive ? "text-red-400" : "text-emerald-400"}`}
                          style={{ background: "transparent", border: `1px solid ${u.isActive ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}` }}>
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
            <p className="text-xs text-[#62626f]">Page {page} of {pagination.pages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-secondary btn-sm">Prev</button>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn btn-secondary btn-sm">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
