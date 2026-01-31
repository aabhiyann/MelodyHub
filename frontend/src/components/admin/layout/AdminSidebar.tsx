import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BarChart3,
    Music,
    Disc,
    Users,
    ListMusic,
    Tag,
    UserCheck,
    Flag,
    Settings,
    Key,
    Bell,
    Menu,
    ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    {
        section: "Overview",
        items: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/admin", end: true },
            { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
        ],
    },
    {
        section: "Content",
        items: [
            { icon: Music, label: "Songs", path: "/admin/songs", badge: "1.2k" },
            { icon: Disc, label: "Albums", path: "/admin/albums" },
            { icon: Users, label: "Artists", path: "/admin/artists" },
            { icon: ListMusic, label: "Playlists", path: "/admin/playlists" },
            { icon: Tag, label: "Genres", path: "/admin/genres" },
        ],
    },
    {
        section: "Users",
        items: [
            { icon: Users, label: "All Users", path: "/admin/users" },
            { icon: UserCheck, label: "Admins", path: "/admin/admins" },
            { icon: Flag, label: "Reports", path: "/admin/reports", badge: "3" },
        ],
    },
    {
        section: "Settings",
        items: [
            { icon: Settings, label: "Settings", path: "/admin/settings" },
            { icon: Key, label: "API Keys", path: "/admin/api-keys" },
            { icon: Bell, label: "Notifications", path: "/admin/notifications" },
        ],
    },
];

export const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-white/5 z-[100] transition-all duration-300 ease-in-out flex flex-col",
                collapsed ? "w-[72px]" : "w-[260px]"
            )}
        >
            {/* Header */}
            <div className="h-[64px] flex items-center justify-between px-5 border-b border-zinc-200 dark:border-white/5 shrink-0">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shrink-0">
                        <span className="font-bold text-white text-lg">M</span>
                    </div>
                    {!collapsed && (
                        <span className="font-bold text-lg tracking-tight whitespace-nowrap">Admin</span>
                    )}
                </div>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-500 transition-colors"
                >
                    {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-white/10">
                {navItems.map((section, idx) => (
                    <div key={section.section} className="space-y-1">
                        {!collapsed && (
                            <h4 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                                {section.section}
                            </h4>
                        )}
                        {section.items.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                                    isActive
                                        ? "bg-brand-primary/10 text-brand-primary"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                                )}
                            >
                                <item.icon size={20} className="shrink-0" />

                                {!collapsed ? (
                                    <>
                                        <span className="flex-1 truncate">{item.label}</span>
                                        {item.badge && (
                                            <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-primary/10 text-brand-primary rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    // Tooltip for collapsed state would go here
                                    item.badge && (
                                        <div className="absolute top-1 right-1 size-2 rounded-full bg-brand-primary" />
                                    )
                                )}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Footer User Info */}
            <div className="p-4 border-t border-zinc-200 dark:border-white/5 shrink-0">
                <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                    <img
                        src="https://github.com/shadcn.png"
                        alt="Admin"
                        className="size-9 rounded-full bg-zinc-100"
                    />
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Admin User</p>
                            <p className="text-xs text-zinc-500 truncate">admin@melodyhub.com</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};
