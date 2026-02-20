# Every Test File Explained (Beginner-Friendly)

**Easier-to-read split:** For a scannable hub, index with links, and shorter detail files, see [TEST_FILES_README.md](TEST_FILES_README.md). One-page cheat sheet: [TEST_FILES_CHEATSHEET.md](TEST_FILES_CHEATSHEET.md). This file is the full single-doc reference.

---

Use this doc to explain any test file in an interview. For each file we answer:

1. **What is this file testing?** (plain English)
2. **What type of testing?** (unit, integration, smoke, regression, E2E)
3. **Line-by-line walkthrough** and **why** we wrote it that way
4. **What would fail** if this test catches a bug (real example)
5. **What we're NOT testing** that we probably should be

---

## Index: Every test file at a glance

| File | What it tests (one line) | Type |
|------|---------------------------|------|
| **Backend – integration** | | |
| `backend/src/__tests__/auth.integration.test.ts` | Login callback creates/updates user in DB and handles bad input | Integration |
| `backend/src/__tests__/discovery.integration.test.ts` | Discovery endpoints (daily mix, trending, featured) with auth and seeded data | Integration |
| `backend/src/__tests__/songs.integration.test.ts` | Songs API returns correct list from in-memory DB | Integration |
| `backend/src/__tests__/integration.test.ts` | Live server: featured, trending, health, cache, api-docs (skipped in CI) | Integration / Smoke |
| `backend/src/__tests__/sanity.test.ts` | Test runner works (trivial pass) | Smoke |
| `backend/src/__tests__/load.test.ts` | Placeholder so Jest finds tests (no real load) | Smoke |
| `backend/src/__tests__/recommendation.test.ts` | Recommendation service: content-based, collaborative, hybrid, preference learning | Unit |
| `backend/src/__tests__/unit/vector.test.ts` | Vector math: magnitude, dot product, cosine similarity | Unit |
| `backend/src/__tests__/activity.service.test.ts` | Activity service (logging events) | Unit |
| **Backend – routes** | | |
| `backend/src/routes/__tests__/health.routes.test.ts` | GET /api/health returns 200 and healthy status (Redis mocked) | Integration |
| `backend/src/routes/__tests__/auth.routes.test.ts` | POST /api/auth/callback calls UserService and returns 200/400 (service mocked) | Integration |
| `backend/src/routes/__tests__/user.routes.test.ts` | GET users, GET profile, POST follow; service calls and response shape | Integration |
| `backend/src/routes/__tests__/song.routes.test.ts` | Song routes (list, get, etc.) with mocks | Integration |
| `backend/src/routes/__tests__/album.routes.test.ts` | Album routes with mocks | Integration |
| `backend/src/routes/__tests__/social.routes.test.ts` | Social routes with mocks | Integration |
| **Backend – services** | | |
| `backend/src/services/__tests__/*.test.ts` | Each service (user, song, album, social, playlist, analytics, redis, activity) in isolation | Unit |
| `backend/src/tests/services/*.test.ts` | Same services in alternate folder (user, song, album, social, playlist, friend, mood) | Unit |
| **Backend – setup** | | |
| `backend/src/__tests__/setup.ts` | Exports connect/close/clear + Supertest request for in-memory DB integration tests | Config |
| `backend/src/tests/setup.ts` | Jest global setup: MongoMemoryServer beforeAll/afterAll/afterEach clear | Config |
| **Frontend – setup** | | |
| `frontend/src/tests/setup.ts` | Vitest: jest-dom, cleanup, mocks for matchMedia, HTMLMediaElement, Observers | Config |
| **Frontend – stores** | | |
| `frontend/src/__tests__/stores/AuthStore.test.ts` | Auth store: set user, checkAdminStatus, reset (axios mocked) | Unit |
| `frontend/src/stores/__tests__/NotificationStore.test.ts` | Notification store: fetch, markAsRead (axios + ChatStore mocked) | Unit |
| Other store tests (Chat, Social, Playlist, Music, Player, UI, Analytics, Accessibility, Gamification) | Same pattern: state and actions with mocked API | Unit |
| **Frontend – components** | | |
| `frontend/src/__tests__/Button.test.tsx` | Button renders and has default class | Unit |
| `frontend/src/components/ui/__tests__/Input.test.tsx` | Input: placeholder, classes, hasError, ref, shake animation | Unit |
| Other component tests (Dialog, TopBar, LeftSidebar, VolumeControl, ProgressBar, AudioPlayer, AddToPlaylistDialog, etc.) | Render and behavior with user events | Unit |
| **Frontend – pages & integration** | | |
| `frontend/src/__tests__/integration/UserFlow.test.tsx` | Browse→Play, Search→Play, Profile with mocked stores/API | Integration |
| `frontend/src/pages/__tests__/SearchPage.test.tsx`, `BrowsePage.test.tsx` | Page render and key elements | Unit / Integration |
| **Frontend – E2E** | | |
| `frontend/e2e/auth.spec.ts` | Guest sees landing; sign-in button exists and is clickable | E2E |
| `frontend/e2e/home.spec.ts` | Home loads, title MelodyHub, Home link visible | E2E |
| `frontend/e2e/player.spec.ts` | Song card click shows player bar | E2E |
| `frontend/e2e/playlist.spec.ts` | Navigate to library, main visible, create/empty state | E2E |
| `frontend/e2e/chat.spec.ts` | Navigate to chat, main/chat area and input or message list | E2E |
| **Frontend – a11y & utils** | | |
| `frontend/src/tests/a11y.test.tsx` | Helpers + axe config for WCAG (testA11y, hasAccessibleName, etc.) | Unit / a11y |
| `frontend/src/utils/__tests__/performance.test.ts`, `imageOptimizer.test.ts` | Util functions (performance, image) | Unit |
| `frontend/src/lib/__tests__/utils.test.ts` | Lib utils | Unit |
| `frontend/src/hooks/__tests__/*.test.ts` | useInfiniteScroll, useCardReveal, useGridNavigation | Unit |

---

## How to talk about it in an interview

- Don’t memorize. Use: “This file is testing [X]. We use [unit/integration/E2E] so that [reason]. The important part is [one or two lines] because [why]. If it failed, it would mean [real scenario]. One gap is we don’t test [gap].”
- Keep it short unless they ask for detail; then use the line-by-line section.

---

# Backend tests

---

## 1. `backend/src/__tests__/auth.integration.test.ts`

### 1. What is this file testing?

