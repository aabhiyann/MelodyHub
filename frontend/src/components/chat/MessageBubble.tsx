/**
 * MessageBubble - Chat message component
 * iMessage-style bubbles with sent/received variants
 */

import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/stores/ChatStore';

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
}

export const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const getStatusIcon = () => {
        if (message.status === 'read') {
            return <CheckCheck className='size-3 text-brand-primary' />;
        }
        if (message.status === 'delivered') {
            return <CheckCheck className='size-3 text-text-tertiary' />;
        }
        if (message.status === 'sent') {
            return <Check className='size-3 text-text-tertiary' />;
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={cn(
                'flex gap-2 mb-2',
                isOwn ? 'flex-row-reverse' : 'flex-row'
            )}
        >
            {/* Avatar (only for received messages) */}
            {!isOwn && (
                <img
                    src={message.senderAvatar}
                    alt={message.senderName}
                    className='size-8 rounded-full ring-2 ring-border flex-shrink-0'
                />
            )}

            <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
                {/* Message bubble */}
                <div
                    className={cn(
                        'px-4 py-3 rounded-2xl max-w-[70%] break-words',
                        isOwn
                            ? 'bg-brand-primary text-white rounded-br-md'
                            : 'bg-surface-raised text-text-primary rounded-bl-md'
                    )}
                >
                    <p className='text-body-md leading-relaxed'>{message.content}</p>
                </div>

                {/* Timestamp and status */}
                <div className='flex items-center gap-1 mt-1 px-1'>
                    <span className='text-[11px] text-text-tertiary'>
                        {formatTime(message.timestamp)}
                    </span>
                    {isOwn && getStatusIcon()}
                </div>
            </div>
        </motion.div>
    );
};
