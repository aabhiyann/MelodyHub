import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server: HttpServer) => {
	const io = new Server(server, {
		cors: {
			origin: [
				"http://localhost:3000",
				"http://localhost:5173",
				"http://localhost:5174",
				"http://localhost:5175",
				"https://udaymelodyhhub.vercel.app"
			],
			credentials: true,
		},
	});

	const userSockets = new Map<string, string>(); // { userId: socketId}
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

		socket.on("disconnect", () => {
			let disconnectedUserId: string | undefined;
			for (const [userId, socketId] of userSockets.entries()) {
				// find disconnected user
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}
			if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
			}
		});
	});
};
