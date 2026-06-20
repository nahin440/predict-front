"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

const NAV = [
  { href: "/predictions", label: "Live Signals" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const onScroll = useCallback(() => setScrolled(window.scrollY > 24), []);
  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      {/* ── Floating pill nav (LaunchDarkly signature) ── */}
      <header style={{
        position: "fixed", top: 20, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "center", padding: "0 16px",
        transition: "top 0.3s ease",
      }}>
        <nav className="nav-pill" style={{
          width: "100%", maxWidth: 1040,
          display: "flex", alignItems: "center",
          padding: "6px 6px 6px 24px",
          gap: 0,
        }}>
          {/* Logo */}
          <Link href="/" style={{ display:"flex", alignItems:"center", gap:9, textDecoration:"none", marginRight:32, flexShrink:0 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:"linear-gradient(135deg,#f5a623,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 16px rgba(245,166,35,0.45)" }}>
              <span style={{ fontFamily:"var(--font-jetbrains-mono)",fontWeight:700,fontSize:12,color:"#0a0800" }}>Au</span>
            </div>
            <span style={{ fontFamily:"var(--font-syne)",fontWeight:800,fontSize:16,color:"var(--paper)",letterSpacing:"-0.03em" }}>
              Gold<span style={{ color:"var(--gold)" }}>Predict</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hide-mobile" style={{ display:"flex", alignItems:"center", flex:1, gap:2 }}>
            {NAV.map(n => (
              <Link key={n.href} href={n.href} style={{
                padding:"7px 14px", borderRadius:20, fontSize:13, fontWeight:500,
                color: pathname===n.href ? "var(--gold-bright)" : "var(--ash)",
                background: pathname===n.href ? "rgba(245,166,35,0.1)" : "transparent",
                textDecoration:"none", transition:"all 0.15s ease",
              }}
              onMouseEnter={e=>{ if(pathname!==n.href){e.currentTarget.style.color="var(--paper)";e.currentTarget.style.background="rgba(255,255,255,0.05)";} }}
              onMouseLeave={e=>{ if(pathname!==n.href){e.currentTarget.style.color="var(--ash)";e.currentTarget.style.background="transparent";} }}
              >{n.label}</Link>
            ))}
          </div>

          {/* Auth actions */}
          <div className="hide-mobile" style={{ display:"flex", alignItems:"center", gap:8, marginLeft:"auto" }}>
            {loading ? (
              <div className="skeleton" style={{ width:80, height:34 }} />
            ) : user ? (
              <>
                {["ADMIN","DEVELOPER","SEO_MANAGER","MODERATOR"].includes(user.role) && (
                  <Link href="/admin" className="badge badge-purple" style={{ textDecoration:"none", cursor:"pointer" }}>⚙ Admin</Link>
                )}
                <Link href="/dashboard" style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 14px 6px 8px", borderRadius:99, border:"1px solid rgba(255,255,255,0.09)", background:"rgba(255,255,255,0.04)", textDecoration:"none", transition:"all 0.15s ease" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(245,166,35,0.35)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.09)";}}>
                  <div style={{ width:26,height:26,borderRadius:"50%",background:"linear-gradient(135deg,rgba(245,166,35,0.3),rgba(245,166,35,0.1))",border:"1px solid rgba(245,166,35,0.4)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0 }}>
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                      : <span style={{ fontFamily:"var(--font-syne)",fontWeight:700,fontSize:11,color:"var(--gold)" }}>{user.name?.[0]?.toUpperCase()}</span>}
                  </div>
                  <span style={{ fontFamily:"var(--font-space-grotesk)",fontSize:13,fontWeight:500,color:"var(--paper)",maxWidth:90,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user.name}</span>
                </Link>
                <button onClick={logout} className="btn-ghost" style={{ background:"none",border:"none",cursor:"pointer",padding:"7px 14px",borderRadius:20,fontSize:13,color:"var(--slate)",fontFamily:"var(--font-space-grotesk)",fontWeight:500,transition:"all 0.15s ease" }}
                onMouseEnter={e=>{e.currentTarget.style.color="var(--paper)";e.currentTarget.style.background="rgba(255,255,255,0.05)";}}
                onMouseLeave={e=>{e.currentTarget.style.color="var(--slate)";e.currentTarget.style.background="transparent";}}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" style={{ padding:"7px 16px",borderRadius:20,fontSize:13,fontWeight:500,color:"var(--ash)",textDecoration:"none",transition:"color 0.15s ease" }}
                onMouseEnter={e=>{e.currentTarget.style.color="var(--paper)";}}
                onMouseLeave={e=>{e.currentTarget.style.color="var(--ash)";}}>Sign In</Link>
                <Link href="/auth/register" className="btn btn-primary btn-sm" style={{ textDecoration:"none" }}>Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="hide-desktop" onClick={()=>setMenuOpen(o=>!o)} aria-label="Menu"
            style={{ marginLeft:"auto",background:"none",border:"none",cursor:"pointer",padding:10,borderRadius:10,color:"var(--paper)",transition:"background 0.15s ease" }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="17" x2="21" y2="17"/></>}
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile menu — full-screen overlay */}
      {menuOpen && (
        <div style={{
          position:"fixed",inset:0,zIndex:99,
          background:"rgba(8,8,9,0.97)",backdropFilter:"blur(24px)",
          display:"flex",flexDirection:"column",
          paddingTop:90,padding:"90px 24px 40px",
          animation:"fade-in 0.2s ease",
        }}>
          <nav style={{ display:"flex",flexDirection:"column",gap:4,flex:1 }}>
            {NAV.map(n=>(
              <Link key={n.href} href={n.href} style={{
                padding:"16px 20px",borderRadius:14,fontSize:20,fontWeight:600,
                fontFamily:"var(--font-syne)",color:pathname===n.href?"var(--gold-bright)":"var(--paper)",
                background:pathname===n.href?"rgba(245,166,35,0.08)":"transparent",
                textDecoration:"none",borderBottom:"1px solid rgba(255,255,255,0.04)",
                letterSpacing:"-0.02em",
              }}>{n.label}</Link>
            ))}
            {user && ["ADMIN","DEVELOPER","SEO_MANAGER","MODERATOR"].includes(user.role) && (
              <Link href="/admin" style={{ padding:"16px 20px",borderRadius:14,fontSize:20,fontWeight:600,fontFamily:"var(--font-syne)",color:"#a78bfa",textDecoration:"none",letterSpacing:"-0.02em" }}>Admin Panel</Link>
            )}
          </nav>
          <div style={{ display:"flex",gap:12,marginTop:32 }}>
            {user ? (
              <>
                <Link href="/dashboard" className="btn btn-secondary" style={{ flex:1,justifyContent:"center",textDecoration:"none",borderRadius:14 }}>Dashboard</Link>
                <button onClick={()=>{logout();setMenuOpen(false);}} className="btn btn-ghost" style={{ flex:1,borderRadius:14,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)" }}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-secondary" style={{ flex:1,justifyContent:"center",textDecoration:"none",borderRadius:14 }}>Sign In</Link>
                <Link href="/auth/register" className="btn btn-primary" style={{ flex:1,justifyContent:"center",textDecoration:"none",borderRadius:14 }}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
