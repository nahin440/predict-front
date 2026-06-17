"use client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useEffect, useState } from "react";
import { formatRelativeTime } from "@/lib/utils";

interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  totalPredictions: number;
  todayPredictions: number;
  skipRate: number;
  winRate: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [latestPrediction, setLatestPrediction] = useState<Record<string, unknown> | null>(null);
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_data() {
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [usersRes, predsRes, statsRes] = await Promise.all([
          fetch("/api/admin/users?limit=1", { headers }),
          fetch("/api/predictions/current", { headers }),
          fetch("/api/predictions/stats")
        ]);
        if (usersRes.ok) {
          const ud = await usersRes.json();
          setStats(prev => ({ ...(prev || {} as AdminStats), totalUsers: ud.pagination?.total || 0, premiumUsers: 0, totalPredictions: 0, todayPredictions: 0, skipRate: 0, winRate: 0 }));
        }
        if (predsRes.ok) {
          const pd = await predsRes.json();
          setLatestPrediction(pd.data);
        }
        if (statsRes.ok) {
          const sd = await statsRes.json();
          setStats(prev => ({
            ...(prev || {} as AdminStats),
            totalPredictions: sd.data.totalPredictions,
            skipRate: sd.data.totalPredictions > 0
              ? Math.round((sd.data.skippedTrades / sd.data.totalPredictions) * 100)
              : 0,
            winRate: sd.data.winRate
          }));
        }
      } catch { /* silent */ } finally {
        setLoading(false);
      }
    }
    fetch_data();
  }, []);

  const cards = [
    { label: "Total Users", value: stats?.totalUsers ?? "—", color: "text-white", icon: "👥" },
    { label: "Total Predictions", value: stats?.totalPredictions ?? "—", color: "text-amber-400", icon: "📊" },
    { label: "Skip Rate", value: stats?.skipRate !== undefined ? `${stats.skipRate}%` : "—", color: "text-orange-400", icon: "⏸" },
    { label: "Win Rate", value: stats?.winRate !== undefined ? `${stats.winRate}%` : "—", color: "text-emerald-400", icon: "🎯" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-[#62626f] mt-1">Platform overview and controls</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {cards.map((c, i) => (
          <div key={i} className="card p-5 animate-slide-up">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-[#62626f] uppercase tracking-wider">{c.label}</p>
              <span className="text-lg">{c.icon}</span>
            </div>
            <p className={`text-3xl font-black font-mono ${loading ? "shimmer rounded w-16 h-8" : c.color}`}>
              {loading ? "" : c.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Latest prediction */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f]">Latest Signal</h2>
            {latestPrediction && (
              <span className="text-xs font-mono text-[#62626f]">
                {formatRelativeTime(latestPrediction.timestamp as string || latestPrediction.server_time as string)}
              </span>
            )}
          </div>
          {latestPrediction ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#62626f] font-mono">PRICE</span>
                <span className="font-mono font-bold">${(latestPrediction.current_price as number)?.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#62626f] font-mono">DIRECTION</span>
                <span className={latestPrediction.should_skip ? "signal-badge-skip" : latestPrediction.direction === "UP" ? "signal-badge-up" : "signal-badge-down"}>
                  {latestPrediction.should_skip ? "SKIP" : latestPrediction.direction === "UP" ? "▲ LONG" : "▼ SHORT"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#62626f] font-mono">CONFIDENCE</span>
                <span className="text-amber-400 font-mono text-sm font-bold">{(latestPrediction.confidence as number)?.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#62626f] font-mono">REGIME</span>
                <span className="text-sm text-amber-400">{(latestPrediction.regime as Record<string, unknown>)?.regime as string}</span>
              </div>
              {Boolean(latestPrediction.should_skip) && (
                <div className="p-3 rounded-lg bg-orange-400/5 border border-orange-400/10">
                  <p className="text-xs text-orange-400">{latestPrediction.skip_reason as string}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-8 shimmer rounded-lg" />)}</div>
          )}
        </div>

        {/* Quick actions */}
        <div className="card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f] mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: "Manage Users", href: "/admin/users", icon: "👥", desc: "View, promote, and manage all users" },
              { label: "Prediction History", href: "/admin/predictions", icon: "📊", desc: "Browse and manage all predictions" },
              { label: "Blog Manager", href: "/admin/blog", icon: "✍️", desc: "Create and publish blog posts" },
              { label: "Site Settings", href: "/admin/settings", icon: "⚙️", desc: "Configure platform settings" }
            ].map(a => (
              <a key={a.href} href={a.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group">
                <span className="text-xl w-8 text-center">{a.icon}</span>
                <div>
                  <p className="text-sm font-semibold group-hover:text-amber-400 transition-colors">{a.label}</p>
                  <p className="text-xs text-[#62626f]">{a.desc}</p>
                </div>
                <span className="ml-auto text-[#62626f] group-hover:text-amber-400 transition-colors">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* API info for bot */}
      <div className="card p-6 border-amber-400/10">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f] mb-4">Python Bot Integration</h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-xs">
            <p className="text-[#62626f] mb-2"># POST predictions from your Python bot:</p>
            <p className="text-emerald-400">POST /api/v1/predictions</p>
            <p className="text-[#a0a0ab]">Headers: x-api-key: {"{BOT_API_KEY}"}</p>
            <p className="text-[#a0a0ab]">Body: {"{"} ...prediction_json {"}"}</p>
          </div>
          <p className="text-xs text-[#62626f]">
            Your API key is set in <code className="text-amber-400">.env.local</code> as <code className="text-amber-400">BOT_API_KEY</code>
          </p>
        </div>
      </div>
    </div>
  );
}
