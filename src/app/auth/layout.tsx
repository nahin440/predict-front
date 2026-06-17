import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0d] bg-grid flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-black font-black text-sm font-mono">Au</span>
          </div>
          <span className="font-bold text-lg">Gold<span className="text-amber-400">Predict</span></span>
        </Link>
        <Link href="/" className="text-sm text-[#a0a0ab] hover:text-white transition-colors">← Home</Link>
      </header>

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.04] blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent 70%)" }} />

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative">
        {children}
      </main>
    </div>
  );
}
