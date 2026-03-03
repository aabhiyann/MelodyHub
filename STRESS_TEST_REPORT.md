# MelodyHub — Stress / Chaos Test Report
*Tester: Chaos QA Agent*
*Date: 2026-03-02 | Build: Post-fix deployment (main)*

> **Objective:** Break MelodyHub under real-world chaotic usage. Test rapid interaction, URL manipulation, bad input, network failure, multitasking, tiny viewports, history abuse, and session edge cases.

---

## Scenario 1: The Impatient User
*Rapid clicks, spam, double-triggering — does anything break, duplicate, or freeze?*

| Test | Result | Finding |
|------|--------|---------|
| Play button spam (10× rapid clicks) | ✅ PASSED | Player toggles correctly throughout. No audio desync. No duplicate audio streams. Button state stays accurate. |
| Like button spam (15× rapid clicks) | ✅ PASSED | Like state toggles back and forth correctly. No visual glitch. Backend likely debounced. |
| Chat message spam (8 messages rapid-fire) | ⚠️ PARTIAL | Messages were typed but send behavior was inconsistent — some messages went through, others may have been dropped. No visible error. No feedback on failure. |
| Play/Pause spam (10× in 2 seconds) | ✅ PASSED | State sync maintained throughout. Audio pauses and resumes correctly each time. No freeze. |
| Double-click "New Playlist" button | ✅ PASSED | Only one modal opened. No duplicate playlist created. |

**SCENARIO VERDICT: PARTIAL**

**Issue:** Chat send button shows no feedback when a message fails silently. Users wouldn't know if messages dropped.

---

## Scenario 2: The Explorer (URL Manipulation)

| URL Tested | Expected | Actual | Result |
|-----------|----------|--------|--------|
| `/profile/invalid-user-id-12345` | Friendly 404 or "user not found" | Infinite blank gray skeleton screen with no content or error message | ❌ FAILED |
| `/profile/abc` | Redirect or error | Same — infinite skeleton | ❌ FAILED |
| `/playlist/fake-playlist-id` | Error or 404 | Infinite skeleton — no content, no feedback | ❌ FAILED |
| `/playlist/000000000000000000000000` | Error state | Same blank skeleton | ❌ FAILED |
| `/admin` | Redirect to `/home` or 403 | Renders blank skeleton — no redirect, no access denied | ❌ FAILED |
| `/dashboard` | 404 page | Blank skeleton (not even the branded 404) | ❌ FAILED |
| `/nonexistent-page-xyz` | Branded 404 page | Blank skeleton screen instead of the custom 404 | ❌ FAILED |
| `/home?debug=true&admin=true` | Normal home page (params ignored) | Normal home page — query params safely ignored | ✅ PASSED |
| `/../../../etc/passwd` | Redirect/block | URL normalized by Vercel/browser before reaching app | ✅ PASSED |

**SCENARIO VERDICT: FAILED**

**Critical Issue:** The app has a single "blank skeleton of death" fallback for ALL error conditions — invalid IDs, missing pages, and unauthorized routes. A real user hitting any of these URLs would see a spinning skeleton forever with no way to navigate out.

---

## Scenario 3: The Messy Typer

*Input tested in: Search bar, Playlist name, Playlist description, Profile bio, Chat message input*

| Payload | Result | Notes |
|---------|--------|-------|
| Special chars: `!@#$%^&*()_+-=[]{}` | ✅ PASSED | Accepted in all inputs. No crash. No visual glitch. |
| 200+ character string (AAAA…) | ✅ PASSED | Accepted. No crash. Long text truncated visually in display but stored completely. |
| Emojis: `🎵🎸🎤🎧🎼🎹🎺` | ✅ PASSED | Emojis render correctly in all fields including chat. |
| HTML injection: `<b>bold</b><script>alert('xss')</script>` | ✅ PASSED | **No XSS rendered.** Text is escaped and displayed as raw string. React's JSX escaping is working. `<script>` did NOT execute. |
| SQL injection style: `'; DROP TABLE songs; --` | ✅ PASSED | Treated as plain text. No backend errors observed. |

**SCENARIO VERDICT: PASSED**

**Note:** XSS protection is solid. React's default escaping handles all injection attempts. No raw HTML rendered anywhere.

---

## Scenario 4: Network Simulation

### Slow 3G

