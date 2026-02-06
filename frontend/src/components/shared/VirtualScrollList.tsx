/**
 * Virtual scrolling component for large lists
 * Uses react-window for performance optimization
 */

import { List } from 'react-window';
import { Song } from '@/types';

interface VirtualScrollListProps {
    items: Song[];
    height: number;
    itemHeight: number;
    renderItem: (item: Song, index: number) => React.ReactNode;
    className?: string;
}

export const VirtualScrollList = ({
    items,
    height,
    itemHeight,
    renderItem,
    className,
}: VirtualScrollListProps) => {
    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
        <div style={style}>{renderItem(items[index], index)}</div>
    );

    return (
        <List
            className={className}
            height={height}
            itemCount={items.length}
            itemSize={itemHeight}
            width="100%"
        >
            {Row}
        </List>
    );
};
