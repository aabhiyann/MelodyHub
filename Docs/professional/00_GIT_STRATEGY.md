# Git Workflow & Branching Strategy

**Status**: Active  
**Version**: 1.0  

## 1. Overview
We follow a professional **Feature Branch Workflow** (simplified Gitflow). This ensures that the `main` branch is always stable and deployable. Direct commits to `main` are forbidden (except for initial setup).

## 2. Branching Naming Convention
Every branch must follow this pattern: `<type>/<short-description>`

| Type | Use Case | Example |
| :--- | :--- | :--- |
| `feat` | New feature implementation | `feat/chat-bubbles` |
| `fix` | Bug fix | `fix/login-error` |
| `refactor` | Code cleanup (no behavior change) | `refactor/typescript-migration` |
| `docs` | Documentation updates | `docs/system-design` |
| `chore` | Build tasks, package updates | `chore/update-dependencies` |

## 3. The Lifecycle of a Task

1.  **Sync**: Always start with the latest code.
    ```bash
    git checkout main
    git pull origin main
    ```

2.  **Branch**: Create your workspace.
    ```bash
    git checkout -b feat/add-dark-mode
    ```

3.  **Work**: Code, test, and save.
    ```bash
    # Make small, frequent commits
    git add .
    git commit -m "feat: add toggle button component"
    ```

4.  **Push**: Upload your branch.
    ```bash
    git push origin feat/add-dark-mode
    ```

5.  **Pull Request (PR)**:
    -   Go to GitHub.
    -   Open a PR from `feat/add-dark-mode` to `main`.
    -   *Self-Review*: Check your own code diff.
    -   *Merge*: Squash and Merge (keeps history clean).

## 4. Commit Message Convention
We use **Conventional Commits** to make our history readable.

**Format**: `<type>: <description>`

-   `feat: add play/pause functionality` (Good)
-   `added some code` (Bad)
-   `fix: resolve crash on mobile` (Good)
-   `fixed bug` (Bad)

## 4.1 Per-task branching and commits
-   **One branch per task**: Create a short-lived branch from up-to-date `main` for each fix or feature (e.g. `fix/player-queue`, `feat/share-track`). Avoid long-lived branches.
-   **One or more commits per logical change**: Commit often; each commit should represent a single logical change (one fix, one small feature). Do not leave large uncommitted dumps on `main`.

## 5. Branch Structure (Enhancement Roadmap)

For larger initiatives (e.g. testing, caching, analytics), use feature branches off `main`:

```
main (production-ready)
  ├── feature/testing-enhancement
  ├── feature/redis-caching
  ├── feature/analytics-dashboard
  ├── feature/social-enhancements
  ├── feature/mobile-pwa
  └── feature/ai-improvements
```

**Workflow per phase:**
1. Create feature branch from `main`: `git checkout -b feature/phase-name`
2. Make small, atomic commits every 15–30 minutes
3. Push frequently: `git push origin feature/phase-name`
4. Create PR when the phase is complete
5. Merge to `main` after review (Squash and Merge)

**Commit types:** `feat:`, `test:`, `fix:`, `refactor:`, `perf:`, `docs:`, `chore:`

---

## 6. Current Active Branches
-   `main`: Production-ready code.
-   *(Your next branch)*: Create from `main` per task (e.g. `feature/foundation-setup`).
