import { User, IUser } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { BaseService } from "./base.service.js";
import { UserConnection, IUserConnection } from "../models/user.connection.model.js";
import { Types } from "mongoose";
import { redisService } from "./redis.service.js";

export class UserService extends BaseService<IUser> {
	constructor() {
		super(User);
	}

	/**
	 * Get all users except the current one
	 */
	async getAllExcept(currentUserId: string) {
		const cacheKey = "users:all";
		let users = await redisService.get<IUser[]>(cacheKey);

		if (!users) {
			users = await this.findAll({});
			await redisService.set(cacheKey, users, 3600); // 1 hour
		}

		return users.filter((u) => u.clerkId !== currentUserId);
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
		const cacheKey = `users:profile:${clerkId}`;
		const cached = await redisService.get<IUser>(cacheKey);
		if (cached) return new User(cached); // Hydrate mongoose model if needed, or return raw IF controllers handle it.
		// NOTE: Controllers expect Mongoose document usually. Hydrating might be safer. 
		// Actually, auth middleware just needs .role. User.findOne returns Document.
		// If I return plain object, it might break code expecting .save() or virtuals.
		// For now, let's return plain object and ensure callers handle it or hydrate it. 
		// BUT `updateProfile` calls `findOneAndUpdate` which returns Document.
		// `protectRoute` accesses `user.role`. Plain object works.
		// `UserService` extends `BaseService`.
		// Let's rely on DB for now for safety OR hydrate. Hydrating: `new User(cached)` (but check isNew).

		const user = await this.model.findOne({ clerkId });
		if (user) {
			await redisService.set(cacheKey, user, 3600);
		}
		return user;
	}

	/**
	 * Find or create user by Clerk ID during authentication
	 */
	async findOrCreateByClerkId(
		clerkId: string,
		userData: { firstName?: string; lastName?: string; imageUrl?: string }
	) {
		let user = await this.model.findOne({ clerkId });

		if (!user) {
			user = await this.model.create({
				clerkId,
				fullName: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
				imageUrl: userData.imageUrl
			});
		} else {
			// Update user info if existing
			user.fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
			user.imageUrl = userData.imageUrl || "";
			await user.save();
		}

		// Invalidate
		await redisService.del(`users:profile:${clerkId}`);
		await redisService.del("users:all");

		return user;
	}

	/**
	 * Update user profile
	 */
	async updateProfile(clerkId: string, updates: Partial<IUser>) {
		const user = await User.findOneAndUpdate(
			{ clerkId },
			{ $set: updates },
			{ new: true }
		);

		if (user) {
			await redisService.del(`users:profile:${clerkId}`);
			await redisService.del("users:all");
		}
		return user;
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

	/**
	 * Get followers list with pagination (users who follow the given user)
	 */
	async getFollowersPaginated(userId: string, page: number = 1, limit: number = 20) {
		const skip = (page - 1) * limit;
		const connections = await UserConnection.find({ followingId: userId })
			.populate("followerId", "fullName imageUrl clerkId")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean();
		const total = await UserConnection.countDocuments({ followingId: userId });
		// Type assertion for populated document
		type PopulatedConnection = Omit<IUserConnection, 'followerId'> & {
			followerId: { _id: Types.ObjectId; fullName?: string; imageUrl?: string; clerkId: string };
		};
		const data = (connections as unknown as PopulatedConnection[]).map((c) => ({
			...c.followerId,
			_id: c.followerId?._id,
			followedAt: c.createdAt,
		}));
		return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
	}

	/**
	 * Get following list with pagination (users the given user follows)
	 */
	async getFollowingPaginated(userId: string, page: number = 1, limit: number = 20) {
		const skip = (page - 1) * limit;
		const connections = await UserConnection.find({ followerId: userId })
			.populate("followingId", "fullName imageUrl clerkId")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean();
		const total = await UserConnection.countDocuments({ followerId: userId });
		// Type assertion for populated document  
		type PopulatedConnection = Omit<IUserConnection, 'followingId'> & {
			followingId: { _id: Types.ObjectId; fullName?: string; imageUrl?: string; clerkId: string };
		};
		const data = (connections as unknown as PopulatedConnection[]).map((c) => ({
			...c.followingId,
			_id: c.followingId?._id,
			followedAt: c.createdAt,
		}));
		return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
	}

	/**
	 * Get mutual friends (users who are both followers of the target and in the current user's friends or following)
	 * For "mutual" we interpret as: users that the current user and the target user both follow (mutual following)
	 * Or: users that are in both users' friends lists. The plan says "mutual friends" - so friends in common.
	 * User model has friends: ObjectId[]. So mutual friends = intersection of user1.friends and user2.friends.
	 */
	async getMutualFriends(userId: string, targetUserId: string) {
		const [user1, user2] = await Promise.all([
			User.findById(userId).select("friends").lean(),
			User.findById(targetUserId).select("friends").lean(),
		]);
		if (!user1 || !user2) return [];
		const set1 = new Set((user1.friends || []).map((id: Types.ObjectId) => id.toString()));
		const mutual = (user2.friends || []).filter((id: Types.ObjectId) => set1.has(id.toString()));
		const users = await User.find({ _id: { $in: mutual } }).select("fullName imageUrl clerkId").lean();
		return users;
	}
}
