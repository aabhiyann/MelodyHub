import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { Message } from "../models/message.model.js";

let _io: Server | null = null;
const _userSockets = new Map<string, string>();

/** Emit event to a user by Clerk ID (if they are connected). Used for real-time notifications. */
export function emitToUser(userId: string, event: string, data: unknown): void {
	if (_io) {
		const socketId = _userSockets.get(userId);
		if (socketId) _io.to(socketId).emit(event, data);
	}
}

export const initializeSocket = (server: HttpServer) => {
	const allowedOrigins = [
		"http://localhost:5173",
		"http://localhost:5174",
		"http://localhost:5175",
		"http://localhost:3000",
		"https://melodyhubmusic.vercel.app"
	];

	const io = new Server(server, {
		cors: {
			origin: (origin, callback) => {
				if (!origin) return callback(null, true);
				if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
					return callback(null, true);
				}
				callback(new Error('Not allowed by CORS'));
			},
			credentials: true,
		},
	});
	_io = io;

	const userSockets = _userSockets;
	const userActivities = new Map<string, string>(); // {userId: activity}

	io.on("connection", (socket) => {
		socket.on("user_connected", (userId: string) => {
			userSockets.set(userId, socket.id);
			userActivities.set(userId, "Idle");

			// broadcast to all connected sockets that this user just logged in
			io.emit("user_connected", userId);

			socket.emit("users_online", Array.from(userSockets.keys()));

			io.emit("activities", Array.from(userActivities.entries()));
		});

		socket.on("update_activity", ({ userId, activity }: { userId: string; activity: string }) => {
			console.log("activity updated", userId, activity);
			userActivities.set(userId, activity);
			io.emit("activity_updated", { userId, activity });
		});

		socket.on("send_message", async (data: { senderId: string; receiverId: string; content: string }) => {
			try {
				const { senderId, receiverId, content } = data;

				const message = await Message.create({
					senderId,
					receiverId,
					content,
				});

				// send to receiver in realtime, if they're online
				const receiverSocketId = userSockets.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receive_message", message);
				}

				socket.emit("message_sent", message);
			} catch (error: any) {
				console.error("Message error:", error);
				socket.emit("message_error", error.message);
			}
		});

		socket.on("typing", ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
			const receiverSocketId = userSockets.get(receiverId);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit("user_typing", { senderId });
			}
		});

		// Live Listener Logic
		socket.on("user_playing", (songId: string) => {
			try {
				const userId = Array.from(userSockets.entries()).find(([_, sid]) => sid === socket.id)?.[0];
				if (!userId) return;

				// Leave previous song room if exists
				const previousSong = userActivities.get(userId)?.split(":")?.[1]; // simplified tracking needed?
				// Actually, socket.rooms contains all rooms. We need to identify song rooms.
				// Pattern: song:{songId}

				// Identify and leave previous song rooms
				for (const room of socket.rooms) {
					if (room.startsWith("song:")) {
						socket.leave(room);
						const prevSongId = room.split(":")[1];
						// Emit update to previous room
						const count = io.sockets.adapter.rooms.get(room)?.size || 0;
						io.to(room).emit("song_listeners", { songId: prevSongId, count });
					}
				}

				// Join new song room
				const newRoom = `song:${songId}`;
				socket.join(newRoom);

				// Emit update to new room
				const count = io.sockets.adapter.rooms.get(newRoom)?.size || 0;
				io.to(newRoom).emit("song_listeners", { songId, count });

				// Update activity
				// userActivities.set(userId, `Playing:${songId}`); // Optional: specific tracking
			} catch (error) {
				console.error("Socket user_playing error:", error);
			}
		});

		socket.on("disconnect", () => {
			let disconnectedUserId: string | undefined;
			for (const [userId, socketId] of Array.from(userSockets.entries())) {
				// find disconnected user
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}

			// Handle song room cleanup implicitly by disconnect, but might want to broadcast decrement
			// socket.io handles leaving rooms on disconnect automatically.
			// BUT we might want to broadcast the new count.
			// However, since socket is disconnected, we can't iterate its rooms easily here?
			// Actually, "disconnecting" event gives access to rooms before leaving.

			if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
			}
		});

		socket.on("disconnecting", () => {
			for (const room of socket.rooms) {
				if (room.startsWith("song:")) {
					const songId = room.split(":")[1];
					// The socket is still in the room, so size includes it. After this event, it drops.
					// So we should emit (size - 1).
					const count = (io.sockets.adapter.rooms.get(room)?.size || 1) - 1;
					io.to(room).emit("song_listeners", { songId, count });
				}
			}
		});
	});
};
