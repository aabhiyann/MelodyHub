/**
 * ChatSidebar - Friends activity sidebar
 * 320px desktop, full-screen mobile, collapsible with animation
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserListItem } from './UserListItem';
import { useChatStore } from '@/stores/ChatStore';
import { cn } from '@/lib/utils';

export const ChatSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { onlineUsers, selectedUserId, selectUser } = useChatStore();

    const onlineCount = onlineUsers.filter((u) => u.status === 'online').length;

    return (
        <AnimatePresence>
            <motion.aside
                initial={false}
                animate={{
                    width: isCollapsed ? 60 : 320,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={cn(
                    'h-full glass border-l border-border flex flex-col',
                    'md:relative fixed right-0 top-0 z-50'
                )}
            >
                {/* Header */}
                <div className='p-4 border-b border-border flex items-center justify-between'>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='flex items-center gap-2'
                        >
                            <Users className='size-5 text-brand-primary' />
                            <div>
                                <h3 className='text-heading-sm font-semibold text-text-primary'>
                                    Friends Activity
                                </h3>
                                <p className='text-body-xs text-text-tertiary'>
                                    {onlineCount} online
                                </p>
                            </div>
                        </motion.div>
                    )}

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            'p-2 hover:bg-surface-raised rounded-lg transition-all',
                            isCollapsed && 'mx-auto'
                        )}
                    >
                        <ChevronRight
                            className={cn(
                                'size-5 text-text-secondary transition-transform',
                                isCollapsed && 'rotate-180'
                            )}
                        />
                    </button>
                </div>

                {/* User List */}
                {!isCollapsed && (
                    <ScrollArea className='flex-1 p-2'>
                        <div className='space-y-1'>
                            {onlineUsers.length > 0 ? (
                                onlineUsers.map((user) => (
                                    <UserListItem
                                        key={user.id}
                                        user={user}
                                        isSelected={selectedUserId === user.id}
                                        onClick={() => selectUser(user.id)}
                                    />
                                ))
                            ) : (
                                <div className='text-center py-8 text-text-tertiary'>
                                    <Users className='size-12 mx-auto mb-2 opacity-50' />
                                    <p className='text-body-sm'>No friends online</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                )}

                {/* Collapsed state - show online count */}
                {isCollapsed && (
                    <div className='flex-1 flex items-center justify-center'>
                        <div className='relative'>
                            <Users className='size-6 text-text-secondary' />
                            {onlineCount > 0 && (
                                <div className='absolute -top-1 -right-1 size-4 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center'>
                                    {onlineCount}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </motion.aside>
        </AnimatePresence>
    );
};
