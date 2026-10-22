# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server on http://localhost:5173 (the only origin the backend's CORS allows).
- `npm run build` — `tsc -b && vite build`; the type-check gate. Run it before committing.
- `npm run lint` — oxlint (not ESLint).
- No test runner is configured.
- Install with `npm i --legacy-peer-deps` (peer-dep conflict in `@hookform/resolvers`).
- `.env` (git-ignored) holds `VITE_API_URL`; copy from `.env.example`. Defaults to `http://localhost:8080`.

## Workflow rule

Commit after every change to the project, one focused commit per logical change, in Portuguese or English matching existing history. End commit messages with the `Co-Authored-By` trailer.

## Architecture

React 19 + Vite + TypeScript + Tailwind v4 (config lives in `src/index.css` under `@theme`, no `tailwind.config`). Frontend for the Spring Boot API in the sibling `../habitFlow` project (port 8080, JWT auth, Postgres).

- `src/lib/api.ts` — the single fetch wrapper. Injects the Bearer token; on a 401 it calls `POST /login/refresh` once (shared in-flight promise), retries, and otherwise clears tokens and triggers logout via `setLogoutHandler`. It parses both JSON and plain-text responses, since `/login/create`, `/login/verificar` and `/login/reenviarcodigo` return plain text. Tokens persist in localStorage (`habitflow.tokens`).
- `src/auth/AuthContext.tsx` — `AuthProvider`, `useAuth`, and `ProtectedRoute`. Login uses the user's **email** as the `login` field.
- `src/features/habits/habits.ts` — types, label maps, and TanStack Query hooks. The toggle hook is optimistic with rollback; other mutations invalidate the `['habits', ...]` key.
- `src/pages/` — Landing, Login, Register, VerifyCode, Dashboard. Registration flows to `/verificar?email=...`; login only works after the emailed 6-digit code is verified.
- Animations use `motion/react`; shared primitives (`Button`, `Field`, `Card`, `Background`) are in `src/components/ui.tsx`. Palette tokens: navy `#112250`, slate `#3C507D`, teal `#09CBC2`, cream `#F5F0E9`, gold `#E0C58F`. Respect `prefers-reduced-motion`.

## Backend quirks that affect the UI

- Business errors (`ValidationException`) come back as **404** with `{message}`, not 4xx by type; show `message` rather than branching on status.
- Bad credentials return Spring's default error body, so `AuthContext.login` replaces it with a generic message.
- `PATCH /habitos/{id}/{ativar|desativar}` is the only toggle; any other value silently does nothing.
- There are no streaks or completion logs, only habit CRUD plus `active`. Do not fabricate progress data.
- Habit `unit` is only `MINUTES | HOURS`; `frequency` is `DAILY | WEEKLY | MONTHLY | ANNUALLY`.
