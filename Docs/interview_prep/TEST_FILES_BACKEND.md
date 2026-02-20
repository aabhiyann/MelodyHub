# Backend test files (detail)

Back to [hub](TEST_FILES_README.md).

---

## Common patterns

- **In-memory DB lifecycle:** Many integration tests use `connect()` in `beforeAll`, `close()` in `afterAll`, and `clear()` in `beforeEach`. That gives a fresh DB per test so tests don't leak data. Setup comes from `__tests__/setup.ts` (Supertest request + MongoMemoryServer) or `tests/setup.ts` (Jest global setup).
- **Mock Redis:** Route-level tests mock the `redis` package so the app boots in CI without a real Redis server. The mock provides `connect`, `on('connect', cb)`, etc., and we call `redisService.connect()` in `beforeAll` so the health handler sees "connected."
- **Mock services and assert request/response:** Route tests mock UserService, ActivityService, etc., then `request(app).get/post(...)` and assert status, body, and that mocks were called with the right arguments.

---

## auth.integration.test.ts

**What it tests:** Login callback creates a new user in the DB the first time, updates them if they already exist, and handles bad or missing data.  
**Type:** Integration (HTTP + in-memory DB).

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| User not saved with correct clerkId; API returns wrong status or body shape. | Real Clerk OAuth; rate limiting; DB down. |

### Line-by-line (when you need detail)

- `request, connect, close, clear` from setup — Supertest sends HTTP to our app; connect/close/clear control in-memory MongoDB so we don't touch a real DB.
- `beforeAll(connect)` — Start in-memory DB once so every request has a DB.
- `afterAll(close)` — Disconnect and stop the DB so the process can exit.
- `beforeEach(clear)` — Wipe all collections so "create user" and "update user" tests don't share data.
- Mock user payload (id, firstName, lastName, imageUrl) — We fake what Clerk would send so we can assert exactly what we expect in the DB.
- `request.post('/api/auth/callback').send(mockUser)` — Real POST through route → validation → service → DB.
- `expect(res.status).toBe(200)` and `expect(res.body.success).toBe(true)` — API contract; if someone changes to 201 or different shape, this fails.
- `User.findOne({ clerkId: mockUser.id })` — We check the DB so we're testing "right data ended up in DB," not just 200.
- Update test: create existing user with `User.create`, then send callback with new name/image — Tests "already have this user" path.
- Missing-fields test: send only imageUrl — Tests bad input; we accept either 400 or 200 depending on product (test documents current behavior).

---

## discovery.integration.test.ts