Whether the “login callback” API (what runs after a user signs in with Clerk) correctly **creates a new user** in the database the first time, **updates** them if they already exist, and how it behaves when we send **bad or missing data**.

### 2. What type of testing?

**Integration.** We hit the real HTTP endpoint and use a real (in-memory) database. We’re testing the path from HTTP → route → service → database together.

### 3. Line-by-line (and why we wrote it that way)

- **`import { request, connect, close, clear } from './setup.js'`**  
  We use our own helpers instead of starting a real server. `request` is Supertest (sends HTTP to our app). `connect`/`close`/`clear` control an in-memory MongoDB so tests don’t touch a real DB and don’t depend on each other.

- **`beforeAll(async () => { await connect(); })`**  
  Once before any test we start the in-memory DB and connect the app to it. If we didn’t, every request would fail with “no database.”

- **`afterAll(async () => { await close(); })`**  
  After all tests we disconnect and stop the in-memory DB so the process can exit cleanly.

- **`beforeEach(async () => { await clear(); })`**  
  Before **each** test we wipe all collections. So “create user” and “update existing user” don’t share data; each test sees a clean DB. That’s why we do it in `beforeEach` instead of once.

- **`const mockUser = { id: 'clerk_12345', firstName: 'Test', ... }`**  
  We fake the payload that Clerk would send. We use fixed IDs and names so we can assert exactly what we expect in the DB.

- **`const res = await request.post('/api/auth/callback').send(mockUser)`**  
  We send a real POST request to our app. We’re testing the full path: route → validation → service → DB.

- **`expect(res.status).toBe(200)` and `expect(res.body.success).toBe(true)`**  
  We check the API contract: success means 200 and `success: true`. If someone changes the API to return 201 or a different shape, this fails.

- **`const user = await User.findOne({ clerkId: mockUser.id })`**  
  We look in the database to make sure the user was actually saved (or updated). That way we’re not only testing “it returned 200” but “the right data ended up in the DB.”

- **Update test: create existing user with `User.create`, then send callback with new name/image**  
  We’re testing the “already have this user” path. We need data in the DB first, so we create it, then send the same `clerkId` with new details and assert the document was updated.

- **Missing-fields test: send only `imageUrl`**  
  We’re testing bad input. The comment says we accept either 400 or 200 depending on product choice; the test is there so we don’t silently change that behavior.

### 4. What would fail if this test catches a bug?

- **Example:** A dev changes the callback to write to a different collection or to use `email` as the key instead of `clerkId`. The “create new user” test would still get 200, but `User.findOne({ clerkId: mockUser.id })` would be `null` → test fails and we catch that the user wasn’t actually created as expected.

- **Another example:** Someone “fixes” validation and starts requiring a new field. The “missing required fields” test might start failing with 400, which is good—we’d then decide in the product if that’s desired and update the test or the API.

### 5. What we're NOT testing

- We’re not testing real Clerk (no real OAuth). We’re not testing rate limiting, auth middleware on other routes, or what happens if the DB is down (that would be different tests). We also don’t test every invalid field combination, only a representative “missing fields” case.

---

## 2. `backend/src/__tests__/discovery.integration.test.ts`

### 1. What is this file testing?

Discovery endpoints: **daily mix** (personalized), **trending**, and **featured**. It checks that unauthenticated requests get 401 where required, and that with the right data in the DB we get 200 and the expected list shape.

### 2. What type of testing?

**Integration.** Real HTTP + in-memory DB; we seed songs and user preferences and then call the discovery API.

### 3. Line-by-line (and why)

- **Same `connect` / `close` / `clear` pattern**  
  Same as auth: one in-memory DB for the whole suite, cleared per test so tests don’t leak data.

- **“should return 401 if unauthenticated” for daily-mix**  
  Daily mix is per-user, so we require auth. We call the endpoint with no auth header and expect 401. We do this so nobody can accidentally make that endpoint public.

- **“should return daily mix songs for authenticated user”**  
  We create a Song and a UserPreference (liked song, favorite genre), then call the endpoint with `x-test-user-id` (or whatever header the app uses to simulate the user). We expect 200 and a non-empty list. We seed data so the recommendation logic has something to work with.

- **Trending / featured**  
  We create songs (e.g. with `isTrending: true` or high play count), then GET the trending/featured endpoints and assert status and that the right songs appear. We’re testing “with this DB state, the API returns this.”

### 4. What would fail if this test catches a bug?

- **Example:** Someone changes the daily-mix route to skip the auth middleware. The “401 if unauthenticated” test would fail (we’d get 200), and we’d catch the security regression.

- **Example:** The trending query is changed to sort by something other than play count or trend flag. The test that expects “Trending Song” first would fail and we’d fix the query or the test.

### 5. What we're NOT testing

- We’re not testing the quality of recommendations (e.g. “is this the best song for this user”). We’re not testing pagination, rate limits, or real auth tokens. We’re also not covering every discovery variant, just the main flows.

---

## 3. `backend/src/__tests__/songs.integration.test.ts`

### 1. What is this file testing?

Songs API: **list songs** (with optional pagination), and any other song endpoints in that file. It checks that when we put songs and albums in the DB and call the API, we get the right status and body shape.

### 2. What type of testing?

**Integration.** Real app + in-memory DB; we seed albums/songs and hit GET (and possibly other) endpoints.

### 3. Line-by-line (and why)

- **`beforeAll` / `afterAll` / `beforeEach` with connect/close/clear**  
  Same idea as auth and discovery: isolated in-memory DB per test.

- **Create Album, then Song.create([...]) with `albumId`**  
  Songs can belong to an album. We create the album first so `albumId` is valid. We do it in the test so the test is self-contained and doesn’t depend on seed scripts.

- **`request.get('/api/songs').set('x-test-user-id', ...)`**  
  If the app uses a header to know “current user” (e.g. in test), we set it so the request is valid.

- **Parsing `res.body` for `data` (array vs nested)**  
  The comment in the file says the API might return `{ data: [...] }` or `{ data: { data: [...] } }`. The test handles both so it doesn’t break when the controller shape changes slightly; we still assert “we got exactly 2 items and the first is Song 1.”

### 4. What would fail if this test catches a bug?

- **Example:** Someone changes GET /api/songs to return only songs the user has liked. Without updating the test, we might get 0 items and the assertion “length 2” fails, so we catch the behavior change.

- **Example:** A bug returns `data` as an object instead of an array. The test’s length check would fail and we’d fix the API or the test.

