# PeakPost

Modern Instagram scheduling SaaS for creators. AI-driven peak-time detection, mobile-first uploads, and storytelling analytics.

## Quickstart

```bash
pnpm install   # or npm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's inside

- **Next.js 15** App Router + TypeScript + Tailwind
- **Recharts** for analytics
- **Mock data layer** in `lib/mock.ts` — swap for Supabase + Meta Graph API later
- All 8 routes from the blueprint: landing, login, dashboard, upload, analytics, scheduled, upgrade

## Design philosophy

Built to beat Buffer / Later / Metricool on three things:

1. **Peak-time clarity** — visual 24-hour radial clock instead of buried tables
2. **Mobile-first scheduling** — single-tap "use peak time" flow
3. **Analytics that tell a story** — plain-English recommendations, not just charts
