/**
 * MessageInput - Auto-expanding message input with send button
 * Features: Auto-expand up to 5 lines, glass effect, conditional send button
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
    onSend: (message: string) => void;
    onTyping?: (isTyping: boolean) => void;
    disabled?: boolean;
}

export const MessageInput = ({ onSend, onTyping, disabled }: MessageInputProps) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            const maxHeight = 24 * 5; // 5 lines max
            textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        }
    }, [message]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);

        // Typing indicator with debounce
        if (onTyping) {
            onTyping(true);
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                onTyping(false);
            }, 1000);
        }
    };

    const handleSend = () => {
        if (message.trim() && !disabled) {
            onSend(message.trim());
            setMessage('');
            if (onTyping) onTyping(false);
            clearTimeout(typingTimeoutRef.current);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className='p-4 border-t border-border glass'>
            <div className='flex items-end gap-2'>
                {/* Emoji picker button */}
                <button
                    className='p-2 hover:bg-surface-raised rounded-lg transition-colors text-text-secondary hover:text-text-primary'
                    title='Add emoji'
                >
                    <Smile className='size-5' />
                </button>

                {/* Text input */}
                <div className='flex-1 relative glass-strong rounded-2xl border border-border focus-within:border-brand-primary transition-colors'>
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder='Type a message...'
                        disabled={disabled}
                        className='w-full px-4 py-3 bg-transparent text-text-primary placeholder-text-tertiary resize-none outline-none text-body-md leading-relaxed max-h-[120px]'
                        rows={1}
                    />
                </div>

                {/* File attachment button */}
                <button
                    className='p-2 hover:bg-surface-raised rounded-lg transition-colors text-text-secondary hover:text-text-primary'
                    title='Attach file'
                >
                    <Paperclip className='size-5' />
                </button>

                {/* Send button (appears when text present) */}
                {message.trim() && (
                    <button
                        onClick={handleSend}
                        disabled={disabled}
                        className={cn(
                            'p-2.5 rounded-full bg-brand-primary hover:bg-brand-secondary transition-all',
                            'hover:scale-110 active:scale-95',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                        title='Send message'
                    >
                        <Send className='size-5 text-white' />
                    </button>
                )}
            </div>
        </div>
    );
};
