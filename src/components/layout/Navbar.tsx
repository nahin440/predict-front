"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

const NAV = [
  { href: "/predictions", label: "Live Signals" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 30);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: scrolled ? "rgba(5,5,7,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)"
        }}
      >
        <nav style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 64 }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginRight: 40 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #fbbf24, #d97706)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(245,158,11,0.4)",
              flexShrink: 0
            }}>
              <span style={{ fontFamily: "DM Mono", fontWeight: 700, fontSize: 13, color: "#0a0800" }}>Au</span>
            </div>
            <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18, color: "#f0f0f5", letterSpacing: "-0.03em" }}>
              Gold<span style={{ color: "#f59e0b" }}>Predict</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }} className="hidden md:flex">
            {NAV.map(item => (
              <Link key={item.href} href={item.href} style={{
                padding: "8px 16px",
                borderRadius: 10,
                fontSize: 14,
                fontFamily: "DM Sans",
                fontWeight: 500,
                color: pathname === item.href ? "#f59e0b" : "#b8b8c8",
                background: pathname === item.href ? "rgba(245,158,11,0.08)" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => { if (pathname !== item.href) { e.currentTarget.style.color = "#f0f0f5"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; } }}
              onMouseLeave={e => { if (pathname !== item.href) { e.currentTarget.style.color = "#b8b8c8"; e.currentTarget.style.background = "transparent"; } }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="hidden md:flex">
            {loading ? (
              <div style={{ width: 80, height: 32 }} className="skeleton" />
            ) : user ? (
              <>
                {["ADMIN","DEVELOPER","SEO_MANAGER","MODERATOR"].includes(user.role) && (
                  <Link href="/admin" className="btn btn-xs badge-purple" style={{ textDecoration: "none" }}>
                    ⚙ Admin
                  </Link>
                )}
                <Link href="/dashboard" style={{
                  display: "flex", alignItems: "center", gap: 8,
                  textDecoration: "none", padding: "6px 12px",
                  borderRadius: 10, background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; e.currentTarget.style.background = "rgba(245,158,11,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(245,158,11,0.3), rgba(245,158,11,0.1))",
                    border: "1px solid rgba(245,158,11,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", flexShrink: 0
                  }}>
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 12, color: "#f59e0b" }}>{user.name?.[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <span style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 500, color: "#f0f0f5", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.name}
                  </span>
                </Link>
                <button onClick={logout} className="btn btn-ghost btn-sm">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-ghost btn-sm" style={{ textDecoration: "none" }}>Sign In</Link>
                <Link href="/auth/register" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(p => !p)}
            className="md:hidden"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, marginLeft: "auto", color: "#f0f0f5" }}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></>
              }
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden" style={{
            background: "rgba(9,9,13,0.98)",
            backdropFilter: "blur(24px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "16px 24px 24px",
            animation: "fade-in 0.15s ease"
          }}>
            {NAV.map(item => (
              <Link key={item.href} href={item.href} style={{
                display: "block", padding: "12px 0",
                fontFamily: "DM Sans", fontSize: 16, fontWeight: 500,
                color: pathname === item.href ? "#f59e0b" : "#b8b8c8",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.04)"
              }}>
                {item.label}
              </Link>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              {user ? (
                <>
                  <Link href="/dashboard" className="btn btn-secondary" style={{ flex: 1, justifyContent: "center", textDecoration: "none" }}>Dashboard</Link>
                  <button onClick={logout} className="btn btn-ghost" style={{ flex: 1 }}>Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn btn-secondary" style={{ flex: 1, justifyContent: "center", textDecoration: "none" }}>Sign In</Link>
                  <Link href="/auth/register" className="btn btn-primary" style={{ flex: 1, justifyContent: "center", textDecoration: "none" }}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
