# MelodyHub — Stress Test Report (Pass 2)
**Date:** 2026-03-04 | **Tester:** Chaos QA Agent | **App:** https://melodyhubmusic.vercel.app/

> Second stress test pass, conducted after all CRITICAL and HIGH fixes from the previous sprint. Testing all 8 chaos scenarios against the fully-deployed fixed app.

---

## Summary Table

| Scenario | Rating | Severity of Top Issue |
|----------|--------|-----------------------|
| 1: The Impatient User | ⚠️ PARTIAL | HIGH — player state confusion under rapid spam |
| 2: The Explorer | ❌ FAILED | CRITICAL — /admin accessible to all logged-in users |
| 3: The Messy Typer | ✅ PASSED | — XSS safe, inputs handle long/emoji input correctly |
| 4: Slow Connection | ✅ PASSED | — Graceful degradation with skeletons + offline indicator |
| 5: The Multitasker | ✅ PASSED | — Music persists through in-app navigation |
| 6: The Old Phone (320px) | ❌ FAILED | HIGH — full-screen player black screen on mobile; overflow on genre pills |
| 7: The Back Button Abuser | ⚠️ PARTIAL | MEDIUM — music stops on browser back navigation |
| 8: The Session Tester | ⚠️ PARTIAL | CRITICAL — /admin accessible; session sharing correct |

---

## SCENARIO 1: THE IMPATIENT USER — ⚠️ PARTIAL

### What was tested:
- Double-clicking song cards
- Rapid play/pause (10 times in 2 seconds)
- Rapid sidebar navigation: Home → Search → Library → Community → Chat → Profile
- Like button spam

### Findings:

**Double-click song card:** No duplication — clicking the same song a second time just restarts from beginning. Acceptable behavior. ✅

**Rapid play/pause (10x in 2 seconds):** The player icon toggles but audio briefly stutters. After 10 rapid toggles the button renders in wrong state (shows Pause when audio is actually paused). Recovers after 1–2 seconds. ⚠️  
**Severity: MEDIUM** — transient UI desync, self-correcting.

**Rapid sidebar navigation:** No black screens! ✅ (C1 fix confirmed working under stress). Some pages show skeleton loading briefly when revisited very quickly. Acceptable.

**Like button spam:** Like state toggles correctly on every click — no visual desync or double-likes found. ✅

---

## SCENARIO 2: THE EXPLORER — ❌ FAILED

### URL test results:

