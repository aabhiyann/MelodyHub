# Playlists

**Feature:** Playlist view page and create/edit flow; reorder and remove songs (owner).  
**References:** [DESIGN_PLAN.md](../DESIGN_PLAN.md) (Playlist), [CHANGELOG.md](../../CHANGELOG.md).

---

## Overview

- **View page:** Hero with large cover (playlist image or first track), title, creator, song count, total duration, Play All, Shuffle. Song list: track #, album art, title, artist, duration, like; hover shows play. Owner can reorder (up/down) and remove per track. Background gradient from cover art (useDominantColor).
- **Create/Edit:** Shared modal `CreateEditPlaylistModal`: cover image URL, name, description; in edit mode, add-songs search. Debounced auto-save with “Saving…” / “Saved” indicator. Used from Library (Create/Edit) and from PlaylistPage “Edit playlist”.

---

## Design (DESIGN_PLAN)

- Cards: 12px radius, hover scale + shadow; text primary/secondary; accent for play and actions.
- Hero: large cover; gradient from cover art.

---

## Key files

| File | Purpose |
|------|---------|
| `pages/PlaylistPage.tsx` | Hero, song list, Play All/Shuffle, owner reorder/remove, background gradient (useDominantColor). |
| `components/features/playlist/PlaylistSongRow.tsx` | Single row: art, title, artist, duration, like, play on hover; owner: reorder up/down, remove. |
| `components/features/playlist/CreateEditPlaylistModal.tsx` | Create vs edit; cover URL, name, description; add-songs search (edit); auto-save. |
| `pages/LibraryPage.tsx` | Library; opens CreateEditPlaylistModal for create and edit. |
| `stores/PlaylistStore.ts` | CRUD, reorderSongs. |
| `lib/api/playlist.ts` | API client: create, update, reorderSongs; delete song from playlist. |
| `hooks/useDominantColor.ts` | Used for playlist hero background. |

---

## Backend

- **Playlist:** `imageUrl` on create/update. `DELETE /social/playlists/:id/songs/:songId` to remove a song. `PUT /social/playlists/:id/songs` with body `{ songIds }` to reorder.
- **Controller:** `songId` from `req.params` must be cast to `string` (e.g. `String(songId)`) for strict TypeScript builds (e.g. Render).

---

## Types

- `CreateEditPlaylistModal` accepts a `PlaylistForModal` type (subset of full Playlist: `_id`, `name`, `description`, `imageUrl`, `songs`) so Library and PlaylistPage can pass their local playlist shape without type errors.
