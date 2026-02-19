# Floekie Growth Dashboard

## Stack
- **Framework**: Next.js 16 (App Router)
- **ORM**: Prisma 6 + PostgreSQL (Supabase)
- **Frontend**: React 19 + Tailwind 4 + shadcn/ui + Recharts
- **Auth**: Custom bcrypt-based (per-client passwords)
- **Deploy**: Coolify (Docker, from GitHub)

## Commands
```bash
npm run dev          # Local dev server
npm run build        # prisma generate && next build
npm run db:push      # Sync Prisma schema to Supabase
npm run db:seed      # npx tsx prisma/seed.ts
npm run db:studio    # Prisma Studio GUI
npm run db:reset     # Force reset + reseed (destructive)
```

## Architecture
- `src/app/[slug]/` — Client dashboard (dynamic routing per client slug)
- `src/app/api/` — REST API routes (auth, clients, experiments, admin-auth)
- `src/lib/` — Shared utilities (auth, benchmarks, UTMs, projections, RISE, roadmap)
- `prisma/` — Schema, seed, Floekie playbook + benchmark data

## Data Model
- **Client** → has many Experiments, GrowthLoops, Sprints, Deliverables
- **Experiment** → funnelLayer (1/2/3), offerType, channels[], audienceSpecs, designBriefing, content, utmSets
- **ExperimentTarget** → auto-mapped benchmarks per experiment
- **Benchmark** → industry + channel + metric baseline data

## Database
- **Supabase project**: `gwkwyzhdpshtjwajjiug` (same as floekie.dog app)
- **DATABASE_URL**: Transaction mode (port 6543) for app queries
- **DIRECT_URL**: Session mode (port 5432) for Prisma migrations/push
- Dashboard tables (clients, experiments, etc.) are separate from the Floekie app tables

## Client Access
- URL: `growth.floekie.dog/floekie` (or configured subdomain)
- Password: `floekie2026`

## Rules
- NEVER commit `.env` (contains DATABASE_URL with credentials)
- ALWAYS run `npm run build` before deploying
- ALWAYS test seed locally before pushing to Coolify