### 5. What we're NOT testing

- We’re not testing filters (by genre, search), sorting, or permissions in depth. We’re not testing upload or delete. We’re not testing that the response schema matches a strict contract (e.g. OpenAPI); we only check a few fields.

---

## 4. `backend/src/__tests__/integration.test.ts`

### 1. What is this file testing?

A set of **live** checks against a **running** server on port 5001: discovery endpoints (featured, trending, new-releases, made-for-you), health, caching, and API docs. It’s the “does the real server respond correctly?” suite.

### 2. What type of testing?

**Integration / smoke.** It’s integration because it uses the real server; it’s smoke because it’s a quick “is it up and returning something OK?” check. In CI we skip this (no server); locally you can run it when the server is up.

### 3. Line-by-line (and why)

- **`const API_BASE = 'http://localhost:5001/api'`**  
  We’re talking to a real process. We use localhost so we don’t need to deploy.

- **`beforeAll` with `setTimeout(..., 2000)`**  
  Gives the server a couple of seconds to be ready so we don’t get connection refused on the first request.

- **`describeIntegration = process.env.CI ? describe.skip : describe`**  
  In CI there’s no server, so we skip the whole suite. Locally we run it so we can catch “I broke the server” before pushing.

- **Each test: `fetch(API_BASE + '/songs/featured')` then expect 200 and body shape**  
  We’re only checking “endpoint exists and returns 200 and something that looks like success.” We’re not asserting exact content so the test is stable when data changes.

- **Caching test: two GETs to same URL, second might have `_meta.cached`**  
  We’re testing “second request can be cached.” We don’t assert cache every time so the test works with or without Redis.

- **API docs test: try GET /api-docs, accept status < 400 or skip**  
  If the server isn’t up we don’t want to fail the whole run; we allow a graceful skip so the suite is usable.

### 4. What would fail if this test catches a bug?

- **Example:** You change the featured endpoint to require auth and forget to add a test user. The “GET /songs/featured” test would get 401 and fail, so we know the contract changed.

- **Example:** The server crashes on startup. All these tests would fail (connection refused or 500), so we know the app isn’t healthy.

### 5. What we're NOT testing

- We’re not testing exact response content, auth flows, or DB state. We’re not testing under load. We’re not testing that caching is definitely working, only that we can call the endpoint twice.

---

## 5. `backend/src/__tests__/sanity.test.ts`

### 1. What is this file testing?

That the test runner and environment are working: one trivial assertion that always passes.

### 2. What type of testing?

**Smoke.** It’s a sanity check for “can Jest run and execute at least one test?”

### 3. Line-by-line (and why)

- **`expect(true).toBe(true)`**  
  No app logic; we only check that Jest runs and that `expect` works. If this fails, something is wrong with the test setup, not the app.

### 4. What would fail if this test catches a bug?

- It doesn’t catch app bugs. It would “fail” only if the test framework is broken or the file isn’t run (e.g. wrong config). So it’s a canary for “tests are running at all.”

### 5. What we're NOT testing

- Everything about the app. It’s purely a sanity check.

---

## 6. `backend/src/__tests__/load.test.ts`

### 1. What is this file testing?

Nothing about load or performance. It’s a **placeholder**: one trivial test so Jest doesn’t report “no tests found” if someone runs only this file or if the real load tests are removed.

### 2. What type of testing?

**Smoke / placeholder.** Name says “load” but the content is just “test run works.”

### 3. Line-by-line (and why)

- **`expect(true).toBe(true)`**  
  Same idea as sanity: a minimal test so the module is valid and something runs.

### 4. What would fail if this test catches a bug?

- It doesn’t catch app or load bugs. It only ensures the file is a valid test module.

### 5. What we're NOT testing

- Actual load (concurrent users, response times, throughput). Real load testing would use a tool (e.g. k6, Artillery) and different assertions.

---

## 7. `backend/src/__tests__/recommendation.test.ts`

### 1. What is this file testing?

The **recommendation service**: content-based filtering (audio preferences), collaborative filtering (liked songs), hybrid (cold start vs rich data), and preference learning (audio prefs and genre tracking). We check that with given DB state we get arrays, the right algorithm label, and confidence in range 0–1.

### 2. What type of testing?

**Unit** (with a real in-memory DB). We’re testing the recommendation functions in isolation; the DB is just test data, not the real app DB.

### 3. Line-by-line (and why)

- **MongoMemoryServer in beforeAll / afterAll**  
  Recommendation logic reads from UserPreference and Song. We use in-memory Mongo so we control data and don’t touch production.

- **Content-based: “empty for users without audio preferences”**  
  We delete any existing prefs for a test user, call `contentBasedRecommendations(userId, 10)`, and expect an empty array. We’re testing the “no preferences → no recommendations” path.

- **Content-based: “match songs with similar audio features”**  
  We upsert a UserPreference with tempo/energy/danceability/valence, then call the function. We only assert “returns an array”; exact content depends on Song data, so we keep the assertion loose.

- **Collaborative: “empty for users with &lt; 3 liked songs”**  
  We set likedSongs to [] (or fewer than 3) and expect an empty array. That’s the “not enough data for collaborative” rule.

- **Hybrid: “cold start returns popular and algorithm is 'popular'”**  
  New user, no prefs. We expect `result.songs` array, `algorithm === 'popular'`, and low confidence. We’re testing the cold-start branch.

- **Hybrid: “rich data uses hybrid and confidence &gt; 0.5”**  
  We seed liked songs, listening history, audio prefs, genres, artists. We expect an algorithm to be set and confidence &gt; 0.5. We’re testing the “we have enough data” path.

- **“confidence between 0 and 1”**  
  We don’t care which algorithm; we only check the contract “confidence is a number in [0, 1].”

- **updateUserAudioPreferences / updateUserFavorites**  
  We seed listening history (and songs with features/genre), call the update function, then fetch the preference doc and assert that `audioPreferences` or `favoriteGenres` was set. We’re testing “learning” logic.

### 4. What would fail if this test catches a bug?

- **Example:** Someone changes cold start to return “random” instead of “popular.” The test that expects `algorithm === 'popular'` would fail.

- **Example:** A bug sets confidence to 1.5. The “confidence between 0 and 1” test would fail.

- **Example:** Collaborative filtering is changed to require 5 likes instead of 3. The test with 0 likes would still pass, but a test that expected results with 3 likes might fail.

