# Changelog

All notable changes to MelodyHub are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Loading states and perceived performance:** Route-level skeleton loaders (no spinners) for all lazy-loaded pages via `RouteSkeleton` with variants (home, browse, profile, library, playlist, search, chat, admin, analytics, generic). Page-level data skeletons for Library (grid + liked list), Profile, Analytics, Gamification, Search results, Followers/Following, Chat friends list, and home ActivityFeed. Placeholder album art asset (`/placeholder-album.svg`) and lazy loading + `onError` fallback for all album/song images (OptimizedImage, MiniPlayer, QueueView, FullScreenPlayer, Library, Search, Browse, etc.). 150ms fade-in page transition (`fadeFast` variant). Button `isLoading` prop with inline spinner; applied to Add Song/Album, Edit Profile, AI Stage prompt/results, Invite collaborators, Create/Edit playlist. Section error boundaries with "Something went wrong" + Retry on Home, Browse, Profile, Library, Playlist, Chat (conversation + friends list); PageErrorBoundary copy aligned. Music player buffering: `isBuffering` in PlayerStore, `waiting`/`canplay`/`canplaythrough` in AudioPlayer, buffering shimmer on main progress bar (InteractiveSlider), mini bar, and FullScreenPlayer; FullScreenPlayer shows buffered region.
- **Documentation:** Central docs index `Docs/README.md`; design system `Docs/DESIGN_PLAN.md` (colors, typography, component rules); feature docs in `Docs/features/` for Chat UI, Music Player, Notifications, AI (Magic), Playlist, Profile, Navigation. Updated `Docs/FRONTEND_ARCHITECTURE.md` with NotificationStore, useAIStore, ChatStore, CreateEditPlaylistModal, useDominantColor. README and CONTRIBUTING now link to design plan and docs index.
- Added `.cursor/rules/git-workflow.mdc` — Cursor rule enforcing branch-per-feature, commit-after-meaningful-change, conventional commit messages, merge-to-main-and-push, and CHANGELOG updates per session.
- Created `Docs/DEBUGGING_GUIDE.md` and `Docs/GOOD_FIRST_ISSUES.md` based on production audit.
- Created `Docs/DEV_LOG_UI_UX_OVERHAUL.md` to chronicle the mobile UI architecture and API troubleshooting.

