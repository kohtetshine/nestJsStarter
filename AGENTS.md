# Repository Guidelines

## Project Structure & Module Organization
- backend/: NestJS (TypeScript). Entry `src/main.ts`; root `src/app.module.ts` and `src/app.controller.ts`.
- Feature modules: `src/prisma/`, `src/redis/`, `src/mail/`, `src/file/`, `src/my-logger/`, `src/api-response/`, `src/gateway-response/`, `src/dto/`.
- Database: Prisma in `backend/prisma/` (`schema.prisma`, `migrations/`).
- Build output: `backend/dist/` (generated; do not edit).
- client/: Next.js (React, TypeScript) with `app/` directory (`app/page.tsx`, `app/layout.tsx`). Config in `next.config.ts`.
- Orchestration: `docker-compose.yml` runs backend (3000) and client (8080).

## Build, Test, and Development Commands
- Dev server: `cd backend && npm install && npm run start:dev` — watch mode.
- Build: `cd backend && npm run build` — compiles to `dist/`.
- Run compiled: `cd backend && npm start` — runs `node dist/main.js`.
- Prisma dev migrate: `cd backend && npm run prisma:migrate`.
- Prisma deploy/apply: `cd backend && npm run prisma:deploy`.
- Prisma client: `cd backend && npm run prisma:generate`.
- Full stack (Docker): from repo root `docker-compose up --build`.

## Client Development
- Dev server: `cd client && npm install && npm run dev -- -p 8080` (Next.js on 8080).
- Build: `cd client && npm run build`; Run: `npm start -p 8080`.
- Backend URL: `http://localhost:3000`. Configure in `.env.local` as `NEXT_PUBLIC_API_URL=http://localhost:3000`.
- Prefer rewrites over CORS in `next.config.ts`:
  - Example: `rewrites: async () => [{ source: '/api/:path*', destination: 'http://localhost:3000/:path*' }]`.

## Coding Style & Naming Conventions
- Formatter: Prettier (2-space indent, semicolons). Run `cd backend && npm run format`.
- Files: kebab-case (e.g., `file.module.ts`, `logger.service.ts`).
- Classes/Types: PascalCase. Variables/functions: camelCase.
- DTOs end with `.dto.ts`; modules `.module.ts`; services `.service.ts`.
- Place shared controller DTOs in `backend/src/dto/`; feature code under its folder.

## Testing Guidelines
- Tests are not configured yet. Recommended: Jest with unit tests under `backend/src/**/*.spec.ts` or `backend/test/` and an `npm run test` script.
- Aim for service-level unit tests first; add e2e later.
- Keep tests fast and isolated; mock external services (Prisma, Redis, mail).

## Commit & Pull Request Guidelines
- Commits: Conventional Commits (e.g., `feat(file): support uploads`, `fix(prisma): correct schema`).
- PRs: clear summary, rationale, and verification steps; link issues; include request/response samples when changing APIs; keep scope focused.

## Security & Configuration Tips
- Set `DATABASE_URL` in `backend/.env` (MySQL). Do not commit secrets.
- After editing `schema.prisma`, run `npm run prisma:generate` then migrate or deploy.
- Validate envs in local and CI; prefer `.env.example` for required keys.
 - Client: use `client/.env.local` for `NEXT_PUBLIC_API_URL` and other public vars.