### 5. What we're NOT testing

- We’re not testing that recommendations are “good” (e.g. relevance). We’re not testing performance with large data sets. We’re not testing the HTTP layer or auth; only the service functions.

---

## 8. `backend/src/__tests__/unit/vector.test.ts`

### 1. What is this file testing?

**Vector math** used for recommendations or search: magnitude, dot product, and cosine similarity. We check correct results and error cases (e.g. mismatched lengths).

### 2. What type of testing?

**Unit.** Pure functions; no DB, no HTTP. Fast and deterministic.

### 3. Line-by-line (and why)

- **`magnitude([3, 4])` → 5**  
  Classic 3-4-5 triangle; easy to verify by hand so we know the implementation is right.

- **`dotProduct([1, 2], [3, 4])` → 11**  
  1*3 + 2*4 = 11. We use small integers so we can do the math in our head.

- **`expect(() => dotProduct([1], [1, 2])).toThrow()`**  
  We’re testing that invalid input (different lengths) throws instead of returning a wrong number. That’s a contract: “caller must pass same-length vectors.”

- **cosineSimilarity: 1 for identical, 0 for orthogonal, -1 for opposite, 0 for zero vector**  
  These are standard math cases. We use them so a refactor (e.g. different formula) can’t break the math without failing tests.

- **`toBeCloseTo(0.7071)`**  
  Floating point; we use toBeCloseTo so we don’t fail on tiny rounding differences.

### 4. What would fail if this test catches a bug?

- **Example:** Someone rewrites cosine similarity and swaps two operands. The “identical vectors → 1” or “orthogonal → 0” test would fail.

- **Example:** Magnitude is implemented as sum of components instead of sqrt(sum of squares). The 3-4-5 test would fail (would get 7 instead of 5).

### 5. What we're NOT testing

- We’re not testing with huge vectors or numerical stability. We’re not testing the code that *calls* these functions (e.g. recommendation pipeline).

---

## 9. `backend/src/__tests__/activity.service.test.ts`

### 1. What is this file testing?

The **activity service** (e.g. logging plays, likes, follows). Exact behavior depends on the file; typically we’d test that calling the service methods results in the right DB writes or calls.

### 2. What type of testing?

**Unit** (service in isolation, with mocks or in-memory DB as needed).

### 3–5. (Summary)

- Same idea as other service tests: we call methods, mock or seed dependencies, and assert outcomes. If the service stops writing the right events or starts throwing, these tests fail. We’re usually not testing the HTTP route that calls the service, or the exact format of analytics downstream.

---

## 10. `backend/src/routes/__tests__/health.routes.test.ts`

### 1. What is this file testing?

The **health endpoint**: GET /api/health returns 200 and a body that says the app and its dependencies (e.g. MongoDB, Redis) are healthy.

### 2. What type of testing?

**Integration** at the route level. We use the real Express app but **mock Redis** (and sometimes DB) so we don’t need a real Redis server in CI.

### 3. Line-by-line (and why)

- **`jest.mock('redis', () => { ... })`**  
  The app tries to create a Redis client when it loads. If we don’t mock it, the test would try to connect to real Redis and fail in CI. We replace it with a fake that has `connect`, `on('connect', cb)`, etc., so the app thinks Redis is there.

- **`beforeAll`: import redisService and call `connect()`**  
  Our mock’s `on('connect', cb)` calls `cb()`, so the service marks itself as connected. We do this so when the health handler checks “is Redis connected?” it gets true.

- **`request(app).get('/api/health')`**  
  We hit the app’s HTTP stack (middleware, route, handler) but we don’t start a real server. Supertest does that for us.

- **`expect(response.body).toHaveProperty('status', 'healthy')` and services.mongodb.connected / redis.connected**  
  We’re testing the contract: the API says “healthy” and reports each dependency. If someone removes the health check or changes the shape, this fails.

### 4. What would fail if this test catches a bug?

- **Example:** The health route is changed to return 503 when Redis is down, but the mock still reports connected. We’d still get 200; if we later add a “Redis down” test we’d catch that. For the current test, a bug would be “health returns 500” or “status is missing” → test fails.

- **Example:** Someone renames `status` to `state`. The assertion on `status` would fail.

### 5. What we're NOT testing

- We’re not testing real Redis or real MongoDB connectivity. We’re not testing timeouts or retries. We’re testing “with mocks that say connected, the route returns 200 and the expected shape.”

---

## 11. `backend/src/routes/__tests__/auth.routes.test.ts`

### 1. What is this file testing?

The **auth callback route**: POST /api/auth/callback receives Clerk-style payload and returns 200 when the **user service** (mocked) does its job, and returns non-200 when the payload is invalid (e.g. missing id).

### 2. What type of testing?

**Integration** at the route level. We use the real app and real route/middleware but **mock UserService** so we don’t touch the real DB. We’re testing “does the route call the service correctly and return the right status?”

### 3. Line-by-line (and why)

- **`jest.mock('redis', ...)`**  
  Same as health: app needs a Redis client; we fake it so the app boots in tests.

- **`mockFindOrCreate = jest.fn()` and jest.mock('../../services/user.service.js', ...)**  
  We don’t want to create real users in the DB. We mock UserService and control what `findOrCreateByClerkId` returns. We mock before importing the app so the app gets our fake.

- **`mockFindOrCreate.mockResolvedValue({ clerkId, fullName, imageUrl })`**  
  For the “success” test we say: when the route calls the service, it gets this object back. We’re testing that the route returns 200 and the right body when the service succeeds.

- **`expect(mockFindOrCreate).toHaveBeenCalledWith(userData.id, { firstName, lastName, imageUrl })`**  
  We’re testing that the route passes the right arguments to the service (Clerk id and the fields we send). If someone changes the mapping (e.g. wrong field names), this fails.

- **Invalid data test: send only `{ firstName: 'Test' }`**  
  We expect status not 200 (400 or 500). We’re testing that bad input doesn’t get treated as success.

### 4. What would fail if this test catches a bug?

- **Example:** Someone changes the route to pass `email` instead of `imageUrl` to the service. The “toHaveBeenCalledWith” would fail and we’d see the wrong argument.

- **Example:** Validation is removed and the route accepts empty body. The “invalid data” test would still get 200 and fail.

### 5. What we're NOT testing

- We’re not testing that the service actually writes to the DB (that’s auth.integration.test). We’re not testing Clerk tokens or middleware in depth. We’re testing the route + mock only.

