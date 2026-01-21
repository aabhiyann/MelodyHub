import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        // If it's a pagination schema (or anything using query strings), we might want to validate req.query
        // For now, consistent with common patterns, we mostly validate req.body unless specified otherwise.
        // However, pagination is usually in query.
        // Let's check if the schema looks for query params or body. 
        // A simple heuristic or explicit separate middleware is safer.
        // For this implementation, I'll default to parsing body for POST/PUT and query for GET if we want.
        // BUT, usually validates body. Let's start with body.

        // Actually, to handle both efficiently without over-engineering:
        // We can merge them or just pass a 'target' param. 
        // Let's keep it simple: Validate BODY by default.

        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation Error", errors: error.issues });
        }
        next(error);
    }
};

export const validateQuery = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        // We assign back to req.query to force the type, effectively trusting the schema validation
        req.query = schema.parse(req.query) as any;
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid Query Parameters", errors: error.issues });
        }
        next(error);
    }
}
