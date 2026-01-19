# Testing Strategy & QA Plan

**Status**: Active  
**Version**: 1.0

## 1. Overview
Quality Assurance (QA) is not an afterthought; it is integrated into our "Definition of Done". We use a **Testing Pyramid** approach.

## 2. Layers of Testing

### 2.1 Unit Tests (Frontend)
-   **Tool**: Vitest + React Testing Library
-   **Scope**: Individual Components (Buttons, Inputs, Cards).
-   **Goal**: Verify that UI elements render and respond to basic events (clicks).
-   **Location**: `frontend/src/__tests__/`
-   **Example**: "Does the 'Play' button change icon when clicked?"

### 2.2 Integration Tests (Backend)
-   **Tool**: Jest + Supertest
-   **Scope**: API Endpoints + Database.
-   **Goal**: Verify that sending a request to `/api/songs` actually saves data to MongoDB.
-   **Location**: `backend/src/__tests__/`
-   **Example**: "POST /api/register creates a user in the DB."

### 2.3 End-to-End (E2E) Tests (Planned)
-   **Tool**: Playwright or Cypress (Future)
-   **Scope**: Full user flows (Login -> Browse -> Play Song).
-   **Goal**: Verify the entire system works together.

## 3. Continuous Integration (CI)
We will configure GitHub Actions to run these tests automatically on every Pull Request.

```yaml
# .github/workflows/test.yml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test Backend
        run: cd backend && npm install && npm test
      - name: Test Frontend
        run: cd frontend && npm install && npm test
```

## 4. Test Coverage Targets
-   **Critical Paths (Auth, Payments)**: 90%+ coverage.
-   **UI Components**: 70% coverage.
-   **Utilities/Helpers**: 100% coverage.
