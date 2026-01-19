import { Router } from 'express';
import { HealthController } from '../controllers/health.controller.js';

const router = Router();
const controller = new HealthController();

// Basic health check - public endpoint
router.get('/', controller.getHealth.bind(controller));

// Detailed health check - public endpoint
router.get('/detailed', controller.getDetailedHealth.bind(controller));

// Kubernetes probes - public endpoints
router.get('/ready', controller.getReadiness.bind(controller));
router.get('/live', controller.getLiveness.bind(controller));

export default router;
