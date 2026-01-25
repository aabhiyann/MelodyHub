import { Request, Response, NextFunction } from 'express';
import { clerkClient } from "@clerk/express";

interface AuthRequest extends Request {
	auth: {
		userId: string | null;
		sessionId: string | null;
		getToken: (options?: any) => Promise<string | null>;
		claims: any;
	};
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const authReq = req as AuthRequest;

	// Test environment bypass
	if (process.env.NODE_ENV === 'test') {
		// If mocked auth is injected by test framework logic, allow it.
		// Or if we want to simulate a user via header (easier for integration tests)
		if (req.headers['x-test-user-id']) {
			authReq.auth = {
				userId: req.headers['x-test-user-id'] as string,
				sessionId: 'test-session',
				getToken: async () => 'test-token',
				claims: {}
			};
			next();
			return;
		}
	}

	if (!authReq.auth.userId) {
		res.status(401).json({ message: "Unauthorized access" });
		return;
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

		const currentUser = await clerkClient.users.getUser(authReq.auth.userId);
		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

		if (!isAdmin) {
			res.status(403).json({ message: "You must be an admin" });
			return;
		}
		next();
	} catch (error) {
		res.status(500).json({ message: "Authentication failed to check for admin" });
	}
};
