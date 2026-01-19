import { clerkClient } from "@clerk/express";
export const protectRoute = async (req, res, next) => {
    const authReq = req;
    if (!authReq.auth.userId) {
        res.status(401).json({ message: "Unauthorized access" });
        return;
    }
    next();
};
export const requireAdmin = async (req, res, next) => {
    try {
        const authReq = req;
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
    }
    catch (error) {
        res.status(500).json({ message: "Authentication failed to check for admin" });
    }
};
