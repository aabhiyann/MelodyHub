import { Request, Response, NextFunction } from 'express';

/**
 * Simple request logging middleware
 * Logs HTTP method, URL, status code, and response time
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const { method, url } = req;

    // Log when response finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;

        // Color code based on status
        const statusColor = statusCode >= 500 ? '\x1b[31m' : // Red for 5xx
            statusCode >= 400 ? '\x1b[33m' : // Yellow for 4xx
                statusCode >= 300 ? '\x1b[36m' : // Cyan for 3xx
                    '\x1b[32m'; // Green for 2xx

        const reset = '\x1b[0m';

        console.log(
            `[${new Date().toISOString()}] ` +
            `${method} ${url} ` +
            `${statusColor}${statusCode}${reset} ` +
            `${duration}ms`
        );
    });

    next();
};
