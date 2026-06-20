import mongoose, { Schema, Document, Model } from "mongoose";

// ─── Audit Log ───────────────────────────────────────────────────────────────
export interface IAuditLogDoc extends Document {
  userId?: string;
  userEmail?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  success: boolean;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLogDoc>(
  {
    userId: { type: String, index: true },
    userEmail: String,
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true },
    resourceId: String,
    details: Schema.Types.Mixed,
    ip: String,
    userAgent: String,
    success: { type: Boolean, default: true }
  },
  { timestamps: true }
);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ userId: 1, action: 1 });

export const AuditLog: Model<IAuditLogDoc> =
  mongoose.models.AuditLog || mongoose.model<IAuditLogDoc>("AuditLog", AuditLogSchema);

// ─── Blog Post ────────────────────────────────────────────────────────────────
export interface IBlogPostDoc extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  seo: { metaTitle: string; metaDescription: string; keywords: string[] };
  readTime: number;
  views: number;
  publishedAt?: Date;
}

const BlogPostSchema = new Schema<IBlogPostDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: String,
    featuredImage: String,
    authorId: { type: String, required: true },
    authorName: String,
    category: String,
    tags: [String],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String]
    },
    readTime: { type: Number, default: 5 },
    views: { type: Number, default: 0 },
    publishedAt: Date
  },
  { timestamps: true }
);

// slug index already created via unique:true above
BlogPostSchema.index({ status: 1, publishedAt: -1 });

export const BlogPost: Model<IBlogPostDoc> =
  mongoose.models.BlogPost || mongoose.model<IBlogPostDoc>("BlogPost", BlogPostSchema);

// ─── Notification ────────────────────────────────────────────────────────────
const NotificationSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: String,
    message: String,
    type: { type: String, enum: ["prediction", "subscription", "payment", "system", "alert"] },
    read: { type: Boolean, default: false },
    data: Schema.Types.Mixed
  },
  { timestamps: true }
);

export const Notification =
  mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
