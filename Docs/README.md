# MelodyHub Documentation

Central index for all project documentation. Use this when onboarding, contributing, or revisiting the codebase.

---

## Quick links

| Topic | Document | Description |
|-------|----------|-------------|
| **Design system** | [DESIGN_PLAN.md](DESIGN_PLAN.md) | Colors, typography, component rules (chat, player, nav, cards). |
| **Frontend architecture** | [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md) | Directory structure, state (Zustand), components, testing. |
| **Tech stack** | [TECH_STACK.md](TECH_STACK.md) | One-pager: React, Node, MongoDB, Redis, Clerk, Gemini, etc. |
| **Changelog** | [../CHANGELOG.md](../CHANGELOG.md) | All notable changes (features, fixes, UI/UX). |
| **Contributing** | [../CONTRIBUTING.md](../CONTRIBUTING.md) | Branching, commits, PRs, code style. |
| **Git workflow (Cursor)** | [../.cursor/rules/git-workflow.mdc](../.cursor/rules/git-workflow.mdc) | Branch names, commit format, CHANGELOG. |

---

## By role

- **New developer:** Start with [TECH_STACK.md](TECH_STACK.md), [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md), [DESIGN_PLAN.md](DESIGN_PLAN.md), then [CONTRIBUTING.md](../CONTRIBUTING.md).
- **UI/frontend:** [DESIGN_PLAN.md](DESIGN_PLAN.md), [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md), [features/](features/) for Chat, Player, Notifications, etc.
- **Backend:** [professional/API.md](professional/API.md), [professional/04_SYSTEM_DESIGN.md](professional/04_SYSTEM_DESIGN.md), [professional/ROLE_BACKEND_GUIDE.md](professional/ROLE_BACKEND_GUIDE.md).
- **DevOps / deploy:** [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md), [professional/DEPLOYMENT.md](professional/DEPLOYMENT.md), [DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md).

---

## Feature documentation

Detailed notes for major features (implementation, UX, APIs):

| Feature | Document | Summary |
|---------|----------|---------|
| Chat UI | [features/CHAT_UI.md](features/CHAT_UI.md) | Bubbles, typing, auto-scroll, friend requests. |
| Music player | [features/MUSIC_PLAYER.md](features/MUSIC_PLAYER.md) | Mini bar, full-screen, seek sync, dominant color. |
| Notifications | [features/NOTIFICATIONS.md](features/NOTIFICATIONS.md) | Bell, dropdown, friend requests, real-time. |
| AI (Magic) | [features/AI_MAGIC.md](features/AI_MAGIC.md) | Playlist generation, modal, entry points. See also [../AI_AUDIT.md](../AI_AUDIT.md). |
| Playlists | [features/PLAYLIST.md](features/PLAYLIST.md) | View page, create/edit modal, reorder, backend. |
| Profile | [features/PROFILE.md](features/PROFILE.md) | Header, tabs, edit, other-user view. |
| Navigation | [features/NAVIGATION.md](features/NAVIGATION.md) | Sidebar, top bar, mobile bottom bar, back button. |

---

## Other docs

- **Professional / process:** [professional/](professional/) — Git strategy, SDLC, PRD, architecture, API, deployment, roles, AI feature spec.
- **Debugging & QA:** [DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md), [DEV_LOG_UI_UX_OVERHAUL.md](DEV_LOG_UI_UX_OVERHAUL.md), [QA_CHECKLIST.md](QA_CHECKLIST.md), [QA_VISUAL_INDEX.md](QA_VISUAL_INDEX.md) (screenshots/screencasts).
- **Good first issues:** [GOOD_FIRST_ISSUES.md](GOOD_FIRST_ISSUES.md).
- **UI/UX history:** [ROADMAP_UI_UX_90_PERCENT.md](ROADMAP_UI_UX_90_PERCENT.md), [DEV_LOG_UI_UX_OVERHAUL.md](DEV_LOG_UI_UX_OVERHAUL.md).
- **Audits:** [../AI_AUDIT.md](../AI_AUDIT.md) (AI feature). UX audits: `AUDIT_YYYY-MM-DD.md` in repo root when created.
