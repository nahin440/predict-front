"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [botKey] = useState(process.env.NEXT_PUBLIC_BOT_KEY || "xauusd_bot_secret_key_2026");
  const [copied, setCopied] = useState(false);

  function copyKey(val: string) {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Platform Settings</h1>
        <p className="text-sm text-[#62626f] mt-1">Configuration and system controls</p>
      </div>

      {/* API Config */}
      <div className="card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f] mb-5">Bot API Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="label">V1 Prediction Endpoint</label>
            <div className="flex gap-2">
              <input className="input font-mono text-sm" value="/api/v1/predictions" readOnly />
              <button onClick={() => copyKey("/api/v1/predictions")} className="btn btn-secondary btn-sm whitespace-nowrap">Copy</button>
            </div>
          </div>
          <div>
            <label className="label">Bot API Key (set in .env.local)</label>
            <div className="flex gap-2">
              <input className="input font-mono text-sm" type="password" value="••••••••••••••••••••" readOnly />
              <button onClick={() => copyKey(botKey)} className="btn btn-secondary btn-sm whitespace-nowrap">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-[#62626f] mt-1">Set as <code className="text-amber-400">BOT_API_KEY</code> in your .env.local file</p>
          </div>
        </div>
      </div>

      {/* Python code snippet */}
      <div className="card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f] mb-4">Python Bot Integration</h2>
        <p className="text-sm text-[#a0a0ab] mb-4">Add this to your Python MT5 bot to push predictions to the platform:</p>
        <div className="bg-black/50 rounded-xl p-5 font-mono text-xs overflow-x-auto border border-white/[0.06]">
          <p className="text-emerald-400 mb-1">import requests</p>
          <p className="text-[#a0a0ab] mb-3"></p>
          <p className="text-amber-400">def push_prediction(data: dict):</p>
          <p className="text-[#a0a0ab] ml-4">res = requests.post(</p>
          <p className="text-[#62626f] ml-8">&quot;https://your-domain.com/api/v1/predictions&quot;,</p>
          <p className="text-[#62626f] ml-8">headers={"{"}&#34;x-api-key&#34;: &#34;YOUR_BOT_API_KEY&#34;{"}"},</p>
          <p className="text-[#62626f] ml-8">json=data,</p>
          <p className="text-[#62626f] ml-8">timeout=10</p>
          <p className="text-[#a0a0ab] ml-4">)</p>
          <p className="text-[#a0a0ab] ml-4">return res.json()</p>
        </div>
      </div>

      {/* Seeding */}
      <div className="card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f] mb-4">Admin Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#62626f]">Primary Admin Email</span>
            <span className="font-mono text-amber-400">zubayer.nahin@gmail.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#62626f]">Role Assignment</span>
            <span className="font-mono text-purple-400">Auto ADMIN on first register</span>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-amber-400/5 border border-amber-400/10">
          <p className="text-xs text-amber-400/70">
            The account registered with <strong>zubayer.nahin@gmail.com</strong> automatically receives ADMIN role upon first registration.
          </p>
        </div>
      </div>

      {/* Environment config display */}
      <div className="card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#62626f] mb-4">Environment Variables</h2>
        <div className="space-y-2 text-xs font-mono">
          {[
            { key: "MONGODB_URI", desc: "MongoDB Atlas connection string" },
            { key: "JWT_SECRET", desc: "JWT access token secret (15m expiry)" },
            { key: "JWT_REFRESH_SECRET", desc: "JWT refresh token secret (7d expiry)" },
            { key: "BOT_API_KEY", desc: "Python bot authentication key" },
            { key: "NEXT_PUBLIC_FIREBASE_*", desc: "Firebase configuration keys" }
          ].map(env => (
            <div key={env.key} className="flex items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
              <span className="text-amber-400 min-w-0 flex-shrink-0">{env.key}</span>
              <span className="text-[#62626f]">{env.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
