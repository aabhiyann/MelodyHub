# MelodyHub Design Plan & Design System

**Status:** Active  
**Last updated:** 2026-02-27  
**Purpose:** Single source of truth for UI/UX decisions. All frontend work (chat, player, nav, cards, modals) should align with this plan. No code in this file—design only.

---

## 1. Design Principles

- **Reference apps:** iMessage (chat), Spotify (home, player, hierarchy), Apple Music (glass cards, transitions).
- **Avoid:** Random purple overuse; generic grey bubbles; cramped or overly spread layouts.
- **Consistency:** Same accent, typography, and card patterns across Home, Browse, Profile, Playlist, Chat, and modals.

---

## 2. Color Palette

| Role | Hex | Usage |
|------|-----|--------|
| **Accent (primary)** | `#22C55E` | Primary buttons, active nav, links, play buttons, progress bars, focus states, success. |
| **Accent (darker)** | `#16A34A` | Hover states, secondary accents. |
| **Background (base)** | `#101019` | Modals, cards, elevated surfaces. |
| **Background (page)** | Dark (e.g. `#0a0a0f`, `#18181b`) | Main app background. |
| **Text (primary)** | `#F9FAFB` | Headings, primary copy. |
| **Text (secondary)** | `#9CA3AF` | Descriptions, captions. |
| **Text (muted)** | `#6B7280` | Placeholders, empty states, hints. |
| **Border (subtle)** | `rgba(255,255,255,0.08)` | Sidebar, card borders. |
| **Border (medium)** | `rgba(255,255,255,0.12)` | Inputs, dividers. |

**Rule:** Do not use purple as a primary accent. Use green (`#22C55E`) for actions and highlights.

---

## 3. Typography

- **Headings:** Clear hierarchy; primary text `#F9FAFB`.
- **Body:** Secondary text `#9CA3AF` for descriptions.
- **Captions / timestamps:** Muted `#6B7280` or equivalent; small size.
- **Mobile:** Slightly reduced heading sizes on small viewports (e.g. hero `text-3xl` on mobile, `text-4xl`/`text-5xl` on desktop) for balance.

---

## 4. Component-by-Component

### 4.1 Chat

- **Bubbles:** iMessage-style. Sender (self): accent gradient or solid `#22C55E`; receiver (other): elevated background + subtle border.
- **Layout:** Sender right, receiver left; max width on bubbles for readability.
- **Timestamps:** Caption style; reveal on hover/tap.
- **Typing indicator:** Other-bubble style, muted text, animated three dots.
- **Auto-scroll:** After every sent message; optional “new messages” chip when user scrolls up.

### 4.2 Music Player

- **Mini bar:** Visible only when a song is playing. Progress as thin accent line at top. Album art (small, rounded), title, artist, play/pause, next. Dark, slightly transparent background with blur. Tapping bar (not buttons) expands to full-screen.
- **Expanded player:** Full-screen modal; large album art with shadow/glow; gradient background from album art dominant color (canvas extraction). Full progress bar with current/total time; shuffle, previous, play/pause, next, repeat; like; volume slider. Smooth open/close (e.g. 300ms ease slide up from bottom).

### 4.3 Navigation

- **Mobile:** Bottom bar with 4 items (Music, Explore, Chat, Profile). Background `rgba(0,0,0,0.85)` with `backdrop-filter: blur(20px)`. Always visible; accent for active state. Every sub-page: back button top-left.
- **Web:** Sidebar or top nav aligned with same 4 items. Glassmorphism: e.g. `rgba(16,16,22,0.94)`, `backdrop-filter: blur(24px)`, `border-right: 1px solid rgba(255,255,255,0.08)`. Active page: clear highlight (accent).
- **Logo and spacing:** Consistent everywhere; Spotify-like spacing (not cramped, not too spread).

### 4.4 Cards (Home, Browse, Playlists)

- **Shape:** Rounded corners 12px.
- **Hover (web):** Slight scale up + shadow.
- **Text:** Title `#F9FAFB`, description/secondary `#9CA3AF`.
- **Play button / actions:** Accent `#22C55E`.

### 4.5 Modals & overlays

- **Background:** `#101019` for modal content.
- **Accent:** `#22C55E` for primary actions and progress.
- **Borders:** Subtle; consistent with rest of app.

### 4.6 Notifications

- **Bell:** Top-right (web); accessible on mobile. Unread count badge (red, number).
- **Dropdown:** Friend requests first (accept primary, decline outline); then list of notifications. Each item: optional avatar, message text, relative timestamp, unread indicator (e.g. left border accent). Empty state: “You're all caught up.”

### 4.7 Profile

- **Header:** Large circular avatar; display name, username, bio. Stats row (Followers, Following, Songs, Playlists) with same accent for links/numbers.
- **Tabs:** Activity, Playlists, Liked Songs, Friends—client-side switch, no full-page reload.
- **Edit modal:** Same modal styling (`#101019`, accent `#22C55E`).

### 4.8 Playlist (view & create/edit)

- **View:** Hero with large cover, title, creator, song count, duration, Play All, Shuffle. Song list: track #, art, title, artist, duration, like; hover show play. Owner: reorder and remove. Background: subtle gradient from cover art color.
- **Create/Edit:** Modal or dedicated flow; cover image, name, description, add-songs search; auto-save indicator where applicable.

---

## 5. Mobile vs Web Consistency

- **Same nav items** on mobile bottom bar and web sidebar.
- **Same accent and typography** across breakpoints.
- **Touch targets:** Adequate size on mobile; back button always available on sub-pages.
- **Content padding:** Bottom padding (e.g. `pb-32`) so content clears bottom nav and safe areas.

---

## 6. References in Code

Components reference this plan with comments such as `DESIGN_PLAN: ...`. Key tokens:

- Accent: `#22C55E`, `#16A34A`
- Modal/card bg: `#101019`
- Text: `#F9FAFB`, `#9CA3AF`, `#6B7280`

See also: [CHANGELOG.md](../CHANGELOG.md) (UI/UX entries), [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md), and feature docs in [features/](features/).
