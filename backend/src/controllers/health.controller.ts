import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { BaseController } from './base.controller.js';

export class HealthController extends BaseController {
    constructor() {
        super();
    }

    /**
     * Basic health check endpoint
     * Returns service status and uptime
     */
    async getHealth(req: Request, res: Response, next: NextFunction) {
        try {
            const healthData = {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development',
            };

            this.handleSuccess(res, healthData);
        } catch (error) {
            this.handleError(next, error);
        }
    }

    /**
     * Detailed health check with service dependencies
     * Checks database connection and external services
     */
    async getDetailedHealth(req: Request, res: Response, next: NextFunction) {
        try {
            // Check database connection
            const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

            const healthData = {
                status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development',
                services: {
                    database: dbStatus,
                    mongodb: {
                        status: dbStatus,
                        name: mongoose.connection.name || 'unknown',
                    },
                },
                system: {
                    platform: process.platform,
                    nodeVersion: process.version,
                    memory: {
                        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
                        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
                    },
                },
            };

            // Return 503 if unhealthy, 200 if healthy
            if (healthData.status === 'unhealthy') {
                return res.status(503).json(healthData);
            }

            this.handleSuccess(res, healthData);
        } catch (error) {
            this.handleError(next, error);
        }
    }

    /**
     * Kubernetes readiness probe
     * Returns 200 if app is ready to serve traffic
     */
    async getReadiness(req: Request, res: Response, next: NextFunction) {
        try {
            const isReady = mongoose.connection.readyState === 1;

            if (!isReady) {
                return res.status(503).json({
                    status: 'not ready',
                    reason: 'database not connected',
                });
            }

            res.status(200).json({
                status: 'ready',
            });
        } catch (error) {
            res.status(503).json({
                status: 'not ready',
                error: 'health check failed',
            });
        }
    }

    /**
     * Kubernetes liveness probe
     * Returns 200 if the application is alive
     */
    async getLiveness(req: Request, res: Response, next: NextFunction) {
        res.status(200).json({
            status: 'alive',
            timestamp: new Date().toISOString(),
        });
    }
}
