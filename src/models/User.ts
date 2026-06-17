import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserDoc extends Document {
  email: string;
  name: string;
  password?: string;
  role: "ADMIN" | "DEVELOPER" | "SEO_MANAGER" | "MODERATOR" | "PREMIUM_USER" | "USER";
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  firebaseUid?: string;
  subscription: {
    plan: "free" | "pro" | "premium" | "enterprise";
    status: "active" | "cancelled" | "expired" | "trialing";
    expiresAt?: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  };
  apiKey?: string;
  loginAttempts: number;
  lockUntil?: Date;
  lastLogin?: Date;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: string[];
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ["ADMIN", "DEVELOPER", "SEO_MANAGER", "MODERATOR", "PREMIUM_USER", "USER"],
      default: "USER"
    },
    avatar: String,
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    firebaseUid: { type: String, sparse: true },
    subscription: {
      plan: { type: String, enum: ["free", "pro", "premium", "enterprise"], default: "free" },
      status: { type: String, enum: ["active", "cancelled", "expired", "trialing"], default: "active" },
      expiresAt: Date,
      stripeCustomerId: String,
      stripeSubscriptionId: String
    },
    apiKey: { type: String, sparse: true },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    lastLogin: Date,
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    refreshTokens: [String]
  },
  { timestamps: true }
);

// ─── Hash password before save ───────────────────────────────────────────────
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Compare password ────────────────────────────────────────────────────────
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

// ─── Indexes ─────────────────────────────────────────────────────────────────
// email index already set via unique:true on field definition
UserSchema.index({ role: 1 });
UserSchema.index({ "subscription.plan": 1 });

const User: Model<IUserDoc> =
  mongoose.models.User || mongoose.model<IUserDoc>("User", UserSchema);

export default User;
