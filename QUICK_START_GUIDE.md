# Quick Start Guide — TeamHub

## Stack

- **Next.js 16** (App Router)
- **NextAuth v5** (credentials, JWT sessions)
- **Prisma 7** + **PostgreSQL**
- **SWR** for client data fetching

## Roles (5)

| Role | Dashboard layout | Scope |
|------|------------------|--------|
| Admin | Standard | Organization-wide |
| Developer | Developer | Personal + assignments |
| Team Lead | Standard | Managed teams |
| Senior Manager | Standard | Organization-wide |
| Project Lead | Standard | Led teams |
| Sign-up | — | **Developer only** (elevated roles via seed/admin) |

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `AUTH_SECRET`.
2. Install and prepare the database:

```bash
npm install
npm run db:setup
```

`db:setup` runs `prisma db push` and seeds demo data via **`prisma/seed.cjs`** (canonical seed).

3. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo accounts (after seed)

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password123 | Admin |
| lead@example.com | password123 | Team Lead |
| dev@example.com | password123 | Developer |
| manager@example.com | password123 | Senior Manager |
| project@example.com | password123 | Project Lead |

## Project structure

```
app/
  dashboard/          # Role-based dashboard (RoleDashboard)
  tasks|meetings|...  # App shell pages
  api/                # REST APIs (scoped by role)
components/
  app-shell.tsx       # Shared layout (sidebar + navbar)
  dashboard/          # Dashboard widgets
lib/
  api/scope.ts        # getScopedUserIds — shared with dashboard API
  auth/roles.ts       # normalizeRole()
prisma/
  schema.prisma
  seed.cjs            # Only seed file
```

## Protected routes

Handled by `proxy.ts` (NextAuth). Includes `/dashboard`, `/tasks`, `/meetings`, `/team`, `/timeline`, `/messages`, `/settings`, `/voice`, `/support`.

## Key APIs

| Endpoint | Notes |
|----------|--------|
| `GET /api/dashboard` | Role-scoped dashboard payload |
| `GET/POST/PATCH/DELETE /api/tasks` | Scoped task CRUD |
| `GET/POST/PATCH/DELETE /api/meetings` | Scoped meetings |
| `GET/POST/PATCH/DELETE /api/reminders` | Reminders (`scheduledAt`) |
| `GET/POST /api/messages` | Team/DM messages |
| `GET/POST /api/support-tickets` | Support tickets |
| `GET /api/voice-channels` | Voice channel list |
| `GET/POST /api/projects` | Projects (create: admin) |
| `POST /api/project-assignments` | Assign / accept / start / complete |

## Auth example (server)

```typescript
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  // ...
}
```

## Client data hooks

All live in `hooks/use-dashboard.ts`:

- `useDashboard()`
- `useTasks()`, `useMeetings()`, `useReminders()`
- `useMessages()`, `useSupportTickets()`, `useVoiceChannels()`

Uses `apiFetcher` from `lib/api/fetcher.ts` (checks `res.ok`).

## Theme

`next-themes` is enabled. Use the **moon/sun** controls in the navbar. Default theme: dark.

## After schema changes

```bash
npx prisma db push
npm run db:seed
```

For a clean slate, reset the database in your provider, then run `npm run db:setup` again.
