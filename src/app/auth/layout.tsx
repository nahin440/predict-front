// Pure server component — no Firebase, no client imports
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg-0)", display: "flex", flexDirection: "column" }} className="bg-grid">
      {/* Header */}
      <header style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#fbbf24,#d97706)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "DM Mono", fontWeight: 700, fontSize: 12, color: "#0a0800" }}>Au</span>
          </div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 17, color: "var(--tx-0)", letterSpacing: "-0.03em" }}>
            Gold<span style={{ color: "#f59e0b" }}>Predict</span>
          </span>
        </Link>
        <Link href="/" style={{ fontFamily: "DM Sans", fontSize: 13, color: "var(--tx-2)", textDecoration: "none" }}>
          ← Home
        </Link>
      </header>

      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(60px)" }} />

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px", position: "relative" }}>
        {children}
      </main>
    </div>
  );
}
