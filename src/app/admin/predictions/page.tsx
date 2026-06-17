"use client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useEffect, useState } from "react";
import { IPrediction } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminPredictionsPage() {
  const { token } = useAuth();
  const [predictions, setPredictions] = useState<IPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    async function fetchPredictions() {
      setLoading(true);
      try {
        const res = await fetch(`/api/predictions/history?page=${page}&limit=30`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) { setPredictions(data.data); setPagination(data.pagination); }
      } catch { /* silent */ } finally { setLoading(false); }
    }
    fetchPredictions();
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Predictions Manager</h1>
        <p className="text-sm text-[#62626f] mt-1">{pagination.total} total predictions in database</p>
      </div>

      <div className="card overflow-hidden">
        <div className="table-scroll">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Time", "Price", "Direction", "Confidence", "Eff. Conf", "Regime", "HTF Bear", "RSI", "ADX", "Skip", "Reason"].map(h => (
                  <th key={h} className="text-left px-3 py-3 font-mono text-[#62626f] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <tr key={i}><td colSpan={11} className="px-3 py-2"><div className="h-6 shimmer rounded" /></td></tr>
                ))
              ) : predictions.map(p => {
                const skip = p.should_skip;
                const isUp = p.direction === "UP";
                return (
                  <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-2 font-mono text-[#62626f] whitespace-nowrap">
                      {formatDate(p.timestamp || p.server_time || p.saved_at)}
                    </td>
                    <td className="px-3 py-2 font-mono font-semibold whitespace-nowrap">${p.current_price?.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <span className={skip ? "signal-badge-skip" : isUp ? "signal-badge-up" : "signal-badge-down"}>
                        {skip ? "SKIP" : isUp ? "▲ L" : "▼ S"}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono">
                      <span className={p.confidence >= 60 ? "text-emerald-400" : "text-amber-400"}>
                        {p.confidence?.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-blue-400">{p.effective_confidence?.toFixed(1)}%</td>
                    <td className="px-3 py-2 text-amber-400/80">
                      {(p.regime as Record<string, unknown>)?.regime as string || "—"}
                    </td>
                    <td className="px-3 py-2 font-mono text-center">{p.bear_htf_count}/4</td>
                    <td className="px-3 py-2 font-mono">
                      <span className={p.rsi < 30 ? "text-emerald-400" : p.rsi > 70 ? "text-red-400" : "text-[#a0a0ab]"}>
                        {p.rsi?.toFixed(0)}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-[#a0a0ab]">{p.adx?.toFixed(1)}</td>
                    <td className="px-3 py-2">
                      <span className={skip ? "text-red-400" : "text-emerald-400"}>{skip ? "YES" : "NO"}</span>
                    </td>
                    <td className="px-3 py-2 text-[#62626f] max-w-[200px] truncate">
                      {p.skip_reason || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
            <p className="text-xs text-[#62626f]">Page {page} of {pagination.pages} · {pagination.total} total</p>
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
