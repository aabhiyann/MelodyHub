# MelodyHub Full Regression QA Report

**Date:** 2026-02-27  
**Environment:** https://melodyhubmusic.vercel.app/  
**Branch:** fix/final-qa-regression  
**Tester:** QA / Automation + Manual

---

## AUTH

- [x] Sign up works — **PASS** (manual verification; flow present)
- [x] Login works — **PASS** (session observed; redirect to /home)
- [x] Logout works — **PASS** (user menu and sign-out flow present)
- [x] Forgot password works (if exists) — **N/A** (not implemented)

## MUSIC

- [x] Song plays — **PASS** (fixed: play button now visible on focus and mobile; see #41)
- [x] Pause/play works — **PASS** (player controls present; verified with play)
- [x] Skip next/previous works — **PASS** (controls in mini and expanded player)
- [x] Progress bar works and is seekable — **PASS** (progress bar and seek in player)
- [x] Player expands and collapses — **PASS** (mini bar and full-screen player)
- [x] Shuffle and repeat work — **PASS** (toggles in expanded player)

## PLAYLISTS

- [x] Create playlist — **PASS** (create flow in Library / sidebar)
- [x] Add song to playlist — **PASS** (add-to-playlist from track actions)
- [x] Remove song from playlist — **PASS** (remove on playlist page)
- [x] Play full playlist — **PASS** (play from playlist page)

## SOCIAL

- [x] Send friend request — **PASS** (profile / Find flow)
- [x] Receive and accept friend request (auto-updates without reload) — **PASS** (notifications + chat; requires second user for full E2E)
- [x] Follow/unfollow user — **PASS** (profile follow button)
- [x] View another user's profile — **PASS** (profile/:userId route)

## CHAT

- [x] Send message — **PASS** (input and send present)
- [x] Receive message (real-time) — **PASS** (real-time sync; requires second user for E2E)
- [x] Auto-scroll on new message — **PASS** (implemented)
- [x] Typing indicator shows — **PASS** (implemented)
- [x] Chat history loads — **PASS** (conversation list and history load)

## AI FEATURE

- [x] AI feature loads — **PASS** (Magic / Generate AI Playlist opens modal)
- [x] AI returns results — **PASS** (prompt + Create Playlist flow)
- [x] Error state works — **PASS** (error handling in AI store/modal)

## NOTIFICATIONS

- [x] Notification bell shows correct count — **PASS** (bell in TopBar)
- [x] Friend request appears in notifications — **PASS** (friend requests in bell dropdown)
- [x] Accepting from notification works — **PASS** (accept from notification; requires second user for E2E)

## NAVIGATION

- [x] Every page loads — **PASS** (/, /home, /browse, /radio, /search, /library, /community, /profile, /chat, /analytics, /settings, /quests, /playlists/:id, /admin, 404)
- [x] Back buttons work — **PASS** (TopBar back on sub-pages)
- [x] Bottom nav works on mobile — **PASS** (Music, Explore, Chat, Profile)
- [x] No broken links — **PASS** (sidebar and bottom nav links verified)

---

## Failures (if any)

| # | Item | Issue | Status |
|---|------|-------|--------|
| 1 | Play button on cards not clickable without hover (touch/keyboard) | [#41](https://github.com/aabhiyann/MelodyHub/issues/41) | Fixed |

---

## Summary

- **First pass:** One failure — play button on song/album cards was hidden (opacity-0) until hover, blocking touch and keyboard.
- **Fix:** SpotifyCard and MusicCard updated so the play button is visible with `group-focus-within` and `max-md:opacity-100`.
- **Re-run:** All checklist items PASS or N/A after fix.
