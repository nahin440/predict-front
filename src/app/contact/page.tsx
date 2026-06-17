"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success("Message sent! We'll respond within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  }

  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-32 pb-24 bg-grid">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-3">Contact</p>
            <h1 className="text-4xl font-black tracking-tight mb-4">Get in Touch</h1>
            <p className="text-[#a0a0ab]">Questions about signals, pricing, or API integration? We respond within 24 hours.</p>
          </div>
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Name</label>
                  <input type="text" className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" className="input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="label">Subject</label>
                <select className="input" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} required>
                  <option value="">Select a topic…</option>
                  <option>Signal Question</option>
                  <option>Pricing / Billing</option>
                  <option>API Integration</option>
                  <option>Technical Issue</option>
                  <option>Enterprise Inquiry</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="label">Message</label>
                <textarea className="input min-h-32 resize-y" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
