import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express'
import fileUpload from 'express-fileupload';
import path from "path";
import cors from 'cors';
import fs from "fs";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statRoutes from './routes/stat.route.js';
import aiRoutes from './routes/ai.route.js';
import messageRoutes from './routes/message.route.js';
import healthRoutes from './routes/health.route.js';
import discoveryRoutes from './routes/discovery.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import socialRoutes from './routes/social.route.js';
import lyricsRoutes from './routes/lyrics.route.js';
import activityRoutes from './routes/activity.route.js';
import friendRoutes from './routes/friend.route.js';
import notificationRoutes from './routes/notification.route.js';
import recommendationRoutes from './routes/recommendation.route.js';
import moodRoutes from './routes/mood.route.js';
import gamificationRoutes from './routes/gamification.route.js';
import { validateEnv } from './lib/env.js';
import { requestLogger } from './middleware/logger.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();
validateEnv();

const app = express();

// Rate Limiting Configuration
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === "production" ? 100 : 1000, // 100 in prod, 1000 in dev
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});

const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes  
    max: process.env.NODE_ENV === "production" ? 10 : 100, // 10 in prod, 100 in dev
    message: "Too many requests to this endpoint, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply general rate limiting to all API routes
if (process.env.NODE_ENV === "production") {
    app.use("/api", generalLimiter);
}

const rootDir = path.resolve();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        // Allow any vercel.app subdomain
        if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));
app.use(compression());

app.use(clerkMiddleware());
app.use(express.json());

// Request logging middleware
if (process.env.NODE_ENV !== 'test') {
    app.use(requestLogger);
}

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(rootDir, 'tmp'),
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 },
}));

// API Documentation (Swagger)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MelodyHub API Documentation',
}));

// Health check routes (public, no auth required)
app.use("/api/health", healthRoutes);

// API routes
app.use("/api/users", userRoutes);
app.use("/api/admin", process.env.NODE_ENV === "production" ? strictLimiter : (req, res, next) => next(), adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/discovery", discoveryRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/ai", process.env.NODE_ENV === "production" ? strictLimiter : (req, res, next) => next(), aiRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/lyrics", lyricsRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/gamification", gamificationRoutes);

// Removed static serving for frontend as frontend is hosted separately on Vercel

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error("Global Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : errorMessage });
});

export { app };
