"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

const NAV = [
  { href:"/dashboard", label:"Overview", icon:"⬡" },
  { href:"/dashboard/predictions", label:"Predictions", icon:"📊" },
  { href:"/dashboard/account", label:"Account", icon:"👤" },
  { href:"/dashboard/billing", label:"Billing", icon:"💳" },
  { href:"/dashboard/notifications", label:"Notifications", icon:"🔔" },
  { href:"/dashboard/security", label:"Security", icon:"🔐" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return (
    <div style={{ minHeight:"100dvh",background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ width:40,height:40,borderRadius:"50%",border:"2px solid rgba(245,166,35,0.2)",borderTopColor:"var(--gold)",animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if (!user && typeof window !== "undefined") {
    window.location.href = "/auth/login?redirect=" + encodeURIComponent(pathname);
    return null;
  }

  const Sidebar = () => (
    <aside style={{ width:240,background:"var(--carbon)",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",height:"100%",flexShrink:0 }}>
      {/* Logo */}
      <div style={{ padding:"20px 20px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" style={{ display:"flex",alignItems:"center",gap:9,textDecoration:"none" }}>
          <div style={{ width:30,height:30,borderRadius:9,background:"linear-gradient(135deg,#f5a623,#d97706)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <span style={{ fontFamily:"JetBrains Mono",fontWeight:700,fontSize:12,color:"#0a0800" }}>Au</span>
          </div>
          <span style={{ fontFamily:"Syne",fontWeight:800,fontSize:15,color:"var(--paper)",letterSpacing:"-0.02em" }}>
            Gold<span style={{ color:"var(--gold)" }}>Predict</span>
          </span>
        </Link>
      </div>
      {/* Nav */}
      <nav style={{ flex:1,padding:"12px 10px",display:"flex",flexDirection:"column",gap:2 }}>
        {NAV.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={()=>setSidebarOpen(false)} style={{
              display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:12,
              textDecoration:"none",fontFamily:"Space Grotesk",fontSize:13,fontWeight:500,
              color:active?"var(--gold-bright)":"var(--fog)",
              background:active?"rgba(245,166,35,0.1)":"transparent",
              transition:"all 0.15s ease",
            }}
            onMouseEnter={e=>{ if(!active){e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.color="var(--paper)";} }}
            onMouseLeave={e=>{ if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--fog)";} }}>
              <span style={{ fontSize:14,width:18,textAlign:"center" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        {user && ["ADMIN","DEVELOPER","MODERATOR","SEO_MANAGER"].includes(user.role) && (
          <Link href="/admin" onClick={()=>setSidebarOpen(false)} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:12,textDecoration:"none",fontFamily:"Space Grotesk",fontSize:13,fontWeight:500,color:"#a78bfa",background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.15)",marginTop:8,transition:"all 0.15s ease" }}>
            <span style={{ fontSize:14,width:18,textAlign:"center" }}>⚙️</span>Admin Panel
          </Link>
        )}
      </nav>
      {/* User */}
      {user && (
        <div style={{ padding:"12px 10px 16px",borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:12,marginBottom:4 }}>
            <div style={{ width:30,height:30,borderRadius:"50%",background:"rgba(245,166,35,0.15)",border:"1px solid rgba(245,166,35,0.3)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0 }}>
              {user.avatar ? <img src={user.avatar} alt={user.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
              : <span style={{ fontFamily:"Syne",fontWeight:700,fontSize:12,color:"var(--gold)" }}>{user.name?.[0]?.toUpperCase()}</span>}
            </div>
            <div style={{ minWidth:0 }}>
              <p style={{ fontFamily:"Syne",fontSize:13,fontWeight:600,color:"var(--paper)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user.name}</p>
              <p style={{ fontFamily:"JetBrains Mono",fontSize:9,color:"var(--slate)",textTransform:"uppercase",letterSpacing:"0.06em",marginTop:1 }}>{user.subscription?.plan||"free"}</p>
            </div>
          </div>
          <button onClick={logout} style={{ width:"100%",padding:"8px 12px",borderRadius:10,background:"none",border:"1px solid rgba(255,255,255,0.07)",cursor:"pointer",fontFamily:"Space Grotesk",fontSize:12,color:"var(--slate)",transition:"all 0.15s ease" }}
          onMouseEnter={e=>{e.currentTarget.style.color="var(--paper)";e.currentTarget.style.borderColor="rgba(255,255,255,0.15)";}}
          onMouseLeave={e=>{e.currentTarget.style.color="var(--slate)";e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";}}>
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );

  return (
    <div style={{ minHeight:"100dvh",background:"var(--ink)",display:"flex" }}>
      {/* Desktop sidebar */}
      <div className="hide-mobile" style={{ position:"sticky",top:0,height:"100dvh",flexShrink:0 }}>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div onClick={()=>setSidebarOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(4px)",zIndex:40 }} />
          <div style={{ position:"fixed",left:0,top:0,bottom:0,width:260,zIndex:50,animation:"slideRight 0.25s cubic-bezier(0.22,1,0.36,1)" }}>
            <Sidebar />
          </div>
          <style>{`@keyframes slideRight{from{transform:translateX(-100%);}to{transform:translateX(0);}}`}</style>
        </>
      )}

      {/* Main */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden" }}>
        {/* Topbar */}
        <header style={{ height:56,borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",padding:"0 20px",gap:12,background:"rgba(8,8,9,0.8)",backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:20,flexShrink:0 }}>
          <button className="hide-desktop" onClick={()=>setSidebarOpen(true)} style={{ background:"none",border:"none",cursor:"pointer",padding:6,borderRadius:8,color:"var(--paper)",display:"flex" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="17" x2="21" y2="17"/>
            </svg>
          </button>
          <div className="hide-desktop" style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ width:24,height:24,borderRadius:7,background:"linear-gradient(135deg,#f5a623,#d97706)",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <span style={{ fontFamily:"JetBrains Mono",fontWeight:700,fontSize:10,color:"#0a0800" }}>Au</span>
            </div>
            <span style={{ fontFamily:"Syne",fontWeight:800,fontSize:14,color:"var(--paper)" }}>GoldPredict</span>
          </div>
          <div style={{ flex:1 }} />
          <div style={{ display:"flex",alignItems:"center",gap:6 }}>
            <div className="live-dot" style={{ width:6,height:6 }} />
            <span style={{ fontFamily:"JetBrains Mono",fontSize:10,color:"var(--up)",letterSpacing:"0.06em" }}>LIVE</span>
          </div>
        </header>
        <main style={{ flex:1,padding:"clamp(16px,2vw,28px)",overflow:"auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