---

## 12. `backend/src/routes/__tests__/user.routes.test.ts`

### 1. What is this file testing?

User routes: **GET /api/users** (list excluding current user), **GET /api/users/profile** (current user profile), **POST /api/users/follow/:id** (follow a user and log activity). We check status, response shape, and that the right service methods are called with the right arguments.

### 2. What type of testing?

**Integration** (route level). We mock Redis, User model, UserService, ActivityService, and Clerk so we only test the route logic and request/response.

### 3. Line-by-line (and why)

- **Mocks for Redis, User.findOne, UserService (getAllExcept, getByClerkId, followUser, getUserStats), ActivityService (logActivity), Clerk**  
  We want to test “when the route runs, it calls these services and returns this response.” We don’t want real DB, real auth, or real Redis. So we mock everything the route depends on and set up return values per test.

- **`mockAuthUser` and Clerk mock that set `req.auth.userId`**  
  The routes need “current user.” We fake Clerk so every request looks like it’s from the same test user. That way we can assert “getAllExcept was called with this userId.”

- **GET /api/users: mockGetAllExcept returns two users, then we expect 200, success, data length 2, and mockGetAllExcept called with mockAuthUser.userId**  
  We’re testing “list users” returns the service result and that the service was called with the current user id (so we’re not returning the current user in the list).

- **GET /api/users/profile: mockGetByClerkId and mockGetUserStats return values, expect 200 and body.data._id**  
  We’re testing that the profile route calls the right methods and returns the user and stats. The console.log in the file is for debugging when the route returns 500 (e.g. missing protectRoute).

- **POST follow: mockGetByClerkId twice (follower and following), mockFollowUser and mockLogActivity resolved, then expect 200 and that followUser and logActivity were called**  
  We’re testing that follow does two lookups (who is following, who is being followed), calls followUser with the right IDs, and logs activity. If someone removes the activity log, the “toHaveBeenCalled” on logActivity would fail.

### 4. What would fail if this test catches a bug?

- **Example:** Someone changes GET /api/users to include the current user. The test expects “data length 2” and “getAllExcept(followerId)”; if the route started calling a different method or including the current user, the assertion would fail.

- **Example:** Follow route stops calling logActivity. The test that expects `mockLogActivity` to have been called would fail.

### 5. What we're NOT testing

- Real DB, real auth, or real activity pipeline. We’re not testing “after follow, the follow relationship is in the DB” (that would be an integration test with a real or in-memory DB).

---

## 13. Other backend route tests (`song.routes.test.ts`, `album.routes.test.ts`, `social.routes.test.ts`)

Same pattern as health and auth and user: mock Redis and any services/models the route needs, `request(app).get/post(...)`, then assert status and body and that mocks were called correctly. They’re **integration tests at the route layer**. Each one would fail if that route’s contract or service calls change. We’re not testing full DB or real external services.

---

## 14. Backend service tests (`backend/src/services/__tests__/*.test.ts` and `backend/src/tests/services/*.test.ts`)

### 1. What are they testing?

Each file tests one **service** (e.g. UserService, SongService, AlbumService, SocialService, PlaylistService, AnalyticsService, RedisService, ActivityService, FriendService, MoodService): its methods with real or in-memory DB and mocked dependencies (e.g. Redis, other services).

### 2. What type of testing?

**Unit** (service as the unit; DB might be real in-memory).

### 3. Pattern

- **`beforeEach`: new Service(), clearMocks**  
  Fresh instance and mocks so tests don’t affect each other.

- **Mock what the service uses** (e.g. redisService.get/set, other services) so we only test this service’s logic.

- **Test “happy path” and “sad path”**  
  e.g. “create user when not exists,” “update when exists,” “return null when not found.” We call the method and assert return value and sometimes DB state (e.g. User.findOne).

### 4. What would fail if these tests catch a bug?

- **Example (UserService):** findOrCreateByClerkId is changed to use email as unique key. Tests that expect creation/update by clerkId would fail (wrong user or duplicate).

- **Example (any service):** A method starts throwing or returning the wrong shape; the test’s expect would fail.

### 5. What we're NOT testing

- We’re not testing the HTTP layer or the route that calls the service. We’re not testing the real Redis or real external APIs; we mock those.

---

# Frontend tests

---

## 15. `frontend/src/tests/setup.ts` (Vitest setup)

### 1. What is this file testing?

Nothing. It’s **test setup**: it runs once before all frontend unit tests and configures the environment and mocks so tests can run in Node (jsdom) without real browsers or real APIs.

### 2. What type of testing?

N/A (configuration for unit/integration tests).

### 3. Line-by-line (and why)

- **`expect.extend(matchers)` and `@testing-library/jest-dom`**  
  So we can use things like `toBeInTheDocument()`, `toHaveClass()`, `toBeVisible()` in assertions. Without this, only basic Jest/Vitest matchers exist.

- **`afterEach(cleanup)`**  
  React Testing Library’s cleanup removes the component from the DOM after each test so the next test doesn’t see the previous one’s DOM.

- **Mock `window.matchMedia`**  
  Many components use `matchMedia` (e.g. for responsive behavior). In jsdom it doesn’t exist. We provide a fake that returns an object with `matches`, `addListener`, etc., so components don’t throw when they call it.

- **Mock `HTMLMediaElement.prototype.play`, `pause`, `volume`**  
  Audio/video elements call these; in tests we don’t want real media. We replace them with no-op or resolved promises so the player code doesn’t break.

- **Mock `IntersectionObserver` and `ResizeObserver`**  
  Components use these for “when this is visible” or layout. jsdom doesn’t implement them. We add minimal implementations so components that use them don’t crash.

### 4. What would fail if this “catches” something?

- It doesn’t catch app bugs. If we removed the setup, many component tests would fail with “matchMedia is not defined” or “ResizeObserver is not a constructor.” So the setup prevents false failures.

### 5. What we're NOT testing

- We’re not testing the app; we’re making the environment testable.

---

## 16. `frontend/src/__tests__/stores/AuthStore.test.ts`

### 1. What is this file testing?

The **AuthStore** (Zustand): initial state, setting/clearing the auth user, **checkAdminStatus** (success, non-admin, API error, generic error, loading state), and **reset**. We’re testing that the store updates its state correctly when we call its actions and when the API returns different results.

### 2. What type of testing?

**Unit.** We test the store in isolation and **mock axios** so no real HTTP calls happen.

