"use client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useEffect, useState } from "react";
import { IPrediction } from "@/types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function PredictionsHistoryPage() {
  const { token } = useAuth();
  const [predictions, setPredictions] = useState<IPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      try {
        const res = await fetch(`/api/predictions/history?page=${page}&limit=20`, { headers });
        const data = await res.json();
        if (data.success) {
          setPredictions(data.data);
          setPagination(data.pagination);
          setIsPremium(data.isPremium);
        }
      } catch { /* silent */ } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Prediction History</h1>
          <p className="text-sm text-[#62626f] mt-1">{pagination.total} total predictions</p>
        </div>
        {!isPremium && (
          <Link href="/pricing" className="btn btn-primary btn-sm">Unlock Full History</Link>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => <div key={i} className="card p-4 shimmer h-16" />)}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="table-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Time", "Price", "Signal", "Regime", "Confidence", "Skip?"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-mono text-[#62626f] uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {predictions.map((p) => {
                  const isUp = p.direction === "UP";
                  const skip = p.should_skip;
                  return (
                    <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-[#a0a0ab] whitespace-nowrap">
                        {formatDate(p.timestamp || p.server_time || p.saved_at)}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap">
                        ${p.current_price?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={skip ? "signal-badge-skip" : isUp ? "signal-badge-up" : "signal-badge-down"}>
                          {skip ? "SKIP" : isUp ? "▲ LONG" : "▼ SHORT"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-amber-400/80 whitespace-nowrap">
                        {(p.regime as Record<string, unknown>)?.regime as string || "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {isPremium && p.confidence ? (
                          <span className={p.confidence >= 60 ? "text-emerald-400" : "text-amber-400"}>
                            {p.confidence.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-[#62626f] blur-sm select-none">00.0%</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {skip ? (
                          <span className="text-xs text-red-400/80">Yes</span>
                        ) : (
                          <span className="text-xs text-emerald-400/80">No</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-white/[0.06]">
              <p className="text-xs text-[#62626f]">Page {page} of {pagination.pages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="btn btn-secondary btn-sm">Prev</button>
                <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                  className="btn btn-secondary btn-sm">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
