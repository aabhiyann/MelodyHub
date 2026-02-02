# MelodyHub – Technical Stack

One-pager for recruiters and technical interviews.

## Stack Overview

| Layer        | Technologies                                                                             |
| ------------ | ---------------------------------------------------------------------------------------- |
| **Frontend** | React 19, TypeScript (strict), Vite 6, Tailwind CSS v4, Zustand, Radix UI, Framer Motion |
| **Backend**  | Node.js, Express, TypeScript (strict), Socket.io                                         |
| **Database** | MongoDB (Mongoose ODM), Redis (caching)                                                  |
| **Auth**     | Clerk (JWT-based)                                                                        |
| **AI**       | Google Gemini 1.5 Flash (playlist generation)                                            |
| **Media**    | Cloudinary (audio + images)                                                              |
| **DevOps**   | Docker, GitHub Actions (CI), Vercel (frontend), Render (backend)                         |
| **Testing**  | Vitest (frontend unit), Jest (backend unit), Playwright (E2E)                            |

## Architecture Highlights

- **Caching**: Redis for API response and query-level cache (song, album, discovery, stats). Cache-aside in services; app works without Redis.
- **Real-time**: Socket.io for chat, presence, and live notifications (friend requests, activity).
- **PWA**: Service worker, offline indicator, MediaSession API for lock-screen controls, install prompt.
- **State**: Zustand for global state (player, UI, auth); TanStack Query for server state where used.

## Testing & CI

- **Frontend**: Vitest, 80%+ coverage; unit tests for stores, hooks, components, pages. E2E (Playwright) in `e2e/` run separately.
- **Backend**: Jest, in-memory MongoDB (mongodb-memory-server) for unit tests; integration tests that need a running server are excluded from default `npm test`.
- **CI**: GitHub Actions – lint, typecheck, and tests for frontend and backend on push/PR to `main` and `feature/**`.

## Key Docs

- [API](professional/API.md) – API reference
- [System Design](professional/04_SYSTEM_DESIGN.md) – Architecture
- [Deployment](professional/DEPLOYMENT.md) – Render + Vercel
- [Demo Script](DEMO_SCRIPT.md) – How to present the app
