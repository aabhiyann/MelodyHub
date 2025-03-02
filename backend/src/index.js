import express from 'express';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express'
import fileUpload from 'express-fileupload';
import { initializeSocket } from './lib/socket.js';
import path from "path";
import cors from 'cors'; //to allow cross-origin requests
import cron from "node-cron";


import { createServer } from "http"; 

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js'; 
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statRoutes from './routes/stat.route.js';
import {connectDB} from './lib/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT; //if env file is empty, the port would be undefined.
const __dirname = path.resolve(); //for path to temp folder to save songs


const httpServer = createServer(app);
initializeSocket(httpServer);



const allowedOrigins = [
	"https://udaymelodyhhub.vercel.app",
	"http://localhost:5173", // optional, for local testing
	"http://localhost:5174"
  ];
  
  app.use(cors({
	origin: function (origin, callback) {
	  if (!origin || allowedOrigins.includes(origin)) {
		callback(null, true);
	  } else {
		console.log("CORS blocked origin:", origin);
		callback(new Error("Not allowed by CORS"));
	  }
	},
	credentials: true,
  }));
  
   //to allow cross-origin requests
app.use(clerkMiddleware()) //for auth.userid response
app.use(express.json()); //to parse json data
app.use(fileUpload({
useTempFiles: true,
tempFileDir: path.join(__dirname, 'tmp'),
createParentPath: true, //to create parent folder if not exist
limits: { fileSize: 10 * 1024 * 1024 }, // file zite limit to upload

}))






// cron jobs
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
	if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) {
				console.log("error", err);
				return;
			}
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {});
			}
		});
	}
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
	});
}

// error handler
app.use((err, req, res, next) => {
	res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});

httpServer.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
	connectDB();
});
// Commit 1 - Fri Sep 19 21:20:35 EDT 2025
// Commit 2 - Fri Sep 19 21:20:37 EDT 2025
// Commit 3 - Fri Sep 19 21:20:37 EDT 2025
// Commit 4 - Fri Sep 19 21:20:37 EDT 2025
// Commit 5 - Fri Sep 19 21:20:37 EDT 2025
// Commit 6 - Fri Sep 19 21:20:37 EDT 2025
// Commit 7 - Fri Sep 19 21:20:37 EDT 2025
// Commit 8 - Fri Sep 19 21:20:37 EDT 2025
// Commit 9 - Fri Sep 19 21:20:37 EDT 2025
// Commit 10 - Fri Sep 19 21:20:37 EDT 2025
// Commit 11 - Fri Sep 19 21:20:37 EDT 2025
// Commit 12 - Fri Sep 19 21:20:37 EDT 2025
// Commit 13 - Fri Sep 19 21:20:38 EDT 2025
// Commit 14 - Fri Sep 19 21:20:38 EDT 2025
// Commit 15 - Fri Sep 19 21:20:38 EDT 2025
// Commit 16 - Fri Sep 19 21:20:38 EDT 2025
// Commit 17 - Fri Sep 19 21:20:38 EDT 2025
// Commit 18 - Fri Sep 19 21:20:38 EDT 2025
// Commit 19 - Fri Sep 19 21:20:38 EDT 2025
// Commit 20 - Fri Sep 19 21:20:38 EDT 2025
// Commit 21 - Fri Sep 19 21:20:38 EDT 2025
// Commit 22 - Fri Sep 19 21:20:38 EDT 2025
// Commit 23 - Fri Sep 19 21:20:38 EDT 2025
// Commit 24 - Fri Sep 19 21:20:38 EDT 2025
// Commit 25 - Fri Sep 19 21:20:38 EDT 2025
// Commit 26 - Fri Sep 19 21:20:38 EDT 2025
// Commit 27 - Fri Sep 19 21:20:39 EDT 2025
// Commit 28 - Fri Sep 19 21:20:39 EDT 2025
// Commit 29 - Fri Sep 19 21:20:39 EDT 2025
// Commit 30 - Fri Sep 19 21:20:39 EDT 2025
// Commit 31 - Fri Sep 19 21:20:39 EDT 2025
// Commit 32 - Fri Sep 19 21:20:39 EDT 2025
// Commit 33 - Fri Sep 19 21:20:39 EDT 2025
// Commit 34 - Fri Sep 19 21:20:39 EDT 2025
// Commit 35 - Fri Sep 19 21:20:39 EDT 2025
// Commit 36 - Fri Sep 19 21:20:39 EDT 2025
// Commit 37 - Fri Sep 19 21:20:39 EDT 2025
// Commit 38 - Fri Sep 19 21:20:39 EDT 2025
// Commit 39 - Fri Sep 19 21:20:39 EDT 2025
// Commit 40 - Fri Sep 19 21:20:39 EDT 2025
// Commit 41 - Fri Sep 19 21:20:39 EDT 2025
// Commit 42 - Fri Sep 19 21:20:40 EDT 2025
// Commit 43 - Fri Sep 19 21:20:40 EDT 2025
// Commit 44 - Fri Sep 19 21:20:40 EDT 2025
// Commit 45 - Fri Sep 19 21:20:40 EDT 2025
// Commit 46 - Fri Sep 19 21:20:40 EDT 2025
// Commit 47 - Fri Sep 19 21:20:40 EDT 2025
// Commit 48 - Fri Sep 19 21:20:40 EDT 2025
// Commit 49 - Fri Sep 19 21:20:40 EDT 2025
// Commit 50 - Fri Sep 19 21:20:40 EDT 2025
// Commit 51 - Fri Sep 19 21:20:40 EDT 2025
// Commit 52 - Fri Sep 19 21:20:40 EDT 2025
// Commit 53 - Fri Sep 19 21:20:40 EDT 2025
// Commit 54 - Fri Sep 19 21:20:40 EDT 2025
// Commit 55 - Fri Sep 19 21:20:40 EDT 2025
// Commit 56 - Fri Sep 19 21:20:40 EDT 2025
// Commit 57 - Fri Sep 19 21:20:41 EDT 2025
// Commit 58 - Fri Sep 19 21:20:41 EDT 2025
// Commit 59 - Fri Sep 19 21:20:41 EDT 2025
// Commit 60 - Fri Sep 19 21:20:41 EDT 2025
// Commit 61 - Fri Sep 19 21:20:41 EDT 2025
// Commit 1 - Fri Sep 19 21:30:20 EDT 2025
// Commit 2 - Fri Sep 19 21:30:21 EDT 2025
// Commit 3 - Fri Sep 19 21:30:21 EDT 2025
// Commit 4 - Fri Sep 19 21:30:21 EDT 2025
// Commit 5 - Fri Sep 19 21:30:21 EDT 2025
// Commit 6 - Fri Sep 19 21:30:21 EDT 2025
// Commit 7 - Fri Sep 19 21:30:21 EDT 2025
// Commit 8 - Fri Sep 19 21:30:22 EDT 2025
// Commit 9 - Fri Sep 19 21:30:22 EDT 2025
// Commit 10 - Fri Sep 19 21:30:22 EDT 2025
// Commit 11 - Fri Sep 19 21:30:22 EDT 2025
// Commit 12 - Fri Sep 19 21:30:22 EDT 2025
// Commit 13 - Fri Sep 19 21:30:22 EDT 2025
// Commit 14 - Fri Sep 19 21:30:22 EDT 2025
// Commit 15 - Fri Sep 19 21:30:22 EDT 2025
// Commit 16 - Fri Sep 19 21:30:22 EDT 2025
// Commit 17 - Fri Sep 19 21:30:22 EDT 2025
// Commit 18 - Fri Sep 19 21:30:22 EDT 2025
