/**
 * UserListItem - Individual user in friends list
 * Shows avatar, name, online status, and listening activity
 */

import { motion } from 'framer-motion';
import { Music2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OnlineUser } from '@/stores/ChatStore';

interface UserListItemProps {
    user: OnlineUser;
    isSelected: boolean;
    onClick: () => void;
}

export const UserListItem = ({ user, isSelected, onClick }: UserListItemProps) => {
    return (
        <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                'w-full p-3 rounded-lg transition-all text-left',
                'hover:bg-surface-raised cursor-pointer',
                isSelected && 'bg-surface-raised border-l-2 border-brand-primary'
            )}
        >
            <div className='flex items-center gap-3'>
                {/* Avatar with online indicator */}
                <div className='relative flex-shrink-0'>
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className='size-10 rounded-full object-cover ring-2 ring-border'
                    />
                    {user.status === 'online' && (
                        <div className='absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-success ring-2 ring-background animate-pulse-subtle' />
                    )}
                </div>

                {/* User info */}
                <div className='flex-1 min-w-0'>
                    <p className='text-body-md font-semibold text-text-primary truncate'>
                        {user.name}
                    </p>
                    {user.status === 'online' && user.listeningTo ? (
                        <div className='flex items-center gap-1 text-body-sm text-text-secondary truncate'>
                            <Music2 className='size-3 flex-shrink-0' />
                            <span className='truncate'>{user.listeningTo}</span>
                        </div>
                    ) : (
                        <p className='text-body-sm text-text-tertiary'>
                            {user.status === 'online' ? 'Online' : 'Offline'}
                        </p>
                    )}
                </div>
            </div>
        </motion.button>
    );
};
