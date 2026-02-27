# Changelog

All notable changes to MelodyHub are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added `.cursor/rules/git-workflow.mdc` — Cursor rule enforcing branch-per-feature, commit-after-meaningful-change, conventional commit messages, merge-to-main-and-push, and CHANGELOG updates per session.
- Created `Docs/DEBUGGING_GUIDE.md` and `Docs/GOOD_FIRST_ISSUES.md` based on production audit.
- Created `Docs/DEV_LOG_UI_UX_OVERHAUL.md` to chronicle the mobile UI architecture and API troubleshooting.

### Changed
- **Navigation & layout (mobile + web):** Mobile bottom bar now has 4 items (Music, Explore, Chat, Profile) with `rgba(0,0,0,0.85)` background and `backdrop-filter: blur(20px)`; always visible with accent active states. Every sub-page shows a back button top-left on mobile. Web sidebar uses glassmorphism (`rgba(16,16,22,0.94)`, `blur(24px)`, `border-right: 1px solid rgba(255,255,255,0.08)`), primary nav aligned with mobile (Music, Explore, Chat, Profile), and clear active highlight (`#22C55E`). Top bar has consistent MelodyHub logo and Spotify-like spacing; mobile sheet and desktop sidebar share the same branding.
- Moved pending Friend Requests from the Chat Sidebar exclusively into the global `NotificationBell` dropdown, allowing mobile users to accept requests from any page.
- Updated `HomeHero` typography sizes on mobile viewports for aesthetic balance.
- Enforced Apple Music-style glassmorphism across `CategoryCard` components.
- Increased global `#main-content` padding to `pb-32` to ensure infinite scroll lists clear the mobile safe-area boundaries and PWA navigation tabs.
- Elevated Hamburger Menu `z-index` to strictly overlay the Bottom Navigation Tab Bar.

### Fixed
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
