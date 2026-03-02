# Manual QA on Live Site

Use this guide to run manual QA against the live deployment.  
**Live URL:** https://melodyhubmusic.vercel.app/

For automated E2E against the live site (after installing browsers):

```bash
cd frontend && npx playwright install && npm run test:e2e:live
```

---

## Item 5 – Social / Friends & Notifications (two accounts)

**Goal:** Confirm friend request flow and notification sync between two users.

1. **Setup:** Use two different accounts (e.g. two browsers or incognito + normal).
2. **Account A:** Sign in, go to Profile or Search, find Account B (by name/search), send friend request (Follow / Add friend).
3. **Account B:** Confirm notification bell shows a new request; open dropdown, see request from A with Accept/Ignore.
4. **Account B:** Click Accept. Confirm request disappears from dropdown and (if applicable) Chat unlocks with A.
5. **Account A:** Without refresh, confirm state updates (e.g. “Friends” or chat with B becomes available).
6. **Both:** Check notification badge count and “Mark all read” behavior; confirm no duplicate or stuck requests.

**Pass:** Request appears for B, accept updates both sides, badge and list stay in sync.

---

## Item 6 – Chat reliability & UX

**Goal:** Chat feels reliable and modern (real-time, typing, long messages, emoji).

1. **Setup:** Two signed-in friends; open Chat and select the other user.
2. **Send message:** Type and send; confirm it appears on both sides in real time.
3. **Typing indicator:** One user types (do not send); other sees “X is typing...” then it clears after stop.
4. **Long message:** Paste or type a long message (e.g. 500+ chars); send and confirm it wraps and displays; try near 2000 chars and confirm limit/toast.
5. **Emoji:** Send a message with emoji; confirm it renders on both sides.
6. **Mobile:** Open chat on phone; focus input and confirm keyboard doesn’t hide input or break layout; send works.

**Pass:** Messages deliver in real time, typing shows/clears, long text and emoji work, mobile keyboard OK.

---

## Item 7 – Navigation & IA

**Goal:** All main areas are discoverable; labels and active states are clear on desktop and mobile.

1. **Desktop:** Check sidebar/top nav: Home, Explore, Playlists/Library, Chat, Profile, Notifications. Click each; confirm correct page and active state.
2. **Mobile:** Check bottom nav (e.g. Music, Explore, Chat, Profile). Tap each; confirm correct screen and active state. Confirm back button on sub-pages (e.g. Playlist, Profile) returns as expected.
3. **Guests:** Sign out; confirm landing has clear entry to Sign in / Sign up; “Get Started” goes to sign-up; no broken links.

**Pass:** All main sections reachable; active state and back behavior correct; guest flow clear.

---

## Item 8 – Animations & micro-interactions

**Goal:** Motion feels deliberate and consistent (no jank, reasonable duration).

1. **Page transitions:** Navigate between Home, Explore, Chat, Profile; confirm short transition (~200–300ms).
2. **Player:** Open mini player, expand to full screen, collapse; confirm smooth open/close.
3. **Buttons:** Hover/click primary and secondary buttons; like/follow if present; confirm clear feedback.
4. **Toasts:** Trigger a toast (e.g. “Friend request accepted”); confirm slide-in and auto-dismiss.
5. **Reduced motion:** If possible, enable “Reduce motion” in OS; reload and confirm animations are reduced or disabled.

**Pass:** Transitions and player motion smooth; toasts and buttons give clear feedback; reduced motion respected.

---

## Item 9 – Edge cases & error states

**Goal:** Offline, invalid input, and unauthorized access are handled safely.

1. **Offline:** Turn off network (or throttle to Offline); trigger an action; confirm friendly message (e.g. “You’re offline” or toast), no raw errors.
2. **Protected route:** Signed out, open `/library` or `/dashboard`; confirm redirect to home or sign-in.
3. **Chat:** Try sending empty message; confirm send is disabled or no-op. Try pasting 2000+ chars; confirm limit and toast.
4. **Invalid/edge:** If you have uploads (e.g. profile pic), try invalid file; confirm clear error. Rapid repeated actions (e.g. like) should not break UI.

**Pass:** Offline and invalid cases show clear messages; protected routes redirect; send and length limits enforced.

---

## Sign-off

| Item | Date | Tester | Pass |
|------|------|--------|------|
| 5 – Social/Notifications | | | |
| 6 – Chat | | | |
| 7 – Nav/IA | | | |
| 8 – Animations | | | |
| 9 – Edge cases | | | |
