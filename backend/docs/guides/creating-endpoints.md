# Developer Guide: Creating New Endpoints

This guide shows you how to create a new API endpoint following MelodyHub's architecture patterns.

---

## Overview

**Architecture layers:**
1. **Route** - Defines HTTP endpoint and middleware
2. **Controller** - Handles request/response (thin layer)
3. **Service** - Contains business logic and DB operations
4. **Model** - Defines database schema

**Pattern:** Route → Controller → Service → Model

---

## Step-by-Step Guide

### 1. Create the Service

Services contain all business logic. Create one service per domain.

**File:** `backend/src/services/my-feature.service.ts`

```typescript
import { MyModel, IMyModel } from "../models/my-model.model.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";

export class MyFeatureService {
    /**
     * Create a new resource
     */
    async create(userId: string, data: CreateData): Promise<IMyModel> {
        // 1. Validate business rules
        if (!data.requiredField) {
            throw new ValidationError("Required field missing", [
                { field: "requiredField", message: "This field is required" }
            ]);
        }
        
        // 2. Check permissions
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError("User");
        }
        
        // 3. Perform database operation
        const resource = await MyModel.create({
            ...data,
            userId,
            createdAt: new Date()
        });
        
        // 4. Return result
        return resource;
    }
    
    /**
     * Get resource by ID
     */
    async getById(id: string, userId?: string): Promise<IMyModel | null> {
        const resource = await MyModel.findById(id).lean();
        
        if (!resource) {
            return null;
        }
        
        // Check if user has permission to view
        if (resource.isPrivate && resource.userId !== userId) {
            throw new ForbiddenError("Access denied");
        }
        
        return resource;
    }
    
    /**
     * Update resource
     */
    async update(
        id: string, 
        userId: string, 
        updates: UpdateData
    ): Promise<IMyModel | null> {
        // Find and verify ownership
        const resource = await MyModel.findById(id);
        
        if (!resource) {
            throw new NotFoundError("Resource");
        }
        
        if (resource.userId !== userId) {
            throw new ForbiddenError("Not authorized to update");
        }
        
        // Apply updates
        Object.assign(resource, updates);
        await resource.save();
        
        return resource;
    }
    
    /**
     * Delete resource
     */
    async delete(id: string, userId: string): Promise<void> {
        const resource = await MyModel.findById(id);
        
        if (!resource) {
            throw new NotFoundError("Resource");
        }
        
        if (resource.userId !== userId) {
            throw new ForbiddenError("Not authorized to delete");
        }
        
        await resource.deleteOne();
    }
    
    /**
     * List resources with pagination
     */
    async list(
        userId?: string,
        page: number = 1,
        limit: number = 20
    ): Promise<{ data: IMyModel[]; total: number }> {
        const skip = (page - 1) * limit;
        
        const query = userId 
            ? { userId } 
            : { isPublic: true };
        
        const [data, total] = await Promise.all([
            MyModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            MyModel.countDocuments(query)
        ]);
        
        return { data, total };
    }
}
```

---

### 2. Create the Controller

Controllers are thin - they only handle HTTP concerns.

**File:** `backend/src/controllers/my-feature.controller.ts`