| URL | Result | Severity |
|-----|--------|----------|
| `/profile/fakeid12345` | ✅ Shows "User not found" with Go Back button | — |
| `/profile/00000000000000` | ✅ Shows "User not found" with Go Back button | — |
| `/playlist/fakeid12345` | ✅ Shows "Playlist not found" error state | — |
| `/playlist/00000000000000` | ✅ Shows "Playlist not found" error state | — |
| `/chat/nonexistentuser` | ✅ Redirects to /chat without crashing | — |
| `/artists/FakeArtistThatDoesntExist` | ⚠️ Shows empty artist page with blank content, no "not found" error | LOW |
| `/admin` | ❌ **FULL ADMIN DASHBOARD rendered for regular user** | CRITICAL |
| `/dashboard` | ✅ Redirects to /home (route doesn't exist) | — |
| `/api/songs` | ✅ Shows raw JSON or 404 from backend — not a frontend route | — |
| `/settings` | ✅ Loads correctly | — |
| `/quests` | ✅ Loads (neon-purple themed, slightly off-brand) | — |
| `/radio` | ✅ Loads (plain song list — no station UI) | — |
| `/analytics` | ✅ Loads user stats with charts | — |
| `/xyz123abc` | ✅ Shows 404 / redirects to home | — |

### 🚨 CRITICAL BUG: Unprotected /admin Route
**Description:** Navigating to `https://melodyhubmusic.vercel.app/admin` while logged in as a standard (non-admin) user renders the full admin dashboard. The dashboard exposes:
- Platform-wide stream statistics
- User list/management interface  
- System activity logs

**Expected behavior:** Non-admin users should be redirected to `/home` with an "Access Denied" or simply get the standard 404 page.  
**Severity: CRITICAL** — data exposure and privilege escalation.

---

## SCENARIO 3: THE MESSY TYPER — ✅ PASSED

### Input fields tested: Search bar, Chat message input, Playlist name field

### Special characters (`!@#$%^&*()_+-=[]{}|;':",.<>?/~`):
- Search: Accepted, returned "No results" gracefully ✅
- Chat: Sent correctly, rendered as literal text ✅  
- Playlist name: Accepted and saved correctly ✅

### Long text (300+ characters):
- Search: Accepted, debounce works, no overflow ✅
- Chat: Long messages wrap correctly ✅
- Playlist name: Field accepts long text; UI truncates display cleanly ✅

### Emojis (🎵🎸🎤🎧🎹🎺🎻):
- Search: Accepted ✅
- Chat: Renders correctly ✅
- Playlist name: Emojis saved and displayed correctly ✅

### XSS injection (`<script>alert('test')</script>`):
- All inputs: **HTML correctly escaped — no alert() fired** ✅
- Text renders as literal `<script>...` string in all fields
- **No XSS vulnerability detected** ✅

---

## SCENARIO 4: SLOW CONNECTION — ✅ PASSED

### Slow 3G simulation:
- `/home`: Skeleton loaders appear immediately while content loads ✅
- `/browse`: Genre card images load progressively; skeletons visible ✅
- `/search`: Search works with debouncing; slower to return results but functional ✅
- Image fallbacks: Broken images show placeholder SVG ✅
- App remains navigable and usable (just slower) ✅

### Offline simulation:
- Offline banner/toast appears at top of screen ✅
- Previously-loaded pages remain navigable from cache ✅
- Songs that haven't been buffered fail silently (no audio, but no crash) ✅
- App does not white-screen or crash ✅

---

## SCENARIO 5: THE MULTITASKER — ✅ PASSED

### Test sequence: Play song → Chat → Send message → Profile → Home

- Song continues playing through all in-app navigation ✅
- Mini player visible on every page during the sequence ✅
- Chat remains connected (no disconnection messages) ✅
- Navigating back to Home shows the same song in the mini player ✅
- No state loss detected during the sequence ✅

**Note:** Playback does NOT persist across hard browser reloads (Ctrl+R) — this is expected behavior for a client-side SPA where audio state lives in memory.

---

## SCENARIO 6: THE OLD PHONE USER (320px) — ❌ FAILED

### Results by page at 320px:

**Home page:** Page renders but horizontal scroll visible on the sections row. Genre/section pills overflow the right edge with no scroll indicator. ⚠️ **Severity: MEDIUM**

**Search page:** Genre pill filter row overflows — pills at the end are clipped and inaccessible. No horizontal scroll. **Severity: HIGH**  
Artist grid correctly collapses to 1 column (fix from previous sprint working ✅).  
Song rows fit and are readable ✅.

**Library page:** Playlist cards render correctly in 1-column layout ✅. Create Playlist button accessible ✅.

**Community page:** User cards readable, no clipping ✅.

**Profile page:** Header fits, but follow/message buttons are very close to screen edge (borderline touch target) ⚠️.

**Mini player at 320px:** Appears above bottom nav correctly ✅. Controls usable ✅.

**Full-screen player at 320px:** ❌ **BLACK SCREEN** — tapping the mini player to expand results in a completely black screen, same crash seen in Scenario 1. The expanded player does not animate in; the screen goes dark and hangs.  
**Severity: HIGH** — primary music experience feature is broken on mobile viewports.

---

## SCENARIO 7: THE BACK BUTTON ABUSER — ⚠️ PARTIAL

### Navigation path tested:
Home → Browse → Pop genre page → Song plays → Chat → Library → Community → Back×6 → Forward×3

### Back button behavior:
- Browser back button correctly traverses each visited page ✅
- No blank pages or crash states encountered at any step ✅
- Pages re-render correctly when revisited via back ✅
- Rapid back-clicking (1 per second) causes brief skeleton flashes on some pages — acceptable ✅

### Music playback:
- **When hitting browser Back, music STOPS immediately** ⚠️  
  Each browser navigation (back/forward via browser history, not in-app clicks) causes the component tree to partially remount, killing the audio element.  
  In-app navigation (sidebar clicks) correctly preserves music. Only browser history buttons cause this.  
  **Severity: MEDIUM** — real users will encounter this.

### Forward button:
- Forward history works correctly after going back ✅
- Pages re-rendered without issues ✅

---

## SCENARIO 8: THE SESSION TESTER — ⚠️ PARTIAL

### Tab 1 → Tab 2 session sharing:
- Opened second tab: Same user automatically logged in (session shared via cookies/Clerk) ✅
- Both tabs show the same profile/user ✅

### Music player across tabs:
- Audio playback is **isolated per tab** — starting a song in Tab 1 does NOT play in Tab 2 ✅ (expected behavior for browser audio)
- Music player UI state is NOT synced between tabs (Tab 2 shows no mini player even if Tab 1 is playing) ✅ (expected)

### /admin route in Tab 2:
- Navigating to `/admin` in Tab 2 while logged in as standard user: ❌ **Full admin dashboard renders** — same CRITICAL bug as Scenario 2.

### Invalid profile URL:
- `/profile/invalid-xyz789` → ✅ Shows "User not found" with Go Back button correctly.

### Session logout test:
- Could not fully test cross-tab logout (requires two active sessions) — Clerk handles this at the SDK level and is expected to deauth all tabs.

---

## Priority Bug List

| # | Bug | Severity | Scenario | Status |
|---|-----|----------|----------|--------|
| 1 | `/admin` route accessible to all logged-in users — exposes admin dashboard, user data, system stats | 🔴 CRITICAL | 2, 8 | ❌ Open |
| 2 | Full-screen player shows black screen when expanded on mobile/small viewports | 🔴 HIGH | 1, 6 | ❌ Open |
| 3 | Search genre filter pills overflow at 320px — no horizontal scroll | 🟠 HIGH | 6 | ❌ Open |
| 4 | Artist page shows empty content for invalid/non-existent artist name (no "Not Found" state) | 🟠 HIGH | 2 | ❌ Open |
| 5 | Music stops when using browser Back/Forward buttons (history navigation remounts audio) | 🟡 MEDIUM | 7 | ❌ Open |
| 6 | Play/Pause button icon briefly desyncs from actual audio state under rapid clicking | 🟡 MEDIUM | 1 | ❌ Open |
| 7 | Home page section/pill row overflows at 320px — no scroll affordance | 🟡 MEDIUM | 6 | ❌ Open |
| 8 | Profile follow/message buttons at 320px are borderline touch-target size | 🟢 LOW | 6 | ❌ Open |

---

## Technical Notes

- **Clerk keys:** The app appears to be using Clerk development keys in production — this is a configuration risk and should be migrated to production keys before public launch.
- **XSS:** All input fields correctly escape HTML. No injection vulnerabilities found.
- **Audio architecture:** The `<audio>` element lives inside a component rendered within the React tree. Browser history navigation can trigger partial component remounts — audio persistence through browser Back requires either playing audio in a truly global context (outside React router scope) or using the `beforeunload`/`popstate` events to preserve state.
