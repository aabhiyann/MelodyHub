# Frontend Developer Guide 🎨

## Overview

This guide is designed for frontend developers working on **MelodyHub**. It covers the architecture, state management, component standards, and best practices used in the codebase.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Routing**: React Router v7
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Testing**: Vitest (Unit), Playwright (E2E)

## Project Structure

```
frontend/src/
├── components/         # Reusable UI components
│   ├── features/       # Feature-specific components (player, admin, etc.)
│   ├── layout/         # Layout components (LeftSidebar, TopBar)
│   ├── shared/         # Shared complex components
│   └── ui/             # Base UI primitives (Button, Input)
├── pages/              # Route components (Home, Chat, AlbumPage)
├── stores/             # Zustand stores (Global State)
├── providers/          # React Context Providers (Auth, Theme)
├── lib/                # Utilities and configurations (Axios, cn helper)
├── types/              # TypeScript interfaces and types
└── __tests__/          # Global tests
```

## State Management (Zustand)

We use **Zustand** for global state management due to its simplicity and performance.

### Key Stores

1.  **`AuthStore`**: Manages user authentication state (user object, loading, admin status).
2.  **`PlayerStore`**: Manages the music player state (current song, queue, isPlaying, volume).
3.  **`MusicStore`**: Manages data fetching for albums, songs, and stats.
4.  **`ChatStore`**: Manages real-time chat messages and online users.
5.  **`AIStore`**: Manages AI playlist generation state.

### Pattern

```typescript
// Example: Simple Store
import { create } from 'zustand';

interface UIStore {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
```

## Styling Guidelines

We use **Tailwind CSS v4** with a utility-first approach.

-   **Colors**: Use the `zinc` scale for grays and `emerald` for primary accents (defined in `index.css`).
-   **Animations**: Use `tailwindcss-animated` or native CSS transitions.
-   **Class Merging**: Always use the `cn()` utility (clsx + tailwind-merge) when accepting `className` props.

```typescript
import { cn } from "@/lib/utils";

export const Button = ({ className, ...props }) => {
  return <button className={cn("px-4 py-2 bg-emerald-500", className)} {...props} />;
};
```

## Component Guidelines

1.  **Functional Components**: Use React Functional Components with Hooks.
2.  **Props Interface**: Always define a TypeScript interface for props.
3.  **Early Returns**: Use guard clauses to reduce nesting.
4.  **Composition**: Prefer composition over inheritance or complex prop drilling.

## Data Fetching

-   Use `Axios` instance from `@/lib/axios` which handles base URLs automatically.
-   Fetch data inside `useEffect` or via Zustand actions.
-   Handle `loading` and `error` states explicitly.

## Testing

### Unit Testing (Vitest)
Run `npm test` to run unit tests.
-   Test logic-heavy components and utilities.
-   Mock external dependencies (Stores, API).

### E2E Testing (Playwright)
Run `npx playwright test` to run E2E tests.
-   Test critical user flows (Login -> Play Music -> Chat).

## Best Practices

-   **Accessibility**: Use semantic HTML tags (`<nav>`, `<main>`, `<article>`) and ARIA labels where necessary.
-   **Performance**: Use `React.memo` for expensive renders (rarely needed with Zustand).
-   **Clean Code**: Keep components small (< 200 lines). Extract sub-components if they grow too large.
