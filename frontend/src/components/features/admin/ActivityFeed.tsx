/**
 * ActivityFeed - Recent activity timeline for admin dashboard
 * Shows uploads, user signups, and other events
 */

import { Upload, Edit, Trash2, UserPlus, FileMusic } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ActivityFeed = () => {
    const activities = [
        {
            type: "upload",
            user: "John Doe",
            action: "uploaded new song",
            target: "Summer Nights",
            time: new Date(Date.now() - 2 * 60 * 1000), // 2 mins ago
            icon: Upload,
        },
        {
            type: "edit",
            user: "Jane Smith",
            action: "edited album",
            target: "Greatest Hits 2025",
            time: new Date(Date.now() - 15 * 60 * 1000),
            icon: Edit,
        },
        {
            type: "delete",
            user: "Admin",
            action: "deleted user",
            target: "spammer@example.com",
            time: new Date(Date.now() - 60 * 60 * 1000),
            icon: Trash2,
        },
        {
            type: "signup",
            user: "New User",
            action: "signed up",
            target: "",
            time: new Date(Date.now() - 120 * 60 * 1000),
            icon: UserPlus,
        }
    ];

    return (
        <div className="bg-white dark:bg-surface-base border border-border-subtle rounded-xl p-6 h-full">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <FileMusic className="size-5 text-brand-primary" />
                Recent Activity
            </h3>

            <div className="relative border-l border-border-subtle ml-3 space-y-8 pl-8 py-2">
                {activities.map((activity, index) => (
                    <div key={index} className="relative group">
                        {/* Timeline Dot */}
                        <div
                            className="absolute -left-[41px] top-1 size-8 rounded-full border-4 border-white dark:border-zinc-950 flex items-center justify-center transition-transform group-hover:scale-110"
                            style={{
                                background: activity.type === "upload" ? "rgba(16, 185, 129, 0.1)" :
                                    activity.type === "edit" ? "rgba(59, 130, 246, 0.1)" :
                                        activity.type === "delete" ? "rgba(239, 68, 68, 0.1)" :
                                            "rgba(34, 197, 94, 0.1)",
                                color: activity.type === "upload" ? "#10B981" :
                                    activity.type === "edit" ? "#3B82F6" :
                                        activity.type === "delete" ? "#EF4444" :
                                            "#22C55E"
                            }}
                        >
                            <activity.icon size={14} />
                        </div>

                        <div className="flex flex-col">
                            <p className="text-sm text-text-secondary">
                                <span className="font-semibold text-zinc-900 dark:text-white">{activity.user}</span> {activity.action}
                                {activity.target && (
                                    <span className="font-medium text-brand-primary ml-1 truncate block sm:inline">
                                        {activity.target}
                                    </span>
                                )}
                            </p>
                            <span className="text-xs text-text-tertiary mt-1">
                                {formatDistanceToNow(activity.time, { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