### Changed
- **Consistency pass:** Aligned colors, typography, and components with `Docs/DESIGN_PLAN.md` across the app. Replaced legacy violet/purple (`#8B5CF6`) with brand accent green (`#22C55E`) in global tokens (design-tokens.css, index.css focus/selection, PWA theme_color), Clerk auth theme, landing (Hero, SocialProof, FeatureSection), Search/Browse genres and genreThemes, Library and PlaylistTab, gamification (GemsIndicator, Leaderboard, GamificationPage tabs), admin/analytics (charts, KPICards, AddSong/AddAlbum dialogs, UsersTable, ActivityFeed), LeftSidebar quick links, PlayButton, toasts (App), main.tsx Clerk variables, VolumeControl fallback, KeyboardShortcutsGuide, home ActivityFeed, Confetti. PlaylistTab and card surfaces use surface-elevated. See `CONSISTENCY_FIXES.md`.
- **Notification system:** Bell in TopBar (top right; accessible on mobile) with unread count badge (red, number). Dropdown: friend requests first with accept/decline inline (no redirect); then notification items. Each notification: optional avatar from metadata, message text, relative timestamp, unread indicator (left border). Empty state: "You're all caught up". Mark all as read; FRIEND_REQUEST items filtered from list (shown only in friend-request block). Real-time: accepting a friend request updates both sides without reload. Backend: FRIEND_REQUEST notification metadata includes senderImageUrl/senderName; socket emits plain object.
- **AI feature (Magic):** Polished AI playlist modal: clear entry points (TopBar "Magic", Home FAB, Sidebar "Magic"); loading state with animated thinking dots and DESIGN_PLAN green bar; single friendly error message for all failures; modal click fix (stopPropagation + z-index); DESIGN_PLAN accent (#22C55E) across prompt, processing, results, mascot, and particles. See `AI_AUDIT.md`.
- **Playlist page and creation flow:** Playlist view: hero with large cover (playlist image or first track), title, creator, song count, total duration, Play All and Shuffle; song list with track #, album art, title, artist, duration, like button; DESIGN_PLAN colors and hover play; owner-only reorder (up/down) and remove per track; background gradient from cover art (useDominantColor). Create/Edit: shared `CreateEditPlaylistModal` with cover image URL, name, description; add-songs search (edit mode); debounced auto-save with "Saving…" / "Saved" (edit); used from Library (Create/Edit) and PlaylistPage "Edit playlist". Backend: `imageUrl` on playlist create/update; DELETE `/social/playlists/:id/songs/:songId`; PUT reorder songs.
- **Profile page:** Polished with Spotify-like header (large circular avatar with edit on hover, display name, optional username, bio), stats row (Followers, Following, Songs, Playlists) with DESIGN_PLAN colors. Tabs for Activity, Playlists, Liked Songs, and Friends with client-side switching and no full-page reload; Playlists tab shows grid of playlist cards (SpotifyCard style); Friends tab shows friends list; Activity and Liked Songs use empty states. Edit profile button and modal restyled to DESIGN_PLAN (bg `#101019`, accent `#22C55E`). When viewing another user: Follow/Unfollow and Message button; Message navigates to Chat and opens conversation with that user when they are in friends list. Mobile: stacked layout with avatar centered at top.
- **Home & Browse (Explore):** Polished to Spotify-style layout: featured hero at top (featured/trending song or empty state), horizontal scrollable rows with section titles and "See all" links (Recently Played, Recommended for You, Trending Now, New Releases, etc.), unified card styling (12px radius, hover scale + shadow), DESIGN_PLAN colors (accent `#22C55E`, text `#F9FAFB`/`#9CA3AF`, no purple overuse). Section skeletons replace spinners; shared empty states for sections with no content. Start browsing / Discover use green accent; Browse page has optional "Trending Now" row and genre/song grid with same card and loading patterns.
- **Music player (mini bar + expanded):** Mini bar shows only when a song is playing; progress as a thin accent line at the top; album art (small, rounded), title, artist, play/pause, next; tap anywhere (except buttons) to expand; dark translucent background with blur. Expanded full-screen player opens with 300ms ease slide-up; large album art with shadow; full progress bar with current/total time; shuffle, previous, play/pause, next, repeat; like button; volume slider; background gradient from album-art dominant color (canvas extraction). Seeking in expanded view syncs to audio via custom event. Mini bar hides gracefully when no song is loaded.
- **Navigation & layout (mobile + web):** Mobile bottom bar now has 4 items (Music, Explore, Chat, Profile) with `rgba(0,0,0,0.85)` background and `backdrop-filter: blur(20px)`; always visible with accent active states. Every sub-page shows a back button top-left on mobile. Web sidebar uses glassmorphism (`rgba(16,16,22,0.94)`, `blur(24px)`, `border-right: 1px solid rgba(255,255,255,0.08)`), primary nav aligned with mobile (Music, Explore, Chat, Profile), and clear active highlight (`#22C55E`). Top bar has consistent MelodyHub logo and Spotify-like spacing; mobile sheet and desktop sidebar share the same branding.
- Moved pending Friend Requests from the Chat Sidebar exclusively into the global `NotificationBell` dropdown, allowing mobile users to accept requests from any page.
- Updated `HomeHero` typography sizes on mobile viewports for aesthetic balance.
- Enforced Apple Music-style glassmorphism across `CategoryCard` components.
- Increased global `#main-content` padding to `pb-32` to ensure infinite scroll lists clear the mobile safe-area boundaries and PWA navigation tabs.
- Elevated Hamburger Menu `z-index` to strictly overlay the Bottom Navigation Tab Bar.

### Fixed
- **Full regression QA:** Play button on song/album cards (SpotifyCard, MusicCard) was hidden until hover, blocking touch and keyboard; now visible with `group-focus-within` and `max-md:opacity-100`. Full checklist documented in `QA_REPORT.md`; single failure logged as [#41](https://github.com/aabhiyann/MelodyHub/issues/41) and fixed.
- **Mobile final pass:** Back button (Topbar) on every sub-page, including Radio and Quest pages. Mini player bar positioned above bottom nav using safe-area-aware CSS variable `--mobile-mini-player-bottom`. Bottom nav and main content padding verified; no overlap. Text overflow: truncate and min-w-0 on profile username, playlist/album/artist titles. Minimum 44×44px touch targets: Button icon size, mini bar controls, FullScreenPlayer close/tabs/like/volume/devices. Momentum scrolling (`.touch-scroll`) on main and key scroll containers; overflow-x-hidden on main and scroll areas. Modals (Dialog, AIPlaylistModal, ShortcutsModal) use max-h-[90dvh] and touch-scroll. FullScreenPlayer full-width on mobile and 44px tap targets. See `MOBILE_FIXES.md`.
- Fixed live "Failed to load users" API error caused by `express-rate-limit` triggering 429 preflight responses before CORS initialization.
- Fixed Render CI/CD build crash by restoring accidentally deleted `rootDir` variable.
- Fixed Chat Input text area being pushed permanently off-screen on mobile due to Tailwind `block` vs `flex` class conflicts.
- Fixed duplicated Chat Search users by implementing strict frontend `_id` deduplication mapping.
- Fixed `Socket.io` CORS origin rejection blocking live production users.

### Removed
- Removed generic error placeholders from Unreleased log.

---

## [1.0.0] - (Existing release)

### Added
- Music streaming with gapless playback
- AI playlist generation (Google Gemini)
- Smart search with categorized results
- Shared playlists with real-time collaboration
- Real-time chat with Socket.io
- Admin dashboard with analytics
- Melody mascot with 8 expressive states
- WCAG 2.1 AA accessibility
- Spotify/Apple Music-inspired UI with 971-song catalog
- Performance enhancements: virtual scrolling, card reveal animations, skeleton loaders
- Genre-based theming, analytics tracking, keyboard navigation

[Unreleased]: https://github.com/aabhiyann/MelodyHub/compare/main...HEAD
[1.0.0]: https://github.com/aabhiyann/MelodyHub/releases/tag/v1.0.0
