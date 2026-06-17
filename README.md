# GoldPredict AI — XAUUSD SaaS Platform

Production-grade Next.js 15 SaaS for your XAUUSD prediction bot. Dark luxury fintech design.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15 App Router + TypeScript |
| Styling | TailwindCSS + custom CSS design system |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (access 15m + refresh 7d rotation) |
| Charts | Recharts |
| Firebase | Available for social auth |

---

## Project Structure

```
src/
├── app/
│   ├── (public pages)
│   │   ├── page.tsx                  # Homepage
│   │   ├── predictions/page.tsx      # Live signal dashboard
│   │   ├── pricing/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── gold-price-forecast/      # SEO page
│   │   ├── privacy-policy/
│   │   └── terms/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx                  # Overview
│   │   ├── predictions/page.tsx      # History
│   │   ├── account/page.tsx
│   │   ├── billing/page.tsx
│   │   ├── notifications/
│   │   └── security/page.tsx
│   ├── admin/
│   │   ├── page.tsx                  # Admin dashboard
│   │   ├── users/page.tsx            # User management
│   │   ├── predictions/page.tsx      # All predictions
│   │   ├── blog/page.tsx             # Blog CMS
│   │   ├── analytics/page.tsx        # Charts
│   │   └── settings/page.tsx
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── register/route.ts
│       │   ├── logout/route.ts
│       │   ├── refresh/route.ts      # JWT rotation
│       │   └── me/route.ts
│       ├── predictions/
│       │   ├── current/route.ts
│       │   ├── history/route.ts
│       │   └── stats/route.ts
│       ├── admin/
│       │   ├── users/route.ts
│       │   └── blog/route.ts
│       ├── user/
│       │   ├── profile/route.ts
│       │   └── change-password/route.ts
│       └── v1/predictions/route.ts   # ← Python bot endpoint
├── components/
│   ├── layout/  (Navbar, Footer)
│   └── sections/ (Hero, Features, Pricing, FAQ, CTA...)
├── lib/
│   ├── auth/  (jwt.ts, helpers.ts)
│   ├── db/    (mongoose.ts)
│   └── utils/ (index.ts)
├── models/
│   ├── User.ts
│   ├── Prediction.ts
│   └── index.ts  (AuditLog, BlogPost, Notification)
├── middleware.ts   (route protection)
├── scripts/
│   └── seed-admin.mjs
└── types/index.ts
```

---

## Quick Start

### 1. Install

```bash
cd gold-saas
npm install
```

### 2. Configure `.env.local`

Already created. Update these:

```env
MONGODB_URI="your-mongodb-atlas-uri"
JWT_SECRET="change-in-production-min-32-chars"
JWT_REFRESH_SECRET="change-in-production-min-32-chars"
BOT_API_KEY="your-python-bot-secret-key"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### 3. Seed Admin User

```bash
node src/scripts/seed-admin.mjs
```

This creates `zubayer.nahin@gmail.com` with ADMIN role.
Or just **register with that email** — it auto-gets ADMIN.

### 4. Run

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve production
```

---

## Roles & Access

| Role | Access |
|---|---|
| `ADMIN` | Everything — full admin panel |
| `DEVELOPER` | Admin read + write predictions/blog |
| `SEO_MANAGER` | Blog + SEO controls |
| `MODERATOR` | User management + blog |
| `PREMIUM_USER` | Full prediction data, SL/TP, history |
| `USER` | Basic signal direction only |

**Promote a user via Admin Panel → Users → Edit → Change Role**

---

## Python Bot Integration

Your MT5 Python bot posts predictions to:

```
POST /api/v1/predictions
Headers:
  x-api-key: YOUR_BOT_API_KEY
  Content-Type: application/json

Body: { ...prediction_json_from_mongodb }
```

The body is exactly the prediction document your bot already saves to MongoDB — no changes needed. Copy-paste from your existing MongoDB document format.

```python
import requests

def push_prediction(data: dict, api_key: str, base_url: str):
    res = requests.post(
        f"{base_url}/api/v1/predictions",
        headers={"x-api-key": api_key, "Content-Type": "application/json"},
        json=data,
        timeout=10
    )
    return res.json()
```

---

## JWT Architecture

- **Access token**: 15 minutes, stored in httpOnly cookie + localStorage
- **Refresh token**: 7 days, stored in httpOnly cookie + MongoDB
- **Token rotation**: each refresh issues a new refresh token, old is invalidated
- **Reuse detection**: if a used refresh token is presented again, all sessions cleared
- **Account lockout**: 5 failed logins → 15-minute lockout

---

## Prediction Data Flow

```
Python Bot (MT5 → Exness)
        ↓
POST /api/v1/predictions  (x-api-key auth)
        ↓
MongoDB "predictions" collection
        ↓
GET /api/predictions/current  (JWT auth)
        ↓
Dashboard / Live Signal Page
```

The bot can post directly to your MongoDB **or** through this API — both work.

---

## Premium Gates

| Feature | Free | Premium |
|---|---|---|
| Signal direction | ✓ | ✓ |
| Current price | ✓ | ✓ |
| Regime type | ✓ | ✓ |
| ML confidence % | ✗ | ✓ |
| Effective confidence | ✗ | ✓ |
| Stop Loss / Take Profit | ✗ | ✓ |
| Risk/Reward ratio | ✗ | ✓ |
| Lot size | ✗ | ✓ |
| Full HTF breakdown | ✗ | ✓ |
| Confluence components | ✗ | ✓ |
| Prediction history | 10 | Unlimited |
| API access | ✗ | ✓ |

---

## SEO

- Dynamic metadata via `export const metadata`
- `sitemap.xml` auto-generated at `/sitemap.xml`
- `robots.txt` at `/robots.txt`
- SEO landing pages: `/gold-price-forecast`, `/gold-market-analysis`
- Blog with slug-based URLs

---

## Design System

All CSS variables in `src/app/globals.css`:

```css
--bg-primary: #0a0a0d    /* main background */
--gold-primary: #f59e0b  /* amber gold */
--signal-up: #10b981     /* emerald green */
--signal-down: #ef4444   /* red */
--font-sans: 'Cabinet Grotesk'
--font-mono: 'Geist Mono'
```

Component classes: `.card`, `.btn`, `.btn-primary`, `.input`, `.label`, `.signal-badge-up/down/skip`

---

## Deploy to Vercel

```bash
npx vercel --prod
```

Set all `.env.local` values as Vercel environment variables.

Make sure `MONGODB_URI` allows connections from Vercel's IP ranges (or set `0.0.0.0/0` in MongoDB Atlas Network Access for simplicity).

---

## Next Steps (not yet built — extend as needed)

- [ ] Stripe payment integration (`/api/payments/create-checkout`)
- [ ] Email verification flow (nodemailer configured, route skeleton ready)
- [ ] Blog `[slug]` individual post page
- [ ] `/gold-market-analysis` SEO page
- [ ] Notifications system (model exists)
- [ ] Firebase social login (config already in `.env.local`)
- [ ] Password reset email flow

---

## Admin Credentials

```
Email:    zubayer.nahin@gmail.com
Password: Admin@2026Secure  (change after first login!)
Role:     ADMIN (auto-assigned on register)
Plan:     Premium (auto-assigned by seed script)
```
