import { Notification, INotification, NotificationType } from "../models/notification.model.js";

export interface CreateNotificationInput {
    userId: string;
    type: NotificationType;
    title: string;
    body?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Create a notification and return it (caller can emit via socket)
 */
export async function createNotification(input: CreateNotificationInput): Promise<INotification> {
    const doc = await Notification.create({
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body ?? "",
        metadata: input.metadata ?? {},
        read: false,
    });
    return doc;
}

export async function getNotifications(
    userId: string,
    options: { unreadOnly?: boolean; page?: number; limit?: number } = {}
): Promise<{ data: INotification[]; total: number; unreadCount: number }> {
    const { unreadOnly = false, page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;
    const filter: any = { userId };
    if (unreadOnly) filter.read = false;

    const [data, total, unreadCount] = await Promise.all([
        Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Notification.countDocuments(filter),
        Notification.countDocuments({ userId, read: false }),
    ]);
    return { data: data as INotification[], total, unreadCount };
}

export async function markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
    const doc = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { read: true },
        { new: true }
    );
    return doc;
}

export async function markAllAsRead(userId: string): Promise<number> {
    const result = await Notification.updateMany({ userId, read: false }, { read: true });
    return result.modifiedCount;
}

export async function deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    const result = await Notification.deleteOne({ _id: notificationId, userId });
    return result.deletedCount === 1;
}
