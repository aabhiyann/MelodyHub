# Profile

**Feature:** User profile page: header, stats, tabs; edit modal; other-user view with Follow/Message.  
**References:** [DESIGN_PLAN.md](../DESIGN_PLAN.md) (Profile), [CHANGELOG.md](../../CHANGELOG.md).

---

## Overview

- **Own profile:** Header with large circular avatar (edit on hover), display name, username, bio. Stats row: Followers, Following, Songs, Playlists. Tabs: Activity, Playlists, Liked Songs, Friends. Client-side tab switch (no full-page reload). Playlists tab: grid of playlist cards (SpotifyCard style). Friends tab: friends list. Activity and Liked Songs: empty states when no data. Edit profile button opens modal.
- **Other user’s profile:** Same header/stats/tabs; Follow/Unfollow and Message. Message navigates to Chat and opens conversation with that user (when they are in friends list).

---

## Design (DESIGN_PLAN)

- Header: Spotify-like; accent `#22C55E` for stats/links.
- Edit modal: `#101019` background, accent `#22C55E`.
- Mobile: Stacked layout; avatar centered at top.

---

## Key files

| File | Purpose |
|------|---------|
| `pages/ProfilePage.tsx` | Route, own vs other user, header, stats, tabs, content per tab. |
| `components/profile/ProfileHeader.tsx` | Avatar, display name, username, bio, stats row, Edit / Follow / Message. |
| `components/profile/EditProfileModal.tsx` | Edit profile form; DESIGN_PLAN styling. |
| Chat deep link: `ChatPage` + `openUserId` from navigation state | Message button from profile navigates to chat with that user. |

---

## Tabs

- Activity, Playlists, Liked Songs, Friends. State in component or small store; no route change. Playlists tab uses same card style as Home/Browse (SpotifyCard).
