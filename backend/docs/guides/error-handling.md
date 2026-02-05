# Error Handling Guide

Best practices for error handling in MelodyHub backend.

---

## Error Types

We use custom error classes for consistent error handling across the API.

### Available Error Classes

**File:** `backend/src/utils/errors.ts`

```typescript
import {
    ValidationError,      // 400 - Invalid request data
    UnauthorizedError,    // 401 - Missing/invalid authentication
    ForbiddenError,       // 403 - Authenticated but no permission
    NotFoundError,        // 404 - Resource not found
    ConflictError,        // 409 - Duplicate/conflict
    RateLimitError,       // 429 - Too many requests
    ExternalServiceError, // 502 - External API failure
    DatabaseError         // 500 - Database operation failure
} from "../utils/errors.js";
```

---

## Using Error Classes

### 1. Validation Errors (400)

Use when request data fails validation.

```typescript
import { ValidationError, ValidationErrorDetail } from "../utils/errors.js";

// Simple validation error
if (!email) {
    throw new ValidationError("Email is required");
}

// With field details
const errors: ValidationErrorDetail[] = [
    { field: "email", message: "Invalid email format" },
    { field: "password", message: "Must be at least 8 characters" }
];
throw new ValidationError("Validation failed", errors);
```

### 2. Not Found Errors (404)

Use when a requested resource doesn't exist.

```typescript
import { NotFoundError } from "../utils/errors.js";

const user = await User.findById(userId);
if (!user) {
    throw new NotFoundError("User");
}

// Custom message
const playlist = await Playlist.findById(id);
if (!playlist) {
    throw new NotFoundError("Playlist");
}
```

### 3. Authorization Errors (401 / 403)

```typescript
import { UnauthorizedError, ForbiddenError } from "../utils/errors.js";

// 401 - No authentication
if (!userId) {
    throw new UnauthorizedError();
}

// 403 - Authenticated but no permission
if (playlist.userId !== currentUserId) {
    throw new ForbiddenError("You don't have permission to edit this playlist");
}
```

### 4. Conflict Errors (409)

Use for duplicate resources or state conflicts.

```typescript
import { ConflictError } from "../utils/errors.js";

const existing = await User.findOne({ email });
if (existing) {
    throw new ConflictError("User with this email already exists");
}
```

### 5. External Service Errors (502)

Use when external APIs fail.

```typescript
import { ExternalServiceError } from "../utils/errors.js";

try {
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) {
        throw new ExternalServiceError("ExampleAPI", {
            code: "API_ERROR",
            info: `Status ${response.status}`
        });
    }
} catch (error) {
    throw new ExternalServiceError("ExampleAPI", {
        code: "NETWORK_ERROR",
        info: error.message
    });
}
```

### 6. Database Errors (500)

Use for database operation failures.

```typescript
import { DatabaseError } from "../utils/errors.js";

try {
    await Model.create(data);
} catch (error: any) {
    if (error.code === 11000) { // MongoDB duplicate key
        throw new ConflictError("Duplicate entry");
    }
    throw new DatabaseError("Failed to create record", {
        operation: "create",
        model: "Model"
    });
}
```

---

## Error Handling in Controllers

Controllers should catch service errors and translate them to HTTP responses.

### Pattern

```typescript
export const controllerMethod = async (req: Request, res: Response) => {
    try {
        // Call service
        const result = await service.method(params);
        
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error("Error in method:", error);
        
        // Handle specific error types
        if (error instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                message: error.message,
                details: error.details
            });
        }
        
        if (error instanceof NotFoundError) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        if (error instanceof ForbiddenError) {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }
        
        // Generic error fallback
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
```

### Simplified Pattern (Using Error Middleware)

Our error middleware automatically handles custom errors:

```typescript
export const controllerMethod = async (req: Request, res: Response) => {
    try {
        const result = await service.method(params);
        return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        // Just log and re-throw - middleware will handle it
        console.error("Error:", error);
        throw error; // or use next(error) in Express
    }
};
```

---

## Error Handling in Services

Services should throw appropriate errors - controllers will handle HTTP translation.

