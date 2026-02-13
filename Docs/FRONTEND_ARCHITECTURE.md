# Frontend Architecture Guide 🏗️

This document outlines the architectural patterns and structure of the MelodyHub frontend application.

## 1. Directory Structure

The `src` directory is organized by feature and function to promote scalability and maintainability.

```
frontend/src/
├── components/         # React Components
│   ├── features/       # Business-logic rich components, grouped by domain
│   │   ├── admin/      # Admin dashboard widgets and tables
│   │   ├── chat/       # Chat interface and message bubbles
│   │   ├── gamification/# Streaks, badges, leaderboards
│   │   ├── home/       # Home page specific components (Greeting, Featured)
│   │   ├── player/     # Audio player controls and visualization
│   │   ├── playlist/   # Playlist management and song rows
│   │   └── social/     # Friends activity, user lists, profiles
│   ├── layout/         # Structural components (LeftSidebar, TopBar, MainLayout)
│   ├── shared/         # Reusable non-primitive components (StatusIndicator)
│   └── ui/             # Primitive UI components (Button, Slider, Dialog) - Shadcn/UI style
├── pages/              # Route entry points (lazy loaded)
├── stores/             # Global state management (Zustand)
├── providers/          # React Context providers (Auth, Theme)
├── lib/                # Utilities, helpers, and configurations
├── types/              # TypeScript type definitions
└── __tests__/          # Global test setup and integration tests
```

---

## 2. Component Categorization

We follow a strict categorization for components:

### UI Components (`components/ui`)
- **Responsibility**: Pure presentational primitives.
- **Dependencies**: Minimal (mostly `cn` utility, Radix primitives).
- **State**: Controlled or unmanaged local state only.
- **Example**: `Button`, `Slider`, `Dialog`, `ScrollArea`.

### Feature Components (`components/features`)
- **Responsibility**: Implement specific business requirements.
- **Dependencies**: Zustand stores, API hooks, other UI components.
- **State**: Connected to global stores.
- **Example**: `PlayerControls` (connects to `usePlayerStore`), `ChatWindow` (connects to `useChatStore`), `FriendActivity` (connects to `useSocialStore`).

### Layout Components (`components/layout`)
- **Responsibility**: Define the structural frame of the application.
- **Example**: `LeftSidebar` (Navigation), `TopBar` (User actions).

### Page Components (`pages`)
- **Responsibility**: Route targets. fetching initial data, composing features.
- **Performance**: Asynchronously loaded via `React.lazy`.

---

## 3. State Management (Zustand)

We use **Zustand** for global state.
**Pattern:** "Slice Pattern" with separated API Service layers.

**Structure:**
- `src/stores/` contains the hook definitions (Store = State + Actions).
- `src/lib/api/` contains the framework-agnostic API calls.

**Example Store:**
```typescript
// src/stores/useExampleStore.ts
import { create } from 'zustand';
import { exampleApi } from '@/lib/api/example';

interface State {
  data: any[];
  isLoading: boolean;
  error: string | null;
}

interface Actions {
  fetchData: () => Promise<void>;
}

export const useExampleStore = create<State & Actions>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  fetchData: async () => {
    set({ isLoading: true });
    try {
      const data = await exampleApi.getData();
      set({ data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  }
}));
```

**Key Stores:**
- `PlayerStore`: Audio playback, queue, volume.
- `AuthStore`: User session (Clerk wrapper).
- `GamificationStore`: XP, Level, Challenges.
- `useSocialStore`: Friends, Activity Feed.
- `PlaylistStore`: Playlist CRUD.

---

## 4. Performance Optimizations

### Code Splitting
Routes are lazy-loaded to reduce the initial bundle size.
```tsx
const ChatPage = lazy(() => import('./pages/ChatPage'));
```

### Component Optimization
- **Memoization**: `React.memo` is used for lists components (`SongList`, `AlbumGrid`) to prevent unnecessary re-renders.
- **Virtualization**: `react-window` is recommended for long lists (100+ items).
- **Image Optimization**: Custom `OptimizedImage` component handles lazy loading and source sets.
- **SEO**: `react-helmet-async` manages document head changes (title, meta tags) dynamically per route.

---

## 5. Testing Strategy

- **Unit Tests (Vitest)**: Focus on logic-heavy hooks, stores, and complex UI components.
  - Mocks: External libraries (`react-router-dom`, `axios`) and stores are mocked to isolate components.
- **Integration Tests**: Verify critical user flows (e.g., Auth flow, Player flow).

---

## 6. Type Safety

Strict TypeScript is enforced.
- **No `any`**: All types must be defined.
- **Shared Types**: API response types are centralized in `src/types`.
