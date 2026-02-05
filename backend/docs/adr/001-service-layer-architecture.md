# ADR 001: Service Layer Architecture

**Status:** Accepted  
**Date:** 2026-02-04  
**Deciders:** Engineering Team  
**Related:** Sprint 3 - Service Layer Refactoring

---

## Context

Our controllers contained direct database queries and business logic, violating separation of concerns. This made code:
- Hard to test (can't unit test business logic without mocking Express)
- Not reusable (business logic tied to HTTP layer)
- Difficult to maintain (mixed concerns)

**Analysis findings:**
- 14 controllers had direct DB queries
- Services existed but were underutilized
- No consistent pattern for service usage

---

## Decision

**We will implement a strict service layer pattern where:**

1. **Controllers are thin orchestrators** that only:
   - Parse incoming requests
   - Call appropriate service methods
   - Format and return responses
   - Handle HTTP-specific concerns (status codes, headers)

2. **Services contain all business logic** including:
   - Database operations
   - Data transformations
   - Business rule validation
   - Complex domain logic

3. **Services are standalone classes** (not extending BaseService):
   - Simpler code, no generic type complexity
   - Each service is focused on its domain
   - Explicit method signatures

---

## Implementation Pattern

### Controller Example

```typescript
import { ServiceName } from "../services/service.service.js";

const service = new ServiceName();

export const controllerMethod = async (req: Request, res: Response) => {
    try {
        const { param } = req.params;
        const { data } = req.body;
        
        // Call service - no DB logic here
        const result = await service.methodName(param, data);
        
        return res.status(200).json({ 
            success: true, 
            data: result 
        });
    } catch (error: any) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
```

### Service Example

```typescript
import { Model } from "../models/model.model.js";

export class ServiceName {
    /**
     * Method description
     */
    async methodName(param: string, data: CreateData): Promise<ResultType> {
        // Validate business rules
        if (!data.required) {
            throw new ValidationError("Required field missing");
        }
        
        // Database operation
        const result = await Model.create(data);
        
        // Data transformation
        return this.transformResult(result);
    }
    
    private transformResult(data: any): ResultType {
        // Transform logic here
        return data;
    }
}
```

---

## Rationale

### Why Standalone Classes Over BaseService?

**Attempted:** Generic `BaseService<T>` with CRUD methods

**Issues:**
- Complex TypeScript generic typing
- Not all models need CRUD operations
- Methods too generic, business logic still in controllers
- Type inference problems

**Solution:** Standalone classes
- ✅ Simpler code
- ✅ Focused, domain-specific methods
- ✅ No type complexity
- ✅ Clear method signatures

### Why This Pattern?

1. **Testability:** Services can be unit tested without HTTP mocking
2. **Reusability:** Same service method can be called from multiple controllers/contexts
3. **Maintainability:** Business logic in one place
4. **Separation of Concerns:** Clear boundaries between layers

---

## Consequences

### Positive

- ✅ **Better testability** - Services can be unit tested independently
- ✅ **Code reuse** - Multiple controllers can use same service methods
- ✅ **Clearer architecture** - Easy to understand where logic belongs
- ✅ **Easier onboarding** - Consistent pattern across codebase

### Negative

- ⚠️ **More files** - Each domain gets a service file
- ⚠️ **Initial overhead** - Takes longer to create new features (write service first)
- ⚠️ **Migration effort** - Existing controllers need refactoring

### Neutral

- Controllers are thinner (fewer lines)
- Services have more responsibility
- Clear ownership: Controllers own HTTP, Services own business logic

---

## Examples

### Completed Refactorings

1. **DiscoveryService** - Song discovery queries
2. **PlaylistService** - Playlist CRUD operations
3. **FriendService** - Friend request management
4. **SocialService** - Social/friendship operations

See: [Sprint 3 Walkthrough](file:///Users/abhiyansainju/.gemini/antigravity/brain/42b24f28-e79f-4618-af7b-e41f67b424bc/walkthrough.md)

---

## Compliance

**Required for all new features:**
- ✅ All business logic must be in services
- ✅ Controllers must only orchestrate
- ✅ No direct DB queries in controllers

**Migration plan for existing code:**
- Refactor incrementally as features are touched
- Prioritize high-traffic endpoints
- Update during bug fixes or enhancements

---

## References

- [Sprint 3: Service Layer Refactoring](../../.gemini/antigravity/brain/42b24f28-e79f-4618-af7b-e41f67b424bc/walkthrough.md)
- Pattern: Clean Architecture / Hexagonal Architecture
- Inspiration: Domain-Driven Design service layer pattern
