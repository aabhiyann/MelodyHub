import { useState } from 'react';
import { useUIStore } from '@/stores/UIStore';
import { FriendsActivity } from '@/components/features/social/FriendsActivity';
import { ActivityFeed } from '@/components/home/ActivityFeed';

export const RightSidebar = () => {
    const { isActivityPanelOpen } = useUIStore();
    const [activeTab, setActiveTab] = useState<'community' | 'activity'>('community');

    if (!isActivityPanelOpen) return null;

    return (
        <aside className="hidden xl:flex flex-col w-[280px] shrink-0 border-l border-white/5 bg-black/20 backdrop-blur-xl z-30 h-full">
            <div className="flex p-2 gap-2 border-b border-white/5">
                <button
                    onClick={() => setActiveTab('community')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        activeTab === 'community' 
                            ? 'bg-white/10 text-white' 
                            : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}
                >
                    Online
                </button>
                <button
                    onClick={() => setActiveTab('activity')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        activeTab === 'activity' 
                            ? 'bg-white/10 text-white' 
                            : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}
                >
                    Activity
                </button>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'community' ? (
                    <div className="absolute inset-0 [&>div]:border-none">
                        <FriendsActivity />
                    </div>
                ) : (
                    <div className="absolute inset-0 [&>div]:border-none [&>div]:!w-full [&>div]:!lg:w-full [&>div]:!xl:w-full">
                        <ActivityFeed />
                    </div>
                )}
            </div>
        </aside>
    );
};
