# Contributing to MelodyHub

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to MelodyHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

-   **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/aabhiyann/MelodyHub/issues).
-   If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/aabhiyann/MelodyHub/issues/new). Be sure to include a **title and clear description**, as well as as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

-   Open a new issue with a clear title and detailed description of the suggested enhancement.
-   Explain why this enhancement would be useful to most MelodyHub users.

### Pull Requests

1.  **Fork the repo** and create your branch from `main`.
2.  **Clone the project** to your local machine.
3.  **Install dependencies**: `npm install` in both `frontend` and `backend`.
4.  **Create a branch**: `git checkout -b feature/amazing-feature`.
5.  **Make your changes**.
6.  **Run tests**: Ensure `npm test` passes in both directories.
7.  **Commit changes** using Conventional Commits (e.g., `feat: add new playlist sorting`).
8.  **Push** to your fork.
9.  **Open a Pull Request**.

## Styleguides

### Git Commit Messages

-   Use the present tense ("Add feature" not "Added feature").
-   Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
-   Limit the first line to 72 characters or less.
-   Reference issues and pull requests liberally after the first line.
-   **Format**: `type(scope): subject`
    -   `feat`: A new feature
    -   `fix`: A bug fix
    -   `docs`: Documentation only changes
    -   `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
    -   `refactor`: A code change that neither fixes a bug nor adds a feature
    -   `perf`: A code change that improves performance
    -   `test`: Adding missing tests or correcting existing tests
    -   `chore`: Changes to the build process or auxiliary tools

### Code Style

-   **TypeScript**: Use strict types. Avoid `any`.
-   **React**: Use Functional Components and Hooks.
-   **Linting**: Run `npm run lint` before committing.

## Development Setup

Refer to the `README.md` for detailed installation instructions using Docker or manual setup.

Thank you for contributing!
