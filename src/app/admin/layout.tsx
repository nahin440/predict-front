"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

const ADMIN_NAV = [
  { href:"/admin", label:"Dashboard", icon:"⬡" },
  { href:"/admin/users", label:"Users", icon:"👥" },
  { href:"/admin/predictions", label:"Predictions", icon:"📊" },
  { href:"/admin/blog", label:"Blog", icon:"✍️" },
  { href:"/admin/analytics", label:"Analytics", icon:"📈" },
  { href:"/admin/settings", label:"Settings", icon:"⚙️" },
];

const ADMIN_ROLES = ["ADMIN","DEVELOPER","SEO_MANAGER","MODERATOR"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return (
    <div style={{ minHeight:"100dvh",background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ width:40,height:40,borderRadius:"50%",border:"2px solid rgba(167,139,250,0.2)",borderTopColor:"#a78bfa",animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if (!user) { if (typeof window !== "undefined") window.location.href="/auth/login"; return null; }
  if (!ADMIN_ROLES.includes(user.role)) { if (typeof window !== "undefined") window.location.href="/dashboard"; return null; }

  const Sidebar = () => (
    <aside style={{ width:220,background:"var(--carbon)",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",height:"100%" }}>
      <div style={{ padding:"18px 16px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" style={{ display:"flex",alignItems:"center",gap:9,textDecoration:"none",marginBottom:10 }}>
          <div style={{ width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#f5a623,#d97706)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <span style={{ fontFamily:"JetBrains Mono",fontWeight:700,fontSize:11,color:"#0a0800" }}>Au</span>
          </div>
          <span style={{ fontFamily:"Syne",fontWeight:800,fontSize:14,color:"var(--paper)" }}>Gold<span style={{ color:"var(--gold)" }}>Predict</span></span>
        </Link>
        <div style={{ display:"flex",alignItems:"center",gap:5 }}>
          <div style={{ width:5,height:5,borderRadius:"50%",background:"#a78bfa" }} />
          <span style={{ fontFamily:"JetBrains Mono",fontSize:9,color:"#a78bfa",letterSpacing:"0.1em",textTransform:"uppercase" }}>Admin Panel</span>
        </div>
      </div>
      <nav style={{ flex:1,padding:"10px 8px",display:"flex",flexDirection:"column",gap:2 }}>
        {ADMIN_NAV.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={()=>setOpen(false)} style={{
              display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:12,
              textDecoration:"none",fontFamily:"Space Grotesk",fontSize:13,fontWeight:500,
              color:active?"#a78bfa":"var(--fog)",background:active?"rgba(167,139,250,0.1)":"transparent",
              transition:"all 0.15s ease",
            }}
            onMouseEnter={e=>{ if(!active){e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.color="var(--paper)";} }}
            onMouseLeave={e=>{ if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--fog)";} }}>
              <span style={{ fontSize:13,width:18,textAlign:"center" }}>{item.icon}</span>{item.label}
            </Link>
          );
        })}
        <div style={{ height:1,background:"rgba(255,255,255,0.05)",margin:"8px 4px" }} />
        <Link href="/dashboard" onClick={()=>setOpen(false)} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:12,textDecoration:"none",fontFamily:"Space Grotesk",fontSize:13,fontWeight:500,color:"var(--slate)",transition:"all 0.15s ease" }}
        onMouseEnter={e=>{e.currentTarget.style.color="var(--paper)";e.currentTarget.style.background="rgba(255,255,255,0.04)";}}
        onMouseLeave={e=>{e.currentTarget.style.color="var(--slate)";e.currentTarget.style.background="transparent";}}>
          <span style={{ fontSize:13,width:18,textAlign:"center" }}>←</span>User Dashboard
        </Link>
      </nav>
      {user && (
        <div style={{ padding:"10px 8px 14px",borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:9,padding:"8px 12px",marginBottom:4 }}>
            <div style={{ width:28,height:28,borderRadius:"50%",background:"rgba(167,139,250,0.15)",border:"1px solid rgba(167,139,250,0.3)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0 }}>
              {user.avatar ? <img src={user.avatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
              : <span style={{ fontFamily:"Syne",fontWeight:700,fontSize:11,color:"#a78bfa" }}>{user.name?.[0]?.toUpperCase()}</span>}
            </div>
            <div style={{ minWidth:0 }}>
              <p style={{ fontFamily:"Syne",fontSize:12,fontWeight:600,color:"var(--paper)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user.name}</p>
              <p style={{ fontFamily:"JetBrains Mono",fontSize:9,color:"#a78bfa",letterSpacing:"0.06em" }}>{user.role}</p>
            </div>
          </div>
          <button onClick={logout} style={{ width:"100%",padding:"7px 12px",borderRadius:10,background:"none",border:"1px solid rgba(255,255,255,0.07)",cursor:"pointer",fontFamily:"Space Grotesk",fontSize:12,color:"var(--slate)",transition:"all 0.15s ease" }}
          onMouseEnter={e=>{e.currentTarget.style.color="var(--paper)";}}
          onMouseLeave={e=>{e.currentTarget.style.color="var(--slate)";}}>Sign Out</button>
        </div>
      )}
    </aside>
  );

  return (
    <div style={{ minHeight:"100dvh",background:"var(--ink)",display:"flex" }}>
      <div className="hide-mobile" style={{ position:"sticky",top:0,height:"100dvh",flexShrink:0 }}><Sidebar /></div>

      {open && (
        <>
          <div onClick={()=>setOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(4px)",zIndex:40 }} />
          <div style={{ position:"fixed",left:0,top:0,bottom:0,width:240,zIndex:50,animation:"slideRight 0.25s cubic-bezier(0.22,1,0.36,1)" }}>
            <Sidebar />
          </div>
          <style>{`@keyframes slideRight{from{transform:translateX(-100%);}to{transform:translateX(0);}}`}</style>
        </>
      )}

      <div style={{ flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden" }}>
        <header style={{ height:52,borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",padding:"0 18px",gap:10,background:"rgba(8,8,9,0.85)",backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:20,flexShrink:0 }}>
          <button className="hide-desktop" onClick={()=>setOpen(true)} style={{ background:"none",border:"none",cursor:"pointer",padding:6,borderRadius:8,color:"var(--paper)",display:"flex" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="17" x2="21" y2="17"/>
            </svg>
          </button>
          <span style={{ fontFamily:"JetBrains Mono",fontSize:10,color:"#a78bfa",letterSpacing:"0.1em",textTransform:"uppercase" }}>⚙ Admin Panel</span>
          <div style={{ flex:1 }} />
          <div style={{ display:"flex",alignItems:"center",gap:6 }}>
            <div className="live-dot" style={{ width:5,height:5 }} />
            <span style={{ fontFamily:"JetBrains Mono",fontSize:9,color:"var(--up)",letterSpacing:"0.06em" }}>LIVE</span>
          </div>
        </header>
        <main style={{ flex:1,padding:"clamp(16px,2vw,24px)",overflow:"auto" }}>{children}</main>
      </div>
    </div>
  );
}
