# SERV HUB Customer Marketplace

Independent customer-facing React, Vite and TypeScript application. Phase 1
provides a basic shell, not customer or marketplace functionality.

## Setup

Requires Node.js 22 and pnpm 10.

```powershell
pnpm install
Copy-Item .env.example .env
pnpm dev
```

Set `VITE_API_BASE_URL` in `.env` to the backend's versioned HTTP(S) API base.
Vite exposes this variable to the browser; never put secrets in `VITE_` variables.
The development server uses port 5173. Ensure the backend allows its origin.

## Commands

- `pnpm dev` — development server
- `pnpm build` — type-check and create production build
- `pnpm preview` — preview the production build
- `pnpm lint`, `pnpm typecheck`, `pnpm test` — independent checks

The app uses React Router, TanStack Query, Zustand, React Hook Form, Zod,
Tailwind CSS and shadcn/ui conventions. Features own their UI and data access.
The frontend does not access the database or import sibling project source.
