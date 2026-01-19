import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Validation middleware factory
 * Validates request body, query params, or route params against a Zod schema
 */
export const validate = (schema: ZodSchema, target: 'body' | 'query' | 'params' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dataToValidate = req[target];

            // Parse and validate the data
            const validatedData = await schema.parseAsync(dataToValidate);

            // Replace the original data with validated data
            (req as any)[target] = validatedData;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod errors into a user-friendly format
                const errors = error.issues.map((err: any) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                return res.status(400).json({
                    message: 'Validation failed',
                    errors,
                });
            }

            // Pass other errors to the error handler
            next(error);
        }
    };
};

/**
 * Validate multiple targets (body, query, params) at once
 */
export const validateMultiple = (schemas: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }
            if (schemas.query) {
                (req as any).query = await schemas.query.parseAsync(req.query);
            }
            if (schemas.params) {
                (req as any).params = await schemas.params.parseAsync(req.params);
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map((err: any) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                return res.status(400).json({
                    message: 'Validation failed',
                    errors,
                });
            }

            next(error);
        }
    };
};