**What it tests:** Discovery endpoints (daily mix, trending, featured): unauthenticated gets 401 where required; with seeded data we get 200 and expected list shape.  
**Type:** Integration (HTTP + in-memory DB).

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Daily-mix auth removed (we'd get 200 without auth); trending query or sort changed. | Recommendation quality; pagination; real auth tokens. |

Uses common in-memory DB lifecycle. Seeds Song and UserPreference, then GETs discovery endpoints with `x-test-user-id` where needed. Asserts status and that the right songs appear.

---

## songs.integration.test.ts

**What it tests:** Songs API list (and any other song endpoints in the file): with albums/songs in the DB we get correct status and body shape.  
**Type:** Integration (HTTP + in-memory DB).

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| GET /api/songs returns different data (e.g. only liked); response shape changes. | Filters, search, sorting, upload/delete; strict schema. |

Uses common in-memory DB lifecycle. Creates Album then Song with albumId; GET /api/songs with `x-test-user-id`. Handles both `{ data: [...] }` and nested data shape; asserts length and first item.

---

## integration.test.ts

**What it tests:** Live server on port 5001: featured, trending, new-releases, made-for-you, health, caching, api-docs. "Does the real server respond?"  
**Type:** Integration / smoke. Skipped in CI (no server).

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Endpoint requires auth and we didn't add it; server won't start. | Exact response content; DB state; load. |

Uses `describeIntegration = process.env.CI ? describe.skip : describe` so the suite is skipped in CI. `beforeAll` waits 2s for server. Each test fetches an endpoint and expects 200 and a success-like body; caching test does two GETs; api-docs allows status < 400 or skip.

---

## sanity.test.ts

**What it tests:** Test runner works — one trivial assertion that always passes.  
**Type:** Smoke.

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Only if Jest or config is broken (tests not running). | Any app behavior. |

Single test: `expect(true).toBe(true)`.

---

## load.test.ts

**What it tests:** Nothing about load; it's a placeholder so Jest doesn't report "no tests found."  
**Type:** Smoke / placeholder.

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Only if the file isn't a valid test module. | Real load (concurrent users, response times). |

Single test: `expect(true).toBe(true)`.

---

## recommendation.test.ts

**What it tests:** Recommendation service: content-based (audio prefs), collaborative (liked songs), hybrid (cold start vs rich data), preference learning. Arrays, algorithm label, confidence in [0, 1].  
**Type:** Unit (with in-memory DB).

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Cold start returns non-"popular"; confidence out of range; collaborative threshold changed. | Recommendation quality; HTTP layer; auth. |

### Line-by-line (when you need detail)

- MongoMemoryServer in beforeAll/afterAll — Recommendation reads UserPreference and Song; we use in-memory so we control data.
- Content-based: delete prefs for test user, call `contentBasedRecommendations`, expect empty array — "no preferences → no recommendations."
- Content-based: upsert UserPreference with tempo/energy/etc., call function, expect array — assertion kept loose (content depends on Song data).
- Collaborative: likedSongs fewer than 3, expect empty — "not enough data for collaborative."
- Hybrid cold start: new user, expect result.songs, algorithm === 'popular', low confidence.
- Hybrid rich data: seed liked songs, history, prefs, genres, artists; expect algorithm set and confidence > 0.5.
- Confidence in [0, 1] — Contract check only.
- updateUserAudioPreferences / updateUserFavorites — Seed history, call update, fetch preference doc, assert audioPreferences or favoriteGenres set.

---

## vector.test.ts

**What it tests:** Vector math (magnitude, dot product, cosine similarity). Correct results and error when lengths mismatch.  
**Type:** Unit (pure functions).

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Formula bug (e.g. magnitude as sum instead of sqrt(sum of squares)); cosine operands swapped. | Huge vectors; numerical stability; callers. |

- magnitude([3, 4]) → 5 (3-4-5 triangle).
- dotProduct([1, 2], [3, 4]) → 11; expect(() => dotProduct([1], [1, 2])).toThrow() for mismatched lengths.
- cosineSimilarity: 1 for identical, 0 for orthogonal, -1 for opposite, 0 for zero vector; toBeCloseTo(0.7071) for float.

---

## activity.service.test.ts

**What it tests:** Activity service (e.g. logging plays, likes, follows). Methods result in the right DB writes or calls.  
**Type:** Unit (service in isolation).

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Service stops writing right events or throws. | HTTP route that calls the service; analytics downstream. |

Same pattern as other service tests: call methods, mock/seed dependencies, assert outcomes.

---

## health.routes.test.ts

**What it tests:** GET /api/health returns 200 and body with status healthy and services (e.g. mongodb, redis) connected.  
**Type:** Integration (route level; Redis mocked).

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Health returns 500 or status missing; someone renames status to state. | Real Redis/Mongo connectivity; timeouts. |

### Line-by-line (when you need detail)

- jest.mock('redis', ...) — App creates Redis on load; we fake it so tests don't need real Redis in CI.
- beforeAll: redisService.connect() — Mock's on('connect', cb) calls cb() so service reports connected.
- request(app).get('/api/health') — Hit app HTTP stack without starting a real server (Supertest).
- expect body.status === 'healthy' and services.mongodb.connected / redis.connected — Contract: API reports healthy and each dependency.

---

## auth.routes.test.ts

**What it tests:** POST /api/auth/callback: 200 when UserService (mocked) succeeds; non-200 when payload invalid (e.g. missing id).  
**Type:** Integration (route level; UserService mocked).

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Route passes wrong args to service; validation removed and empty body returns 200. | Service actually writing to DB (that's auth.integration.test); Clerk tokens. |

- Mock Redis (same as health). mockFindOrCreate and jest.mock user.service — Control what findOrCreateByClerkId returns; mock before importing app.
- mockFindOrCreate.mockResolvedValue(...) — Success test: route returns 200 and right body when service returns this.
- expect(mockFindOrCreate).toHaveBeenCalledWith(userData.id, { firstName, lastName, imageUrl }) — Route passes correct args.
- Invalid data: send only { firstName: 'Test' }, expect status not 200.

---

## user.routes.test.ts

**What it tests:** GET /api/users (list excluding current user), GET /api/users/profile, POST /api/users/follow/:id. Status, response shape, and that the right service methods are called.  
**Type:** Integration (route level; Redis, User, UserService, ActivityService, Clerk mocked).

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| GET users includes current user; follow route stops calling logActivity. | Real DB, auth, or activity pipeline; follow relationship in DB. |

- Mocks for Redis, User.findOne, UserService (getAllExcept, getByClerkId, followUser, getUserStats), ActivityService (logActivity), Clerk — So we only test route logic and request/response.
- Clerk mock sets req.auth.userId — Every request looks like same test user so we can assert getAllExcept(followerId).
- GET /api/users: mockGetAllExcept returns two users; expect 200, success, data length 2, and mock called with mockAuthUser.userId.
- GET profile: mockGetByClerkId and mockGetUserStats; expect 200 and body.data._id.
- POST follow: mockGetByClerkId twice (follower, following), mockFollowUser and mockLogActivity resolved; expect 200 and followUser + logActivity called.

---

## song.routes.test.ts, album.routes.test.ts, social.routes.test.ts

Same pattern as health, auth, user: mock Redis and route dependencies, request(app).get/post(...), assert status, body, and mock calls. **Integration at route layer.** Each fails if that route's contract or service calls change. We're not testing full DB or real external services.

---

## Backend service tests

**Locations:** `backend/src/services/__tests__/*.test.ts` and `backend/src/tests/services/*.test.ts`  
**What they test:** One service per file (User, Song, Album, Social, Playlist, Analytics, Redis, Activity, Friend, Mood): methods with real or in-memory DB and mocked deps.  
**Type:** Unit.

| If these tests fail... | We're NOT testing... |
|------------------------|----------------------|
| Method returns wrong value or throws; e.g. findOrCreateByClerkId uses email instead of clerkId. | HTTP layer; route; real Redis or external APIs. |

**Pattern:** beforeEach: new Service(), clearMocks. Mock what the service uses. Test happy path (create, update) and sad path (not found). Assert return value and sometimes DB state (e.g. User.findOne).

---

## Backend setup

- **`backend/src/__tests__/setup.ts`** — Exports connect, close, clear, and Supertest request for in-memory DB. Used by auth, discovery, songs integration tests.
- **`backend/src/tests/setup.ts`** — Jest global setup: MongoMemoryServer in beforeAll, disconnect/stop in afterAll, clear collections in afterEach. Referenced by jest.config setupFilesAfterEnv.