| Page | Skeleton Loaders? | Eventually Loads? | Notes |
|------|--------------------|-------------------|-------|
| Home | ✅ Yes — music cards skeleton visible | ✅ Yes | Acceptable. Feels slow but functional. |
| Search | ✅ Yes | ✅ Yes | Brief "No results" flash before results appear — jarring |
| Community | ✅ Yes | ✅ Yes | Activity panel loads late |
| Library | ⚠️ Partial | ⚠️ Partial | Content area shows skeleton but some cards never resolve |
| Profile | ✅ Yes | ✅ Yes | Profile photo loads last; layout shift occurs |

### Offline

| Action | Result |
|--------|--------|
| Navigate to Home | Blank page — no offline indicator, no friendly message |
| Play a song | Song fails silently — no error toast, player shows paused |
| Open Chat | Chat messages don't load — spinner, no error |
| Navigate between pages | Sidebar links still clickable but lead to blank content |

**SCENARIO VERDICT: PARTIAL**

**Issue:** No offline detection or offline-first UX. The app goes blank silently without telling the user they've lost connection. No service worker offline fallback is activated (or if registered, it isn't handling navigation requests).

---

## Scenario 5: The Multitasker

*Music playing throughout navigation — does state persist?*

| Step | Music Still Playing? | Player Visible? | State Lost? |
|------|---------------------|-----------------|-------------|
| Start song on Home | ✅ Playing | ✅ Visible | — |
| Navigate to Chat | ✅ Playing | ✅ Visible | No |
| Send message in Chat | ✅ Playing | ✅ Visible | No |
| Navigate to Profile | ✅ Playing | ✅ Visible | No |
| Navigate back to Home | ✅ Playing | ✅ Visible | No |
| Navigate to Search + type query | ⚠️ Paused unexpectedly once | ✅ Visible | Music state lost momentarily |
| Navigate to Library | ✅ Playing | ✅ Visible | No |

**SCENARIO VERDICT: PARTIAL**

**Issue:** Music paused unexpectedly once during navigation to Search while a query was active. Could not reproduce consistently. May be a race condition between navigation and the search debounce timer. Queue persistence UI ("View Queue" button) shows but clicking it did nothing visible.

---

## Scenario 6: The Old Phone User (320px)

*Smallest common phone viewport — everything must be visible and accessible.*

| Page | Readable? | Accessible? | Issues Found |
|------|-----------|-------------|--------------|
| Home (via bottom nav "Music") | ⚠️ Partial | ⚠️ Partial | Content area loads but playlist cards overflow horizontally |
| Library | ✅ Readable | ⚠️ Partial | Visible but content is severely clipped. Playlist grid overflows right edge. |
| Chat | ✅ Readable | ✅ Yes | Chat works at 320px. Message input accessible. |
| Profile | ⚠️ Partial | ⚠️ Partial | Bio and name visible but edit buttons are tiny (< 44px) |
| Search | ✅ Readable | ✅ Yes | Search input accessible. Results appear. |
| Bottom nav bar | ✅ Full | ✅ Accessible | Only 4 items: Music, Explore, Chat, Profile. Search/Library/Community/My Stats are hidden. |
| Mini player at 320px | ⚠️ Visible | ⚠️ Cramped | Shows song title + basic controls but very tight. Title truncated to ~10 chars. |

**SCENARIO VERDICT: FAILED**

**Critical Issues:**
1. **Navigation severely limited at 320px** — Library, Community, My Stats, Settings, Search are not accessible from the bottom bar.
2. **Horizontal overflow in playlists** — cards bleed off right edge with no horizontal scroll.
3. At 390px (Pass 2 test) the full content area went completely blank. At 320px Library was at least partially visible, suggesting 390px has a specific breakpoint regression (worse than 320px in some cases).

---

## Scenario 7: The Back Button Abuser

*Navigate 5+ pages deep then spam Back. Does history work?*

| Back Press | Page After | Content Loaded? | URL Correct? |
|-----------|-----------|-----------------|-------------|
| Home → Search → Library → Profile → Community → Chat | Starting chain | ✅ | ✅ |
| Back ×1 (Community) | Community page | ✅ Loaded | ✅ |
| Back ×2 (Profile) | Profile page | ⚠️ Brief blank flash then loaded | ✅ |
| Back ×3 (Library) | Library page | ⚠️ Black flash, then loaded | ✅ |
| Back ×4 (Search) | Search page | ✅ Loaded | ✅ |
| Back ×5 (Home) | Home page | ✅ Loaded | ✅ |
| Forward ×3 | Correct forward pages | ✅ Loaded | ✅ |
| Chat → Back → Chat again | Chat page | ✅ Messages still present | ✅ |
| Playlist → Back → Same Playlist | Playlist page | ✅ Content re-fetched correctly | ✅ |

