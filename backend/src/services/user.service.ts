import { User, IUser } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { BaseService } from "./base.service.js";
import { UserConnection } from "../models/user.connection.model.js";

export class UserService extends BaseService<IUser> {
	constructor() {
		super(User);
	}

	/**
	 * Get all users except the current one
	 */
	async getAllExcept(currentUserId: string) {
		return await this.findAll({ clerkId: { $ne: currentUserId } });
	}

	/**
	 * Get a user by ID and throw if not found
	 */
	async getUserByIdOrThrow(userId: string) {
		const user = await this.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}

	/**
	 * Get messages exchanged between two users
	 */
	async getMessagesBetweenUsers(userId1: string, userId2: string) {
		return await Message.find({
			$or: [
				{ senderId: userId1, receiverId: userId2 },
				{ senderId: userId2, receiverId: userId1 },
			],
		}).sort({ createdAt: 1 });
	}

	/**
	 * Get user by Clerk ID
	 */
	async getByClerkId(clerkId: string) {
		return await this.model.findOne({ clerkId });
	}

	/**
	 * Update user profile
	 */
	async updateProfile(clerkId: string, updates: Partial<IUser>) {
		return await User.findOneAndUpdate(
			{ clerkId },
			{ $set: updates },
			{ new: true }
		);
	}

	/**
	 * Follow a user
	 */
	async followUser(followerId: string, followingId: string) {
		if (followerId === followingId) {
			throw new Error("Cannot follow yourself");
		}

		const existingConnection = await UserConnection.findOne({
			followerId,
			followingId
		});

		if (existingConnection) {
			return existingConnection;
		}

		return await UserConnection.create({
			followerId,
			followingId,
		});
	}

	/**
	 * Unfollow a user
	 */
	async unfollowUser(followerId: string, followingId: string) {
		return await UserConnection.findOneAndDelete({
			followerId,
			followingId
		});
	}

	/**
	 * Get connection status
	 */
	async getConnectionStatus(followerId: string, followingId: string) {
		const connection = await UserConnection.findOne({
			followerId,
			followingId
		});
		return !!connection;
	}

	/**
	 * Get followers and following counts
	 */
	async getUserStats(userId: string) {
		const [followersCount, followingCount] = await Promise.all([
			UserConnection.countDocuments({ followingId: userId }),
			UserConnection.countDocuments({ followerId: userId })
		]);
		return { followersCount, followingCount };
	}
}
