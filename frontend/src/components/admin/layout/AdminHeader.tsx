import { Search, Plus, Bell, ChevronDown, Menu } from 'lucide-react';
import { useAuthStore } from '@/stores/AuthStore';

interface AdminHeaderProps {
    onOpenSidebar: () => void;
}

export const AdminHeader = ({ onOpenSidebar }: AdminHeaderProps) => {
    const { authUser } = useAuthStore();

    return (
        <header className="sticky top-0 z-40 h-[64px] bg-white dark:bg-surface-base border-b border-border-subtle px-4 lg:px-8 flex items-center justify-between gap-4">

            {/* Mobile Menu Button */}
            <button
                onClick={onOpenSidebar}
                className="lg:hidden p-2 -ml-2 hover:bg-surface-glass rounded-lg text-text-tertiary"
            >
                <Menu size={24} />
            </button>

            {/* Left: Search (Hidden on very small screens or adaptable) */}
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative w-full max-w-md group hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="search"
                        placeholder="Search..."
                        className="w-full h-10 pl-10 pr-4 bg-surface-glass border border-transparent focus:bg-surface-elevated focus:border-brand-primary/50 rounded-lg text-sm outline-none transition-all"
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex h-5 items-center gap-1 rounded border border-border-medium bg-surface-glass px-1.5 font-mono text-[10px] font-medium text-text-tertiary">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <button className="flex items-center justify-center size-10 rounded-lg hover:bg-surface-glass text-text-tertiary transition-colors">
                    <Plus size={20} />
                </button>

                <button className="relative flex items-center justify-center size-10 rounded-lg hover:bg-surface-glass text-text-tertiary transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950" />
                </button>

                <div className="w-px h-6 bg-border-medium mx-2 hidden sm:block" />

                <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-surface-glass transition-colors">
                    <img
                        src={authUser?.imageUrl || "https://github.com/shadcn.png"}
                        alt="User"
                        className="size-8 rounded-full bg-surface-elevated object-cover"
                    />
                    <ChevronDown size={14} className="text-text-tertiary hidden sm:block" />
                </button>
            </div>
        </header>
    );
};