### Example Service

```typescript
export class PlaylistService {
    async getById(id: string, userId?: string): Promise<IPlaylist> {
        // 1. Check if exists
        const playlist = await Playlist.findById(id);
        if (!playlist) {
            throw new NotFoundError("Playlist");
        }
        
        // 2. Check permissions
        if (playlist.isPrivate && playlist.userId !== userId) {
            throw new ForbiddenError("This playlist is private");
        }
        
        // 3. Return result
        return playlist;
    }
    
    async update(
        id: string,
        userId: string,
        updates: UpdateData
    ): Promise<IPlaylist> {
        // 1. Validate
        if (!updates.name && !updates.description) {
            throw new ValidationError("At least one field required", [
                { field: "name", message: "Name or description required" }
            ]);
        }
        
        // 2. Find and check ownership
        const playlist = await Playlist.findById(id);
        if (!playlist) {
            throw new NotFoundError("Playlist");
        }
        
        if (playlist.userId !== userId) {
            throw new ForbiddenError("Not authorized");
        }
        
        // 3. Update
        try {
            Object.assign(playlist, updates);
            await playlist.save();
            return playlist;
        } catch (error: any) {
            throw new DatabaseError("Failed to update playlist");
        }
    }
}
```

---

## Response Format

All API responses follow this format:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "details": [ ... ],  // Optional, for validation errors
  "error": "error details"  // Optional, in development only
}
```

---

## Best Practices

### ✅ DO

1. **Use specific error types**
   ```typescript
   // Good ✅
   throw new NotFoundError("User");
   
   // Bad ❌
   throw new Error("User not found");
   ```

2. **Provide helpful messages**
   ```typescript
   // Good ✅
   throw new ForbiddenError("You must be the playlist owner to delete it");
   
   // Bad ❌
   throw new ForbiddenError("Access denied");
   ```

3. **Include field details for validation errors**
   ```typescript
   throw new ValidationError("Validation failed", [
       { field: "email", message: "Invalid format" },
       { field: "age", message: "Must be 18 or older" }
   ]);
   ```

4. **Log errors for debugging**
   ```typescript
   try {
       // ...
   } catch (error: any) {
       console.error("Failed to process:", error);
       throw error;
   }
   ```

### ❌ DON'T

1. **Don't swallow errors**
   ```typescript
   // Bad ❌
   try {
       await dangerousOperation();
   } catch (error) {
       // Silent failure
   }
   ```

2. **Don't expose sensitive info**
   ```typescript
   // Bad ❌
   throw new Error(`Database connection string: ${dbUrl}`);
   
   // Good ✅
   throw new DatabaseError("Connection failed");
   ```

3. **Don't use generic errors for known cases**
   ```typescript
   // Bad ❌
   throw new Error("Not found");
   
   // Good ✅
   throw new NotFoundError("Playlist");
   ```

---

## Error Middleware

**File:** `backend/src/middleware/errorHandler.ts`

Centralized error handling middleware (already set up):

```typescript
export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // AppError instances have statusCode and message
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            code: error.code,
            details: error.details
        });
    }
    
    // Unknown errors
    console.error("Unexpected error:", error);
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};
```

---

## Testing Error Handling

```typescript
describe("PlaylistService", () => {
    it("should throw NotFoundError for invalid ID", async () => {
        await expect(
            service.getById("invalid-id")
        ).rejects.toThrow(NotFoundError);
    });
    
    it("should throw ForbiddenError for unauthorized access", async () => {
        const playlist = await createPrivatePlaylist();
        
        await expect(
            service.getById(playlist.id, "different-user")
        ).rejects.toThrow(ForbiddenError);
    });
    
    it("should throw ValidationError for invalid data", async () => {
        await expect(
            service.create("user-id", { name: "" })
        ).rejects.toThrow(ValidationError);
    });
});
```

---

## Related

- [ADR 002: TypeScript Type Safety](../adr/002-typescript-type-safety.md)
- [Creating Endpoints Guide](./creating-endpoints.md)
- Source: `backend/src/utils/errors.ts`
