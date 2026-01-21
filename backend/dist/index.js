import express from 'express';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import fileUpload from 'express-fileupload';
import { initializeSocket } from './lib/socket.js';
import path from "path";
import cors from 'cors';
import cron from "node-cron";
import fs from "fs";
import { createServer } from "http";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config.js';
import { redisService } from './services/redis.service.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statRoutes from './routes/stat.route.js';
import aiRoutes from './routes/ai.route.js';
import messageRoutes from './routes/message.route.js';
import healthRoutes from './routes/health.route.js';
import discoveryRoutes from './routes/discovery.route.js'; // New discovery routes
import analyticsRoutes from './routes/analytics.route.js'; // New analytics routes
import socialRoutes from './routes/social.route.js'; // Social & playlist routes
import { connectDB } from './lib/db.js';
import { validateEnv } from './lib/env.js';
import { requestLogger } from './middleware/logger.middleware.js';
dotenv.config();
validateEnv();
const app = express();
const PORT = process.env.PORT || 5000;
// Rate Limiting (only in production)
if (process.env.NODE_ENV === "production") {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: "Too many requests from this IP, please try again after 15 minutes"
    });
    app.use("/api", limiter);
}
const __dirname = path.resolve();
const httpServer = createServer(app);
initializeSocket(httpServer);
const allowedOrigins = [
    "https://udaymelodyhhub.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log("CORS blocked origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    exposedHeaders: ['set-cookie'],
}));
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for now to prevent breaking Cloudinary/Clerk
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
    tempFileDir: path.join(__dirname, 'tmp'),
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 },
}));
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
    if (fs.existsSync(tempDir)) {
        fs.readdir(tempDir, (err, files) => {
            if (err) {
                console.log("error", err);
                return;
            }
            for (const file of files) {
                fs.unlink(path.join(tempDir, file), (err) => { });
            }
        });
    }
});
// API Documentation (Swagger)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MelodyHub API Documentation',
}));
// Health check routes (public, no auth required)
app.use("/api/health", healthRoutes);
// API routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", discoveryRoutes); // Discovery routes (featured, trending, etc.)
app.use("/api/songs", songRoutes); // Other song routes
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/analytics", analyticsRoutes); // Analytics routes
app.use("/api/social", socialRoutes); // Social & playlist routes
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
    });
}
app.use((err, req, res, next) => {
    res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});
httpServer.listen(PORT, async () => {
    console.log("🚀 Server is running on port " + PORT);
    // Initialize MongoDB
    await connectDB();
    // Initialize Redis (optional - app works without it)
    if (process.env.NODE_ENV === 'production' || process.env.REDIS_URL) {
        await redisService.connect();
    }
    else {
        console.log('ℹ️  Redis disabled in development (set REDIS_URL to enable)');
    }
    console.log('📚 API Documentation: http://localhost:' + PORT + '/api-docs');
});