**SCENARIO VERDICT: PASSED**

**Minor Issue:** Some back navigations trigger a brief black flash (same as the navigation loading issue from Pass 2), but content always resolves correctly. History is intact throughout. No broken states encountered.

---

## Scenario 8: Session Tester

| Test | Expected | Actual | Result |
|------|----------|--------|--------|
| Logged in → navigate to `/sign-up` | Redirect back to `/home` | ✅ Correctly redirected to home | ✅ PASSED |
| Clear `localStorage` via DevTools → navigate to `/home` | Force re-auth or redirect to landing | ⚠️ Clerk re-authenticates via its own cookie; user stays logged in | ✅ PASSED (secure — Clerk uses HttpOnly cookies, not localStorage) |
| Clear `sessionStorage` | Nothing breaks | ✅ App unaffected | ✅ PASSED |
| Sign out via UI button | Redirect to landing page `/` | ✅ Correctly redirected to landing page | ✅ PASSED |
| After sign-out, navigate to `/home` | Redirect to sign-in or landing | ✅ Correctly blocked, redirected to landing | ✅ PASSED |

**SCENARIO VERDICT: PASSED**

**Note:** Clerk's session management is robust. `localStorage` clearing doesn't break auth because Clerk stores session tokens in HttpOnly cookies (inaccessible to JS). This is actually a security strength.

---

## 🚨 Bug Summary — All Scenarios

| Severity | Bug | Scenario |
|----------|-----|----------|
| 🔴 CRITICAL | Invalid route URLs (bad profile/playlist IDs, `/admin`, `/dashboard`, non-existent pages) all produce an infinite blank skeleton screen with no error, no 404 page, no navigation out | Scenario 2 |
| 🔴 CRITICAL | No offline detection — app goes completely silent when network drops. No toast, no message, no service worker fallback | Scenario 4 |
| 🟠 HIGH | Mobile navigation at 320px hides Search, Library, Community, My Stats, Settings entirely — users can only reach 4 pages via bottom nav | Scenario 6 |
| 🟠 HIGH | Horizontal overflow of playlist grid at 320px — cards bleed off right edge | Scenario 6 |
| 🟡 MEDIUM | Music paused unexpectedly once during Search navigation — intermittent/unconfirmed race condition | Scenario 5 |
| 🟡 MEDIUM | Chat send button gives no feedback when a message fails silently during spam | Scenario 1 |
| 🟡 MEDIUM | Search results flash "No results" before actual results appear even under normal conditions | Scenario 4 |
| 🟢 LOW | Brief black flash on back-navigation (same issue as sidebar navigation) | Scenario 7 |
| 🟢 LOW | "View Queue" button in player bar clickable but appears to do nothing visually | Scenario 5 |

---

## Scenario Verdict Summary

| Scenario | Verdict | Key Issue |
|----------|---------|-----------|
| 1: Impatient User | ⚠️ PARTIAL | Chat send feedback missing |
| 2: Explorer (URL Manipulation) | ❌ FAILED | No error boundaries — blank skeleton forever |
| 3: Messy Typer | ✅ PASSED | XSS safe, all inputs handle bad data |
| 4: Network Simulation | ⚠️ PARTIAL | No offline state |
| 5: Multitasker | ⚠️ PARTIAL | Intermittent music pause; queue UI dead |
| 6: Old Phone (320px) | ❌ FAILED | Navigation hidden; horizontal overflow |
| 7: Back Button Abuser | ✅ PASSED | History correct throughout |
| 8: Session Tester | ✅ PASSED | Clerk session management is robust |

---

## 🎬 Browser Session Recordings

- ![Stress Test — Scenarios 1–4](/Users/abhiyansainju/.gemini/antigravity/brain/ab8589fd-adce-48c2-8eef-79dfff0277bb/stress_test_scenarios_1_to_4_1772506346600.webp)
- ![Stress Test — Scenarios 5–8](/Users/abhiyansainju/.gemini/antigravity/brain/ab8589fd-adce-48c2-8eef-79dfff0277bb/stress_test_scenarios_5_to_8_1772507097715.webp)

---

*Report generated by Chaos QA Agent — 2026-03-02 · MelodyHub v1.0 pre-launch*
