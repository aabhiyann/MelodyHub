# QA Visual Index

Index of screenshots and screencasts for key flows, used for visual regression and pre-release QA. Capture from the live deployment at [melodyhubmusic.vercel.app](https://melodyhubmusic.vercel.app/). For design consistency, see [DESIGN_PLAN.md](DESIGN_PLAN.md).

## Viewports

- **Desktop**: 1440×900
- **Mobile**: 390×844

---

## Screenshots

Stored in [screenshots/](screenshots/). Naming: `{flow}-{viewport}.png`.

| Flow | Desktop | Mobile | Notes |
|------|---------|--------|-------|
| **First impression** | `first-impression-desktop.png` | `first-impression-mobile.png` | Landing page, hero, CTAs |
| **Auth – Sign in** | `auth-signin-desktop.png` | `auth-signin-mobile.png` | Clerk sign-in form |
| **Auth – Sign up** | `auth-signup-desktop.png` | `auth-signup-mobile.png` | Clerk sign-up form |
| **Home / Dashboard** | `home-desktop.png` | `home-mobile.png` | Logged-in home with sections |
| **Player – Mini bar** | `player-mini-desktop.png` | `player-mini-mobile.png` | Mini bar with song playing |
| **Player – Expanded** | `player-expanded-desktop.png` | `player-expanded-mobile.png` | Full-screen player view |
| **Explore / Search** | `explore-desktop.png` | `explore-mobile.png` | Search results or browse |
| **Playlist view** | `playlist-desktop.png` | `playlist-mobile.png` | Playlist hero + song list |
| **Chat** | `chat-desktop.png` | `chat-mobile.png` | Conversation with bubbles |
| **Notifications** | `notifications-desktop.png` | `notifications-mobile.png` | Bell dropdown open |
| **Profile – Own** | `profile-own-desktop.png` | `profile-own-mobile.png` | User's own profile |
| **Profile – Other** | `profile-other-desktop.png` | `profile-other-mobile.png` | Another user's profile |

---

## Screencasts

Stored in [screencasts/](screencasts/). See [screencasts/README.md](screencasts/README.md) for the full list and naming convention.

Key recordings: player expand/collapse, nav tab switch, notifications dropdown, modal open/close.

---

## Capture instructions

1. Open the live app in Chrome at 1440×900 (desktop) or 390×844 (mobile).
2. Navigate to each flow and capture a full-viewport screenshot (Cmd+Shift+S or DevTools).
3. Save to `Docs/screenshots/` with the filename from the table above.
4. For screencasts, use Chrome Recorder or similar; save to `Docs/screencasts/`.

---

## Last updated

2026-03-02 — Structure and index created. Screenshots and screencasts to be captured per flow.
