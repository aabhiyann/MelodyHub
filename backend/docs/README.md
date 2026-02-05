# MelodyHub Backend Documentation

Documentation for MelodyHub backend architecture, patterns, and best practices.

---

## 📚 Contents

### Architecture Decision Records (ADRs)

Documents key architectural decisions and their rationale.

- [ADR 001: Service Layer Architecture](./adr/001-service-layer-architecture.md)
- [ADR 002: TypeScript Type Safety Standards](./adr/002-typescript-type-safety.md)

### Developer Guides

Step-by-step guides for common development tasks.

- [Creating New Endpoints](./guides/creating-endpoints.md)
- [Error Handling Guide](./guides/error-handling.md)

---

## 🏗️ Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────────┐
│             HTTP Layer                   │
│  (Routes, Middleware, Controllers)       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          Business Logic Layer            │
│              (Services)                  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          Data Access Layer               │
│         (Models, Database)               │
└──────────────────────────────────────────┘
```

### Layer Responsibilities

**Routes**
- Define HTTP endpoints
- Apply middleware (auth, validation, rate limiting)
- Map URLs to controller methods

**Controllers**
- Parse incoming requests
- Call appropriate service methods
- Format and return HTTP responses
- Handle HTTP-specific concerns (status codes, headers)

**Services**
- Contain all business logic
- Perform database operations
- Implement business rules and validation
- Handle data transformations

**Models**
- Define database schemas
- Provide data validation
- Define relationships between entities

---

## 🎯 Design Principles

### 1. Separation of Concerns

Each layer has a single, well-defined responsibility:
- **Controllers** handle HTTP
- **Services** handle business logic
- **Models** define data structure

### 2. Dependency Direction

Dependencies flow inward:
- Routes → Controllers → Services → Models
- Never the reverse

### 3. Type Safety

- Avoid `any` types in production code
- Use proper interfaces and type definitions
- Leverage TypeScript's type system

### 4. Error Handling

- Use custom error classes
- Throw specific error types from services
- Translate to HTTP responses in controllers

---

## 🚀 Quick Start

### Creating a New Feature

1. **Define the Model** (if needed)
   ```typescript
   // models/my-feature.model.ts
   export interface IMyFeature extends Document {
       name: string;
       userId: string;
   }
   ```

2. **Create the Service**
   ```typescript
   // services/my-feature.service.ts
   export class MyFeatureService {
       async create(data) { ... }
       async getById(id) { ... }
   }
   ```

3. **Create the Controller**
   ```typescript
   // controllers/my-feature.controller.ts
   export const create = async (req, res) => {
       const result = await service.create(req.body);
       res.json({ success: true, data: result });
   };
   ```

4. **Register the Route**
   ```typescript
   // routes/my-feature.route.ts
   router.post("/", requireAuth, create);
   ```

For detailed instructions, see [Creating New Endpoints](./guides/creating-endpoints.md).

---

## 📖 Key Patterns

### Service Pattern

Services are standalone classes containing domain logic:

```typescript
export class PlaylistService {
    async create(userId: string, data: CreateData) {
        // Business logic here
        return await Playlist.create({ ...data, userId });
    }
}
```

**Why:** Testable, reusable, maintainable

**See:** [ADR 001: Service Layer Architecture](./adr/001-service-layer-architecture.md)

### Error Handling Pattern

Use custom error classes for consistency:

```typescript
import { NotFoundError, ValidationError } from "../utils/errors.js";

if (!playlist) {
    throw new NotFoundError("Playlist");
}

if (!data.name) {
    throw new ValidationError("Name required");
}
```

**Why:** Consistent error responses, better debugging

**See:** [Error Handling Guide](./guides/error-handling.md)

### Type Safety Pattern

Define proper types instead of using `any`:

```typescript
// Good ✅
export type ErrorDetails = ValidationErrorDetail[] | ServiceErrorDetail;

// Bad ❌
export type ErrorDetails = any;
```

**Why:** Better IDE support, catch bugs at compile time

**See:** [ADR 002: TypeScript Type Safety](./adr/002-typescript-type-safety.md)

---

## 🧪 Testing

### Unit Tests

Test services in isolation:

```typescript
describe("PlaylistService", () => {
    it("should create playlist", async () => {
        const result = await service.create(userId, data);
        expect(result.name).toBe(data.name);
    });
});
```

### Integration Tests

Test entire request/response flow:

```typescript
describe("POST /api/playlists", () => {
    it("should create playlist", async () => {
        const res = await request(app)
            .post("/api/playlists")
            .send(data);
        expect(res.status).toBe(201);
    });
});
```

---

## 📋 Code Review Checklist

Before submitting a PR:

- [ ] Services contain all business logic
- [ ] Controllers are thin (just HTTP handling)
- [ ] No `any` types (except error handling)
- [ ] Proper error classes used
- [ ] JSDoc comments added
- [ ] Tests written
- [ ] Build passes (`npm run build`)
- [ ] Follows established patterns

---

## 🔗 Additional Resources

### Internal

- [Sprint 1: Analysis Summary](../../.gemini/antigravity/brain/42b24f28-e79f-4618-af7b-e41f67b424bc/sprint_1_analysis_summary.md)
- [Sprint 3: Service Layer Walkthrough](../../.gemini/antigravity/brain/42b24f28-e79f-4618-af7b-e41f67b424bc/walkthrough.md)
- [Code Audit Report](../../CODE_AUDIT_REPORT.md)

### External

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

## 🤝 Contributing

1. Read the relevant ADRs and guides
2. Follow established patterns
3. Write tests
4. Update documentation if needed
5. Submit PR for review

---

**Questions?** Check the guides or ask the team!
