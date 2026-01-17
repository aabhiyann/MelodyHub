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