```typescript
import { Request, Response } from "express";
import { MyFeatureService } from "../services/my-feature.service.js";

const myFeatureService = new MyFeatureService();

/**
 * Create new resource
 * POST /api/my-feature
 */
export const createResource = async (req: Request, res: Response) => {
    try {
        // 1. Get user from auth middleware
        const userId = (req as any).auth?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        
        // 2. Get data from request body
        const { name, description } = req.body;
        
        // 3. Call service
        const resource = await myFeatureService.create(userId, {
            name,
            description
        });
        
        // 4. Return success response
        return res.status(201).json({
            success: true,
            data: resource,
            message: "Resource created successfully"
        });
    } catch (error: any) {
        console.error("Error creating resource:", error);
        
        // Handle specific error types
        if (error.message === "Required field missing") {
            return res.status(400).json({
                success: false,
                message: error.message,
                details: error.details
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Failed to create resource",
            error: error.message
        });
    }
};

/**
 * Get resource by ID
 * GET /api/my-feature/:id
 */
export const getResource = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).auth?.userId;
        const { id } = req.params;
        
        const resource = await myFeatureService.getById(String(id), userId);
        
        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            data: resource
        });
    } catch (error: any) {
        console.error("Error getting resource:", error);
        
        if (error.message === "Access denied") {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Failed to get resource"
        });
    }
};

/**
 * Update resource
 * PUT /api/my-feature/:id
 */
export const updateResource = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).auth?.userId;
        const { id } = req.params;
        const updates = req.body;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        
        const resource = await myFeatureService.update(
            String(id),
            userId,
            updates
        );
        
        return res.status(200).json({
            success: true,
            data: resource,
            message: "Resource updated"
        });
    } catch (error: any) {
        console.error("Error updating resource:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update resource"
        });
    }
};

/**
 * Delete resource
 * DELETE /api/my-feature/:id
 */
export const deleteResource = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).auth?.userId;
        const { id } = req.params;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        
        await myFeatureService.delete(String(id), userId);
        
        return res.status(200).json({
            success: true,
            message: "Resource deleted"
        });
    } catch (error: any) {
        console.error("Error deleting resource:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete resource"
        });
    }
};

/**
 * List resources with pagination
 * GET /api/my-feature
 */
export const listResources = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).auth?.userId;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        
        const { data, total } = await myFeatureService.list(
            userId,
            page,
            limit
        );
        
        return res.status(200).json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        console.error("Error listing resources:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to list resources"
        });
    }
};
```

---

### 3. Create the Route

Routes wire up URLs to controller methods.

**File:** `backend/src/routes/my-feature.route.ts`

```typescript
import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
    createResource,
    getResource,
    updateResource,
    deleteResource,
    listResources
} from "../controllers/my-feature.controller.js";

const router = Router();

// Public routes (no auth required)
router.get("/", listResources);
router.get("/:id", getResource);

// Protected routes (auth required)
router.post("/", requireAuth, createResource);
router.put("/:id", requireAuth, updateResource);
router.delete("/:id", requireAuth, deleteResource);

export default router;
```

---

### 4. Register the Route

Add your route to the main app.

**File:** `backend/src/index.ts`

```typescript
import myFeatureRoutes from "./routes/my-feature.route.js";

// ... other imports

app.use("/api/my-feature", myFeatureRoutes);
```

---

## Best Practices

### ✅ DO

- **Services contain all business logic**
- **Controllers are thin** (parse request → call service → return response)
- **Use proper error types** (`ValidationError`, `NotFoundError`, etc.)
- **Handle errors specifically** (different status codes for different errors)
- **Type route parameters** (`String(id)` to avoid `string | string[]` issues)
- **Document your methods** with JSDoc comments
- **Return consistent response format** (`{ success, data, message }`)

### ❌ DON'T

- **No database queries in controllers** - move to services
- **No business logic in controllers** - belongs in services
- **No `any` types** - use proper types (see ADR 002)
- **No generic error messages** - be specific

---

## Testing

### Unit Test the Service

```typescript
// __tests__/my-feature.service.test.ts
import { MyFeatureService } from "../services/my-feature.service";

describe("MyFeatureService", () => {
    let service: MyFeatureService;
    
    beforeEach(() => {
        service = new MyFeatureService();
    });
    
    it("should create a resource", async () => {
        const result = await service.create("user123", {
            name: "Test",
            description: "Test description"
        });
        
        expect(result.name).toBe("Test");
    });
});
```

### Integration Test the Endpoint

```typescript
// __tests__/my-feature.integration.test.ts
import request from "supertest";
import app from "../index";

describe("POST /api/my-feature", () => {
    it("should create a resource", async () => {
        const response = await request(app)
            .post("/api/my-feature")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Test",
                description: "Test description"
            });
        
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
    });
});
```

---

## Checklist

Before committing your new endpoint:

- [ ] Service created with business logic
- [ ] Controller created (thin layer)
- [ ] Route registered
- [ ] Proper error handling
- [ ] TypeScript types defined
- [ ] JSDoc comments added
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Tested manually with Postman/curl
- [ ] No `any` types (except error handling)

---

## Related

- [ADR 001: Service Layer Architecture](../adr/001-service-layer-architecture.md)
- [ADR 002: TypeScript Type Safety](../adr/002-typescript-type-safety.md)
- [Error Handling Guide](./error-handling.md)
