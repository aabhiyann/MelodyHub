# AI feature (Magic)

**Feature:** Prompt-based AI playlist generation using Google Gemini.  
**References:** [DESIGN_PLAN.md](../DESIGN_PLAN.md), [AI_AUDIT.md](../../AI_AUDIT.md), [CHANGELOG.md](../../CHANGELOG.md), [professional/08_FEATURE_AI_PLAYLIST.md](../professional/08_FEATURE_AI_PLAYLIST.md).

---

## Overview

- **User flow:** User opens AI modal (TopBar “Magic”, Home FAB “Generate AI Playlist”, or Sidebar “Magic”), enters a natural-language prompt (e.g. “Upbeat songs for morning run”), clicks Create Playlist. Backend calls Gemini, returns playlist name, description, and list of matched songs. Frontend shows Prompt → Processing → Results. User can Play, Save to Library, or Regenerate.
- **Not chat:** This is a modal-based flow, not the chat UI.

---

## Entry points

- **TopBar:** “Magic” button.
- **Home page:** FAB or card “Generate AI Playlist”.
- **Sidebar (desktop):** “Magic” link (opens same modal).

---

## Design (DESIGN_PLAN)

- Accent `#22C55E` throughout (prompt, processing bar, results, mascot, particles).
- Modal content: `#101019` background; content has `stopPropagation` and `z-10` so clicks are not intercepted by backdrop.
- Loading: Animated “thinking” dots and green progress bar.
- Error: Single friendly message for all failures (no raw API/stack).

---

## Key files

| File | Purpose |
|------|---------|
| `stores/useAIStore.ts` | Modal open/close, prompt, call API, stages (prompt/processing/results), error handling (friendly fallback). |
| `components/features/ai/AIPlaylistModal.tsx` | Modal shell, backdrop, gradient overlay, stage routing. |
| `components/features/ai/StagePrompt.tsx` | Textarea, example chips, Create Playlist button. |
| `components/features/ai/StageProcessing.tsx` | Rotating messages, animated dots, skeleton, green bar. |
| `components/features/ai/StageResults.tsx` | Playlist hero, song list, Play / Save / Regenerate. |
| `components/features/ai/MelodyMascot.tsx`, `ParticleBackground.tsx` | Decorative elements. |
| Backend: `controllers/ai.controller.ts`, `routes/ai.route.ts` | `POST /api/ai/generate`, Gemini, song matching. |

---

## API

- **Endpoint:** `POST /api/ai/generate` (protected). Body: `{ prompt, userContext? }`.
- **Backend:** Gemini 2.0 Flash returns JSON: `name`, `description`, `songs: [{ title, artist, reasoning }]`. Backend matches songs to DB (e.g. `$text` / regex on title); returns only matched songs.
- **Frontend:** `axiosInstance` with Bearer token; result drives Results stage.

---

## Errors

- **429:** “AI is taking a breather” (with optional retry-after).
- **503 / missing key:** “AI service is temporarily unavailable.”
- **Other:** Single friendly message: e.g. “We couldn’t create your playlist right now. Please try again or use a different prompt.” No raw error text to the user.

---

## Status

- Implemented: entry points, loading state, error handling, DESIGN_PLAN styling, click fix. See [AI_AUDIT.md](../../AI_AUDIT.md) for full checklist and what to verify manually (E2E, empty results).
