import { app } from './app.js';
import { createServer } from "http";
import { initializeSocket } from './lib/socket.js';
import { connectDB, connectRedis } from './lib/db.js';
import cron from "node-cron";
import fs from "fs";
import path from "path";
import { GamificationService } from './services/gamification.service.js';

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Initialize Socket.io
initializeSocket(httpServer);

// Temp cleanup cron
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

// Gamification cron
cron.schedule("0 0 * * *", () => {
	console.log("Running daily gamification tasks...");
	GamificationService.updateStreaks();
	GamificationService.generateDailyChallenges();
});

// Start Server
httpServer.listen(PORT, async () => {
	console.log("🚀 Server is running on port " + PORT);

	// Initialize MongoDB
	await connectDB();

	// Initialize Redis (optional - app works without it)
	await connectRedis();

	console.log('📚 API Documentation: http://localhost:' + PORT + '/api-docs');
});
