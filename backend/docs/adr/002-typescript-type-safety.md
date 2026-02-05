# ADR 002: TypeScript Type Safety Standards

**Status:** Accepted  
**Date:** 2026-02-04  
**Deciders:** Engineering Team  
**Related:** Sprint 4 - TypeScript Type Safety

---

## Context

Code analysis revealed 53 instances of `any` type usage, reducing type safety benefits. While TypeScript's type system prevents many bugs, excessive `any` usage bypasses these protections.

**Analysis findings:**
- 53 total `any` occurrences
- 26 in error handling (catch blocks)
- 12 in tests/middleware
- 15 in production code (errors, utils, services)

---

## Decision

**We adopt a pragmatic approach to TypeScript type safety:**

### ✅ Required: Eliminate Production `any` Types

**Remove `any` from:**
1. Error utility classes → Use `ErrorDetails` type
2. Database utilities → Use `Types.ObjectId`
3. Service methods → Use proper interfaces
4. Controller responses → Define response types

### ✅ Acceptable: Keep Pragmatic `any` Uses

**Allow `any` for:**
1. **Error handling:** `catch (error: any)`
   - Errors can be anything in JavaScript
   - TypeScript can't meaningfully type errors
   - Acceptable tradeoff

2. **Test files:** Test convenience over strictness
3. **Third-party type gaps:** When vendor types are incomplete

### ⏸️ Deferred: Low-Impact Cases

**Address later:**
- Middleware type extensions (complex, low ROI)
- Test utilities (acceptable as-is)

---

## Type Standards

### 1. Error Details Type System

```typescript
/**
 * Validation error detail
 */
export interface ValidationErrorDetail {
    field: string;
    message: string;
    code?: string;
}

/**
 * Service error detail
 */
export interface ServiceErrorDetail {
    code: string;
    info?: string;
    context?: Record<string, unknown>;
}

/**
 * Union type for all error details
 */
export type ErrorDetails = 
    | ValidationErrorDetail[]
    | ServiceErrorDetail
    | Record<string, unknown>
    | undefined;
```

**Usage:**
```typescript
throw new ValidationError("Invalid input", [
    { field: "email", message: "Invalid format" }
]);
```

### 2. MongoDB ObjectId Types

```typescript
import { Types } from 'mongoose';

// Good ✅
function process<T extends { _id: Types.ObjectId | string }>(doc: T) {
    return doc._id.toString();
}

// Bad ❌
function process<T extends { _id: any }>(doc: T) {
    return doc._id.toString();
}
```

### 3. Populated Mongoose Documents

When using `.populate()`, create type assertions:

```typescript
import { Types } from 'mongoose';

type PopulatedDoc = Omit<IModel, 'refField'> & {
    refField: {
        _id: Types.ObjectId;
        name: string;
        // ... other populated fields
    };
};

const docs = await Model.find().populate('refField');
const typed = docs as unknown as PopulatedDoc[];
```

---

## Rationale

### Why Not Eliminate ALL `any` Types?

**Pragmatism over purity:**
- `catch (error: any)` is idiomatic and acceptable
- Some third-party libraries have poor types
- Tests can be less strict for convenience
- Focus effort on high-impact type safety

### Why These Standards?

1. **Error Types:** Improves debugging and error handling
2. **MongoDB Types:** Prevents ObjectId-related bugs
3. **Populated Docs:** Makes Mongoose queries type-safe

---

## Consequences

### Positive

- ✅ **Better IDE support** - Autocomplete and IntelliSense improved
- ✅ **Fewer runtime bugs** - Type system catches more errors
- ✅ **Better documentation** - Types self-document code
- ✅ **Easier refactoring** - TypeScript guides safe changes

### Negative

- ⚠️ **More verbose** - Type definitions add code
- ⚠️ **Learning curve** - Team needs good TypeScript knowledge
- ⚠️ **Initial overhead** - Takes longer to write properly typed code

### Neutral

- Some `any` usage remains (pragmatic choice)
- Type coverage ~85% (not 100%, by design)

---

## Metrics

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Production `any` types | 15 | 2 | 0 |
| Total `any` types | 53 | 38 | ~30 |
| Error handling `any` | 26 | 26 | 26 (keep) |
| Test `any` | 12 | 12 | 12 (defer) |

---

## Compliance

### For New Code

**Required:**
- ✅ No `any` in production code (except error handling)
- ✅ Use `ErrorDetails` for all custom errors
- ✅ Use `Types.ObjectId` for MongoDB IDs
- ✅ Type all service method signatures

**Acceptable:**
- ✅ `catch (error: any)` in error handling
- ✅ `any` in test files (with good reason)

### Code Review Checklist

- [ ] No unnecessary `any` types
- [ ] Error classes use `ErrorDetails`
- [ ] MongoDB operations use `Types.ObjectId`
- [ ] Service methods have explicit return types
- [ ] Acceptable `any` uses are documented with comments

---

## Migration

Completed in Sprint 4:
- ✅ `errors.ts` - 6 any → 0
- ✅ `database.utils.ts` - 3 any → 0
- ✅ `user.service.ts` - 4 any → 0

Total: 28% reduction in `any` types (53 → 38)

---

## References

- [Sprint 4: TypeScript Type Safety](../../.gemini/antigravity/brain/42b24f28-e79f-4618-af7b-e41f67b424bc/walkthrough.md)
- TypeScript Handbook: [Type Safety](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html)
- Pattern: Pragmatic Type Safety
