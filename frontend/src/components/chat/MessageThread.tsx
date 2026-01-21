/**
 * MessageThread - Scrollable message container
 * Features: Auto-scroll on new message, smooth animations
 */

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { useChatStore } from '@/stores/ChatStore';
import { useUser } from '@clerk/clerk-react';

export const MessageThread = () => {
    const { user } = useUser();
    const { messages, typingUsers } = useChatStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, typingUsers]);

    return (
        <ScrollArea className='flex-1 p-4' ref={scrollRef}>
            <div className='space-y-1 max-w-4xl mx-auto'>
                {messages.length === 0 ? (
                    <div className='flex items-center justify-center h-full text-text-tertiary'>
                        <div className='text-center'>
                            <p className='text-body-lg'>No messages yet</p>
                            <p className='text-body-sm mt-1'>
                                Start a conversation with your friends!
                            </p>
                        </div>
                    </div>
                ) : (
                    messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isOwn={message.senderId === user?.id}
                        />
                    ))
                )}

                {/* Typing indicators */}
                {typingUsers.map((typingUser) => (
                    <TypingIndicator key={typingUser.id} userName={typingUser.name} />
                ))}

                {/* Scroll anchor */}
                <div ref={bottomRef} />
            </div>
        </ScrollArea>
    );
};