### 3. Line-by-line (and why)

- **`vi.mock('@/lib/axios', () => ({ axiosInstance: { get: vi.fn() } }))`**  
  checkAdminStatus calls the API. We mock axios so we control the response and don’t hit a real server.

- **`beforeEach`: setState to initial (authUser null, isAdmin false, etc.) and clearMocks**  
  Every test starts from a clean store and clean mocks so tests don’t depend on order.

- **“Initial state” test**  
  We just read the store and assert default values. If someone adds a new field and forgets to initialize it, this can catch “undefined” or wrong default.

- **setAuthUser: set a user object, then assert getState().authUser equals it; then set null and assert null**  
  We’re testing the setter and the “clear user” path. We do both so we know the store doesn’t only “set” but also “clear.”

- **checkAdminStatus success: mock get to resolve { data: { admin: true } }, call checkAdminStatus, then expect isAdmin true, isLoading false, error null, and get called with '/admin/check'**  
  We’re testing the happy path: API says admin → store reflects it and loading/error are cleared. We also assert the URL so if someone changes the endpoint we know.

- **checkAdminStatus non-admin and errors**  
  We mock different responses (admin: false, 401, network error) and assert that isAdmin stays false and error message is set correctly. We’re testing that the store handles failure and doesn’t leave loading true or show wrong error.

- **“Loading state during check”**  
  We mock the API to read the store mid-call and check that isLoading was true during the request. We’re testing that the store sets loading before the request and clears it after.

- **reset: set all state to non-default, call reset(), assert everything is back to initial**  
  So we know “logout” or “reset” really clears the store.

### 4. What would fail if this test catches a bug?

- **Example:** Someone changes the admin check URL to `/admin/status`. The “toHaveBeenCalledWith('/admin/check')” would fail.

- **Example:** On API error the store doesn’t set `error`. The “handle check admin error” test would fail because we expect `state.error` to be 'Unauthorized'.

- **Example:** reset() doesn’t clear isAdmin. The reset test would fail.

### 5. What we're NOT testing

- We’re not testing the real API or the UI that uses the store. We’re not testing Clerk or cookies. We’re only testing the store’s state and actions with a mocked API.

---

## 17. `frontend/src/__tests__/Button.test.tsx`

### 1. What is this file testing?

The **Button** component: it renders, shows the right text, and has the expected default CSS class (e.g. `inline-flex`). We’re testing “does the button render and look like our design system?”

### 2. What type of testing?

**Unit** (component test). We render the component in isolation with React Testing Library.

### 3. Line-by-line (and why)

- **`render(<Button>Click me</Button>)`**  
  We mount the component in a fake DOM (jsdom) so we can query it. We don’t need a real browser.

- **`screen.getByRole('button', { name: /click me/i })`**  
  We find the button by role and accessible name. That’s how users and assistive tech find it, so if this fails the button might be inaccessible or not show the right text.

- **`expect(button).toBeInTheDocument()`**  
  Basic “it’s there” check. toBeInTheDocument comes from jest-dom (see setup).

- **Second test: `expect(button).toHaveClass('inline-flex')`**  
  We’re testing that the default styling (Tailwind class) is applied. If someone changes the default variant and removes that class, this fails.

### 4. What would fail if this test catches a bug?

- **Example:** The Button is changed to render a `<div>` instead of `<button>`. getByRole('button') would throw (no button), so we’d catch the accessibility regression.

- **Example:** Default variant is changed and no longer uses `inline-flex`. The class assertion would fail.

### 5. What we're NOT testing

- We’re not testing onClick, disabled state, or other variants. We’re not testing keyboard or screen readers. We’re testing basic render and one default class.

---

## 18. `frontend/src/components/ui/__tests__/Input.test.tsx`

### 1. What is this file testing?

The **Input** component: render with placeholder, default type, custom class, **hasError** (aria-invalid and shake animation), and ref forwarding.

### 2. What type of testing?

**Unit** (component).

### 3. Line-by-line (and why)

- **Mock framer-motion**  
  Input might use motion for animations. We replace it with a plain element so we don’t need to run real animations and so the test is fast and deterministic.

- **“renders correctly”**  
  Placeholder and default type (no type attribute). We’re testing basic render.

- **“applies custom classes”**  
  We pass className and check it’s on the element along with the base class (e.g. border-input). So we know custom styling is merged correctly.

- **“handles hasError prop”**  
  We set hasError=true and expect aria-invalid="true". We’re testing both visual/behavior (error state) and accessibility (screen readers get the invalid state).

- **“triggers shake animation logic on error”**  
  We use fake timers, render without error then with hasError, and check that a shake class appears and then disappears after the animation duration. We’re testing that the error state triggers the animation logic; we mocked motion so we only assert class names and timing.

- **“forwards refs”**  
  We pass a ref and expect ref.current to be the input element. So we know parent components can focus or measure the input.

### 4. What would fail if this test catches a bug?

- **Example:** hasError is implemented but someone forgets to set aria-invalid. The “handles hasError prop” test would fail.

- **Example:** Ref is attached to a wrapper div instead of the input. The “forwards refs” test would fail (ref.current might be the div or null).

### 5. What we're NOT testing

- We’re not testing typing, validation, or form submission. We’re not testing the full motion animation; we only test that the error state and timing logic run.

---

## 19. `frontend/src/stores/__tests__/NotificationStore.test.ts`

### 1. What is this file testing?

The **NotificationStore**: initial state, **fetchNotifications** (success and error), **markAsRead** (optimistic update and API call), and any other actions in that file. We mock axios and ChatStore (for socket) so we only test the store logic.

### 2. What type of testing?

**Unit** (store in isolation).

### 3. Line-by-line (and why)

- **Mock axios and ChatStore**  
  fetchNotifications and markAsRead call the API; the store might use socket from ChatStore. We mock both so we control responses and don’t need a real server or socket.

- **beforeEach: setState to initial (items [], unreadCount 0) and set ChatStore.getState to return { socket: mockSocket }**  
  Clean state and a fake socket so tests don’t depend on global state.

- **fetchNotifications success: mock get to return notifications and unreadCount, call fetchNotifications, then assert state.items, unreadCount, and the request URL**  
  We’re testing that the store updates from the API response and that it calls the right endpoint (e.g. with query params).

- **fetchNotifications error: mock rejection, spy on console.error, call fetchNotifications, assert loading false and console.error called**  
  We’re testing that the store doesn’t crash and clears loading; we allow it to log so we assert that it at least tried to handle the error.

