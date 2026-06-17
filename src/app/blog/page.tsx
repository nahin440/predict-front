import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import connectDB from "@/lib/db/mongoose";
import { BlogPost } from "@/models/index";

export const metadata: Metadata = {
  title: "Blog — GoldPredict AI | Gold Trading Insights",
  description: "Gold trading insights, XAUUSD analysis, market regime guides, and AI trading strategies from the GoldPredict AI team."
};

async function getPosts() {
  try {
    await connectDB();
    const posts = await BlogPost.find({ status: "published" }).sort({ publishedAt: -1 }).limit(12).lean();
    return JSON.parse(JSON.stringify(posts));
  } catch { return []; }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-32 pb-24 bg-grid">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-3">Knowledge Base</p>
            <h1 className="text-4xl font-black tracking-tight mb-4">Gold Trading Insights</h1>
            <p className="text-[#a0a0ab]">XAUUSD analysis, market structure guides, and AI trading strategies.</p>
          </div>

          {posts.length === 0 ? (
            <div className="card p-16 text-center">
              <p className="text-[#62626f] text-lg mb-2">No blog posts published yet.</p>
              <p className="text-sm text-[#62626f]">Check back soon for gold trading insights and market analysis.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: Record<string, unknown>) => (
                <Link key={post._id as string} href={`/blog/${post.slug}`} className="card p-6 hover:glow-gold transition-all duration-200 group flex flex-col">
                  {Boolean(post.featuredImage) && (
                    <div className="h-48 rounded-xl bg-white/[0.05] mb-4 overflow-hidden">
                      <img src={post.featuredImage as string} alt={post.title as string} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400">
                      {post.category as string || "Gold"}
                    </span>
                    <span className="text-xs text-[#62626f]">{post.readTime as number} min read</span>
                  </div>
                  <h2 className="text-base font-bold mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {post.title as string}
                  </h2>
                  <p className="text-sm text-[#a0a0ab] leading-relaxed line-clamp-3 flex-1">{post.excerpt as string}</p>
                  <p className="text-xs text-[#62626f] mt-4 font-mono">
                    {post.publishedAt ? new Date(post.publishedAt as string).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : ""}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
