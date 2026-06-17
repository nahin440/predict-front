"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

const PLANS = [
  { name: "Free", price: "$0/mo", features: ["Basic signal direction", "10 history entries"], highlight: false },
  { name: "Pro", price: "$29/mo", features: ["Full prediction data", "SL/TP targets", "100 history entries"], highlight: false },
  { name: "Premium", price: "$79/mo", features: ["Everything in Pro", "Unlimited history", "API access", "Order blocks"], highlight: true },
  { name: "Enterprise", price: "Custom", features: ["Multi-user", "Custom integrations", "SLA"], highlight: false }
];

export default function BillingPage() {
  const { user } = useAuth();
  const currentPlan = user?.subscription?.plan || "free";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Billing & Plans</h1>
        <p className="text-sm text-[#62626f] mt-1">Manage your subscription</p>
      </div>

      <div className="card p-6 glow-gold">
        <p className="text-xs font-mono text-[#62626f] uppercase tracking-wider mb-3">Current Plan</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-black capitalize text-amber-400">{currentPlan}</p>
            <p className="text-sm text-[#a0a0ab] mt-1">
              Status: <span className="text-emerald-400 font-semibold">{user?.subscription?.status || "active"}</span>
            </p>
          </div>
          {currentPlan !== "premium" && currentPlan !== "enterprise" && (
            <Link href="/pricing" className="btn btn-primary btn-sm">Upgrade</Link>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map(plan => (
          <div key={plan.name} className={`card p-5 flex flex-col ${plan.highlight ? "border-amber-400/30" : ""} ${plan.name.toLowerCase() === currentPlan ? "glow-gold" : ""}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">{plan.name}</h3>
              {plan.name.toLowerCase() === currentPlan && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400">Current</span>
              )}
            </div>
            <p className="text-lg font-black font-mono text-amber-400 mb-4">{plan.price}</p>
            <ul className="space-y-1.5 flex-1">
              {plan.features.map(f => (
                <li key={f} className="text-xs text-[#a0a0ab] flex gap-1.5"><span className="text-amber-400/60">✓</span>{f}</li>
              ))}
            </ul>
            {plan.name.toLowerCase() !== currentPlan && (
              <Link href={plan.name === "Enterprise" ? "/contact" : `/pricing`}
                className="btn btn-secondary btn-sm w-full justify-center mt-4">
                {plan.name === "Enterprise" ? "Contact Us" : "Switch"}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f] mb-4">Payment Method</h2>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="w-10 h-7 rounded bg-white/10 flex items-center justify-center">
            <span className="text-xs font-mono text-[#62626f]">CARD</span>
          </div>
          <div>
            <p className="text-sm text-[#a0a0ab]">No payment method on file</p>
            <p className="text-xs text-[#62626f]">Add a card to upgrade your plan</p>
          </div>
          <button className="btn btn-secondary btn-sm ml-auto">Add Card</button>
        </div>
      </div>
    </div>
  );
}