- **markAsRead: set initial items with one unread, mock put, call markAsRead, assert state updated optimistically and put was called**  
  We’re testing optimistic UI: the UI updates before the API responds, and we do call the API. If someone removes the API call or the optimistic update, this fails.

### 4. What would fail if this test catches a bug?

- **Example:** The notifications endpoint URL changes. The “toHaveBeenCalledWith('/notifications?...')” would fail.

- **Example:** On fetch error the store leaves isLoading true. The “handles fetch error” test would fail.

### 5. What we're NOT testing

- Real WebSocket events, real API, or the UI that shows notifications. We’re not testing permissions or pagination in depth.

---

## 20. `frontend/src/__tests__/integration/UserFlow.test.tsx`

### 1. What is this file testing?

**User flows** across pages: **Browse → pick genre → see songs → play a song**; **Search → type query → see results → play a song**; **Profile → see user and stats**. We’re testing that when we render these pages with mocked stores and API, the user can perform the main actions and the right store methods are called.

### 2. What type of testing?

**Integration** (multiple components + routing + mocked stores/API). It’s not full E2E (no real browser or server), but it tests flows that cross components and routes.

### 3. Line-by-line (and why)

- **Mocks for MusicStore, PlayerStore, AuthStore, axios, useAnnouncement, grid hooks, CategoryCard, SongRow, Clerk**  
  We want to test “user goes to Browse, clicks genre, sees songs, clicks song → play.” We don’t want real API or real auth, so we mock stores and API and Clerk. We mock heavy or external pieces (Clerk, grid, CategoryCard, SongRow) so the test stays fast and stable.

- **beforeEach: set useMusicStore to return mock songs/albums, usePlayerStore with setCurrentSong/setQueue mocks, useAuthStore with a user, useUser (Clerk) with signed-in user**  
  Every test gets the same “logged-in user with songs and albums” so we can focus on the flow.

- **“Browse -> Play”**  
  Render BrowsePage under MemoryRouter at /browse. Find “Start browsing,” click genre “Pop,” find “Test Song 1,” click it. Then assert mockSetCurrentSong was called with the first mock song. We’re testing that the click actually triggers the play action with the right song.

- **“Search -> Play”**  
  Render SearchPage at /search. Find search input, type “Test,” wait for “Test Song 1” to appear (findBy with timeout), click it. Assert setCurrentSong called with that song. We’re testing search result rendering and play-from-search.

- **“Profile”**  
  Mock axios.get for profile and analytics URLs to return user and stats. Render ProfilePage for a user. Assert “Test User” and “150” / “12” (Total Plays, Liked Songs) appear. We’re testing that the profile page shows the data the API would return.

- **One test is it.skip**  
  “Search -> Add to Queue” is skipped because that feature might not be implemented or might be in a context menu we’re not testing. So we document the gap without failing the suite.

### 4. What would fail if this test catches a bug?

- **Example:** Someone changes BrowsePage so clicking a song doesn’t call setCurrentSong. The “Browse -> Play” test would fail on the last expect.

- **Example:** SearchPage stops showing results for “Test.” The findBy would time out and the test would fail.

- **Example:** ProfilePage stops rendering “Total Plays” or the number. The getByText for “150” or “12” would fail.

### 5. What we're NOT testing

- Real API, real auth, or real navigation to a deployed app. We’re not testing “Add to Queue” (skipped). We’re not testing keyboard-only or screen reader flows.

---

## 21. E2E tests (`frontend/e2e/auth.spec.ts`, `home.spec.ts`, `player.spec.ts`, `playlist.spec.ts`, `chat.spec.ts`)

### 1. What are they testing?

- **auth.spec.ts:** A guest can see the landing page (e.g. h1 and a CTA like “Get Started”/“Login”); and that a sign-in button exists and is clickable (we don’t complete real OAuth in E2E).
- **home.spec.ts:** Home page loads (title contains “MelodyHub”, “Home” visible); a “Home” link is visible (basic navigation).
- **player.spec.ts:** From the home page, if a song card exists we try to click play and check that a player bar (footer or fixed bottom) appears.
- **playlist.spec.ts** and **chat.spec.ts:** Similar: real browser, real app (or dev server), user actions (click, type), and we assert visible content or that something appears.

### 2. What type of testing?

**End-to-end (E2E).** Real browser (Playwright), real (or dev) server, real DOM. We’re testing “from the user’s perspective.”

### 3. Line-by-line (and why)

- **`test('...', async ({ page }) => { ... })`**  
  Playwright gives us a `page` (browser tab). We use it to goto, click, and assert. We write tests like a user would use the app.

- **`await page.goto('/')`**  
  We open the app at the root. baseURL is set in playwright.config (e.g. localhost:5173) so we don’t hardcode the host.

- **`await expect(page.locator('h1').first()).toBeVisible()`**  
  We check that something that should be on the landing page is there. We use “visible” so we’re not just checking it’s in the DOM but that it’s shown.

- **`page.getByRole('button', { name: /sign in|login/i })`**  
  We find the button by role and name so we’re testing something close to how assistive tech and users find it. If the button is removed or renamed, this fails.

- **player.spec: if song card exists, click play, then expect footer/player bar visible**  
  We’re testing “user can trigger play and see the player.” We use conditional (if card exists) so the test doesn’t fail when the app has no songs; in a full E2E env you might seed data or mock.

### 4. What would fail if these tests catch a bug?

- **Example:** Someone removes the “Get Started” button from the landing page. The auth spec would fail when looking for the CTA.

- **Example:** The home page title is changed to “Music App.” The home spec that expects title to match /MelodyHub/ would fail.

- **Example:** The player bar is moved from footer to a sidebar. The selector “footer, .fixed.bottom-0” might not find it and the player test would fail.

### 5. What we're NOT testing

- We’re not testing full login with real Clerk (that would need test accounts and secrets). We’re not testing every edge case; we’re testing critical paths. We’re not testing mobile layout in depth unless we add viewport or device tests.

---

## 22. `frontend/e2e/playlist.spec.ts`

### 1. What is this file testing?

That a user can **navigate to Library** (or playlists), that the library page has a main area, and that either a “create playlist” button or an empty-state message is present. We’re testing the playlist/library surface exists and is usable.

### 2. What type of testing?

**E2E.** Real browser, real app.

### 3. Line-by-line (and why)

- **beforeEach: goto '/'**  
  Start from home so navigation tests are realistic.

