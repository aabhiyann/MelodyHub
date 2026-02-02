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
		const data = connections.map((c: any) => ({
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
		const data = connections.map((c: any) => ({
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
		const set1 = new Set((user1.friends || []).map((id: any) => id.toString()));
		const mutual = (user2.friends || []).filter((id: any) => set1.has(id.toString()));
		const users = await User.find({ _id: { $in: mutual } }).select("fullName imageUrl clerkId").lean();
		return users;
	}
}
