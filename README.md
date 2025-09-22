# NestJS Starter Kit

A minimal starter with:
- `backend/` — NestJS API with CORS and health check
- `client/` — Next.js 15 app (App Router) with Tailwind v4; uses Next rewrites to proxy `/api/*` to the backend.
- `docker-compose.yml` — Orchestrates both services

## Prerequisites
- Docker and Docker Compose installed

## Quick start

1. Build and run:

```
docker compose up --build
```

2. Open the apps:
- Client: http://localhost:8080
- Adminer (DB UI): http://localhost:8081
- Backend (direct): http://localhost:${BACKEND_PORT:-3005}
  - Swagger UI: http://localhost:${BACKEND_PORT:-3005}/docs
  - OpenAPI JSON: http://localhost:${BACKEND_PORT:-3005}/docs/json
  - Also proxied via client: http://localhost:8080/docs

## Local Dev Scripts

- `./start-local.sh`: Starts backend and client with local compose and tails logs (Ctrl+C stops watching; services keep running). Auto-picks a free `BACKEND_PORT` starting at the value in `.env.local` (or 3001).
- `./logs-local.sh [service ...]`: Follows logs for all services or specific ones (e.g., `backend`, `client`).
- `./stop-local.sh`: Stops containers and removes orphans.

These mirror convenience scripts from similar repos (e.g., recipe-panel) to make local dev and log watching easy.

## Backend
- Default port: `3000`
- Endpoints:
  - `GET /health` → `{ status: "ok" }`
  - `GET /` → `{ message: "Hello from NestJS!" }`
 - API docs: Swagger enabled at `/docs`
  - In Docker local: host port is `${BACKEND_PORT}` (defaults to `3005` via `.env.local` or the auto-picked port from `start-local.sh`).

## Database & Prisma (MySQL)
- Uses your local MySQL at `localhost:3306` with `root/root` by default.
- Default DB name: `mail2chat`.
- Prisma schema: `backend/prisma/schema.prisma` (provider: mysql; includes a sample `User` model).
- Set `DATABASE_URL`:
  - Example: `mysql://root:root@localhost:3306/mail2chat`
- Common commands (run inside `backend/`):
  - `npm run prisma:generate` — generate the Prisma client
  - `npm run prisma:migrate` — create/apply a dev migration (requires DB running)
  - `npm run prisma:deploy` — apply migrations in non-interactive environments

If running backend in Docker while DB is on your host:
- Compose is set to connect to `host.docker.internal` (Linux uses `extra_hosts: host-gateway`).
- Ensure database `mail2chat` exists, or change the URL in `.env.*`.

To create the first migration locally (recommended to persist files):
1) Ensure MySQL is running and the DB exists (e.g., `CREATE DATABASE mail2chat;`).
2) In `backend/`: copy `.env.example` to `.env` and adjust as needed.
3) Run: `npm install && npm run prisma:generate && npm run prisma:migrate -- --name init`.

## Client
- Next.js (App Router) with Tailwind v4
- Rewrites: requests to `/api/*` and `/docs/*` proxy to the backend service. In Docker, the client proxies to `http://backend:3000`; locally it defaults to `http://localhost:3000`.

## Notes
- Adjust CORS and networking as needed for production.
- For local Node development without Docker, run `npm install` inside `backend/` and use `npm run start:dev` (requires Nest CLI).
