# Test files – one-page cheat sheet

For each file, say: **what it tests**, **type**, one important line/assertion, **what would fail**, and **one gap**. Full detail in [TEST_FILES_README.md](TEST_FILES_README.md) and the linked backend/frontend docs.

---

## Index (file → one line → type)

| File | What it tests (one line) | Type |
|------|---------------------------|------|
| auth.integration.test.ts | Login callback creates/updates user in DB; handles bad input | Integration |
| discovery.integration.test.ts | Discovery (daily mix, trending, featured) with auth and seeded data | Integration |
| songs.integration.test.ts | Songs API returns correct list from in-memory DB | Integration |
| integration.test.ts | Live server: featured, trending, health, cache (skipped in CI) | Integration / Smoke |
| sanity.test.ts | Test runner works (trivial pass) | Smoke |
| load.test.ts | Placeholder so Jest finds tests | Smoke |
| recommendation.test.ts | Recommendation: content-based, collaborative, hybrid, learning | Unit |
| vector.test.ts | Vector math: magnitude, dot product, cosine similarity | Unit |
| activity.service.test.ts | Activity service (logging events) | Unit |
| health.routes.test.ts | GET /api/health returns 200 and healthy (Redis mocked) | Integration |
| auth.routes.test.ts | POST /api/auth/callback calls UserService; 200/400 (service mocked) | Integration |
| user.routes.test.ts | GET users, GET profile, POST follow; service calls and shape | Integration |
| song/album/social.routes.test.ts | Route contract and mocks | Integration |
| services/__tests__/*, tests/services/* | Each service in isolation | Unit |
| setup (backend) | In-memory DB lifecycle; Jest global setup | Config |
| setup.ts (frontend) | Vitest: jest-dom, cleanup, mocks (matchMedia, Observers, etc.) | Config |
| AuthStore.test.ts | Auth store: set user, checkAdminStatus, reset (axios mocked) | Unit |
| NotificationStore.test.ts | Notification store: fetch, markAsRead (axios + ChatStore mocked) | Unit |
| Other store tests | State and actions with mocked API | Unit |
| Button.test.tsx | Button renders and default class | Unit |
| Input.test.tsx | Input: placeholder, hasError, ref, shake | Unit |
| UserFlow.test.tsx | Browse→Play, Search→Play, Profile with mocked stores/API | Integration |
| auth.spec.ts | Guest sees landing; sign-in button visible/clickable | E2E |
| home.spec.ts | Home loads, title MelodyHub, Home link visible | E2E |
| player.spec.ts | Song card click shows player bar | E2E |
| playlist.spec.ts | Navigate to library; main/create/empty state | E2E |
| chat.spec.ts | Navigate to chat; main/input/list | E2E |
| a11y.test.tsx | testA11y + axe config for WCAG | Unit / a11y |
| utils, lib, hooks tests | Pure functions, utils, hooks | Unit |

---

## Test types

- **Unit:** One thing in isolation; mock deps; fast. Catches logic and contract bugs.
- **Integration:** Several pieces together (route + service + DB, or components + routing). Catches wrong wire-up.
- **E2E:** Real browser and server. User flows. Slower; critical paths only.
- **Smoke:** "Does it run?" Minimal assertions.

---

**Full detail:** [TEST_FILES_README.md](TEST_FILES_README.md) → [TEST_FILES_BACKEND.md](TEST_FILES_BACKEND.md) | [TEST_FILES_FRONTEND.md](TEST_FILES_FRONTEND.md)
