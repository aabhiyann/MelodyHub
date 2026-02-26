# Contributing to MelodyHub

We love your input! We want to make contributing to MelodyHub as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Workflow

We follow a professional **Feature Branch Workflow**.

1.  **Fork** the repo on GitHub.
2.  **Clone** the project to your own machine.
3.  **Create a branch** for your work.
    *   `feat/my-feature`
    *   `fix/my-bug-fix`
    *   `refactor/my-cleanup`
    *   `docs/my-documentation`
4.  **Commit** changes to your branch.
    *   Use granular, descriptive commits.
    *   Example: `feat: add play button component` (We follow [Conventional Commits](https://www.conventionalcommits.org/)).
5.  **Push** your work back to your fork.
6.  **Submit a Pull Request** against the `main` branch.

## CI/CD Service

Our GitHub Actions pipeline will automatically run on every PR:
-   **Linting**: ESLint must pass (0 errors).
-   **Type Checking**: `tsc` must pass (strict mode).
-   **Tests**: Unit tests must pass.

**Tip**: Run `npm run lint` and `npm run build` locally before pushing to save time!

## Code Style

-   **Frontend**: React 19, TypeScript, Tailwind CSS v4.
-   **Backend**: Node.js, Express, TypeScript (Strict Mode).
-   **Formatting**: We use Prettier (indirectly via ESLint/IDE settings).

## Reporting Bugs

**Great Bug Reports** tend to have:

-   A quick summary and/or background.
-   Steps to reproduce.
    -   Be specific! "Play song" vs "Click play button on 'Top Hits' playlist".
-   What you expected would happen.
-   What actually happened.
-   Notes (possibly including why you think this might be happening, or stuff you tried that didn't work).

## Useful Resources
- [Debugging Guide & Lessons Learned](./Docs/DEBUGGING_GUIDE.md): Check this before diving into UI rendering or API strictness bugs.
- [Good First Issues](./Docs/GOOD_FIRST_ISSUES.md): A curated list of UI/UX styling tweaks and API cleanups perfect for newcomers!

Happy Coding! 🎵🐢
