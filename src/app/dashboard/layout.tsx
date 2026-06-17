"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/AuthContext";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "⬡" },
  { href: "/dashboard/predictions", label: "Predictions", icon: "📊" },
  { href: "/dashboard/account", label: "Account", icon: "👤" },
  { href: "/dashboard/billing", label: "Billing", icon: "💳" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "🔔" },
  { href: "/dashboard/security", label: "Security", icon: "🔐" }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  // Show spinner while loading auth state from localStorage
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin" />
          <p className="text-sm text-[#62626f] font-mono">Loading…</p>
        </div>
      </div>
    );
  }

  // Not logged in — redirect (middleware already handles this, but belt-and-suspenders)
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login?redirect=" + encodeURIComponent(pathname);
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0d] flex">
      {/* Sidebar — always visible on lg */}
      <aside className="hidden lg:flex w-64 bg-[#0f0f14] border-r border-white/[0.06] flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-black font-black text-sm font-mono">Au</span>
            </div>
            <span className="font-bold">Gold<span className="text-amber-400">Predict</span></span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                pathname === item.href ? "bg-amber-400/10 text-amber-400" : "text-[#a0a0ab] hover:text-white hover:bg-white/[0.04]"
              )}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          {["ADMIN", "DEVELOPER", "MODERATOR", "SEO_MANAGER"].includes(user.role) && (
            <Link href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-400 hover:bg-purple-400/10 transition-all mt-4 border border-purple-400/20">
              <span className="text-base w-5 text-center">⚙️</span>
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                : <span className="text-amber-400 font-bold text-sm">{user.name?.[0]?.toUpperCase()}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-[#62626f] truncate capitalize">{user.subscription?.plan || "free"} plan</p>
            </div>
          </div>
          <button onClick={logout} className="btn btn-ghost btn-sm w-full justify-center text-[#62626f]">Sign Out</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        <header className="h-16 border-b border-white/[0.06] flex items-center px-6 bg-[#0a0a0d] sticky top-0 z-20 gap-4">
          <div className="flex-1" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400 hidden sm:block">Live</span>
          {/* Mobile nav */}
          <div className="lg:hidden flex items-center gap-3">
            {NAV_ITEMS.slice(0, 3).map(item => (
              <Link key={item.href} href={item.href}
                className={cn("text-xs font-medium transition-colors", pathname === item.href ? "text-amber-400" : "text-[#62626f] hover:text-white")}>
                {item.label}
              </Link>
            ))}
            <button onClick={logout} className="text-xs text-[#62626f] hover:text-white transition-colors">Out</button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
