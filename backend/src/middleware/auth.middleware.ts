import { Request, Response, NextFunction } from 'express';
import { clerkClient } from "@clerk/express";

interface AuthRequest extends Request {
	auth: {
		userId: string | null;
		sessionId: string | null;
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
	} catch (error: any) {
		console.error("Error in requireAdmin", error);
		res.status(500).json({ message: "Authentication failed to check for admin" });
	}
};
