# Frontend test files (detail)

Back to [hub](TEST_FILES_README.md).

---

## Common patterns

- **Vitest setup (setup.ts):** jest-dom matchers (toBeInTheDocument, toHaveClass, etc.), afterEach(cleanup), and mocks for matchMedia, HTMLMediaElement, IntersectionObserver, ResizeObserver so component tests run in jsdom without real browsers or media.
- **Mock axios / stores:** Store and integration tests mock the API and sometimes other stores so we don't hit a real server; we control responses and assert state and that the right endpoints were called.
- **Render + getByRole + expect:** Component tests render with React Testing Library, find elements by role and accessible name, and assert DOM or state. That matches how users and assistive tech find things.

---

## setup.ts

**What it tests:** Nothing. It's test setup: runs before all frontend unit tests and configures the environment and mocks so tests run in jsdom.  
**Type:** N/A (configuration).

| If this "catches" something... | We're NOT testing... |
|--------------------------------|----------------------|
| Prevents false failures (e.g. "matchMedia is not defined") if we removed it. | The app; we're making the environment testable. |

### Line-by-line (when you need detail)

- expect.extend(matchers) and @testing-library/jest-dom — So we can use toBeInTheDocument(), toHaveClass(), toBeVisible().
- afterEach(cleanup) — RTL cleanup removes the component from the DOM after each test.
- Mock window.matchMedia — jsdom doesn't have it; we provide a fake so responsive components don't throw.
- Mock HTMLMediaElement play, pause, volume — So player code doesn't try to run real media.
- Mock IntersectionObserver and ResizeObserver — jsdom doesn't implement them; minimal implementations so components don't crash.

---

## AuthStore.test.ts

**What it tests:** AuthStore (Zustand): initial state, setAuthUser (set/clear), checkAdminStatus (success, non-admin, API error, loading), reset.  
**Type:** Unit (axios mocked).

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Admin check URL changed; on error store doesn't set error; reset doesn't clear isAdmin. | Real API; UI that uses the store; Clerk. |

### Line-by-line (when you need detail)

- vi.mock('@/lib/axios') — checkAdminStatus calls the API; we control the response.
- beforeEach: setState to initial, clearMocks — Clean store and mocks per test.
- Initial state test — Asserts default values (catches new field not initialized).
- setAuthUser: set user then null — Tests setter and clear path.
- checkAdminStatus: mock get with admin true/false or rejection; assert isAdmin, isLoading, error, and URL called — Happy path and error handling; assert '/admin/check' so endpoint changes are caught.
- "Loading state during check" — Mock reads store mid-call to assert isLoading was true during request.
- reset: set non-default state, call reset(), assert all initial — Logout/reset clears store.

---

## NotificationStore.test.ts

**What it tests:** NotificationStore: initial state, fetchNotifications (success and error), markAsRead (optimistic update and API call). Axios and ChatStore (socket) mocked.  
**Type:** Unit.

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Notifications endpoint URL changed; on fetch error isLoading not cleared. | Real WebSocket; real API; UI; permissions. |

- Mock axios and ChatStore; beforeEach sets initial state and fake socket.
- fetchNotifications success: mock get returns notifications and unreadCount; assert state and request URL.
- fetchNotifications error: mock rejection, spy console.error; assert loading false and error handled.
- markAsRead: set items with one unread, mock put; assert state updated optimistically and put called (optimistic UI).

---

## Button.test.tsx

**What it tests:** Button renders, shows text, and has default class (e.g. inline-flex).  
**Type:** Unit (component).

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Button changed to div (getByRole('button') throws); default class removed. | onClick; disabled; other variants; keyboard/screen reader. |

- render(<Button>Click me</Button>); screen.getByRole('button', { name: /click me/i }) — Find by role and name (accessibility).
- expect(button).toBeInTheDocument(); expect(button).toHaveClass('inline-flex').

---

## Input.test.tsx

**What it tests:** Input: placeholder, default type, custom class, hasError (aria-invalid and shake animation), ref forwarding.  
**Type:** Unit (component).

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| hasError but no aria-invalid; ref on wrapper instead of input. | Typing; validation; form submit; full motion. |

- Mock framer-motion so we don't run real animations.
- Renders correctly: placeholder and default type.
- Applies custom classes: className and base class on element.
- hasError: expect aria-invalid="true" (accessibility).
- Shake on error: fake timers, rerender with hasError, assert shake class then gone after duration.
- Forwards refs: ref.current is the input element.

---

## UserFlow.test.tsx

**What it tests:** User flows: Browse → genre → songs → play; Search → type → results → play; Profile → user and stats. With mocked stores and API, the right store methods are called.  
**Type:** Integration (multiple components + routing + mocks).

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| BrowsePage doesn't call setCurrentSong on song click; SearchPage doesn't show results; ProfilePage doesn't show stats. | Real API/auth; Add to Queue (skipped); keyboard/screen reader. |

### Line-by-line (when you need detail)

