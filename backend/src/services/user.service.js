import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { BaseService } from "./base.service.js";

export class UserService extends BaseService {
	constructor() {
		super(User);
	}

	/**
	 * Get all users except the current one
	 */
	async getAllExcept(currentUserId) {
		return await this.findAll({ clerkId: { $ne: currentUserId } });
	}

	/**
	 * Get a user by ID and throw if not found
	 */
	async getUserByIdOrThrow(userId) {
		const user = await this.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}

	/**
	 * Get messages exchanged between two users
	 */
	async getMessagesBetweenUsers(userId1, userId2) {
		return await Message.find({
			$or: [
				{ senderId: userId1, receiverId: userId2 },
				{ senderId: userId2, receiverId: userId1 },
			],
		}).sort({ createdAt: 1 });
	}
}
