# RobsAdventures

A Next.js travel blog that ingests location/message data from Gmail and displays trips on an interactive Google Map.

## Tech Stack

- **Framework**: Next.js 12, React 18, TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: iron-session (cookie sessions) + Gmail OAuth
- **Maps**: Google Maps API (`@googlemaps/react-wrapper`)
- **Deploy**: Fly.io — push to `main` triggers GitHub Actions deploy

## Project Structure

```
pages/          # Next.js routes (public + admin)
pages/api/      # API route handlers
components/     # React components
common/         # Shared types, utilities, server functions
styles/         # CSS modules
prisma/         # Schema and migrations
```

## Common Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # ESLint
npm run clean-db  # DESTRUCTIVE: drops all data and reruns migrations — never run in production
```

## Key Patterns

- Shared types live in `common/types.ts`; server-only utilities in `common/serverFunctions.ts`
- Admin pages are under `pages/admin/` and protected via iron-session
- API routes mirror the page structure (`pages/api/admin/` for admin APIs)
- CSS Modules per feature (`styles/*.module.css`)
- Database migrations go in `prisma/migrations/`
  - Development: `npx prisma migrate dev` — creates and applies migrations (may prompt to reset DB)
  - Production: `npx prisma migrate deploy` — applies pending migrations only, no prompts, no resets

## Environment Variables

Required at runtime (set in Fly.io secrets):
- `DATABASE_URL` — PostgreSQL connection string
- `GOOGLE_CREDENTIALS` — Full Google OAuth JSON blob (parsed in `common/serverFunctions.ts`; use the `web` credentials JSON from Google Cloud Console)
- `GOOGLE_MAPS_API_KEY` — Google Maps API key (used in map pages)
- `SECRET_COOKIE_PASSWORD` — iron-session cookie encryption password (min 32 chars)
- `ADMIN_PASSWORD` — password for the admin login page (min 16 chars recommended)

`AUTH_ROUTE` is **not a static config secret** — do not set it in Fly.io. It is written to `process.env` at runtime by `getAuthUrl()` (`common/serverFunctions.ts`) when Gmail token refresh fails, set to the full Google OAuth authorization URL, then deleted by `pages/api/auth.ts` after a successful exchange. Pages read it via SSR and pass it as a `tokenURL` prop, but map components only check it for truthiness (showing a "Please Authenticate" banner); the actual OAuth redirect URI for the flow comes from `GOOGLE_CREDENTIALS` → `redirect_uris[0]`. The `tokenURL` prop name is misleading — it carries an authorization URL, not a token endpoint.
