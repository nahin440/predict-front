"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface Stats {
  totalPredictions: number;
  totalTrades: number;
  skippedTrades: number;
  bullSignals: number;
  bearSignals: number;
  winRate: number;
  avgConfidence: number;
}

const COLORS = ["#f59e0b", "#10b981", "#ef4444", "#6b7280"];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/predictions/stats")
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const pieData = stats ? [
    { name: "Bull Signals", value: stats.bullSignals },
    { name: "Bear Signals", value: stats.bearSignals },
    { name: "Skipped", value: stats.skippedTrades }
  ] : [];

  const barData = stats ? [
    { name: "Total", value: stats.totalPredictions },
    { name: "Active", value: stats.totalTrades },
    { name: "Skipped", value: stats.skippedTrades },
    { name: "Bull", value: stats.bullSignals },
    { name: "Bear", value: stats.bearSignals }
  ] : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Analytics</h1>
        <p className="text-sm text-[#62626f] mt-1">Platform performance metrics</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="card p-5 shimmer h-24" />)}
        </div>
      ) : stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
            {[
              { label: "Total Predictions", value: stats.totalPredictions, color: "text-white" },
              { label: "Active Signals", value: stats.totalTrades, color: "text-amber-400" },
              { label: "Win Rate", value: `${stats.winRate}%`, color: "text-emerald-400" },
              { label: "Avg Confidence", value: `${stats.avgConfidence}%`, color: "text-blue-400" }
            ].map((s, i) => (
              <div key={i} className="card p-5 animate-slide-up">
                <p className="text-xs text-[#62626f] uppercase tracking-wider mb-2">{s.label}</p>
                <p className={`text-3xl font-black font-mono ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="card p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f] mb-5">Signal Distribution</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" tick={{ fill: "#62626f", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#62626f", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#141418", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#f6f6f7" }} />
                  <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="card p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f] mb-5">Signal Breakdown</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#141418", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary */}
          <div className="card p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f] mb-5">Performance Summary</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-[#62626f] mb-1">Skip Rate</p>
                <p className="text-2xl font-black font-mono text-orange-400">
                  {stats.totalPredictions > 0 ? Math.round((stats.skippedTrades / stats.totalPredictions) * 100) : 0}%
                </p>
              </div>
              <div>
                <p className="text-xs text-[#62626f] mb-1">Bull vs Bear Ratio</p>
                <p className="text-2xl font-black font-mono text-white">
                  {stats.bearSignals > 0 ? (stats.bullSignals / stats.bearSignals).toFixed(2) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#62626f] mb-1">Active Trade Rate</p>
                <p className="text-2xl font-black font-mono text-emerald-400">
                  {stats.totalPredictions > 0 ? Math.round((stats.totalTrades / stats.totalPredictions) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
