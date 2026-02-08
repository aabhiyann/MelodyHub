/**
 * SwipeableItem - Swipeable list item with actions
 * Swipe left to reveal actions (delete, add to playlist)
 */

import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion } from 'framer-motion';
import { Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeAction {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    color: 'red' | 'green' | 'blue';
}

interface SwipeableItemProps {
    children: React.ReactNode;
    actions?: SwipeAction[];
    onSwipe?: (direction: 'left' | 'right') => void;
}

const defaultActions: SwipeAction[] = [
    {
        label: 'Delete',
        icon: Trash2,
        onClick: () => { },// console.log('Delete'),
        color: 'red',
    },
    {
        label: 'Add',
        icon: Plus,
        onClick: () => console.log('Add'),
        color: 'green',
    },
];

export const SwipeableItem = ({
    children,
    actions = defaultActions,
    onSwipe,
}: SwipeableItemProps) => {
    const [offset, setOffset] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);

    const actionWidth = 80; // Width per action
    const maxOffset = actions.length * actionWidth;

    const handlers = useSwipeable({
        onSwiping: (eventData) => {
            setIsSwiping(true);
            const deltaX = eventData.deltaX;

            // Only allow left swipe
            if (deltaX < 0) {
                const newOffset = Math.max(-maxOffset, deltaX);
                setOffset(newOffset);
            }
        },
        onSwiped: (eventData) => {
            setIsSwiping(false);
            const threshold = -40;

            if (eventData.deltaX < threshold) {
                // Snap to show actions
                setOffset(-maxOffset);
                onSwipe?.('left');
            } else {
                // Snap back
                setOffset(0);
            }
        },
        trackMouse: true,
        trackTouch: true,
    });

    const handleActionClick = (action: SwipeAction) => {
        action.onClick();
        // Close after action
        setOffset(0);
    };

    const getActionColor = (color: SwipeAction['color']) => {
        switch (color) {
            case 'red':
                return 'bg-red-500 hover:bg-red-600';
            case 'green':
                return 'bg-green-500 hover:bg-green-600';
            case 'blue':
                return 'bg-blue-500 hover:bg-blue-600';
        }
    };

    return (
        <div className="relative overflow-hidden">
            {/* Actions (behind) */}
            <div className="absolute right-0 top-0 bottom-0 flex">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => handleActionClick(action)}
                        className={cn(
                            'flex flex-col items-center justify-center',
                            'text-white font-semibold',
                            'transition-colors',
                            getActionColor(action.color)
                        )}
                        style={{ width: `${actionWidth}px` }}
                    >
                        <action.icon className="size-6 mb-1" />
                        <span className="text-xs">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Main content (sliding) */}
            <motion.div
                {...handlers}
                animate={{ x: offset }}
                transition={{
                    type: isSwiping ? 'tween' : 'spring',
                    stiffness: 300,
                    damping: 30,
                }}
                className="relative bg-zinc-900 touch-pan-y"
            >
                {children}
            </motion.div>
        </div>
    );
};
