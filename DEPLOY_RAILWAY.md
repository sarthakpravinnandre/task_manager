# Railway Deployment

## 1) Push code
Push this project to GitHub.

## 2) Create Railway project
- New Project -> Deploy from GitHub repo.
- Add a PostgreSQL service (or use external Neon DB).

## 3) Set environment variables
In Railway service variables, set:
- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- `NEXTAUTH_URL`

Use `.env.example` as reference.

## 4) Deploy settings
This repo includes `railway.json` with:
- Build: Nixpacks
- Start command: `npm run railway:start`

`railway:start` runs:
1. `prisma db push`
2. `next start`

## 5) Optional seed data (one-time)
After first deploy, run in Railway shell:
- `npm run db:seed`

## 6) Health check
- Health endpoint: `/api/health`
- Example: `https://your-app-name.up.railway.app/api/health`

## Notes
- `.env` is now ignored by git.
- If you already committed `.env` earlier, rotate secrets immediately.
- Prefer `sslmode=verify-full` in `DATABASE_URL` to avoid pg SSL-mode warnings.
