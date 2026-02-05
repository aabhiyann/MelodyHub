import { Request, Response, NextFunction } from "express";
import * as notificationService from "../services/notification.service.js";
import { AuthenticatedRequest } from "../types/index.js";

export class NotificationController {
    /**
     * GET /api/notifications?unreadOnly=true&page=1&limit=20
     * Get user's notifications with pagination
     */
    static async getNotifications(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthenticatedRequest).auth?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const unreadOnly = req.query.unreadOnly === "true";
            const page = parseInt(req.query.page as string) || 1;
            const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

            const result = await notificationService.getNotifications(userId, { unreadOnly, page, limit });

            return res.status(200).json({
                success: true,
                ...result
            });
        } catch (error: any) {
            console.error("Error in getNotifications:", error);
            next(error);
        }
    }

    /**
     * PUT /api/notifications/:id/read
     * Mark a notification as read
     */
    static async markAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthenticatedRequest).auth?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const notification = await notificationService.markAsRead(String(req.params.id), userId);

            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: "Notification not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: notification
            });
        } catch (error: any) {
            console.error("Error in markAsRead:", error);
            next(error);
        }
    }

    /**
     * PUT /api/notifications/read-all
     * Mark all notifications as read
     */
    static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthenticatedRequest).auth?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const count = await notificationService.markAllAsRead(userId);

            return res.status(200).json({
                success: true,
                markedCount: count
            });
        } catch (error: any) {
            console.error("Error in markAllAsRead:", error);
            next(error);
        }
    }

    /**
     * DELETE /api/notifications/:id
     * Delete a notification
     */
    static async deleteNotification(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthenticatedRequest).auth?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const deleted = await notificationService.deleteNotification(String(req.params.id), userId);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Notification not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Deleted"
            });
        } catch (error: any) {
            console.error("Error in deleteNotification:", error);
            next(error);
        }
    }
}
