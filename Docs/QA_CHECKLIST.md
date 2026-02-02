# MelodyHub QA Checklist

Use this checklist for manual QA before release or after major changes.

## How to ship the current branch

1. **Open a Pull Request** on GitHub from `fix/audit-qa-and-features` into `main`.
2. **Run manual QA** using the sections below (auth, navigation, player, browse/search, chat, admin, accessibility).
3. **Merge** after review and checklist pass: use Squash and Merge (see [Docs/professional/00_GIT_STRATEGY.md](professional/00_GIT_STRATEGY.md)).

## Authentication & Guards
- [ ] Sign up creates account and redirects
- [ ] Sign in works with valid credentials
- [ ] Sign out clears session and redirects
- [ ] Protected routes redirect to login when unauthenticated
- [ ] Guest-only routes (e.g. login) redirect when already signed in

## Navigation & Layout
- [ ] Sidebar links work: Home, Search, Library, Playlists, Browse, Chat
- [ ] Playlist links use `/playlists/` (no 404)
- [ ] Topbar appears on main pages (Home, Browse, Library, etc.)
- [ ] Skip link (accessibility) works from keyboard
- [ ] Mobile menu opens and closes

## Player
- [ ] Play/pause toggles correctly
- [ ] Next track advances queue
- [ ] Previous track goes back or restarts current
- [ ] Progress bar seeks when clicked/dragged
- [ ] Volume control works
- [ ] Shuffle and repeat toggle correctly
- [ ] Queue shows current and upcoming tracks
- [ ] Lyrics panel toggles via "View Lyrics"
- [ ] Share track copies link or uses Web Share API

## Browse & Search
- [ ] Browse page loads genres/categories
- [ ] Search returns results for songs/artists/albums
- [ ] Genre filters work
- [ ] Card click plays or navigates correctly

## Library & Playlists
- [ ] Liked songs / library list loads
- [ ] Create playlist works
- [ ] Add/remove tracks from playlist
- [ ] Playlist detail page shows tracks and play

## Chat
- [ ] Chat page loads and shows messages
- [ ] Send message delivers and appears
- [ ] Typing indicator shows when others type
- [ ] Real-time updates (second user or tab) work

## Admin (if applicable)
- [ ] Admin routes require admin role
- [ ] Dashboard, Analytics, Songs, Settings load
- [ ] Admin sidebar links match existing routes only
- [ ] Tables and charts render

## Design & Accessibility
- [ ] Dark/light theme (if supported) applies tokens
- [ ] Focus visible on interactive elements (keyboard)
- [ ] No duplicate toasts (single Toaster)
- [ ] Error boundaries show fallback on crash
- [ ] 404 page renders for unknown routes

## Cross-browser / Devices
- [ ] Chrome/Edge: critical flows
- [ ] Safari (if target): playback and layout
- [ ] Mobile viewport: sidebar, player, tap targets

---

**How to use**: Run through each section; check off items as verified. Note failures in a PR or ticket and re-run after fixes.
