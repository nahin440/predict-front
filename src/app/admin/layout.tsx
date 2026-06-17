"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/AuthContext";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: "⬡" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/predictions", label: "Predictions", icon: "📊" },
  { href: "/admin/blog", label: "Blog", icon: "✍️" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" }
];

const ADMIN_ROLES = ["ADMIN", "DEVELOPER", "SEO_MANAGER", "MODERATOR"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0d] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-purple-400/20 border-t-purple-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/auth/login";
    return null;
  }

  if (!ADMIN_ROLES.includes(user.role)) {
    if (typeof window !== "undefined") window.location.href = "/dashboard";
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0d] flex">
      <aside className="hidden lg:flex w-60 flex-col fixed inset-y-0 left-0 z-30 bg-[#0f0f14] border-r border-white/[0.06]">
        <div className="p-5 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-black font-black text-xs font-mono">Au</span>
            </div>
            <span className="font-bold text-sm">Gold<span className="text-amber-400">Predict</span></span>
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-xs font-mono text-purple-400">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {ADMIN_NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                pathname === item.href ? "bg-purple-400/10 text-purple-400" : "text-[#a0a0ab] hover:text-white hover:bg-white/[0.04]"
              )}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/[0.06] mt-3">
            <Link href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#a0a0ab] hover:text-white hover:bg-white/[0.04] transition-all">
              <span className="w-5 text-center">←</span> User Dashboard
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-full bg-purple-400/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                : <span className="text-purple-400 font-bold text-xs">{user.name?.[0]?.toUpperCase()}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{user.name}</p>
              <p className="text-xs text-purple-400 font-mono">{user.role}</p>
            </div>
          </div>
          <button onClick={logout} className="btn btn-ghost btn-sm w-full justify-center text-[#62626f] text-xs">Sign Out</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-60 min-w-0">
        <header className="h-14 border-b border-white/[0.06] flex items-center gap-4 px-6 bg-[#0a0a0d] sticky top-0 z-20">
          <span className="text-xs font-mono text-purple-400">⚙ ADMIN</span>
          <div className="flex-1" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400 hidden sm:block">Live</span>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
