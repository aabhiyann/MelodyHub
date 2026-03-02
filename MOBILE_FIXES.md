# Mobile Final Pass — Fix Log

Viewport sizes tested: **375px** (iPhone SE), **390px** (iPhone 14), **414px** (iPhone Plus).

---

## 1. Back button: top-left on every sub-page

- **State**: TopBar already shows back button (ChevronLeft) **top-left** for non–root routes (`/home`, `/browse`, `/chat`, `/profile`, `/` are root; all others show back).
- **Fix**: **RadioPage** and **GamificationPage** did not render Topbar, so they had no header or back button on mobile. Added Topbar to both pages (all branches: loading, error, main content) so back appears on sub-routes.

---

## 2. Bottom nav: always visible, never overlapped

- **State**: `main#main-content` uses `pb-32` (128px) on mobile; BottomTabBar is `fixed bottom-0`, `z-[100]`, `h-14` + safe-area padding.
- **Fix**: No layout changes needed. Confirmed main keeps `pb-32 md:pb-0`; no child overrides that would overlap the nav.

---

## 3. Music player mini bar: above bottom nav

- **State**: Mini bar used fixed `bottom-[72px]`. On devices with `env(safe-area-inset-bottom)` (e.g. 34px), bottom nav height ≈ 90px, so the mini bar could sit behind the nav.
- **Fix**: Introduced CSS variable `--mobile-mini-player-bottom: calc(3.5rem + env(safe-area-inset-bottom, 0px) + 8px)` in `index.css`. AudioPlayer mini bar now uses `bottom-[var(--mobile-mini-player-bottom)]` on mobile so it always sits above the bottom nav with an 8px gap.

---

## 4. Text: no overflow or cut-off

- **ProfileHeader**: Username line: added `truncate max-w-full` to `@username`.
- **PlaylistPage**: Playlist title `h1`: added `truncate max-w-full`.
- **AlbumPage**: Album title `h1`: added `truncate max-w-full`; artist span: added `truncate`; container: `min-w-0 flex-1` and parent flex row: `min-w-0 overflow-hidden`.
- **ArtistPage**: Artist name `h1`: added `truncate max-w-full`; container: `min-w-0` on flex parent and title wrapper.

---

## 5. Buttons and tap targets: minimum 44×44px

- **Button (icon size)**: In `button.tsx`, `size="icon"` changed from `size-10` (40px) to `size-11 min-w-11 min-h-11` (44px).
- **AudioPlayer mini bar**: Play/Pause and Next buttons: added `min-w-11 min-h-11` and `flex items-center justify-center`.
- **BottomTabBar**: Already uses `min-w-[56px] min-h-[44px]` on tab links.

---

## 6. Modals and popups: mobile-sized

- **Dialog (base)**: `DialogContent` now has `max-h-[90dvh]`, `overflow-y-auto`, and `touch-scroll` so all dialogs are constrained and scroll with momentum on small viewports.
- **AIPlaylistModal**: Container `max-h-[90vh]` → `max-h-[90dvh] sm:max-h-[90vh]`; inner scroll div: `overflow-x-hidden` and `touch-scroll`.
- **ShortcutsModal**: Modal container: `max-h-[90dvh] flex flex-col`; content area: `flex-1 min-h-0 overflow-y-auto overflow-x-hidden touch-scroll` (replacing fixed `max-h-[70vh]`).
- CreateEditPlaylistModal, AddToPlaylistDialog, EditProfileModal, etc. use the base Dialog and inherit the new max-height and scroll behavior.

---

## 7. Momentum scrolling

- **Utility**: Added `.touch-scroll { -webkit-overflow-scrolling: touch; }` in `index.css`.
- **Applied to**: `main#main-content` (SidebarLayout), ChatPage conversation area, LibraryPage scroll container, TopBar sheet sidebar (mobile menu), CreateEditPlaylistModal inner scroll divs, AIPlaylistModal content, ShortcutsModal content, and base DialogContent.

---

## 8. No horizontal scroll (except intentional)

- **Main**: `main#main-content` now has `overflow-x-hidden` so content cannot cause horizontal scroll.
- **Scroll containers**: Added `overflow-x-hidden` where `overflow-y-auto` is used (ChatPage, LibraryPage, TopBar sheet, CreateEditPlaylistModal, AIPlaylistModal).
- **AlbumPage**: Flex row for cover + info: `min-w-0 overflow-hidden` to avoid overflow from long titles.
- Intentional horizontal scroll (home rows, profile tabs, etc.) unchanged.

---

## 9. Music player expanded view: full-screen on mobile

- **Content container**: `max-w-lg` → `max-w-full md:max-w-2xl` and added `min-w-0` so layout uses full width on small viewports.
- **Touch targets**: Close handle wrapper: `min-h-11`; close button: `min-w-11 min-h-11 flex items-center justify-center`. Tab buttons: `min-w-11 min-h-11` and `flex items-center justify-center`. Like button: `min-w-11 min-h-11`, `flex items-center justify-center`, `shrink-0`. Volume mute/max buttons: `min-w-11 min-h-11 flex items-center justify-center`. Devices button: `min-w-11 min-h-11` and aria-label.
- FullScreenPlayer already uses `fixed inset-0`, `height: 100dvh`, and slide-up animation; no further full-screen changes.

---

## Files changed (summary)

| Area            | Files |
|-----------------|--------|
| Mini bar        | `frontend/src/index.css`, `frontend/src/components/features/player/AudioPlayer.tsx` |
| Back button     | `frontend/src/pages/RadioPage.tsx`, `frontend/src/pages/GamificationPage.tsx` |
| Tap targets     | `frontend/src/components/ui/button.tsx`, `frontend/src/components/features/player/AudioPlayer.tsx`, `frontend/src/components/features/player/FullScreenPlayer.tsx` |
| Momentum/overflow | `frontend/src/index.css`, `frontend/src/components/layout/navigation/SidebarLayout.tsx`, `frontend/src/pages/ChatPage.tsx`, `frontend/src/pages/LibraryPage.tsx`, `frontend/src/components/layout/TopBar.tsx`, `frontend/src/components/features/playlist/CreateEditPlaylistModal.tsx` |
| Text overflow   | `frontend/src/components/profile/ProfileHeader.tsx`, `frontend/src/pages/PlaylistPage.tsx`, `frontend/src/pages/AlbumPage.tsx`, `frontend/src/pages/ArtistPage.tsx` |
| Modals          | `frontend/src/components/ui/dialog.tsx`, `frontend/src/components/features/ai/AIPlaylistModal.tsx`, `frontend/src/components/accessibility/ShortcutsModal.tsx` |
| Expanded player | `frontend/src/components/features/player/FullScreenPlayer.tsx` |
