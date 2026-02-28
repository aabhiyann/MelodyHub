# Navigation

**Feature:** Global navigation: sidebar (web), top bar, mobile bottom bar, back button.  
**References:** [DESIGN_PLAN.md](../DESIGN_PLAN.md) (Navigation), [CHANGELOG.md](../../CHANGELOG.md).

---

## Overview

- **Mobile:** Bottom bar with 4 items: Music (Home), Explore, Chat, Profile. Background `rgba(0,0,0,0.85)`, `backdrop-filter: blur(20px)`. Always visible. Active state: accent. Every sub-page has a back button top-left.
- **Web:** Sidebar (or equivalent) with same 4 primary items; glassmorphism (`rgba(16,16,22,0.94)`, blur 24px, border-right). Top bar: logo, search/actions, notification bell, user menu. Active page highlighted with accent. Sidebar also has “Magic” (AI) entry.
- **Consistency:** Same nav items and branding on mobile and web; Spotify-like spacing.

---

## Design (DESIGN_PLAN)

- Bottom nav: never hidden behind content; accent for active.
- Sidebar: glassmorphism; clear active highlight (`#22C55E`).
- Back button: top-left on mobile for every sub-page.

---

## Key files

| File | Purpose |
|------|---------|
| `components/layout/TopBar.tsx` | Logo, Magic button, notification bell, user menu; mobile back button logic. |
| `components/layout/navigation/Sidebar.tsx` | Desktop sidebar: primary nav (Music, Explore, Chat, Profile), Magic (AI), secondary links. |
| `components/features/mobile/BottomTabBar.tsx` | Mobile bottom bar: 4 items, active state, routing. |
| Layout (e.g. SidebarLayout) | Wraps content; `#main-content` with bottom padding (e.g. `pb-32`) so content clears bottom nav and safe areas. |

---

## Mobile

- Hamburger menu (sheet) for extra links; z-index above bottom bar so it overlays correctly.
- Back button: shown when not on a root page; navigates back or to home.
