"use client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Post { _id: string; title: string; slug: string; status: string; views: number; publishedAt?: string; category: string; }

export default function AdminBlogPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", category: "XAUUSD Analysis", tags: "" });

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/admin/blog", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setPosts((await res.json()).data || []);
      } catch { /* silent */ } finally { setLoading(false); }
    }
    fetchPosts();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, tags: form.tags.split(",").map(t => t.trim()) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Blog post created");
      setCreating(false);
      setForm({ title: "", excerpt: "", content: "", category: "XAUUSD Analysis", tags: "" });
      setPosts(prev => [data.data, ...prev]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Blog Manager</h1>
          <p className="text-sm text-[#62626f] mt-1">{posts.length} posts</p>
        </div>
        <button onClick={() => setCreating(!creating)} className="btn btn-primary btn-sm">
          {creating ? "Cancel" : "+ New Post"}
        </button>
      </div>

      {creating && (
        <div className="card p-6 animate-slide-up">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f] mb-5">Create New Post</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input type="text" className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Excerpt</label>
              <input type="text" className="input" value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Category</label>
                <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {["XAUUSD Analysis", "Trading Strategy", "Market News", "AI Trading", "Risk Management", "Tutorial"].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Tags (comma-separated)</label>
                <input type="text" className="input" placeholder="gold, xauusd, trading" value={form.tags}
                  onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="label">Content (Markdown)</label>
              <textarea className="input min-h-48 resize-y font-mono text-sm" value={form.content}
                onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required />
            </div>
            <button type="submit" className="btn btn-primary">Publish Post</button>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#62626f]">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#62626f] mb-4">No blog posts yet.</p>
            <button onClick={() => setCreating(true)} className="btn btn-primary btn-sm">Create First Post</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Title", "Category", "Status", "Views", "Published"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-mono text-[#62626f] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {posts.map(post => (
                <tr key={post._id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-semibold text-sm max-w-xs truncate">{post.title}</td>
                  <td className="px-4 py-3 text-xs text-amber-400/80">{post.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded border font-mono ${post.status === "published" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-[#a0a0ab] bg-white/[0.04] border-white/[0.08]"}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#a0a0ab]">{post.views}</td>
                  <td className="px-4 py-3 text-xs text-[#62626f] font-mono">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
