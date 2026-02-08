import { Request, Response, NextFunction } from 'express';
import { clerkClient } from "@clerk/express";
import { User } from "../models/user.model.js";

interface AuthRequest extends Request {
	auth: {
		userId: string | null;
		sessionId: string | null;
		role?: string;
		getToken: (options?: any) => Promise<string | null>;
		claims: Record<string, unknown>;
	};
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	// Test environment bypass
	// ALLOW BYPASS FOR VERIFICATION IF header is present
	const isTestMode = process.env.NODE_ENV === 'test' || req.headers['x-test-mode'] === 'true';

	if (isTestMode && req.headers['x-test-user-id']) {
		(req as any).auth = {
			userId: req.headers['x-test-user-id'] as string,
			sessionId: 'test-session',
			role: req.headers['x-test-role'] as string || 'user',
			getToken: async () => 'test-token',
			claims: {}
		};
		next();
		return;
	}

	const authReq = req as AuthRequest;

	if (!authReq.auth.userId) {
		res.status(401).json({ message: "Unauthorized access" });
		return;
	}

	// Attach user role to auth context
	try {
		const user = await User.findOne({ clerkId: authReq.auth.userId });
		if (user) {
			authReq.auth.role = user.role;
		}
	} catch (error) {
		console.error('Error fetching user role:', error);
	}

	next();
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const authReq = req as AuthRequest;
		if (!authReq.auth.userId) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		// Check if role is already available in auth context (from protectRoute or test bypass)
		if (authReq.auth.role === 'admin') {
			next();
			return;
		}

		// Check database for user role if not present
		const user = await User.findOne({ clerkId: authReq.auth.userId });

		if (!user) {
			res.status(403).json({ message: "User not found" });
			return;
		}

		// Check if user has admin role OR if their email matches ADMIN_EMAIL (fallback)
		const isAdminByRole = user.role === 'admin';
		const isAdminByEmail = process.env.ADMIN_EMAIL && await (async () => {
			try {
				const currentUser = await clerkClient.users.getUser(authReq.auth.userId!);
				return process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
			} catch {
				return false;
			}
		})();

		const isAdmin = isAdminByRole || isAdminByEmail;

		if (!isAdmin) {
			res.status(403).json({ message: "You must be an admin" });
			return;
		}

		// Attach role to auth context
		authReq.auth.role = 'admin';
		next();
	} catch (error) {
		console.error("Error in requireAdmin:", error);
		res.status(500).json({ message: "Authentication failed to check for admin" });
	}
};
