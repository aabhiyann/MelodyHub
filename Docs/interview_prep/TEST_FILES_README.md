# Test Files – Interview Prep Hub

Quick way to explain any test file in an interview. Each file answers: what it tests, what type of test, why we wrote it that way, what would fail if it catches a bug, and what we're not testing.

---

## How to talk about it

- Don't memorize. Say: "This file is testing [X]. We use [unit/integration/E2E] so that [reason]. The important part is [one or two lines] because [why]. If it failed, it would mean [real scenario]. One gap is we don't test [gap]."
- Keep it short unless they ask for detail; then use the line-by-line section in the detail docs.

---

## Index: every test file

| File | What it tests (one line) | Type | Detail |
|------|---------------------------|------|--------|
| **Backend – integration** | | | |
| [auth.integration.test.ts](TEST_FILES_BACKEND.md#authintegrationtestts) | Login callback creates/updates user in DB and handles bad input | Integration | [Backend](TEST_FILES_BACKEND.md) |
| [discovery.integration.test.ts](TEST_FILES_BACKEND.md#discoveryintegrationtestts) | Discovery endpoints (daily mix, trending, featured) with auth and seeded data | Integration | [Backend](TEST_FILES_BACKEND.md) |
| [songs.integration.test.ts](TEST_FILES_BACKEND.md#songsintegrationtestts) | Songs API returns correct list from in-memory DB | Integration | [Backend](TEST_FILES_BACKEND.md) |
| [integration.test.ts](TEST_FILES_BACKEND.md#integrationtestts) | Live server: featured, trending, health, cache, api-docs (skipped in CI) | Integration / Smoke | [Backend](TEST_FILES_BACKEND.md) |
| [sanity.test.ts](TEST_FILES_BACKEND.md#sanitytestts) | Test runner works (trivial pass) | Smoke | [Backend](TEST_FILES_BACKEND.md) |
| [load.test.ts](TEST_FILES_BACKEND.md#loadtestts) | Placeholder so Jest finds tests (no real load) | Smoke | [Backend](TEST_FILES_BACKEND.md) |
| [recommendation.test.ts](TEST_FILES_BACKEND.md#recommendationtestts) | Recommendation service: content-based, collaborative, hybrid, preference learning | Unit | [Backend](TEST_FILES_BACKEND.md) |
| [vector.test.ts](TEST_FILES_BACKEND.md#vectortestts) | Vector math: magnitude, dot product, cosine similarity | Unit | [Backend](TEST_FILES_BACKEND.md) |
| [activity.service.test.ts](TEST_FILES_BACKEND.md#activityservicetestts) | Activity service (logging events) | Unit | [Backend](TEST_FILES_BACKEND.md) |
| **Backend – routes** | | | |
| [health.routes.test.ts](TEST_FILES_BACKEND.md#healthroutestestts) | GET /api/health returns 200 and healthy status (Redis mocked) | Integration | [Backend](TEST_FILES_BACKEND.md) |
| [auth.routes.test.ts](TEST_FILES_BACKEND.md#authroutestestts) | POST /api/auth/callback calls UserService and returns 200/400 (service mocked) | Integration | [Backend](TEST_FILES_BACKEND.md) |
| [user.routes.test.ts](TEST_FILES_BACKEND.md#userroutestestts) | GET users, GET profile, POST follow; service calls and response shape | Integration | [Backend](TEST_FILES_BACKEND.md) |
| [song.routes.test.ts](TEST_FILES_BACKEND.md#songroutestestts) | Song routes (list, get, etc.) with mocks | Integration | [Backend](TEST_FILES_BACKEND.md) |
| [album.routes.test.ts](TEST_FILES_BACKEND.md#albumroutestestts) | Album routes with mocks | Integration | [Backend](TEST_FILES_BACKEND.md) |
| [social.routes.test.ts](TEST_FILES_BACKEND.md#socialroutestestts) | Social routes with mocks | Integration | [Backend](TEST_FILES_BACKEND.md) |
| **Backend – services & setup** | | | |
| services/__tests__/*.test.ts, tests/services/*.test.ts | Each service in isolation (user, song, album, social, playlist, analytics, redis, activity, friend, mood) | Unit | [Backend](TEST_FILES_BACKEND.md#backend-service-tests) |
| __tests__/setup.ts, tests/setup.ts | In-memory DB lifecycle and Jest global setup | Config | [Backend](TEST_FILES_BACKEND.md#backend-setup) |
| **Frontend – setup & stores** | | | |
| [setup.ts](TEST_FILES_FRONTEND.md#setupts) | Vitest: jest-dom, cleanup, mocks for matchMedia, HTMLMediaElement, Observers | Config | [Frontend](TEST_FILES_FRONTEND.md) |
| [AuthStore.test.ts](TEST_FILES_FRONTEND.md#authstoretestts) | Auth store: set user, checkAdminStatus, reset (axios mocked) | Unit | [Frontend](TEST_FILES_FRONTEND.md) |
| [NotificationStore.test.ts](TEST_FILES_FRONTEND.md#notificationstoretestts) | Notification store: fetch, markAsRead (axios + ChatStore mocked) | Unit | [Frontend](TEST_FILES_FRONTEND.md) |
| Other store tests | Same pattern: state and actions with mocked API | Unit | [Frontend](TEST_FILES_FRONTEND.md#other-stores) |
| **Frontend – components & pages** | | | |
| [Button.test.tsx](TEST_FILES_FRONTEND.md#buttontesttsx) | Button renders and has default class | Unit | [Frontend](TEST_FILES_FRONTEND.md) |
| [Input.test.tsx](TEST_FILES_FRONTEND.md#inputtesttsx) | Input: placeholder, classes, hasError, ref, shake animation | Unit | [Frontend](TEST_FILES_FRONTEND.md) |
| [UserFlow.test.tsx](TEST_FILES_FRONTEND.md#userflowtesttsx) | Browse→Play, Search→Play, Profile with mocked stores/API | Integration | [Frontend](TEST_FILES_FRONTEND.md) |
| **Frontend – E2E** | | | |
| [auth.spec.ts](TEST_FILES_FRONTEND.md#authspectts) | Guest sees landing; sign-in button exists and is clickable | E2E | [Frontend](TEST_FILES_FRONTEND.md) |
| [home.spec.ts](TEST_FILES_FRONTEND.md#homespectts) | Home loads, title MelodyHub, Home link visible | E2E | [Frontend](TEST_FILES_FRONTEND.md) |
| [player.spec.ts](TEST_FILES_FRONTEND.md#playerspectts) | Song card click shows player bar | E2E | [Frontend](TEST_FILES_FRONTEND.md) |
| [playlist.spec.ts](TEST_FILES_FRONTEND.md#playlistspectts) | Navigate to library, main visible, create/empty state | E2E | [Frontend](TEST_FILES_FRONTEND.md) |
| [chat.spec.ts](TEST_FILES_FRONTEND.md#chatspectts) | Navigate to chat, main/chat area and input or message list | E2E | [Frontend](TEST_FILES_FRONTEND.md) |
| **Frontend – a11y & utils** | | | |
| [a11y.test.tsx](TEST_FILES_FRONTEND.md#a11ytesttsx) | Helpers + axe config for WCAG (testA11y, hasAccessibleName, etc.) | Unit / a11y | [Frontend](TEST_FILES_FRONTEND.md) |
| utils, lib, hooks tests | Util functions, lib utils, useInfiniteScroll, useCardReveal, useGridNavigation | Unit | [Frontend](TEST_FILES_FRONTEND.md#other-frontend-tests) |

---

## Quick reference: test types

- **Unit:** One thing in isolation (function, class, store, component). Fast, mock dependencies. Catches logic bugs and contract breaks.
- **Integration:** Several pieces together (e.g. route + service + DB, or multiple components + routing). Uses real or in-memory DB or mocked external deps. Catches wrong wire-up and contract breaks between layers.
- **E2E:** Real browser and server. User flows. Catches "the app doesn't work when I use it" but slower and flakier.
- **Smoke:** "Does it run and return something OK?" Minimal assertions. Good for CI to know the app starts and key endpoints respond.

---

## Full detail

- **Backend tests (full detail):** [TEST_FILES_BACKEND.md](TEST_FILES_BACKEND.md)
- **Frontend tests (full detail):** [TEST_FILES_FRONTEND.md](TEST_FILES_FRONTEND.md)
- **One-page cheat sheet:** [TEST_FILES_CHEATSHEET.md](TEST_FILES_CHEATSHEET.md)
