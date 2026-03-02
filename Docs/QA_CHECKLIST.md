# MelodyHub QA Checklist

Use this checklist for manual QA before release or after major changes. Run on both **desktop (1440×900)** and **mobile (390×844)** viewports.

**Source**: Aligned with [BETA_TEST_REPORT.md](../BETA_TEST_REPORT.md) 16-section structure.

---

## Section 1 – First Impression
- [ ] App purpose obvious in 5 seconds
- [ ] Landing page looks professional
- [ ] Branding clear (logo, app name)
- [ ] Fonts load correctly
- [ ] No layout shifts on load
- [ ] Desktop | Mobile

## Section 2 – Authentication
- [ ] Sign up: form polished, validation, loading state, redirect
- [ ] Sign in: valid/invalid credentials, error clarity
- [ ] Sign out: obvious location, redirect, protected routes blocked
- [ ] Show/hide password, Forgot Password (if applicable)
- [ ] Desktop | Mobile

## Section 3 – Home / Dashboard
- [ ] Sections present (Recently played, Recommended, etc.)
- [ ] Cards load, no broken images
- [ ] Skeleton loaders on slow network
- [ ] Hover effects on cards (desktop)
- [ ] Scroll smooth, content below fold
- [ ] Desktop | Mobile

## Section 4 – Music Player (Mini Bar)
- [ ] Mini bar appears at bottom
- [ ] Shows: album art, title, artist, play/pause
- [ ] Progress bar (thin line at top)
- [ ] Above bottom nav on mobile
- [ ] Play/pause, next work
- [ ] Long title scrolls/truncates
- [ ] Tap to expand full player
- [ ] Desktop | Mobile

## Section 5 – Music Player (Expanded)
- [ ] Opens smoothly (~300ms)
- [ ] Full screen on mobile
- [ ] Album art large, gradient background
- [ ] All controls: shuffle, prev, play, next, repeat, like, volume
- [ ] Progress bar seekable
- [ ] Time display updates
- [ ] Collapse smooth
- [ ] Playback continues across navigation
- [ ] Desktop | Mobile

## Section 6 – Navigation
- [ ] Desktop: sidebar/top nav visible, all links work, active state
- [ ] Mobile: bottom nav, 4 tabs, always visible, above mini bar
- [ ] Back button on sub-pages (mobile)
- [ ] Desktop | Mobile

## Section 7 – Explore / Discovery
- [ ] Page loads, search bar works
- [ ] Results show album art, song, artist
- [ ] Click result plays/navigates
- [ ] Categories/genres work
- [ ] Mobile: keyboard doesn’t break layout
- [ ] Desktop | Mobile

## Section 8 – Playlists
- [ ] Easy to find, view loads
- [ ] Hero: cover, title, song count
- [ ] Song rows: number, art, title, artist, duration
- [ ] Hover play (desktop), Play All, Shuffle
- [ ] Create: modal, cover upload, name, add songs
- [ ] Edit: reorder, remove, delete with confirmation
- [ ] Desktop | Mobile

## Section 9 – Social / Friends
- [ ] Follow/Friend Request on profile
- [ ] Button state changes (pending)
- [ ] Notification bell shows request
- [ ] Accept inline, no redirect
- [ ] Sender updates without refresh
- [ ] Chat unlocks after accept
- [ ] Desktop | Mobile (two accounts)

## Section 10 – Chat
- [ ] Chat loads, history correct
- [ ] Messages: yours right, theirs left, timestamps, avatars
- [ ] Send works, appears instantly
- [ ] Real-time on other side
- [ ] Auto-scroll to bottom
- [ ] Long message wraps, emoji renders
- [ ] Mobile: input above keyboard
- [ ] Desktop | Mobile

## Section 11 – Notifications
- [ ] Bell in nav, dropdown opens
- [ ] Avatar, message, timestamp per notification
- [ ] Unread indicator, badge count
- [ ] Mark all as read works
- [ ] Empty state message
- [ ] Desktop | Mobile

## Section 12 – Profile
- [ ] Own: avatar, name, bio, stats, tabs
- [ ] Edit Profile: bio, avatar update
- [ ] Other user: Follow, Message, public playlists
- [ ] Desktop | Mobile

## Section 13 – AI Feature
- [ ] Entry point obvious
- [ ] Loads, responds, loading indicator
- [ ] Results useful, error state friendly
- [ ] Desktop | Mobile

## Section 14 – Animations
- [ ] Page transitions
- [ ] Button hover/click states
- [ ] Like/follow animations
- [ ] Card hover
- [ ] Player open/close
- [ ] Nav icon transitions
- [ ] Modal open/close
- [ ] Skeleton shimmer
- [ ] Progress bar smooth
- [ ] Toasts slide in, auto-dismiss
- [ ] Desktop | Mobile

## Section 15 – Edge Cases
- [ ] Refresh mid-song
- [ ] Offline message
- [ ] Two tabs logged in
- [ ] Empty chat send blocked
- [ ] Invalid profile pic error
- [ ] Long message (500 chars)
- [ ] Rapid like (debounce)
- [ ] /dashboard unauthenticated → redirect
- [ ] Private playlist blocked
- [ ] Playback across pages
- [ ] Resize desktop ↔ mobile
- [ ] Desktop | Mobile

## Section 16 – Overall
- [ ] Visual design, typography, colors
- [ ] Navigation clarity
- [ ] Player reliability
- [ ] Chat feel
- [ ] Social features
- [ ] AI integration
- [ ] Animations smooth
- [ ] Mobile experience
- [ ] Performance, stability

---

## Sign-off

| Release / Branch | Date | Tester | Desktop | Mobile | Notes |
|-----------------|------|--------|---------|--------|-------|
|                 |      |        | [ ]     | [ ]    |       |

---

**When to run**: Before merging to `main`, before release, or after major UI/UX changes. See [CONTRIBUTING.md](../CONTRIBUTING.md) for workflow.