- Mocks: MusicStore, PlayerStore, AuthStore, axios, useAnnouncement, grid hooks, CategoryCard, SongRow, Clerk — So we test flow without real API or auth.
- beforeEach: mock stores return songs/albums, setCurrentSong/setQueue, signed-in user — Same starting state per test.
- "Browse -> Play": MemoryRouter /browse, click genre "Pop", find "Test Song 1", click; assert mockSetCurrentSong(mockSongs[0]).
- "Search -> Play": /search, type in search input, findBy "Test Song 1", click; assert setCurrentSong called.
- "Profile": mock axios.get for profile and analytics; render ProfilePage; assert "Test User", "150", "12" (Total Plays, Liked Songs).
- One test it.skip: "Search -> Add to Queue" — Feature may be missing or in context menu; gap documented.

---

## auth.spec.ts

**What it tests:** Guest sees landing (h1 and CTA like Get Started/Login); sign-in button exists and is clickable (no real OAuth).  
**Type:** E2E.

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| CTA or sign-in button removed or renamed. | Full login with real Clerk; every edge case; mobile layout. |

- page.goto('/'); expect h1 visible; getByRole('button', { name: /get started|login|sign up/i }).
- getByRole('button', { name: /sign in|login/i }); if visible expect enabled.

---

## home.spec.ts

**What it tests:** Home loads; title contains MelodyHub; "Home" visible; Home link visible.  
**Type:** E2E.

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Title changed; Home link or text removed. | Full navigation; logged-in home. |

- page.goto('/'); expect title /MelodyHub/; expect "Home" visible; getByRole('link', { name: 'Home' }) visible.

---

## player.spec.ts

**What it tests:** If a song card exists, click play and check player bar (footer or fixed bottom) appears.  
**Type:** E2E.

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Player bar moved (e.g. to sidebar); selector no longer finds it. | Full play flow; real audio. |

- beforeEach goto '/'. Find song card (data-testid or .group); if visible click play button; expect footer or .fixed.bottom-0 visible.

---

## playlist.spec.ts

**What it tests:** Navigate to Library; library page has main area; create playlist button or empty-state message present.  
**Type:** E2E.

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Library link removed; library route broken/blank. | Creating playlist; adding songs; permissions. |

- beforeEach goto '/'. "can navigate to library": getByRole link library|playlists, click, expect URL /library or /playlists.
- "playlist or library section visible": goto /library, expect main visible.
- "create or empty state": look for create button or "no playlists"/"create your first"; assertion loose (hasCreate || hasEmpty || true).

---

## chat.spec.ts

**What it tests:** Navigate to Chat; chat page/section visible; message input or message list visible.  
**Type:** E2E.

| If this test fails... | We're NOT testing... |
|----------------------|----------------------|
| Chat route removed; chat page blank (no input/list). | Sending messages; real-time; WebSocket; permissions. |

- beforeEach goto '/'. "can navigate to chat": link chat|messages, click, URL /chat.
- "chat page visible": goto /chat, expect main or chat container (timeout 10s).
- "input or message list": getByRole textbox or message list; use .catch so missing elements don't throw; assert one visible or allow true.

---

## a11y.test.tsx

**What it tests:** Provides helper testA11y(component) that renders and runs Axe (WCAG 2.1) for violations (labels, contrast, region, etc.). Exports hasAccessibleName and other helpers. Other tests call testA11y to assert no violations.  
**Type:** Unit / accessibility.

| If this "catches" something... | We're NOT testing... |
|--------------------------------|----------------------|
| Button with no name; contrast fails WCAG AA (when color-contrast enabled). | Screen reader flow; keyboard-only; every page (coverage depends on where testA11y is used). |

- configureAxe: enable region, bypass, color-contrast, label, link-name, button-name; disable document-title and html-has-lang for fragments.
- beforeEach: document.lang and document.title so Axe doesn't complain on fragments.
- testA11y(component): render, run axe(container), expect no violations.
- hasAccessibleName and helpers: targeted checks without full Axe.

---

## Other stores

ChatStore, SocialStore, PlaylistStore, MusicStore, PlayerStore, UIStore, AnalyticsStore, AccessibilityStore, GamificationStore: same pattern as AuthStore and NotificationStore. Unit tests, mock axios and deps, test initial state and each action (success/error/loading). They'd fail if the store stops updating state correctly or calls the wrong API. We're not testing the UI or real API.

---

## Other frontend tests

- **Components (Dialog, TopBar, LeftSidebar, VolumeControl, ProgressBar, AudioPlayer, AddToPlaylistDialog, etc.):** Same as Button and Input — render, user events, assert DOM or state. Unit/component. Fail if contract breaks (e.g. no label, onClick not called). Not testing full integration with real stores or media.
- **Pages (SearchPage, BrowsePage):** Often tested via UserFlow or mocks. Fail if page stops rendering key content or calling right handlers. Not always testing every state (empty, error, loading).
- **Utils (performance.test.ts, imageOptimizer.test.ts), lib/utils.test.ts:** Unit tests for pure functions or small modules. Fail if logic or return value changes.
- **Hooks (useInfiniteScroll, useCardReveal, useGridNavigation):** Unit tests with renderHook or tiny test component; trigger events, assert state or callbacks. Fail if hook returns wrong values or doesn't react to input.