- **“can navigate to library”**  
  Find a link with name “library” or “playlists,” click it, then expect URL to match /library or /playlists. We use getByRole so we’re testing what the user sees and clicks.

- **“playlist or library section is visible”**  
  Go straight to /library and expect a main area. We’re testing the page loads and has structure.

- **“create playlist button or empty state visible”**  
  We look for a create button or “no playlists” / “create your first” text. The assertion `hasCreate || hasEmpty || true` is loose so the test doesn’t fail if the UI copy changes slightly; we’re mainly checking the page isn’t broken.

### 4. What would fail if this test catches a bug?

- **Example:** The Library link is removed from the nav. The “can navigate to library” test would fail (no link found or URL doesn’t change).

- **Example:** The library route is broken and shows a blank page. The “main visible” or create/empty check could fail.

### 5. What we're NOT testing

- We’re not testing creating a playlist, adding songs, or editing. We’re not testing permissions or multiple users.

---

## 23. `frontend/e2e/chat.spec.ts`

### 1. What is this file testing?

That a user can **navigate to Chat**, that the chat page/section is visible, and that either a message input or a message list is present. We’re testing the chat surface exists.

### 2. What type of testing?

**E2E.**

### 3. Line-by-line (and why)

- **beforeEach: goto '/'**  
  Start from home.

- **“can navigate to chat”**  
  Find link “chat” or “messages,” click, expect URL to contain /chat. Same idea as playlist: test navigation.

- **“chat page or section is visible”**  
  Go to /chat and expect main or chat container within 10s. We give a timeout so slow load doesn’t flake.

- **“chat input or message list visible”**  
  Look for a textbox (message input) or message list (by testid or role). We use .catch(() => false) so missing elements don’t throw; we assert at least one is visible or we allow true so the test is resilient to UI changes.

### 4. What would fail if this test catches a bug?

- **Example:** Chat route is removed or renamed. Navigation or URL assertion would fail.

- **Example:** Chat page renders but with no input and no list (e.g. blank). Depending on assertion, we might catch that.

### 5. What we're NOT testing

- We’re not testing sending messages, real-time updates, or WebSocket. We’re not testing multiple users or permissions.

---

## 24. `frontend/src/tests/a11y.test.tsx`

### 1. What is this file testing?

**Accessibility (a11y)**: it provides a **helper** `testA11y(component)` that renders a component and runs Axe (WCAG 2.1) against it to find violations (e.g. missing labels, contrast, region). It also exports helpers like `hasAccessibleName`. It doesn’t run a full test suite by itself; other tests can call `testA11y(<MyComponent />)` to assert no violations.

### 2. What type of testing?

**Unit / accessibility.** When used, it’s a component test that adds an a11y check.

### 3. Line-by-line (and why)

- **configureAxe with rules (region, bypass, color-contrast, label, link-name, button-name; document-title and html-has-lang off)**  
  We only run rules that make sense for a fragment (we’re not rendering a full document). We care about labels, names, and contrast so we enable those.

- **beforeEach: set document.lang and document.title**  
  So Axe doesn’t complain about missing lang/title when we render a fragment.

- **testA11y(component)**  
  Renders the component, runs Axe on the container, and asserts no violations. Any component that uses this in a test will fail if we introduce an a11y bug (e.g. button with no name).

- **hasAccessibleName and other helpers**  
  Utilities so tests can check “does this element have an accessible name?” without running full Axe. Useful for targeted checks.

### 4. What would fail if this “catches” something?

- **Example:** A new button is added with no text and no aria-label. A test that calls testA11y on the parent would get an Axe violation and fail.

- **Example:** Contrast is changed and fails WCAG AA. If color-contrast is enabled, Axe would report it and the test would fail.

### 5. What we're NOT testing

- We’re not testing screen reader flow or keyboard-only navigation. We’re not testing every page with testA11y unless we add those tests. This file is a toolbox; coverage depends on where testA11y is used.

---

# Other frontend test files (short form)

You can use the same 5-question structure for any other test file:

- **Stores (ChatStore, SocialStore, PlaylistStore, MusicStore, PlayerStore, etc.):** Same as AuthStore and NotificationStore: unit tests, mock axios and other deps, test initial state and each action (success/error/loading). They’d fail if the store stops updating state correctly or calls the wrong API. We’re usually not testing the UI or real API.
- **Components (Dialog, TopBar, LeftSidebar, VolumeControl, ProgressBar, AudioPlayer, AddToPlaylistDialog, etc.):** Same as Button and Input: render, user events (click, type), assert DOM or state. Unit/component tests. They’d fail if the component breaks the contract (e.g. no longer shows a label or no longer calls onClick). We’re often not testing full integration with real stores or real media.
- **Utils (performance.test.ts, imageOptimizer.test.ts, lib/__tests__/utils.test.ts):** Unit tests for pure functions or small modules. They’d fail if the logic or return value changes. We’re not testing the whole app.
- **Hooks (useInfiniteScroll, useCardReveal, useGridNavigation):** Unit tests with renderHook or a tiny test component; we trigger events and assert state or callbacks. They’d fail if the hook returns wrong values or doesn’t react to input. We’re not testing every component that uses the hook.
- **Pages (SearchPage, BrowsePage):** Often tested via integration (like UserFlow) or with mocks. They’d fail if the page stops rendering key content or stops calling the right handlers. We’re not always testing every state (empty, error, loading) on the page.
- **A11y (a11y.test.tsx):** If present, it usually uses jest-axe or similar to check for accessibility violations on a rendered tree. It would fail if someone introduces an accessibility bug (e.g. missing label, bad contrast). We’re not testing full screen reader flows.

---

# Quick reference: test types

- **Unit:** One thing in isolation (function, class, store, component). Fast, mock dependencies. Catches logic bugs and contract breaks.
- **Integration:** Several pieces together (e.g. route + service + DB, or multiple components + routing). Uses real or in-memory DB or mocked external deps. Catches “wrong wire-up” and contract breaks between layers.
- **E2E:** Real browser and server. User flows. Catches “the app doesn’t work when I use it” but slower and flakier. We don’t test every detail here.
- **Smoke:** “Does it run and return something OK?” Minimal assertions. Good for CI to know the app starts and key endpoints respond.

Use this doc to explain any file in your project in an interview: what it tests, why it’s that type, one or two “why we wrote it that way” lines, what would fail if it catches a bug, and what we’re not testing.
