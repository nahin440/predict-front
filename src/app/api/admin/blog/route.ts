import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { BlogPost } from "@/models/index";
import { getAuthUser, canManageContent } from "@/lib/auth/helpers";
import { slugify, calculateReadTime } from "@/lib/utils/index";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth || !canManageContent(auth.role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    await connectDB();
    const posts = await BlogPost.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: posts });
  } catch (err) {
    console.error("[ADMIN/BLOG GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth || !canManageContent(auth.role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    await connectDB();
    const { title, content, excerpt, category, tags } = await req.json();
    if (!title || !content) return NextResponse.json({ success: false, error: "title and content required" }, { status: 400 });

    const slug = slugify(title) + "-" + Date.now().toString(36);
    const post = await BlogPost.create({
      title, content, excerpt: excerpt || content.slice(0, 200),
      slug, category: category || "Gold Trading",
      tags: tags || [], authorId: auth.userId, authorName: auth.email,
      status: "published", publishedAt: new Date(),
      readTime: calculateReadTime(content),
      seo: { metaTitle: title, metaDescription: excerpt || content.slice(0, 160), keywords: tags || [] }
    });
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (err) {
    console.error("[ADMIN/BLOG POST]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
