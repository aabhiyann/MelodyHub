# Music player

**Feature:** Mini bar and full-screen music player with sync and theming.  
**References:** DESIGN_PLAN.md (Music Player), CHANGELOG.md.

---

## Overview

- **Mini bar:** Shown only when a song is playing. Bottom of screen (above mobile bottom nav). Progress as thin accent line at top; album art, title, artist, play/pause, next. Tap bar (not buttons) to expand.
- **Expanded player:** Full-screen modal. Large album art, gradient background from album art dominant color, full progress bar with time, shuffle/previous/play/next/repeat, like, volume.

---

## Design (DESIGN_PLAN)

- **Mini bar:** Dark, slightly transparent background with blur. Progress bar at very top (accent #22C55E).
- **Expanded:** 300ms ease slide-up; gradient from album art (canvas extraction); controls and volume.

---

## Key files

- components/features/player/AudioPlayer.tsx — Single audio element, mini bar UI, progress, play/pause/next. Listens for player-seek custom event.
- components/features/player/FullScreenPlayer.tsx — Full-screen modal, large art, progress bar, seek (dispatches player-seek), controls, volume, like.
- hooks/useDominantColor.ts — Extracts dominant color from image URL (canvas); used for gradient in FullScreenPlayer and PlaylistPage.
- stores/PlayerStore (or equivalent) — Current track, queue, playback state, currentTime, volume.

---

## Seek synchronization

Expanded player seek bar updates store and dispatches a custom event "player-seek" with the new time. AudioPlayer (which owns the audio element) listens for player-seek and sets audioRef.current.currentTime so the actual playback position stays in sync.

---

## Dominant color

useDominantColor(imageUrl) returns a hex color. Used for: FullScreenPlayer background gradient; PlaylistPage hero background (from playlist cover or first track). Implemented via canvas: draw image, sample pixels, compute dominant color.
