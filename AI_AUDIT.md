# AI Feature Audit — MelodyHub

**Date:** 2026-02-27  
**Scope:** AI playlist generation (Magic / Generate AI Playlist).

---

## 1. What the AI feature does

- **User flow:** User opens the AI modal (via **TopBar “Magic”** or **Home page FAB “Generate AI Playlist”**), enters a natural-language prompt (e.g. “Upbeat songs for morning run”), and clicks **Create Playlist**.
- **Backend:** `POST /api/ai/generate` (protected). Request body: `{ prompt, userContext? }`. The controller uses **Google Gemini 2.0 Flash** to generate a JSON object with:
  - `name`: playlist title  
  - `description`: short description  
  - `songs`: array of `{ title, artist, reasoning }`
- **Matching:** Backend matches each suggested song to the database using `$text` search and regex on `title`; returns only songs that exist in the DB.
- **Frontend:** `useAIStore` calls the API, then drives the modal through three stages: **Prompt** → **Processing** → **Results**. On results, the user can **Play**, **Save to Library**, or **Regenerate**.

So the feature is **prompt-based playlist generation**, not chat. It does not use the chat UI.

---

## 2. Is it working end-to-end?

- **Yes, when:**
  - `GEMINI_API_KEY` is set in the backend.
  - User is authenticated (Clerk); `axiosInstance` sends the Bearer token to `/api/ai/generate`.
- **Possible failures:**
  - **Empty or sparse results:** If DB matching finds few or no songs, the playlist can be empty or very short. No explicit “no matches” message.
  - **Rate limits:** 429 is handled with a friendly “AI is taking a breather” message and `retryAfter`.
  - **Missing/invalid API key:** Backend returns 503; frontend shows “AI service is temporarily unavailable.”

---

## 3. What’s broken or unpolished

| Priority | Item | Notes |
|----------|------|--------|
| P1 | **Entry point** | TopBar and Home FAB exist; **Sidebar** (desktop) has no “Magic” / AI link. |
| P1 | **Click interception** | In some contexts (e.g. overlay stacking), the “Create Playlist” button can be hard to activate; modal content should stop propagation and have clear z-index. |
| P2 | **Loading state** | StageProcessing has rotating messages and skeleton; could add a clearer “thinking” indicator (e.g. animated dots or bar) for a more polished feel. |
| P2 | **Error state** | 429/503 are friendly; generic errors use `getErrorMessage` and may still show raw API text. Should show a single, friendly fallback message. |
| P2 | **Visual consistency** | Modal uses `brand-primary` / `brand-secondary` (purple/blue). Rest of app uses DESIGN_PLAN accent `#22C55E`; AI should align for a consistent, Spotify-like look. |
| P2 | **Results layout** | Results use a table-like list (consistent with playlist rows). No “cards” view; acceptable if styling matches app (accent, borders, hover). |
| P3 | **Empty results** | When AI returns 0 matched songs, the list is empty with a short message; could be more prominent and suggest “Try a different prompt.” |

---

## 4. Post–polish checklist (implemented 2026-02-27)

- [x] Clear entry point: TopBar "Magic" + Home FAB + Sidebar "Magic" (opens modal).
- [x] Loading: Animated indicator (dots or bar) while AI is “thinking”.
- [x] Error: Single friendly message for any non-429/503 failure.
- [x] Modal: Content has stopPropagation and z-10; no click interception.
- [x] Styling: Accent #22C55E throughout AI modal; no purple overuse.
- [ ] E2E: Open modal → submit prompt → see processing → see results → Play / Save / Regenerate.

---

## 5. Technical notes

- **Backend:** `backend/src/controllers/ai.controller.ts`, `backend/src/routes/ai.route.ts`. Route: `POST /api/ai/generate` with `protectRoute`.
- **Frontend:** `frontend/src/stores/useAIStore.ts`, `frontend/src/components/features/ai/` (AIPlaylistModal, StagePrompt, StageProcessing, StageResults, MelodyMascot, ParticleBackground).
- **API:** Frontend uses `axiosInstance` (baseURL `VITE_API_URL` or `/api`), so full URL is `/api/ai/generate`.

---

## 6. What works / what doesn’t (after polish)

**Works:**

- Opening the AI modal from TopBar "Magic", Home FAB, or Sidebar "Magic".
- Prompt stage: textarea, example chips, Create Playlist button; DESIGN_PLAN colors; friendly error display.
- Processing stage: rotating messages, animated thinking dots, skeleton layout, green loading bar.
- Results stage: playlist hero, song list with play/save/regenerate; DESIGN_PLAN accent (#22C55E).
- Modal backdrop no longer swallows button clicks (stopPropagation + z-index).
- 429/503 errors show friendly messages; other errors show a single friendly fallback.

**To verify manually:**

- Full E2E with real backend (GEMINI_API_KEY set): submit prompt → wait for results → Play / Save to Library / Regenerate.
- Empty or sparse results: backend may return 0–few songs if DB matching fails; UI shows "No songs" and suggests regenerating.
